<template lang="pug">
  q-page.row.justify-center(padding)
    .col.form-box
      q-card.form-box(bordered)
        q-card-section
          .text-h4.q-mb-md {{ $t('Edit Album') }}
        q-card-section.text-center(v-if="loading")
          q-spinner(size="3em")
        q-card-section(v-if="error")
          q-banner.bg-negative(rounded)
            .text-bold {{ error.errors[0].message }}
        q-card-section(v-if="!loading").q-gutter-sm
          y-album-type(v-model="albumData.type" v-if="canUpdateType")
          y-album-input(v-model="albumData.name" :label="$t('Name')")
          y-album-input(v-model="albumData.slug" :label="$t('Slug')" :updateIcon="true" @clickIcon="updateSlug")
          y-album-input(v-model="albumData.description" :label="$t('Description')" type="textarea")
          y-album-input(v-model="albumData.summary" :label="$t('Summary')" type="textarea")
          y-album-select-order-by(v-model="albumData.orderBy" :albumType="albumData.type")
          y-album-select-order-direction(v-model="albumData.orderDirection")
          y-album-select-visibility(v-model="albumData.visibility")
          y-album-select-status(v-model="albumData.status")
          y-album-date-time(v-model="albumData.createdAt" :label="$t('createdAt')")
          y-album-date-time(v-model="albumData.publishedAt" :label="$t('publishedAt')")
        q-card-actions(v-if="!loading" align="right")
          q-btn.q-px-md(:label="$t('Cancel')" color="secondary" text-color="black" :to="{name:'album', params: {id: this.activeAlbum.id}}")
          q-btn.q-px-md(:label="$t('Update')" color="primary" text-color="black" @click="updateAlbum" :disabled="canUpdate")
</template>

<script>
import { updateAlbum } from 'src/graphql/queryAlbum'
import YAlbumForm from 'components/albums'
import { date } from 'quasar'
import AlbumCounters from 'src/mixins/albumCounters'

const slug = require('slug')
slug.defaults.mode = 'rfc3986'
slug.defaults.modes.rfc3986.lower = true

export default {
  name: 'AlbumEdit',
  data () {
    return {
      albumData: null,
      error: null,
      loading: true
    }
  },
  components: {
    ...YAlbumForm
  },
  mixins: [
    AlbumCounters
  ],
  computed: {
    activeAlbum: {
      get () {
        return this.$store.state.albums.active
      },
      set (val) {
        this.$store.commit('albums/active', val)
      }
    },
    canUpdateType () {
      return (this.activeAlbum.childrenCount === 0 && this.activeAlbum.photosCount === 0)
    },
    canUpdate () {
      return (this.albumData.name.trim() === '')
    }
  },
  methods: {
    updateSlug () {
      this.albumData.slug = slug(this.albumData.name)
    },
    updateAlbum () {
      const input = {
        id: this.activeAlbum.id,
        name: this.albumData.name ? this.albumData.name.trim() : null,
        visibility: this.albumData.visibility,
        slug: this.albumData.slug ? slug(this.albumData.slug) : this.albumData.name ? slug(this.albumData.name) : null,
        type: this.activeAlbum.type,
        status: this.albumData.status,
        orderBy: this.albumData.orderBy,
        orderDirection: this.albumData.orderDirection,
        description: this.albumData.description ? this.albumData.description.trim() : null,
        summary: this.albumData.summary ? this.albumData.summary.trim() : null,
        parentId: this.activeAlbum.parentId,
        createdAt: date.formatDate(this.activeAlbum.createdAt, 'YYYY-MM-DDTHH:mm:ss.SSSZ'),
        publishedAt: date.formatDate(this.activeAlbum.publishedAt, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
      }
      if (this.canUpdateType) {
        input.type = this.albumData.type
      }
      this.loading = true
      this.$Amplify.API.graphql(
        this.$Amplify.graphqlOperation(updateAlbum, { input })
      )
        .then((res) => {
          return this.updateCounters(this.activeAlbum.id)
        })
        .then(res => {
          this.$router.push({ name: 'album' })
        })
        .catch((err) => {
          console.error(err)
          this.error = err
        })
        .finally(() => {
          this.loading = false
        })
    },
    setFields () {
      if (!this.activeAlbum) {
        this.$router.push({ name: 'album' })
      }
      this.albumData = { ...this.activeAlbum }
      this.loading = false
    }
  },
  created () {
    this.setFields()
  },
  beforeRouteUpdate (to, from, next) {
    this.setFields()
    next()
  }
}
</script>

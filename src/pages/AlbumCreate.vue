<template lang="pug">
  q-page.row.justify-center(padding)
    .col.form-box
      q-card.form-box(bordered)
        q-card-section
          .text-h4.q-mb-md {{ $t('New Album') }}
        q-card-section.text-center(v-if="loading")
          q-spinner(size="3em")
        q-card-section(v-if="error")
          q-banner.bg-negative(rounded)
            .text-bold {{ error.errors[0].message }}
        q-card-section(v-if="!loading").q-gutter-sm
          y-album-type(v-model="type")
          y-album-input(v-model="name" :label="$t('Name')")
          y-album-input(v-model="description" :label="$t('Description')" type="textarea")
          y-album-select-parent(v-model="parentAlbumId")
          q-expansion-item(
            :label="$t('More Properties')"
            switch-toggle-side
            expand-separator
            header-class = "text-uppercase"
          )
            .q-gutter-md.q-mt-md
              y-album-input(v-model="summary" :label="$t('Summary')" type="textarea")
              y-album-select-visibility(v-model="visibility")
              y-album-select-status(v-model="status")
              y-album-select-order-by(v-model="orderBy" :albumType="type")
              y-album-select-order-direction(v-model="orderDirection" :albumType="type")
        q-card-actions(v-if="!loading" align="right")
          q-btn.q-px-md(v-if="!this.activeAlbum" :label="$t('Cancel')" color="secondary" text-color="black" :to="{name:'home'}")
          q-btn.q-px-md(v-if="this.activeAlbum" :label="$t('Cancel')" color="secondary" text-color="black" :to="{name:'album', params: {id: this.activeAlbum.id}}")
          q-btn.q-px-md(:label="$t('Create')" color="primary" text-color="black" @click="createAlbum" :disable="!canCreate")
</template>

<script>
import { createAlbum } from 'src/graphql/queryAlbum'
import { date, uid } from 'quasar'
import YAlbumForm from 'components/albums'

const slug = require('slug')
slug.defaults.mode = 'rfc3986'
slug.defaults.modes.rfc3986.lower = true
export default {
  name: 'AlbumCreate',
  data () {
    return {
      loading: false,
      error: false,
      name: null,
      description: null,
      parentAlbumId: 'root',
      newAlbumId: uid(),
      visibility: 'public',
      orderBy: 'capturedAt',
      orderDirection: 'asc',
      status: 'published',
      summary: null,
      type: 'album',
      typeOptions: [
        { label: '', value: 'collection', slot: 'collection' },
        { label: '', value: 'album', slot: 'album' }
      ],
      model: null
    }
  },
  components: {
    ...YAlbumForm
  },
  created () {
    if (this.hasRoot === false) {
      this.createRoot()
    }
    if (this.activeAlbum && this.activeAlbum.id) {
      this.parentAlbumId = this.activeAlbum.id
    }
  },
  watch: {
    type: function (val) {
      if (val === 'collection' && this.orderBy === 'capturedAt') {
        this.orderBy = 'createdAt'
      }
    }
  },
  computed: {
    activeAlbum () {
      return this.$store.state.albums.active
    },
    hasRoot () {
      return this.$store.getters['albums/hasRoot']
    },
    canCreate () {
      if (this.name) {
        return (this.name.trim().length > 0)
      }
      return false
    },
    countSiblings () {
      return this.$store.getters['albums/countSiblings'](this.parentAlbumId)
    }
  },
  methods: {
    createRoot () {
      const input = {
        id: 'root',
        parentId: '-',
        name: this.$t('Albums'),
        visibility: 'public',
        position: 1,
        type: 'collection',
        slug: slug(this.$t('Albums')),
        status: 'published',
        orderBy: 'position',
        orderDirection: 'asc',
        contentCountTotal: 0,
        contentCountPublic: 0
      }
      this.sendQuery(input)
    },
    createAlbum () {
      const description = this.description ? this.description.trim() : null
      const position = this.countSiblings + 1
      const input = {
        id: this.newAlbumId,
        parentId: this.parentAlbumId,
        name: this.name ? this.name.trim() : null,
        visibility: this.visibility,
        position,
        type: this.type,
        slug: this.name ? slug(this.name) : null,
        status: this.status,
        orderBy: this.orderBy,
        orderDirection: this.orderDirection,
        description,
        summary: this.summary ? this.summary.trim() : description,
        contentCountTotal: 0,
        contentCountPublic: 0
      }
      this.sendQuery(input)
    },
    sendQuery (input) {
      const nowStamp = Date.now()
      input.publishedAt = date.formatDate(nowStamp, 'YYYY-MM-DDTHH:mm:ss.SSSZ')

      this.loading = true
      this.$Amplify.API.graphql(
        this.$Amplify.graphqlOperation(createAlbum, { input: input })
      )
        .then(({ data }) => {
          if (data.createAlbum.id !== 'root') {
            this.$router.push({ path: `/album/${data.createAlbum.id}` })
          }
        })
        .catch(err => {
          this.error = err
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

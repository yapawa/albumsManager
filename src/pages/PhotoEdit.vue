<template lang="pug">
  q-page.row.justify-center(padding)
    .col.form-box(v-if="!loading")
      q-card.form-box(bordered)
        q-img(:src="cacheUrl(selectedPhotoDetails, {w:450,h:350,c:'fit'})" style="max-width:450px;max-height:350px" contain)
        q-card-section.q-gutter-sm
          y-album-input-ro(v-model="selectedPhotoDetails.id" label="Id" dense)
          y-album-input-ro(v-model="dimensions" :label="$t('Dimensions')" dense)
          y-album-input-ro(v-model="filesize" :label="$t('Size')" dense)
          y-album-input-ro(v-model="selectedPhotoDetails.filename" :label="$t('Filename')" dense)
          y-album-input(v-model="selectedPhotoDetails.name" :label="$t('Name')" dense)
          y-album-input(v-model="selectedPhotoDetails.slug" :label="$t('Slug')" outlined dense :updateIcon="true" @clickIcon="updateSlug")
          y-album-input(v-model="selectedPhotoDetails.description" :label="$t('Description')" type="textarea" :autogrow="true" dense)
          y-album-select-visibility(v-model="selectedPhotoDetails.visibility" dense)
          y-album-select-status(v-model="selectedPhotoDetails.status" dense)
          y-album-date-time(v-model="selectedPhotoDetails.capturedAt" :label="$t('capturedAt')" dense)
          y-album-date-time(v-model="selectedPhotoDetails.createdAt" :label="$t('createdAt')" dense readonly disable)
          y-album-date-time(v-model="selectedPhotoDetails.publishedAt" :label="$t('publishedAt')" dense readonly disable)
          y-album-date-time(v-model="selectedPhotoDetails.updatedAt" :label="$t('updatedAt')" dense readonly disable)
        q-card-actions(align="right")
          q-btn.q-px-md(:label="$t('Cancel')" color="secondary" text-color="black" :to="{name:'album', params: {id: selectedPhotoDetails.albumId}}")
          q-btn.q-px-md(:label="$t('Update')" color="primary" text-color="black" @click="updatePhoto" :disabled="!canUpdate")
    .col.form-box.text-center(v-else)
      q-spinner(size="3em")
</template>

<script>
import { getPhoto, updatePhoto } from 'src/graphql/queryAlbum'
import YAlbumForm from 'components/albums'
import { date, format } from 'quasar'
const { humanStorageSize } = format
import YThumbnails from 'src/mixins/thumbnails'

const path = require('path')
const slug = require('slug')
slug.defaults.mode = 'rfc3986'
slug.defaults.modes.rfc3986.lower = true

export default {
  name: 'PhotoEdit',
  data () {
    return {
      selectedPhotoDetails: {},
      loading: true
    }
  },
  components: {
    ...YAlbumForm
  },
  mixins: [
    YThumbnails
  ],
  computed: {
    dimensions () {
      const { width, height } = this.selectedPhotoDetails
      const imageRatio = ((width >= height) ? width / height : height / width).toFixed(2)
      const standardRatios = {
        1: '1:1',
        1.25: '5:4',
        1.3333: '4:3',
        1.5: '3:2',
        1.6666: '5:3',
        1.7777: '16:9',
        3: '3:1'
      }
      let ratio = -1
      Object.keys(standardRatios).forEach(val => {
        if (parseFloat(val).toFixed(2) === imageRatio) {
          ratio = val
        }
      })
      let dimensionsString = `${width} x ${height}`
      if (ratio > 0) {
        dimensionsString += ` (${standardRatios[ratio]})`
      }
      return dimensionsString
    },
    filesize () {
      if (!this.selectedPhotoDetails.size) {
        return null
      }
      return humanStorageSize(this.selectedPhotoDetails.size)
    },
    canUpdate () {
      const isEmpty = (!this.selectedPhotoDetails.slug || this.selectedPhotoDetails.slug.trim().length === 0)
      return !isEmpty
    }
  },
  methods: {
    updateSlug () {
      this.selectedPhotoDetails.slug = slug(path.basename(this.selectedPhotoDetails.name, path.extname(this.selectedPhotoDetails.name)))
    },
    fetchPhotoDetails (id) {
      this.$Amplify.API.graphql(
        this.$Amplify.graphqlOperation(getPhoto, { id })
      )
        .then(({ data }) => {
          data.getPhoto.exif = JSON.parse(data.getPhoto.exif)
          data.getPhoto.filename = path.basename(data.getPhoto.file.key)
          this.selectedPhotoDetails = { ...data.getPhoto }
          this.loading = false
        })
    },
    updatePhoto () {
      const input = {
        id: this.selectedPhotoDetails.id,
        name: this.selectedPhotoDetails.name,
        slug: this.selectedPhotoDetails.slug ? slug(this.selectedPhotoDetails.slug) : this.selectedPhotoDetails.name ? slug(this.selectedPhotoDetails.name) : null,
        description: this.selectedPhotoDetails.description,
        visibility: this.selectedPhotoDetails.visibility,
        status: this.selectedPhotoDetails.status,
        capturedAt: date.formatDate(this.selectedPhotoDetails.capturedAt, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
      }
      this.loading = true
      this.$Amplify.API.graphql(
        this.$Amplify.graphqlOperation(updatePhoto, { input })
      )
        .then((res) => {
          this.$router.push({ name: 'album', params: { id: this.selectedPhotoDetails.albumId } })
        })
        .catch((err) => {
          this.error = err
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  created () {
    this.fetchPhotoDetails(this.$route.params.id)
  },
  beforeRouteUpdate (to, from, next) {
    console.log('beforeRouteUpdate')
    console.log(to)
    console.log(from)
    // this.fetchPhotoDetails(this.photoId)
    next()
  }
}
</script>

<template lang="pug">
  q-page.row.justify-center(padding)
    .col.form-box(v-if="!loading")
      q-card.form-box(bordered)
        q-img.justify-center(:src="cacheUrl(selectedPhotoDetails, {w:450,h:350,c:'fit'})" :style="imageStyle" contain @click="imgOriginal=true")
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
    q-dialog(
      v-if="!loading"
      v-model="imgOriginal"
      maximized
      content-class="bg-black"
    )
      div.flex.flex-center
        q-img.justify-center(:src="fullscreenUrl(selectedPhotoDetails)" :style="fullscreenImageStyle(selectedPhotoDetails)" contain v-close-popup)
</template>

<script>
import { getPhoto, updatePhoto } from 'src/graphql/queryAlbum'
import YAlbumForm from 'components/albums'
import { date, format } from 'quasar'
const { humanStorageSize } = format
import YThumbnails from 'src/mixins/thumbnails'
import AlbumCounters from 'src/mixins/albumCounters'

const path = require('path')
const slug = require('slug')
slug.defaults.mode = 'rfc3986'
slug.defaults.modes.rfc3986.lower = true

export default {
  name: 'PhotoEdit',
  data () {
    return {
      selectedPhotoDetails: {},
      loading: true,
      imgOriginal: false
    }
  },
  components: {
    ...YAlbumForm
  },
  mixins: [
    YThumbnails,
    AlbumCounters
  ],
  computed: {
    dimensions () {
      const { width, height } = this.selectedPhotoDetails
      const imageRatio = ((width >= height) ? width / height : height / width).toFixed(1)
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
        if (parseFloat(val).toFixed(1) === imageRatio) {
          ratio = val
        }
      })
      let dimensionsString = `${width} x ${height}`
      if (ratio > 0) {
        dimensionsString += ` (${standardRatios[ratio]})`
      }
      return dimensionsString
    },
    imageStyle () {
      const { width, height } = this.selectedPhotoDetails
      const maxWidth = 450
      const maxHeight = 350
      const newHeight = (width / maxWidth > height / maxHeight) ? Math.round(height / (width / maxWidth)) : maxHeight

      return `max-width: ${maxWidth}px;height: ${newHeight}px;cursor:zoom-in`
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
          return this.updateCounters(this.selectedPhotoDetails.albumId)
        })
        .then((res) => {
          this.$router.push({ name: 'album', params: { id: this.selectedPhotoDetails.albumId } })
        })
        .catch((err) => {
          this.error = err
        })
        .finally(() => {
          this.loading = false
        })
    },
    fullscreenUrl (selectedPhotoDetails) {
      const width = Math.min(this.$q.screen.width, selectedPhotoDetails.width)
      const height = Math.min(this.$q.screen.height, selectedPhotoDetails.height)
      return this.cacheUrl(selectedPhotoDetails, { w: width, h: height, c: 'fit' })
    },
    fullscreenImageStyle (selectedPhotoDetails) {
      const width = Math.min(this.$q.screen.width, selectedPhotoDetails.width)
      const height = Math.min(this.$q.screen.height, selectedPhotoDetails.height)
      return `max-width: ${width}px;height: ${height}px;cursor:zoom-out`
    }
  },
  created () {
    this.fetchPhotoDetails(this.$route.params.id)
  }
}
</script>

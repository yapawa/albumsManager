<template lang="pug">
  q-page.column(padding)
    .text-h6(v-if="activeAlbum") {{ activeAlbum.name }}
    y-uploader.col.fit(
      v-if="ensureCredentials"
      ref="fileUploader"
      :s3Key="getFullKey"
      :metadata="getMetadata"
      :bucket= "bucket"
      :region= "region"
      :credentials="credentials"
      :options="{partSize: 10 * 1024 * 1024, queueSize: 5}"
      :maxConcurrentUploads="5"
      @finish="finish"
      @uploaded="uploaded"
      @added="added"
    )
</template>

<script>
import { uid, date } from 'quasar'
import { createPhoto, updateAlbum } from 'src/graphql/queryAlbum'
import { YUploader } from 'components/uploader'

export default {
  name: 'UploadPhotos',
  data () {
    return {
      credentials: null,
      userInfo: null,
      uploadBatch: null,
      albumId: null,
      position: 1,
      dialogData: null,
      showDialog: false,
      bucket: this.$Amplify.Storage._config.AWSS3.bucket,
      region: this.$Amplify.Storage._config.AWSS3.region
    }
  },
  components: {
    YUploader
  },
  computed: {
    ensureCredentials () {
      return (this.credentials && this.credentials.authenticated && this.credentials.authenticated === true && this.userInfo)
    },
    activeAlbum () {
      return this.$store.state.albums.active
    }
  },
  created () {
    if (!this.activeAlbum) {
      this.$router.replace({ name: 'album' })
      return
    }
    this.albumId = this.$route.params.id
    this.position = this.activeAlbum.photosCount + 1
    this.$Amplify.Auth.currentCredentials()
      .then(credentials => {
        this.credentials = this.$Amplify.Auth.essentialCredentials(credentials)
      })
      .catch(err => { // eslint-disable-line handle-callback-err
        console.error(err)
        this.credentials = null
      })
    this.$Amplify.Auth.currentUserInfo().then(userInfo => {
      this.userInfo = userInfo
    })
    this.uploadBatch = uid()
  },
  methods: {
    finish () {
      this.updateCovers().then(data => {
        this.$router.push({ name: 'album' })
      })
    },
    updateCovers () {
      const covers = this.activeAlbum.covers || []
      const coversToAdd = this.$refs.fileUploader.files.slice(0, (4 - covers.length)).map(f => {
        return {
          id: f.__id,
          contentType: f.type,
          key: this.getKey(f),
          width: f.__width,
          height: f.__height,
          updatedAt: f.__updatedAt
        }
      })
      const newCovers = [...covers, ...coversToAdd]
      const input = {
        id: this.albumId,
        covers: JSON.stringify(newCovers)
      }
      return this.$Amplify.API.graphql(
        this.$Amplify.graphqlOperation(updateAlbum, { input })
      )
    },
    uploaded ({ file }) {
      const nowStamp = Date.now()
      let capturedAt = date.formatDate(file.lastModified, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
      if (file.__exif) {
        if (file.__exif.DateTimeOriginal) {
          capturedAt = date.formatDate(file.__exif.DateTimeOriginal, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
        }
        if (file.__exif.DateTimeDigitized) {
          capturedAt = date.formatDate(file.__exif.DateTimeDigitized, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
        }
      }
      file.__updatedAt = date.formatDate(nowStamp, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
      const input = {
        id: file.__id,
        albumId: this.albumId,
        position: file.__position,
        file: {
          bucket: this.bucket,
          key: this.getKey(file),
          region: this.region
        },
        width: file.__width,
        height: file.__height,
        contentType: file.type,
        name: file.name,
        visibility: 'public',
        status: 'published',
        capturedAt,
        publishedAt: file.__updatedAt,
        exif: JSON.stringify(file.__exif)
      }
      this.$Amplify.API.graphql(
        this.$Amplify.graphqlOperation(createPhoto, { input })
      )
    },
    added (files) {
      for (let i = 0; i < files.length; i++) {
        const photoId = uid()
        files[i].__position = this.position
        files[i].__id = photoId
        this.position++
      }
    },
    getKey (file) {
      return `${this.albumId}/${file.__id}/${file.name}`
    },
    getFullKey (file) {
      return `public/${this.getKey(file)}`
    },
    getMetadata (file) {
      return {
        owner: this.userInfo.username,
        filename: file.name,
        modifiedAt: file.lastModified.toString(),
        uploadedAt: Date.now().toString(),
        uploadBatch: this.uploadBatch,
        albumId: this.albumId,
        photoId: file.__id,
        orientation: file.__orientation.toString(),
        width: file.__width.toString(),
        height: file.__height.toString()
      }
    }
  }
}
</script>
<style lang="sass">
.q-linear-progress
  &.border-primary
    border-style: solid
    border-width: 1px
    border-color: $grey-8
.q-img__content
  > div
    &.q-pa-none
      padding: 0
    &.q-px-none
      padding-left: 0
      padding-right: 0
    &.q-py-none
      padding-top: 0
      padding-bottom: 0
    &.q-px-xs
      padding-right: 4px
      padding-left: 4px
</style>

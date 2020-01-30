<template lang="pug">
  q-page.column(padding)
    .text-h6 {{ activeAlbum.name }}
    q-uploader.col.fit(
      ref="fileUploader"
      :url="getUrl"
      :headers="getHeaders"
      send-raw
      dark
      multiple
      square
      flat
      bordered
      method="put"
      accept="image/*"
      color="grey-3"
      text-color="grey-10"
      @finish="finish"
      @uploaded="uploaded"
      @added="added"
      v-if="ensureCredentials"
    )
      template(v-slot:header="scope")
        .row.no-wrap.items-center.q-pa-sm.q-gutter-xs
          q-btn(v-if="scope.queuedFiles.length > 0" icon="clear_all" @click="scope.removeQueuedFiles" round dense flat)
            q-tooltip {{ $t('Clear All') }}
          q-btn(v-if="scope.uploadedFiles.length > 0" icon="done_all" @click="scope.removeUploadedFiles" round dense flat)
            q-tooltip {{ $t('Remove Uploaded Files') }}
          q-spinner(v-if="scope.isUploading" class="q-uploader__spinner")
          .col(v-if="scope.files.length > 0")
            .q-uploader__subtitle {{ scope.uploadedFiles.length }} {{ $t('files uploaded out of') }} {{ scope.files.length }}
          .col(v-else)
            .q-uploader__title {{ $t('Upload your files') }}
          q-btn(v-if="scope.canAddFiles" type="a" icon="add_to_photos" round dense flat)
            q-uploader-add-trigger
            q-tooltip {{ $t('Pick Files') }}
          q-btn(v-if="scope.canUpload" icon="cloud_upload" @click="scope.upload" round dense flat)
            q-tooltip {{ $t('Upload Files') }}
          q-btn(v-if="scope.isUploading" icon="clear" @click="scope.abort" round dense flat)
            q-tooltip {{ $t('Abort Upload') }}
        q-linear-progress.q-mt-none(:value="scope.uploadProgress" size="20px" track-color="grey-8")
          .absolute-full.flex.flex-center
            q-badge(color="grey-3" text-color="black" :label="`${scope.uploadedSizeLabel} / ${scope.uploadSizeLabel} (${scope.uploadProgressLabel})`")

      template(v-slot:list="scope")
        .row.q-gutter-sm(v-if="scope.files.length>0")
          q-card.col-auto(v-for="file in scope.files" :key="file.__id" :class="file.__uploaded ? '' : ''" flat)
            q-img(:src="file.__img.src" :ratio="1" style="width:120px;height:120px;")
              .absolute-full.flex.flex-center.transparent.q-pa-none
                q-linear-progress.q-ma-none(rounded :value="file.__progress" size="20px" track-color="grey-2")
              q-btn.float-right(fab dense flat icon="clear" @click="scope.removeFile(file)" size="8px")
        .column.fit.justify-center.items-center(v-else @click="pickFiles")
          .col
            q-icon.self-center(size="184px" name="cloud_upload" color="grey-6")
          .col.text-h5.text-grey-6 {{ $t('Drop Images Here') }}
</template>

<script>
import * as S3 from 'aws-sdk/clients/s3'
import { uid, date } from 'quasar'
import { createPhoto } from 'src/graphql/queryAlbum'
import { getOrientationData } from 'src/lib/imageOrientation'
import { parseExif } from 'src/lib/exif'

export default {
  name: 'UploadPhotos',
  data () {
    return {
      credentials: null,
      s3: null,
      userInfo: null,
      uploadBatch: null,
      albumId: null,
      position: 1,
      dialogData: null,
      showDialog: false
    }
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
    }
    this.albumId = this.$route.params.id
    this.position = this.activeAlbum.photosCount + 1
    this.$Amplify.Auth.currentCredentials()
      .then(credentials => {
        this.credentials = this.$Amplify.Auth.essentialCredentials(credentials)
        this.s3 = this._createS3()
      })
      .catch(err => { // eslint-disable-line handle-callback-err
        console.error(err)
        this.credentials = null
        this.s3 = null
      })
    this.$Amplify.Auth.currentUserInfo().then(userInfo => {
      this.userInfo = userInfo
    })
    this.uploadBatch = uid()
  },
  methods: {
    pickFiles () {
      this.$refs.fileUploader.pickFiles()
    },
    finish () {
      this.$router.push({ name: 'album' })
    },
    uploaded (info) {
      info.files.forEach(file => {
        parseExif(file.__img.originalSrc).then(exif => {
          const nowStamp = Date.now()
          let capturedAt = date.formatDate(file.lastModified, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
          if (exif) {
            if (exif.DateTimeOriginal) {
              capturedAt = date.formatDate(exif.DateTimeOriginal, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
            }
            if (exif.DateTimeDigitized) {
              capturedAt = date.formatDate(exif.DateTimeDigitized, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
            }
          }
          const input = {
            id: file.__S3Metadata.photoId,
            albumId: file.__S3Metadata.albumId,
            position: file.__position,
            file: {
              bucket: file.__storage.bucket,
              key: file.__storage.key,
              region: file.__storage.region
            },
            width: file.__width,
            height: file.__height,
            contentType: file.type,
            name: file.name,
            visibility: 'public',
            status: 'published',
            capturedAt,
            publishedAt: date.formatDate(nowStamp, 'YYYY-MM-DDTHH:mm:ss.SSSZ'),
            exif: JSON.stringify(exif)
          }
          this.$Amplify.API.graphql(
            this.$Amplify.graphqlOperation(createPhoto, { input })
          )
        })
      })
    },
    added (files) {
      for (let i = 0; i < files.length; i++) {
        const photoId = uid()
        files[i].__position = this.position
        files[i].__id = photoId
        this.position++

        const orientationData = getOrientationData(files[i].__img, 200)
        files[i].__img.originalSrc = files[i].__img.src
        files[i].__img.src = orientationData.src
        files[i].__width = orientationData.imageWidth
        files[i].__height = orientationData.imageHeight
        files[i].__orientation = orientationData.orientation || 1
        const Metadata = {
          owner: this.userInfo.username,
          filename: files[i].name,
          modifiedAt: files[i].lastModified.toString(),
          uploadedAt: Date.now().toString(),
          uploadBatch: this.uploadBatch,
          albumId: this.albumId,
          photoId,
          orientation: files[i].__orientation.toString(),
          width: files[i].__width.toString(),
          height: files[i].__height.toString()
        }
        files[i].__S3Metadata = Metadata
        const key = `${this.albumId}/${photoId}/${files[i].name}`
        files[i].__storage = {
          key,
          bucket: this.$Amplify.Storage._config.AWSS3.bucket,
          region: this.$Amplify.Storage._config.AWSS3.region
        }
        const params = { Key: `public/${key}`, Expires: 3600, ContentType: files[i].type, Metadata }
        files[i].__uploadUrl = this.s3.getSignedUrl('putObject', params)
      }
    },
    getUrl (files) {
      return files[0].__uploadUrl
    },
    getHeaders (files) {
      return [{ name: 'Content-Type', value: files[0].type }]
    },
    _createS3 () {
      const {
        bucket,
        region
      } = this.$Amplify.Storage._config.AWSS3

      return new S3({
        apiVersion: '2006-03-01',
        params: { Bucket: bucket },
        signatureVersion: 'v4',
        region,
        credentials: this.credentials,
        useAccelerateEndpoint: false
      })
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

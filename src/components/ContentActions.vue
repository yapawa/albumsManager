<template lang="pug">
  div
    .q-gutter-xs.row.items-center.no-wrap
      q-btn.q-ml-sm(
        v-if="canDeleteAlbum"
        color="negative"
        text-color="white"
        no-caps
        dense
        no-wrap
        :class="$q.screen.gt.xs ? 'q-pr-xs' : ''"
        :label="$q.screen.gt.xs ? $t('Delete Album') : ''"
        icon="delete"
        @click="showDeleteAlbum = true"
      )
      q-btn.q-ml-sm(
        v-if="canEditAlbum"
        color="white"
        text-color="black"
        no-caps
        dense
        no-wrap
        :class="$q.screen.gt.xs ? 'q-pr-xs' : ''"
        :label="$q.screen.gt.xs ? $t('Edit Album') : ''"
        icon="edit"
        :to="{name: 'AlbumEdit'}"
      )
      q-btn.q-ml-sm(
        v-if="canAddAlbum"
        color="white"
        text-color="black"
        no-caps
        dense
        no-wrap
        :class="$q.screen.gt.xs ? 'q-pr-xs' : ''"
        :label="$q.screen.gt.xs ? $t('New Album') : ''"
        icon="add_photo_alternate"
        :to="{name: 'AlbumCreate'}"
      )
      q-btn.q-ml-sm(
        v-if="canAddPhotos"
        color="grey-3"
        text-color="grey-10"
        no-caps
        dense
        no-wrap
        :class="$q.screen.gt.xs ? 'q-pr-xs' : ''"
        :label="$q.screen.gt.xs ? $t('Add Photos') : ''"
        icon="add_to_photos"
        :to="{name: 'Upload'}"
        :disabled="alreadyUploading"
      )
      q-btn.q-ml-sm(
        v-if="hasUpdate"
        :loading="isPublishing"
        color="primary"
        text-color="grey-10"
        no-caps
        dense
        no-wrap
        :class="$q.screen.gt.xs ? 'q-pr-xs' : ''"
        :label="$q.screen.gt.xs ? $t('Publish Site') : ''"
        icon="cloud_upload"
        @click="publish"
      )
    q-dialog(v-model="showDeleteAlbum" persistent)
      q-card(style="min-width:380px")
        q-card-section.row.items-center
          q-avatar(icon="warning" size="80px" font-size="50px" color="negative" text-color="white")
          span.q-ml-sm.text-h5.text-negative.text-weight-bolder {{ $t('Confirm Deletion') }}
        q-card-section.row.items-center(v-if="activeAlbum && activeAlbum.type==='album' && activeAlbum.photosCount>0")
          .text-center.text-subtitle1.full-width.text-warning {{ $t('All Pictures will be Lost') }}
        q-card-actions(align="right")
          q-btn(flat :label="$t('Cancel')" color="white" v-close-popup)
          q-btn(flat :label="$t('Delete')" color="negative" @click="deleteAlbum")
</template>

<script>
import deleteAlbumMixin from 'src/mixins/deleteAlbum'
import publishMixin from 'src/mixins/publish'

export default {
  name: 'ContentActions',
  data () {
    return {
      showDeleteAlbum: false
    }
  },
  mixins: [
    deleteAlbumMixin,
    publishMixin
  ],
  methods: {
    deleteAlbum () {
      return this.deleteAlbumAndPhotos(this.activeAlbum.id, this.activeAlbum.parentId).then(res => {
        this.showDeleteAlbum = false
        this.$router.push({ name: 'album', params: { id: this.activeAlbum.parentId } })
      })
    }
  },
  computed: {
    activeAlbum () {
      return this.$store.state.albums.active
    },
    canAddAlbum () {
      return this.$store.getters['albums/canAddAlbum']
    },
    canEditAlbum () {
      return this.$store.getters['albums/canEditAlbum']
    },
    canDeleteAlbum () {
      return this.$store.getters['albums/canDeleteAlbum']
    },
    canAddPhotos () {
      return this.$store.getters['albums/canAddPhotos']
    },
    alreadyUploading () {
      return this.$route.name === 'Upload'
    },
    hasUpdate () {
      return this.$store.getters['ui/hasUpdate']
    }
  }
}
</script>

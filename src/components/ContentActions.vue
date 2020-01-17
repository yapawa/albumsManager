<template lang="pug">
  .q-gutter-xs.row.items-center.no-wrap
    q-btn.q-px-md.q-ml-sm(
      v-if="canEditAlbum"
      color="white"
      text-color="black"
      no-caps
      dense
      no-wrap
      :label="$q.screen.gt.xs ? $t('Edit Album') : ''"
      icon="edit"
      :to="{name: 'AlbumEdit'}"
    )
    q-btn.q-px-md.q-ml-sm(
      v-if="canAddAlbum"
      color="white"
      text-color="black"
      no-caps
      dense
      no-wrap
      :label="$q.screen.gt.xs ? $t('New Album') : ''"
      icon="add_photo_alternate"
      :to="{name: 'AlbumCreate'}"
    )
    q-btn.q-px-md.q-ml-sm(
      v-if="canAddPhotos"
      color="grey-3"
      text-color="grey-10"
      no-caps
      dense
      no-wrap
      :label="$q.screen.gt.xs ? $t('Add Photos') : ''"
      icon="add_to_photos"
      @click="addPhotos"
    )
</template>

<script>
export default {
  name: 'ContentActions',
  computed: {
    canAddAlbum () {
      return this.$store.getters['albums/canAddAlbum']
    },
    canEditAlbum () {
      return this.$store.getters['albums/canEditAlbum']
    },
    canAddPhotos () {
      return this.$store.getters['albums/canAddPhotos']
    },
    rightDrawerOpen: {
      get () {
        return this.$store.state.ui.rightDrawerOpen
      },
      set (val) {
        this.$store.commit('ui/rightDrawerOpen', val)
      }
    },
    actionsDrawerContent: {
      get () {
        return this.$store.state.ui.actionsDrawerContent
      },
      set (val) {
        this.$store.commit('ui/actionsDrawerContent', val)
      }
    }
  },
  methods: {
    addPhotos () {
      this.rightDrawerOpen = true
      this.actionsDrawerContent = 'uploadPhotos'
    }
  }
}
</script>

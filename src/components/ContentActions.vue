<template lang="pug">
  .q-gutter-xs.row.items-center.no-wrap
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
      icon="add"
    )
</template>

<script>
export default {
  name: 'ContentActions',
  computed: {
    canAddAlbum () {
      return this.$store.getters['albums/canAddAlbum']
    },
    canAddPhotos () {
      return this.$store.getters['albums/canAddPhotos']
    }
  }
}
</script>

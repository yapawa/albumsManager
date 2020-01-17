<template lang="pug">
  upload-photos.fit(v-if="actionsDrawerContent === 'uploadPhotos'" style="max-height:none" @finish="finish")
</template>

<script>
import UploadPhotos from './UploadPhotos'
export default {
  name: 'ActionsDrawerContent',
  data () {
    return {}
  },
  components: {
    UploadPhotos
  },
  computed: {
    actionsDrawerContent: {
      get () {
        return this.$store.state.ui.actionsDrawerContent
      },
      set (val) {
        this.$store.commit('ui/actionsDrawerContent', val)
      }
    },
    rightDrawerOpen: {
      get () {
        return this.$store.state.ui.rightDrawerOpen
      },
      set (val) {
        this.$store.commit('ui/rightDrawerOpen', val)
      }
    }

  },
  methods: {
    finish () {
      this.actionsDrawerContent = null
      this.rightDrawerOpen = false
    }
  }
}
</script>

<template lang="pug">
  q-page(padding)
    .text-h6(v-if="activeAlbum") {{ activeAlbum.id }}
    router-link(:to="{ path: '/album/fd22018d-5417-320f-771d-72dcb930bec0' }") Album 2.1
</template>

<script>
export default {
  name: 'Album',
  data () {
    return {
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.setActiveAlbum(to.params.id)
    next()
  },
  created () {
    this.setActiveAlbum(this.$route.params.id)
  },
  methods: {
    setActiveAlbum (id) {
      this.activeAlbum = {
        id: id,
        name: 'Some name',
        type: 'collection'
      }
    }
  },
  computed: {
    activeAlbum: {
      get () {
        return this.$store.state.albums.active
      },
      set (val) {
        this.$store.commit('albums/active', val)
      }
    }
  }
}
</script>

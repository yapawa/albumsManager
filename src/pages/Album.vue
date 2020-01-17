<template lang="pug">
  q-page(padding)
    .text-center(v-if="loading")
      q-spinner(size="3em")
    .row.justify-center(v-if="errors.length > 0")
      q-banner.bg-negative.form-box(rounded)
        strong {{ $tc('Error', errors.length) }}:
        ul
          li(v-for="error in errors" :key="error") {{error.message}}
    .div(v-if="albumData && !loading")
      .text-h6 {{ albumData.name }}
      .text-subtitle1 {{albumData.description}}
      .row.q-gutter-sm(v-if="albumData.type=='collection'")
        div(v-for="item in albumData.children.items" :key="item.id")
          q-card.bg-grey-9.imageTh.cursor-pointer(@click="$router.push({path: `/album/${item.id}` })")
            .row.bg-grey-8.justify-center(style="width:120px;height:120px;")
              q-icon.self-center(name="photo" size="xl")
            q-card-section
              .text-caption.ellipsis {{item.name}}
              .text-caption.ellipsis {{item.id}}
      .row.q-gutter-sm(v-if="albumData.type=='album'")
        div(v-for="item in albumData.photos.items" :key="item.id")
          q-card.bg-grey-9.imageTh
            q-img.bg-grey-8(:ratio="1" :src="photoSrc[item.id]")
            q-card-section
              .text-caption.ellipsis {{item.name}}
              .text-caption.ellipsis {{item.id}}
</template>

<script>
import { getAlbum, getAlbums, getPhotos, onUpdateAlbum, onCreateAlbum, onUpdatePhoto, onCreatePhoto } from 'src/graphql/queryAlbum'
import { albumOrder } from 'src/lib/ordering'
export default {
  name: 'Album',
  data () {
    return {
      loading: true,
      errors: [],
      albumData: null,
      contentData: null,
      subscriptionUpdate: null,
      subscriptionCreate: null,
      subscriptionPhotoUpdate: null,
      subscriptionPhotoCreate: null,
      photoSrc: {}
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.fetchAlbum(to.params.id)
    next()
  },
  created () {
    this.fetchAlbum(this.$route.params.id)
    this.subscriptionUpdate = this.$Amplify.API.graphql(
      this.$Amplify.graphqlOperation(onUpdateAlbum)
    ).subscribe({
      next: (albumData) => {
        this.updateAlbum(albumData.value.data.onUpdateAlbum)
      }
    })
    this.subscriptionCreate = this.$Amplify.API.graphql(
      this.$Amplify.graphqlOperation(onCreateAlbum)
    ).subscribe({
      next: (albumData) => {
        this.updateAlbum(albumData.value.data.onCreateAlbum)
      }
    })
    this.subscriptionPhotoUpdate = this.$Amplify.API.graphql(
      this.$Amplify.graphqlOperation(onUpdatePhoto)
    ).subscribe({
      next: (photoData) => {
        this.updateContent(photoData.value.data.onUpdatePhoto)
      }
    })
    this.subscriptionPhotoCreate = this.$Amplify.API.graphql(
      this.$Amplify.graphqlOperation(onCreatePhoto)
    ).subscribe({
      next: (photoData) => {
        this.updateContent(photoData.value.data.onCreatePhoto)
      }
    })
  },
  beforeDestroy () {
    this.subscriptionUpdate.unsubscribe()
    this.subscriptionCreate.unsubscribe()
    this.subscriptionPhotoUpdate.unsubscribe()
    this.subscriptionPhotoCreate.unsubscribe()
  },
  methods: {
    fetchAlbum (id) {
      this.loading = true
      this.albumData = null
      const query = this.$Amplify.graphqlOperation(getAlbum, { id: id })
      return this.$Amplify.API.graphql(query).then(({ data }) => {
        this.albumData = data.getAlbum
        this.setActiveAlbum()
        let contentQuery = null
        let contentField = null
        if (this.albumData.type === 'collection') {
          contentQuery = this.$Amplify.graphqlOperation(getAlbums, { id: id })
          contentField = 'children'
        } else {
          contentQuery = this.$Amplify.graphqlOperation(getPhotos, { id: id })
          contentField = 'photos'
        }
        return this.$Amplify.API.graphql(contentQuery).then(({ data }) => {
          const content = data.getAlbum[contentField].items
          if (contentField === 'photos') {
            content.forEach(photo => {
              this.setPhotoSrc(photo.id, photo.file.key)
            })
          }
          content.sort(albumOrder(this.albumData.orderBy, this.albumData.orderDirection))
          this.loading = false
          this.contentData = [...content]
        })
      })
    },
    setPhotoSrc (id, key) {
      this.$Amplify.Storage.get(key).then(url => {
        const newItem = {}
        newItem[id] = url
        this.photoSrc = { ...this.photoSrc, ...newItem }
      })
    },
    setActiveAlbum () {
      const activeAlbum = { ...this.albumData }
      delete activeAlbum.children
      delete activeAlbum.photos
      this.activeAlbum = activeAlbum
    },
    updateAlbum (item) {
      Object.keys(item).forEach((key) => (item[key] === null) && delete item[key])
      if (item.id === this.albumData.id) {
        this.albumData = { ...this.albumData, ...item }
        this.contentData.sort(albumOrder(this.albumData.orderBy, this.albumData.orderDirection))
      } else {
        const idx = this.contentData.findIndex(e => e.id === item.id)
        if (idx >= 0) {
          let newContent = [...this.contentData]
          newContent[idx] = { ...this.contentData[idx], ...item }
          this.contentData = [...newContent]
          newContent = null
        }
      }
    },
    updateContent (item) {
      Object.keys(item).forEach((key) => (item[key] === null) && delete item[key])
      this.setPhotoSrc(item.id, item.file.key)
      if (this.contentData.findIndex(e => e.id === item.id) === -1) {
        this.contentData.push(item)
        this.contentData.sort(albumOrder(this.albumData.orderBy, this.albumData.orderDirection))
      } else {
        const idx = this.contentData.findIndex(e => e.id === item.id)
        if (idx >= 0) {
          let newContent = [...this.contentData]
          newContent[idx] = { ...this.contentData[idx], ...item }
          this.contentData = [...newContent]
          newContent = null
        }
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
<style lang="sass" scoped>
.q-card.imageTh
  width: 120px
</style>

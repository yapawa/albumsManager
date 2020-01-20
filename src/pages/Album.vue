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
      .text-caption {{$t('OrderBy')}} {{$t(albumData.orderBy)}} {{$t(albumData.orderDirection)}}
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
import { getAlbum, onUpdateAlbum, onCreateAlbum, onUpdatePhoto, onCreatePhoto } from 'src/graphql/queryAlbum'
import { albumOrder } from 'src/lib/ordering'
export default {
  name: 'Album',
  data () {
    return {
      loading: true,
      errors: [],
      albumData: null,
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
        this.updatePhotos(photoData.value.data.onUpdatePhoto)
      }
    })
    this.subscriptionPhotoCreate = this.$Amplify.API.graphql(
      this.$Amplify.graphqlOperation(onCreatePhoto)
    ).subscribe({
      next: (photoData) => {
        this.updatePhotos(photoData.value.data.onCreatePhoto)
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
        if (data.getAlbum.type === 'collection') {
          data.getAlbum.children.items.sort(albumOrder(data.getAlbum.orderBy, data.getAlbum.orderDirection))
        } else {
          data.getAlbum.photos.items.sort(albumOrder(data.getAlbum.orderBy, data.getAlbum.orderDirection))
          data.getAlbum.photos.items.forEach(p => {
            this.setPhotoSrc(p.id, p.file.key)
          })
        }
        this.albumData = data.getAlbum
        this.setActiveAlbum()
        this.loading = false
      }).catch((err) => { // eslint-disable-line handle-callback-err
        this.$router.replace({ name: 'home' })
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
      activeAlbum.childrenCount = activeAlbum.children.items.length
      activeAlbum.photosCount = activeAlbum.photos.items.length
      delete activeAlbum.children
      delete activeAlbum.photos
      this.activeAlbum = activeAlbum
    },
    updateAlbum (item) {
      Object.keys(item).forEach((key) => (item[key] === null) && delete item[key])
      const contentField = (this.albumData.type === 'collection') ? 'children' : 'photos'
      if (item.id === this.albumData.id) {
        console.log('item.id === albumdata.id')
        let newContent = { ...this.albumData, ...item }
        newContent[contentField].items.sort(albumOrder(newContent.orderBy, newContent.orderDirection))
        newContent = null
        this.albumData = { ...newContent }
      } else if (item.parentId === this.albumData.id) {
        const idx = this.albumData[contentField].items.findIndex(e => e.id === item.id)
        let newContent = { ...this.albumData }
        if (idx >= 0) {
          newContent[contentField].items[idx] = { ...newContent[contentField].items[idx], ...item }
        } else {
          newContent[contentField].items.push(item)
          newContent[contentField].items.sort(albumOrder(this.albumData.orderBy, this.albumData.orderDirection))
        }
        this.albumData = { ...newContent }
        newContent = null
      }
    },
    updatePhotos (item) {
      Object.keys(item).forEach((key) => (item[key] === null) && delete item[key])
      if (item.albumId === this.albumData.id) {
        if (item.file && item.file.key) {
          this.setPhotoSrc(item.id, item.file.key)
        }
        const idx = this.albumData.photos.items.findIndex(e => e.id === item.id)
        let newContent = { ...this.albumData }
        if (idx === -1) {
          newContent.photos.items.push(item)
        } else if (idx >= 0) {
          newContent.photos.items[idx] = { ...newContent.photos.items[idx], ...item }
        }
        newContent.photos.items.sort(albumOrder(this.albumData.orderBy, this.albumData.orderDirection))
        this.albumData = { ...newContent }
        newContent = null
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

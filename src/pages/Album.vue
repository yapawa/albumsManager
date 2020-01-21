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
      .row
        .col-auto.text-h6 {{ albumData.name }}
        q-space
        .col-auto.row.q-pl-md.q-gutter-sm
          q-icon(v-if="orderHasChanged" size="lg" color="warning" name="warning")
          y-album-select-order-by(v-model="albumData.orderBy" :albumType="albumData.type" dense @input="onChangeOrderingOption")
          y-album-select-order-direction(v-model="albumData.orderDirection" dense @input="onChangeOrderingOption")
      q-separator.q-my-sm
      draggable(v-if="albumData.type=='collection'"
        v-model="albumData.children.items"
        group="children"
        :disabled="false"
        :sort="albumData.orderBy == 'position'"
        animation="200"
        ghostClass="ghost"
        @sort="onSort"
      )
        transition-group.row.q-gutter-sm(type="transition" name="flip-list")
          q-card.bg-grey-9.imageTh.cursor-pointer(v-for="item in albumData.children.items" :key="item.id" @click="$router.push({path: `/album/${item.id}` })"  data-type="children")
            .row.bg-grey-8.justify-center(style="width:120px;height:120px;")
              q-icon.self-center(name="photo" size="xl")
            q-card-section
              .text-caption.ellipsis {{item.name}}
              .text-caption.ellipsis {{item.id}}
              .text-caption.ellipsis {{item.position}}
      draggable(v-if="albumData.type=='album'"
        v-model="albumData.photos.items"
        group="photos"
        :disabled="false"
        :sort="albumData.orderBy == 'position'"
        animation="200"
        ghostClass="ghost"
        @sort="onSort"
      )
        transition-group.row.q-gutter-sm(type="transition" name="flip-list")
          q-card.bg-grey-9.imageTh(v-for="item in albumData.photos.items" :key="item.id" data-type="photos")
            q-img.bg-grey-8(:ratio="1" :src="photoSrc[item.id]")
            q-card-section
              .text-caption.ellipsis {{item.name}}
              .text-caption.ellipsis {{item.id}}
              .text-caption.ellipsis {{item.position}}
</template>

<script>
import { getAlbum, updateAlbum, updatePhoto, onUpdateAlbum, onCreateAlbum, onUpdatePhoto, onCreatePhoto } from 'src/graphql/queryAlbum'
import { albumOrder } from 'src/lib/ordering'
import YAlbumForm from 'components/albums'
import draggable from 'vuedraggable'
import { debounce } from 'quasar'
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
      photoSrc: {},
      orderHasChanged: false,
      drag: false
    }
  },
  components: {
    ...YAlbumForm,
    draggable
  },
  // beforeRouteLeave (to, from, next) {
  //   console.log('routeleave')
  //   console.log(this.orderHasChanged)
  //   if (this.orderHasChanged) {
  //     console.log('not saved')
  //     next(false)
  //   } else {
  //     next()
  //   }
  // },
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
    this.updatePositionLater = debounce(this.updatePosition, 4000)
  },
  beforeDestroy () {
    this.subscriptionUpdate.unsubscribe()
    this.subscriptionCreate.unsubscribe()
    this.subscriptionPhotoUpdate.unsubscribe()
    this.subscriptionPhotoCreate.unsubscribe()
  },
  methods: {
    updatePosition (type) {
      const updatePromises = []
      const srcOrder = [...this.albumData[type].items]
      if (this.albumData.orderDirection === 'desc') {
        srcOrder.reverse()
      }
      const query = type === 'children' ? updateAlbum : updatePhoto
      for (let i = 0; i < srcOrder.length; i++) {
        const newPosition = i + 1
        if (newPosition !== srcOrder[i].position) {
          const input = {
            id: srcOrder[i].id,
            position: newPosition
          }
          updatePromises.push(this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(query, { input })))
        }
      }
      Promise.all(updatePromises).then(res => {
        this.orderHasChanged = false
      })
    },
    updatePositionNow () {
      this.updatePositionLater.cancel()
      this.updatePosition()
    },
    fetchAlbum (id) {
      this.loading = true
      this.albumData = null
      this.orderHasChanged = false
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
        let newContent = { ...this.albumData, ...item }
        newContent[contentField].items.sort(albumOrder(newContent.orderBy, newContent.orderDirection))
        this.albumData = { ...newContent }
        newContent = null
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
    },
    onChangeOrderingOption () {
      const input = {
        id: this.albumData.id,
        orderBy: this.albumData.orderBy,
        orderDirection: this.albumData.orderDirection
      }
      this.$Amplify.API.graphql(
        this.$Amplify.graphqlOperation(updateAlbum, { input })
      ).then(res => {
        this.orderHasChanged = false
        this.updatePositionLater.cancel()
      })
    },
    onSort (evt) {
      const type = evt.item.dataset.type
      let countChanges = 0
      const srcOrder = [...this.albumData[type].items]
      if (this.albumData.orderDirection === 'desc') {
        srcOrder.reverse()
      }
      for (let i = 0; i < srcOrder.length; i++) {
        const newPosition = i + 1
        if (newPosition !== srcOrder[i].position) {
          countChanges++
        }
      }
      this.orderHasChanged = countChanges > 0
      if (this.orderHasChanged) {
        this.updatePositionLater(type)
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
.flip-list-move
  transition: transform 0.5s
.no-move
  transition: transform 0s
.ghost
  opacity: 0.5
  background: #c8ebfb
</style>

<template lang="pug">
  q-page.q-pt-none(padding)
    .text-center(v-if="loading")
      q-spinner(size="3em")
    .row.justify-center(v-if="errors.length > 0")
      q-banner.bg-negative.form-box(rounded)
        strong {{ $tc('Error', errors.length) }}:
        ul
          li(v-for="error in errors" :key="error") {{error.message}}
    .div(v-if="albumData && !loading")
      q-slide-transition
        .row.q-py-sm(v-show="showEdit")
          .col-auto.row.q-pl-md(v-show="showEdit")
            draggable.rounded-borders.row.no-wrap.q-gutter-xs.covers-drop(
              v-model="covers"
              :group="{ name: 'covers', pull: false, put: canPut }"
              :sort="true"
              @change="onCoversChange"
            )
              q-card.bg-grey-9.covers-th(v-for="item in covers" :key="item.id" data-type="covers")
                q-img.bg-grey-8(:ratio="1" :src="photoSrc[item.id]")
                  .fixed-top-right.q-pa-none
                    q-btn(dense flat icon="delete" size="10px" @click="removeCover(item.id)")
          q-space
          .col-auto.row.q-pl-md.q-gutter-sm
            q-icon(v-if="orderHasChanged" size="lg" color="warning" name="warning")
            y-album-select-order-by(v-model="albumData.orderBy" :albumType="albumData.type" dense @input="onChangeOrderingOption")
            y-album-select-order-direction(v-model="albumData.orderDirection" dense @input="onChangeOrderingOption")
      .row
        .col(:class="showEdit ? 'slider-left' : ''")
        .col-12.col-md-auto.text-center.slider-handle.q-px-md.cursor-pointer(@click="showEdit = !showEdit")
          q-icon(name="arrow_drop_down" size="xs" :class="showEdit ? 'rotate-180' : ''")
        .col(:class="showEdit ? 'slider-right' : ''")
      .row
        .text-h6 {{ albumData.name }}
      q-separator.q-my-sm
      draggable(v-if="albumData.type=='collection'"
        v-model="albumData.children.items"
        group="children"
        :disabled="false"
        :sort="albumData.orderBy == 'position'"
        animation="200"
        ghostClass="ghost"
        @sort="onSort"
        revert-on-spill="true"
      )
        transition-group.row.q-gutter-sm(type="transition" name="flip-list")
          q-card.bg-grey-9.imageTh.cursor-pointer(v-for="item in albumData.children.items" :key="item.id" @click="$router.push({path: `/album/${item.id}` })" data-type="children")
            .row.bg-grey-8.justify-center(style="width:120px;height:120px;")
              q-icon.self-center(name="photo" size="xl")
            q-card-section
              .text-caption.ellipsis {{item.name}}
              .text-caption.ellipsis {{item.id}}
              .text-caption.ellipsis {{item.position}}
      draggable(v-if="albumData.type=='album'"
        v-model="albumData.photos.items"
        :group="{ name: 'photos', pull: 'clone', put: false }"
        :disabled="false"
        :sort="albumData.orderBy == 'position'"
        animation="200"
        ghostClass="ghost"
        @sort="onSort"
        revert-on-spill="true"
        :clone="clonePhoto"
      )
        transition-group.row.q-gutter-sm(type="transition" name="flip-list")
          q-card.bg-grey-9.imageTh(v-for="item in albumData.photos.items" :key="item.id" data-type="photos" :data-id="item.id")
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
      showEdit: false,
      covers: []
    }
  },
  components: {
    ...YAlbumForm,
    draggable
  },
  beforeRouteUpdate (to, from, next) {
    this.showEdit = false
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
    updateCovers () {
      this.albumData.covers = this.covers
      const input = {
        id: this.albumData.id,
        covers: JSON.stringify(this.covers)
      }
      this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(updateAlbum, { input }))
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
        data.getAlbum.covers = JSON.parse(data.getAlbum.covers)
        this.albumData = data.getAlbum
        this.covers = this.albumData.covers || []
        this.setActiveAlbum()
        this.loading = false
        if (data.getAlbum.type === 'album' && data.getAlbum.photos.items.length === 0) {
          this.$router.push({ name: 'Upload' })
        }
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
    },
    onCoversChange (evt) {
      this.updateCovers()
    },
    removeCover (id) {
      this.covers = this.covers.filter(e => e.id !== id)
      this.updateCovers()
    },
    clonePhoto (el) {
      return {
        id: el.id,
        contentType: el.contentType,
        key: el.file.key,
        width: el.width,
        height: el.height,
        updatedAt: el.updatedAt
      }
    },
    canPut (to, from, el, evt) {
      if (from.options.group.name === 'photos' && this.covers.length < 4) {
        const itemId = el.getAttribute('data-id')
        const existingIds = this.covers.map(item => item.id)
        if (existingIds.indexOf(itemId) > -1) {
          return false
        }
        return true
      }
      return false
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
$cover-th: 60px

.q-card.imageTh
  width: 120px
.flip-list-move
  transition: transform 0.5s
.no-move
  transition: transform 0s
.ghost
  opacity: 0.5
  background: #c8ebfb
.slider-
  &left
    border-top: 1px solid $grey-2
  &right
    border-top: 1px solid $grey-2
  &handle
    border-bottom-right-radius: 8px
    border-bottom-left-radius: 8px
    border-bottom: 1px solid $grey-2
    border-left: 1px solid $grey-2
    border-right: 1px solid $grey-2
.covers-drop
  border: 1px dotted white
  width: 4 * $cover-th + 5 * map-get($space-xs,x)
  height: $cover-th + 2 * map-get($space-xs,y)
  background-color: $grey-9
.covers-th
  width: $cover-th
  height: $cover-th
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

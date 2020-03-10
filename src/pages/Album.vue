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
        .row.q-my-sm(v-show="showEdit")
          .col-auto
            y-album-covers(:albumData="albumData")
          q-space
          .col-auto.row.q-pl-md.q-gutter-sm.items-center
            y-album-select-order-by(v-model="albumData.orderBy" :albumType="albumData.type" dense @input="onChangeOrderingOption")
            y-album-select-order-direction(v-model="albumData.orderDirection" dense @input="onChangeOrderingOption")
      .row.justify-between.items-center
        .text-h6.col {{ albumData.name }}
        .col.text-right
          q-spinner-puff(v-if="orderHasChanged" color="warning" size="lg")
          q-btn.q-px-sm.q-ml-sm(
              color="grey-4"
              text-color="black"
              dense
              icon="edit"
              @click="showEdit = !showEdit"
              size="sm"
          )

      q-separator.q-my-sm
      draggable(v-if="albumData.type=='collection'"
        v-model="albumData.children.items"
        :disabled="false"
        :sort="albumData.orderBy == 'position'"
        group="children"
        animation="200"
        ghostClass="ghost"
        @sort="onSort"
        revert-on-spill="true"
      )
        transition-group.row.q-gutter-sm(type="transition" name="flip-list")
          q-card.bg-grey-9.albumTh.cursor-pointer(v-for="item in albumData.children.items" :key="item.id" @click="$router.push({name: 'album', params:{id:item.id}})" data-type="children")
            q-img(v-if="item.covers.length>0" :src="cacheUrl(item.covers[0], {w:100, h:100})" :ratio="1" placeholder-src="~/assets/placeholder-logo.svg")
            q-img(v-else src="~/assets/placeholder-logo.svg" :ratio="1")
            div
              q-badge(color="secondary" floating) {{getContentCount(item) }}
            q-card-section.q-pa-xs
              .text-caption.text-center.ellipsis {{item.name}}
      draggable(v-if="albumData.type=='album'"
        v-model="albumData.photos.items"
        :sort="albumData.orderBy == 'position'"
        :group="{ name: 'photos', pull: 'clone', put: false }"
        :disabled="false"
        animation="200"
        ghostClass="ghost"
        @sort="onSort"
        revert-on-spill="true"
        :clone="clonePhoto"
        :setData="setData"
      )
        transition-group.row.q-gutter-sm(type="transition" name="flip-list")
          q-card.bg-grey-9.photoTh(v-for="item in albumData.photos.items" :key="item.id" data-type="photos" :data-id="item.id" @mouseenter="onPhotoOver" @mouseleave="onPhotoOut")
            q-img.bg-grey-8(:ratio="1" :src="cacheUrl(item, {w:100, h:100})" placeholder-src="~/assets/placeholder-logo.svg")
              template(v-slot:error)
                .fixed-center.q-pa-none
                  q-btn(dense flat icon="delete" size="12px" @click="confirmRemovePhoto(item.id)")
              .absolute-top-right.q-pa-none(:class="(photoHover === item.id) ? '':'hidden'")
                q-btn(dense flat icon="delete" size="10px" @click="confirmRemovePhoto(item.id)")
              .absolute-top-left.q-pa-none(:class="(photoHover === item.id) ? '':'hidden'")
                q-btn(dense flat icon="edit" size="10px" :to="{name: 'PhotoEdit', params: {id: item.id }}")
              .absolute-bottom-right.q-pa-none(:class="(photoHover === item.id) ? '':'hidden'")
                q-btn(dense flat icon="rotate_left" size="10px" @click="rotate(item.id, 'left')")
                q-btn(dense flat icon="rotate_right" size="10px" @click="rotate(item.id, 'right')")
    q-dialog(v-model="confirmDeletePhoto" persistent)
      q-card.bg-grey-8
        q-card-section.row.items-center.justify-center
          q-img.rounded-borders(:src="getPhotoSrc(toDelete, {w:100, h:100})" :ratio="1" style="width:70px")
        q-card-section.row.items-center.justify-center
          .col.text-body1 {{ $t('confirm-delete-picture') }}
        q-card-actions.bg-grey-6(align="around")
          q-btn(:disable="deletingPhoto" :label="$t('Cancel')" color="secondary" text-color="black" v-close-popup)
          q-btn(:loading="deletingPhoto" :label="$t('Delete')" color="primary" text-color="black" @click="removePhoto")
</template>

<script>
import { getAlbum, updateAlbum, updatePhoto, onUpdateAlbum, onCreateAlbum, onUpdatePhoto, onCreatePhoto, onDeletePhoto, deletePhoto } from 'src/graphql/queryAlbum'
import { albumOrder } from 'src/utils/ordering'
import YAlbumForm from 'components/albums'
import draggable from 'vuedraggable'
import { debounce, event } from 'quasar'
import YThumbnails from 'src/mixins/thumbnails'
import AlbumCounters from 'src/mixins/albumCounters'
import BuildApi from 'src/mixins/buildApi'

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
      orderHasChanged: false,
      showEdit: false,
      covers: [],
      photoHover: null,
      confirmDeletePhoto: false,
      toDelete: null,
      deletingPhoto: false,
      photoEditor: false,
      selectedPhoto: null
    }
  },
  components: {
    ...YAlbumForm,
    draggable
  },
  mixins: [
    YThumbnails,
    AlbumCounters,
    BuildApi
  ],
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
    this.subscriptionPhotoDelete = this.$Amplify.API.graphql(
      this.$Amplify.graphqlOperation(onDeletePhoto)
    ).subscribe({
      next: (photoData) => {
        this.deletePhotos(photoData.value.data.onDeletePhoto)
      }
    })
    this.updatePositionLater = debounce(this.updatePosition, 4000)
    this.apiBuildAlbumLater = debounce(this.apiBuildAlbum, 5000)
  },
  beforeDestroy () {
    this.subscriptionUpdate.unsubscribe()
    this.subscriptionCreate.unsubscribe()
    this.subscriptionPhotoUpdate.unsubscribe()
    this.subscriptionPhotoCreate.unsubscribe()
    this.subscriptionPhotoDelete.unsubscribe()
  },
  methods: {
    onPhotoOver (e) {
      if (e.target.dataset.type && e.target.dataset.id && e.target.dataset.type === 'photos') {
        this.photoHover = e.target.dataset.id
      }
      event.stopAndPrevent(e)
    },
    onPhotoOut (e) {
      this.photoHover = null
      event.stopAndPrevent(e)
    },
    confirmRemovePhoto (id) {
      this.toDelete = id
      this.confirmDeletePhoto = true
    },
    removePhoto () {
      if (this.toDelete) {
        this.deletingPhoto = true
        const input = {
          id: this.toDelete
        }
        return this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(deletePhoto, { input })).then(res => {
          this.confirmDeletePhoto = false
          this.deletingPhoto = false
          this.toDelete = null
          this.updateCounters(this.activeAlbum.id)
        })
          .catch(err => {
            this.$Logger.error('deletePhoto', err)
            this.confirmDeletePhoto = false
            this.deletingPhoto = false
            this.toDelete = null
          })
      }
    },
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
      }).then(res => {
        return this.apiBuildAlbum(this.activeAlbum.id)
      })
    },
    fetchAlbum (id) {
      this.loading = true
      this.albumData = null
      this.orderHasChanged = false
      this.photoEditor = false
      const query = this.$Amplify.graphqlOperation(getAlbum, { id: id })
      return this.$Amplify.API.graphql(query).then(({ data }) => {
        if (data.getAlbum.type === 'collection') {
          data.getAlbum.children.items.sort(albumOrder(data.getAlbum.orderBy, data.getAlbum.orderDirection))
          data.getAlbum.children.items.forEach((a, idx) => {
            data.getAlbum.children.items[idx].covers = JSON.parse(a.covers) || []
          })
        } else {
          data.getAlbum.photos.items.sort(albumOrder(data.getAlbum.orderBy, data.getAlbum.orderDirection))
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
    getPhotoSrc (id, options) {
      if (this.albumData && this.albumData.photos && this.albumData.photos.items) {
        const item = this.albumData.photos.items.filter(p => p.id === id)[0]
        if (item && item.id) {
          return this.cacheUrl(item, options)
        }
      }
      return null
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
    deletePhotos (item) {
      const idx = this.albumData.photos.items.findIndex(e => e.id === item.id)
      if (idx > -1) {
        this.albumData.photos.items.splice(idx, 1)
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
        return res
      }).then(res => {
        return this.apiBuildAlbum(this.albumData.id)
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
    clonePhoto (el) {
      return {
        id: el.id,
        contentType: el.contentType,
        file: {
          key: el.file.key
        },
        width: el.width,
        height: el.height,
        updatedAt: el.updatedAt,
        slug: el.slug
      }
    },
    setData (dataTransfer, dragEl) {
      dataTransfer.setData('text', JSON.stringify(this.clonePhoto(this.albumData.photos.items.filter(el => el.id === dragEl.dataset.id)[0])))
    },
    getContentCount (item) {
      const totalCount = item.contentCountTotal || 0
      const publicCount = item.contentCountPublic || 0
      let display = `${totalCount}`
      if (totalCount !== publicCount) {
        display = `${display} (${publicCount})`
      }
      return display
    },
    rotate (itemId, direction) {
      const angle = direction === 'left' ? 270 : 90

      const elem = document.querySelector(`div.q-card[data-id="${itemId}"] .q-img__image`)
      elem.classList.remove('rotate-90')
      elem.classList.remove('rotate-270')
      elem.classList.add(`rotate-${angle}`)

      const item = this.albumData.photos.items.filter(el => el.id === itemId)[0]
      const rotatePhoto = `mutation RotatePhoto($key: String, $angle: Int) {
        rotatePhoto(key: $key, angle: $angle)
      }`

      this.$q.loading.show({
        delay: 400 // ms
      })
      this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(rotatePhoto, { key: item.file.key, angle }))
        .then(res => {
          const newMetadata = JSON.parse(res.data.rotatePhoto)
          const input = {
            id: itemId,
            size: newMetadata.size,
            width: newMetadata.width,
            height: newMetadata.height,
            updatedAt: newMetadata.modifiedAt
          }
          this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(updatePhoto, { input }))
            .then(res => {
              this.$q.loading.hide()
              this.apiBuildAlbumLater(this.activeAlbum.id)
            })
        })
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
$th: 100px

.q-card.photoTh
  width: $th
.q-card.albumTh
  width: $th
.flip-list-move
  transition: transform 0.5s
.no-move
  transition: transform 0s
.ghost
  opacity: 0.5
  background: #c8ebfb
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

<template lang="pug">
draggable.rounded-borders.row.no-wrap.q-gutter-xs.covers-drop(
  v-model="covers"
  :group="{ name: 'covers', pull: false, put: canPut }"
  :sort="true"
  @change="onChange"
)
  q-card.bg-grey-9.covers-th(v-for="item in covers" :key="item.id" data-type="covers")
    q-img.bg-grey-8(:ratio="1" :src="cacheUrl(item, {w:100,h:100})" placeholder-src="~/assets/placeholder-logo.svg")
      .fixed-top-right.q-pa-none
        q-btn(dense flat icon="delete" size="10px" @click="remove(item.id)")
</template>
<script>
import draggable from 'vuedraggable'
import CoversUpdate from './coversUpdate'
import YThumbnails from 'src/mixins/thumbnails'

export default {
  name: 'YAlbumCovers',
  data () {
    return {
      covers: []
    }
  },
  components: {
    draggable
  },
  mixins: [
    CoversUpdate,
    YThumbnails
  ],
  props: [
    'albumData'
  ],
  created () {
    this.covers = this.albumData.covers || []
  },
  methods: {
    canPut (to, from, el, evt) {
      if (from.options.group.name === 'photos' && this.covers.length < this.maxCovers) {
        const itemId = el.getAttribute('data-id')
        const existingIds = this.covers.map(item => item.id)
        if (existingIds.indexOf(itemId) > -1) {
          return false
        }
        return true
      }
      return false
    },
    onChange (evt) {
      this.updateCovers(this.albumData.id, this.covers)
    },
    remove (id) {
      this.covers = this.covers.filter(e => e.id !== id)
      this.updateCovers(this.albumData.id, this.covers)
    }
  }
}
</script>
<style lang="sass" scoped>
$cover-th: 60px
$maxCovers: 4

.covers-drop
  border: 1px dotted white
  width: $maxCovers * $cover-th + ($maxCovers + 1) * map-get($space-xs,x)
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

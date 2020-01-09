<template lang="pug">
  q-page.row.justify-center(padding)
    .col(style="max-width:450px;width:100%")
      .column.items-center.full-width
        .col.full-width
          img.full-width(alt="Yapawa Logo" src="~assets/yapawa-logo.svg")
        .col.justify-center.text-title.full-width.text-uppercase.text-no-wrap.text-center.text-fit yapawa
        .col.justify-center.text-subtitle.full-width.text-capitalize.text-no-wrap.text-center.text-fit yet another photo album web app
      q-resize-observer(@resize="onResize")
</template>
<script>
import fitty from 'fitty'
export default {
  name: 'PageIndex',
  mounted () {
    this.$nextTick(() => {
      this.init()
    })
  },
  created () {
    this.activeAlbum = null
  },
  methods: {
    init () {
      fitty('.text-fit', {
        minSize: 3,
        maxSize: 512,
        multiLine: false
      })
      fitty.fitAll()
    },
    onResize (e) {
      const els = document.getElementsByClassName('text-fit')
      els[0].style.fontSize = null
      els[1].style.fontSize = null
      fitty.fitAll()
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
<style lang="sass">
.text-fit
  display: inline-block
  white-space: nowrap
.text-title
  &.text-fit
    font-size: 200px
.text-subtitle
  &.text-fit
    font-size: 200px
</style>

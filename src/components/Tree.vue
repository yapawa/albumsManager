<template lang="pug">
  div(style="font-size:0.9em")
    q-tree(
      @update:selected="onSelect"
      :nodes="renderTree"
      nodeKey="id"
      accordion
      :no-nodes-label="$t('Loading Albums...')"
      :selected.sync="selected"
      :expanded.sync="expandedKeys"
      selected-color="primary"
    )
      template(v-slot:default-header="prop")
        .row.no-wrap.fit(@drop="onDrop" @dragleave="onDragAction" @dragenter="onDragAction" @dragover="onDragAction" :data-id="prop.node.id")
          q-icon.no-pointer-events.q-tree__icon.q-mr-sm.no-pointer-events(:name="prop.node.icon" :color="prop.node.iconColor" size="18px")
          div.no-pointer-events.ellipsis {{ prop.node.label }}
</template>

<script>
import { event } from 'quasar'
import CoversUpdate from 'components/albums/coversUpdate'

export default {
  name: 'Tree',
  data () {
    return {
      selected: null,
      expandedKeys: ['root'],
      covers: []
    }
  },
  mixins: [
    CoversUpdate
  ],
  methods: {
    isExpanded (id) {
      return this.expandedKeys.indexOf(id) >= 0
    },
    isActive (id) {
      return this.selected === id
    },
    renderBranch (branch) {
      const items = []
      for (let i = 0; i < branch.length; i++) {
        const item = {
          icon: 'photo_library',
          iconColor: 'grey',
          label: branch[i].name,
          id: branch[i].id,
          handler: this.openAlbum,
          type: branch[i].type
        }
        if (branch[i].type === 'collection') {
          item.icon = 'library_books'
        }
        if ('children' in branch[i]) {
          item.children = this.renderBranch(branch[i].children)
        }
        items.push(item)
      }
      return items
    },
    openAlbum (album) {
      this.$router.push({ path: `/album/${album.id}` }).catch(() => {})
    },
    onSelect (key) {
      if (!key) {
        const old = this.selected
        this.$nextTick(() => { this.selected = old })
      }
    },
    onDragAction (e) {
      if (e.type === 'dragenter') {
        e.target.parentNode.parentNode.classList.add('dropzone')
      } else if (e.type === 'dragleave') {
        e.target.parentNode.parentNode.classList.remove('dropzone')
      }
      event.stopAndPrevent(e)
      return false
    },
    onDrop (e) {
      const targetAlbumId = e.target.dataset.id
      const photoData = JSON.parse(e.dataTransfer.getData('text')) || null
      e.target.parentNode.parentNode.classList.remove('dropzone')
      if (photoData) {
        this.addPhotoToCovers(targetAlbumId, photoData)
      }
    }
  },
  computed: {
    albumTree () {
      return this.$store.getters['albums/tree']
    },
    renderTree () {
      const tree = this.albumTree
      if (tree && tree.length > 0) {
        return this.renderBranch(tree)
      } else {
        return []
      }
    },
    activeAlbum () {
      return this.$store.state.albums.active
    }
  },
  watch: {
    albumTree (newTree, oldTree) {
      const active = this.$store.state.albums.active
      if (active && active.id) {
        this.expandedKeys = this.$store.getters['albums/breadcrumbs'](active.id).slice(0, -1)
        this.selected = active.id
      } else {
        this.selected = null
      }
    },
    activeAlbum (active, oldActive) {
      if (active && active.id) {
        this.expandedKeys = this.$store.getters['albums/breadcrumbs'](active.id).slice(0, -1)
        this.selected = active.id
      } else {
        this.selected = null
      }
    }
  }
}
</script>
<style lang="sass">
.dropzone
  background-color: $grey-9
</style>

<template lang="pug">
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
</template>

<script>
export default {
  name: 'Tree',
  data () {
    return {
      selected: null,
      expandedKeys: ['root']
    }
  },
  methods: {
    renderBranch (branch) {
      const items = []
      for (let i = 0; i < branch.length; i++) {
        const item = {
          icon: 'photo_library',
          iconColor: 'grey',
          label: branch[i].name,
          id: branch[i].id,
          handler: this.openAlbum
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

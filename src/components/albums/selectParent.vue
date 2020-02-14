<template lang="pug">
y-album-select(v-model="field" :label="$t('Parent Album')" :options="options" @input="onChange" :dense="dense")
</template>

<script>
import YAlbumSelect from './select'

export default {
  name: 'AlbumSelectParent',
  data () {
    return {
      field: null
    }
  },
  props: [
    'value',
    'dense'
  ],
  watch: {
    value (val) {
      this.field = val
    }
  },
  created () {
    this.field = this.value
  },
  components: {
    YAlbumSelect
  },
  methods: {
    onChange () {
      this.$emit('input', this.field)
    },
    renderAlbumOptions (options, tree, depth = 0) {
      for (let i = 0; i < tree.length; i++) {
        let label = tree[i].name
        if (depth > 0) {
          label = `${'&nbsp;&nbsp;'.repeat(depth)}&middot;&nbsp;${tree[i].name}`
        }
        const option = {
          label: label,
          value: tree[i].id
        }
        options.push(option)
        if (tree[i].children && tree[i].children.length > 0) {
          options = this.renderAlbumOptions(options, tree[i].children, depth + 1)
        }
      }
      return options
    }
  },
  computed: {
    options () {
      const options = []
      this.renderAlbumOptions(options, this.albumTree)
      return options
    },
    albumTree () {
      return this.$store.getters['albums/tree']
    }
  }
}
</script>

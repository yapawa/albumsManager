<template lang="pug">
y-album-select(v-model="field" :label="$t('OrderBy')" :options="options" @input="onChange" :dense="dense")
</template>

<script>
import YAlbumSelect from './select'

export default {
  name: 'AlbumSelectOrderBy',
  data () {
    return {
      field: null
    }
  },
  props: [
    'value',
    'albumType',
    'dense'
  ],
  watch: {
    value (val) {
      this.field = val
    },
    albumType (val) {
      this.field = (val === 'collection') ? 'createdAt' : 'capturedAt'
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
    }
  },
  computed: {
    options () {
      let values = ['position', 'capturedAt', 'createdAt', 'updatedAt', 'publishedAt', 'name']
      if (this.albumType === 'collection') {
        values = ['position', 'createdAt', 'updatedAt', 'publishedAt', 'name']
      }
      return values.map(e => {
        return {
          label: this.$t(e),
          value: e
        }
      })
    }
  }
}
</script>

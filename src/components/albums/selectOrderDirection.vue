<template lang="pug">
y-album-select(v-model="field" :label="$t('OrderDirection')" :options="options" @input="onChange" :dense="dense")
</template>

<script>
import YAlbumSelect from './select'

export default {
  name: 'AlbumSelectOrderDirection',
  data () {
    return {
      field: null
    }
  },
  props: [
    'value',
    'dense',
    'albumType'
  ],
  watch: {
    value (val) {
      this.field = val
    },
    albumType (val) {
      this.field = (val === 'collection') ? 'desc' : 'asc'
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
      return ['asc', 'desc'].map(e => {
        return {
          label: this.$t(e),
          value: e
        }
      })
    }
  }
}
</script>

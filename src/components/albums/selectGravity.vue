<template lang="pug">
y-album-select(v-model="field" :label="$t('Gravity')" :options="options" @input="onChange" :dense="dense")
</template>

<script>
import YAlbumSelect from './select'

export default {
  name: 'AlbumSelectGravity',
  data () {
    return {
      field: 'center'
    }
  },
  props: [
    'value',
    'dense',
    'isVertical'
  ],
  watch: {
    value (val) {
      this.field = val
    }
  },
  created () {
    if (!this.gravityOptions.includes(this.value)) {
      this.field = 'center'
    } else {
      this.field = this.value
    }
    console.log(this.value)
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
    gravityOptions () {
      let gravity = ['center']
      if (this.isVertical) {
        gravity = [...gravity, 'top', 'bottom']
      } else {
        gravity = [...gravity, 'left', 'right']
      }
      return gravity
    },
    options () {
      return this.gravityOptions.map(e => {
        return {
          label: this.$t(e),
          value: e
        }
      })
    }
  }
}
</script>

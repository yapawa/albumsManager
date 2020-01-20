<template lang="pug">
q-select(
  outlined
  options-dense
  v-model="field"
  :options="options"
  :label="label"
  emit-value
  map-options
  :dense="dense"
  @input="onChange"
)
</template>

<script>
export default {
  name: 'AlbumSelect',
  data () {
    return {
      field: null
    }
  },
  watch: {
    value (val) {
      this.field = val
    }
  },
  created () {
    this.field = this.value
  },
  props: [
    'value',
    'label',
    'options',
    'dense'
  ],
  methods: {
    onChange () {
      this.$emit('input', this.field)
    }
  }
}
</script>

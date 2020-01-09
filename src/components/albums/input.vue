<template lang="pug">
q-input(v-model="field" :label="label" :type="type" outlined @input="onChange" :autogrow="autogrow")
</template>

<script>
export default {
  name: 'AlbumInput',
  data () {
    return {
      field: null
    }
  },
  created () {
    this.field = this.value
  },
  props: [
    'value',
    'label',
    'type'
  ],
  computed: {
    autogrow () {
      return (this.type === 'textarea')
    }
  },
  methods: {
    onChange () {
      this.$emit('input', this.field)
    }
  }
}
</script>

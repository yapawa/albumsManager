<template lang="pug">
q-input(v-model="field" :label="label" :type="type" outlined :autogrow="autogrow" disable readonly :dense="dense")
</template>

<script>
export default {
  name: 'AlbumInputRo',
  data () {
    return {
      field: null
    }
  },
  created () {
    this.field = this.value
  },
  watch: {
    value: function (val) {
      this.field = val
    }
  },
  props: [
    'value',
    'label',
    'type',
    'dense'
  ],
  computed: {
    autogrow () {
      return (this.type === 'textarea')
    }
  }
}
</script>

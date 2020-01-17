<template lang="pug">
div
  q-input(v-model="field" :label="label" outlined @input="onChange" mask="####-##-## ##:##:##")
    template(v-slot:append)
      q-icon.cursor-pointer.set-now(name="access_time" @click="setNow")
</template>

<script>
import { date } from 'quasar'
export default {
  name: 'AlbumDateTime',
  data () {
    return {
      field: null
    }
  },
  created () {
    this.field = date.formatDate(this.value, 'YYYY-MM-DD HH:mm:ss')
  },
  props: [
    'value',
    'label'
  ],
  methods: {
    onChange () {
      this.$emit('input', this.field)
    },
    setNow () {
      this.field = date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style lang="sass" scoped>
.set-now
  &:hover
    color: $primary
</style>

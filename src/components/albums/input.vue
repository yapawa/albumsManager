<template lang="pug">
q-input(v-model="field" :label="label" :type="type" outlined @input="onChange" :autogrow="autogrow" :dense="dense")
  template(v-if="updateIcon" v-slot:after)
    q-btn(round dense flat icon="keyboard_return" @click="update")
      q-tooltip  {{ $t('Update from name') }}
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
  watch: {
    value: function (val) {
      this.field = val
    }
  },
  props: [
    'value',
    'label',
    'type',
    'dense',
    'updateIcon'
  ],
  computed: {
    autogrow () {
      return (this.type === 'textarea')
    }
  },
  methods: {
    onChange () {
      this.$emit('input', this.field)
    },
    update () {
      this.$emit('clickIcon')
    }
  }
}
</script>

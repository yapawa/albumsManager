<template lang="pug">
q-btn-toggle(
  v-model="type"
  no-caps
  spread
  toggle-color="primary"
  toggle-text-color="black"
  color="grey-8"
  :options="typeOptions"
  @input="onChange"
  :disable="disable"
)
  template(v-slot:collection)
    album-type-option(icon="library_books" :title="$t('Collection')" :caption="$t('For grouping collections or albums')")
  template(v-slot:album)
    album-type-option(icon="photo_library" :title="$t('Album')" :caption="$t('For grouping photos')")
</template>

<script>
import AlbumTypeOption from './typeOption'
export default {
  name: 'AlbumType',
  data () {
    return {
      type: 'album',
      typeOptions: [
        { label: '', value: 'collection', slot: 'collection' },
        { label: '', value: 'album', slot: 'album' }
      ]
    }
  },
  components: {
    AlbumTypeOption
  },
  props: [
    'value',
    'disable'
  ],
  methods: {
    onChange () {
      this.$emit('input', this.type)
    }
  },
  created () {
    if (this.value === 'collection') {
      this.type = 'collection'
    }
  }
}
</script>

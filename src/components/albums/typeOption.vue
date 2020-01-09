<template lang="pug">
.column.items-center.full-height
  q-icon(:name="icon" size="md")
  .text-subtitle1(v-if="title") {{ title }}
  .text-body2(v-if="caption") {{ caption }}
</template>

<script>
export default {
  name: 'AlbumTypeOption',
  props: [
    'icon',
    'title',
    'caption'
  ]
}
</script>

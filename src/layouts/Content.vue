<template lang="pug">
  q-layout(view="hHh LpR fFf")

    q-header(elevated class="bg-grey-9 text-white")
      q-toolbar
        q-btn(dense flat round icon="menu" @click="left = !left")
        q-btn(
          key="logo"
          flat
          no-caps
          no-wrap
          :to="{name:'home'}"
        )
          q-avatar(rounded size="md")
            img(src="~/assets/yapawa-logo.svg")
          q-toolbar-title(shrink v-if="$q.screen.gt.sm") Yapawa - Content

    q-drawer(show-if-above v-model="left" side="left" bordered)

    q-drawer(v-model="right" side="right" bordered)

    q-page-container
      router-view
</template>

<script>
export default {
  data () {
    return {
      left: false,
      right: false
    }
  }
}
</script>

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
        q-space
        content-actions
        profile-menu.q-ml-sm

    q-drawer(show-if-above v-model="left" side="left" bordered)

    q-drawer(v-model="right" side="right" bordered)

    q-page-container
      router-view
    fetch-albums-tree
</template>

<script>
import ContentActions from 'components/ContentActions'
import ProfileMenu from 'components/ProfileMenu'
import FetchAlbumsTree from 'components/FetchAlbumsTree'

export default {
  data () {
    return {
      left: false,
      right: false
    }
  },
  components: {
    ContentActions,
    ProfileMenu,
    FetchAlbumsTree
  },
  beforeCreate () {
    let locale = this.$q.localStorage.getItem('userLocale') || this.$q.lang.isoName
    this.$Amplify.Auth.currentAuthenticatedUser()
      .then(user => {
        if (user.attributes && user.attributes.locale) {
          locale = user.attributes.locale
          this.$q.localStorage.set('userLocale', locale)
        }
        this.setLocale(locale)
      })
      .catch(() => {
        this.setLocale(locale)
      })
  },
  methods: {
    setLocale: function (locale) {
      this.$i18n.locale = locale
      this.$Amplify.I18n.setLanguage(locale.substring(0, 2).toLowerCase())
      // load the Quasar language pack dynamically
      import(`quasar/lang/${locale}`).then(({ default: messages }) => {
        this.$q.lang.set(messages)
      })
    }
  }
}
</script>

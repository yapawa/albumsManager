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
      y-tree

    q-page-container
      router-view
    fetch-albums-tree
</template>

<script>
import ContentActions from 'components/ContentActions'
import ProfileMenu from 'components/ProfileMenu'
import FetchAlbumsTree from 'components/FetchAlbumsTree'
import YTree from 'components/Tree'

export default {
  data () {
    return {
    }
  },
  components: {
    ContentActions,
    ProfileMenu,
    FetchAlbumsTree,
    YTree
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
  created () {
    this.checkWebpSupport()
    this.setDpr()
    this.setCacheDomain()
  },
  computed: {
    left: {
      get () {
        return this.$store.state.ui.leftDrawerOpen
      },
      set (val) {
        this.$store.commit('ui/leftDrawerOpen', val)
      }
    },
    supportsWebp: {
      get () {
        return this.$store.state.ui.supportsWebp
      },
      set (val) {
        this.$store.commit('ui/supportsWebp', val)
      }
    },
    dpr: {
      get () {
        return this.$store.state.ui.dpr
      },
      set (val) {
        this.$store.commit('ui/dpr', val)
      }
    },
    cacheDomain: {
      get () {
        return this.$store.state.ui.cacheDomain
      },
      set (val) {
        this.$store.commit('ui/cacheDomain', val)
      }
    }
  },
  methods: {
    setLocale: function (locale) {
      this.$i18n.locale = locale
      this.$Amplify.I18n.setLanguage(locale.substring(0, 2).toLowerCase())
      // load the Quasar language pack dynamically
      import(`quasar/lang/${locale}`).then(({ default: messages }) => {
        this.$q.lang.set(messages)
      })
    },
    checkWebpSupport () {
      if (!self.createImageBitmap) {
        this.supportsWebp = false
        return false
      }
      const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA='
      return fetch(webpData).then(r => {
        return r.blob().then(blob => {
          return createImageBitmap(blob).then(() => {
            this.supportsWebp = true
            return true
          }, () => {
            this.supportsWebp = false
            return false
          })
        })
      })
    },
    setDpr () {
      let dpr = 1
      if (devicePixelRatio) {
        dpr = devicePixelRatio
      } else if (window.devicePixelRatio) {
        dpr = window.devicePixelRatio
      }
      this.dpr = parseFloat(parseFloat(dpr).toFixed(1))
    },
    setCacheDomain () {
      let cacheDomain = null
      try {
        const config = require('src/config/config.json')
        cacheDomain = config.cacheDomain
      } catch (err) {
        console.error(err)
      }
      this.cacheDomain = cacheDomain
    }
  }
}
</script>

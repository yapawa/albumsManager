<template lang="pug">
  q-page(padding)
    .window-height.window-width.column.items-center
      .col-auto.q-mb-md
        q-btn-toggle(
          flat
          color="white"
          toggle-color="yellow"
          v-model='locale'
          @input="setLocale"
          :options="[{ label: 'De', value: 'de'},{ label: 'En', value: 'en-us'},{ label: 'Fr', value: 'fr'}]"
        )
      amplify-authenticator(:key="locale" v-if="!signedIn" :authConfig="authConfig")
      amplify-sign-out(:key="locale" v-if="signedIn")
</template>

<script>
export default {
  name: 'Auth',
  data () {
    return {
      locale: this.$q.localStorage.getItem('userLocale') || this.$q.lang.isoName,
      signedIn: false,
      authConfig: {
        signUpConfig: {
          hiddenDefaults: [
            'phone_number'
          ]
        },
        signInConfig: {
          isSignUpDisplayed: false
        }
      }
    }
  },
  methods: {
    setLocale (locale) {
      // set the Vue-i18n locale
      this.$i18n.locale = locale
      this.$Amplify.I18n.setLanguage(locale.substring(0, 2).toLowerCase())
      this.$q.localStorage.set('userLocale', locale)
      // load the Quasar language pack dynamically
      import(`quasar/lang/${locale}`).then(({ default: messages }) => {
        this.$q.lang.set(messages)
      })
    }
  },
  created () {
    this.$AmplifyEventBus.$on('authState', info => {
      if (info === 'signedIn') {
        this.signedIn = true
        const goTo = this.$q.sessionStorage.getItem('redirectPath')
        this.$q.sessionStorage.remove('redirectPath')
        if (goTo) {
          this.$router.replace({ path: goTo }).catch()
        } else {
          if (this.$router.currentRoute.name !== 'home') {
            this.$router.replace({ name: 'home' }).catch()
          }
        }
      } else {
        this.signedIn = false
      }
    })
    this.setLocale(this.locale)
  },
  beforeCreate () {
    this.$Amplify.Auth.currentAuthenticatedUser()
      .then(user => {
        this.$router.push({ name: 'home' }).catch()
      })
      .catch()
  }
}
</script>

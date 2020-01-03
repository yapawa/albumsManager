<template lang="pug">
  q-page(padding)
    .window-height.window-width.row.justify-center.items-center
      amplify-authenticator(v-if="!signedIn" :authConfig="authConfig")
      amplify-sign-out(v-if="signedIn")
</template>

<script>
export default {
  name: 'Auth',
  data () {
    return {
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

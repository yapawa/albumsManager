<template lang="pug">
  q-btn(icon="account_circle" flat dense)
    q-tooltip {{ $t('Account') }}
    q-menu
      q-list
        q-item(clickable v-ripple :to="{name: 'profile'}")
          q-item-section(avatar)
            q-icon(name="settings")
          q-item-section
            q-item-label {{ $t('Profile') }}
            q-item-label(caption) {{ $t('View your profile') }}
        q-item(clickable v-ripple @click="apiBuildAll")
          q-item-section(avatar)
            q-icon(name="publish")
          q-item-section
            q-item-label {{ $t('Generate API Data') }}
            q-item-label(caption) {{ $t('Build all Albums') }}
        q-item(clickable v-ripple @click="signOut")
          q-item-section(avatar)
            q-icon(name="exit_to_app")
          q-item-section
            q-item-label {{ $t('Sign Out') }}
</template>

<script>
import BuildApi from 'src/mixins/buildApi'

export default {
  name: 'ProfileMenu',
  mixins: [
    BuildApi
  ],
  methods: {
    signOut: function (event) {
      this.$Amplify.Auth.signOut()
        .then(() => {
          this.$AmplifyEventBus.$emit('authState', 'signedOut')
          this.$router.replace({ name: 'auth' })
        })
        .catch()
    }
  }
}
</script>

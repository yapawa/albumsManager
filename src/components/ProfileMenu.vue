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
        q-item(clickable v-ripple @click="signOut")
          q-item-section(avatar)
            q-icon(name="exit_to_app")
          q-item-section
            q-item-label {{ $t('Sign Out') }}
</template>

<script>
export default {
  name: 'ProfileMenu',
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

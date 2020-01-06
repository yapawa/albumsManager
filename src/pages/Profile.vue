<template lang="pug">
  q-page.row.justify-center(padding)
    .col(v-if="user" style="max-width:450px;width:100%")
      .text-h4.q-mb-md {{ $t('Profile') }}
      .column.items-center.full-width.q-gutter-md
        q-card.col.full-width(bordered)
          q-card-section.text-h6 {{ $t('Language') }}
          q-card-section(v-if="localeError")
            q-banner.bg-negative(rounded)
              .text-h6 {{ localeError.name }}
              .text-italic {{ localeError.message }}
          q-card-section
            q-select(
              v-model="locale"
              :options="langOptions"
              :label="$t('Language')"
              outlined
              emit-value
              map-options
              options-dense
            )
          q-card-actions(align="right")
            q-btn.q-px-md(:label="$t('Update')" color="primary" text-color="black" @click="updateLanguage" :disable="!canUpdateLocale")
        q-card.col.full-width(bordered)
          q-card-section.text-h6 {{ $t('Password') }}
          q-card-section(v-if="passwordError")
            q-banner.bg-negative(rounded)
              .text-h6 {{ passwordError.name }}
              .text-italic {{ passwordError.message }}
          q-card-section(v-if="passwordUpdateSuccess")
            q-banner.bg-positive(rounded) {{ $t('Password updated') }}
          q-card-section.q-gutter-md(v-if="!passwordUpdateSuccess")
            q-input(
              outlined
              v-model="oldPassword"
              type="password"
              :label="$t('Old Password')"
            )
            q-input(
              outlined
              v-model="newPassword"
              type="password"
              :label="$t('New Password')"
            )
            q-input(
              outlined
              v-model="newPasswordRepeat"
              type="password"
              :label="$t('Repeat New Password')"
              :rules="[val => val === this.newPassword || $t('Passwords don\\'t match')]"
              lazy-rules
            )
          q-card-actions(v-if="!passwordUpdateSuccess" align="right")
            q-btn.q-px-md(:label="$t('Update')" color="primary" text-color="black" @click="updatePassword" :disable="!canUpdatePassword")
</template>

<script>
import languages from 'quasar/lang/index.json'
const appLanguages = languages.filter(lang =>
  ['de', 'en-us', 'fr'].includes(lang.isoName)
)
export default {
  name: 'Profile',
  data () {
    return {
      locale: this.$q.localStorage.getItem('userLocale'),
      user: null,
      oldPassword: null,
      newPassword: null,
      newPasswordRepeat: null,
      localeError: null,
      passwordError: null,
      passwordUpdateSuccess: false
    }
  },
  computed: {
    canUpdateLocale () {
      if (this.locale !== this.user.attributes.locale) {
        return true
      }
      return false
    },
    canUpdatePassword () {
      if (this.oldPassword) {
        if (this.newPassword && this.newPasswordRepeat) {
          if (this.newPassword === this.newPasswordRepeat) {
            return true
          }
        }
      }
      return false
    }
  },
  methods: {
    updateLanguage () {
      this.$Amplify.Auth.currentAuthenticatedUser()
        .then(user => {
          return this.$Amplify.Auth.updateUserAttributes(user, {
            locale: this.locale
          })
            .then(res => {
              if (res === 'SUCCESS') {
                this.user.attributes.locale = this.locale
                this.$i18n.locale = this.locale
                this.$Amplify.I18n.setLanguage(this.locale.substring(0, 2).toLowerCase())
                this.$q.localStorage.set('userLocale', this.locale)
                // load the Quasar language pack dynamically
                import(`quasar/lang/${this.locale}`).then(({ default: messages }) => {
                  this.$q.lang.set(messages)
                })
              }
            })
        }).catch(err => {
          this.localeError = err
        })
    },
    updatePassword () {
      this.passwordError = null
      this.$Amplify.Auth.currentAuthenticatedUser()
        .then(user => {
          return this.$Amplify.Auth.changePassword(user, this.oldPassword, this.newPassword)
            .then(res => {
              if (res === 'SUCCESS') {
                this.passwordUpdateSuccess = true
              }
              this.oldPassword = null
              this.newPassword = null
              this.newPasswordRepeat = null
              return res
            })
        })
        .catch(err => {
          this.passwordError = err
          this.oldPassword = null
          this.newPassword = null
          this.newPasswordRepeat = null
        })
    }
  },
  created () {
    this.$Amplify.Auth.currentAuthenticatedUser()
      .then(user => {
        this.user = user
      })
      .catch(() => {
        this.$router.push({ name: 'auth' })
      })
    this.langOptions = appLanguages.map(lang => ({
      label: lang.nativeName, value: lang.isoName
    }))
  }
}
</script>

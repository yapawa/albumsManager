import { date } from 'quasar'

export default {
  methods: {
    cacheUrl (photo, options) {
      return this.yapawaCache(photo, options)
    },
    yapawaCache (photo, options) {
      try {
        if (this.dpr > 1 && !options.dpr) {
          options.dpr = this.dpr
        }
        const format = this.supportsWebp ? 'webp' : 'jpg'
        const version = date.formatDate(photo.updatedAt, 'X')
        const transformations = Object.keys(options).map(key => `${key}_${options[key]}`.toLowerCase()).sort().join(',')
        const path = `${photo.file.key}/${version}/${transformations}/${photo.slug}.${format}`
        return `https://${this.cacheDomain}/${path}`
      } catch (err) {
        this.$Logger.error('thumbnails.js::yapawaCache', err)
        return null
      }
    }
  },
  computed: {
    supportsWebp () {
      return this.$store.state.ui.supportsWebp
    },
    dpr () {
      return this.$store.state.ui.dpr
    },
    cacheDomain () {
      return this.$store.state.ui.cacheDomain
    }
  }
}

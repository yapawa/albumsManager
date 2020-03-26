import { LocalStorage } from 'quasar'

export default function () {
  return {
    leftDrawerOpen: true,
    supportsWebp: false,
    dpr: 1,
    cacheDomain: null,
    lastUpdate: LocalStorage.getItem('lastUpdate') || 0,
    lastPublish: LocalStorage.getItem('lastPublish') || 0
  }
}

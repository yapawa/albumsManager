import { LocalStorage } from 'quasar'

export const leftDrawerOpen = (state, val) => {
  state.leftDrawerOpen = (val === true)
}

export const supportsWebp = (state, val) => {
  state.supportsWebp = (val === true)
}

export const dpr = (state, val) => {
  state.dpr = parseFloat(parseFloat(val).toFixed(1))
}

export const cacheDomain = (state, val) => {
  state.cacheDomain = val.trim()
}

export const lastUpdate = (state) => {
  const d = new Date()
  const n = d.getTime()
  LocalStorage.set('lastUpdate', n)
  state.lastUpdate = n
}

export const lastPublish = (state) => {
  const d = new Date()
  const n = d.getTime()
  LocalStorage.set('lastPublish', n)
  state.lastPublish = n
}

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

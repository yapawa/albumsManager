export const leftDrawerOpen = (state, val) => {
  state.leftDrawerOpen = (val === true)
}
export const rightDrawerOpen = (state, val) => {
  state.rightDrawerOpen = (val === true)
}

export const actionsDrawerContent = (state, val) => {
  state.actionsDrawerContent = val
}

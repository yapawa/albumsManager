export const updateList = (state, list) => {
  state.list = [...list]
}
export const active = (state, album) => {
  state.active = album
}

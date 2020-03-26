export const hasUpdate = (state) => {
  return state.lastUpdate > state.lastPublish
}

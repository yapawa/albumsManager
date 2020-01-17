import Vue from 'vue'
import Vuex from 'vuex'

import albums from './albums'
import ui from './ui'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      albums,
      ui
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  /*
      if we want some HMR magic for it, we handle
      the hot update like below. Notice we guard this
      code with "process.env.DEV" -- so this doesn't
      get into our production build (and it shouldn't).
    */

  if (process.env.DEV && module.hot) {
    module.hot.accept(['./albums', './ui'], () => {
      const newAlbums = require('./albums').default
      const newUi = require('./ui').default
      Store.hotUpdate({ modules: { albums: newAlbums, ui: newUi } })
    })
  }

  return Store
}

import { extend } from 'quasar'
import { albumOrder } from 'src/lib/ordering'

const hasActive = (state) => {
  if (state.active && state.active.id) {
    return true
  }
  return false
}

export const activeId = state => {
  if (hasActive(state)) {
    return state.active.id
  }
  return null
}

export const canAddPhotos = state => {
  if (hasActive(state)) {
    return true
  }
  return false
}

export const canAddAlbum = state => {
  if (hasActive(state)) {
    if (state.active.type === 'collection') {
      return true
    }
    return false
  }
  return true
}

export const hasRoot = state => {
  const root = state.list.filter(el => el.id === 'root')
  return (root.length > 0)
}

export const tree = state => {
  const list = extend(true, [], state.list)
  return listToTree(list)
}

const listToTree = (list) => {
  const tree = []
  const mappedArr = {}
  let arrElem = null
  let mappedElem = null

  for (let i = 0; i < list.length; i++) {
    arrElem = list[i]
    mappedArr[arrElem.id] = arrElem
  }

  for (const id in mappedArr) { // eslint-disable-line no-unused-vars
    if (Object.prototype.hasOwnProperty.call(mappedArr, id)) {
      mappedElem = mappedArr[id]
      if (mappedElem.parentId !== '-') {
        if (!Object.prototype.hasOwnProperty.call(mappedArr[mappedElem.parentId], 'children')) {
          mappedArr[mappedElem.parentId].children = []
        }
        mappedArr[mappedElem.parentId].children.push(mappedElem)
        mappedArr[mappedElem.parentId].children.sort(albumOrder(mappedArr[mappedElem.parentId].orderBy, mappedArr[mappedElem.parentId].orderDirection))
      } else {
        tree.push(mappedElem)
        tree.sort(albumOrder('order', 'asc'))
      }
    }
  }
  return tree
}

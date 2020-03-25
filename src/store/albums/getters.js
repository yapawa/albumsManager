import { extend } from 'quasar'
import { albumOrder } from 'src/utils/ordering'

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
    return state.active.type === 'album'
  }
  return false
}

export const canEditAlbum = state => {
  return hasActive(state)
}

export const canDeleteAlbum = state => {
  if (hasActive(state)) {
    if (state.active.type === 'collection') {
      return state.active.childrenCount === 0
    } else {
      return true
    }
  }
  return false
}

export const canAddAlbum = state => {
  if (hasActive(state)) {
    return state.active.type === 'collection'
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
        tree.sort(albumOrder(mappedElem.orderBy, mappedElem.orderDirection))
      }
    }
  }
  return tree
}

const getPath = (index, leaf) => {
  return index[leaf] ? getPath(index, index[leaf]).concat([leaf]) : [leaf]
}

export const breadcrumbs = state => {
  const list = extend(true, [], state.list)
  const index = []
  for (let i = 0; i < list.length; i++) {
    if (list[i].parentId !== '-') {
      index[list[i].id] = list[i].parentId
    }
  }
  return leaf => getPath(index, leaf)
}

export const countSiblings = state => parentId => {
  const list = extend(true, [], state.list)
  return list.filter(l => l.parentId === parentId).length
}

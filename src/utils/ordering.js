'use strict'

export const albumOrder = (field, direction) => {
  if (field === null) {
    field = 'createdAt'
  }
  if (direction === null) {
    direction = 'desc'
  }
  direction = direction.toLowerCase()
  let asc = 1
  let desc = -1
  if (direction !== 'desc') {
    asc = -1
    desc = 1
  }
  const orderFct = (a, b) => {
    if (a[field] === b[field]) {
      return 0
    }
    return (a[field] < b[field]) ? asc : desc
  }
  return orderFct
}

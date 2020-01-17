const albumFields = [
  'id',
  'name',
  'parentId',
  'covers',
  'position',
  'slug',
  'description',
  'summary',
  'type',
  'visibility',
  'status',
  'createdAt',
  'publishedAt',
  'updatedAt',
  'orderBy',
  'orderDirection'
]

const photoFields = [
  'id',
  'albumId',
  'position',
  'width',
  'height',
  'contentType',
  'name',
  'description',
  'visibility',
  'status',
  'capturedAt',
  'createdAt',
  'publishedAt',
  'updatedAt'
]

export const createAlbum = `mutation CreateAlbum(
  $input: CreateAlbumInput!
) {
  createAlbum(input: $input) {
    ${albumFields.filter(f => f !== 'updatedAt' || f !== 'createdAt' || f !== 'covers').join('\n')}
  }
}`

export const getAlbum = `query GetAlbum($id: ID!) {
  getAlbum(id: $id) {
    ${albumFields.join('\n')}
    children {
      items {
        ${albumFields.join('\n')}
      }
      nextToken
    }
    photos {
      items {
        ${photoFields.join('\n')}
      }
      nextToken
    }
  }
}`

export const getAlbums = `query GetAlbum($id: ID!) {
  getAlbum(id: $id) {
    children {
      items {
        ${albumFields.join('\n')}
      }
      nextToken
    }
  }
}`
export const getPhotos = `query GetAlbum($id: ID!) {
  getAlbum(id: $id) {
    photos {
      items {
        ${photoFields.join('\n')}
      }
      nextToken
    }
  }
}`

export const onCreateAlbum = `subscription OnCreateAlbum {
  onCreateAlbum {
    ${albumFields.join('\n')}
  }
}`

export const onUpdateAlbum = `subscription OnUpdateAlbum {
  onUpdateAlbum {
    ${albumFields.join('\n')}
  }
}`

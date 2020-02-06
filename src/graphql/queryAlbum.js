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
  `file {
    bucket
    key
    region
  }`,
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
        children {
          items {
            id
          }
        }
        photos {
          items {
            id
          }
        }
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
export const createPhoto = `mutation CreatePhoto(
  $input: CreatePhotoInput!
  $condition: ModelPhotoConditionInput
) {
  createPhoto(input: $input, condition: $condition) {
    ${photoFields.join('\n')}
  }
}`

export const updateAlbum = `mutation UpdateAlbum(
  $input: UpdateAlbumInput!
  $condition: ModelAlbumConditionInput
) {
  updateAlbum(input: $input, condition: $condition) {
    ${albumFields.join('\n')}
  }
}`

export const updatePhoto = `mutation UpdatePhoto(
  $input: UpdatePhotoInput!
  $condition: ModelPhotoConditionInput
) {
  updatePhoto(input: $input, condition: $condition) {
    ${photoFields.join('\n')}
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

export const onCreatePhoto = `subscription OnCreatePhoto {
  onCreatePhoto {
    ${photoFields.join('\n')}
  }
}`

export const onUpdatePhoto = `subscription OnUpdatePhoto {
  onUpdatePhoto {
    ${photoFields.join('\n')}
  }
}`
export const onDeletePhoto = /* GraphQL */ `
subscription OnDeletePhoto {
  onDeletePhoto {
    id
  }
}`

export const deletePhoto = `
mutation DeletePhoto(
  $input: DeletePhotoInput!
  $condition: ModelPhotoConditionInput
) {
  deletePhoto(input: $input, condition: $condition) {
    id
  }
}`

/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createAlbum = `mutation CreateAlbum(
  $input: CreateAlbumInput!
  $condition: ModelAlbumConditionInput
) {
  createAlbum(input: $input, condition: $condition) {
    id
    name
    parent {
      id
      name
      parent {
        id
        name
        parentId
        covers
        position
        slug
        description
        summary
        type
        visibility
        status
        createdAt
        publishedAt
        updatedAt
        orderBy
        orderDirection
      }
      parentId
      children {
        nextToken
      }
      photos {
        nextToken
      }
      covers
      position
      slug
      description
      summary
      type
      visibility
      status
      createdAt
      publishedAt
      updatedAt
      orderBy
      orderDirection
    }
    parentId
    children {
      items {
        id
        name
        parentId
        covers
        position
        slug
        description
        summary
        type
        visibility
        status
        createdAt
        publishedAt
        updatedAt
        orderBy
        orderDirection
      }
      nextToken
    }
    photos {
      items {
        id
        albumId
        position
        width
        height
        contentType
        name
        description
        visibility
        status
        capturedAt
        createdAt
        publishedAt
        updatedAt
      }
      nextToken
    }
    covers
    position
    slug
    description
    summary
    type
    visibility
    status
    createdAt
    publishedAt
    updatedAt
    orderBy
    orderDirection
  }
}
`;
export const updateAlbum = `mutation UpdateAlbum(
  $input: UpdateAlbumInput!
  $condition: ModelAlbumConditionInput
) {
  updateAlbum(input: $input, condition: $condition) {
    id
    name
    parent {
      id
      name
      parent {
        id
        name
        parentId
        covers
        position
        slug
        description
        summary
        type
        visibility
        status
        createdAt
        publishedAt
        updatedAt
        orderBy
        orderDirection
      }
      parentId
      children {
        nextToken
      }
      photos {
        nextToken
      }
      covers
      position
      slug
      description
      summary
      type
      visibility
      status
      createdAt
      publishedAt
      updatedAt
      orderBy
      orderDirection
    }
    parentId
    children {
      items {
        id
        name
        parentId
        covers
        position
        slug
        description
        summary
        type
        visibility
        status
        createdAt
        publishedAt
        updatedAt
        orderBy
        orderDirection
      }
      nextToken
    }
    photos {
      items {
        id
        albumId
        position
        width
        height
        contentType
        name
        description
        visibility
        status
        capturedAt
        createdAt
        publishedAt
        updatedAt
      }
      nextToken
    }
    covers
    position
    slug
    description
    summary
    type
    visibility
    status
    createdAt
    publishedAt
    updatedAt
    orderBy
    orderDirection
  }
}
`;
export const deleteAlbum = `mutation DeleteAlbum(
  $input: DeleteAlbumInput!
  $condition: ModelAlbumConditionInput
) {
  deleteAlbum(input: $input, condition: $condition) {
    id
    name
    parent {
      id
      name
      parent {
        id
        name
        parentId
        covers
        position
        slug
        description
        summary
        type
        visibility
        status
        createdAt
        publishedAt
        updatedAt
        orderBy
        orderDirection
      }
      parentId
      children {
        nextToken
      }
      photos {
        nextToken
      }
      covers
      position
      slug
      description
      summary
      type
      visibility
      status
      createdAt
      publishedAt
      updatedAt
      orderBy
      orderDirection
    }
    parentId
    children {
      items {
        id
        name
        parentId
        covers
        position
        slug
        description
        summary
        type
        visibility
        status
        createdAt
        publishedAt
        updatedAt
        orderBy
        orderDirection
      }
      nextToken
    }
    photos {
      items {
        id
        albumId
        position
        width
        height
        contentType
        name
        description
        visibility
        status
        capturedAt
        createdAt
        publishedAt
        updatedAt
      }
      nextToken
    }
    covers
    position
    slug
    description
    summary
    type
    visibility
    status
    createdAt
    publishedAt
    updatedAt
    orderBy
    orderDirection
  }
}
`;
export const createPhoto = `mutation CreatePhoto(
  $input: CreatePhotoInput!
  $condition: ModelPhotoConditionInput
) {
  createPhoto(input: $input, condition: $condition) {
    id
    album {
      id
      name
      parent {
        id
        name
        parentId
        covers
        position
        slug
        description
        summary
        type
        visibility
        status
        createdAt
        publishedAt
        updatedAt
        orderBy
        orderDirection
      }
      parentId
      children {
        nextToken
      }
      photos {
        nextToken
      }
      covers
      position
      slug
      description
      summary
      type
      visibility
      status
      createdAt
      publishedAt
      updatedAt
      orderBy
      orderDirection
    }
    albumId
    position
    file {
      bucket
      key
      region
    }
    width
    height
    contentType
    name
    description
    visibility
    status
    capturedAt
    createdAt
    publishedAt
    updatedAt
  }
}
`;
export const updatePhoto = `mutation UpdatePhoto(
  $input: UpdatePhotoInput!
  $condition: ModelPhotoConditionInput
) {
  updatePhoto(input: $input, condition: $condition) {
    id
    album {
      id
      name
      parent {
        id
        name
        parentId
        covers
        position
        slug
        description
        summary
        type
        visibility
        status
        createdAt
        publishedAt
        updatedAt
        orderBy
        orderDirection
      }
      parentId
      children {
        nextToken
      }
      photos {
        nextToken
      }
      covers
      position
      slug
      description
      summary
      type
      visibility
      status
      createdAt
      publishedAt
      updatedAt
      orderBy
      orderDirection
    }
    albumId
    position
    file {
      bucket
      key
      region
    }
    width
    height
    contentType
    name
    description
    visibility
    status
    capturedAt
    createdAt
    publishedAt
    updatedAt
  }
}
`;
export const deletePhoto = `mutation DeletePhoto(
  $input: DeletePhotoInput!
  $condition: ModelPhotoConditionInput
) {
  deletePhoto(input: $input, condition: $condition) {
    id
    album {
      id
      name
      parent {
        id
        name
        parentId
        covers
        position
        slug
        description
        summary
        type
        visibility
        status
        createdAt
        publishedAt
        updatedAt
        orderBy
        orderDirection
      }
      parentId
      children {
        nextToken
      }
      photos {
        nextToken
      }
      covers
      position
      slug
      description
      summary
      type
      visibility
      status
      createdAt
      publishedAt
      updatedAt
      orderBy
      orderDirection
    }
    albumId
    position
    file {
      bucket
      key
      region
    }
    width
    height
    contentType
    name
    description
    visibility
    status
    capturedAt
    createdAt
    publishedAt
    updatedAt
  }
}
`;

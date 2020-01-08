/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getAlbum = `query GetAlbum($id: ID!) {
  getAlbum(id: $id) {
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
export const listAlbums = `query ListAlbums(
  $filter: ModelAlbumFilterInput
  $limit: Int
  $nextToken: String
) {
  listAlbums(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
  }
}
`;
export const getPhoto = `query GetPhoto($id: ID!) {
  getPhoto(id: $id) {
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
export const listPhotos = `query ListPhotos(
  $filter: ModelPhotoFilterInput
  $limit: Int
  $nextToken: String
) {
  listPhotos(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      album {
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
    nextToken
  }
}
`;

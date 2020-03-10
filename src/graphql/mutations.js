/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const buildTree = `mutation BuildTree {
  buildTree
}
`;
export const buildAlbum = `mutation BuildAlbum($id: String) {
  buildAlbum(id: $id)
}
`;
export const buildAll = `mutation BuildAll {
  buildAll
}
`;
export const rotatePhoto = `mutation RotatePhoto($key: String, $angle: Int) {
  rotatePhoto(key: $key, angle: $angle)
}
`;
export const createAlbum = `mutation CreateAlbum($input: CreateAlbumInput!) {
  createAlbum(input: $input) {
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
        contentCountTotal
        contentCountPublic
      }
      children {
        nextToken
      }
      contentCountTotal
      contentCountPublic
      photos {
        nextToken
      }
    }
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
        contentCountTotal
        contentCountPublic
      }
      nextToken
    }
    contentCountTotal
    contentCountPublic
    photos {
      items {
        id
        albumId
        position
        width
        height
        size
        contentType
        name
        slug
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
}
`;
export const deleteAlbum = `mutation DeleteAlbum($input: DeleteAlbumInput!) {
  deleteAlbum(input: $input) {
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
        contentCountTotal
        contentCountPublic
      }
      children {
        nextToken
      }
      contentCountTotal
      contentCountPublic
      photos {
        nextToken
      }
    }
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
        contentCountTotal
        contentCountPublic
      }
      nextToken
    }
    contentCountTotal
    contentCountPublic
    photos {
      items {
        id
        albumId
        position
        width
        height
        size
        contentType
        name
        slug
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
}
`;
export const createPhoto = `mutation CreatePhoto($input: CreatePhotoInput!) {
  createPhoto(input: $input) {
    id
    albumId
    position
    file {
      bucket
      key
      region
    }
    width
    height
    size
    contentType
    name
    slug
    description
    visibility
    status
    capturedAt
    createdAt
    publishedAt
    updatedAt
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
        contentCountTotal
        contentCountPublic
      }
      children {
        nextToken
      }
      contentCountTotal
      contentCountPublic
      photos {
        nextToken
      }
    }
  }
}
`;
export const updatePhoto = `mutation UpdatePhoto($input: UpdatePhotoInput!) {
  updatePhoto(input: $input) {
    id
    albumId
    position
    file {
      bucket
      key
      region
    }
    width
    height
    size
    contentType
    name
    slug
    description
    visibility
    status
    capturedAt
    createdAt
    publishedAt
    updatedAt
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
        contentCountTotal
        contentCountPublic
      }
      children {
        nextToken
      }
      contentCountTotal
      contentCountPublic
      photos {
        nextToken
      }
    }
  }
}
`;
export const deletePhoto = `mutation DeletePhoto($input: DeletePhotoInput!) {
  deletePhoto(input: $input) {
    id
    albumId
    position
    file {
      bucket
      key
      region
    }
    width
    height
    size
    contentType
    name
    slug
    description
    visibility
    status
    capturedAt
    createdAt
    publishedAt
    updatedAt
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
        contentCountTotal
        contentCountPublic
      }
      children {
        nextToken
      }
      contentCountTotal
      contentCountPublic
      photos {
        nextToken
      }
    }
  }
}
`;
export const updateAlbum = `mutation UpdateAlbum($input: UpdateAlbumInput!) {
  updateAlbum(input: $input) {
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
        contentCountTotal
        contentCountPublic
      }
      children {
        nextToken
      }
      contentCountTotal
      contentCountPublic
      photos {
        nextToken
      }
    }
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
        contentCountTotal
        contentCountPublic
      }
      nextToken
    }
    contentCountTotal
    contentCountPublic
    photos {
      items {
        id
        albumId
        position
        width
        height
        size
        contentType
        name
        slug
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
}
`;

/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getAlbum = /* GraphQL */ `
  query GetAlbum($id: ID!) {
    getAlbum(id: $id) {
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
export const listAlbums = /* GraphQL */ `
  query ListAlbums(
    $filter: ModelAlbumFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAlbums(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
      nextToken
    }
  }
`;
export const getPhoto = /* GraphQL */ `
  query GetPhoto($id: ID!) {
    getPhoto(id: $id) {
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
export const listPhotos = /* GraphQL */ `
  query ListPhotos(
    $filter: ModelPhotoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPhotos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
          contentCountTotal
          contentCountPublic
        }
      }
      nextToken
    }
  }
`;

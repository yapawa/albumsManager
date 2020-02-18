/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createAlbum = /* GraphQL */ `
  mutation CreateAlbum(
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
          contentCountTotal
          contentCountPublic
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
        contentCountTotal
        contentCountPublic
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
          contentCountTotal
          contentCountPublic
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
`;
export const updateAlbum = /* GraphQL */ `
  mutation UpdateAlbum(
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
          contentCountTotal
          contentCountPublic
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
        contentCountTotal
        contentCountPublic
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
          contentCountTotal
          contentCountPublic
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
`;
export const deleteAlbum = /* GraphQL */ `
  mutation DeleteAlbum(
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
          contentCountTotal
          contentCountPublic
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
        contentCountTotal
        contentCountPublic
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
          contentCountTotal
          contentCountPublic
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
`;
export const createPhoto = /* GraphQL */ `
  mutation CreatePhoto(
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
          contentCountTotal
          contentCountPublic
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
        contentCountTotal
        contentCountPublic
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
  }
`;
export const updatePhoto = /* GraphQL */ `
  mutation UpdatePhoto(
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
          contentCountTotal
          contentCountPublic
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
        contentCountTotal
        contentCountPublic
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
  }
`;
export const deletePhoto = /* GraphQL */ `
  mutation DeletePhoto(
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
          contentCountTotal
          contentCountPublic
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
        contentCountTotal
        contentCountPublic
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
  }
`;

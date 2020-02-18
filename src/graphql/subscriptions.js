/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateAlbum = /* GraphQL */ `
  subscription OnCreateAlbum {
    onCreateAlbum {
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
export const onUpdateAlbum = /* GraphQL */ `
  subscription OnUpdateAlbum {
    onUpdateAlbum {
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
export const onDeleteAlbum = /* GraphQL */ `
  subscription OnDeleteAlbum {
    onDeleteAlbum {
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
export const onCreatePhoto = /* GraphQL */ `
  subscription OnCreatePhoto {
    onCreatePhoto {
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
export const onUpdatePhoto = /* GraphQL */ `
  subscription OnUpdatePhoto {
    onUpdatePhoto {
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
export const onDeletePhoto = /* GraphQL */ `
  subscription OnDeletePhoto {
    onDeletePhoto {
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

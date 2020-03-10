/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateAlbum = /* GraphQL */ `
  subscription OnCreateAlbum {
    onCreateAlbum {
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
export const onUpdateAlbum = /* GraphQL */ `
  subscription OnUpdateAlbum {
    onUpdateAlbum {
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
export const onDeleteAlbum = /* GraphQL */ `
  subscription OnDeleteAlbum {
    onDeleteAlbum {
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
export const onCreatePhoto = /* GraphQL */ `
  subscription OnCreatePhoto {
    onCreatePhoto {
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
export const onUpdatePhoto = /* GraphQL */ `
  subscription OnUpdatePhoto {
    onUpdatePhoto {
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
export const onDeletePhoto = /* GraphQL */ `
  subscription OnDeletePhoto {
    onDeletePhoto {
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

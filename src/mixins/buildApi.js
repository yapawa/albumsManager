const buildTree = `
  mutation BuildTree {
    buildTree
  }
`
export const buildAlbum = `
  mutation BuildAlbum($id: String) {
    buildAlbum(id: $id)
  }
`
export const buildAll = `
  mutation BuildAll {
    buildAll
  }
`

export default {
  methods: {
    apiBuildTree () {
      return this.$Amplify.API.graphql(
        this.$Amplify.graphqlOperation(buildTree)
      ).then(res => {
        return res
      })
    },
    apiBuildAlbum (albumId) {
      return this.$Amplify.API.graphql(
        this.$Amplify.graphqlOperation(buildAlbum, { id: albumId })
      ).then(res => {
        return res
      })
    },
    apiBuildAll () {
      return this.$Amplify.API.graphql(
        this.$Amplify.graphqlOperation(buildAll)
      ).then(res => {
        return res
      })
    }
  }
}

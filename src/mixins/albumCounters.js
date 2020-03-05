import { countContent, updateAlbum } from 'src/graphql/queryAlbum'
import BuildApi from 'src/mixins/buildApi'
export default {
  mixins: [
    BuildApi
  ],
  methods: {
    countContent (albumId) {
      return this.$Amplify.API.graphql(
        this.$Amplify.graphqlOperation(countContent, { id: albumId })
      ).then(({ data }) => {
        const totalCount = data.getAlbum.children.items.length + data.getAlbum.photos.items.length
        const publicCount = data.getAlbum.children.items.filter(el => el.visibility === 'public' && el.status === 'published').length + data.getAlbum.photos.items.filter(el => el.visibility === 'public' && el.status === 'published').length
        return {
          totalCount,
          publicCount
        }
      })
    },
    updateCounters (albumId) {
      return this.countContent(albumId).then(({ totalCount, publicCount }) => {
        const input = {
          id: albumId,
          contentCountTotal: parseInt(totalCount),
          contentCountPublic: parseInt(publicCount)

        }
        return this.$Amplify.API.graphql(
          this.$Amplify.graphqlOperation(updateAlbum, { input })
        )
          .then(res => {
            return this.apiBuildTree()
          })
          .then(res => {
            return this.apiBuildAlbum(albumId)
          })
      })
    }
  }
}

import { updateAlbum } from 'src/graphql/queryAlbum'

const getCovers = `query GetAlbum($id: ID!) {
  getAlbum(id: $id) {
    covers
  }
}`
export default {
  name: 'YAlbumCoversUpdate',
  data () {
    return {
      maxCovers: 4
    }
  },
  methods: {
    updateCovers (albumId, covers) {
      const input = {
        id: albumId,
        covers: JSON.stringify(covers)
      }
      this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(updateAlbum, { input }))
    },
    addPhotoToCovers (albumId, photo) {
      this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(getCovers, { id: albumId }))
        .then(res => {
          return JSON.parse(res.data.getAlbum.covers) || []
        })
        .then(covers => {
          if (covers.length < this.maxCovers) {
            const existingIds = covers.map(item => item.id)
            if (existingIds.indexOf(photo.id) === -1) {
              covers.push(photo)
              this.updateCovers(albumId, covers)
            }
          }
        })
    }
  }
}

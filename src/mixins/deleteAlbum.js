import { getAlbum, deletePhoto, deleteAlbum } from 'src/graphql/queryAlbum'
import AlbumCounters from 'src/mixins/albumCounters'

export default {
  mixins: [
    AlbumCounters
  ],
  methods: {
    deleteAlbumAndPhotos (id, parentId) {
      return this.$Amplify.API.graphql(
        this.$Amplify.graphqlOperation(getAlbum, { id })
      ).then(res => {
        const deletePhotos = []
        for (let i = 0; i < res.data.getAlbum.photos.items.length; i++) {
          const photoId = res.data.getAlbum.photos.items[i].id
          const delPhoto = this.$Amplify.API.graphql(
            this.$Amplify.graphqlOperation(deletePhoto, { input: { id: photoId } })
          )
          deletePhotos.push(delPhoto)
        }
        return Promise.all(deletePhotos).then(res => {
          return this.$Amplify.API.graphql(
            this.$Amplify.graphqlOperation(deleteAlbum, { input: { id } })
          ).then(res => {
            this.updateCounters(parentId)
            return true
          })
        })
      })
    }
  },
  computed: {
    activeAlbum () {
      return this.$store.state.albums.active
    }
  }
}

import { extend } from 'quasar'

const fields = [
  'id',
  'name',
  'parentId',
  'visibility',
  'status',
  'position',
  'type',
  'createdAt',
  'updatedAt',
  'publishedAt',
  'orderBy',
  'orderDirection',
  'contentCountTotal',
  'contentCountPublic'
]
const listAlbums = `query ListAlbums(
  $filter: ModelAlbumFilterInput
  $limit: Int
  $nextToken: String
) {
  listAlbums(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      ${fields.join('\n')}
    }
    nextToken
  }
}
`
const onCreateAlbum = `subscription OnCreateAlbum {
  onCreateAlbum {
    ${fields.join('\n')}
  }
}
`
const onUpdateAlbum = `subscription OnUpdateAlbum {
  onUpdateAlbum {
    ${fields.join('\n')}
  }
}
`

export default {
  name: 'FetchAlbums',
  data () {
    return {
      subscriptionCreate: null,
      subscriptionUpdate: null
    }
  },
  beforeDestroy () {
    this.subscriptionCreate.unsubscribe()
    this.subscriptionUpdate.unsubscribe()
  },
  created () {
    this.fetchAllAlbums().then(list => {
      this.albumsList = list
    })
    this.subscriptionCreate = this.$Amplify.API.graphql(
      this.$Amplify.graphqlOperation(onCreateAlbum)
    ).subscribe({
      next: (albumData) => {
        const item = albumData.value.data.onCreateAlbum
        const list = extend(true, [], this.albumsList)
        list.push(item)
        this.albumsList = list
      }
    })
    this.subscriptionUpdate = this.$Amplify.API.graphql(
      this.$Amplify.graphqlOperation(onUpdateAlbum)
    ).subscribe({
      next: (albumData) => {
        const item = albumData.value.data.onUpdateAlbum
        const list = extend(true, [], this.albumsList)
        const index = list.findIndex(x => x.id === item.id)
        fields.forEach(field => {
          list[index][field] = item[field]
        })
        this.albumsList = list
      }
    })
  },
  methods: {
    fetchAllAlbums (nextToken = null) {
      return this.fetchAlbums(nextToken)
        .then(({ items, nextToken }) => {
          return nextToken
            ? this.fetchAllAlbums(nextToken)
              .then(x => items.concat(x))
            : items
        })
    },
    fetchAlbums (nextToken) {
      const limit = 1000
      const query = this.$Amplify.graphqlOperation(listAlbums, { limit, nextToken })
      return this.$Amplify.API.graphql(query).then(result => {
        return result.data.listAlbums
      })
    }
  },
  computed: {
    albumsList: {
      get () {
        return this.$store.state.albums.list
      },
      set (val) {
        this.$store.commit('albums/updateList', val)
      }
    }
  },
  render () {
    return ''
  }
}

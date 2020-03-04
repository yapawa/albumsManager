/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var apiContentGraphQLAPIIdOutput = process.env.API_CONTENT_GRAPHQLAPIIDOUTPUT
var apiContentGraphQLAPIEndpointOutput = process.env.API_CONTENT_GRAPHQLAPIENDPOINTOUTPUT
var hostingS3AndCloudFrontHostingBucketName = process.env.HOSTING_S3ANDCLOUDFRONT_HOSTINGBUCKETNAME

Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk')
const region = process.env.REGION
const S3 = new AWS.S3({ region: region, params: { Bucket: process.env.HOSTING_S3ANDCLOUDFRONT_HOSTINGBUCKETNAME } })
const https = require('https')
const UrlParse = require('url').URL
const appsyncUrl = process.env.API_CONTENT_GRAPHQLAPIENDPOINTOUTPUT
const endpoint = new UrlParse(appsyncUrl).hostname.toString()
if (process.env.AWS_PROFILE) {
  AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: process.env.AWS_PROFILE })
}

const getAlbum = `query GetAlbum(
    $id: ID!
    $filter: ModelPhotoFilterInput
  ) {
  getAlbum(id: $id) {
    id
    visibility
    status
    orderBy
    orderDirection
    contentCountTotal
    contentCountPublic
    photos(filter: $filter) {
      items {
        id
        albumId
        file {
          bucket
          key
          region
        }
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
}`

exports.handler = async (event) => {
  if (!process.env.AWS_PROFILE) {
    console.log('event:', JSON.stringify(event, null, 2))
  }
  if (!event.build || event.build !== 'album') {
    return false
  }
  if (!event.id || event.build === '') {
    return false
  }
  const photos = await generateAlbum(event.id)
  const res = await writeS3(`${event.id}/content`, photos)

  const response = {
    statusCode: 201,
    message: 'Album created',
    albumId: event.id,
    album: res
  }
  return JSON.stringify(response)
}

const generateAlbum = async albumId => {
  console.log('Running generateAlbum for ' + albumId)
  let albumData = []
  const filter = {
    visibility: { eq: 'public' },
    status: { eq: 'published' }
  }
  const album = await runRequest(getAlbum, 'GetAlbum', { id: albumId, filter: filter })
  if (!album || !album.getAlbum) {
    return {}
  }
  if (album.getAlbum.visibility === 'public' && album.getAlbum.status === 'published' && album.getAlbum.photos.items.length > 0) {
    albumData = album.getAlbum.photos.items
    albumData.sort(albumOrder(album.getAlbum.orderBy, album.getAlbum.orderDirection))
  }

  removeKeys(albumData, 'id')
  removeKeys(albumData, 'position')
  removeKeys(albumData, 'albumId')
  removeKeys(albumData, 'visibility')
  removeKeys(albumData, 'status')

  return albumData
}

const runRequest = async (query, operation, variables) => {
  const req = new AWS.HttpRequest(appsyncUrl, region)

  req.method = 'POST'
  req.headers.host = endpoint
  req.headers['Content-Type'] = 'application/json'
  req.body = JSON.stringify({
    query: query,
    operationName: operation,
    variables: variables
  })
  return AWS.config.credentials.getPromise().then(async () => {
    const signer = new AWS.Signers.V4(req, 'appsync', true)
    signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate())
    const data = await new Promise((resolve, reject) => {
      let respData = ''
      const httpRequest = https.request({ ...req, host: endpoint }, (result) => {
        result.on('data', (chunk) => {
          respData += chunk.toString()
        })
        result.on('end', () => {
          resolve(JSON.parse(respData.toString()).data)
        })
      })

      httpRequest.write(req.body)
      httpRequest.end()
    })
    return data
  })
}

const albumOrder = (field, direction) => {
  if (field === null) {
    field = 'createdAt'
  }
  if (direction === null) {
    direction = 'desc'
  }
  direction = direction.toLowerCase()
  let asc = 1
  let desc = -1
  if (direction !== 'desc') {
    asc = -1
    desc = 1
  }
  const orderFct = (a, b) => {
    if (a[field] === b[field]) {
      return 0
    }
    return (a[field] < b[field]) ? asc : desc
  }
  return orderFct
}

const removeKeys = (obj, keys) => {
  for (var prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      switch (typeof (obj[prop])) {
      case 'object':
        if (keys.indexOf(prop) > -1) {
          delete obj[prop]
        } else {
          removeKeys(obj[prop], keys)
        }
        break
      default:
        if (keys.indexOf(prop) > -1) {
          delete obj[prop]
        }
        break
      }
    }
  }
}

const writeS3 = async (filename, data) => {
  const key = `api/albums/${filename}`
  const albumId = filename.split('/')[0]
  const params = {
    Key: key,
    ContentType: 'application/json',
    CacheControl: 'max-age=10',
    Body: JSON.stringify(data, null, 2),
    ContentDisposition: `attachment; filename="${albumId}.json"`
  }
  const res = await S3.putObject(params).promise() // eslint-disable-line no-unused-vars
  return `s3://${S3.config.params.Bucket}/${key}`
}

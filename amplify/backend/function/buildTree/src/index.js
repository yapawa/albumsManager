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

const listAlbums = `query ListAlbums(
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
      contentCountTotal
      contentCountPublic
    }
    nextToken
  }
}
`

exports.handler = async (event) => {
  if (!process.env.AWS_PROFILE) {
    console.log('event:', JSON.stringify(event, null, 2))
  }
  if (!event.build || event.build !== 'tree') {
    return false
  }

  const { list, tree } = await generateListAndTree()
  const resList = await writeS3('list', list)
  const resTree = await writeS3('tree', tree)

  const response = {
    statusCode: 201,
    message: 'Tree and List created',
    list: resList,
    tree: resTree
  }
  return JSON.stringify(response)
}

const generateListAndTree = async () => {
  console.log('Running generateListAndTree')
  const list = await getList()
  initPhotoCounter(list)
  calcPhotoCounter(list)
  removeEmpty(list)
  setPath(list)
  coversToObject(list)

  const res = listToTree(list)[0]
  const tree = JSON.parse(JSON.stringify(res))
  removeKeys(tree, 'orderBy')
  removeKeys(tree, 'orderDirection')
  removeKeys(tree, 'parentId')
  removeKeys(tree, 'position')
  removeKeys(tree, 'visibility')
  removeKeys(tree, 'status')
  removeKeys(tree, 'contentCountTotal')

  removeKeys(list, 'children')
  removeKeys(list, 'orderBy')
  removeKeys(list, 'orderDirection')
  removeKeys(list, 'parentId')
  removeKeys(list, 'position')
  removeKeys(list, 'visibility')
  removeKeys(list, 'status')
  removeKeys(list, 'contentCountTotal')

  return { list: list, tree: tree }
}

const getList = async () => {
  const filter = {
    visibility: { eq: 'public' },
    status: { eq: 'published' },
    contentCountPublic: { gt: 0 }
  }
  const list = await runRequest(listAlbums, 'ListAlbums', { filter: filter, limit: 1000 })
  return list.listAlbums.items
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

const initPhotoCounter = list => {
  for (const idx in list) {
    const item = list[idx]
    if (item.type === 'collection') {
      item.sumPublicContent = 0
    } else {
      item.sumPublicContent = item.contentCountPublic
    }
  }
}
const calcPhotoCounter = list => {
  const index = breadcrumbs(list)
  for (const idx in list) {
    const item = list[idx]
    if (item.type === 'album') {
      const path = getPath(index, item.id).slice(0, -1)
      for (const albumId of path) {
        const albumIdx = list.findIndex(obj => obj.id === albumId)
        if (albumIdx > -1) {
          list[albumIdx].sumPublicContent += item.sumPublicContent
        }
      }
    }
  }
}

const setPath = list => {
  const bcIndex = breadcrumbs(list)
  for (const idx in list) {
    const item = list[idx]
    const path = getPath(bcIndex, item.id).slice(0, -1).slice(1)
    list[idx].path = path.map(p => {
      return list.filter(l => l.id === p)[0].slug.toLowerCase()
    })
    list[idx].slug = list[idx].slug.toLowerCase()
  }
}

const getPath = (index, leaf) => {
  return index[leaf] ? getPath(index, index[leaf]).concat([leaf]) : [leaf]
}

const breadcrumbs = list => {
  const tmpList = [...list]
  const index = []
  for (let i = 0; i < tmpList.length; i++) {
    if (tmpList[i].parentId !== '-') {
      index[tmpList[i].id] = tmpList[i].parentId
    }
  }
  return index
}

const coversToObject = list => {
  for (const idx in list) {
    list[idx].covers = JSON.parse(list[idx].covers)
  }
}

const removeEmpty = list => {
  for (const idx in list) {
    const item = list[idx]
    if (item.sumPublicContent <= 0) {
      list.splice(idx, 1)
    }
  }
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
const listToTree = (list) => {
  const tree = []
  const mappedArr = {}
  let arrElem = null
  let mappedElem = null

  for (let i = 0; i < list.length; i++) {
    arrElem = list[i]
    mappedArr[arrElem.id] = arrElem
  }

  for (const id in mappedArr) { // eslint-disable-line no-unused-vars
    if (Object.prototype.hasOwnProperty.call(mappedArr, id)) {
      mappedElem = mappedArr[id]
      if (mappedElem.parentId !== '-') {
        if (!Object.prototype.hasOwnProperty.call(mappedArr[mappedElem.parentId], 'children')) {
          mappedArr[mappedElem.parentId].children = []
        }
        mappedArr[mappedElem.parentId].children.push(mappedElem)
        mappedArr[mappedElem.parentId].children.sort(albumOrder(mappedArr[mappedElem.parentId].orderBy, mappedArr[mappedElem.parentId].orderDirection))
        let weight = 1
        for (const item of mappedArr[mappedElem.parentId].children) {
          const albumId = item.id
          const idx = list.findIndex(obj => obj.id === albumId)
          list[idx].weight = weight
          weight++
        }
      } else {
        tree.push(mappedElem)
        tree.sort(albumOrder(mappedElem.orderBy, mappedElem.orderDirection))
        let weight = 1
        for (const item of tree) {
          const albumId = item.id
          const idx = list.findIndex(obj => obj.id === albumId)
          list[idx].weight = weight
          weight++
        }
      }
    }
  }
  return tree
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

const writeS3 = async (filename, data) => {
  const key = `api/albums/${filename}`
  const params = {
    Key: key,
    ContentType: 'application/json',
    CacheControl: 'max-age=10',
    Body: JSON.stringify(data, null, 2),
    ContentDisposition: `attachment; filename="${filename}.json"`
  }
  const res = await S3.putObject(params).promise() // eslint-disable-line no-unused-vars
  return `s3://${S3.config.params.Bucket}/${key}`
}

/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var storageOriginalsBucketName = process.env.STORAGE_ORIGINALS_BUCKETNAME

Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk')
const region = process.env.REGION
const S3 = new AWS.S3({ region: region })
const Sharp = require('sharp')
const prefix = 'public'

exports.handler = async (event) => {
  console.log('event', JSON.stringify(event, null, 2))

  if (event.typeName !== 'Mutation' || event.fieldName !== 'rotatePhoto') {
    console.log('invalid typeName or fieldName')
    return false
  }
  if (!event.arguments || !event.arguments.key || !event.arguments.angle) {
    console.log('Missing arguments key or angle')
    return false
  }
  const params = {
    Bucket: process.env.STORAGE_ORIGINALS_BUCKETNAME,
    Key: `${prefix}/${event.arguments.key}`
  }
  let sourceData = {}
  const angle = parseInt(event.arguments.angle)
  return S3.getObject(params).promise()
    .then(data => {
      sourceData = data
      return Sharp(data.Body)
        .rotate()
        .withMetadata()
        .toBuffer()
    })
    .then(data => {
      return Sharp(data)
        .rotate(angle)
        .withMetadata()
        .toBuffer()
    })
    .then(data => {
      const putParams = {
        Bucket: process.env.STORAGE_ORIGINALS_BUCKETNAME,
        Key: `${params.Key}`,
        Metadata: sourceData.Metadata,
        ContentType: sourceData.ContentType,
        Body: data
      }
      putParams.Metadata.modifiedat = new Date().toISOString()

      return S3.upload(putParams).promise()
        .then(res => {
          return Sharp(data)
            .metadata()
            .then(metadata => {
              const info = {
                modifiedAt: putParams.Metadata.modifiedat,
                size: metadata.size,
                width: metadata.width,
                height: metadata.height
              }
              return JSON.stringify(info)
            })
        })
        .catch(err => {
          console.log('putobject failed')
          console.error(err)
        })
    })
}

/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var storageOriginalsBucketName = process.env.STORAGE_ORIGINALS_BUCKETNAME

Amplify Params - DO NOT EDIT */
const AWS = require('aws-sdk')
const S3 = new AWS.S3()
const ExifReader = require('exifreader')
const zlib = require('zlib')

exports.handler = async (event) => {
  console.log(JSON.stringify(event, null, 2))

  if (event.s3 && event.s3.object && event.s3.object.key) {
    const params = {
      Key: decodeURIComponent(event.s3.object.key),
      Bucket: event.s3.bucket.name
    }
    return S3.getObject(params).promise()
      .then(data => {
        console.log('source image fetched')
        try {
          return ExifReader.load(data.Body)
        } catch (error) {
          console.log('Error: ' + error.message)
          return null
        }
      })
      .then(exif => {
        console.log('exif data parsed')
        const exifParams = {
          Key: `${decodeURIComponent(event.s3.object.key)}.exif.gz`,
          Bucket: event.s3.bucket.name,
          ContentType: 'application/json',
          ContentEncoding: 'gzip',
          Body: zlib.gzipSync(JSON.stringify(exif, null, 2))
        }
        return S3.putObject(exifParams).promise().then(res => {
          console.log('exif data stored')
          return true
        })
      })
      .catch(err => {
        console.error(err)
        return false
      })
  } else {
    console.log('No processing, event.s3.object.key is missing')
    return false
  }
}

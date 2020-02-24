/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var storageOriginalsBucketName = process.env.STORAGE_ORIGINALS_BUCKETNAME

Amplify Params - DO NOT EDIT */
const AWS = require('aws-sdk')
const S3 = new AWS.S3()
const ExifReader = require('exifreader')

exports.handler = async (event) => {
  console.log(JSON.stringify(event, null, 2))

  if (event.s3 && event.s3.object && event.s3.object.key) {
    const params = {
      Key: decodeURIComponent(event.s3.object.key),
      Bucket: event.s3.bucket.name
    }
    return S3.getObject(params).promise()
      .then(data => {
        try {
          return ExifReader.load(data.Body)
        } catch (error) {
          console.log('Error: ' + error.message)
          return null
        }
      })
      .then(exif => {
        const exifParams = {
          Key: `${decodeURIComponent(event.s3.object.key)}.exif`,
          Bucket: event.s3.bucket.name,
          ContentType: 'application/json',
          Body: JSON.stringify(exif, null, 2)
        }
        return S3.putObject(exifParams).promise()
      })
      .catch(err => {
        console.error(err)
        return false
      })
  }
  return true
}

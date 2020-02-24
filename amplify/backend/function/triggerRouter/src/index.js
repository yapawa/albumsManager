const AWS = require('aws-sdk')
const Lambda = new AWS.Lambda()
const path = require('path')
const imageExtensions = [
  'jpg',
  'jpeg',
  'png',
  'tiff',
  'tif',
  'gif'
]
const env = process.env.ENV

exports.handler = async (event) => {
  console.log(JSON.stringify(event, null, 2))

  for (let i = 0; i < event.Records.length; i++) {
    const item = event.Records[i]
    const key = item.s3.object.key
    const ext = path.extname(key).toLowerCase().replace(/^\./, '')
    const filesize = item.s3.object.size
    if (imageExtensions.includes(ext) && filesize > 5000) {
      const proc = await processImage(item) // eslint-disable-line no-unused-vars
    }
  }
  return true
}

const processImage = async (item) => {
  console.log('call processImage')
  const exifExec = await execParseExif(item) // eslint-disable-line no-unused-vars
  return {
    exif: exifExec
  }
}

const execParseExif = (item) => {
  const params = {
    FunctionName: `exifReader-${env}`,
    InvocationType: 'Event',
    Payload: JSON.stringify(item)
  }
  console.log('call exifReader')
  return Lambda.invoke(params).promise()
}

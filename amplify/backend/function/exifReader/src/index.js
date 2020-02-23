/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var storageOriginalsBucketName = process.env.STORAGE_ORIGINALS_BUCKETNAME

Amplify Params - DO NOT EDIT */

exports.handler = async (event) => {
  console.log(JSON.stringify(event, null, 2))
  // TODO implement
  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!')
  }
  return response
}

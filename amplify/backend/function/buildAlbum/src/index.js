/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var apiContentGraphQLAPIIdOutput = process.env.API_CONTENT_GRAPHQLAPIIDOUTPUT
var apiContentGraphQLAPIEndpointOutput = process.env.API_CONTENT_GRAPHQLAPIENDPOINTOUTPUT
var hostingS3AndCloudFrontHostingBucketName = process.env.HOSTING_S3ANDCLOUDFRONT_HOSTINGBUCKETNAME

Amplify Params - DO NOT EDIT */
exports.handler = async (event) => {
  console.log('event:', JSON.stringify(event, null, 2))
  const response = {
    statusCode: 201,
    message: 'Album created',
    albumId: event.id
  }
  return JSON.stringify(response)
}

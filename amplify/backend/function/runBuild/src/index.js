/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var functionBuildTreeName = process.env.FUNCTION_BUILDTREE_NAME
var functionBuildAlbumName = process.env.FUNCTION_BUILDALBUM_NAME

Amplify Params - DO NOT EDIT */
const Lambda = require('aws-sdk/clients/lambda')
const lambda = new Lambda({ region: process.env.REGION })
const functionBuildTreeName = process.env.FUNCTION_BUILDTREE_NAME
const functionBuildAlbumName = process.env.FUNCTION_BUILDALBUM_NAME

exports.handler = async (event) => {
  console.log('event:', JSON.stringify(event, null, 2))
  const response = {
    statusCode: 400,
    message: 'Something went wrong'
  }
  if (event.typeName === 'Mutation') {
    if (event.fieldName === 'buildTree') {
      return invoke(functionBuildTreeName, { build: 'tree' })
    } else if (event.fieldName === 'buildAlbum') {
      if (event.arguments && event.arguments.id && event.arguments.id.trim()) {
        return invoke(functionBuildAlbumName, { build: 'album', id: event.arguments.id.trim() })
      } else {
        response.message = 'Argument ID is missing'
      }
    } else {
      response.message = `Only fields buildTree and buildAlbum are supported. You sent ${event.fieldName}`
    }
  } else {
    response.message = `Only Mutations are allowed. You sent ${event.typeName}`
  }
  return JSON.stringify(response)
}

const invoke = (fct, payload) => {
  const params = {
    FunctionName: fct,
    InvocationType: 'Event',
    Payload: JSON.stringify(payload)
  }
  return lambda.invoke(params).promise()
    .then(res => {
      const response = {
        statusCode: 202,
        message: `${fct} invoked`
      }
      return JSON.stringify(response)
    })
    .catch(err => {
      const response = {
        statusCode: 400,
        message: `Failed to invoke ${fct}`,
        error: err
      }
      return JSON.stringify(response)
    })
}

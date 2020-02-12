// next.config.js
require('dotenv').config()
const withSass = require('@zeit/next-sass')
const withCSS = require('@zeit/next-css')
const withImages = require('next-images')


const getApiUrl = (env) => {
  switch (env) {
  case 'production':
    return 'https://xeiuqflzpe.execute-api.us-east-1.amazonaws.com/production'

  case 'stage':
    return 'https://b6vuf0u05b.execute-api.us-east-1.amazonaws.com/stage'

  default:
    return 'http://localhost:4000'
  }
}

let config = {
  serverRuntimeConfig: { // Will only be available on the server side
  },    
  publicRuntimeConfig: { // Will be available on both server and client
    NODE_ENV: process.env.NODE_ENV,
    API_URL: getApiUrl(process.env.NODE_ENV),
    TASK_DEFINITION: process.env.TASK_DEFINITION,
    BITBUCKET_BUILD_ID: process.env.BITBUCKET_BUILD_ID,
  },
}

module.exports = withImages(
  withSass(
    withCSS(
      config
    )
  )
)
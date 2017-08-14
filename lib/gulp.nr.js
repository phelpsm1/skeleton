'use strict'

const gulp = require('gulp')
const rp = require('request-promise')
const util = require('gulp-util')

const env = require('./env.js')

gulp.task('nr:record', () => {
  if (!env.isEnvironmentDefined()) {
    util.log(util.colors.yellow(`No environment defined to record deployment to New Relic`))
    return
  }

  let envConfig = env.getEnvironmentConfig()

  if (!envConfig.newrelic || !envConfig.newrelic.id) {
    util.log(util.colors.yellow(`No New Relic Application Id defined to record deployment to New Relic`))
    return
  }

  let revision = process.env.revision

  let options = {
    url: `https://api.newrelic.com/v2/applications/${envConfig.newrelic.id}/deployments.json`,
    proxy: 'http://proxy-us.intel.com:911',
    method: 'POST',
    headers: {
      'x-api-key': '882bb932dad835f2c0f4204b01eaafdcbf6a16ad7af522c'
    },
    body: {
      deployment: {
        revision: revision,
        description: `Upgrading to ${env.getConfig().version} (${revision})`,
        user: process.env.username
      }
    },
    json: true
  }

  return rp(options)
    .then((response) => {
      util.log(util.colors.green(`Recorded deployment to New Relic at ${response.deployment.timestamp}`))
    })
    .catch((err) => {
      util.log(util.colors.red(`Error:`, err))
    })
})

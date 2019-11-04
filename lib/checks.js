'use strict'

const GulpError = require('plugin-error')

const env = require('./env')

function checkForPassword (done) {
  if (!env.isPasswordDefined()) {
    const message = 'Password not specified, e.g. gulp <task> -p <password>'

    throw new GulpError({
      plugin: 'checkForPassword',
      message: message,
      showStack: false
    })
  }

  done()
}

function checkForEnvironment (done) {
  if (!env.isEnvironmentDefined()) {
    const message = 'Environment not specified, e.g. gulp <task> -e dev'

    throw new GulpError({
      plugin: 'checkForEnvironment',
      message: message,
      showStack: false
    })
  }

  done()
}

module.exports = {
  forPassword: checkForPassword,
  forEnvironment: checkForEnvironment
}

'use strict'

const shell = require('shelljs')

// TODO: (jmorris2) Need to error check and what to return if error occurs

function getRevision () {
  return shell
    .exec('git rev-parse --short HEAD', {silent: true})
    .stdout
    .replace(/^\s+|\s+$/g, '')
}

module.exports = {
  getRevision: getRevision
}

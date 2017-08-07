'use strict'

const shell = require('shelljs')

// TODO: (jmorris2) I have not verified that this will work
// TODO: (jmorris2) Need to error check and what to return if error occurs

function getRevision () {
  const matches = shell
    .exec('svn info', {silent: true})
    .stdout
    .match(/(revision[:\s]+)(\d+)/igm, '')

  return (matches && matches.length === 2) ? matches[1] : null
}

module.exports = {
  getRevision: getRevision
}

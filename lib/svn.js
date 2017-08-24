'use strict'

const shell = require('shelljs')

// TODO: (jmorris2) Need to error check and what to return if error occurs

function getRevision () {
  const output = shell
    .exec('svn info', {silent: true})
    .stdout

  let matches = /(revision[:\s]+)(\d+)/igm.exec(output)

  return (matches && matches.length === 3) ? matches[2] : null
}

module.exports = {
  getRevision: getRevision
}

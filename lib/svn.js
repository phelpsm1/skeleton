'use strict'

const shell = require('shelljs')

function isTrunk () {
  const output = shell
    .exec('svn info', {silent: true})
    .stdout

  let matches = /^url:\s*(\S+)$/igm.exec(output)

  return matches && matches.length === 2 && matches[1].toLowerCase().includes('trunk')
}

// TODO: (jmorris2) Need to error check and what to return if error occurs
function getRevision () {
  const output = shell
    .exec('svn info', {silent: true})
    .stdout

  let matches = /(revision[:\s]+)(\d+)/igm.exec(output)

  return (matches && matches.length === 3) ? matches[2] : null
}

module.exports = {
  getRevision: getRevision,
  isTrunk: isTrunk
}

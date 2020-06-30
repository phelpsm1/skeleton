'use strict'

const log = require('fancy-log')
const shell = require('shelljs')

function isGitRepo () {
  const { stdout, stderr, code } = shell
    .exec('git rev-parse --is-inside-work-tree', { silent: true })

  if (code !== 0 || !stdout) {
    log.info(`Not in a git repository: ${stderr}`)
  }

  return code === 0 && stdout === 'true'
}

module.exports = (() => {
  if (isGitRepo()) {
    return require('./gitlocal')
  }

  return require('./gitlab')
})()

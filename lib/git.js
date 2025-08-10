'use strict'

const GulpError = require('plugin-error')

const Gitlab = require('./gitlab')
const Github = require('./github')

function ctor (repository) {
  if (!repository || !repository.url) {
    throw new GulpError({
      plugin: 'git',
      message: 'Missing repository url in package.json',
      showStack: false
    })
  }

  switch (repository.type) {
    case 'git':
      if (repository.url.includes('gitlab')) {
        return Gitlab(repository)
      }

      if (repository.url.includes('github')) {
        return Github(repository)
      }
      break
    default:
      throw new GulpError({
        plugin: 'git',
        message: `Unknown repository provider: ${repository.url}`,
        showStack: false
      })
  }
}

module.exports = ctor

'use strict'

const colors = require('ansi-colors')
const log = require('fancy-log')
const moment = require('moment/moment')
const shell = require('shelljs')

function getCommitUrl (url, sha) {
  return `https://${url}/commit/${sha}`
}

function getCommits (start, end) {
  log.info(colors.gray(`Fetching commits locally`))

  const { stdout, stderr, code } = shell
    .exec(`git log ${start}..${end} --pretty=format:"%h\t%s\t%aN\t%ae\t%aI"`, { silent: true })

  if (code !== 0) {
    log.error(colors.red(`Failed to get changes from ${start} to ${end}: ${stderr}`))
    return []
  }

  if (!stdout) {
    return []
  }

  return stdout.split('\n')
}

function getRepoUrl() {
  const { stdout, stderr, code } = shell
    .exec('git config --get remote.origin.url', { silent: true })

  if (code !== 0 || !stdout) {
    log.warn(colors.yellow(`Failed to get repository url: ${stderr}`))
    return ''
  }

  const url = new URL(stdout)

  return `${url.host}${url.pathname.replace(/.git$/, '')}`
}

const fetch = (start, end) => {
  const commits = getCommits(start, end)
  const repoUrl = getRepoUrl()

  return Promise.resolve(commits
    .filter(c => c && c.length > 0)
    .map(c => {
      const commit = c.split('\t')

      return {
        hash: commit[0],
        message: commit[1],
        url: getCommitUrl(repoUrl, commit[0]),
        author: {
          name: commit[2],
          email: commit[3]
        },
        date: {
          iso: commit[4],
          relative: moment(commit[4]).fromNow()
        }
      }
    })
    .sort((a, b) => {
      // reverse chronological order
      return (a.date.iso > b.date.iso) ? -1 : ((a.date.iso < b.date.iso) ? 1 : 0)
    })
  )
}

function getRevision () {
  const { stdout, stderr, code } = shell
    .exec('git rev-parse --short HEAD', { silent: true })

  if (code !== 0) {
    throw new Error(`Failed to get commit short sha: ${stderr}`)
  }

  return stdout.replace(/^\s+|\s+$/g, '')
}

function isBranch (regex) {
  const { stdout, stderr, code } = shell
    .exec('git symbolic-ref --short HEAD', { silent: true })

  if (code !== 0) {
    throw new Error(`Failed to get branch name: ${stderr}`)
  }

  return !!stdout.match(regex)
}

function isInLocalRepo (checkForLocalRepo = true) {
  if (!checkForLocalRepo) {
    return false
  }

  const { stdout, stderr, code } = shell
    .exec('git rev-parse --is-inside-work-tree', { silent: true })

  if (code !== 0 || !stdout) {
    log.info(colors.gray('Not in a git repository'))
  }

  return code === 0 && stdout.replace(/\s/g, '') === 'true'
}

module.exports = {
  isInLocalRepo: isInLocalRepo,
  isBranch: isBranch,
  revision: {
    get: getRevision
  },
  commits: {
    fetch: fetch
  }
}

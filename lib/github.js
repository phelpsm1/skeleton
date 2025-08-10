'use strict'

const colors = require('ansi-colors')
const got = require('got')
const log = require('fancy-log')
const moment = require('moment')
const HttpsProxyAgent = require('https-proxy-agent')

const base = require('./gitlocal')

const API_VERSION = '2022-11-28'

function buildCompareUrl (url, start, end) {
  const groups = /^\/(.*?)\/(.*?).git$/.exec(new URL(url).pathname)

  const owner = groups[1]
  const repo = groups[2]

  return `https://api.github.com/repos/${owner}/${repo}/compare/${start}...${end}`
}

function getCommits (start, end, options) {
  const url = buildCompareUrl(options.repository.url, start, end)

  log.info(colors.gray(`Fetching commits from ${url}`))

  const gotOptions = {
    agent: {
      https: new HttpsProxyAgent(process.env.https_proxy)
    },
    headers: {
      'Authorization': `Bearer ${options.token}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': API_VERSION
    }
  }

  return got(url, gotOptions)
    .then((response) => {
      return JSON.parse(response.body).commits
    })
}

const fetch = (start, end = 'HEAD', options = {}) => {
  if (!start) {
    throw new Error('Start sha missing')
  }

  if (!end) {
    throw new Error('End sha missing')
  }

  if (base.isInLocalRepo(options.checkForLocalRepo)) {
    return base.commits.fetch(start, end)
  }

  if (!options.repository || !options.repository.url) {
    throw new Error('Repository URL missing')
  }

  if (!options.token || options.token.length === 0) {
    throw new Error('GitHub API token not specified')
  }

  return getCommits(start, end ,options)
    .then((commits) => {
      log.info(colors.green(`Fetch returned ${commits.length} commits`))

      return commits
        .map(c => {
          return {
            hash: c.sha.slice(0,7),
            message: c.commit.message,
            url: c.html_url,
            author: {
              name: c.commit.author.name,
              email: c.commit.author.email
            },
            date: {
              iso: c.commit.author.date,
              relative: moment(c.commit.author.date).fromNow()
            }
          }
        })
        .sort((a, b) => {
          // reverse chronological order
          return (a.date.iso > b.date.iso) ? -1 : ((a.date.iso < b.date.iso) ? 1 : 0)
        })
    })
}

function ctor (repository, check = true) {
  return {
    name: 'github',
    isInLocalRepo: base.isInLocalRepo,
    isBranch: base.isBranch,
    revision: {
      get: base.revision.get
    },
    commits: {
      fetch: fetch
    }
  }
}

module.exports = ctor

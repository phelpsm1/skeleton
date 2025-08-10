'use strict'

const colors = require('ansi-colors')
const got = require('got')
const log = require('fancy-log')
const moment = require('moment')

const base = require('./gitlocal')

// TODO: not right
function buildCommitUrl (sha) {
  const env = require('./env')

  if (!env.pkg || !env.pkg.repository || !env.pkg.repository.url) {
    log.warn(colors.yellow('Failed to get repository url from package.json file'))
    return ''
  }

  return `https://${/(.*):\/\/(.*)\.git/.exec(env.pkg.repository.url)[2]}/commit/${sha}`
}

function getCommits (commits, url, conf) {
  log.info(colors.gray(`Fetching commits from ${url}`))

  const options = {
    headers: {
      'PRIVATE-TOKEN': conf.token
    }
  }

  return got(url, options)
    .then((response) => {
      commits = commits.concat(JSON.parse(response.body))

      // check for link defined? api says there won't be one when done
      const next = response.headers.link
        .split(',')
        .find(links => links.includes('rel="next"'))

      if (next !== undefined) {
        let nextUrl = next.split(';')[0].trim()

        nextUrl = nextUrl.substring(1, nextUrl.length - 1)

        return getCommits(commits, nextUrl, conf)
      } else {
        return commits
      }
    })
}

// TODO: check arguments
const fetch = (start, end, conf) => {
  if (!conf.token || conf.token.length === 0) {
    throw new Error('GitLab token not specified')
  }

  if (!conf.pid) {
    throw new Error('GitLab project id not specified')
  }

  const url = `https://gitlab.devtools.intel.com/api/v4/projects/${(conf.pid)}/repository/commits?per_page=100&ref_name=${start}...${end}`

  let commits = []

  return getCommits(commits, url, conf)
    .then((commits) => {
      log.info(colors.green(`Fetch returned ${commits.length} commits`))

      return commits.map(c => {
        return {
          hash: c.short_id,
          message: c.message,
          url: buildCommitUrl(c.short_id),
          author: {
            name: c.author_name,
            email: c.author_email
          },
          date: {
            iso: c.authored_date,
            relative: moment(c.authored_date).fromNow()
          }
        }
      })
        .sort((a, b) => {
          // reverse chronological order
          return (a.date.iso > b.date.iso) ? -1 : ((a.date.iso < b.date.iso) ? 1 : 0)
        })
    })
    .catch((err) => {
      log.error(colors.red(err))
    })
}

function ctor (repository, check = true) {
  return {
    name: 'gitlab',
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

const colors = require('ansi-colors')
const got = require('got')
const log = require('fancy-log')
const moment = require('moment')

const GulpError = require('plugin-error')

function getCommitUrl (sha) {
  const env = require('./env')

  if (!env.pkg || !env.pkg.repository || !env.pkg.repository.url) {
    log.warn(colors.yellow('Failed to get repository url from package.json file'))
    return ''
  }

  return `https://${/(.*):\/\/(.*)\.git/.exec(env.pkg.repository.url)[2]}/commit/${sha}`
}

function getCommitApiUrl (pid, start, end) {
  const apiurl = 'https://gitlab.devtools.intel.com/api/v4'

  return `${apiurl}/projects/${pid}/repository/commits?ref_name=${start}...${end}`
}

const fetch = (start, end, options) => {
  if (!options.token || options.token.length === 0) {
    const message = 'GitLab token not specified'

    throw new GulpError({
      plugin: 'gitlab',
      message: message,
      showStack: false
    })
  }

  if (!options.pid) {
    const message = 'GitLab project id not specified'

    throw new GulpError({
      plugin: 'gitlab',
      message: message,
      showStack: false
    })
  }

  const gotOptions = {
    headers: {
      'PRIVATE-TOKEN': options.token
    }
  }

  const url = getCommitApiUrl(options.pid, start, end)

  log.info(colors.gray(`Fetching commits from ${url}`))

  return got(url, gotOptions)
    .json()
    .then((commits) => {
      log.info(colors.green(`Fetch returned ${commits.length} commits`))
      return commits.map(c => {
        return {
          hash: c.id,
          message: c.message,
          url: getCommitUrl(c.short_id),
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
    })
    .catch((err) => {
      log.error(colors.red(err))
    })
}

function notImplemented () {
  throw new GulpError({
    plugin: 'gitlab',
    message: 'Function not implemented',
    showStack: false
  })
}

module.exports = {
  isBranch: notImplemented,
  revision: {
    get: notImplemented
  },
  commits: {
    fetch: fetch
  }
}

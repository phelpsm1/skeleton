const colors = require('ansi-colors')
const log = require('fancy-log')
const shell = require('shelljs')

function getCommitUrl (sha) {
  const { stdout, stderr, code } = shell
    .exec('git config --get remote.origin.url', { silent: true })

  if (code !== 0 || !stdout) {
    log.warn(colors.yellow(`Failed to get repository url: ${stderr}`))
    return ''
  }

  return `https://${/(.*):\/\/(.*)\.git/.exec(stdout)[2]}/commit/${sha}`
}

const fetch = (start, end) => {
  const { stdout, stderr, code } = shell
    .exec(`git log ${start}..${end} --pretty=format:"%h\t%s\t%aN\t%ae\t%aI"`, { silent: true })

  if (code !== 0) {
    log.error(colors.red(`Failed to get changes from ${start} to ${end}: ${stderr}`))
    return []
  }

  if (!stdout) {
    return []
  }

  return Promise.resolve(stdout.split('\n')
    .filter(c => c && c.length > 0)
    .map(c => {
      const commit = c.split('\t')

      return {
        hash: commit[0],
        message: commit[1],
        url: getCommitUrl(commit[0]),
        author: {
          name: commit[2],
          email: commit[3]
        },
        date: {
          iso: commit[4]
        }
      }
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

  return stdout.match(regex)
}

module.exports = {
  isBranch: isBranch,
  revision: {
    get: getRevision
  },
  commits: {
    fetch: fetch
  }
}

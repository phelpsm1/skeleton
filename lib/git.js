'use strict'

const shell = require('shelljs')

function getRevision () {
  const { stdout, stderr, code } = shell
    .exec('git rev-parse --short HEAD', {silent: true})

  if (code !== 0) {
    throw new Error(`Failed to get commit short sha: ${stderr}`)
  }

  return stdout.replace(/^\s+|\s+$/g, '')
}

function getCommits (start, end) {
  const { stdout, stderr, code } = shell
    .exec(`git log ${start}..${end} --pretty=format:"%h\t%s\t%aN\t%ae\t%aI\t%ar"`, {silent: true})

  if (code !== 0) {
    throw new Error(`Failed to get changes from ${start} to ${end}: ${stderr}`)
  }

  if (!stdout) {
    return []
  }

  return stdout.split('\n')
    .filter(c => c && c.length > 0)
    .map(c => {
      let commit = c.split('\t')

      return {
        hash: commit[0],
        message: commit[1],
        author: {
          name: commit[2],
          email: commit[3]
        },
        date: {
          iso: commit[4],
          relative: commit[5]
        }
      }
    })
}

function isBranch (regex) {
  const { stdout, stderr, code } = shell
    .exec(`git symbolic-ref --short HEAD`, {silent: true})

  if (code !== 0) {
    throw new Error(`Failed to get branch name: ${stderr}`)
  }

  return stdout.match(regex)
}

module.exports = {
  getRevision: getRevision,
  getCommits: getCommits,
  isBranch: isBranch
}

'use strict'

const util = require('gulp-util')
const minimist = require('minimist')
const path = require('path')

const svn = require('./svn.js')
const git = require('./git.js')

const pkg = require(path.join(process.cwd(), 'package.json'))

function parse () {
  let args = minimist(process.argv.slice(2))

  if (typeof process.env.tasks === 'undefined') {
    process.env.tasks = args._.join(' ')
  }

  // force, i.e. can restore to production
  if (args.force) {
    process.env.force = true
  }

  // get the target, i.e. dev, int, prod
  let env = 'local'

  if (args.e) {
    if (Object.keys(pkg.appSettings).includes(args.e)) {
      env = args.e
    } else {
      if (args.e === true) {
        util.log(util.colors.yellow(`environment not specified, e.g. -e dev, setting to local`))
      } else {
        util.log(util.colors.yellow(`environment ${args.e} not defined, setting to local`))
      }
    }
  }

  process.env.target = env

  // get the password off the command line
  if (args.p) {
    process.env.password = args.p
  }

  // get the database name off the command line
  if (args.d) {
    process.env.database = args.d
  }

  // get the revision off the command line, if provided, else fetch most recent commit from svn or git
  let revision

  if (args.r) {
    if (args.r.toString().match(/(^[0-9A-F.-]+$)/ig) === null) {
      throw new util.PluginError('env', `revision ${args.r} is malformed`)
    }
    revision = args.r
  } else {
    revision = git.getRevision() || svn.getRevision()
  }

  process.env.revision = revision

  process.env.args = args
}

function getEnvironmentConfig (name) {
  if (!pkg || !pkg.appSettings) {
    return {}
  }

  return pkg.appSettings[name || process.env.target]
}

function getDbsConfig (name, env) {
  let target = name

  if (target) {
    return getEnvironmentConfig(env).dbs.find((db) => { return db.name === target })
  }

  return getEnvironmentConfig(env).dbs
}

function getDbsToBackup () {
  return getDbsConfig().filter((db) => {
    if ((process.env.database && db.name !== process.env.database)) {
      return false // database is not the one specified on the command line
    }

    if (typeof (db.backup) !== 'undefined' && !db.backup) {
      return false // database configured not to be backed up
    }

    return true
  })
}

function getDbsToRestore () {
  return getDbsConfig().filter((db) => {
    if ((process.env.database && db.name !== process.env.database)) {
      return false // database is not the one specified on the command line
    }

    if (typeof (db.restore) !== 'undefined' && !db.restore) {
      return false // database configured not to be restored
    }

    return true
  })
}

function getTestConfig () {
  let test = {
    src: 'Tests'
  }

  return test
}

function getWebConfig (server) {
  let web = getEnvironmentConfig().web

  if (!web.src) {
    web.src = 'Web'
  }

  if (server) {
    let share = path.join(`//${server}`, `${pkg.pillar}$`, pkg.name)

    web.share = share

    web.current = {
      root: path.join(share, process.env.target, 'current'),
      dest: path.join(share, process.env.target, 'current', 'Web'),
      path: path.join(share, process.env.target, 'current', 'Web')
    }

    web.release = {
      root: path.join(share, process.env.target, 'releases'),
      dest: path.join(share, process.env.target, 'releases', process.env.revision, 'Web')
    }

    web.shared = {
      root: path.join(share, process.env.target, 'shared'),
      logs: path.join(share, process.env.target, 'shared', 'log')
    }
  }

  return web
}

function isEnvironmentDefined () {
  return process.env.target !== 'local'
}

function is (target) {
  return process.env.target === target
}

function isPasswordDefined () {
  return process.env.password && process.env.password.length !== 0
}

module.exports = (() => {
  parse()

  return {
    pkg: pkg,
    getEnvironmentConfig: getEnvironmentConfig,
    getDbsConfig: getDbsConfig,
    getDbsToBackup: getDbsToBackup,
    getDbsToRestore: getDbsToRestore,
    getWebConfig: getWebConfig,
    getTestConfig: getTestConfig,
    isEnvironmentDefined: isEnvironmentDefined,
    is: is,
    isPasswordDefined: isPasswordDefined
  }
})()

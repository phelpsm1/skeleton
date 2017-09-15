'use strict'

const util = require('gulp-util')
const minimist = require('minimist')
const path = require('path')

const svn = require('./svn.js')
const git = require('./git.js')

const pkg = require(path.join(process.cwd(), 'package.json'))

function parse (argv, config) {
  let key
  let args = minimist(argv.slice(2))

  if (typeof process.env.tasks === 'undefined') {
    process.env.tasks = args._.join(' ')
  }

  // force, i.e. can restore to production
  if (args.force) {
    process.env.force = true
  }

  // get the target, i.e. dev, int, prod
  if (args.e) {
    let definedEnvs = []
    let cfg = config.appSettings

    for (key in cfg) {
      if (cfg.hasOwnProperty(key)) {
        definedEnvs.push(key)
      }
    }

    let env = args.e

    if (definedEnvs.includes(env)) {
      process.env.target = env
    } else {
      if (env === true) {
        util.log(util.colors.yellow(`environment not specified, e.g. -e dev`))
      } else {
        util.log(util.colors.yellow(`environment ${env} not defined`))
      }
    }
  }

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

  // find the correct app settings
  process.env.config = JSON.stringify(config)
}

function getTarget () {
  if (!process.env.target || process.env.target.length === 0) {
    return 'local'
  }

  return process.env.target
}

function getConfig () {
  return JSON.parse(process.env.config)
}

function getEnvironmentConfig (name) {
  let config = getConfig()

  if (!config || !config.appSettings) {
    return {}
  }

  return config.appSettings[name || getTarget()]
}

function getDbsConfig (name, env) {
  let target = name || process.env.database

  if (target) {
    return getEnvironmentConfig(env).dbs.find((db) => { return db.name === target })
  }

  return getEnvironmentConfig(env).dbs
}

function getWebConfig (server) {
  let web = getEnvironmentConfig().web

  if (server) {
    web.share = `//${server}/${pkg.pillar}$`

    web.current = {
      root: path.join(`//${server}`, `${pkg.pillar}$`, pkg.name, getTarget(), 'current'),
      dest: path.join(`//${server}`, `${pkg.pillar}$`, pkg.name, getTarget(), 'current', 'Web'),
      path: path.join('/', pkg.name, getTarget(), 'current', 'Web')
    }

    web.release = {
      root: path.join(`//${server}`, `${pkg.pillar}$`, pkg.name, getTarget(), 'releases'),
      dest: path.join(`//${server}`, `${pkg.pillar}$`, pkg.name, getTarget(), 'releases', process.env.revision, 'Web')
    }

    web.shared = {
      root: path.join(`//${server}`, `${pkg.pillar}$`, pkg.name, getTarget(), 'shared'),
      logs: path.join(`//${server}`, `${pkg.pillar}$`, pkg.name, getTarget(), 'shared', 'log')
    }
  }

  return web
}

function isEnvironmentDefined () {
  return process.env.target && process.env.target.length !== 0
}

function isProduction () {
  return process.env.target === 'prod'
}

function isPasswordDefined () {
  return process.env.password && process.env.password.length !== 0
}

module.exports = {
  getTarget: getTarget,
  getConfig: getConfig,
  getEnvironmentConfig: getEnvironmentConfig,
  getDbsConfig: getDbsConfig,
  getWebConfig: getWebConfig,
  parse: parse,
  isEnvironmentDefined: isEnvironmentDefined,
  isProduction: isProduction,
  isPasswordDefined: isPasswordDefined
}

'use strict'

const util = require('gulp-util')

const svn = require('./svn.js')
const git = require('./git.js')

const cfg = require('../config.json')
const pkg = require('../package.json')

function parse (args, config) {
  let key

  if (typeof process.env.tasks === 'undefined') {
    process.env.tasks = args._.join(' ')
  }

  let targets = []

  let definedEnvs = []

  for (key in config) {
    if (config.hasOwnProperty(key)) {
      definedEnvs.push(key)
    }
  }

  let envs = args.e ? args.e.split(/\s+/) : []

  for (let i = 0; i < envs.length; i++) {
    if (!definedEnvs.includes(envs[i])) {
      throw new util.PluginError('env', `environment ${envs[i]} not defined`)
    }

    targets.push(envs[i])
  }

  process.env.targets = targets.join(' ')

  // get the password off the command line
  if (args.p) {
    process.env.password = args.p
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
}

function getName () {
  if (process.env.targets.length === 0) {
    return 'local'
  }

  return process.env.targets.split(' ')[0]
}

function getConfig () {
  return cfg[getName()]
}

function getPackageConfig () {
  return pkg
}

function isEnvironmentDefined () {
  return process.env.targets.length !== 0
}

function isProduction () {
  return process.env.targets[0] === 'prod'
}

function isPasswordDefined () {
  return process.env.password && process.env.password.length !== 0
}

module.exports = {
  getName: getName,
  getConfig: getConfig,
  getPackageConfig: getPackageConfig,
  parse: parse,
  isEnvironmentDefined: isEnvironmentDefined,
  isProduction: isProduction,
  isPasswordDefined: isPasswordDefined
}

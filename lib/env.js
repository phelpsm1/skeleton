'use strict'

const capitalize = require('capitalize')
const colors = require('ansi-colors')
const log = require('fancy-log')
const moment = require('moment')
const path = require('path')
const PluginError = require('plugin-error')
const rc = require('rc')

const git = require('./git.js')

const pkg = require(path.join(process.cwd(), 'package.json'))

function getArgs () {
  const args = rc('skeleton')

  if (args.configs) {
    log.info(colors.gray(`.skeletonrc found at: ${args.configs}`))
  }

  return args
}

function parse () {
  const args = getArgs()

  if (typeof process.env.tasks === 'undefined') {
    process.env.tasks = args._.join(' ')
  }

  // sql server certificate name for pillar, e.g. CcsdCapacityCert2020Apr
  process.env.sqlservercertificatename = `Ccsd${capitalize(pkg.pillar)}${process.env.sqlservercertificatesuffix || 'Cert2020Apr'}`

  // --force: can restore to production
  if (args.force) {
    process.env.force = true
  }

  // -e: get the target, i.e. dev, int, prod
  let env = 'local'

  if (args.e) {
    if (Object.keys(pkg.appSettings).includes(args.e)) {
      env = args.e
    } else {
      if (args.e === true) {
        log.warn(colors.yellow('environment not specified, e.g. -e dev, setting to local'))
      } else {
        log.warn(colors.yellow(`environment ${args.e} not defined, setting to local`))
      }
    }
  }

  process.env.target = env

  // -p: get the password off the command line
  if (args.p) {
    process.env.password = args.p
  }

  // -d: get the database name off the command line
  if (args.d) {
    process.env.database = args.d
  }

  // -r: get the revision off the command line, if provided, else use name of current directory
  const isValidRevision = /(^[0-9A-F.-]+$)/ig

  const { revision, source } =
    // from the command line argument
    (() => {
      if (args.r) {
        if (args.r.toString().match(isValidRevision) === null) {
          throw new PluginError('env', `revision ${args.r} is malformed`)
        }

        return { revision: args.r, source: 'local' }
      }

      return false
    })() ||
    // from the cc.rb build label
    (() => {
      const label = getCcBuildLabel()

      if (!label) {
        return false
      }

      return { revision: label, source: 'ci' }
    })() ||
    // from the directory name
    (() => {
      const dir = process.cwd().split(path.sep).pop()

      if (dir.match(isValidRevision) === null) {
        return false
      }
      return { revision: dir, source: 'ci' }
    })() ||
    // from the git revision
    (() => {
      try {
        const revision = git.getRevision()

        return { revision: revision, source: 'local' }
      } catch (error) {
        return false
      }
    })() ||
    { revision: null, source: null }

  if (revision) {
    log.info(colors.green(`Revision set to: ${revision}`))
  }

  process.env.revision = revision
  process.env.source = source

  // TODO: (jmorris2) verify if label is needed
  // get the label of the build 1) off the command line, 2) CC.rb build label, 3) scm revision
  process.env.label = args.l || getCcBuildLabel() || process.env.revision
}

function getEnvironments () {
  if (!pkg || !pkg.appSettings) {
    return []
  }

  return Object.keys(pkg.appSettings)
}

function getEnvironmentConfig (name) {
  if (!pkg || !pkg.appSettings) {
    return {}
  }

  return pkg.appSettings[name || process.env.target]
}

function getDbsConfig (name, env) {
  const target = name

  const dbs = getEnvironmentConfig(env).dbs

  dbs.forEach((db) => {
    if (!('backup' in db)) {
      db.backup = false
    }

    if (!('restore' in db)) {
      db.restore = false
    }

    if (!('secure' in db)) {
      db.secure = true
    }
  })

  return target ? dbs.find((db) => { return db.name === target }) : dbs
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
  const test = getEnvironmentConfig('unit')

  if (!test.src) {
    test.src = 'Tests'
  }

  return test
}

function getWebConfig (server) {
  const web = getEnvironmentConfig().web

  if (!web.src) {
    web.src = 'Web'
  }

  if (!web.clean) {
    web.clean = {}
  }

  if (!web.clean.releases) {
    web.clean.releases = 5
  }

  if (!web.clean.logs || (Object.keys(web.clean.logs).length === 0 && web.clean.logs.constructor === Object)) {
    web.clean.logs = { days: 30 }
  }

  if (server) {
    const share = path.join(`//${server}`, `${pkg.pillar}$`, pkg.name)

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

function getBuildConfig () {
  function getVersion () {
    const split = pkg.version.split('.')

    return `${split[0]}.${split[1]}`
  }

  return {
    tools: {
      version: 'auto'
    },
    configuration: 'Release',
    company: 'Intel Corporation',
    copyright: `Copyright Intel Corporation ${moment().year()}`,
    product: pkg.name,
    version: getVersion(),
    fileVersion: pkg.version
  }
}

function getCcBuildLabel () {
  const label = process.env.CC_BUILD_LABEL

  if (!label) {
    return
  }

  const revision = label.substring(0, 7)
  const subBuild = label.match(/[.]\d+$/i) || []

  return revision + (subBuild[0] || '')
}

function isEnvironmentDefined () {
  return getArgs().e
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
    getArgs: getArgs,
    getEnvironments: getEnvironments,
    getEnvironmentConfig: getEnvironmentConfig,
    getDbsConfig: getDbsConfig,
    getDbsToBackup: getDbsToBackup,
    getDbsToRestore: getDbsToRestore,
    getWebConfig: getWebConfig,
    getTestConfig: getTestConfig,
    getBuildConfig: getBuildConfig,
    isEnvironmentDefined: isEnvironmentDefined,
    is: is,
    isPasswordDefined: isPasswordDefined
  }
})()

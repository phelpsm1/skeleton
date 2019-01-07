'use strict'

const colors = require('ansi-colors')
const fs = require('fs-extra')
const log = require('fancy-log')
const path = require('path')
const PluginError = require('plugin-error')
const through = require('through2')
const username = require('username')
const xml2js = require('xml2js')

const env = require('./env')
const data = require('./data')

function xmlToJson (file) {
  let result

  xml2js.parseString(file.contents.toString(), (err, res) => {
    if (err) {
      // TODO: (jmorris2) do I throw a PluginError or some other error here?
      throw new PluginError('files', `unable to parse xml in ${file.relative}`)
    }

    result = res
  })

  return result
}

function jsonToXml (json) {
  return Buffer.from(new xml2js.Builder().buildObject(json))
}

function getValue (value) {
  let i
  let matches = []
  let re = /\${\s*([a-z,\s]*)\s*}/ig

  while (i = re.exec(value)) {
    matches.push(i[1])
  }

  // no ${} in value, just return value
  if (matches.length === 0) {
    return value
  }

  let results = []

  matches.forEach((token) => {
    switch (token.toLowerCase()) {
      case 'me':
        results.push(username.sync())
        break
      default:
        env.pkg.contributors
          .filter((c) => c.role && c.role.toLowerCase() === token.toLowerCase())
          .map((c) => c.email)
          .forEach((c) => results.push(c))
    }
  })

  return results.join(',')
}

function setAppSetting (json, key, value) {
  let obj = json.find(i => i.$.key === key)

  // TODO: (jmorris2) if key is not found, throw error or add it?
  if (!obj) {
    // throw new PluginError('copy', `AppSettings ${key} not found`)
    obj = { $: { key: key } }
    json.push(obj)
  }

  let result = getValue(value)

  log.info(`......${key} to ${result}`)

  obj.$.value = result
}

function setAppSettings (json, configuration, pkg) {
  let config = configuration['config']

  if (!config) {
    log.warn(colors.yellow(`No AppSettings set due to no appSettings["<env>"]["config"] configuration data defined in package.json`))
    return
  }

  if (typeof (json.configuration['appSettings'][0]) !== 'object' && !Array.isArray(json.configuration['appSettings'][0].add)) {
    json.configuration['appSettings'][0] = { add: [] }
  }

  let adds = json.configuration['appSettings'][0].add

  log.info(`...appSettings...`)

  if (config.appSettings) {
    Object.keys(config.appSettings).forEach((k) => {
      setAppSetting(adds, k, config.appSettings[k])
    })
  }

  let environment = process.env.target

  setAppSetting(adds, 'Environment', environment)
  setAppSetting(adds, 'Version', pkg.version)
  setAppSetting(adds, 'Revision', process.env.revision)
  setAppSetting(adds, 'DeployDateTime', Date.now())
}

function setLog4NetAppenderSetting (appenders, name, key, value) {
  let appender = appenders.find(i => i.$.name === name)

  if (!appender) {
    // TODO: (jmorris2) do I throw a PluginError or some other error here?
    throw new PluginError('files', `AppSettings ${key} not found`)
  }

  let result = getValue(value)

  log.info(`.........${key} to ${result}`)

  appender.param.find((param) => param.$.name.toLowerCase() === key.toLowerCase()).$.value = result
}

function setLog4NetAppenderSettings (json, configuration) {
  let config = configuration['config']

  if (!json.configuration.log4net[0].appender || json.configuration.log4net[0].appender.length === 0) {
    log.warn(colors.yellow(`No Log4Net appender settings to update`))
    return
  }

  if (!config.log4net.appenders || config.log4net.appenders.length === 0) {
    log.warn(colors.yellow(`No Log4Net appender settings set due to no appSettings["<env>"]["config"]["log4net"]["appenders"] configuration data defined in package.json`))
    return
  }

  let appenders = json.configuration.log4net[0].appender

  config.log4net.appenders.forEach((appender) => {
    log.info(`......${appender.name} appender...`)
    Object.keys(appender).filter((key) => key !== 'name').forEach((key) => {
      if (key.toLowerCase() === 'connectionstring') {
        let db = configuration.dbs.find((db) => { return db.name === appender[key] })

        if (!db) {
          log.warn(colors.yellow(`No Log4Net db setting set due to no appSettings["<env>"]["config"]["log4net"] configuration data defined in package.json`))
          return
        }

        setLog4NetAppenderSetting(appenders, appender.name, key, data.buildConnectionString(db))
      } else {
        setLog4NetAppenderSetting(appenders, appender.name, key, appender[key])
      }
    })
  })
}

function setLog4NetLoggerSetting (loggers, name, key, value) {
  let logger = (name !== 0) ? loggers.find(i => i.$.name === name) : loggers[0]

  if (!logger) {
    // TODO: (jmorris2) do I throw a PluginError or some other error here?
    throw new PluginError('files', `Logger not found`)
  }

  let result = getValue(value)

  log.info(`.........${key} to ${result}`)

  logger[key][0].$.value = result
}

function setLog4NetLoggerSettings (json, configuration) {
  let config = configuration['config']

  if (!json.configuration.log4net[0].root) {
    log.warn(colors.yellow(`No Log4Net root logger settings to update`))
    return
  }

  if (!config.log4net || !config.log4net.root) {
    log.warn(colors.yellow(`No Log4Net root logger settings set due to no appSettings["<env>"]["config"]["log4net"]["root"] configuration data defined in package.json`))
    return
  }

  let root = json.configuration.log4net[0].root

  log.info(`......root logger...`)

  Object.keys(config.log4net.root).forEach((key) => {
    setLog4NetLoggerSetting(root, 0, key, config.log4net.root[key])
  })

  // other loggers
  if (!json.configuration.log4net[0].logger || json.configuration.log4net[0].logger.length === 0) {
    log.warn(colors.yellow(`No Log4Net logger settings to update`))
    return
  }

  if (!config.log4net.loggers || config.log4net.loggers.length === 0) {
    log.warn(colors.yellow(`No Log4Net logger settings set due to no appSettings["<env>"]["config"]["log4net"]["loggers"] configuration data defined in package.json`))
    return
  }

  let loggers = json.configuration.log4net[0].logger

  config.log4net.loggers.forEach((logger) => {
    log.info(`......${logger.name} logger...`)
    Object.keys(logger).filter((key) => key !== 'name').forEach((key) => {
      setLog4NetLoggerSetting(loggers, logger.name, key, logger[key])
    })
  })
}

function setLog4NetSettings (json, configuration) {
  let config = configuration['config']

  if (!config) {
    log.warn(colors.yellow(`No Log4Net settings set due to no appSettings["<env>"]["config"] configuration data defined in package.json`))
    return
  }

  if (!json.configuration.log4net) {
    log.warn(colors.yellow(`No Log4Net settings to update`))
    return
  }

  log.info(`...log4net...`)

  setLog4NetAppenderSettings(json, configuration)
  setLog4NetLoggerSettings(json, configuration)
}

function setSystemWebSettings (json, configuration) {
  let config = configuration['config']

  if (!config) {
    log.warn(colors.yellow(`No SystemWebSettings set due to no appSettings["<env>"]["config"] configuration data defined in package.json`))
    return
  }

  if (config['system.web'] === undefined ||
    config['system.web'].compilation === undefined ||
    config['system.web'].compilation.debug === undefined) {
    return
  }

  log.info(`...system.web...`)
  log.info(`......debug to ${config['system.web'].compilation.debug}`)

  json.configuration['system.web'][0].compilation[0].$.debug = config['system.web'].compilation.debug
}

function setConnectionString (json, name, connectionString) {
  let obj = json.find(i => i.$.name === name)

  // TODO: (jmorris2) if name is not found, throw error or add it?
  if (!obj) {
    // throw new PluginError('copy', `AppSettings ${name} not found`)
    obj = { $: { name: name } }
    json.push(obj)
  }

  log.info(`......${name} to ${connectionString}`)

  obj.$.connectionString = connectionString
}

function setConnectionStrings (json, configuration, pkg) {
  if (!json.configuration['connectionStrings']) {
    log.warn(colors.yellow(`no connection string settings to update`))
    return
  }

  if (typeof (json.configuration['connectionStrings'][0]) !== 'object' && !Array.isArray(json.configuration['connectionStrings'][0].add)) {
    json.configuration['connectionStrings'][0] = { add: [] }
  }

  let adds = json.configuration['connectionStrings'][0].add

  let dbs = configuration.dbs

  if (!dbs) {
    log.error(colors.red(`No ConnectionStrings set due to no appSettings["<env>"]["dbs"] configuration data defined in package.json`))
    return
  }

  log.info(`...connectionStrings...`)

  dbs.forEach((db, i) => {
    let name = db.name
    let server = db.server
    let database = db.database

    if (!name) {
      log.error(colors.red(`No ConnectionStrings set due to no appSettings["<env>"]["dbs"][${i}]["name"] defined in package.json`))
      return
    }

    if (!server) {
      log.error(colors.red(`No ConnectionStrings set due to no appSettings["<env>"]["dbs"][${i}]["server"] defined in package.json`))
      return
    }

    if (!database) {
      log.error(colors.red(`No ConnectionStrings set due to no appSettings["<env>"]["dbs"][${i}]["database"] defined in package.json`))
      return
    }

    setConnectionString(adds, name, data.buildConnectionString(db))
  })
}

function updateWebConfig (file, dest, configuration, pkg) {
  if (!file.path.toLowerCase().endsWith(path.join('web', 'web.config'))) {
    return
  }

  if (!configuration) {
    log.warn(colors.yellow('no configuration data defined in package.json'))
    return
  }

  log.info(`Updating ${file.relative} to ${process.env.target} settings...`)

  let json = xmlToJson(file)

  setAppSettings(json, configuration, pkg)
  setLog4NetSettings(json, configuration)
  setSystemWebSettings(json, configuration)
  setConnectionStrings(json, configuration, pkg)

  file.contents = jsonToXml(json)
}

function updateTestConfig (file, dest, configuration, pkg) {
  if (!file.path.toLowerCase().endsWith(path.join('tests', 'app.config'))) {
    return
  }

  if (!configuration) {
    log.warn(colors.yellow('no configuration data defined in package.json'))
    return
  }

  log.info(`Updating ${file.relative} to unit settings...`)

  let json = xmlToJson(file)

  setAppSettings(json, configuration, pkg)
  setLog4NetSettings(json, configuration)
  setSystemWebSettings(json, configuration)
  setConnectionStrings(json, configuration, pkg)

  file.contents = jsonToXml(json)
}

function logfile (file, dest) {
  log.info(`Copying ${file.path} to ${dest}`)
}

function transform (func, dest, name) {
  const configuration = env.getEnvironmentConfig(name)

  return through.obj(
    (file, enc, cb) => {
      func(file, dest, configuration, env.pkg)
      cb(null, file)
    },
    cb => cb()
  )
}

function getNotifyFileConfiguration (filename, pattern, tokens) {
  let appenders = {}

  env.getWebConfig().servers
    .map((server) => { return { name: server, path: env.getWebConfig(server).share } })
    .forEach((share) => {
      appenders[share.name] = {
        type: 'file',
        filename: path.join(share.path, filename),
        maxLogSize: 1048576, // bytes, i.e. 1MB
        backups: 0,
        layout: {
          type: 'pattern',
          pattern: pattern,
          tokens: tokens
        }
      }
    })

  return {
    appenders: appenders,
    categories: {
      default: {
        appenders: Object.keys(appenders),
        level: 'info'
      }
    }
  }
}

function getNotifyFileLatest (filename, parser) {
  let definedEnvironments
  let files = []

  // determine if environment specified by -e or just get all defined
  if (env.getArgs().e) {
    definedEnvironments = [process.env.target]
  } else {
    definedEnvironments = env.getEnvironments()
  }

  // find all deploy.log files for each defined environment
  definedEnvironments.forEach((e) => {
    let config = env.getEnvironmentConfig(e)

    if (!config.web || !config.web.servers || config.web.servers.length === 0) {
      return
    }

    process.env.target = e

    files.push(path.join(env.getWebConfig().servers.map((server) => env.getWebConfig(server).share)[0], filename))
  })

  // create promises that read each deploy.log for all defined environments
  let reads = []

  files.forEach((file) => {
    reads.push(
      fs.readFile(file, 'utf8')
        .then((data) => {
          return data.split('\r\n')
            .filter((line) => line.length > 0)
            .map(parser)
        })
        .catch(err => {
          log.warn(colors.yellow(`Did not find file ${err.path}`))
        })
    )
  })

  return Promise.all(reads)
    .then((items) => {
      return [].concat(...items.filter(i => i != null))
    })
    .then((items) => {
      let environments = []
      let latest = []

      items.map((item) => item.environment)
        .forEach((e) => {
          if (definedEnvironments.map((e) => e.toLowerCase()).includes(e.toLowerCase()) && !environments.includes(e)) {
            environments.push(e)
          }
        })

      environments.forEach((env) => {
        latest.push(items.filter((item) => item.environment === env).sort((a, b) => new Date(b.datetime) - new Date(a.datetime))[0])
      })

      return latest
    })
}

module.exports = {
  cfg: {
    xmlToJson: xmlToJson,
    setAppSettings: setAppSettings,
    setLog4NetSettings: setLog4NetSettings,
    setSystemWebSettings: setSystemWebSettings,
    setConnectionStrings: setConnectionStrings,
    jsonToXml: jsonToXml
  },
  transform: transform,
  updateWebConfig: updateWebConfig,
  updateTestConfig: updateTestConfig,
  log: logfile,
  getNotifyFileConfiguration: getNotifyFileConfiguration,
  getNotifyFileLatest: getNotifyFileLatest
}

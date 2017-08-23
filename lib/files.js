'use strict'

const path = require('path')
const through = require('through2')
const username = require('username')
const util = require('gulp-util')
const xml2js = require('xml2js')

const env = require('./env.js')

const pkg = require(path.join(process.cwd(), 'package.json'))

function xmlToJson (file) {
  let result

  xml2js.parseString(file.contents.toString(), (err, res) => {
    if (err) {
      // TODO: (jmorris2) do I throw a PluginError or some other error here?
      throw new util.PluginError('files', `unable to parse xml in ${file.basename}`)
    }

    result = res
  })

  return result
}

function jsonToXml (json) {
  return Buffer.from(new xml2js.Builder().buildObject(json))
}

function setAppSetting (json, key, value) {
  let obj = json.find(i => i.$.key === key)

  // TODO: (jmorris2) if key is not found, throw error or add it?
  if (!obj) {
    // throw new util.PluginError('copy', `AppSettings ${key} not found`)
    obj = { $: { key: key } }
    json.push(obj)
  }

  util.log(`......${key} to ${value}`)

  obj.$.value = value
}

function setAppSettings (json, configuration, pkg) {
  let config = configuration['web.config']

  if (!config) {
    util.log(util.colors.yellow(`No AppSettings set due to no appSettings["<env>"]["web.config"] configuration data defined in package.json`))
    return
  }

  let adds = json.configuration['appSettings'][0].add

  util.log(`...appSettings...`)

  if (config.appSettings) {
    Object.keys(config.appSettings).forEach((k) => {
      setAppSetting(adds, k, config.appSettings[k])
    })
  }

  let environment = env.getName()

  setAppSetting(adds, 'DeployDateTime', Date.now())
  setAppSetting(adds, 'Environment', environment)
  setAppSetting(adds, 'Revision', process.env.revision)
  setAppSetting(adds, 'NewRelic.AppName', (environment !== 'prod') ? `${pkg.name} (${environment})` : `${pkg.name}`)
}

function setLog4NetAppenderSetting (appenders, name, key, value) {
  let appender = appenders.find(i => i.$.name === name)

  if (!appender) {
    // TODO: (jmorris2) do I throw a PluginError or some other error here?
    throw new util.PluginError('files', `AppSettings ${key} not found`)
  }

  let result

  if (/^<\s*me\s*>$/.test(value)) {
    result = username.sync()
  } else {
    result = value
  }

  util.log(`.........${key} to ${result}`)

  appender[key][0].$.value = result
}

function setLog4NetAppenderSettings (json, configuration) {
  let config = configuration['web.config']

  if (!config) {
    util.log(util.colors.yellow(`No Log4Net settings set due to no appSettings["<env>"]["web.config"] configuration data defined in package.json`))
    return
  }

  if (!json.configuration.log4net) {
    util.log(util.colors.yellow(`no log4net settings to update`))
    return
  }

  let appenders = json.configuration.log4net[0].appender

  if (!config.log4net) {
    util.log(util.colors.yellow(`No Log4Net settings set due to no appSettings["<env>"]["web.config"]["log4net"] configuration data defined in package.json`))
  }

  util.log(`...log4net...`)

  Object.keys(config.log4net).forEach((k) => {
    util.log(`......${k} appender...`)
    Object.keys(config.log4net[k]).forEach((l) => {
      if (l === 'db') {
        let db = configuration.db

        if (!db) {
          util.log(util.colors.yellow(`No Log4Net db setting set due to no appSettings["<env>"]["web.config"]["log4net"] configuration data defined in package.json`))
          return
        }

        let server = db.server

        setLog4NetAppenderSetting(appenders, k, 'connectionString', buildConnectionString(server, config.log4net[k][l].name))
      } else {
        setLog4NetAppenderSetting(appenders, k, l, config.log4net[k][l])
      }
    })
  })
}

function setSystemWebSettings (json, configuration) {
  let config = configuration['web.config']

  if (!config) {
    util.log(util.colors.yellow(`No SystemWebSettings set due to no appSettings["<env>"]["web.config"] configuration data defined in package.json`))
    return
  }

  if (config['system.web'] === undefined ||
    config['system.web'].compilation === undefined ||
    config['system.web'].compilation.debug === undefined) {
    return
  }

  util.log(`...system.web...`)
  util.log(`......debug to ${config['system.web'].compilation.debug}`)

  json.configuration['system.web'][0].compilation[0].$.debug = config['system.web'].compilation.debug
}

function setConnectionString (json, name, value) {
  let obj = json.find(i => i.$.name === name)

  // TODO: (jmorris2) if name is not found, throw error or add it?
  if (!obj) {
    // throw new util.PluginError('copy', `AppSettings ${name} not found`)
    obj = { $: { name: name } }
    json.push(obj)
  }

  util.log(`......${name} to ${value}`)

  obj.$.value = value
}

function buildConnectionString (server, name) {
  return `server=${server};database=${name};integrated security=SSPI`
}

function setConnectionStrings (json, configuration, pkg) {
  if (!json.configuration['connectionStrings']) {
    util.log(util.colors.yellow(`no connection string settings to update`))
    return
  }

  let adds = json.configuration['connectionStrings'][0].add

  let db = configuration.db

  if (!db) {
    util.log(util.colors.red(`No ConnectionStrings set due to no appSettings["<env>"]["db"] configuration data defined in package.json`))
    return
  }

  let name = db.name
  let server = db.server

  if (!name) {
    util.log(util.colors.red(`No ConnectionStrings set due to no appSettings["<env>"]["db"]["name"] defined in package.json`))
    return
  }

  if (!server) {
    util.log(util.colors.red(`No ConnectionStrings set due to no appSettings["<env>"]["db"]["server"] defined in package.json`))
    return
  }

  util.log(`...connectionStrings...`)

  setConnectionString(adds, pkg.name, buildConnectionString(server, name))
}

function updateWebConfig (file, dest, configuration, pkg) {
  if (!file.path.toLowerCase().endsWith(path.join('web', 'web.config'))) {
    return
  }

  if (!configuration) {
    util.log(util.colors.yellow('no configuration data defined in package.json'))
    return
  }

  util.log(`Updating ${file.basename}...`)

  let json = xmlToJson(file)

  setAppSettings(json, configuration, pkg)
  setLog4NetAppenderSettings(json, configuration)
  setSystemWebSettings(json, configuration)
  setConnectionStrings(json, configuration, pkg)

  file.contents = jsonToXml(json)
}

function log (file, dest) {
  util.log(`Copying ${file.path} to ${dest}`)
}

function transform (func, dest) {
  const configuration = env.getEnvironmentConfig()

  return through.obj(
    (file, enc, cb) => {
      func(file, dest, configuration, pkg)
      cb(null, file)
    },
    cb => cb()
  )
}

module.exports = {
  transform: transform,
  updateWebConfig: updateWebConfig,
  log: log
}

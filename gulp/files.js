'use strict'

const path = require('path')
const through = require('through2')
const util = require('gulp-util')
const xml2js = require('xml2js')

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

  let adds = json.configuration['appSettings'][0].add

  util.log(`...appSettings...`)

  Object.keys(config.appSettings).forEach((k) => {
    setAppSetting(adds, k, config.appSettings[k])
  })

  let env = process.env.targets.split(' ')[0]

  setAppSetting(adds, 'DeployDateTime', Date.now())
  setAppSetting(adds, 'Environment', env)
  setAppSetting(adds, 'Revision', process.env.revision)
  setAppSetting(adds, 'NewRelic.AppName', (env !== 'prod') ? `${pkg.name} (${env})` : `${pkg.name}`)
}

function setLog4NetAppenderSetting (appenders, name, key, value) {
  let appender = appenders.find(i => i.$.name === name)

  if (!appender) {
    // TODO: (jmorris2) do I throw a PluginError or some other error here?
    throw new util.PluginError('files', `AppSettings ${key} not found`)
  }

  util.log(`.........${key} to ${value}`)

  appender[key][0].$.value = value
}

function setLog4NetAppenderSettings (json, configuration) {
  let config = configuration['web.config']
  let db = configuration.db

  let server = db.server

  let appenders = json.configuration.log4net[0].appender

  util.log(`...log4net...`)

  Object.keys(config.log4net).forEach((k) => {
    util.log(`......${k} appender...`)
    Object.keys(config.log4net[k]).forEach((l) => {
      if (l === 'db') {
        setLog4NetAppenderSetting(appenders, k, 'connectionString', buildConnectionString(server, config.log4net[k][l].name))
      } else {
        setLog4NetAppenderSetting(appenders, k, l, config.log4net[k][l])
      }
    })
  })
}

function setSystemWebSettings (json, configuration) {
  let config = configuration['web.config']

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
  let db = configuration.db

  let adds = json.configuration['connectionStrings'][0].add

  let server = db.server
  let name = db.name

  util.log(`...connectionStrings...`)

  setConnectionString(adds, pkg.name, buildConnectionString(server, name))
}

function updateWebConfig (file, dest, configuration, pkg) {
  if (!file.path.toLowerCase().endsWith(path.join('web', 'web.config'))) {
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

function transform (func, configuration, dest, pkg) {
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

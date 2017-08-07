'use strict'

const argv = require('minimist')(process.argv.slice(2))
const gulp = require('gulp')
const MergeStream = require('merge-stream')
const sequence = require('run-sequence')
const through = require('through2')
const util = require('gulp-util')
const path = require('path')
// const wrench = require('wrench')
const xml2js = require('xml2js')

const env = require('./gulp/env.js')

const config = require('./config.json')
const pkg = require('./package.json')

env.parse(argv, config)

// process.env.force = argv.f ? true : false;
// process.env.revision = common.getSvnRevision();

// require all the javascript files in the gulp directory
// wrench.readdirSyncRecursive('./scripts/gulp')
//   .filter(function(file) {
//     return (/\.js$/i).test(file);
//   })
//   .map(function(file) {
//     require('./scripts/gulp/'+file);
//   });
require('./gulp/gulp.db.js')
require('./gulp/gulp.build.js')
require('./gulp/gulp.app.js')
require('./gulp/gulp.local.js')

function xmlToJson (file) {
  let result

  xml2js.parseString(file.contents.toString(), (err, res) => {
    if (err) {
      throw new util.PluginError('copy', `unable to parse xml in ${file.basename}`)
    }

    result = res
  })

  return result
}

function jsonToXml (json) {
  return Buffer.from(new xml2js.Builder().buildObject(json))
}

function setAppSetting (json, key, value) {
  let adds = json.configuration['appSettings'][0].add
  let obj = adds.find(i => i.$.key === key)

  // TODO: (jmorris2) if key is not found, throw error or add it?
  if (!obj) {
    // throw new util.PluginError('copy', `AppSettings ${key} not found`)
    obj = { $: { key: key } }
    adds.push(obj)
  }

  obj.$.value = value
}

function setBuildSettings (json) {
  let environment = process.env.targets.split(' ')[0]

  setAppSetting(json, 'DeployDateTime', Date.now())
  setAppSetting(json, 'Environment', environment)
  setAppSetting(json, 'Revision', process.env.revision)
  setAppSetting(json, 'NewRelic.AppName', (environment !== 'prod') ? `${pkg.name} (${environment})` : `${pkg.name}`)
}

function setLog4NetAppenderSetting (json, n, k, v) {
  json.configuration.log4net[0].appender.forEach(function (appender) {
    if (appender.$.name === n) {
      appender[k][0].$.value = v
    }
  })
}

function setLog4NetSettings (json) {
  setLog4NetAppenderSetting(json, 'Intel.Trans.Appender.Email', 'subject', `${envCfg.title}:`)
  setLog4NetAppenderSetting(json, 'Intel.Trans.Appender.Email', 'threshold', envCfg.emailLogLevel)
  setLog4NetAppenderSetting(json, 'Intel.Trans.Appender.Database', 'connectionString', getLogConnectionString(env))
}

function setSystemWebSettings (json, configuration) {
  if (configuration['system.web'] === undefined ||
      configuration['system.web'].compilation === undefined ||
      configuration['system.web'].compilation.debug === undefined) {
    return
  }

  json.configuration['system.web'][0].compilation[0].$.debug = configuration['system.web'].compilation.debug
}

function updateWebConfig (file, configuration) {
  if (path.basename(file.path).toLowerCase() !== 'web.config') {
    return
  }

  util.log(`Updating ${file.basename}`)

  let json = xmlToJson(file)

  Object.keys(configuration.appSettings).forEach((k) => {
    util.log(`${k}: ${configuration.appSettings[k]}`)
    setAppSetting(json, k, configuration.appSettings[k])
  })

  setBuildSettings(json)
  setLog4NetSettings(json)
  setSystemWebSettings(json, configuration)

  // setConnectionString(json, env)

  file.contents = jsonToXml(json)
}

function transformFiles (dest, configuration) {
  return through.obj(
    function (file, enc, cb) {
      updateWebConfig(file, configuration)

      util.log(`Copying ${file.path} to ${dest}`)

      cb(null, file)
    },
    function (cb) {
      cb()
    })
}

gulp.task('copy', () => {
  // todo: (jmorris2) do all the things to copy application files to a destination

  let mergestream = MergeStream()

  let web = config[process.env.targets.split(' ')[0]].web
  let configuration = config[process.env.targets.split(' ')[0]].configuration
  let revision = process.env.revision

  let src = path.join(process.cwd(), 'Web')

  for (let i = 0; i < web.servers.length; i++) {
    let dest = path.join(`//${web.servers[i]}`, web.path, 'releases', revision, 'Web')

    mergestream.add(
      gulp.src(path.join(src, '**/*'))
        .pipe(transformFiles(dest, configuration, transform))
      // .pipe(gulp.dest(dest, {overwrite: true}))
    )
  }

  // if(shelljs.exec('jarvis.cmd set '+process.env.target+' current').code !== 0) {
  //   throw new util.PluginError('app', 'copy, jarvis symlink setting failed');
  // }

  return mergestream
})

gulp.task('deploy', [], () => {
  if (!env.isEnvironmentDefined()) {
    util.log(util.colors.red('Environment not specified, e.g. gulp deploy -e dev'))
    return
  }

  util.log(util.colors.green('Deploying to ' + process.env.targets))

  sequence(
    'app:offline',
    // 'jobs:stop',
    // 'db:backup',
    'copy',
    'app:recycle'
    // 'jobs:start'
  )
})

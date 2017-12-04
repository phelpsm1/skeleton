'use strict'

const fs = require('fs-extra')
const gulp = require('gulp')
const log4js = require('log4js')
const moment = require('moment')
const path = require('path')
const rp = require('request-promise')
const util = require('gulp-util')

const env = require('./env.js')
const smtp = require('./smtp.js')

gulp.task('deploy:notify', ['deploy:notify:log', 'deploy:notify:email', 'deploy:notify:nr'])

gulp.task('deploy:notify:log', () => {
  let appenders = {}

  env.getWebConfig().servers
    .map((server) => { return { name: server, path: env.getWebConfig(server).share } })
    .forEach((share) => {
      appenders[share.name] = {
        type: 'file',
        filename: path.join(share.path, 'deploy.log'),
        maxLogSize: 1048576, // bytes, i.e. 1MB
        backups: 0,
        layout: {
          type: 'pattern',
          pattern: '[%d] [%5x{target}] v%x{version} (%x{revision}) %h %x{user} ',
          tokens: {
            target: () => process.env.target.toUpperCase(),
            user: () => process.env.USERNAME,
            revision: () => process.env.revision,
            version: () => env.pkg.version
          }
        }
      }
    })

  let configuration = {
    appenders: appenders,
    categories: {
      default: {
        appenders: Object.keys(appenders),
        level: 'info'
      }
    }
  }

  log4js.configure(configuration)

  log4js.getLogger().info()
})

gulp.task('deploy:notify:email', () => {
  let locals = {
    name: env.pkg.name,
    version: env.pkg.version,
    revision: process.env.revision,
    env: process.env.target.toUpperCase(),
    at: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
    by: process.env.USERNAME,
    from: process.env.COMPUTERNAME
  }

  let message = {
    subject: `${locals.name} v${locals.version} (${locals.revision}) deployed to ${locals.env}`,
    text: {
      template: path.join(__dirname, 'deploy.notify.email.text.pug'),
      locals: locals
    },
    html: {
      template: path.join(__dirname, 'deploy.notify.email.html.pug'),
      locals: locals
    }
  }

  return smtp.mail(message)
})

gulp.task('deploy:notify:nr', () => {
  let envConfig = env.getEnvironmentConfig()

  if (!envConfig.newrelic || !envConfig.newrelic.id) {
    util.log(util.colors.yellow(`No New Relic Application Id defined to notify deployment to New Relic`))
    return
  }

  let revision = process.env.revision

  let options = {
    url: `https://api.newrelic.com/v2/applications/${envConfig.newrelic.id}/deployments.json`,
    proxy: 'http://proxy-us.intel.com:911',
    method: 'POST',
    headers: {
      'x-api-key': '882bb932dad835f2c0f4204b01eaafdcbf6a16ad7af522c'
    },
    body: {
      deployment: {
        revision: revision,
        description: `Upgrading to ${env.pkg.version} (${revision})`,
        user: process.env.username
      }
    },
    json: true
  }

  return rp(options)
    .then((response) => {
      util.log(util.colors.green(`Notified deployment to New Relic at ${response.deployment.timestamp}`))
    })
    .catch((err) => {
      util.log(util.colors.red(`Error:`, err))
    })
})

gulp.task('deploy:status', () => {
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

    files.push(path.join(env.getWebConfig().servers.map((server) => env.getWebConfig(server).share)[0], 'deploy.log'))
  })

  // create promises that read each deploy.log for all defined environments
  let reads = []

  files.forEach((file) => {
    reads.push(
      fs.readFile(file, 'utf8')
        .then((data) => {
          let items = []

          data.split('\r\n')
            .filter((line) => line.length > 0)
            .forEach((line) => {
              let matches = /\[(.*)\]\s*\[\s*(\S*)\]\s*v(.*)\s*\((\S*)\)\s*(\S*)\s*(\S*)/igm.exec(line)

              items.push({
                datetime: matches[1].trim(),
                environment: matches[2].trim(),
                version: matches[3].trim(),
                revision: matches[4].trim(),
                from: matches[5].trim(),
                by: matches[6].trim()
              })
            })

          return items
        })
    )
  })

  return Promise.all(reads)
    .then((items) => {
      return [].concat(...items)
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
    .then((latest) => {
      latest.forEach((l) => {
        util.log(util.colors.green(`[${l.datetime}]\t[${String('     ' + l.environment).slice(-8)}]\tv${l.version}\t(${l.revision})\t${l.from}\t${l.by}`))
      })
    })
})

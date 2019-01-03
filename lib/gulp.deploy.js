'use strict'

const colors = require('ansi-colors')
const fs = require('fs-extra')
const gulp = require('gulp')
const log = require('fancy-log')
const log4js = require('log4js')
const moment = require('moment')
const path = require('path')

const env = require('./env.js')
const smtp = require('./smtp.js')
const git = require('./git.js')

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

function getLatestDeploys () {
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

gulp.task('deploy:notify:email', () => {
  return getLatestDeploys()
    .then((latest) => {
      let lastDeployedRevision = latest
        .find(l => l.environment.toLowerCase() === process.env.target.toLowerCase())
        .revision
        .split('.')[0] // when multiple builds on same revision number, i.e. drop the .1, .2, etc.

      let commits = git.getCommits(lastDeployedRevision, process.env.revision)

      let locals = {
        name: env.pkg.name,
        version: env.pkg.version,
        revision: process.env.revision,
        env: process.env.target.toUpperCase(),
        at: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
        by: process.env.USERNAME,
        from: process.env.COMPUTERNAME,
        commits: {
          range: {
            start: lastDeployedRevision,
            end: process.env.revision
          },
          list: commits
        }
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
})

// sequence is important here
// email depends on values in deploy.log, so email needs to be sent before deploy.log is updated
gulp.task('deploy:notify', gulp.series('deploy:notify:email', 'deploy:notify:log'))

gulp.task('deploy:status', () => {
  return getLatestDeploys()
    .then((latest) => {
      let environmentMaxLen = Math.max(...latest.map(l => l.environment.length))
      let revisionMaxLen = Math.max(...latest.map(l => l.revision.length))
      const pad = '                   '

      latest.forEach((l) => {
        log.info(colors.green(`[${l.datetime}]\t[${String(pad + l.environment).slice(-environmentMaxLen)}]\tv${l.version}\t(${String(pad + l.revision).slice(-revisionMaxLen)})\t${l.from}\t${l.by}`))
      })
    })
})

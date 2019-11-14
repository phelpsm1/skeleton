'use strict'

const gulp = require('gulp')
const { series } = require('gulp')

const colors = require('ansi-colors')
const log = require('fancy-log')
const log4js = require('log4js')
const moment = require('moment')
const path = require('path')

const env = require('./env')
const files = require('./files')
const smtp = require('./smtp')
// const git = require('./git')

const info = (done) => {
  log.info(colors.green(`Deploying ${process.env.revision} to ${process.env.target.toUpperCase()}`))
  done()
}

info.displayName = 'deploy:info'
info.description = 'Display deployment environment information'
gulp.task(info)

const notifylog = (done) => {
  const pattern = '[%d] [%5x{target}] v%x{version} (%x{revision}) %h %x{user} '
  const tokens = {
    target: () => process.env.target.toUpperCase(),
    user: () => process.env.USERNAME,
    revision: () => process.env.revision,
    version: () => env.pkg.version
  }

  log4js.configure(files.getNotifyFileConfiguration('deploy.log', pattern, tokens))

  log4js.getLogger().info()

  done()
}

notifylog.displayName = 'deploy:notify:log'
notifylog.description = 'Add log entry with deployment information'
gulp.task(notifylog)

const notifyemail = () => {
  return getNotifyFileLatest()
    .then((latest) => {
      const lastDeployedRevision = latest
        .find(l => l.environment.toLowerCase() === process.env.target.toLowerCase())
        .revision
        .split('.')[0] // when multiple builds on same revision number, i.e. drop the .1, .2, etc.

      // TODO: (jmorris2) commits will not be available with new deploy method
      // const commits = git.getCommits(lastDeployedRevision, process.env.revision)
      const commits = []

      const locals = {
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

      const message = {
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
}

notifyemail.displayName = 'deploy:notify:email'
notifyemail.description = 'Send deployment email'

// sequence is important here
// email depends on values in deploy.log, so email needs to be sent before deploy.log is updated
const notify = series(notifyemail, notifylog)

notify.displayName = 'deploy:notify'
notify.description = 'Notify of deployment of application'
gulp.task(notify)

const status = () => {
  return getNotifyFileLatest()
    .then((latest) => {
      const environmentMaxLen = Math.max(...latest.map(l => l.environment.length))
      const revisionMaxLen = Math.max(...latest.map(l => l.revision.length))
      const pad = '                   '

      latest.forEach((l) => {
        log.info(colors.green(`[${l.datetime}]\t[${String(pad + l.environment).slice(-environmentMaxLen)}]\tv${l.version}\t(${String(pad + l.revision).slice(-revisionMaxLen)})\t${l.from}\t${l.by}`))
      })
    })
}

status.displayName = 'deploy:status'
status.description = 'Get status of deployments'
gulp.task(status)

function getNotifyFileLatest () {
  const parser = (line) => {
    const matches = /\[(.*)\]\s*\[\s*(\S*)\]\s*v(.*)\s*\((\S*)\)\s*(\S*)\s*(\S*)/igm.exec(line)

    return {
      datetime: matches[1].trim(),
      environment: matches[2].trim(),
      version: matches[3].trim(),
      revision: matches[4].trim(),
      from: matches[5].trim(),
      by: matches[6].trim()
    }
  }

  return files.getNotifyFileLatest('deploy.log', parser)
}

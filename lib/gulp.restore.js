'use strict'

const colors = require('ansi-colors')
const gulp = require('gulp')
const log = require('fancy-log')
const log4js = require('log4js')
const moment = require('moment')
const path = require('path')
const pluralize = require('pluralize')

const env = require('./env')
const files = require('./files')
const smtp = require('./smtp')

gulp.task('restore:info', (done) => {
  log.info(colors.green(`Restoring to ${process.env.target.toUpperCase()}`))
  done()
})

gulp.task('restore:notify:log', (done) => {
  let pattern = '[%d] [%5x{target}] %h %x{user} '
  let tokens = {
    target: () => process.env.target.toUpperCase(),
    user: () => process.env.USERNAME
  }

  log4js.configure(files.getNotifyFileConfiguration('restore.log', pattern, tokens))

  log4js.getLogger().info()

  done()
})

gulp.task('restore:notify:email', () => {
  let dbs = env.getDbsToRestore()

  if (dbs.length === 0) {
    log.warn(colors.yellow(`No email to send`))
    return
  }

  let locals = {
    name: env.pkg.name,
    label: pluralize('database', dbs.length),
    names: dbs.map((db) => { return db.database }).join(', '),
    verb: pluralize('was', dbs.length),
    env: process.env.target.toUpperCase(),
    at: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
    by: process.env.USERNAME,
    from: process.env.COMPUTERNAME
  }

  let message = {
    subject: `${locals.name} ${locals.label} ${locals.names} restored in ${locals.env}`,
    text: {
      template: path.join(__dirname, 'restore.notify.email.text.pug'),
      locals: locals
    },
    html: {
      template: path.join(__dirname, 'restore.notify.email.html.pug'),
      locals: locals
    }
  }

  return smtp.mail(message)
})

// sequence is important here
// email depends on values in restore.log, so email needs to be sent before restore.log is updated - TODO: (jmorris2) verify this
gulp.task('restore:notify', gulp.series('restore:notify:email', 'restore:notify:log'))

gulp.task('restore:status', () => {
  return getNotifyFileLatest()
    .then((latest) => {
      let environmentMaxLen = Math.max(...latest.map(l => l.environment.length))
      let revisionMaxLen = Math.max(...latest.map(l => l.revision.length))
      const pad = '                   '

      latest.forEach((l) => {
        log.info(colors.green(`[${l.datetime}]\t[${String(pad + l.environment).slice(-environmentMaxLen)}]\tv${l.version}\t(${String(pad + l.revision).slice(-revisionMaxLen)})\t${l.from}\t${l.by}`))
      })
    })
})

function getNotifyFileLatest () {
  let parser = (line) => {
    let matches = /\[(.*)\]\s*\[\s*(\S*)\]\s*(\S*)\s*(\S*)/igm.exec(line)

    return {
      datetime: matches[1].trim(),
      environment: matches[2].trim(),
      from: matches[3].trim(),
      by: matches[4].trim()
    }
  }

  return files.getNotifyFileLatest('restore.log', parser)
}

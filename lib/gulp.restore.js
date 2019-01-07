'use strict'

const colors = require('ansi-colors')
const gulp = require('gulp')
const log = require('fancy-log')
const moment = require('moment')
const path = require('path')
const pluralize = require('pluralize')

const env = require('./env')
const smtp = require('./smtp')

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

// gulp.task('restore:notify:log', () => {})

// sequence is important here
// email depends on values in restore.log, so email needs to be sent before restore.log is updated - TODO: (jmorris2) verify this
// gulp.task('restore:notify', gulp.series('restore:notify:email', 'restore:notify:log'))
gulp.task('restore:notify', gulp.series('restore:notify:email'))

// gulp.task('restore:status', () => {
  // return getLatestDeploys()
  //   .then((latest) => {
  //     let environmentMaxLen = Math.max(...latest.map(l => l.environment.length))
  //     let revisionMaxLen = Math.max(...latest.map(l => l.revision.length))
  //     const pad = '                   '
  //
  //     latest.forEach((l) => {
  //       log.info(colors.green(`[${l.datetime}]\t[${String(pad + l.environment).slice(-environmentMaxLen)}]\tv${l.version}\t(${String(pad + l.revision).slice(-revisionMaxLen)})\t${l.from}\t${l.by}`))
  //     })
  //   })
// })

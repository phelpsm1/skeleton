'use strict'

const gulp = require('gulp')
const moment = require('moment')
const path = require('path')
const pluralize = require('pluralize')
const util = require('gulp-util')

const env = require('./env.js')
const smtp = require('./smtp.js')

gulp.task('restore:notify:email', () => {
  let dbs = env.getDbsToRestore()

  if (dbs.length === 0) {
    util.log(util.colors.yellow(`No email to send`))
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

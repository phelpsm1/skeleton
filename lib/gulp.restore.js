'use strict'

const gulp = require('gulp')
const moment = require('moment')
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

  let label = pluralize('database', dbs.length)
  let verb = pluralize('was', dbs.length)
  let names = dbs.map((db) => { return db.database }).join(', ')

  let message = {
    subject: `${env.pkg.name} ${label} ${names} restored in ${process.env.target.toUpperCase()}`,
    text: `${env.pkg.name} ${label} ${names} ${verb} restored in ${process.env.target.toUpperCase()} on ${moment().format('YYYY-MM-DD HH:mm:ss.SSS')} by ${process.env.USERNAME} from ${process.env.COMPUTERNAME}.`,
    html: `<b>${env.pkg.name}</b> ${label} <b>${names}</b> ${verb} restored in <b>${process.env.target.toUpperCase()}</b> on <b>${moment().format('YYYY-MM-DD HH:mm:ss.SSS')}</b> by <b>${process.env.USERNAME}</b> from ${process.env.COMPUTERNAME}.`
  }

  return smtp.mail(message)
})

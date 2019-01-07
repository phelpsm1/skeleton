'use strict'

const checks = require('./lib/checks')
const data = require('./lib/data')
const env = require('./lib/env')
const files = require('./lib/files')
const git = require('./lib/git')
const ps = require('./lib/ps')
const smtp = require('./lib/smtp')

require('./lib/gulp.app')
require('./lib/gulp.build')
require('./lib/gulp.clean')
require('./lib/gulp.config')
require('./lib/gulp.deploy')
require('./lib/gulp.env')
require('./lib/gulp.local')
require('./lib/gulp.restore')
require('./lib/gulp.sql')
require('./lib/gulp.test')

module.exports = {
  Checks: checks,
  Env: env,
  Files: files,
  Data: data,
  Ps: ps,
  Smtp: smtp,
  Source: {
    git: git
  }
}

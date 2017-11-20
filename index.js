'use strict'

const data = require('./lib/data.js')
const env = require('./lib/env.js')
const files = require('./lib/files.js')
const git = require('./lib/git.js')
const smtp = require('./lib/smtp.js')
const svn = require('./lib/svn.js')

require('./lib/gulp.app.js')
require('./lib/gulp.build.js')
require('./lib/gulp.clean.js')
require('./lib/gulp.config.js')
require('./lib/gulp.deploy.js')
require('./lib/gulp.local.js')
require('./lib/gulp.restore.js')
require('./lib/gulp.sql.js')
require('./lib/gulp.test.js')

module.exports = {
  Env: env,
  Files: files,
  Data: data,
  Smtp: smtp,
  Source: {
    svn: svn,
    git: git
  }
}

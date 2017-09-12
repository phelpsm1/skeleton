'use strict'

const env = require('./lib/env.js')
const files = require('./lib/files.js')
const mssql = require('./lib/mssql')

require('./lib/gulp.app.js')
require('./lib/gulp.build.js')
require('./lib/gulp.clean.js')
require('./lib/gulp.config.js')
require('./lib/gulp.db.js')
require('./lib/gulp.local.js')
require('./lib/gulp.nr.js')

module.exports = {
  Env: env,
  Files: files,
  Mssql: mssql
}

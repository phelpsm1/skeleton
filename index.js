'use strict'

const env = require('./gulp/env.js')
const files = require('./gulp/files.js')
const mssql = require('./gulp/mssql')

require('./gulp/gulp.app.js')
require('./gulp/gulp.build.js')
require('./gulp/gulp.db.js')
require('./gulp/gulp.local.js')

module.exports = {
  Env: env,
  Files: files,
  Mssql: mssql
}

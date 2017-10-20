'use strict'

const env = require('./lib/env.js')
const files = require('./lib/files.js')
const data = require('./lib/data')

require('./lib/gulp.app.js')
require('./lib/gulp.build.js')
require('./lib/gulp.clean.js')
require('./lib/gulp.config.js')
require('./lib/gulp.sql.js')
require('./lib/gulp.local.js')
require('./lib/gulp.notify.js')

module.exports = {
  Env: env,
  Files: files,
  Data: data
}

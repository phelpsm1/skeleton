'use strict'

const gulp = require('gulp')
const sequence = require('run-sequence')
const util = require('gulp-util')

const env = require('./env.js')
const iisexpress = require('./iisexpress.js')

gulp.task('start', () => {
  const help = ', e.g. Intel.Skeleton.Web'

  let config = env.getConfig()

  if (!config.web || !config.web.project) {
    util.log(util.colors.red('Web project not specified', help))
    return
  }

  iisexpress().start(config.local.web.project)
})

gulp.task('stop', () => iisexpress().stop())

gulp.task('restart', () => sequence('stop', 'start'))

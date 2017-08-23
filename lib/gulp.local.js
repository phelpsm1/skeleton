'use strict'

const gulp = require('gulp')
const path = require('path')
const sequence = require('run-sequence')
const util = require('gulp-util')

const env = require('./env.js')
const files = require('./files.js')
const iisexpress = require('./iisexpress.js')

gulp.task('start', () => {
  const help = ', e.g. Intel.Skeleton.Web'

  let config = env.getEnvironmentConfig()

  if (!config || !config.web || !config.web.project) {
    util.log(util.colors.red('Web project not specified', help))
    return
  }

  iisexpress().start(config.web.project)
})

gulp.task('stop', () => iisexpress().stop())

gulp.task('restart', () => sequence('stop', 'start'))

gulp.task('config', () => {
  const src = './Web'

  return gulp.src(path.join(src, 'Web.config'))
    .pipe(files.transform(files.updateWebConfig, src))
    .pipe(gulp.dest(src, {overwrite: true}))
})

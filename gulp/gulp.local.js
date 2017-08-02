'use strict'

const gulp = require('gulp')
const sequence = require('run-sequence')
const util = require('gulp-util')

const iisexpress = require('./iisexpress.js')

const config = require('../config.json')

gulp.task('start', () => {
  const help = ', e.g. Intel.Skeleton.Web'

  if (!config || !config.local || !config.local.web || !config.local.web.project) {
    util.log(util.colors.red('Site not specified', help))
    return
  }

  iisexpress().start(config.local.web.project)
})

gulp.task('stop', () => iisexpress().stop())

gulp.task('restart', () => sequence('stop', 'start'))

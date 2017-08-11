'use strict'

const gulp = require('gulp')
const path = require('path')
const sequence = require('run-sequence')
const util = require('gulp-util')

const env = require(`${path.join(__dirname, 'env.js')}`)
const iisexpress = require(`${path.join(__dirname, 'iisexpress.js')}`)

gulp.task('start', () => {
  const help = ', e.g. Intel.Skeleton.Web'

  let config = env.getEnvironmentConfig()

  if (!config || !config.web || !config.web.project) {
    util.log(util.colors.red('Web project not specified', help))
    return
  }

  iisexpress().start(config.local.web.project)
})

gulp.task('stop', () => iisexpress().stop())

gulp.task('restart', () => sequence('stop', 'start'))

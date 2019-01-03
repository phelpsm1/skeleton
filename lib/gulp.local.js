'use strict'

const colors = require('ansi-colors')
const gulp = require('gulp')
const log = require('fancy-log')

const env = require('./env.js')
const iisexpress = require('./iisexpress.js')

gulp.task('start', () => {
  const help = ', e.g. Intel.Skeleton.Web'

  let web = env.getWebConfig()

  if (!web || !web.project) {
    log.error(colors.red(`Web project not specified ${help}`))
    return
  }

  return iisexpress().start(web.project)
})

gulp.task('stop', () => iisexpress().stop())

gulp.task('restart', gulp.series('stop', 'start'))

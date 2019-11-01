'use strict'

const gulp = require('gulp')
const { series } = require('gulp')

const colors = require('ansi-colors')
const log = require('fancy-log')

const env = require('./env')
const iisexpress = require('./iisexpress')

const start = () => {
  const help = ', e.g. Intel.Skeleton.Web'

  const web = env.getWebConfig()

  if (!web || !web.project) {
    log.error(colors.red(`Web project not specified ${help}`))
    return
  }

  return iisexpress().start(web.project)
}

start.displayName = 'start'
start.description = 'Start the application locally'
gulp.task(start)

const stop = () => iisexpress().stop()

stop.displayName = 'stop'
stop.description = 'Stop the application locally'
gulp.task(stop)

const restart = series(stop, start)

restart.displayName = 'restart'
restart.description = 'Restart, i.e. stop, start, the application locally'
gulp.task(restart)

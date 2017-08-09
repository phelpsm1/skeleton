'use strict'

const gulp = require('gulp')
const util = require('gulp-util')

const env = require('./env.js')
const ps = require('./ps.js')

const config = require('../config.json')
const pkg = require('../package.json')

gulp.task('app:down', () => {
  const help = `, e.g. gulp app:down -e dev`

  if (!env.isEnvironmentDefined()) {
    util.log(util.colors.red('Environment not specified', help))
    return
  }

  return execute('Bring-Down')
})

gulp.task('app:up', () => {
  const help = `, e.g. gulp app:up -e dev`

  if (!env.isEnvironmentDefined()) {
    util.log(util.colors.red(`Environment not specified`, help))
    return
  }

  return execute('Bring-Up')
})

gulp.task('app:offline', () => {
  const help = `, e.g. gulp app:offline -e dev`

  if (!env.isEnvironmentDefined()) {
    util.log(util.colors.red(`Environment not specified`, help))
    return
  }

  return execute('Take-Offline')
})

gulp.task('app:online', () => {
  const help = `, e.g. gulp app:online -e dev`

  if (!env.isEnvironmentDefined()) {
    util.log(util.colors.red(`Environment not specified`, help))
    return
  }

  return execute('Take-Online')
})

gulp.task('app:recycle', () => {
  const help = `, e.g. gulp app:recycle -e dev`

  if (!env.isEnvironmentDefined()) {
    util.log(util.colors.red(`Environment not specified`, help))
    return
  }

  return execute('Recycle')
})

gulp.task('app:link', () => {
  const help = `, e.g. gulp app:link -e dev`

  if (!env.isEnvironmentDefined()) {
    util.log(util.colors.red(`Environment not specified`, help))
    return
  }
  return execute('Set-Current')
})

gulp.task('app:status', () => {
  const help = `, e.g. gulp app:status -e dev`

  if (!env.isEnvironmentDefined()) {
    util.log(util.colors.red(`Environment not specified`, help))
    return
  }

  return execute('Get-Status')
})

function execute (command) {
  const web = config[env.getName()].web
  const name = pkg.name
  const pillar = pkg.pillar

  let params = [
    {name: name},
    {pillar: pillar},
    {env: env.getName()},
    {servers: web.servers},
    {apppool: web.apppool},
    {site: web.site},
    {revision: process.env.revision}
  ]

  ps.execute(command, params)
}

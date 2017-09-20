'use strict'

const fs = require('fs-extra')
const gulp = require('gulp')
const util = require('gulp-util')
const MergeStream = require('merge-stream')
const path = require('path')

const env = require('./env.js')
const files = require('./files.js')
const ps = require('./ps.js')

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

  let mergestream = MergeStream()

  util.log(util.colors.green(`Taking ${process.env.target} offline...`))

  env.getWebConfig().servers.forEach((server) => {
    let dest = env.getWebConfig(server).current.dest

    mergestream.add(
      gulp.src('app_offline.htm')
        .pipe(files.transform(files.log, dest))
        .pipe(gulp.dest(dest, {overwrite: true})))
  })

  return mergestream
})

gulp.task('app:online', () => {
  const help = `, e.g. gulp app:online -e dev`

  if (!env.isEnvironmentDefined()) {
    util.log(util.colors.red(`Environment not specified`, help))
    return
  }

  util.log(util.colors.green(`Bringing ${process.env.target} online...`))

  let deletes = []

  env.getWebConfig().servers.forEach((server) => {
    let web = env.getWebConfig(server)

    let src = path.join(web.current.path, 'app_offline.htm')

    deletes.push(
      fs.remove(src)
        .then(() => util.log(`Deleting ${src}`))
        .catch((err) => util.log(util.colors.red(`Deleting ${src} failed!`), err))
    )
  })

  return Promise.all(deletes)
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
  const name = env.getConfig().name
  const pillar = env.getConfig().pillar
  const web = env.getWebConfig()

  let params = [
    {name: name},
    {pillar: pillar},
    {env: process.env.target},
    {servers: web.servers},
    {apppool: web.apppool},
    {site: web.site},
    {revision: process.env.revision}
  ]

  ps.execute(command, params)
}

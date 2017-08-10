'use strict'

const argv = require('minimist')(process.argv.slice(2))
const gulp = require('gulp')
const MergeStream = require('merge-stream')
const sequence = require('run-sequence')
const util = require('gulp-util')
const path = require('path')

const env = require('./gulp/env.js')
const files = require('./gulp/files.js')
const mssql = require('./gulp/mssql')

const pkg = require('./package.json')

env.parse(argv, pkg)

require('./gulp/gulp.db.js')
require('./gulp/gulp.build.js')
require('./gulp/gulp.app.js')
require('./gulp/gulp.local.js')

gulp.task('copy', () => {
  let mergestream = MergeStream()

  let configuration = env.getEnvironmentConfig()
  let web = configuration.web
  let revision = process.env.revision

  let src = path.join(process.cwd(), 'Web')

  for (let i = 0; i < web.servers.length; i++) {
    let dest = path.join(`//${web.servers[i]}`, web.path, 'releases', revision, 'Web')

    mergestream.add(
      gulp.src(path.join(src, '**/*'))
        .pipe(files.transform(files.updateWebConfig, configuration, dest, pkg))
        .pipe(files.transform(files.log, configuration, dest))
        .pipe(gulp.dest(dest, {overwrite: true})))
  }

  return mergestream
})

function generateJobStatusQuery (status) {
  return `UPDATE job SET Status = '${status}'`
}

gulp.task('jobs:start', () => {
  let db = env.getEnvironmentConfig().db

  let sql = generateJobStatusQuery('Idle')

  return mssql.run(sql, db)
    .catch(err => {
      util.log(util.colors.red(`Error starting jobs: ${sql}`))
      util.log(err)
    })
})

gulp.task('jobs:stop', () => {
  let db = env.getEnvironmentConfig().db

  let sql = generateJobStatusQuery('Stopped')

  return mssql.run(sql, db)
    .catch(err => {
      util.log(util.colors.red(`Error stopping jobs: ${sql}`))
      util.log(err)
    })
})

gulp.task('deploy', ['build'], () => {
  if (!env.isEnvironmentDefined()) {
    util.log(util.colors.red('Environment not specified, e.g. gulp deploy -e dev -p <password>'))
    return
  }

  if (!env.isPasswordDefined()) {
    util.log(util.colors.red('Password not specified, e.g. gulp deploy -e dev -p <password>'))
    return
  }

  util.log(util.colors.green(`Deploying to ${process.env.targets}`))

  return sequence(
    'app:offline',
    'jobs:stop',
    // 'db:backup',
    'copy',
    'app:link',
    'app:recycle',
    'jobs:start'
  )
})

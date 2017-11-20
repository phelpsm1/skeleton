'use strict'

const glob = require('glob')
const gulp = require('gulp')
const nunit = require('gulp-nunit-runner')
const path = require('path')
const sequence = require('run-sequence')

const env = require('./env.js')
const files = require('./files.js')

gulp.task('test:config', () => {
  let dest = env.getTestConfig().src

  return gulp.src(path.join(dest, 'App.config'))
    .pipe(files.transform(files.updateTestConfig, dest, 'unit'))
    .pipe(gulp.dest(dest, {overwrite: true}))
})

gulp.task('test:unit', () => {
  let cfg = env.getBuildConfig()

  return gulp.src(`./**/bin/${cfg.configuration}/**/Intel.*.Tests.dll`, {read: false})
    .pipe(nunit({
      executable: glob.sync('./packages/NUnit*/**/*-console.exe')[0],
      cleanup: true,
      noheader: true,
      nodots: false,
      nologo: true,
      noresult: false,
      stoponerror: true,
      trace: 'Error',
      verbose: false
    }))
})

gulp.task('test', ['build'], (cb) => {
  sequence(
    'test:config',
    'test:unit',
    cb)
})

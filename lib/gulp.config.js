'use strict'

const gulp = require('gulp')
const path = require('path')

const env = require('./env.js')
const files = require('./files.js')

function config (dest, file, func, target) {
  return gulp.src(path.join(dest, file))
    .pipe(files.transform(func, dest, target || process.env.target))
    .pipe(gulp.dest(dest, {overwrite: true}))
}

gulp.task('config:web', () => {
  return config(env.getWebConfig().src, 'Web.config', files.updateWebConfig)
})

gulp.task('config:test', () => {
  return config(env.getTestConfig().src, 'App.config', files.updateTestConfig, 'unit')
})

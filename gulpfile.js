'use strict'

// just used for testing

const colors = require('ansi-colors')
const gulp = require('gulp')
const log = require('fancy-log')
const skeleton = require('./index.js')

const env = skeleton.Env
const files = skeleton.Files
const mssql = skeleton.Data.mssql

gulp.task('a', (done) => {
  log.info(colors.green('gulp task a'))
  done()
})

gulp.task('b', (done) => {
  log.info(colors.green('gulp task b'))
  done()
})

gulp.task('c1', (done) => {
  log.info(colors.green('gulp task c1'))
  done()
})

gulp.task('c2', (done) => {
  log.info(colors.green('gulp task c2'))
  done()
})

gulp.task('example', gulp.series('a', 'b', gulp.parallel('c1', 'c2'), (done) => {
  log.info(colors.green('example gulp task'))
  done()
}))

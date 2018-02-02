'use strict'

// just used for testing

const colors = require('ansi-colors')
const gulp = require('gulp')
const log = require('fancy-log')
const skeleton = require('./index.js')

const env = skeleton.Env
const files = skeleton.Files
const mssql = skeleton.Data.mssql

gulp.task('example', [], () => {
  log.info(colors.green('Example gulp task'))
})

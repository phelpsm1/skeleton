'use strict'

// just used for testing

const gulp = require('gulp')
const util = require('gulp-util')
const skeleton = require('./index.js')

const env = skeleton.Env
const files = skeleton.Files
const mssql = skeleton.Data.mssql

gulp.task('example', [], () => {
  util.log(util.colors.green('Example gulp task'))
})

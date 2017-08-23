'use strict'

// just used for testing

const gulp = require('gulp')
const util = require('gulp-util')

const env = require('./index.js').Env

const pkg = require('./package.json')

env.parse(process.argv, pkg)

gulp.task('example', ['config'], () => {
  util.log(util.colors.green('Example gulp task'))
})

'use strict'

const gulp = require('gulp')
const util = require('gulp-util')

const env = require('./env.js');

// define a gulp task for each environment define in appSettings that sets the process.env.target
(() => {
  env.getEnvironments().forEach((env) => {
    gulp.task(`env:${env}`, () => {
      process.env.target = env
      util.log(util.colors.green(`process.env.target set to ${process.env.target}`))
    })
  })
})()

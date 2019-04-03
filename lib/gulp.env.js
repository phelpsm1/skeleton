'use strict'

const colors = require('ansi-colors')
const gulp = require('gulp')
const log = require('fancy-log')

const env = require('./env');

// define a gulp task for each environment define in appSettings that sets the process.env.target
(() => {
  env.getEnvironments().forEach((env) => {
    let task = (done) => {
      process.env.target = env
      log.info(colors.green(`process.env.target set to ${process.env.target}`))
      done()
    }

    task.displayName = `env:${env}`
    task.description = 'Set the process.env.target'
    gulp.task(task)
  })
})()

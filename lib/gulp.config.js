'use strict'

const gulp = require('gulp')
const { dest, src } = require('gulp')

const path = require('path')

const env = require('./env')
const files = require('./files')

const web = () => {
  let destination = env.getWebConfig().src

  return src(path.join(destination, 'Web.config'))
    .pipe(files.transform(files.updateWebConfig, destination, process.env.target))
    .pipe(dest(destination, { overwrite: true }))
}

web.displayName = 'config:web'
web.description = 'Configure web.config file'
gulp.task(web)

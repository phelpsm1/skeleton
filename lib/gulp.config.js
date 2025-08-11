'use strict'

const gulp = require('gulp')
const { dest, src } = require('gulp')

const path = require('path')

const env = require('./env')
const files = require('./files')

const web = () => {
  const dir = env.getWebConfig().src

  return src(path.join(dir, 'Wspw.Web.dll.config'), { base: dir })
    .pipe(files.transform(files.updateWebConfig, dir, process.env.target))
    .pipe(dest(dir, { overwrite: true }))
}

web.displayName = 'config:web'
web.description = 'Configure web.config file'
gulp.task(web)

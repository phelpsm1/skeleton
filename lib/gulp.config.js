'use strict'

const gulp = require('gulp')
const path = require('path')

const env = require('./env')
const files = require('./files')

gulp.task('config:web', () => {
  let dest = env.getWebConfig().src

  return gulp.src(path.join(dest, 'Web.config'))
    .pipe(files.transform(files.updateWebConfig, dest, process.env.target))
    .pipe(gulp.dest(dest, { overwrite: true }))
})

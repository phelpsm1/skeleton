const gulp = require('gulp')
const path = require('path')

const files = require('./files.js')

gulp.task('config:web', () => {
  const dest = './Web' // TODO: (jmorris2) move to getWebConfig().getPath()

  return gulp.src(path.join(dest, 'Web.config'))
    .pipe(files.transform(files.updateWebConfig, dest))
    .pipe(gulp.dest(dest, {overwrite: true}))
})

gulp.task('config:test', () => {
  const dest = './Tests' // TODO: (jmorris2) move to getWebConfig().getPath()

  return gulp.src(path.join(dest, 'App.config'))
    .pipe(files.transform(files.updateTestConfig, dest, 'unit'))
    .pipe(gulp.dest(dest, {overwrite: true}))
})

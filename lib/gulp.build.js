'use strict'

const glob = require('glob')
const gulp = require('gulp')
const msbuild = require('gulp-msbuild')
const nunit = require('gulp-nunit-runner')
const util = require('gulp-util')

const toolsVersion = 15.0
const configuration = 'Release'

gulp.task('clean', () => {
  return gulp.src('./*.sln')
    .pipe(msbuild({
      targets: ['Clean'],
      toolsVersion: toolsVersion,
      configuration: configuration,
      verbosity: 'detailed',
      errorOnFail: true
    }))
})

gulp.task('compile', ['clean'], () => {
  return gulp.src('./*.sln')
    .pipe(msbuild({
      targets: ['Build'],
      toolsVersion: toolsVersion,
      configuration: configuration,
      verbosity: 'detailed',
      errorOnFail: true
    }))
})

gulp.task('test', ['compile'], () => {
  return gulp.src(`./**/bin/${configuration}/**/Intel.*.Tests.dll`, {read: false})
    .pipe(nunit({
      executable: glob.sync('./packages/NUnit*/**/*-console.exe')[0],
      cleanup: true,
      noheader: true,
      nodots: false,
      nologo: true,
      noresult: false,
      stoponerror: true,
      trace: 'Error',
      verbose: false
    }))
})

gulp.task('build', ['test'], () => util.log(`Building...`))

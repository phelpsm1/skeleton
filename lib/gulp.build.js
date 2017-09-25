'use strict'

const assemblyInfo = require('gulp-dotnet-assembly-info')
const glob = require('glob')
const gulp = require('gulp')
const moment = require('moment')
const msbuild = require('gulp-msbuild')
const nunit = require('gulp-nunit-runner')
const sequence = require('run-sequence')

const env = require('./env.js')

const toolsVersion = 15.0
const configuration = 'Release'

gulp.task('build:clean', () => {
  return gulp.src('./*.sln')
    .pipe(msbuild({
      targets: ['Clean'],
      toolsVersion: toolsVersion,
      configuration: configuration,
      verbosity: 'detailed',
      errorOnFail: true
    }))
})

function getCopyright () {
  return `Copyright Intel Corporation ${moment().year()}`
}

function getVersion () {
  let split = env.pkg.version.split('.')

  return `${split[0]}.${split[1]}`
}

function getFileVersion () {
  return env.pkg.version
}

gulp.task('build:assemblyinfo', () => {
  return gulp.src('**/AssemblyInfo.cs')
    .pipe(assemblyInfo({
      configuration: configuration,
      company: 'Intel Corporation',
      product: env.pkg.name,
      copyright: getCopyright(),
      version: getVersion(),
      fileVersion: getFileVersion()
    }))
    .pipe(gulp.dest('.'))
})

gulp.task('build:compile', ['build:clean', 'build:assemblyinfo'], () => {
  return gulp.src('./*.sln')
    .pipe(msbuild({
      targets: ['Build'],
      toolsVersion: toolsVersion,
      configuration: configuration,
      verbosity: 'detailed',
      errorOnFail: true
    }))
})

gulp.task('test:unit', ['build:compile'], () => {
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

gulp.task('build', (cb) => sequence('config:test', 'test:unit', cb))

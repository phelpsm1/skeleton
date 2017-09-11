'use strict'

const assemblyInfo = require('gulp-dotnet-assembly-info')
const glob = require('glob')
const gulp = require('gulp')
const moment = require('moment')
const msbuild = require('gulp-msbuild')
const nunit = require('gulp-nunit-runner')
const path = require('path')
const sequence = require('run-sequence')

const pkg = require(path.join(process.cwd(), 'package.json'))

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

function getCopyright () {
  return `Copyright Intel Corporation ${moment().year()}`
}

function getVersion () {
  let split = pkg.version.split('.')

  return `${split[0]}.${split[1]}`
}

function getFileVersion () {
  return pkg.version
}

gulp.task('assemblyinfo', () => {
  return gulp.src('**/AssemblyInfo.cs')
    .pipe(assemblyInfo({
      configuration: configuration,
      company: 'Intel Corporation',
      product: pkg.name,
      copyright: getCopyright(),
      version: getVersion(),
      fileVersion: getFileVersion()
    }))
    .pipe(gulp.dest('.'))
})

gulp.task('compile', ['clean', 'assemblyinfo'], () => {
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

gulp.task('build', (cb) => sequence('config:test', 'test', cb))

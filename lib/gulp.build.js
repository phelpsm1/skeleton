'use strict'

const assemblyInfo = require('gulp-dotnet-assembly-info')
const gulp = require('gulp')
const msbuild = require('gulp-msbuild')

const env = require('./env.js')

gulp.task('build:clean', () => {
  let cfg = env.getBuildConfig()

  return gulp.src('./*.sln')
    .pipe(msbuild({
      targets: ['Clean'],
      toolsVersion: cfg.tools.version,
      configuration: cfg.configuration,
      verbosity: 'detailed',
      errorOnFail: true
    }))
})

gulp.task('build:assemblyinfo', () => {
  let cfg = env.getBuildConfig()

  return gulp.src('**/AssemblyInfo.cs')
    .pipe(assemblyInfo({
      configuration: cfg.configuration,
      company: cfg.company,
      product: cfg.product,
      copyright: cfg.copyright,
      version: cfg.version,
      fileVersion: cfg.fileVersion
    }))
    .pipe(gulp.dest('.'))
})

gulp.task('build:compile', ['build:clean', 'build:assemblyinfo'], () => {
  let cfg = env.getBuildConfig()

  return gulp.src('./*.sln')
    .pipe(msbuild({
      targets: ['Build'],
      toolsVersion: cfg.tools.version,
      configuration: cfg.configuration,
      verbosity: 'detailed',
      errorOnFail: true
    }))
})

gulp.task('build', ['build:compile'])

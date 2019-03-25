'use strict'

const { dest, series, src } = require('gulp')
const gulp = require('gulp')

const assemblyInfo = require('gulp-dotnet-assembly-info')
const msbuild = require('gulp-msbuild')

const env = require('./env')

const clean = () => {
  let cfg = env.getBuildConfig()

  return src('./*.sln')
    .pipe(msbuild({
      targets: ['Clean'],
      toolsVersion: cfg.tools.version,
      configuration: cfg.configuration,
      verbosity: 'detailed',
      errorOnFail: true
    }))
}

clean.displayName = 'build:clean'
clean.description = 'Clean the solution'

const assemblyinfo = () => {
  let cfg = env.getBuildConfig()

  return src('**/AssemblyInfo.cs')
    .pipe(assemblyInfo({
      configuration: cfg.configuration,
      company: cfg.company,
      product: cfg.product,
      copyright: cfg.copyright,
      version: cfg.version,
      fileVersion: cfg.fileVersion
    }))
    .pipe(dest('.'))
}

assemblyinfo.displayName = 'build:assemblyinfo'
assemblyinfo.description = 'Update the AssemblyInfo files'

const compile = () => {
  let cfg = env.getBuildConfig()

  return src('./*.sln')
    .pipe(msbuild({
      targets: ['Build'],
      toolsVersion: cfg.tools.version,
      configuration: cfg.configuration,
      verbosity: 'detailed',
      errorOnFail: true
    }))
}

compile.displayName = 'build:compile'
compile.description = 'Compile the solution'

const build = series(clean, assemblyinfo, compile)

build.displayName = 'build'
build.description = 'Build the solution'
gulp.task(build)

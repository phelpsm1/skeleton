'use strict'

const { dest, series, src } = require('gulp')
const gulp = require('gulp')

const assemblyInfo = require('gulp-dotnet-assembly-info')
const msbuild = require('gulp-msbuild')

const env = require('./env')

function getBuildOptions (target) {
  const cfg = env.getBuildConfig()

  // verbosity values: q[uiet], m[inimal], n[ormal] (default), d[etailed], and diag[nostic]

  return {
    targets: [target],
    toolsVersion: cfg.tools.version,
    configuration: cfg.configuration,
    logCommand: true,
    verbosity: 'minimal',
    stdout: true,
    errorOnFail: true
  }
}

const clean = () => {
  return src('./*.sln').pipe(msbuild(getBuildOptions('Clean')))
}

clean.displayName = 'build:clean'
clean.description = 'Clean the solution'

const assemblyinfo = () => {
  const cfg = env.getBuildConfig()

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
  return src('./*.sln').pipe(msbuild(getBuildOptions('Build')))
}

compile.displayName = 'build:compile'
compile.description = 'Compile the solution'

const build = series(clean, assemblyinfo, compile)

build.displayName = 'build'
build.description = 'Build the solution'
gulp.task(build)

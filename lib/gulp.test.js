'use strict'

const gulp = require('gulp')
const { dest, series, src } = require('gulp')

const glob = require('glob')
const nunit = require('gulp-nunit-runner')
const path = require('path')

const env = require('./env')
const files = require('./files')

const config = () => {
  let destination = env.getTestConfig().src

  return src(path.join(destination, 'App.config'))
    .pipe(files.transform(files.updateTestConfig, destination, 'unit'))
    .pipe(dest(destination, { overwrite: true }))
}

config.displayName = 'test:config'
config.description = 'Configure test app.config file'
gulp.task(config)

const unit = () => {
  let cfg = env.getBuildConfig()

  return src(`./**/bin/${cfg.configuration}/**/Intel.*.Tests.dll`, { read: false })
    .pipe(nunit({
      executable: glob.sync('./packages/NUnit*/**/*-console.exe')[0],
      options: {
        noheader: true,
        // noresult: false,
        stoponerror: true
      }
    }))
}

unit.displayName = 'test:unit'
unit.description = 'Execute unit tests'
gulp.task(unit)

const test = series(config, 'build', unit)

test.displayName = 'test'
test.description = 'Test application, i.e. unit tests'
gulp.task(test)

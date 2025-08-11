'use strict'

const gulp = require('gulp')
const { dest, series, src } = require('gulp')

const glob = require('glob')
const nunit = require('gulp-nunit-runner')
const path = require('path')

const env = require('./env')
const files = require('./files')

const config = () => {
  const dir = env.getTestConfig().src

  return src(path.join(dir, 'App.config'), { base: dir })
    .pipe(files.transform(files.updateTestConfig, dir, 'unit'))
    .pipe(dest(dir, { overwrite: true }))
}

config.displayName = 'test:config'
config.description = 'Configure test app.config file'
gulp.task(config)

const unit = () => {
  const cfg = env.getBuildConfig()

  return src(`./**/bin/${cfg.configuration}/**/Intel.*.Tests.dll`, { read: false })
    .pipe(nunit({
      executable: glob.sync(path.join(os.homedir(), '.nuget/packages/nunit.consolerunner/**/*-console.exe'))[0],
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

'use strict'

// just used for testing

const { series, parallel } = require('gulp')

const colors = require('ansi-colors')
const GulpError = require('plugin-error')
const log = require('fancy-log')

const skeleton = require('./index')

const env = skeleton.Env
const files = skeleton.Files
const mssql = skeleton.Data.mssql

const a = (done) => {
  log.info(colors.green('gulp task a'))
  done()
}

const b = (done) => {
  log.info(colors.green('gulp task b'))
  done()
}

const c1 = (done) => {
  log.info(colors.green('gulp task c1'))
  done()
}

const c2 = (done) => {
  log.info(colors.green('gulp task c2'))
  done()
}

function checkGuards (plugin) {
  function checkRandom (done) {
    const random = Math.random()

    log.info(colors.green(random))

    if (random > 0.5) {
      throw new GulpError({ plugin: plugin, message: 'There was an error', showStack: true })
    }

    done()
  }

  return parallel(checkRandom, checkRandom, checkRandom)
}

const utAppOffline = series('env:story2', 'app:offline')

utAppOffline.displayName = 'ut:appoffline'
utAppOffline.description = 'UNIT TEST: app:offline'
exports.utAppOffline = utAppOffline

const example = series(checkGuards('example'), a, b, parallel(c1, c2), (done) => {
  log.info(colors.green('example gulp task'))
  done()
})

example.displayName = 'example'
example.description = 'Example gulp task'
exports.example = example

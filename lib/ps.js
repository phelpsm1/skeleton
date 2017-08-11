'use strict'

const Shell = require('node-powershell')
const util = require('gulp-util')

function execute (command, config) {
  let ps = new Shell({
    debugMsg: false,
    executionPolicy: 'Bypass',
    noProfile: true
  })

  util.log(`__dirname: ${__dirname}`)
  util.log(`__filename: ${__filename}`)
  util.log(`cwd: ${process.cwd()}`)

  ps.addCommand(`lib/jarvis.ps1 ${command}`, config)

  return ps
    .invoke()
    .then(output => {
      util.log(`${output}`)
      ps.dispose()
    })
    .catch(err => {
      util.log(util.colors.red(`Unexpected exception occurred:`))
      util.log(util.colors.red(err))
      ps.dispose()
    })
}

module.exports = {
  execute: execute
}

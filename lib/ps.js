'use strict'

const path = require('path')
const Shell = require('node-powershell')
const util = require('gulp-util')

function execute (command, config) {
  let ps = new Shell({
    debugMsg: false,
    executionPolicy: 'Bypass',
    noProfile: true
  })

  ps.addCommand(`${path.join(__dirname, 'jarvis.ps1')} ${command}`, config)

  return ps
    .invoke()
    .then(output => {
      util.log(`${output}`)
      ps.dispose()
    })
    .catch(err => {
      util.log(util.colors.red(`Unexpected exception occurred running: ${command}`))
      ps.dispose()
      throw err
    })
}

module.exports = {
  execute: execute
}

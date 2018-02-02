'use strict'

const path = require('path')
const Shell = require('node-powershell')
const util = require('gulp-util')

function execute (command, params, file = 'jarvis.ps1') {
  let ps = new Shell({
    debugMsg: false,
    executionPolicy: 'Bypass',
    noProfile: true
  })

  ps.addCommand(`${path.join(__dirname, file)} ${command}`, params)

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

function iisexpressstart (params) {
  return execute('Start-IisExpress', params, 'iisexpress.ps1')
}

module.exports = {
  execute: execute,
  iisexpress: {
    start: iisexpressstart
  }
}

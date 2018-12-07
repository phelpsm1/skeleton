'use strict'

const colors = require('ansi-colors')
const fs = require('fs')
const log = require('fancy-log')
const path = require('path')
const Shell = require('node-powershell')

function execute (command, params, file = 'jarvis.ps1', credentials = 'credentials.xml') {
  let ps = new Shell({
    debugMsg: false,
    executionPolicy: 'Bypass',
    noProfile: true
  })

  params.push({ file: credentials })

  if (!fs.existsSync(credentials)) {
    log.warn(colors.yellow(`To prevent re-entering credentials, use the following PowerShell command to save them:`))
    log.warn(colors.yellow(`\tPS ${process.cwd()}> Get-Credential | Export-Clixml "${credentials}"`))
  }

  ps.addCommand(`${path.join(__dirname, file)} ${command}`, params)

  return ps
    .invoke()
    .then(output => {
      log.info(`${output}`)
      ps.dispose()
    })
    .catch(err => {
      log.error(colors.red(`Unexpected exception occurred running: ${command}`))
      ps.dispose()
      throw err
    })
}

function iisexpressstart (params) {
  return execute('Start-IisExpress', params, 'iisexpress.ps1', 'system.xml')
}

module.exports = {
  execute: execute,
  iisexpress: {
    start: iisexpressstart
  }
}

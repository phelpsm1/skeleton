'use strict'

const find = require('find-process')
const path = require('path')
const spawn = require('child_process').spawn

module.exports = () => ({
  start: site => {
    let iispath = `${process.env.PROGRAMFILES}\\IIS Express`
    let configPath = path.join(process.cwd(), '.vs', 'config', 'applicationhost.config')
    let command = `iisexpress /config:${configPath} /site:${site}`

    const options = {
      cwd: iispath,
      env: process.env,
      detached: true,
      stdio: ['ignore', 'ignore', 'ignore']
    }

    spawn('cmd', ['/c', command], options).unref()
  },
  stop: () => find('name', 'iisexpress').then(list => {
    list.forEach(function (p) {
      switch (p.name) {
        case 'iisexpress.exe':
          process.kill(p.pid)
          break
      }
    })
  })
})

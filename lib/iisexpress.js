'use strict'

const find = require('find-process')
const path = require('path')

const ps = require('./ps.js')

module.exports = () => ({
  start: site => {
    const params = [
      { site: site },
      { iispath: `${process.env.PROGRAMFILES}\\IIS Express` },
      { iisconfig: path.join(process.cwd(), '.vs', 'config', 'applicationhost.config') }
    ]

    return ps.iisexpress.start(params)
  },
  stop: () => find('name', 'iisexpress').then(list => {
    list.forEach((p) => {
      switch (p.name) {
        case 'iisexpress.exe':
          process.kill(p.pid)
          break
      }
    })
  })
})

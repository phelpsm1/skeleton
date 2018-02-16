'use strict'

const colors = require('ansi-colors')
const fs = require('fs-extra')
const gulp = require('gulp')
const log = require('fancy-log')
const moment = require('moment')
const path = require('path')

const env = require('./env.js')

gulp.task('clean:releases', () => {
  let deletes = []

  env.getWebConfig().servers
    .forEach((server) => {
      let config = env.getWebConfig(server)
      let dest = config.release.root

      let dirs = fs.readdirSync(dest)
        .map((name) => {
          let fileStats = fs.statSync(path.join(dest, name))

          if (!fileStats.isDirectory()) {
            return
          }

          return {
            name: name,
            time: fileStats.mtime.getTime()
          }
        })
        .sort((a, b) => { return a.time - b.time }) // ascending order

      dirs.splice(-config.clean.releases)

      dirs.forEach((dir) => {
        let p = path.join(dest, dir.name)

        let d = fs.remove(p)
          .then(() => log.info(colors.green(`Directory ${p} deleted`)))
          .catch((err) => log.info(colors.red(`Delete of ${p} failed!`), err))

        deletes.push(d)
      })
    })

  return Promise.all(deletes)
})

gulp.task('clean:logs', () => {
  let deletes = []

  env.getWebConfig().servers
    .forEach((server) => {
      let logs = env.getWebConfig(server).shared.logs

      let files = fs.readdirSync(logs)
        .filter((name) => {
          return moment(fs.statSync(path.join(logs, name)).mtime).isBefore(moment().subtract(30, 'days'))
        })

      files.forEach((name) => {
        let p = path.join(logs, name)

        let d = fs.remove(p)
          .then(() => log.info(colors.green(`Log ${p} deleted`)))
          .catch((err) => log.error(colors.red(`Delete of ${p} failed!`), err))

        deletes.push(d)
      })
    })

  return Promise.all(deletes)
})

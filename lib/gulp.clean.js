'use strict'

const gulp = require('gulp')

const colors = require('ansi-colors')
const fs = require('fs-extra')
const log = require('fancy-log')
const moment = require('moment')
const path = require('path')

const env = require('./env')

const releases = () => {
  const deletes = []

  env.getWebConfig().servers
    .forEach((server) => {
      const config = env.getWebConfig(server)
      const destination = config.release.root

      const dirs = fs.readdirSync(destination)
        .map((name) => {
          const fileStats = fs.statSync(path.join(destination, name))

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
        const p = path.join(destination, dir.name)

        const d = fs.remove(p)
          .then(() => log.info(colors.green(`Directory ${p} deleted`)))
          .catch((err) => log.info(colors.red(`Delete of ${p} failed!`), err))

        deletes.push(d)
      })
    })

  return Promise.all(deletes)
}

releases.displayName = 'clean:releases'
releases.description = 'Delete old release directories'
gulp.task(releases)

const logs = () => {
  const deletes = []

  env.getWebConfig().servers
    .forEach((server) => {
      const config = env.getWebConfig(server)
      const logs = config.shared.logs

      const files = fs.readdirSync(logs)
        .filter((name) => {
          return moment(fs.statSync(path.join(logs, name)).mtime).isBefore(moment().subtract(config.clean.logs))
        })

      files.forEach((name) => {
        const p = path.join(logs, name)

        const d = fs.remove(p)
          .then(() => log.info(colors.green(`Log ${p} deleted`)))
          .catch((err) => log.error(colors.red(`Delete of ${p} failed!`), err))

        deletes.push(d)
      })
    })

  return Promise.all(deletes)
}

logs.displayName = 'clean:logs'
logs.description = 'Delete old log files'
gulp.task(logs)

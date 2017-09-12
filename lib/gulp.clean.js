'use strict'

const fs = require('fs-extra')
const gulp = require('gulp')
const moment = require('moment')
const path = require('path')
const util = require('gulp-util')

const env = require('./env.js')

gulp.task('clean:releases', () => {
  let deletes = []

  env.getWebConfig().servers
    .forEach((server) => {
      let dest = env.getWebConfig(server).release.root

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
        .sort((a, b) => { return a.time - b.time })

      dirs.splice(-5)

      dirs.forEach((dir) => {
        let p = path.join(dest, dir.name)

        let d = fs.remove(p)
          .then(() => util.log(util.colors.green(`Directory ${p} deleted`)))
          .catch((err) => util.log(util.colors.red(`Delete of ${p} failed!`), err))

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
          .then(() => util.log(util.colors.green(`Log ${p} deleted`)))
          .catch((err) => util.log(util.colors.red(`Delete of ${p} failed!`), err))

        deletes.push(d)
      })
    })

  return Promise.all(deletes)
})

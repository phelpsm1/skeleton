'use strict'

const { dest, src } = require('gulp')
const gulp = require('gulp')
const GulpError = require('plugin-error')

const colors = require('ansi-colors')
const fs = require('fs-extra')
const log = require('fancy-log')
const path = require('path')

const env = require('./env')
const files = require('./files')
const ps = require('./ps')

const down = buildTask(() => { return execute('Bring-Down') })

down.displayName = 'app:down'
down.description = 'Bring the application down'
gulp.task(down)

const up = buildTask(() => { return execute('Bring-Up') })

up.displayName = 'app:up'
up.description = 'Bring the application up'
gulp.task(up)

const offline = buildTask(() => {
  log.info(colors.green(`Taking ${process.env.target} offline...`))

  const copies = []

  env.getWebConfig().servers.forEach((server) => {
    const destination = env.getWebConfig(server).current.dest

    copies.push(
      new Promise((resolve, reject) => {
        src('app_offline.htm')
          .pipe(files.transform(files.log, destination))
          .pipe(dest(destination, { overwrite: true }))
          .on('error', reject)
          .on('end', resolve)
      })
    )
  })

  return Promise.all(copies)
})

offline.displayName = 'app:offline'
offline.description = 'Bring the application offline'
gulp.task(offline)

const online = buildTask(() => {
  log.info(colors.green(`Bringing ${process.env.target} online...`))

  const deletes = []

  env.getWebConfig().servers.forEach((server) => {
    const web = env.getWebConfig(server)

    const src = path.join(web.current.path, 'app_offline.htm')

    deletes.push(
      fs.remove(src)
        .then(() => log.info(`Deleting ${src}`))
        .catch((err) => log.error(colors.red(`Deleting ${src} failed!`), err))
    )
  })

  return Promise.all(deletes)
})

online.displayName = 'app:online'
online.description = 'Bring the application online'
gulp.task(online)

const recycle = buildTask(() => { return execute('Recycle') })

recycle.displayName = 'app:recycle'
recycle.description = 'Recycle the application'
gulp.task(recycle)

const link = buildTask(() => { return execute('Set-Current') })

link.displayName = 'app:link'
link.description = 'Set the current symlink to deployed code'
gulp.task(link)

const rollback = () => {
  const rollbacks = []

  env.getWebConfig().servers
    .forEach((server) => {
      const args = env.getArgs()

      if (args.r) {
        process.env.revision = args.r
      } else {
        const dest = env.getWebConfig(server).release.root

        const dirs = fs.readdirSync(dest)
          .map((name) => {
            const fileStats = fs.statSync(path.join(dest, name))

            if (!fileStats.isDirectory()) {
              return
            }

            return {
              name: name,
              time: fileStats.mtime.getTime()
            }
          })
          .sort((a, b) => { return b.time - a.time }) // descending order

        process.env.revision = dirs[1].name // second most recent release
      }

      rollbacks.push(execute('Set-Current'))
    })

  return Promise.all(rollbacks)
}

rollback.displayName = 'app:rollback'
rollback.description = 'Rollback the application to the previous version'
gulp.task(rollback)

const status = buildTask(() => { return execute('Get-Status') })

status.displayName = 'app:status'
status.description = 'Get the status of the application'
gulp.task(status)

function buildTask (func) {
  return (done) => {
    if (env.is('local')) {
      log.warn(colors.yellow(`No need to perform task in ${process.env.target} environment.  Use -e to specify environment, e.g. gulp <task> -e dev`))
      done()
      return
    }

    func()
      .then(() => {
        done()
      })
      .catch((err) => {
        done(new GulpError({
          plugin: 'buildTask',
          message: err,
          showStack: false
        }))
      })
  }
}

function execute (command) {
  const name = env.pkg.name
  const pillar = env.pkg.pillar
  const web = env.getWebConfig()

  const params = [
    { name: name },
    { pillar: pillar },
    { env: process.env.target },
    { servers: web.servers },
    { apppool: web.apppool },
    { site: web.site },
    { revision: process.env.revision },
    { drive: web.drive || 'D' }
  ]

  return ps.execute(command, params)
}

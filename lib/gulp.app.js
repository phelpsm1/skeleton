'use strict'

const colors = require('ansi-colors')
const fs = require('fs-extra')
const gulp = require('gulp')
const log = require('fancy-log')
const path = require('path')

const env = require('./env')
const files = require('./files')
const ps = require('./ps')

gulp.task('app:down', buildTask(() => { return execute('Bring-Down') }))

gulp.task('app:up', buildTask(() => { return execute('Bring-Up') }))

gulp.task('app:offline', buildTask(() => {
  log.info(colors.green(`Taking ${process.env.target} offline...`))

  let copies = []

  env.getWebConfig().servers.forEach((server) => {
    let dest = env.getWebConfig(server).current.dest

    copies.push(
      new Promise((resolve, reject) => {
        gulp.src('app_offline.htm')
          .pipe(files.transform(files.log, dest))
          .pipe(gulp.dest(dest, { overwrite: true }))
          .on('error', reject)
          .on('end', resolve)
      })
    )
  })

  return Promise.all(copies)
}))

gulp.task('app:online', buildTask(() => {
  log.info(colors.green(`Bringing ${process.env.target} online...`))

  let deletes = []

  env.getWebConfig().servers.forEach((server) => {
    let web = env.getWebConfig(server)

    let src = path.join(web.current.path, 'app_offline.htm')

    deletes.push(
      fs.remove(src)
        .then(() => log.info(`Deleting ${src}`))
        .catch((err) => log.error(colors.red(`Deleting ${src} failed!`), err))
    )
  })

  return Promise.all(deletes)
}))

gulp.task('app:recycle', buildTask(() => { return execute('Recycle') }))

gulp.task('app:link', buildTask(() => { return execute('Set-Current') }))

gulp.task('app:rollback', () => {
  let rollbacks = []

  env.getWebConfig().servers
    .forEach((server) => {
      let args = env.getArgs()

      if (args.r) {
        process.env.revision = args.r
      } else {
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
          .sort((a, b) => { return b.time - a.time }) // descending order

        process.env.revision = dirs[1].name // second most recent release
      }

      rollbacks.push(execute('Set-Current'))
    })

  return Promise.all(rollbacks)
})

gulp.task('app:status', buildTask(() => { return execute('Get-Status') }))

function buildTask (func) {
  if (env.is('local')) {
    return (done) => {
      log.warn(colors.yellow(`No need to perform task in ${process.env.target} environment.  Use -e to specify environment, e.g. gulp <task> -e dev`))
      done()
    }
  }

  return func
}

function execute (command) {
  const name = env.pkg.name
  const pillar = env.pkg.pillar
  const web = env.getWebConfig()

  let params = [
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

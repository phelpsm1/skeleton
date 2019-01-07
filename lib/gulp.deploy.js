'use strict'

const colors = require('ansi-colors')
const gulp = require('gulp')
const log = require('fancy-log')
const log4js = require('log4js')
const moment = require('moment')
const path = require('path')

const env = require('./env')
const files = require('./files')
const smtp = require('./smtp')
const git = require('./git')

gulp.task('deploy:info', (done) => {
  log.info(colors.green(`Deploying to ${process.env.target.toUpperCase()}`))
  done()
})

gulp.task('deploy:notify:log', (done) => {
  let pattern = '[%d] [%5x{target}] v%x{version} (%x{revision}) %h %x{user} '
  let tokens = {
    target: () => process.env.target.toUpperCase(),
    user: () => process.env.USERNAME,
    revision: () => process.env.revision,
    version: () => env.pkg.version
  }

  log4js.configure(files.getNotifyFileConfiguration('deploy.log', pattern, tokens))

  log4js.getLogger().info()

  done()
})

gulp.task('deploy:notify:email', () => {
  return getNotifyFileLatest()
    .then((latest) => {
      let lastDeployedRevision = latest
        .find(l => l.environment.toLowerCase() === process.env.target.toLowerCase())
        .revision
        .split('.')[0] // when multiple builds on same revision number, i.e. drop the .1, .2, etc.

      let commits = git.getCommits(lastDeployedRevision, process.env.revision)

      let locals = {
        name: env.pkg.name,
        version: env.pkg.version,
        revision: process.env.revision,
        env: process.env.target.toUpperCase(),
        at: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
        by: process.env.USERNAME,
        from: process.env.COMPUTERNAME,
        commits: {
          range: {
            start: lastDeployedRevision,
            end: process.env.revision
          },
          list: commits
        }
      }

      let message = {
        subject: `${locals.name} v${locals.version} (${locals.revision}) deployed to ${locals.env}`,
        text: {
          template: path.join(__dirname, 'deploy.notify.email.text.pug'),
          locals: locals
        },
        html: {
          template: path.join(__dirname, 'deploy.notify.email.html.pug'),
          locals: locals
        }
      }

      return smtp.mail(message)
    })
})

// sequence is important here
// email depends on values in deploy.log, so email needs to be sent before deploy.log is updated
gulp.task('deploy:notify', gulp.series('deploy:notify:email', 'deploy:notify:log'))

gulp.task('deploy:status', () => {
  return getNotifyFileLatest()
    .then((latest) => {
      let environmentMaxLen = Math.max(...latest.map(l => l.environment.length))
      let revisionMaxLen = Math.max(...latest.map(l => l.revision.length))
      const pad = '                   '

      latest.forEach((l) => {
        log.info(colors.green(`[${l.datetime}]\t[${String(pad + l.environment).slice(-environmentMaxLen)}]\tv${l.version}\t(${String(pad + l.revision).slice(-revisionMaxLen)})\t${l.from}\t${l.by}`))
      })
    })
})

function getNotifyFileLatest () {
  let parser = (line) => {
    let matches = /\[(.*)\]\s*\[\s*(\S*)\]\s*v(.*)\s*\((\S*)\)\s*(\S*)\s*(\S*)/igm.exec(line)

    return {
      datetime: matches[1].trim(),
      environment: matches[2].trim(),
      version: matches[3].trim(),
      revision: matches[4].trim(),
      from: matches[5].trim(),
      by: matches[6].trim()
    }
  }

  return files.getNotifyFileLatest('deploy.log', parser)
}

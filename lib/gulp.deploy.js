'use strict'

const gulp = require('gulp')
const { parallel, series } = require('gulp')

const colors = require('ansi-colors')
const log = require('fancy-log')
const log4js = require('log4js')
const moment = require('moment')
const path = require('path')
const rp = require('request-promise-native')

const env = require('./env')
const files = require('./files')
const smtp = require('./smtp')
const git = require('./git')

const info = (done) => {
  log.info(colors.green(`Deploying ${process.env.revision} to ${process.env.target.toUpperCase()}`))
  done()
}

info.displayName = 'deploy:info'
info.description = 'Display deployment environment information'
gulp.task(info)

const notifylog = (done) => {
  const pattern = '[%d] [%5x{target}] v%x{version} (%x{revision}) %h %x{user} '
  const tokens = {
    target: () => process.env.target.toUpperCase(),
    user: () => process.env.USERNAME,
    revision: () => process.env.revision,
    version: () => env.pkg.version
  }

  log4js.configure(files.getNotifyFileConfiguration('deploy.log', pattern, tokens))

  log4js.getLogger().info()

  done()
}

notifylog.displayName = 'deploy:notify:log'
notifylog.description = 'Add log entry with deployment information'
gulp.task(notifylog)

const notifyemail = () => {
  return getNotifyFileLatest()
    .then((latest) => {
      const entry = latest.find(l => l.environment.toLowerCase() === process.env.target.toLowerCase())

      let lastDeployedRevision = '0000000'

      // verify that there was an entry
      if (entry) {
        // when multiple builds on same revision number, i.e. drop the .1, .2, etc.
        lastDeployedRevision = entry.revision.split('.')[0]
      }

      if (lastDeployedRevision === '0000000') {
        return
      }

      return git.commits
        .fetch(lastDeployedRevision, process.env.revision, { pid: env.pkg.gitlabprojectid, token: env.getArgs().gitlab.token })
        .then((commits) => {
          const locals = {
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

          const message = {
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
}

notifyemail.displayName = 'deploy:notify:email'
notifyemail.description = 'Send deployment email'

const squawk = (body) => {
  const options = {
    method: 'POST',
    uri: 'https://squawk-api.app.intel.com/v1/squawks',
    body: body,
    json: true,
    insecure: true,
    rejectUnauthorized: false
  }

  log.info('Squawking the deploy...')
  for (const key in body) {
    log.info(colors.gray(`\t${key}: ${body[key]}`))
  }

  return rp(options)
    .then((response) => {
      log.info(colors.green(`Squawk (${response.id}) successfully recorded!`))
      return response
    })
    .catch((err) => {
      log.error(colors.red(err))
    })
}

const notifysquawk = (done) => {
  if (!env.pkg.iapid) {
    log.warn(colors.yellow('To enable Squawking, add your IAP ID to your package.json file'))
    done()
    return
  }

  if (!env.pkg.twcid) {
    log.warn(colors.yellow('To associate this squawk to your team, add your TWC ID to your package.json file'))
  }

  function getCommitter () {
    if (process.env.USERNAME) {
      const idsid = process.env.USERNAME.toLowerCase().replace('mfg_', '')
      const contributor = env.pkg.contributors.find(c => c.idsid === idsid)

      return contributor ? contributor.email : idsid
    } else {
      return null
    }
  }

  function getRepoUrl () {
    if (env.pkg.repository && env.pkg.repository.url) {
      return env.pkg.repository.url.replace('.git', '')
    } else {
      return null
    }
  }

  const body = {
    iapId: env.pkg.iapid,
    committer: getCommitter(),
    teamId: env.pkg.twcid,
    environment: process.env.target ? process.env.target.toLowerCase() : null,
    subApp: env.pkg.name,
    executor: 'manual',
    repoUrl: getRepoUrl(),
    commitSha: process.env.revision
  }

  return squawk(body)
}

notifysquawk.displayName = 'deploy:notify:squawk'
notifysquawk.desription = 'Squawk about deployment'

// sequence is important here
// email depends on values in deploy.log, so email needs to be sent before deploy.log is updated
const notify = parallel(series(notifyemail, notifylog), notifysquawk)

notify.displayName = 'deploy:notify'
notify.description = 'Notify of deployment of application'
gulp.task(notify)

const status = () => {
  return getNotifyFileLatest()
    .then((latest) => {
      const environmentMaxLen = Math.max(...latest.map(l => l.environment.length))
      const revisionMaxLen = Math.max(...latest.map(l => l.revision.length))
      const pad = '                   '

      latest.forEach((l) => {
        log.info(colors.green(`[${l.datetime}]\t[${String(pad + l.environment).slice(-environmentMaxLen)}]\tv${l.version}\t(${String(pad + l.revision).slice(-revisionMaxLen)})\t${l.from}\t${l.by}`))
      })

      return latest
    })
}

status.displayName = 'deploy:status'
status.description = 'Get status of deployments'
gulp.task(status)

function getNotifyFileLatest () {
  const parser = (line) => {
    const matches = /\[(.*)\]\s*\[\s*(\S*)\]\s*v(.*)\s*\((\S*)\)\s*(\S*)\s*(\S*)/igm.exec(line)

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

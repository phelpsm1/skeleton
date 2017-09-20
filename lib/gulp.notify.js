'use strict'

const gulp = require('gulp')
const log4js = require('log4js')
const mailer = require('nodemailer')
const moment = require('moment')
const path = require('path')
const rp = require('request-promise')
const util = require('gulp-util')

const env = require('./env.js')

const pkg = require(path.join(process.cwd(), 'package.json'))

gulp.task('notify', ['notify:log', 'notify:email', 'notify:nr'])

gulp.task('notify:log', () => {
  let appenders = {}

  env.getWebConfig().servers
    .map((server) => { return { name: server, path: env.getWebConfig(server).share } })
    .forEach((share) => {
      appenders[share.name] = {
        type: 'file',
        filename: path.join(share.path, 'deploy.log'),
        maxLogSize: 1048576, // bytes, i.e. 1MB
        backups: 0,
        layout: {
          type: 'pattern',
          pattern: '[%d] [%5x{target}] v%x{version} (%x{revision}) %h %x{user} ',
          tokens: {
            target: () => process.env.target.toUpperCase(),
            user: () => process.env.USERNAME,
            revision: () => process.env.revision,
            version: () => pkg.version
          }
        }
      }
    })

  let configuration = {
    appenders: appenders,
    categories: {
      default: {
        appenders: Object.keys(appenders),
        level: 'info'
      }
    }
  }

  log4js.configure(configuration)

  log4js.getLogger().info()
})

gulp.task('notify:email', () => {
  let transporter = mailer.createTransport({
    host: 'smtp.intel.com',
    port: 25
  })

  let notify = env.getEnvironmentConfig().notify

  let to = env.getConfig().contributors
    .filter((contributor) => {
      if (!contributor.role) {
        return false
      }

      if (!notify) {
        return false
      }

      return notify.map((i) => i.toLowerCase()).includes(contributor.role.toLowerCase())
    })
    .map((contributor) => `"${contributor.name}" <${contributor.email}>`)

  if (to.length === 0) {
    util.log(util.colors.yellow(`No one found in role(s) [${notify}] to send deployment notification email`))
    return
  }

  let author = env.getConfig().author
  let from = `"${author.name}" <${author.email}>`

  let mail = {
    from: from,
    to: to.join(','),
    subject: `${pkg.name} v${pkg.version} (${process.env.revision}) deployed to ${process.env.target.toUpperCase()}`,
    text: `${pkg.name} v${pkg.version} (${process.env.revision}) was deployed to ${process.env.target.toUpperCase()} on ${moment().format('YYYY-MM-DD HH:mm:ss.SSS')} by ${process.env.USERNAME} from ${process.env.COMPUTERNAME}.`,
    html: `
      <html>
        <head>
          <style>body{font-family: Helvetica, Arial, sans-serif}</style>
        </head>
        <body>
          <p>
            <b>${pkg.name} v${pkg.version}</b> (${process.env.revision}) was deployed to <b>${process.env.target.toUpperCase()}</b> on <b>${moment().format('YYYY-MM-DD HH:mm:ss.SSS')}</b> by <b>${process.env.USERNAME}</b> from ${process.env.COMPUTERNAME}.
          </p>
        </body>
      </html>
    `
  }

  return transporter.sendMail(mail)
    .then((info) => {
      util.log(`Deployment notification ${info.messageId} sent to role(s) [${notify}] and email(s) [${to.join(', ')}]  (${info.response})`)
    })
    .catch((error) => {
      return util.log(util.colors.red(error))
    })
})

gulp.task('notify:nr', () => {
  if (!env.isEnvironmentDefined()) {
    util.log(util.colors.yellow(`No environment defined to notify deployment to New Relic`))
    return
  }

  let envConfig = env.getEnvironmentConfig()

  if (!envConfig.newrelic || !envConfig.newrelic.id) {
    util.log(util.colors.yellow(`No New Relic Application Id defined to notify deployment to New Relic`))
    return
  }

  let revision = process.env.revision

  let options = {
    url: `https://api.newrelic.com/v2/applications/${envConfig.newrelic.id}/deployments.json`,
    proxy: 'http://proxy-us.intel.com:911',
    method: 'POST',
    headers: {
      'x-api-key': '882bb932dad835f2c0f4204b01eaafdcbf6a16ad7af522c'
    },
    body: {
      deployment: {
        revision: revision,
        description: `Upgrading to ${env.getConfig().version} (${revision})`,
        user: process.env.username
      }
    },
    json: true
  }

  return rp(options)
    .then((response) => {
      util.log(util.colors.green(`Notified deployment to New Relic at ${response.deployment.timestamp}`))
    })
    .catch((err) => {
      util.log(util.colors.red(`Error:`, err))
    })
})

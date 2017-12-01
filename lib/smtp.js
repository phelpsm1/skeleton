'use strict'

const juice = require('juice')
const mailer = require('nodemailer')
const pug = require('pug')
const util = require('gulp-util')

const env = require('./env.js')

function mail (message) {
  let transporter = mailer.createTransport({
    host: 'smtp.intel.com',
    port: 25
  })

  let notify = env.getEnvironmentConfig().notify

  if (!notify || notify.length === 0) {
    util.log(util.colors.yellow(`No roles specified to email`))
    return
  }

  let to = env.pkg.contributors
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

  let author = env.pkg.author
  let from = `"${author.name}" <${author.email}>`

  let mail = {
    from: from,
    replyTo: 'donotreply@intel.com',
    to: to.join(','),
    subject: message.subject
  }

  if (message.text && message.text.template) {
    mail.text = pug.compileFile(message.text.template, {})(message.text.locals)
  }

  if (message.html && message.html.template) {
    mail.html = juice(pug.compileFile(message.html.template, {})(message.html.locals))
  }

  return transporter.sendMail(mail)
    .then((info) => {
      util.log(`Notification ${info.messageId} sent to role(s) [${notify}] and email(s) [${to.join(', ')}]  (${info.response})`)
    })
    .catch((error) => {
      return util.log(util.colors.red(error))
    })
}

module.exports = {
  mail: mail
}

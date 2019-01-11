'use strict'

const colors = require('ansi-colors')
const log = require('fancy-log')
const mssql = require('mssql')

const env = require('./env')

function buildConnectionString (db) {
  let parts = []

  parts.push(`server=${buildServerString(db)}`)
  parts.push(`database=${db.database}`)

  if (db.user && db.password) {
    parts.push(`user id=${db.user}`)
    parts.push(`password=${db.password}`)
  } else {
    parts.push(`integrated security=SSPI`)
  }

  if (typeof (db.secure) !== 'undefined' && db.secure) {
    parts.push('encrypt=true')
    parts.push('trustServerCertificate=true')
  }

  return parts.join(';')
}

function buildServerString (db) {
  let server = db.server

  if (db.instance) {
    server = `${server}\\${db.instance}`
  }

  if (db.port) {
    server = `${server},${db.port}`
  }

  return server
}

function run (sql, db) {
  let connectionArgs = {
    server: db.server,
    instance: db.instance,
    port: db.port,
    driver: 'tedious',
    user: 'ccsd',
    password: process.env.password,
    database: db.database,
    requestTimeout: 0 // no timeout
  }

  if (!env.isPasswordDefined()) {
    return Promise.reject(new Error(colors.red(`Password not specified for user ${connectionArgs.user}. Pass the -p <password> argument.`)))
  }

  let server = buildServerString(db)
  let pool = new mssql.ConnectionPool(connectionArgs)

  return pool
    .connect()
    .then((pool) => {
      log.info(`Connection to ${connectionArgs.database} ${colors.green('OPENED')} on ${server}`)
      return pool
    })
    .then((pool) => {
      return pool.request().query(sql)
    })
    .then(result => {
      if (result.rowsAffected.length) {
        log.info(colors.green(`${result.rowsAffected} rows affected`))
      }

      return pool
        .close()
        .then(() => {
          log.info(`Connection to ${connectionArgs.database} ${colors.green('CLOSED')} on ${server}`)
        })
    })
    .catch(err => {
      return pool
        .close()
        .then(() => {
          log.info(`Connection to ${connectionArgs.database} ${colors.green('CLOSED')} on ${server}`)
          throw err
        })
    })
}

module.exports = {
  buildConnectionString: buildConnectionString,
  run: run
}

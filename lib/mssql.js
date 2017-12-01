'use strict'

const mssql = require('mssql')
const util = require('gulp-util')

const env = require('./env.js')

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
    return Promise.reject(new Error(util.colors.red(`Password not specified for user ${connectionArgs.user}. Pass the -p <password> argument.`)))
  }

  let server = buildServerString(db)
  let pool = new mssql.ConnectionPool(connectionArgs)

  return pool
    .connect()
    .then((pool) => {
      util.log(`Connection to ${connectionArgs.database} ${util.colors.green('OPENED')} on ${server}`)
      return pool
    })
    .then((pool) => {
      return pool.request().query(sql)
    })
    .then(result => {
      if (result.rowsAffected.length) {
        util.log(util.colors.green(`${result.rowsAffected} rows affected`))
      }

      return pool
        .close()
        .then(() => {
          util.log(`Connection to ${connectionArgs.database} ${util.colors.green('CLOSED')} on ${server}`)
        })
    })
    .catch(err => {
      return pool
        .close()
        .then(() => {
          util.log(`Connection to ${connectionArgs.database} ${util.colors.green('CLOSED')} on ${server}`)
          throw err
        })
    })
}

module.exports = {
  buildConnectionString: buildConnectionString,
  run: run
}

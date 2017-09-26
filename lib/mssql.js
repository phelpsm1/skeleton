'use strict'

const mssql = require('mssql')
const util = require('gulp-util')

const env = require('./env.js')

function buildConnectionString (db) {
  return `server=${buildServerString(db)};database=${db.database};integrated security=SSPI`
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
    requestTimeout: 25000
  }

  if (!env.isPasswordDefined()) {
    return Promise.reject(new Error(util.colors.red(`Password not specified for user ${connectionArgs.user}. Pass the -p <password> argument.`)))
  }

  let server = buildServerString(db)
  let pool = new mssql.ConnectionPool(connectionArgs)

  return pool
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

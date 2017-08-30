'use strict'

const mssql = require('mssql')
const util = require('gulp-util')

const env = require('./env.js')

function run (sql, db) {
  let connectionArgs = {
    server: db.server,
    driver: 'tedious',
    user: 'ccsd',
    password: process.env.password,
    database: db.database,
    requestTimeout: 25000
  }

  if (!env.isPasswordDefined()) {
    return Promise.reject(new Error(util.colors.red(`Password not specified for user ${connectionArgs.user}. Pass the -p <password> argument.`)))
  }

  return mssql
    .connect(connectionArgs)
    .then((pool) => {
      util.log(`Connection to ${connectionArgs.database} ${util.colors.green('OPENED')} on ${connectionArgs.server}`)
      return pool
    })
    .then((pool) => {
      return pool.request().query(sql)
    })
    .then(result => {
      if (result.rowsAffected.length) {
        util.log(util.colors.green(`${result.rowsAffected} rows affected`))
      }

      return mssql
        .close()
        .then(() => {
          util.log(`Connection to ${connectionArgs.database} ${util.colors.green('CLOSED')} on ${connectionArgs.server}`)
        })
    })
    .catch(err => {
      return mssql
        .close()
        .then(() => {
          util.log(`Connection to ${connectionArgs.database} ${util.colors.green('CLOSED')} on ${connectionArgs.server}`)
          throw err
        })
    })
}

module.exports = {
  run: run
}

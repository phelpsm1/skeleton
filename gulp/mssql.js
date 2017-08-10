'use strict'

const mssql = require('mssql')
const util = require('gulp-util')

function runQuery (sql, db) {
  let connectionArgs = {
    server: db.server,
    driver: 'tedious',
    user: 'ccsd',
    password: process.env.password,
    database: db.name,
    requestTimeout: 25000
  }

  return mssql.connect(connectionArgs)
    .then((pool) => {
      return pool.request().query(sql)
    })
    .then(result => {
      mssql.close()
      util.log(util.colors.green(`rows affected: `), result.rowsAffected)
    })
    .catch(err => {
      mssql.close()
      throw err
    })
}

module.exports = {
  run: runQuery
}

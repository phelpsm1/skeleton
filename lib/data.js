'use strict'

const mssql = require('./mssql.js')
const teradata = require('./teradata.js')

function buildConnectionString (db) {
  let type = db.type ? db.type.toLowerCase() : 'default'

  switch (type) {
    case 'teradata':
      return teradata.buildConnectionString(db)
    default:
      return mssql.buildConnectionString(db)
  }
}

module.exports = {
  buildConnectionString: buildConnectionString,
  mssql: mssql,
  teradata: teradata
}

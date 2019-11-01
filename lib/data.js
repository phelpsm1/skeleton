'use strict'

const mssql = require('./mssql')
const teradata = require('./teradata')

function buildConnectionString (db) {
  const type = db.type ? db.type.toLowerCase() : 'default'

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

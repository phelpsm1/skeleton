'use strict'

const mssql = require('./mssql')
const teradata = require('./teradata')
const mongo = require('./mongo')

function buildConnectionString (db) {
  const type = db.type ? db.type.toLowerCase() : 'default'

  switch (type) {
    case 'teradata':
      return teradata.buildConnectionString(db)
    case 'mongo':
      return mongo.buildConnectionString(db)
    default:
      return mssql.buildConnectionString(db)
  }
}

module.exports = {
  buildConnectionString: buildConnectionString,
  mssql: mssql,
  teradata: teradata,
  mongo: mongo
}

'use strict'

const colors = require('ansi-colors')

function buildConnectionString (db) {
  if (db.user === undefined) {
    throw new Error(colors.red('user value is missing'))
  }

  if (db.password === undefined) {
    throw new Error(colors.red('password value is missing'))
  }

  if (db.servers === undefined || db.servers.length < 1) {
    throw new Error(colors.red('servers value is missing/empty'))
  }

  if (db.database === undefined) {
    throw new Error(colors.red('database value is missing'))
  }

  if (db.replicaSet === undefined) {
    throw new Error(colors.red('replicaSet value is missing'))
  }

  const servers = db.servers.map((s) => `${s}:${db.port}`).join(',')
  const ssl = db.ssl !== undefined ? db.ssl : true

  return `mongodb://${db.user}:${db.password}@${servers}/${db.database}?ssl=${ssl}&replicaSet=${db.replicaSet}`
}

module.exports = {
  buildConnectionString: buildConnectionString
}

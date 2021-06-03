'use strict'

const colors = require('ansi-colors')

function buildConnectionString (db) {
  if (db.user === undefined) {
    throw new Error(colors.red('user value is missing'))
  }

  if (db.password === undefined) {
    throw new Error(colors.red('password value is missing'))
  }

  if (db.server === undefined) {
    throw new Error(colors.red('server value is missing'))
  }

  if (db.database === undefined) {
    throw new Error(colors.red('database value is missing'))
  }

  const parts = []

  parts.push('Driver={Teradata}')
  parts.push(`DBCName=${db.database}`)
  parts.push(`Server=${db.server}`)
  parts.push(`Uid=${db.user}`)
  parts.push(`Pwd=${db.password}`)

  return parts.join(';')
}

module.exports = {
  buildConnectionString: buildConnectionString
}

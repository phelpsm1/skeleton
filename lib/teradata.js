'use strict'

function buildConnectionString (db) {
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

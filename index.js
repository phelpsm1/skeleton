'use strict'

const env = require('./gulp/env.js')
const files = require('./gulp/files.js')
const mssql = require('./gulp/mssql')

module.exports = {
  Env: env,
  Files: files,
  Mssql: mssql
}

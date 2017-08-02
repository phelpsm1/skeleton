'use strict'

const glob = require('glob')
const gulp = require('gulp')
const moment = require('moment')
const mssql = require('mssql')
const path = require('path')
const util = require('gulp-util')

const env = require('./env.js')

const config = require('../config.json')

gulp.task('db:backup', () => {
  const help = ', e.g. gulp db:backup -e dev -p <password>'

  if (!env.isEnvironmentDefined()) {
    util.log(util.colors.red('Environment not specified', help))
    return
  }

  if (!env.isPasswordDefined()) {
    util.log(util.colors.red('Password not specified', help))
    return
  }

  let db = config[process.env.targets.split(' ')[0]].db
  let filename = path.join(db.backupPath, `${db.name}_backup_${moment().format('YYYY_MM_DD_HH_mm_ss')}.bak`)

  util.log(util.colors.green(`Backing up ${db.name} to ${filename} ...`))

  let sql = ''

  sql += `BACKUP DATABASE [${db.name}] TO DISK = N'${filename}' `
  sql += `WITH NOFORMAT, NOINIT, NAME = N'Full Database Backup', `
  sql += `SKIP, NOREWIND, NOUNLOAD, COMPRESSION, STATS = 10`

  return runQuery(sql, db)
    .catch(err => {
      util.log(util.colors.red(`Error backing up the database: ${sql}`))
      util.log(err)
    })
})

gulp.task('db:restore', () => {
  const help = ', e.g. gulp db:restore -e dev -p <password>'

  if (!env.isEnvironmentDefined()) {
    util.log(util.colors.red('Environment not specified', help))
    return
  }

  if (env.isProduction()) {
    util.log(util.colors.red('Cannot restore to production'))
    return
  }

  if (!env.isPasswordDefined()) {
    util.log(util.colors.red('Password not specified', help))
    return
  }

  let db = config[process.env.targets.split(' ')[0]].db

  let filename = path.join(db.backupPath, glob.sync('*.bak', {cwd: db.backupPath}).sort().reverse()[0])

  util.log(`Restoring database [${db.name}] from file [${filename}]...`)

  let sql = ''

  sql += `USE [master];`
  sql += `IF NOT EXISTS(SELECT * FROM sysdatabases WHERE Name = '${db.name}') CREATE DATABASE ${db.name};`
  sql += `ALTER DATABASE ${db.name} SET SINGLE_USER WITH ROLLBACK IMMEDIATE;`
  sql += `RESTORE DATABASE ${db.name} FROM DISK = '${filename}' WITH REPLACE;`
  sql += `ALTER DATABASE ${db.name} SET MULTI_USER;`

  return runQuery(sql, db)
    .catch(err => {
      util.log(util.colors.red(`Error restoring the database: ${sql}`))
      util.log(err)
    })
})

gulp.task('db:migrate', () => {
  const help = ', e.g. gulp db:migrate -e dev -p <password>'

  if (!env.isEnvironmentDefined()) {
    util.log(util.colors.red('Environment not specified', help))
    return
  }

  if (!env.isPasswordDefined()) {
    util.log(util.colors.red('Password not specified', help))
    return
  }

  let db = config[process.env.targets.split(' ')[0]].db

  let sql = ''

  return runQuery(sql, db)
    .catch(err => {
      util.log(util.colors.red(`Error migrating the database: ${sql}`))
      util.log(err)
    })
})

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

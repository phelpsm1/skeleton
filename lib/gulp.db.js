'use strict'

const glob = require('glob')
const gulp = require('gulp')
const moment = require('moment')
const path = require('path')
const util = require('gulp-util')

const env = require('./env.js')
const mssql = require('./mssql.js')

function getDb () {
  if (process.env.database) {
    return env.getEnvironmentConfig().dbs.find((db) => { return db.name === process.env.database })
  }

  return env.getEnvironmentConfig().dbs[0]
}

gulp.task('db:backup', () => {
  const help = ', e.g. gulp db:backup -db <name> -e dev -p <password>'

  if (!env.isEnvironmentDefined()) {
    util.log(util.colors.red('Environment not specified', help))
    return
  }

  if (!env.isProduction()) {
    util.log(util.colors.red('Cannot backup non-production database'))
    return
  }

  if (!env.isPasswordDefined()) {
    util.log(util.colors.red('Password not specified', help))
    return
  }

  if (env.getEnvironmentConfig().dbs.length !== 1 && !process.env.database) {
    util.log(util.colors.red('Cannot determine which database to backup', help))
    return
  }

  let db = getDb()

  let filename = path.join(db.backupPath, `${db.database}_backup_${moment().format('YYYY_MM_DD_HH_mm_ss')}.bak`)

  util.log(util.colors.green(`Backing up ${db.database} to ${filename} ...`))

  let sql = ''

  sql += `BACKUP DATABASE [${db.database}] TO DISK = N'${filename}' `
  sql += `WITH NOFORMAT, NOINIT, NAME = N'Full Database Backup', `
  sql += `SKIP, NOREWIND, NOUNLOAD, COMPRESSION, STATS = 10`

  return mssql.run(sql, db)
    .catch(err => {
      util.log(util.colors.red(`Error backing up the database: ${sql}`))
      util.log(err)
    })
})

gulp.task('db:restore', () => {
  const help = ', e.g. gulp db:restore -db <name> -e dev -p <password>'

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

  if (env.getEnvironmentConfig().dbs.length !== 1 && !process.env.database) {
    util.log(util.colors.red('Cannot determine which database to backup', help))
    return
  }

  let db = getDb()

  let filename = path.join(db.backupPath, glob.sync('*.bak', {cwd: db.backupPath}).sort().reverse()[0])

  util.log(`Restoring database [${db.database}] from file [${filename}]...`)

  let sql = ''

  sql += `USE [master];`
  sql += `IF NOT EXISTS(SELECT * FROM sysdatabases WHERE Name = '${db.database}') CREATE DATABASE ${db.database};`
  sql += `ALTER DATABASE ${db.database} SET SINGLE_USER WITH ROLLBACK IMMEDIATE;`
  sql += `RESTORE DATABASE ${db.database} FROM DISK = '${filename}' WITH REPLACE;`
  sql += `ALTER DATABASE ${db.database} SET MULTI_USER;`

  return mssql.run(sql, db)
    .catch(err => {
      util.log(util.colors.red(`Error restoring the database: ${sql}`))
      util.log(err)
    })
})

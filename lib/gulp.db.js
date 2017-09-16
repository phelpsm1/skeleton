'use strict'

const glob = require('glob')
const gulp = require('gulp')
const moment = require('moment')
const path = require('path')
const util = require('gulp-util')

const env = require('./env.js')
const mssql = require('./mssql.js')

gulp.task('db:backup', () => {
  const help = ', e.g. gulp db:backup -db <name> -e dev -p <password>'

  if (!env.isEnvironmentDefined()) {
    util.log(util.colors.red('Environment not specified', help))
    return
  }

  if (env.getEnvironmentConfig().dbs.length === 0 && !process.env.database) {
    util.log(util.colors.red('Cannot determine which database to backup', help))
    return
  }

  let backups = []

  env.getDbsConfig().forEach((db) => {
    if (typeof (db.backup) !== 'undefined' && !db.backup) {
      return
    }

    let filename = path.join(db.backupShare, db.database, `${db.database}_backup_${moment().format('YYYY_MM_DD_HH_mm_ss')}.bak`)

    util.log(util.colors.green(`Backing up ${db.database} to ${filename} ...`))

    let sql = ''

    sql += `BACKUP DATABASE [${db.database}] TO DISK = N'${filename}' `
    sql += `WITH NOFORMAT, NOINIT, NAME = N'Full Database Backup', `
    sql += `SKIP, NOREWIND, NOUNLOAD, COMPRESSION, STATS = 10`

    backups.push(
      mssql
        .run(sql, db)
        .catch(err => {
          util.log(util.colors.red(`Error backing up the database`))
          util.log(err)
        })
    )
  })

  return Promise.all(backups)
})

gulp.task('db:restore', () => {
  const help = ', e.g. gulp db:restore -db <name> -e dev -p <password>'

  if (!env.isEnvironmentDefined()) {
    util.log(util.colors.red('Environment not specified', help))
    return
  }

  if (env.isProduction() && !process.env.force) {
    util.log(util.colors.red('Cannot restore to production'))
    return
  }

  if (env.getEnvironmentConfig().dbs.length === 0 && !process.env.database) {
    util.log(util.colors.red('Cannot determine which database to restore', help))
    return
  }

  let restoreTo = env.getDbsConfig()
  let restoreFrom = env.getDbsConfig(process.env.database, 'prod')

  let filename = path.join(restoreFrom.backupShare, restoreFrom.database, glob.sync('*.bak', {cwd: path.join(restoreFrom.backupShare, restoreFrom.database)}).sort().reverse()[0])

  util.log(`Restoring database ${restoreTo.database} in ${process.env.target} from file ${filename}...`)

  let sql = ''

  sql += `USE [master]; `
  sql += `IF NOT EXISTS(SELECT * FROM sysdatabases WHERE Name = '${restoreTo.database}') CREATE DATABASE ${restoreTo.database}; `
  sql += `ALTER DATABASE ${restoreTo.database} SET SINGLE_USER WITH ROLLBACK IMMEDIATE; `
  sql += `RESTORE DATABASE ${restoreTo.database} FROM DISK = '${filename}' WITH REPLACE; `
  sql += `ALTER DATABASE ${restoreTo.database} SET RECOVERY SIMPLE; `
  sql += `ALTER DATABASE ${restoreTo.database} SET MULTI_USER;`

  // change to connection to master database, needed if restoreTo.database is not created already
  let master = {
    server: restoreTo.server,
    instance: restoreTo.instance,
    port: restoreTo.port,
    database: 'master'
  }

  return mssql
    .run(sql, master)
    .then(() => {
      util.log(util.colors.green('Restore successful!'))
    })
    .catch(err => {
      util.log(util.colors.red(`Error restoring the database`))
      util.log(err)
    })
})

'use strict'

const fs = require('fs-extra')
const glob = require('glob')
const gulp = require('gulp')
const moment = require('moment')
const path = require('path')
const util = require('gulp-util')

const env = require('./env.js')
const mssql = require('./data.js').mssql

gulp.task('sql:backup', () => {
  const help = ', e.g. gulp sql:backup -db <name> -e dev -p <password>'

  if (!env.isEnvironmentDefined()) {
    util.log(util.colors.red('Environment not specified', help))
    return
  }

  let backups = []

  env.getDbsToBackup().forEach((db) => {
    let filename = path.join(db.backupShare, db.database, `${db.database}_backup_${moment().format('YYYY_MM_DD_HH_mm_ss')}.bak`)

    util.log(`Backing up ${db.name} (${db.database}) to ${filename} ...`)

    let sql = ''

    sql += `BACKUP DATABASE [${db.database}] TO DISK = N'${filename}' `
    sql += `WITH NOFORMAT, NOINIT, NAME = N'Full Database Backup', `
    sql += `SKIP, NOREWIND, NOUNLOAD, COMPRESSION, STATS = 10`

    backups.push(
      mssql
        .run(sql, db)
        .then(() => {
          util.log(util.colors.green(`Backup of ${db.name} (${db.database}) successful!`))
        })
        .catch(err => {
          util.log(util.colors.red(`ERROR: Failed to backup database: ${db.name} (${db.database})`))
          util.log(err)
        })
    )
  })

  if (backups.length === 0) {
    util.log(util.colors.yellow(`No databases backed up`))

    if (process.env.database) {
      util.log(util.colors.red(`Did not find a database configuration for: ${process.env.database}`))
    }
  }

  return Promise.all(backups)
})

gulp.task('sql:restore', () => {
  const help = ', e.g. gulp sql:restore -d <name> -e dev -p <password>'

  if (!env.isEnvironmentDefined()) {
    util.log(util.colors.red('Environment not specified', help))
    return
  }

  if (env.is('prod') && !process.env.force) {
    util.log(util.colors.red('Cannot restore to production (must use --force)'))
    return
  }

  let restores = []

  env.getDbsToRestore().forEach((db) => {
    let restoreTo = db
    let restoreFrom = env.getDbsConfig(db.name, 'prod')

    // find the most recent SQL backup file
    let file = glob.sync('*.bak', {cwd: path.join(restoreFrom.backupShare, restoreFrom.database)}).sort().reverse()[0]

    function getFileInfo (dir, file) {
      return {
        file: file,
        dir: dir,
        path: path.join(dir, file)
      }
    }

    let src = getFileInfo(path.join(restoreFrom.backupShare, restoreFrom.database), file)
    let tmp = getFileInfo(path.join('c:', 'temp'), file)

    let filename = env.is('local') ? tmp.path : src.path

    util.log(`Restoring database ${restoreTo.name} (${restoreTo.database}) in ${process.env.target} from file ${filename}...`)

    let sql = ''

    sql += `USE [master]; `
    sql += `IF NOT EXISTS(SELECT * FROM sysdatabases WHERE Name = '${restoreTo.database}') CREATE DATABASE ${restoreTo.database}; `
    sql += `ALTER DATABASE ${restoreTo.database} SET SINGLE_USER WITH ROLLBACK IMMEDIATE; `
    sql += `RESTORE DATABASE ${restoreTo.database} FROM DISK = '${filename}' WITH REPLACE; `
    if (!env.is('prod')) {
      sql += `ALTER DATABASE ${restoreTo.database} SET RECOVERY SIMPLE; `
    }
    sql += `ALTER DATABASE ${restoreTo.database} SET MULTI_USER;`

    // change connection to master database, needed if restoreTo.database is not created already
    let master = {
      server: restoreTo.server,
      instance: restoreTo.instance,
      port: restoreTo.port,
      database: 'master'
    }

    let restore = () => mssql
      .run(sql, master)
      .then(() => {
        util.log(util.colors.green(`Restore of ${db.name} (${db.database}) successful!`))
      })
      .catch(err => {
        util.log(util.colors.red(`ERROR: Failed to restore database: ${db.name} (${db.database})`))
        util.log(err)
      })

    if (env.is('local') && !fs.existsSync(tmp.path)) {
      restores.push(
        fs.copy(src.path, filename)
          .then(() => {
            util.log(`Copied ${src.path} to ${filename}`)
            return restore()
          })
          .catch(err => {
            util.log(util.colors.red(`ERROR: Failed to copy ${src.path} to ${filename}`))
            util.log(err)
          })
      )
    } else {
      restores.push(restore())
    }
  })

  if (restores.length === 0) {
    util.log(util.colors.yellow(`No databases restored`))

    if (process.env.database) {
      util.log(util.colors.red(`Did not find a database configuration for: ${process.env.database}`))
    }
  }

  return Promise.all(restores)
})

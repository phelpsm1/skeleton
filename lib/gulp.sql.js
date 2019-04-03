'use strict'

const gulp = require('gulp')

const colors = require('ansi-colors')
const fs = require('fs-extra')
const glob = require('glob')
const log = require('fancy-log')
const moment = require('moment')
const path = require('path')

const env = require('./env')
const mssql = require('./data').mssql

const backup = () => {
  let backups = []

  env.getDbsToBackup().forEach((db) => {
    let filename = path.join(db.backupShare, db.database, `${db.database}_backup_${moment().format('YYYY_MM_DD_HH_mm_ss')}.bak`)

    log.info(`Backing up ${db.name} (${db.database}) to ${filename} ...`)

    let sql = ''

    sql += `BACKUP DATABASE [${db.database}] TO DISK = N'${filename}' `
    sql += `WITH NOFORMAT, NOINIT, NAME = N'Full Database Backup', `
    sql += `SKIP, NOREWIND, NOUNLOAD, COMPRESSION, STATS = 10`

    backups.push(
      mssql
        .run(sql, db)
        .then(() => {
          log.info(colors.green(`Backup of ${db.name} (${db.database}) successful!`))
        })
        .catch(err => {
          log.error(colors.red(`ERROR: Failed to backup database: ${db.name} (${db.database})`))
          log.error(err)
        })
    )
  })

  if (backups.length === 0) {
    log.warn(colors.yellow(`No databases backed up`))

    if (process.env.database) {
      log.error(colors.red(`Did not find a database configuration for: ${process.env.database}`))
    }
  }

  return Promise.all(backups)
}

backup.displayName = 'sql:backup'
backup.description = 'Backup application database(s)'
gulp.task(backup)

const restore = () => {
  const help = 'e.g. gulp sql:restore -d <name> -e prod -p <password> --force'

  if (env.is('prod') && !process.env.force) {
    log.error(colors.red(`Cannot restore to production (must use --force) ${help}`))
    return
  }

  let restores = []

  env.getDbsToRestore().forEach((db) => {
    let restoreTo = db
    let restoreFrom = env.getDbsConfig(db.name, 'prod')

    // find the most recent SQL backup file
    let file = glob.sync('*.bak', { cwd: path.join(restoreFrom.backupShare, restoreFrom.database) }).sort().reverse()[0]

    function getFileInfo (dir, file) {
      return {
        file: file,
        dir: dir,
        path: path.join(dir, file)
      }
    }

    let src = getFileInfo(path.join(restoreFrom.backupShare, restoreFrom.database), file)
    let local = getFileInfo(path.join('c:', 'temp', restoreFrom.database), file)

    let filename = env.is('local') ? local.path : src.path

    log.info(`Restoring database ${restoreTo.name} (${restoreTo.database}) in ${process.env.target} from file ${filename}...`)

    let sql = ''

    sql += `USE [master]; `
    sql += `IF NOT EXISTS(SELECT * FROM sysdatabases WHERE Name = '${restoreTo.database}') CREATE DATABASE ${restoreTo.database}; `
    sql += `ALTER DATABASE ${restoreTo.database} SET SINGLE_USER WITH ROLLBACK IMMEDIATE; `
    sql += `RESTORE DATABASE ${restoreTo.database} FROM DISK = '${filename}' WITH REPLACE; `
    if (!env.is('prod')) {
      sql += `ALTER DATABASE ${restoreTo.database} SET RECOVERY SIMPLE WITH NO_WAIT; `
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
        log.info(colors.green(`Restore of ${db.name} (${db.database}) successful!`))
      })
      .catch(err => {
        log.error(colors.red(`ERROR: Failed to restore database: ${db.name} (${db.database})`))
        log.error(err)
      })

    if (env.is('local') && !fs.existsSync(local.path)) {
      restores.push(
        fs.copy(src.path, filename)
          .then(() => {
            log.info(`Copied ${src.path} to ${filename}`)
            return restore()
          })
          .catch(err => {
            log.error(colors.red(`ERROR: Failed to copy ${src.path} to ${filename}`))
            log.error(err)
          })
      )
    } else {
      restores.push(restore())
    }
  })

  if (restores.length === 0) {
    log.warn(colors.yellow(`No databases restored`))

    if (process.env.database) {
      log.error(colors.red(`Did not find a database configuration for: ${process.env.database}`))
    }
  }

  return Promise.all(restores)
}

restore.displayName = 'sql:restore'
restore.description = 'Restore application database(s)'
gulp.task(restore)

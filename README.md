# Welcome to the Skeleton

This is the skeleton to build, test, and deploy a project within TMG SP S

## Usage

```javascript
const env = require('skeleton').Env
const files = require('skeleton').Files
const mssql = require('skeleton').Mssql
```

## Documentation

### Env

#### Env.parse

#### Env.getEnvironmentConfig

### Files

#### Files.transform

#### Files.updateWebConfig

#### Files.log

### Mssql

#### Mssql.run

Mssql exposes one method to execute sql statements, Mssql.run(). 

```javascript
gulp.task('sql:migrate', () => {
  const help = ', e.g. gulp db:migrate -e dev -p <password>'

  if (!env.isEnvironmentDefined()) {
    util.log(util.colors.red('Environment not specified', help))
    return
  }

  if (!env.isPasswordDefined()) {
    util.log(util.colors.red('Password not specified', help))
    return
  }

  let db = env.getEnvironmentConfig().dbs.find((db) => { return db.name === 'data' })

  let sql = ''

  return mssql.run(sql, db)
    .catch(err => {
      util.log(util.colors.red(`Error migrating the database: ${sql}`))
      util.log(err)
    })
})
```

#### Mssql.run
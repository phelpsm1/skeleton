# Welcome to the Skeleton

This is the skeleton to build, test, and deploy a project within TMG SP S

## Usage

```javascript
const env = require('skeleton').Env
const files = require('skeleton').Files
const mssql = require('skeleton').Mssql
```

## Documentation

### Configuration

### Application Tasks

#### app:offline

This task copies the app_offline.htm (located in the root directory of the project) to each web server

__Usage:__  gulp app:offline -e dev

__Options:__

<table>
  <tr>
    <td>-e name</td>
    <td>set the environment to use</td>
  </tr>
</table>

#### app:online

This task deletes the app_offline.htm on each web server

__Usage:__  gulp app:online -e dev

__Options:__

<table>
  <tr>
    <td>-e name</td>
    <td>set the environment to use</td>
  </tr>
</table>

#### app:down

This task stops the application pool and website on each server

__Usage:__  gulp app:down -e dev

__Options:__

<table>
  <tr>
    <td>-e name</td>
    <td>set the environment to use</td>
  </tr>
</table>

__Notes:__

See [Providing credentials](#providing-credentials)

#### app:up

This task starts the application pool and website on each server

__Usage:__  gulp app:up -e dev

__Options:__

<table>
  <tr>
    <td>-e name</td>
    <td>set the environment to use</td>
  </tr>
</table>

__Notes:__

See [Providing credentials](#providing-credentials)

#### app:recycle

This task recycles the application pool on each server

__Usage:__  gulp app:recycle -e dev

__Options:__

<table>
  <tr>
    <td>-e name</td>
    <td>set the environment to use</td>
  </tr>
</table>

__Notes:__

See [Providing credentials](#providing-credentials)

#### app:status

This task gets the status of the application pool and website of each server 

__Usage:__  gulp app:status -e dev

__Options:__

<table>
  <tr>
    <td>-e name</td>
    <td>set the environment to use</td>
  </tr>
</table>

__Notes:__

See [Providing credentials](#providing-credentials)

#### app:link

This task links the current and log NTFS junctions to the appropriate directory in the file structure:

    D:\WebSites 
        \<pillar>
            \<app>
                \<env>
                    \current <-- NTFS junction to releases\<latest>
                    \releases
                        \<svn revision | git short sha1 hash>
                            \log <-- NTFS junction to shared\log
                    \shared
                        \log
            

__Usage:__  gulp app:recycle -e dev

__Options:__

<table>
  <tr>
    <td>-e name</td>
    <td>set the environment to use</td>
  </tr>
</table>

__Notes:__

See [Providing credentials](#providing-credentials)

#### app:rollback

This task moves the current NTFS junction to the n-1 release.

__This task is usually called from another gulp task and not by itself.__

__Usage:__  gulp app:rollback

__Options:__

<table>
  <tr>
    <td>-e name</td>
    <td>set the environment to use</td>
  </tr>
</table>

__Notes:__

See [Providing credentials](#providing-credentials)

#### Providing credentials

Each command requiring credentials, will prompt for you mfg_idsid account.  However, you can bypass this by creating a credential.xml file in the root of your project directory.  Once created, all tasks requiring credentials will use the credentials supplied in the file.  To create your file, execute the following command

    Get-Credential | Export-Clixml "credentials.xml"
    
at a PowerShell command prompt.

### Build Tasks

#### build

This task builds the Release configuration of the project.

__Usage:__  gulp build

__Notes:__

See [Build Configuration](#getBuildConfig)

##### build:compile

This task is called by the [build](#build) task to perform a build.

__Usage:__ gulp build:compile

###### build:clean

This task is called by the [build:compile](#build:compile) task to clean the project before building.  It calls the MSBuild clean target.

__Usage:__ gulp build:clean

###### build:assemblyinfo

This task is called by the [build:compile](#build:compile) task to set various attributes of the AsseblyInfo.cs files in the project.  The attributes are:
* AssemblyConfiguration
* AssbemlyCompany
* AssemblyProduct
* AssemblyCopyright
* AssemblyVersion
* AssemblyFileVersion

__Usage:__ gulp build:assemblyinfo

__Notes:__

This task is not meant to be run independently

#### Test Tasks

##### test

This task orchestrates the configuration and execution the unit tests of the project.

__Usage:__  gulp test

##### test:config

This task configures the app.config file for execution of the unit tests.

__Usage:__  gulp test:config

__Notes:__

See [Test Configuration](#getTestConfig)

This task is not meant to be run independently. See [test](#test) task

##### test:unit

This task executes the unit tests of the project using the [NUnit Console](https://github.com/nunit/docs/wiki/Console-Runner) found in the packages folder.  It looks for all DLLs with the name pattern of Intel.*.Tests.dll in the project.

__Usage:__ gulp test:unit

__Notes:__

This task is not meant to be run independently

### Env

#### getBuildConfig

#### getTestConfig

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
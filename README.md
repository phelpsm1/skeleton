# Welcome to the Skeleton

This is the skeleton to build, test, and deploy a project within TMG SP S

## Usage

    gulp <task> [options]

### Options

<table>
  <tr>
    <td>-e name</td>
    <td>set the environment to use</td>
  </tr>
  <tr>
    <td>-p password</td>
    <td>password for the SQL Server account ccsd</td>
  </tr>
  <tr>
    <td>-d name</td>
    <td>name of the database to work with</td>
  </tr>
  <tr>
    <td>-r revision</td>
    <td>source revision of the build, e.g. svn revision, git commit short sha, etc</td>
  </tr>
  <tr>
    <td>-l label</td>
    <td>label that is used in the Continuious Integration environment</td>
  </tr>
  <tr>
    <td>--force</td>
    <td>allows you to restore database in production</td>
  </tr>
</table>



```javascript
const env = require('skeleton').Env
const files = require('skeleton').Files
const mssql = require('skeleton').Mssql
```

## Documentation

### Environment Variables

Several environment variables are set and available for use

<table>
  <tr>
    <td>process.env.target</td>
    <td>the environment to use</td>
    <td>dev|int|prod|...</td>
  </tr>
  <tr>
    <td>process.env.password</td>
    <td>the password for the SQL Server account ccsd</td>
    <td></td>
  </tr>
  <tr>
    <td>process.env.database</td>
    <td>the name of the database to work with</td>
    <td></td>
  </tr>
  <tr>
    <td>process.env.revision</td>
    <td>the source revision of the build</td>
    <td>31254|ce518b3</td>
  </tr>
  <tr>
    <td>process.env.source</td>
    <td>the source of the build</td>
    <td>ci|local</td>
  </tr>
  <tr>
    <td>process.env.label</td>
    <td>the Continuous Integration label of the build</td>
    <td>31254|32564.2</td>
  </tr>
  <tr>
    <td>process.env.force</td>
    <td>allows you to restore database in production</td>
    <td>true|false</td>
  </tr>
</table>

### Configuration

Configuration is stored in the [package.json](https://docs.npmjs.com/files/package.json) file that is in the root of the project.

#### name

The short name or initialism for the project.

    "name": "EMS"

For more information, see the [name section](https://docs.npmjs.com/files/package.json#name) in the package.json documentation

#### version

The version number of the release.  It should follow a [semver](https://semver.org) format.

    "version": "6.2.1"

For more information, see the [version section](https://docs.npmjs.com/files/package.json#version) in the package.json documentation

#### author

The author of the project.  It is recommended to use the department name and email address

    "author": {
      "name": "TMG SP Solutions",
      "email": "tmgsp.solutions@intel.com"
    } 

For more information, see the [people fields section](https://docs.npmjs.com/files/package.json#people-fields-author-contributors) in the package.json documentation

#### contributors

An array of team members that include developers, systems analysts, and integrators.

      "contributors": [
        {
          "name": "Jason S Morris",
          "email": "jason.morris@intel.com",
          "url": "https://soco.intel.com/people/jmorris2",
          "role": "Developer"
        },
        {
          "name": "Gary Reny",
          "email": "gary.reny@intel.com",
          "url": "https://soco.intel.com/people/greny",
          "role": "Systems Analyst"
        },
        {
          "name": "Brett Willis",
          "email": "brett.willis@intel.com",
          "url": "https://soco.intel.com/people/bwillis",
          "role": "Integrator"
        }
      ]

The url attribute is linked to the [Inside Blue](https://soco.intel.com) profile and the role attribute can be anything, e.g. Developer, Systems Analyst, Integrator, Tester, etc

For more information, see the [people fields section](https://docs.npmjs.com/files/package.json#people-fields-author-contributors) in the package.json documentation

#### pillar

The name of the pillar within TMG SP S, e.g. capactiy, capital, cost

    "pillar": "capital"

This is a custom attribute added the the package.json file.

#### appSettings

Defines all the different environments that the application can be deployed to.  It specifies different sections based on the needs of the environment.  Here is an example of one envrionment defined

    "appSettings": {
      "dev": {
        "dbs": [  
          {
            "name": "EmsConnectionString",
            "server": "CCE1PDB120I02",
            "instance": "SQL02",
            "port": 1433,
            "database": "EmsDev",
            "backupShare": "//CCE1PDB120FS/backups$"
          }
        ],
        "web": {
          "apppool": "EmsDev",
          "site": "EmsDev",
          "servers": [
            "CCE1PWB120N1",
            "CCE1PWB120N2"
          ]
        },
        "config": {
          "appSettings": {
            "ApplicationTitle": "EMS (dev)",
            "EmsUrl": "http://ems-dev.intel.com",
            "NewRelic.AppName": "EMS (dev)",
            "SendEmails": false
          },
          "log4net": {
            "appenders": [
              {
                "name": "DatabaseLogAppender",
                "connectionstring": "EmsConnectionString"
              },
              {
                "name": "NHibernateAppender",
                "file": "..\\log\\NHibernate.log"
              }
            ],
            "root": {
              "level": "ALL"
            }
          },
          "system.web": {
            "compilation": {
              "debug": false
            }
          }
        },
        "newrelic": {
          "id": 9999999
        },
        "notify": [
          "Developer"
        ]
      }
    }

This is a custom attribute added the the package.json file.

### Application Tasks

#### app:offline

This task copies the app_offline.htm (located in the root directory of the project) to each web server

__Usage:__  gulp app:offline -e dev

__Options:__

<table>
  <tr>
    <td>-e name</td>
    <td>set the environment to use</td>
    <td>REQUIRED</td>
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
    <td>REQUIRED</td>
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
    <td>REQUIRED</td>
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
    <td>REQUIRED</td>
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
    <td>REQUIRED</td>
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
    <td>REQUIRED</td>
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
    <td>REQUIRED</td>
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
    <td>REQUIRED</td>
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

### Test Tasks

#### test

This task orchestrates the configuration and execution the unit tests of the project.

__Usage:__  gulp test

#### test:config

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

### SQL Tasks

#### sql:backup

This task backups up the database(s) in the specified environment

__Usage:__  gulp sql:backup -e <env> -p <password> \[-db \<name\>\]

__Options:__

<table>
  <tr>
    <td>-e name</td>
    <td>set the environment to use</td>
    <td>REQUIRED</td>
  </tr>
  <tr>
    <td>-p password</td>
    <td>set the password to use with the ccsd SQL account</td>
    <td>REQUIRED</td>
  </tr>
  <tr>
    <td>-db name</td>
    <td>set the name of the database to backup</td>
    <td>OPTIONAL</td>
    <td>If not specified, all databases will be restored
  </tr>
</table>

__Notes:__

See [Configuration](#Configuration)

#### sql:restore

This task restores the database(s) in the specified environment

__Usage:__  gulp sql:restore -e <env> -p <password> \[-db \<name\>\]

__Options:__

<table>
  <tr>
    <td>-e name</td>
    <td>set the environment to use</td>
    <td>REQUIRED</td>
  </tr>
  <tr>
    <td>-p password</td>
    <td>set the password to use with the ccsd SQL account</td>
    <td>REQUIRED</td>
  </tr>
  <tr>
    <td>-db name</td>
    <td>set the name of the database to backup</td>
    <td>OPTIONAL</td>
    <td>If not specified, all databases will be restored
  </tr>
</table>

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
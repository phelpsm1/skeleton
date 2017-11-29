# Welcome to the Skeleton

This is the skeleton to build, test, and deploy a project within TMG SP S

## Usage

    gulp <task> [options]

### Options

argument    | description
------------|---------------------------------------------------------------------------
-e name     | set the environment to use
-p password | password for the SQL Server account ccsd
-d name     | name of the database to work with
-r revision | source revision of the build, e.g. svn revision, git commit short sha, etc
-l label    | label that is used in the Continuious Integration environment
--force     | allows you to restore database in production

```javascript
const env = require('skeleton').Env
const files = require('skeleton').Files
const mssql = require('skeleton').Mssql
```

## Documentation

### Environment Variables

Several environment variables, access through the process.env object, are set and available for use

variable             | description                                   | values
---------------------|-----------------------------------------------|----------------
process.env.target   | the environment to use                        | dev, int, prod
process.env.password | the password for the SQL Server account ccsd  | 
process.env.database | the name of the database to work with         |
process.env.revision | the source revision of the build              | 31254, ce518b3
process.env.source   | the source of the build                       | ci, local
process.env.label    | the Continuous Integration label of the build | 31254, 32564.2
process.env.force    | allows you to restore database in production  | true, false

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

### File Structure

#### Web Server

    D:\WebSites 
        \<pillar>
            \<app>
                \deploy.log
                \<env>
                    \current <-- NTFS junction to releases\<latest>
                    \releases
                        \<svn revision | git short sha1 hash>
                            \log <-- NTFS junction to shared\log
                    \shared
                        \log


### Application Tasks

#### app:offline

This task copies the app_offline.htm (located in the root directory of the project) to each web server

__Usage:__  gulp app:offline -e dev

__Options:__

argument | description                | required
---------|----------------------------|----------------
-e name  | set the environment to use | YES

#### app:online

This task deletes the app_offline.htm on each web server

__Usage:__  gulp app:online -e dev

__Options:__

argument | description                | required
---------|----------------------------|----------------
-e name  | set the environment to use | YES

#### app:down

This task stops the application pool and website on each server

__Usage:__  gulp app:down -e dev

__Options:__

argument | description                | required
---------|----------------------------|----------------
-e name  | set the environment to use | YES

__Notes:__

See [Providing credentials](#providing-credentials)

#### app:up

This task starts the application pool and website on each server

__Usage:__  gulp app:up -e dev

__Options:__

argument | description                | required
---------|----------------------------|----------------
-e name  | set the environment to use | YES

__Notes:__

See [Providing credentials](#providing-credentials)

#### app:recycle

This task recycles the application pool on each server

__Usage:__  gulp app:recycle -e dev

__Options:__

argument | description                | required
---------|----------------------------|----------------
-e name  | set the environment to use | YES

__Notes:__

See [Providing credentials](#providing-credentials)

#### app:status

This task gets the status of the application pool and website of each server 

__Usage:__  gulp app:status -e dev

__Options:__

argument | description                | required
---------|----------------------------|----------------
-e name  | set the environment to use | YES

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

argument | description                | required
---------|----------------------------|----------------
-e name  | set the environment to use | YES

__Notes:__

See [Providing credentials](#providing-credentials)

#### app:rollback

This task moves the current NTFS junction to the n-1 release or revision specified.

__Usage:__  gulp app:rollback

__Options:__

argument    | description                | required
------------|----------------------------|----------------
-e name     | set the environment to use | YES
-r revision | revision to rollback to    | NO

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

__Usage:__  gulp sql:backup -e env -p password \[-db name\]

__Options:__

argument    | description                                       | required | notes
------------|---------------------------------------------------|----------|--------------------------------------------------
-e name     | set the environment to use                        | YES      |
-p password | set the password to use with the ccsd SQL account | YES      |
-db name    | set the name of the database to backup            | NO       | If not specified, all databases will be restored

__Notes:__

See [Configuration](#configuration)

#### sql:restore

This task restores the database(s) in the specified environment

__Usage:__  gulp sql:restore -e env -p password \[-db name --force\]

__Options:__

argument    | description                                       | required | notes
------------|---------------------------------------------------|----------|--------------------------------------------------
-e name     | set the environment to use                        | YES      |
-p password | set the password to use with the ccsd SQL account | YES      |
-db name    | set the name of the database to backup            | NO       | If not specified, all databases will be restored
--force     | allows you to restore database in production      | YES      | required if restoring production

__Notes:__

See [Configuration](#configuration)

### Clean Tasks

#### clean:releases

This task cleans up the previous releases by keeping that last five only in the releases directory.

__Usage:__  gulp clean:releases -e env

__Options:__

argument    | description                                       | required | notes
------------|---------------------------------------------------|----------|--------------------------------------------------
-e name     | set the environment to use                        | YES      |

__Notes:__

See [Web Server File Structure](#web-server)

#### clean:logs

This task cleans up the logs by removing any logs that are older than 30 days in the shared/log directory.

__Usage:__  gulp clean:logs -e env

__Options:__

argument    | description                                       | required | notes
------------|---------------------------------------------------|----------|--------------------------------------------------
-e name     | set the environment to use                        | YES      |

__Notes:__

See [Web Server File Structure](#web-server)

### Deploy Tasks

#### deploy:notify

This task orchestrates the various channels of notification when deploying.

__Usage:__  gulp deploy:notify

#### deploy:notify:log

This task adds an entry into the deploy.log file on each server that app is deployed to

__Usage:__  gulp deploy:notify:log

__Notes:__

See [Web Server File Structure](#web-server) for location of the deploy.log file
See [Deploy Log Format](#deploy-log-format) for deploy.log file format

#### deploy:notify:email

This task sends an email to all [contributors](#contributors) in the role(s) defined in the environment's [appSetting](#appsettings) value appSettings.\<env\>.notify

__Usage:__  gulp deploy:notify:email

#### deploy:notify:nr

This tasks does an HTTP POST to the New Relic endpoint that records deployments if New Relic is defined in the environment's [appSetting](#appsettings) value appSettings.\<env\>.newrelic

__Usage:__  gulp deploy:notify:nr

#### deploy:status

This tasks lists the latest deployed version of the application

__Usage:__  gulp deploy:status \[-e env\]

__Options:__

argument    | description                          | required | notes
------------|--------------------------------------|----------|-------------------------------------------------------------
-e name     | set the environment to get status of | NO       | If not specified, all defined environments will be displayed

__Notes:__

See [Deploy Log Format](#deploy-log-format) for output format

#### Deploy Log Format

Each entry into the deploy.log is in the following format:

\[timestamp\] \[environment\] version (revision) deployed_from deployed_by

argument      | description                              | example value
--------------|------------------------------------------|-----------------------------
timestamp     | the date and time the app was deployed   | 2017-11-27T16:57:23.797
environment   | the environment name                     | DEV
version       | the version defined in package.json      | v0.2.0
revision      | the svn revision or git short sha-a hash | 31175, a78e345
deployed_from | the server the app was deployed from     | JMORRIS2-MOBL
deployed_by   | the IDSID of who deployed the app        | sys_ccsd

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
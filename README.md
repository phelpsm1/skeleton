# Welcome to the Skeleton

This is the skeleton to build, test, and deploy a project within CCSD.  It is build on top of [Node.js](https://nodejs.org) and [gulp](https://gulpjs.com).

## Usage

    gulp <task> [options]

### Options

argument    | description
------------|---------------------------------------------------------------------------
-e name     | set the environment to use
-p password | password for the SQL Server account ccsd
-d name     | name of the database to work with
-r revision | source revision of the build, e.g. svn revision, git commit short sha, etc
-l label    | label that can be used to identify the build, e.g. CI artifact label
--force     | allows you to restore database in production

## Documentation

### Environment Variables

Several environment variables, accessed through the process.env object, are set and available for use.

variable             | description                                   | values
---------------------|-----------------------------------------------|----------------
process.env.target   | the environment to use                        | dev, int, prod
process.env.password | the password for the SQL Server account ccsd  |
process.env.database | the name of the database to work with         |
process.env.revision | the source revision of the build              | 31254, ce518b3
process.env.source   | the source of the build                       | ci, local
process.env.label    | the label of the build                        | 31254, 32564.2
process.env.force    | allows you to restore database in production  | true, false

### Configuration

Configuration is stored in the [package.json](https://docs.npmjs.com/files/package.json) file that is in the root of the project.

#### name

The short name or initialism for the project.

    "name": "EMS"

For more information, see the [name section](https://docs.npmjs.com/files/package.json#name) in the package.json documentation.

#### version

The version number of the release.  It should follow a [semver](https://semver.org) format.

    "version": "6.2.1"

For more information, see the [version section](https://docs.npmjs.com/files/package.json#version) in the package.json documentation.

#### author

The author of the project.  It is recommended to use the department name and email address.

    "author": {
      "name": "CCSD",
      "email": "ccsd@intel.com"
    }

For more information, see the [people fields section](https://docs.npmjs.com/files/package.json#people-fields-author-contributors) in the package.json documentation

#### contributors

An array of team members that can include developers, systems analysts, and integrators.

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

The url attribute is linked to the [Inside Blue](https://soco.intel.com) profile and the role attribute can be anything, e.g. Developer, Systems Analyst, Integrator, Tester, etc.

For more information, see the [people fields section](https://docs.npmjs.com/files/package.json#people-fields-author-contributors) in the package.json documentation.

#### pillar

The name of the pillar within CCSD, e.g. capacity, capital, cost.

    "pillar": "capital"

This is a custom attribute added the the package.json file.

#### appSettings

Defines all the different environments of the application.  Here is an example of one environment defined:

```json
{
  "appSettings": {
    "dev": {
      "dbs": [  
        {
          "name": "data",
          "server": "CCE1PDB120I02",
          "instance": "SQL02",
          "port": 1433,
          "database": "ExampleDev",
          "backupShare": "//CCE1PDB120FS/backups$"
        }
      ],
      "web": {
        "apppool": "ExampleDev",
        "site": "ExampleDev",
        "servers": [
          "CCE1PWB120N1",
          "CCE1PWB120N2"
        ]
      },
      "config": {
        "appSettings": {
          "Title": "Example (dev)",
          "Url": "http://example-dev.intel.com"
        },
        "log4net": {
          "appenders": [
            {
              "name": "DatabaseLogAppender",
              "connectionstring": "data"
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
}
```

This is a custom attribute added to the package.json file.

##### appSettings.environment

Each environment has a standard set of settings and it can have its own unique settings.  For example, local is for the local environment, unit for running unit tests, or the typical dev, int, and prod.

###### appSettings.environment.src

The path from the root of the project to the test project where the App.config file is located.

```json
{
  "appSettings": {
    "environment": {
      "src": "Tests/Intel.Example.Tests"
      }
  }
}
```

###### appSettings.environment.dbs

An array of database settings that the application uses.  One object for each database defined in the web.config connection string section.

```json
{
  "appSettings": {
    "environment": {
      "dbs": [
        {
          "name": "Data",
          "server": "server",
          "instance": "instance",
          "port": 1433,
          "database": "ExampleDev",
          "backupShare": "//server/backups",
          "backup": true,
          "restore": true
        },
        {
          "name": "Edw",
          "type": "teradata",
          "server": "server",
          "database": "database",
          "user": "user",
          "password": "*********",
          "backup": false,
          "restore": false
        }
      ]
    }
  }
}
```

setting     | description                     | value         | required | note
------------|---------------------------------|---------------|----------|--------------------------------------------------------------
name        | name of the data connection     | text          |   YES    | this is the name in the web.config connectionStrings section  
type        | type of database                | sql, teradata |   NO     | sql is default
server      | database server name            | text          |   YES    |
instance    | database instance               | text          |   NO     |
port        | database port                   | int           |   NO     |
database    | name of the database            | text          |   YES    |
user        | database user                   | text          |   NO     | default is SSPI connection
password    | database user password          | text          |   NO     |
backupShare | file share location for backups | text          |   NO     | if database is to be backed up, this is required
backup      | backup flag                     | true, false   |   NO     | default is true
restore     | restore flag                    | true, false   |   NO     | default is true

###### appSettings.environment.web

web is an object of settings for the web server

```json
{
  "appSettings": {
    "environment": {
      "web": {
        "project": "Intel.Example.Web",
        "apppool": "ExampleDev",
        "site": "ExampleDev",        
        "servers": [
          "localhost"
        ],
        "clean": {
          "releases": 5
        }
      }
    }
  }
}
```

setting   | description                 | value         | required | note
----------|-----------------------------|---------------|----------|----------------------------------------------------
project   | name of web project         | text          |   NO     |
apppool   | name of IIS app pool        | text          |   NO     |
site      | name of IIS site            | text          |   NO     |
servers   | array of server names       | array of text |   YES    | list each node of web farm
clean     | object of cleaning settings | object        |   NO     |

###### appSettings.environment.config

A set of all the settings to update in the web.config file of a web project.  There are three section (appSettings, log4net, system.web) that settings can be configured for and correspond to the sections in the web.config

```json
{
  "appSettings": {
    "environment": {
      "config": {
        "appSettings": {
          "ApplicationTitle": "Example (dev)",
          "Url": "http://example-dev.intel.com",
          "NewRelic.AppName": "Example (dev)"
        },
        "log4net": {
          "appenders": [
            {
              "name": "DatabaseLogAppender",
              "connectionstring": "Data"
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
      }
    }
  }
}
```

These settings would be turned into a web.config file as such

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <appSettings>
    <add key="ApplicationTitle" value="Example (dev)" />
    <add key="Url" value="http://example-dev.intel.com" />
    <add key="NewRelic.AppName" value="Example (dev)" />
  </appSettings>
  <log4net>
    <appender name="DatabaseLogAppender" type="Intel.Vfems.Support.Logging.DatabaseAppender">
      <param name="ConnectionString" value="Server=localhost;Database=EmsLocal;Integrated Security=SSPI" />
    </appender>
    <appender name="NHibernateAppender" type="log4net.Appender.RollingFileAppender,log4net">
      <param name="File" value="..\Log\NHibernate.log" />
    </appender>
    <root>
      <level value="ALL" />
      <appender-ref ref="DatabaseLogAppender" />
    </root>
  </log4net>
  <system.web>
    <compilation debug="true" targetFramework="4.6" />
  </system.web>
</configuration>
```

__appSettings__

These are the key, value pairs that will be added or updated in the web.config appSettings section.

__log4net__

For each appender object, the name value is used to look up the corresponding appender in web.config.  If setting a connection string, the connection string will be set from the array of dbs based on the name attribute.

__system.web__

These settings will match the xml elements and attributes and updated accordingly.

###### appSettings.environment.notify

An array of role names to notify for this environment.  See [contributors configuration](#contributors) on how to set a role for each contributor.

```json
{
  "notify": [
    "Developer",
    "System Analyst"
  ]
}
```

###### appSettings.environment.newrelic

An object of New Relic settings.

```json
{
  "newrelic": {
    "id": 9898989898
  }
}
```

setting   | description      | value | required | note
----------|------------------|-------|----------|----------------------------------------------------
id        | application id   | int   |   YES    |

### Log4Net Configuration

When configuring the Log4Net appenders, you must use the following format to set a parameter.

    <param name="key" value="value" />

If not in this format, the script will error out.

See [Log4Net Configuration](https://logging.apache.org/log4net/release/manual/configuration.html) for more information.

So, if the project's appender configuration looks like this inside your web or app configuration files:

```xml
<appender name="DatabaseLogAppender" type="Intel.Vfems.Support.Logging.DatabaseAppender">
  <threshold value="ALL" />
  <bufferSize value="0" />
  <connectionString value="Server=localhost;Database=Local;Integrated Security=SSPI" />
</appender>
```

Change it to:

```xml
<appender name="DatabaseLogAppender" type="Intel.Vfems.Support.Logging.DatabaseAppender">
  <param name="Threshold" value="ALL" />
  <param name="BufferSize" value="0" />
  <param name="ConnectionString" value="Server=localhost;Database=Local;Integrated Security=SSPI" />
</appender>
```

### Email Token Replacement

The following tokens can be used as placeholders for email addresses in configuration setting values in the package.json file.

token    | description
---------|---------------------------------------------------------------------------------------------------------------
 ${me}   | is replace with the current user's username (which can be used in lieu of an email address)
 ${role} | is replace with a semicolon delimited list of email addresses derived from the contributors base on role name

This is helpful when an app of web configuration files need a list of email addresses in a setting, e.g. in an log4net email appender.

### File Structure

#### Web Server

    <drive>:\WebSites
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

#### Backup Server

    \\CCE1PDB120FS\backup$
        \<database>
            \*.bak
        \FitNesse
            \<app>

### Tasks                        

#### Application Tasks

##### app:offline

This task copies the app_offline.htm (located in the root directory of the project) to each web server

__Usage:__  gulp app:offline -e dev

__Options:__

argument | description                | required
---------|----------------------------|----------------
-e name  | set the environment to use | YES, but not local

##### app:online

This task deletes the app_offline.htm on each web server

__Usage:__  gulp app:online -e dev

__Options:__

argument | description                | required
---------|----------------------------|----------------
-e name  | set the environment to use | YES, but not local

##### app:down

This task stops the application pool and website on each server

__Usage:__  gulp app:down -e dev

__Options:__

argument | description                | required
---------|----------------------------|--------------------
-e name  | set the environment to use | YES, but not local

__Notes:__

See [providing credentials](#providing-credentials)

##### app:up

This task starts the application pool and website on each server

__Usage:__  gulp app:up -e dev

__Options:__

argument | description                | required
---------|----------------------------|--------------------
-e name  | set the environment to use | YES, but not local

__Notes:__

See [providing credentials](#providing-credentials)

##### app:recycle

This task recycles the application pool on each server

__Usage:__  gulp app:recycle -e dev

__Options:__

argument | description                | required
---------|----------------------------|--------------------
-e name  | set the environment to use | YES, but not local

__Notes:__

See [providing credentials](#providing-credentials)

##### app:status

This task gets the status of the application pool and website of each server

__Usage:__  gulp app:status -e dev

__Options:__

argument | description                | required
---------|----------------------------|--------------------
-e name  | set the environment to use | YES, but not local

__Notes:__

See [providing credentials](#providing-credentials)

##### app:link

This task links the current and log NTFS junctions to the appropriate directory in the [Web Server File Structure](#web-server).

__Usage:__  gulp app:link -e dev

__Options:__

argument | description                | required
---------|----------------------------|----------------
-e name  | set the environment to use | YES

__Notes:__

See [providing credentials](#providing-credentials).

This task is not meant to be run independently.  It can be used in a sequence of tasks in a deploy to a web server.

##### app:rollback

This task moves the current NTFS junction to the n-1 release or revision specified.

__Usage:__  gulp app:rollback

__Options:__

argument    | description                | required
------------|----------------------------|----------------
-e name     | set the environment to use | YES
-r revision | revision to rollback to    | NO

__Notes:__

See [providing credentials](#providing-credentials)

#### Build Tasks

##### build

This task orchestrates the building of the Release configuration of the project.

__Usage:__  gulp build

__Notes:__

See [Build Configuration](#getbuildconfig)

##### build:compile

This task compiles the Release configuration of the project.

__Usage:__ gulp build:compile

__Notes:__

This task is not meant to be run independently. See the [build](#build) task.

##### build:clean

This task cleans the project before building.

__Usage:__ gulp build:clean

__Notes:__

This task is not meant to be run independently. See the [build](#build) task.

##### build:assemblyinfo

This task sets various attributes in all AsseblyInfo.cs files in the project.  The attributes are:
* AssemblyConfiguration
* AssbemlyCompany
* AssemblyProduct
* AssemblyCopyright
* AssemblyVersion
* AssemblyFileVersion

__Usage:__ gulp build:assemblyinfo

__Notes:__

This task is not meant to be run independently. See the [build](#build) task.

#### Test Tasks

##### test

This task orchestrates the configuration and execution the unit tests of the project.

__Usage:__  gulp test

##### test:config

This task configures the app.config file for execution of the unit tests.

__Usage:__  gulp test:config

__Notes:__

See [Test Configuration](#gettestconfig)

This task is not meant to be run independently. See [test](#test) task.

##### test:unit

This task executes the unit tests of the project using the [NUnit Console](https://github.com/nunit/docs/wiki/Console-Runner) found in the packages folder.  It looks for all DLLs with the name pattern of Intel.\*.Tests.dll in the project.

__Usage:__ gulp test:unit

__Notes:__

This task is not meant to be run independently. See [test](#test) task.

#### SQL Tasks

##### sql:backup

This task backups up all database(s) in the specified environment except those marked with backup false.

__Usage:__  gulp sql:backup -e env -p password \[-d name\]

__Options:__

argument    | description                                       | required | notes
------------|---------------------------------------------------|----------|--------------------------------------------------
-e name     | set the environment to use                        | NO       | If not specified, local is used
-p password | set the password to use with the ccsd SQL account | YES      |
-d name     | set the name of the database to backup            | NO       | If not specified, all databases will be restored

__Notes:__

See [appSettings.environment.dbs](#appsettingsenvironmentdbs)

##### sql:restore

This task restores all database(s) in the specified environment except those marekd with restore false.

__Usage:__  gulp sql:restore -e env -p password \[-d name --force\]

__Options:__

argument    | description                                       | required | notes
------------|---------------------------------------------------|----------|--------------------------------------------------
-e name     | set the environment to use                        | NO       | If not specified, local is used
-p password | set the password to use with the ccsd SQL account | YES      |
-d name     | set the name of the database to restore           | NO       | If not specified, all databases will be restored
--force     | allows you to restore database in production      | YES      | required if restoring production

__Notes:__

See [appSettings.environment.dbs](#appsettingsenvironmentdbs)

By default, this task uses the backup location of the production database as the source to find the most recent \*.bak file.  See [File Structure Backup Server](#backup-server).  If you would like to use a different location, just change the backupShare value on the production database in the [appSettings.environment.dbs](#appsettingsenvironmentdbs) configuration object.

#### Clean Tasks

##### clean:releases

This task cleans up the previous releases by keeping only the last five (or configured value).

__Usage:__  gulp clean:releases -e env

__Options:__

argument    | description                                       | required | notes
------------|---------------------------------------------------|----------|--------------------------------------------------
-e name     | set the environment to use                        | YES      |

__Notes:__

See [Web Server File Structure](#web-server)

See [appSettings.environment.web](#appsettingsenvironmentweb) for overriding the default.

##### clean:logs

This task cleans up the logs by removing any logs that are older than 30 days in the shared/log directory.

__Usage:__  gulp clean:logs -e env

__Options:__

argument    | description                                       | required | notes
------------|---------------------------------------------------|----------|--------------------------------------------------
-e name     | set the environment to use                        | YES      |

__Notes:__

See [Web Server File Structure](#web-server)

#### Deploy Tasks

##### deploy:notify

This task orchestrates the various channels of notification when deploying.

__Usage:__  gulp deploy:notify

##### deploy:notify:log

This task adds an entry into the deploy.log file on each server the app is deployed to.

__Usage:__  gulp deploy:notify:log

__Notes:__

See [Web Server File Structure](#web-server) for location of the deploy.log file
See [Deploy Log Format](#deploy-log-format) for deploy.log file format

##### deploy:notify:email

This task sends an email to all [contributors](#contributors) in the role(s) defined in [appSetting.environment.notify](#appsettingsenvironmentnotify).

__Usage:__  gulp deploy:notify:email

##### deploy:notify:nr

This tasks does an HTTP POST to the New Relic endpoint that records deployments, if settings are defined in [appSetting.environment.newrelic](#appsettingsenvironmentnewrelic).

__Usage:__  gulp deploy:notify:nr

##### deploy:status

This tasks lists the latest deployed version of the application.

__Usage:__  gulp deploy:status \[-e env\]

__Options:__

argument    | description                          | required | notes
------------|--------------------------------------|----------|-------------------------------------------------------------
-e name     | set the environment to get status of | NO       | If not specified, all defined environments will be displayed

__Notes:__

See [Deploy Log Format](#deploy-log-format) for output format

##### Deploy Log Format

Each entry into the deploy.log is in the following format:

\[timestamp\] \[environment\] version (revision) deployed_from deployed_by

argument      | description                              | example
--------------|------------------------------------------|--------------------------
timestamp     | the date and time the app was deployed   | 2017-11-27T16:57:23.797
environment   | the environment name                     | DEV
version       | the version defined in package.json      | v0.2.0
revision      | the svn revision or git short sha-a hash | 31175, a78e345
deployed_from | the server the app was deployed from     | JMORRIS2-MOBL
deployed_by   | the IDSID of who deployed the app        | sys_ccsd

#### Local Tasks

##### start

This task starts IIS Express locally with the web project.

__Usage:__  gulp start

__Notes:__

Uses [appSettings.environment.web](#appsettingsenvironmentweb).project setting.

##### stop

This task stops IIS Express locally.

__Usage:__  gulp stop

__Notes:__

Uses [appSettings.environment.web](#appsettingsenvironmentweb).project setting.

##### restart

This task stops and start IIS Express locally with the web project.

__Usage:__  gulp restart

__Notes:__

See [stop](#stop) and [start](#start).

#### Config Tasks

##### config:web

This tasks configures the local copy of web.config for the specified environment.

__Usage:__  gulp config:web \[-e env\]

__Options:__

argument    | description                         | required | notes
------------|-------------------------------------|----------|---------------------------------------------------------
-e name     | set the environment to use          | NO       | if not specified, will configure for local environment

#### Restore Tasks

##### restore:notify:email

This task sends an email to all [contributors](#contributors) in the role(s) defined in [appSetting.environment.notify](#appsettingsenvironmentnotify) setting.

__Usage:__  gulp restore:notify:email

#### Environment Tasks

##### env:<name>

This task sets the process.env.target environment variable to <name>.

__Usage:__ gulp env:<name>

__Note:__

The exact name of the task is determined by the name of each environment listed in the [Configuration](#configuration)

### Providing credentials

Each task requiring credentials, will prompt for you mfg_idsid account.  However, you can bypass this by creating a credentials.xml file in the root of your project directory.  Once created, all tasks requiring credentials will use the credentials supplied in the file.

To create your file, execute the following command at a PowerShell command prompt.

    Get-Credential | Export-Clixml "credentials.xml"

### API

__TODO: Need more documentation here!__

```javascript
const env = require('skeleton').Env
const files = require('skeleton').Files
const mssql = require('skeleton').Mssql
```

#### Env

##### getBuildConfig

##### getTestConfig

##### Env.parse

##### Env.getEnvironmentConfig

#### Files

##### Files.transform

##### Files.updateWebConfig

##### Files.log

#### Mssql

##### Mssql.run

Mssql exposes one method to execute sql statements, Mssql.run().

```javascript
gulp.task('sql:migrate', () => {
  const help = ', e.g. gulp db:migrate -e dev -p <password>'

  if (!env.isEnvironmentDefined()) {
    log.error(colors.red('Environment not specified ${help}'))
    return
  }

  if (!env.isPasswordDefined()) {
    log.info(colors.red('Password not specified ${help}'))
    return
  }

  let db = env.getEnvironmentConfig().dbs.find((db) => { return db.name === 'data' })

  let sql = ''

  return mssql.run(sql, db)
    .catch(err => {
      log.error(colors.red(`Error migrating the database: ${sql}`))
      log.error(err)
    })
})
```

##### Mssql.run

## Release Workflow

1. make a release branch ``git checkout -b release-v0.2.0 develop``
2. bump version in package.json
3. generate changelog [conventionalChangelog](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-cli)
4. commit package.json and CHANGELOG.md files ``git commit -a -m 'bumped version number and added changelog''``
5. finish the release branch
    1. ``git checkout master``
    2. ``git merge --no-ff release-v0.2.0``
    3. ``git tag -a v0.2.0 -m 'release v0.2.0'``
    4. ``git checkout develop``
    5. ``get merge --no-ff release-v0.2.0``
    6. ``git branch -d release-v0.2.0``
6. push ``git push --all --tags``

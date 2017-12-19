## 0.2.1 (2017-12-19)

* fix(test): fixes #10 update test config before build during test ([3f25ba5](https://github.intel.com/ccsd/skeleton/commit/3f25ba5)), closes [#10](https://github.intel.com/ccsd/skeleton/issues/10)

# v0.2.0 (2017-12-15)

### BREAKING CHANGE

* Renaming of several tasks
  * notify:restore:email to restore:notify:email
  * notify:deploy to deploy:notify
  * notify:deploy:log to deploy:notify:log
  * notify:deploy:email to deploy:notify:email
  * notify:deploy:nr to deploy:notify:nr

## app

* feat(app): ability to configure the drive on the web server ([dd92bb9](https://github.intel.com/ccsd/skeleton/commit/dd92bb9))
* feat(app): link shared/log to root of app directory ([362d5b7](https://github.intel.com/ccsd/skeleton/commit/362d5b7))
* feat(app): ps credentials can be supplied via credentials.xml file ([b62e45e](https://github.intel.com/ccsd/skeleton/commit/b62e45e))
* feat(app): removed isEnvironmentDefined check and check if local instead ([e4ccc47](https://github.intel.com/ccsd/skeleton/commit/e4ccc47))
* feat(app): symlink shared log directory to root of current (aka release revision) directory ([bbf2730](https://github.intel.com/ccsd/skeleton/commit/bbf2730))

* fix(app): app online, offline, recycle should not execute in local ([b797f6a](https://github.intel.com/ccsd/skeleton/commit/b797f6a))
* fix(app): app:rollback correctly uses -r argument to rollback to specific revision ([31eaf60](https://github.intel.com/ccsd/skeleton/commit/31eaf60))
* fix(app): tasks will powershell now fail properly ([5ac1d20](https://github.intel.com/ccsd/skeleton/commit/5ac1d20))

* chore(app): removed dependency on merge-stream ([54347bf](https://github.intel.com/ccsd/skeleton/commit/54347bf))

## deploy

* feat(deploy): added task to list all deployed environment's latest release ([79f4097](https://github.intel.com/ccsd/skeleton/commit/79f4097))
* feat(deploy): deploy:notify:nr removed isEnvironmentDefined check ([8f6b3d1](https://github.intel.com/ccsd/skeleton/commit/8f6b3d1))
* feat(deploy): deploy:status if -e is not defined, then all defined environments are shown ([581cef7](https://github.intel.com/ccsd/skeleton/commit/581cef7))
* feat(deploy): deploy:status uses 8 characters for environment name ([1054856](https://github.intel.com/ccsd/skeleton/commit/1054856))

## notify

* feat(notify): added reply to email address to prevent reply alls ([4862368](https://github.intel.com/ccsd/skeleton/commit/4862368))

## test

* fix(test): made changes to how options are passed when running unit tests ([70c75f5](https://github.intel.com/ccsd/skeleton/commit/70c75f5))

## env

* feat(env): added -l label command line argument ([e22c97e](https://github.intel.com/ccsd/skeleton/commit/e22c97e))
* feat(env): added ability to check any environment ([36f4269](https://github.intel.com/ccsd/skeleton/commit/36f4269))
* feat(env): generate env:<env> gulp task for each environment defined in appSettings ([ce518b3](https://github.intel.com/ccsd/skeleton/commit/ce518b3))
* feat(env): process.env.label is defined from command line (-l), ci env variable, or revision ([8d851b4](https://github.intel.com/ccsd/skeleton/commit/8d851b4))
* feat(env): set the Test src directory ([8d87866](https://github.intel.com/ccsd/skeleton/commit/8d87866))

* fix(env): fixed check if env defined on command line ([efe246d](https://github.intel.com/ccsd/skeleton/commit/efe246d))

## files

* feat(files): added ability to set root and logger levels BREAKING CHANGE: restructured log4net setti ([ef47ac8](https://github.intel.com/ccsd/skeleton/commit/ef47ac8))
* feat(files): exposing methods to configure settings ([77e51f0](https://github.intel.com/ccsd/skeleton/commit/77e51f0))

## config

* feat(config): sql server connection string with username and password; teradata connection strings ([2a405b6](https://github.intel.com/ccsd/skeleton/commit/2a405b6))

## smtp

* feat(smtp): inline css when sending html email ([c3f637e](https://github.intel.com/ccsd/skeleton/commit/c3f637e))
* feat(smtp): SMTP is publicly available to send mail messages ([1d73184](https://github.intel.com/ccsd/skeleton/commit/1d73184))
* feat(smtp): using pug as templating engine ([da6cd36](https://github.intel.com/ccsd/skeleton/commit/da6cd36))

* fix(smtp): improved check if no roles to notify ([76150e7](https://github.intel.com/ccsd/skeleton/commit/76150e7))

## sql

* feat(sql): removed isEnvironmentDefined checks to allow use in local env ([0021f82](https://github.intel.com/ccsd/skeleton/commit/0021f82))
* feat(sql): sql:restore to local environment ([8508b0d](https://github.intel.com/ccsd/skeleton/commit/8508b0d))

## svn

* feat(svn): added isTrunk check; exposed source control objects ([ed1ac52](https://github.intel.com/ccsd/skeleton/commit/ed1ac52))

## ps

* fix(ps): removed unneeded spaces ([8d9725e](https://github.intel.com/ccsd/skeleton/commit/8d9725e))

## docs

* docs: added documentation for build and test tasks ([872d0ab](https://github.intel.com/ccsd/skeleton/commit/872d0ab))
* docs: configuration ([48a3fb2](https://github.intel.com/ccsd/skeleton/commit/48a3fb2))
* docs: configuration and sql tasks ([369fff2](https://github.intel.com/ccsd/skeleton/commit/369fff2))
* docs: deploy:notify tasks ([3dfb2e1](https://github.intel.com/ccsd/skeleton/commit/3dfb2e1))
* docs: env:* tasks ([2babd87](https://github.intel.com/ccsd/skeleton/commit/2babd87))
* docs: fixed links to anchors with periods ([e6366ed](https://github.intel.com/ccsd/skeleton/commit/e6366ed))
* docs: general improvements ([d86ff1b](https://github.intel.com/ccsd/skeleton/commit/d86ff1b))
* docs: improved README ([a6b4348](https://github.intel.com/ccsd/skeleton/commit/a6b4348))
* docs: local, config, restore tasks and other improvements ([f374fa8](https://github.intel.com/ccsd/skeleton/commit/f374fa8))

## miscellaneous

* feat: new process.env.source variable set to local|ci ([97a30f6](https://github.intel.com/ccsd/skeleton/commit/97a30f6))
* chore: code cleanup ([dbd89c4](https://github.intel.com/ccsd/skeleton/commit/dbd89c4))
* chore: update packages ([6099d5b](https://github.intel.com/ccsd/skeleton/commit/6099d5b))
* chore: update packages ([60ddb56](https://github.intel.com/ccsd/skeleton/commit/60ddb56))
* chore: update packages ([832c9d4](https://github.intel.com/ccsd/skeleton/commit/832c9d4))
* chore: update packages ([19da1c7](https://github.intel.com/ccsd/skeleton/commit/19da1c7))
* chore: update packages ([43faf9e](https://github.intel.com/ccsd/skeleton/commit/43faf9e))
* chore: update packages ([63983e2](https://github.intel.com/ccsd/skeleton/commit/63983e2))
* fix: adding gulp.test.js ([c277b80](https://github.intel.com/ccsd/skeleton/commit/c277b80))
* fix: updated dependencies ([749cf3c](https://github.intel.com/ccsd/skeleton/commit/749cf3c))
* added a placeholder changelog ([6d463a7](https://github.intel.com/ccsd/skeleton/commit/6d463a7))
* added documentation in the README about the app:* tasks ([21376c3](https://github.intel.com/ccsd/skeleton/commit/21376c3))
* added task to notify via email when a database is restored ([3f547e1](https://github.intel.com/ccsd/skeleton/commit/3f547e1))

# v0.1.0 (2017-09-27)

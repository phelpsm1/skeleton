# 0.4.0 (2018-08-17)

## BREAKING CHANGE

* no longer able to use on projects whose source is hosted in SVN

## deploy

* feat(deploy): deploy email contains a list of changes since last deploy to the environment ([499d205](https://github.intel.com/ccsd/skeleton/commit/499d205))

* fix: added function to parse the CC build label into the shorthand form (#21) ([4ebc946](https://github.intel.com/ccsd/skeleton/commit/4ebc946)), closes [#21](https://github.intel.com/ccsd/skeleton/issues/21)
* fix: change order of deploy:notify so including commits in email works ([df35214](https://github.intel.com/ccsd/skeleton/commit/df35214))
* fix: deploy notify email shows changes header when no commits ([4b3fe21](https://github.intel.com/ccsd/skeleton/commit/4b3fe21))
* fix: format of deploy notify email message when zero commits ([f2454ee](https://github.intel.com/ccsd/skeleton/commit/f2454ee))
* fix: log error if commits cannot be obtained instead of throw it ([953446e](https://github.intel.com/ccsd/skeleton/commit/953446e))
* fix(deploy): status can handle variable length environments and revisions better ([e29468c](https://github.intel.com/ccsd/skeleton/commit/e29468c))

## ps

* feat(ps): added a check before getting the session to see if credentials are even needed. (#20) ([97557eb](https://github.intel.com/ccsd/skeleton/commit/97557eb)), closes [#20](https://github.intel.com/ccsd/skeleton/issues/20)

## git

* feat(git): add ability to check branch by regex ([c2fac8e](https://github.intel.com/ccsd/skeleton/commit/c2fac8e))

## svn

* feat(svn): remove svn support ([b0d8e57](https://github.intel.com/ccsd/skeleton/commit/b0d8e57))

## miscellaneous

* docs: fixed typo ([704cf4b](https://github.intel.com/ccsd/skeleton/commit/704cf4b))
* chore: bump version number ([04bc655](https://github.intel.com/ccsd/skeleton/commit/04bc655))
* chore: update contributors ([989f32f](https://github.intel.com/ccsd/skeleton/commit/989f32f))
* chore: update dependencies ([f66cb5c](https://github.intel.com/ccsd/skeleton/commit/f66cb5c))

# 0.3.0 (2018-06-06)

## clean

* feat(clean): clean:logs make age of logs to keep configurable per environment (default: 30 days) res ([e234d8c](https://github.intel.com/ccsd/skeleton/commit/e234d8c)), closes [#7](https://github.intel.com/ccsd/skeleton/issues/7)
* feat(clean): clean:releases make number of releases to keep configurable per environment (default: 5 ([1d9ff39](https://github.intel.com/ccsd/skeleton/commit/1d9ff39)), closes [#6](https://github.intel.com/ccsd/skeleton/issues/6)

## ps

* feat(ps): added help message for adding credentials ([d2d47ac](https://github.intel.com/ccsd/skeleton/commit/d2d47ac))
* fix(ps): restored missing required parameter ([60c2990](https://github.intel.com/ccsd/skeleton/commit/60c2990))
* Exposed the ps module. (#17) ([cc33892](https://github.intel.com/ccsd/skeleton/commit/cc33892)), closes [#17](https://github.intel.com/ccsd/skeleton/issues/17)

## sql

* feat(sql): Add ability to secure SQL Server connections implements #18 ([f27802e](https://github.intel.com/ccsd/skeleton/commit/f27802e)), closes [#18](https://github.intel.com/ccsd/skeleton/issues/18)
* fix(sql): add NO_WAIT to option to SET RECOVERY SIMPLE resolves #16 ([26cdbd7](https://github.intel.com/ccsd/skeleton/commit/26cdbd7)), closes [#16](https://github.intel.com/ccsd/skeleton/issues/16)
* fix(sql): use same directory structure as backup location when saving sql backup file to local temp  ([4fe1520](https://github.intel.com/ccsd/skeleton/commit/4fe1520)), closes [#12](https://github.intel.com/ccsd/skeleton/issues/12)

## deploy

* fix(deploy): deploy:status now handles if deploy.log file is not present for environment. Fixes #5 ([25845a7](https://github.intel.com/ccsd/skeleton/commit/25845a7)), closes [#5](https://github.intel.com/ccsd/skeleton/issues/5)

## iisexpress

* fix(iisexpress): added missing required parameter ([57495cf](https://github.intel.com/ccsd/skeleton/commit/57495cf))

## test

* fix(test): ./Tests default unit test project location. Fixes #9 ([e8cd566](https://github.intel.com/ccsd/skeleton/commit/e8cd566)), closes [#9](https://github.intel.com/ccsd/skeleton/issues/9)
* fix(test): fixes #10 update test config before build during test ([3f25ba5](https://github.intel.com/ccsd/skeleton/commit/3f25ba5)), closes [#10](https://github.intel.com/ccsd/skeleton/issues/10)

## gulp.local

* feature(gulp.local): implements #15 run IIS Express under a system account ([28f65d6](https://github.intel.com/ccsd/skeleton/commit/28f65d6)), closes [#15](https://github.intel.com/ccsd/skeleton/issues/15)

## miscellaneous

* docs: added section to explain email replacement tokens in configuration setting values ([3588e26](https://github.intel.com/ccsd/skeleton/commit/3588e26))
* docs: added section to explain log4net appender parameter format ([6ea7703](https://github.intel.com/ccsd/skeleton/commit/6ea7703))
* docs: backupShare setting and using a different production backupShare for local files ([75d61b8](https://github.intel.com/ccsd/skeleton/commit/75d61b8))
* docs: fixed link issue ([c86f667](https://github.intel.com/ccsd/skeleton/commit/c86f667))
* docs: fixed nested numbered lists in release workflow ([c26d2ac](https://github.intel.com/ccsd/skeleton/commit/c26d2ac))
* docs: fixed typo ([52a0315](https://github.intel.com/ccsd/skeleton/commit/52a0315))
* docs: highlighting another breaking change in v0.2.0 ([2d2af44](https://github.intel.com/ccsd/skeleton/commit/2d2af44))
* docs: improvements to release workflow steps ([0da0dd8](https://github.intel.com/ccsd/skeleton/commit/0da0dd8))
* docs: updated CHANGELOG ([7c29fb4](https://github.intel.com/ccsd/skeleton/commit/7c29fb4))
* chore: bumped version ([623f7b2](https://github.intel.com/ccsd/skeleton/commit/623f7b2))
* chore: Remove deploy:notify:nr closes #19 ([4fda15d](https://github.intel.com/ccsd/skeleton/commit/4fda15d)), closes [#19](https://github.intel.com/ccsd/skeleton/issues/19)
* chore: removed deprecated dependency gulp-util and replaced with other dependencies ([6e643ad](https://github.intel.com/ccsd/skeleton/commit/6e643ad))
* chore: updated author ([2e16088](https://github.intel.com/ccsd/skeleton/commit/2e16088))
* chore: updated dependencies ([34339a6](https://github.intel.com/ccsd/skeleton/commit/34339a6))
* chore: updated dependencies ([9d13059](https://github.intel.com/ccsd/skeleton/commit/9d13059))
* chore: updated dependencies ([6d6b88d](https://github.intel.com/ccsd/skeleton/commit/6d6b88d))
* chore: updated dependencies ([d476145](https://github.intel.com/ccsd/skeleton/commit/d476145))
* chore: updated dependencies ([4a8b3f1](https://github.intel.com/ccsd/skeleton/commit/4a8b3f1))
* chore: updated shelljs ([9a24e52](https://github.intel.com/ccsd/skeleton/commit/9a24e52))

# 0.2.1 (2017-12-19)

* fix(test): fixes #10 update test config before build during test ([3f25ba5](https://github.intel.com/ccsd/skeleton/commit/3f25ba5)), closes [#10](https://github.intel.com/ccsd/skeleton/issues/10)

# 0.2.0 (2017-12-15)

### BREAKING CHANGE

* Renaming of several tasks
  * notify:restore:email to restore:notify:email
  * notify:deploy to deploy:notify
  * notify:deploy:log to deploy:notify:log
  * notify:deploy:email to deploy:notify:email
  * notify:deploy:nr to deploy:notify:nr
* Restructured log4net settings in package.json

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

# 0.1.0 (2017-09-27)

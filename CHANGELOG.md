# 0.8.0 (2019-12-02)

Changes for moving CI/CD behind CDC firewall

## deploy

* fix: default revision if no entry in deploy.log ([14328e4](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/14328e4))
* fix: remove ability to see commits in notification message ([b37b496](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/b37b496))

## app

* add optional parameter to jarvis.ps1 which specifies the root folder for Set-Current command ([262300c](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/262300c))

* fix(app): no longer need to switch to mfg_ accounts ([4afd0a4](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/4afd0a4))

## sql

* feat(sql): add encryption to the backup ([dd2dbfa](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/dd2dbfa))

## env

* feat: deploy from ci server by using directory name as revision ([b04ed18](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/b04ed18))

* fix(env): revision from -r arg or dir name or cc build label ([b8178f5](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/b8178f5))
* fix: do not set a revision if directory is not correct format ([683b9ec](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/683b9ec))
* fix: message when revision is set ([15576a4](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/15576a4))
* fix: revision to not include .1, .2, etc ([3e2ac9d](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/3e2ac9d))
* fix: revision to not include .1, .2, etc ([44b0539](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/44b0539))

## ps

* fix: remove warning about credential.xml file missing ([6bb9f64](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/6bb9f64))

## miscellaneous

* chore: update capitalize ([ccb3427](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/ccb3427))
* chore: update dependencies ([58ef6dc](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/58ef6dc))
* chore: update eslint ([a3e95b7](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/a3e95b7))

# 0.7.0 (2019-11-04)

Upgrade for MS Build Tools 2019

## build

* feat: use most current .NET tools to build ([1212438](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/1212438))

## miscellaneous

* chore: remove public access to getCcBuildLabel ([a09db4d](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/a09db4d))
* chore: update dependencies ([887c5f0](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/887c5f0))
* chore: update eslint dependencies, fix eslint errors ([edc5cfe](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/edc5cfe))
* chore: update gulp-msbuild ([8745cd8](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/8745cd8))

# 0.6.5 (2019-05-10)

## restore

* fix: do not perform restore:notify:log in local env ([70c76e0](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/70c76e0))

## miscellaneous

* chore: bump version number ([f622f1d](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/f622f1d))

# 0.6.4 (2019-05-09)

## sql

* fix: return resolved promise ([887aca27](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/887aca27bb24865eeaae0a60ee18143c1efe28ce))

## restore

* fix: return resolved promise if no email to send ([40ebdabe](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/40ebdabe917b1328eb23b55bbfb900f5393599f2))

## smtp

* fix: return resolved promise if no one to email ([0a59c761](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/0a59c7618115b5f12ad519211c5770c1b931e177))

## miscellaneous

* chore: bump version number ([4559f596](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/4559f5964021faff72ffa81fdf49879d5a56df2e))

# 0.6.3 (2019-05-08)

## app

* fix: check for local env in app:* tasks ([83556474](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/83556474905ebce14928c45940e413e07d7818a6))

## miscellaneous

* chore: bumped version to 0.6.3 ([596053b0](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/596053b04e76d8978131f8554ab1a4fa947d2e66)

# 0.6.2 (2019-05-08)

## deploy

* fix: expose the deploy:notify:log task ([afd1643](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/afd1643))

## miscellaneous

* chore: bump version number and upgrade dependencies ([5e5f8a0](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/5e5f8a0))

# 0.6.1 (2019-04-10)

## config & test

* fix: save file to correct location ([f812580](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/f812580))

## miscellaneous

* chore: bump version ([1a1f53b](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/1a1f53b))

# 0.6.0 (2019-04-03)

## deploy

* fix: deploy:notify:email uses correct repo url fixes #26 ([4f9354a](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/4f9354a)), closes [#26](https://gitlab.devtools.intel.com/ccsd/skeleton/issues/26)

## miscellaneous

* chore: migrate to gulp 4 syntax ([d4d48ac](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/d4d48ac))
* chore: migrate example to gulp 4 syntax ([df5bd72](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/df5bd72))
* chore: update dependencies ([7149022](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/7149022))
* chore: update dependencies ([5657ffb](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/5657ffb))
* chore: bump version number ([7a62598](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/7a62598))

# 0.5.0 (2019-01-10)

## BREAKING CHANGE

* chore: update gulp and use gulp.series and gulp.parallel and remove run-sequence ([4d84e59](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/4d84e59))

## deploy

* feat: add deploy:info task ([68fff43](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/68fff43))

## restore

* feat: add restore:notify task ([ae9dab2](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/ae9dab2))
* feat: implement #25 record all database restores ([1eef382](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/1eef382)), closes [#25](https://gitlab.devtools.intel.com/ccsd/skeleton/issues/25)

## checks

* feat: add common checks, e.g. guard clauses for missing password and environment arguments ([f490d50](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/f490d50))                                    

## miscellaneous

* fix: add missing reference ([9cb0be6](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/9cb0be6))
* fix: call done in deploy:notify:log ([3a76acf](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/3a76acf))
* fix: call done in env:* tasks ([88da2c6](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/88da2c6))
* fix: removed erroneous code from restore:status ([d6d969f](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/d6d969f))

* doc: update release procedure ([0c80017](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/0c80017))

* refactor: drop file extension in require statements ([a938ce7](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/a938ce7))                                    
* refactor: remove duplication and leverage gulp 4 api ([17a0794](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/17a0794))

* chore: update due to migration to GitLab ([80d4cb9](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/80d4cb9))
* chore: update dependencies (except gulp) ([7d1e594](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/7d1e594))
* chore: update dev dependencies ([015ba33](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/015ba33))
* chore: npm audit fix to fix vulnerabilities ([caeddf1](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/caeddf1))
* chore: add example of error handling in example gulp task ([a938fe6](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/a938fe6))
* chore: removed unneeded jshint config ([7f36b93](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/7f36b93))
* chore: bump version number ([ae409f4](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/ae409f4))

# 0.4.1 (2018-12-07)

* fix: force args to parse as strings (#24) closes #23 ([2f67ab0](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/2f67ab0)), closes [#23](https://gitlab.devtools.intel.com/ccsd/skeleton/issues/23)

* chore: bumped version number ([03341f0](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/03341f0))
* chore: update dependencies (except gulp) and node/npm ([d11e115](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/d11e115))
* chore: corrected linter warnings ([3e0b640](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/3e0b640))
* chore: update dependencies (except gulp) ([a3d31aa](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/a3d31aa))
* chore: update dependencies (except gulp) ([7a858cc](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/7a858cc))

* doc: add contributor ([e3e7bf1](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/e3e7bf1))

# 0.4.0 (2018-08-17)

## BREAKING CHANGE

* no longer able to use on projects whose source is hosted in SVN

## deploy

* feat(deploy): deploy email contains a list of changes since last deploy to the environment ([499d205](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/499d205))

* fix: added function to parse the CC build label into the shorthand form (#21) ([4ebc946](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/4ebc946)), closes [#21](https://gitlab.devtools.intel.com/ccsd/skeleton/issues/21)
* fix: change order of deploy:notify so including commits in email works ([df35214](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/df35214))
* fix: deploy notify email shows changes header when no commits ([4b3fe21](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/4b3fe21))
* fix: format of deploy notify email message when zero commits ([f2454ee](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/f2454ee))
* fix: log error if commits cannot be obtained instead of throw it ([953446e](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/953446e))
* fix(deploy): status can handle variable length environments and revisions better ([e29468c](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/e29468c))

## ps

* feat(ps): added a check before getting the session to see if credentials are even needed. (#20) ([97557eb](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/97557eb)), closes [#20](https://gitlab.devtools.intel.com/ccsd/skeleton/issues/20)

## git

* feat(git): add ability to check branch by regex ([c2fac8e](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/c2fac8e))

## svn

* feat(svn): remove svn support ([b0d8e57](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/b0d8e57))

## miscellaneous

* docs: fixed typo ([704cf4b](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/704cf4b))
* chore: bump version number ([04bc655](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/04bc655))
* chore: update contributors ([989f32f](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/989f32f))
* chore: update dependencies ([f66cb5c](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/f66cb5c))

# 0.3.0 (2018-06-06)

## clean

* feat(clean): clean:logs make age of logs to keep configurable per environment (default: 30 days) res ([e234d8c](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/e234d8c)), closes [#7](https://gitlab.devtools.intel.com/ccsd/skeleton/issues/7)
* feat(clean): clean:releases make number of releases to keep configurable per environment (default: 5 ([1d9ff39](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/1d9ff39)), closes [#6](https://gitlab.devtools.intel.com/ccsd/skeleton/issues/6)

## ps

* feat(ps): added help message for adding credentials ([d2d47ac](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/d2d47ac))
* fix(ps): restored missing required parameter ([60c2990](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/60c2990))
* Exposed the ps module. (#17) ([cc33892](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/cc33892)), closes [#17](https://gitlab.devtools.intel.com/ccsd/skeleton/issues/17)

## sql

* feat(sql): Add ability to secure SQL Server connections implements #18 ([f27802e](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/f27802e)), closes [#18](https://gitlab.devtools.intel.com/ccsd/skeleton/issues/18)
* fix(sql): add NO_WAIT to option to SET RECOVERY SIMPLE resolves #16 ([26cdbd7](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/26cdbd7)), closes [#16](https://gitlab.devtools.intel.com/ccsd/skeleton/issues/16)
* fix(sql): use same directory structure as backup location when saving sql backup file to local temp  ([4fe1520](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/4fe1520)), closes [#12](https://gitlab.devtools.intel.com/ccsd/skeleton/issues/12)

## deploy

* fix(deploy): deploy:status now handles if deploy.log file is not present for environment. Fixes #5 ([25845a7](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/25845a7)), closes [#5](https://gitlab.devtools.intel.com/ccsd/skeleton/issues/5)

## iisexpress

* fix(iisexpress): added missing required parameter ([57495cf](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/57495cf))

## test

* fix(test): ./Tests default unit test project location. Fixes #9 ([e8cd566](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/e8cd566)), closes [#9](https://gitlab.devtools.intel.com/ccsd/skeleton/issues/9)
* fix(test): fixes #10 update test config before build during test ([3f25ba5](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/3f25ba5)), closes [#10](https://gitlab.devtools.intel.com/ccsd/skeleton/issues/10)

## gulp.local

* feature(gulp.local): implements #15 run IIS Express under a system account ([28f65d6](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/28f65d6)), closes [#15](https://gitlab.devtools.intel.com/ccsd/skeleton/issues/15)

## miscellaneous

* docs: added section to explain email replacement tokens in configuration setting values ([3588e26](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/3588e26))
* docs: added section to explain log4net appender parameter format ([6ea7703](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/6ea7703))
* docs: backupShare setting and using a different production backupShare for local files ([75d61b8](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/75d61b8))
* docs: fixed link issue ([c86f667](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/c86f667))
* docs: fixed nested numbered lists in release workflow ([c26d2ac](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/c26d2ac))
* docs: fixed typo ([52a0315](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/52a0315))
* docs: highlighting another breaking change in v0.2.0 ([2d2af44](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/2d2af44))
* docs: improvements to release workflow steps ([0da0dd8](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/0da0dd8))
* docs: updated CHANGELOG ([7c29fb4](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/7c29fb4))
* chore: bumped version ([623f7b2](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/623f7b2))
* chore: Remove deploy:notify:nr closes #19 ([4fda15d](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/4fda15d)), closes [#19](https://gitlab.devtools.intel.com/ccsd/skeleton/issues/19)
* chore: removed deprecated dependency gulp-util and replaced with other dependencies ([6e643ad](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/6e643ad))
* chore: updated author ([2e16088](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/2e16088))
* chore: updated dependencies ([34339a6](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/34339a6))
* chore: updated dependencies ([9d13059](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/9d13059))
* chore: updated dependencies ([6d6b88d](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/6d6b88d))
* chore: updated dependencies ([d476145](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/d476145))
* chore: updated dependencies ([4a8b3f1](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/4a8b3f1))
* chore: updated shelljs ([9a24e52](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/9a24e52))

# 0.2.1 (2017-12-19)

* fix(test): fixes #10 update test config before build during test ([3f25ba5](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/3f25ba5)), closes [#10](https://gitlab.devtools.intel.com/ccsd/skeleton/issues/10)

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

* feat(app): ability to configure the drive on the web server ([dd92bb9](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/dd92bb9))
* feat(app): link shared/log to root of app directory ([362d5b7](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/362d5b7))
* feat(app): ps credentials can be supplied via credentials.xml file ([b62e45e](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/b62e45e))
* feat(app): removed isEnvironmentDefined check and check if local instead ([e4ccc47](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/e4ccc47))
* feat(app): symlink shared log directory to root of current (aka release revision) directory ([bbf2730](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/bbf2730))
* fix(app): app online, offline, recycle should not execute in local ([b797f6a](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/b797f6a))
* fix(app): app:rollback correctly uses -r argument to rollback to specific revision ([31eaf60](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/31eaf60))
* fix(app): tasks will powershell now fail properly ([5ac1d20](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/5ac1d20))
* chore(app): removed dependency on merge-stream ([54347bf](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/54347bf))

## deploy

* feat(deploy): added task to list all deployed environment's latest release ([79f4097](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/79f4097))
* feat(deploy): deploy:notify:nr removed isEnvironmentDefined check ([8f6b3d1](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/8f6b3d1))
* feat(deploy): deploy:status if -e is not defined, then all defined environments are shown ([581cef7](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/581cef7))
* feat(deploy): deploy:status uses 8 characters for environment name ([1054856](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/1054856))

## notify

* feat(notify): added reply to email address to prevent reply alls ([4862368](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/4862368))

## test

* fix(test): made changes to how options are passed when running unit tests ([70c75f5](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/70c75f5))

## env

* feat(env): added -l label command line argument ([e22c97e](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/e22c97e))
* feat(env): added ability to check any environment ([36f4269](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/36f4269))
* feat(env): generate env:<env> gulp task for each environment defined in appSettings ([ce518b3](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/ce518b3))
* feat(env): process.env.label is defined from command line (-l), ci env variable, or revision ([8d851b4](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/8d851b4))
* feat(env): set the Test src directory ([8d87866](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/8d87866))
* fix(env): fixed check if env defined on command line ([efe246d](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/efe246d))

## files

* feat(files): added ability to set root and logger levels BREAKING CHANGE: restructured log4net setti ([ef47ac8](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/ef47ac8))
* feat(files): exposing methods to configure settings ([77e51f0](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/77e51f0))

## config

* feat(config): sql server connection string with username and password; teradata connection strings ([2a405b6](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/2a405b6))

## smtp

* feat(smtp): inline css when sending html email ([c3f637e](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/c3f637e))
* feat(smtp): SMTP is publicly available to send mail messages ([1d73184](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/1d73184))
* feat(smtp): using pug as templating engine ([da6cd36](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/da6cd36))
* fix(smtp): improved check if no roles to notify ([76150e7](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/76150e7))

## sql

* feat(sql): removed isEnvironmentDefined checks to allow use in local env ([0021f82](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/0021f82))
* feat(sql): sql:restore to local environment ([8508b0d](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/8508b0d))

## svn

* feat(svn): added isTrunk check; exposed source control objects ([ed1ac52](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/ed1ac52))

## ps

* fix(ps): removed unneeded spaces ([8d9725e](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/8d9725e))

## docs

* docs: added documentation for build and test tasks ([872d0ab](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/872d0ab))
* docs: configuration ([48a3fb2](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/48a3fb2))
* docs: configuration and sql tasks ([369fff2](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/369fff2))
* docs: deploy:notify tasks ([3dfb2e1](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/3dfb2e1))
* docs: env:* tasks ([2babd87](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/2babd87))
* docs: fixed links to anchors with periods ([e6366ed](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/e6366ed))
* docs: general improvements ([d86ff1b](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/d86ff1b))
* docs: improved README ([a6b4348](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/a6b4348))
* docs: local, config, restore tasks and other improvements ([f374fa8](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/f374fa8))

## miscellaneous

* feat: new process.env.source variable set to local|ci ([97a30f6](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/97a30f6))
* chore: code cleanup ([dbd89c4](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/dbd89c4))
* chore: update packages ([6099d5b](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/6099d5b))
* chore: update packages ([60ddb56](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/60ddb56))
* chore: update packages ([832c9d4](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/832c9d4))
* chore: update packages ([19da1c7](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/19da1c7))
* chore: update packages ([43faf9e](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/43faf9e))
* chore: update packages ([63983e2](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/63983e2))
* fix: adding gulp.test.js ([c277b80](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/c277b80))
* fix: updated dependencies ([749cf3c](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/749cf3c))
* added a placeholder changelog ([6d463a7](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/6d463a7))
* added documentation in the README about the app:* tasks ([21376c3](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/21376c3))
* added task to notify via email when a database is restored ([3f547e1](https://gitlab.devtools.intel.com/ccsd/skeleton/commit/3f547e1))

# 0.1.0 (2017-09-27)

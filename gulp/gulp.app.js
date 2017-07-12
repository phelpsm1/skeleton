'use strict';

const gulp = require('gulp');
const shell = require('node-powershell');
const util = require('gulp-util');

const config = require('../config.json');
const env = require('./env.js');

const scriptfile = './gulp/jarvis.ps1';

const psconfig = {
  debugMsg: false,
  executionPolicy: 'Bypass',
  noProfile: true
};

const web = config[env.getName()].web;

const pscmdconfig = [
  {name: 'TRANS'},
  {env: env.getName()},
  {servers: web.servers},
  {apppool: web.apppool},
  {site: web.site}
];

gulp.task('app:down', function() {
  const help = `, e.g. gulp app:down -e dev`;

  if (!env.isEnvironmentDefined()) {
    util.log(util.colors.red('Environment not specified', help));
    return;
  }

  let ps = new shell(psconfig);

  ps.addCommand(`${scriptfile} Bring-Down`, pscmdconfig);

  return ps
    .invoke()
    .then(output => {
      util.log(`${output}`);
      ps.dispose();
    })
    .catch(err => {
      util.log(util.colors.red(`Unexpected exception occurred:`));
      util.log(util.colors.red(err));
      ps.dispose();
    });
});

gulp.task('app:up', function() {
  const help = `, e.g. gulp app:up -e dev`;

  if (!env.isEnvironmentDefined()) {
    util.log(util.colors.red(`Environment not specified`, help));
    return;
  }

  let ps = new shell(psconfig);

  ps.addCommand(`${scriptfile} Bring-Up`, pscmdconfig);

  return ps
    .invoke()
    .then(output => {
      util.log(`${output}`);
      ps.dispose();
    })
    .catch(err => {
      util.log(util.colors.red(`Unexpected exception occurred:`));
      util.log(util.colors.red(err));
      ps.dispose();
    });
});

// take the site offline without taking the pool down
// gulp.task('app:offline', function () {
//   var deferred = Q.defer();
//
//   common.checkEnvironment('app:offline');
//
//   shelljs.exec('jarvis.cmd take '+process.env.target+' offline');
//   deferred.resolve();
//
//   return deferred.promise;
// });

// bring the site back online
// gulp.task('app:online', function () {
//   var deferred = Q.defer();
//
//   shelljs.exec('jarvis.cmd take '+process.env.target+' online');
//   deferred.resolve();
//
//   return deferred.promise;
// });

// recycle the app pool for the given environment
// gulp.task('app:recycle', function () {
//   var deferred = Q.defer();
//
//   shelljs.exec('jarvis.cmd recycle '+process.env.target);
//   deferred.resolve();
//
//   return deferred.promise;
// });

// output the app pool status for the given environment
// gulp.task('app:status', function() {
//   var deferred = Q.defer();
//
//   shelljs.exec('jarvis.cmd get '+process.env.target+' status');
//   deferred.resolve();
//
//   return deferred.promise;
// });

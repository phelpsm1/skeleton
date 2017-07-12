'use strict';

const gulp = require('gulp');
const shell = require('node-powershell');
const util = require('gulp-util');

const config = require('../config.json');
const env = require('./env.js');

gulp.task('app:down', function() {
  const help = `, e.g. gulp app:down -e dev`;

  if (!env.isEnvironmentDefined()) {
    util.log(util.colors.red('Environment not specified', help));
    return;
  }

  return execute('Bring-Down');
});

gulp.task('app:up', function() {
  const help = `, e.g. gulp app:up -e dev`;

  if (!env.isEnvironmentDefined()) {
    util.log(util.colors.red(`Environment not specified`, help));
    return;
  }

  execute('Bring-Up');
});

gulp.task('app:offline', function () {
  const help = `, e.g. gulp app:offline -e dev`;

  if (!env.isEnvironmentDefined()) {
    util.log(util.colors.red(`Environment not specified`, help));
    return;
  }

  return execute('Take-Offline');
});

gulp.task('app:online', function () {
  const help = `, e.g. gulp app:online -e dev`;

  if (!env.isEnvironmentDefined()) {
    util.log(util.colors.red(`Environment not specified`, help));
    return;
  }

  return execute('Take-Online');
});

function execute(command) {
  const web = config[env.getName()].web;
  const name = 'TRANS';

  // todo: (jmorris2) need better way to config these values
  const pscmdconfig = [
    {name: name},
    {env: env.getName()},
    {servers: web.servers},
    {apppool: web.apppool},
    {site: web.site},
    {app_offline_dest: `capital$\\${name}\\${env.getName()}\\current\\Web`}
  ];

  let ps = new shell({
    debugMsg: false,
    executionPolicy: 'Bypass',
    noProfile: true
  });

  ps.addCommand(`./gulp/jarvis.ps1 ${command}`, pscmdconfig);

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
}

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

"use strict";

const argv = require('minimist')(process.argv.slice(2));
const config = require('./config.json');
const env = require('./gulp/env.js');
// var common = require('./scripts/gulp/common.js');
const gulp = require('gulp');
const runSequence = require('run-sequence');
const util = require('gulp-util');
// var wrench = require('wrench');

env.parse(argv, config);

// process.env.force = argv.f ? true : false;
// process.env.revision = common.getSvnRevision();

// require all the javascript files in the gulp directory
// wrench.readdirSyncRecursive('./scripts/gulp')
//   .filter(function(file) {
//     return (/\.js$/i).test(file);
//   })
//   .map(function(file) {
//     require('./scripts/gulp/'+file);
//   });
require('./gulp/gulp.db.js');
require('./gulp/gulp.build.js');

gulp.task('deploy', [], function() {
// gulp.task('deploy', ['publish'], function() {
  if (!env.isEnvironmentDefined()) {
    util.log(util.colors.red('Environment not specified, e.g. gulp deploy -e dev'));
    return;
  }

  util.log(util.colors.green('Deploying to ' + process.env.targets));

//   runSequence(
//               'app:offline',
//               'jobs:stop',
//               'db:backup',
//               'app:copy',
//               'app:recycle',
//               'jobs:start'
//);
});

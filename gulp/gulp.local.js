'use strict';

const child_process = require('child_process');
const gulp = require('gulp');
const sequence = require('run-sequence');
const util = require('gulp-util');

const config = require('../config.json');
const iisexpress = require('./iisexpress.js');

gulp.task('start', function () {
  const help = ', e.g. Intel.Skeleton.Web';

  if (!config || !config.local || !config.local.web || !config.local.web.project) {
    util.log(util.colors.red('Site not specified', help));
    return;
  }

  iisexpress().start(config.local.web.project);
});

gulp.task('stop', function() {
  return iisexpress().stop();
});

gulp.task('restart', function() {
  sequence('stop', 'start');
});

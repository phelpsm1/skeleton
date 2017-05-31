'use strict';

const gulp = require('gulp');
const path = require('path');
const nunit = require('gulp-nunit-runner');

gulp.task('run-tests', ['publish'], function() {
  let tests = path.join(process.cwd(), 'Tests', 'bin', 'Release', 'Intel.Trans.Tests.dll'); // TODO: needs to be generic
  let nunitexe = path.join(process.cwd(), 'packages', 'NUnit.Console.3.0.1', 'tools', 'nunit3-console.exe'); // TODO: needs to be generic

  return gulp.src(tests, {read: false})
    .pipe(nunit({
      executable: nunitexe,
      cleanup:true,
      nodots: false,
      nologo: true,
      noresult: false,
      stoponerror: true,
      trace: 'Error',
      verbose: false
    }));
});

gulp.task('build', ['run-tests']);

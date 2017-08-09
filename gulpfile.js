'use strict'

const argv = require('minimist')(process.argv.slice(2))
const gulp = require('gulp')
const MergeStream = require('merge-stream')
const sequence = require('run-sequence')
const util = require('gulp-util')
const path = require('path')
// const wrench = require('wrench')

const env = require('./gulp/env.js')
const files = require('./gulp/files.js')

// TODO: (jmorris2) Can I combine these two files into one, package.json?
const config = require('./config.json')
const pkg = require('./package.json')

env.parse(argv, config)

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
require('./gulp/gulp.db.js')
require('./gulp/gulp.build.js')
require('./gulp/gulp.app.js')
require('./gulp/gulp.local.js')

gulp.task('copy', () => {
  let mergestream = MergeStream()

  let configuration = config[process.env.targets.split(' ')[0]]
  let web = configuration.web
  let revision = process.env.revision

  let src = path.join(process.cwd(), 'Web')

  for (let i = 0; i < web.servers.length; i++) {
    let dest = path.join(`//${web.servers[i]}`, web.path, 'releases', revision, 'Web')

    mergestream.add(
      gulp.src(path.join(src, '**/*'))
        .pipe(files.transform(files.updateWebConfig, configuration, dest, pkg))
        .pipe(files.transform(files.log, configuration, dest))
        .pipe(gulp.dest(dest, {overwrite: true})))
  }

  return mergestream
})

gulp.task('deploy', [], () => {
  if (!env.isEnvironmentDefined()) {
    util.log(util.colors.red('Environment not specified, e.g. gulp deploy -e dev'))
    return
  }

  util.log(util.colors.green('Deploying to ' + process.env.targets))

  sequence(
    'app:offline',
    // 'jobs:stop',
    // 'db:backup',
    'copy',
    'app:link',
    'app:recycle'
    // 'jobs:start'
  )
})

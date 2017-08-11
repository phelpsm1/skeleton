'use strict'

// just used for testing

const env = require('./index.js').Env

const pkg = require('./package.json')

env.parse(process.argv, pkg)

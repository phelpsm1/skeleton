const chai = require('chai')
const chai_arrays = require('chai-arrays')

chai.use(chai_arrays)

process.env.NODE_ENV = 'test'

const github = require('./github')
const path = require("path");
const rc = require("rc");

describe('github', function () {
  let git

  beforeEach(function () {
    const repository = {
      type: 'git',
      url: 'https://github.com/jsmorris2/skeleton.git'
    }

    git = github(repository, false)
  })

  describe('name', function () {
    it('should be github', function () {
      git.name.should.equal('github')
    })
  })

  describe('isBranch', function () {
    it('should not be on branch', function () {
      git.isBranch(/(foobar-v[\d.]*)/g).should.be.false
    })

    it('should be on branch', function () {
      git.isBranch(/develop/g).should.be.true
    })
  })

  describe('revision', function () {
    describe('get', function () {
      it('should return the short sha of the most recent revision', function () {
        git.revision.get().should.match(/\b[0-9a-f]{7,40}\b/)
      })
    })
  })

  describe('commits', function () {
    describe('fetch', function () {
      describe('start', function () {
        const cases = [{
          name: 'is undefined',
          sha: undefined,
          expected: 'Start sha missing'
        }, {
          name: 'is null',
          sha: null,
          expected: 'Start sha missing'
        }, {
          name: 'is empty',
          sha: '',
          expected: 'Start sha missing'
        }]

        cases.forEach(function ({ name, sha, expected }) {
          it(`should throw error if start sha ${name}`, function () {
            (() => git.commits.fetch(sha, 'HEAD', { token: 'token' })).should.throw(expected)
          })
        })
      })

      describe('end', function () {
        const cases = [{
          name: 'is empty',
          sha: '',
          expected: 'End sha missing'
        }]

        cases.forEach(function ({ name, sha, expected }) {
          it(`should throw error if end sha ${name}`, function () {
            (() => git.commits.fetch('34532ab', sha, { token: 'token' })).should.not.throw
          })
        })
      })

      describe('manual tests', function () {
        it('should return a list of commits', function () {
          const options = {
            token: require('rc')('skeleton').github.token,
            repository: {
              type: 'git',
              url: 'https://github.com/jsmorris2/skeleton.git'
            },
            checkForLocalRepo: true
          }
          const start = '0c6d12ae413661bf23452614458e993e539b8f40'
          const end = 'ad8ff75a28b1e2b8c5e338af58cc6ef0043b8c14'

          return git.commits.fetch(start, end, options)
            .then((commits) => {
              commits.should.be.an.array().and.to.not.be.empty
              console.log(commits[0])
            })
        })
      })
    })
  })
})

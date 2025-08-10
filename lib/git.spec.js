require('chai')

process.env.NODE_ENV = 'test'

const git = require('./git')

describe('git', function () {
  describe('ctor', function () {
    const cases = [{
      name: 'is null',
      repository: null,
      expected: 'Missing repository url'
    }, {
      name: 'is undefined',
      repository: undefined,
      expected: 'Missing repository url'
    }, {
      name: 'is missing url',
      repository: {},
      expected: 'Missing repository url'
    }, {
      name: 'has null url',
      repository: {
        url: null
      },
      expected: 'Missing repository url'
    }, {
      name: 'has undefined url',
      repository: {
        url: undefined
      },
      expected: 'Missing repository url'
    }, {
      name: 'has empty url',
      repository: {
        url: ''
      },
      expected: 'Missing repository url'
    }, {
      name: 'has unknown git url',
      repository: {
        url: 'https://unknown.git.server.com/jsmorris2/skeleton.git'
      },
      expected: 'Unknown repository provider'
    }]

    cases.forEach(function ({ name, repository, checkForLocalGit, expected }) {
      it(`should error if repository ${name}`, function () {
        (() => git(repository)).should.throw(expected)
      })
    })

    it('should use github git', function () {
      const repository = {
        type: 'git',
        url: 'https://github.com/jsmorris2/skeleton.git'
      }

      git(repository).name.should.equal('github')
    })

    it('should use gitlab git', function () {
      const repository = {
        type: 'git',
        url: 'https://gitlab.devtools.intel.com/ccsd/skeleton.git'
      }

      git(repository).name.should.equal('gitlab')
    })
  })
})

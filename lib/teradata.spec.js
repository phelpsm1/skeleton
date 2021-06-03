process.env.NODE_ENV = 'test'

const chai = require('chai')

chai.should()

const teradata = require('./teradata')

describe('teradata', function () {
  describe('buildConnectionString', function () {
    let db

    beforeEach(function () {
      db = {
        server: 'server1',
        database: 'database',
        user: 'admin',
        password: 'foobar'
      }
    })

    it('should build the connection string', function () {
      const s = teradata.buildConnectionString(db)

      s.should.be.a('string').and.equal('Driver={Teradata};DBCName=database;Server=server1;Uid=admin;Pwd=foobar')
    })

    it('should throw error if user is missing', function () {
      delete db.user;
      (() => teradata.buildConnectionString(db)).should.throw()
    })

    it('should throw error if password is missing', function () {
      delete db.password;
      (() => teradata.buildConnectionString(db)).should.throw()
    })

    it('should throw error if server is missing', function () {
      delete db.server;
      (() => teradata.buildConnectionString(db)).should.throw()
    })

    it('should throw error if database is missing', function () {
      delete db.database;
      (() => teradata.buildConnectionString(db)).should.throw()
    })
  })
})

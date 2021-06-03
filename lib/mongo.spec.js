process.env.NODE_ENV = 'test'

const chai = require('chai')

chai.should()

const mongo = require('./mongo')

describe('mongo', function () {
  describe('buildConnectionString', function () {
    let db

    beforeEach(function () {
      db = {
        name: 'Intel.mongo',
        servers: [
          'server1',
          'server2',
          'server3'
        ],
        port: 1234,
        database: 'database',
        replicaSet: 'rs1234',
        user: 'admin',
        password: 'foobar'
      }
    })

    it('should build the connection string', function () {
      const s = mongo.buildConnectionString(db)

      s.should.be.a('string').and.equal('mongodb://admin:foobar@server1:1234,server2:1234,server3:1234/database?ssl=true&replicaSet=rs1234')
    })

    it('should build the connection string with ssl set', function () {
      db.ssl = false
      mongo.buildConnectionString(db)
        .should.be.a('string').and.equal('mongodb://admin:foobar@server1:1234,server2:1234,server3:1234/database?ssl=false&replicaSet=rs1234')

      db.ssl = true
      mongo.buildConnectionString(db)
        .should.be.a('string').and.equal('mongodb://admin:foobar@server1:1234,server2:1234,server3:1234/database?ssl=true&replicaSet=rs1234')
    })

    it('should throw error if user is missing', function () {
      delete db.user;
      (() => mongo.buildConnectionString(db)).should.throw()
    })

    it('should throw error if password is missing', function () {
      delete db.password;
      (() => mongo.buildConnectionString(db)).should.throw()
    })

    it('should throw error if servers is missing or empty', function () {
      delete db.servers;
      (() => mongo.buildConnectionString(db)).should.throw()

      db.servers = [];
      (() => mongo.buildConnectionString(db)).should.throw()
    })

    it('should throw error if database is missing', function () {
      delete db.database;
      (() => mongo.buildConnectionString(db)).should.throw()
    })

    it('should throw error if replicaSet is missing', function () {
      delete db.replicaSet;
      (() => mongo.buildConnectionString(db)).should.throw()
    })
  })
})

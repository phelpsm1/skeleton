process.env.NODE_ENV = 'test'

const chai = require('chai')

chai.should()

const data = require('./data')

describe('data', function () {
  describe('buildConnectionString', function () {
    let db

    beforeEach(function () {
      db = {
        server: 'server1',
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

    it('should build the connection string for ms sql', function () {
      const s = data.buildConnectionString(db)

      s.should.be.a('string').and.equal('server=server1,1234;database=database;user id=admin;password=foobar')
    })

    it('should build the connection string for teradata', function () {
      db.type = 'TeRaDaTa'

      const s = data.buildConnectionString(db)

      s.should.be.a('string').and.equal('Driver={Teradata};DBCName=database;Server=server1;Uid=admin;Pwd=foobar')
    })

    it('should build the connection string for mongo', function () {
      db.type = 'MONGO'

      const s = data.buildConnectionString(db)

      s.should.be.a('string').and.equal('mongodb://admin:foobar@server1:1234,server2:1234,server3:1234/database?ssl=true&replicaSet=rs1234')
    })
  })
})

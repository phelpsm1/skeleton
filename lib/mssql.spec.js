process.env.NODE_ENV = 'test'

const chai = require('chai')

chai.should()

const mssql = require('./mssql')

describe('ms sql', function () {
  describe('buildConnectionString', function () {
    let db

    beforeEach(function () {
      db = {
        server: 'server1',
        database: 'database'
      }
    })

    it('should build the connection string', function () {
      const s = mssql.buildConnectionString(db)

      s.should.be.a('string').and.equal('server=server1;database=database;integrated security=SSPI')
    })

    it('should build the connection string with username and password', function () {
      const user = 'admin'
      const password = 'foobar'

      db.user = user
      db.password = password

      const s = mssql.buildConnectionString(db)

      s.should.be.a('string').and.equal(`server=server1;database=database;user id=${user};password=${password}`)
    })

    it('should throw error if database is missing', function () {
      delete db.database;
      (() => mssql.buildConnectionString(db)).should.throw()
    })

    it('should build a connection string with secure parameters set', function () {
      db.secure = true

      const s = mssql.buildConnectionString(db)

      s.should.be.a('string').and.equal('server=server1;database=database;integrated security=SSPI;encrypt=true;trustServerCertificate=true')
    })

    it('should throw error if server is missing', function () {
      delete db.server;
      (() => mssql.buildConnectionString(db)).should.throw()
    })

    it('should build a connection string with server, instance, and port', function () {
      const instance = 'inst1'

      db.instance = instance

      let s = mssql.buildConnectionString(db)

      s.should.be.a('string').and.equal(`server=server1\\${instance};database=database;integrated security=SSPI`)

      const port = 1234

      db.port = port

      s = mssql.buildConnectionString(db)

      s.should.be.a('string').and.equal(`server=server1\\${instance},${port};database=database;integrated security=SSPI`)

      delete db.instance

      s = mssql.buildConnectionString(db)

      s.should.be.a('string').and.equal(`server=server1,${port};database=database;integrated security=SSPI`)
    })
  })
})

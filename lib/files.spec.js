const chai = require('chai')
const xml2js = require('xml2js')

process.env.NODE_ENV = 'test'

const should = chai.should()

const files = require('./files')

describe('files', function () {
  describe('cfg', function () {
    describe('setThrottleSettings', function () {
      let jsonWebConfig

      beforeEach(function () {
        const xml = `
          <?xml version="1.0" encoding="utf-8"?>
          <configuration>
            <configSections>
              <section name="throttlePolicy" type="WebApiThrottle.ThrottlePolicyConfiguration,WebApiThrottle" />
            </configSections>
            <throttlePolicy limitPerSecond="1"
                            limitPerMinute="20"
                            limitPerHour="300"
                            limitPerDay="1500"
                            limitPerWeek="10500"
                            ipThrottling="false"
                            clientThrottling="true"
                            endpointThrottling="false">
              <rules>
                <add policyType="2" entry="sys_srcidp:/api/v2/tools" limitPerDay="50" />
                <add policyType="2" entry="sys_fpaarc:/api/v4/porneeds" limitPerMinute="1" limitPerDay="175" />
                <add policyType="2" entry="sys_FCAP_EMS:/api/v3/porneeds" limitPerMinute="1" limitPerDay="175" />
              </rules>
            </throttlePolicy>
          </configuration>`

        xml2js.parseString(xml, (err, res) => {
          if (err) {
            throw err
          }

          jsonWebConfig = res
        })
      })

      it('should do nothing when there is no configuration to change', function () {
        const pkg = {}

        files.cfg.setThrottleSettings(jsonWebConfig, pkg)

        jsonWebConfig.configuration.throttlePolicy[0].$.clientThrottling.should.be.a('string').and.equal('true')
      })

      it('should do nothing when there is no Throttle Policy configuration to change', function () {
        const pkg = {
          config: {}
        }

        files.cfg.setThrottleSettings(jsonWebConfig, pkg)

        jsonWebConfig.configuration.throttlePolicy[0].$.clientThrottling.should.be.a('string').and.equal('true')
      })

      it('should set the Throttle Policy Client Throttling', function () {
        const pkg = {
          config: {
            throttlePolicy: {
              clientThrottling: 'false'
            }
          }
        }

        files.cfg.setThrottleSettings(jsonWebConfig, pkg)

        jsonWebConfig.configuration.throttlePolicy[0].$.clientThrottling.should.be.a('string').and.equal('false')
      })

      it('should set the Throttle Policy IP and Endpoint Throttling', function () {
        const pkg = {
          config: {
            throttlePolicy: {
              ipThrottling: 'true',
              endpointThrottling: 'true'
            }
          }
        }

        files.cfg.setThrottleSettings(jsonWebConfig, pkg)

        jsonWebConfig.configuration.throttlePolicy[0].$.ipThrottling.should.be.a('string').and.equal('true')
        jsonWebConfig.configuration.throttlePolicy[0].$.endpointThrottling.should.be.a('string').and.equal('true')
      })

      it('should do nothing since there is no Throttle Policy section', function () {
        delete jsonWebConfig.configuration.throttlePolicy

        const pkg = {
          config: {
            throttlePolicy: {
              ipThrottling: 'true'
            }
          }
        }

        files.cfg.setThrottleSettings(jsonWebConfig, pkg)

        should.not.exist(jsonWebConfig.configuration.throttlePolicy)
      })

      it('should set by adding the attribute to the Throttle Policy section', function () {
        jsonWebConfig.configuration.throttlePolicy = ['']

        const pkg = {
          config: {
            throttlePolicy: {
              ipThrottling: 'true'
            }
          }
        }

        files.cfg.setThrottleSettings(jsonWebConfig, pkg)

        jsonWebConfig.configuration.throttlePolicy[0].$.ipThrottling.should.be.a('string').and.equal('true')
      })
    })
  })
})

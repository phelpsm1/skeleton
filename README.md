# Welcome to the Skeleton

This is the skeleton to build, test, and deploy a project within TMG SP S

## Usage


```javascript
const env = require('skeleton').Env
const files = require('skeleton').Files
const mssql = require('skeleton').Mssql

const pkg = require('./package.json')

env.parse(argv, pkg)
```


## Documentation

### Env

#### Env.parse

#### Env.getEnvironmentConfig

### Files

#### Files.transform

#### Files.updateWebConfig

#### Files.log

### Mssql

#### Mssql.run
# Skywire Magento 2 Cypress Test Suite

## Installation

```
npm install -save https://github.com/Skywire/m2-cypress-suite.git#master
```

Test files will be installed to `dev/tests/cypress`

A `cypress.json` file will be created in your project root

You should configure cypress and then commit all generated files.

## Configuration

Set the `baseUrl` in `cypress.json`

* baseUrl: The full URL to your Magento instance e.g `https://docker.magento24.com`

## Usage

### For interactive test runner

`./node_modules/.bin/cypress open`

### For automated test runner

`./node_modules/.bin/cypress run`

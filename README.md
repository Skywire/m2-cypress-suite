# Skywire Magento 2 Cypress Test Suite

## Installation

```
git clone git@github.com:Skywire/m2-cypress-suite.git
npm install
```

## Configuration

`cp cypress.json.dist cypress.json`

Add the `baseUrl` and `magePath` values to `cypress.json`

* baseUrl: The full URL to your Magento instance e.g `https://docker.magento24.com`
* magePath: The absolute path to your Magento instance e.g. `/home/user/sites/magento24`

The test runner uses `n98-magerun` to configure application state, so please ensure it is installed globally 

## Usage

### For interactive test runner

`npm run open`

### For automated test runner

`npm run test`

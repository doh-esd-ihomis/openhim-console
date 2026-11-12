'use strict'

// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

const fs = require('fs')
const path = require('path')

// Find the built bundle files dynamically
function getDistFiles() {
  const distPath = path.resolve(__dirname, 'dist')
  if (!fs.existsSync(distPath)) {
    return []
  }

  const files = fs.readdirSync(distPath)
  return files
    .filter(f => f.endsWith('.js') && !f.endsWith('.map'))
    .map(f => `dist/${f}`)
}

module.exports = function (config) {
  const distFiles = getDistFiles()

  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['mocha', 'sinon-chai'],

    // list of files / patterns to load in the browser
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/moment/moment.js',
      ...distFiles,
      { pattern: 'dist/*.map', included: false, watched: false },
      'dist/index.html',
      { pattern: 'dist/fonts/*', watched: false, included: false, served: true, nocache: false },
      'test/spec/controllers/*.js',
      'test/spec/services/*.js'
    ],
    proxies: {
      '/fonts/': 'http://localhost:8090/base/dist/fonts/'
    },
    reporters: ['mocha'],

    // list of files / patterns to exclude
    exclude: [],

    captureTimeout: 300000,
    browserDisconnectTolerance: 3,
    browserDisconnectTimeout : 300000,
    browserNoActivityTimeout : 300000,

    // web server port
    port: 8090,
    mochaReporter: {
      showDiff: true,
      output: 'autowatch'
    },

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['ChromeHeadless']
  })
}

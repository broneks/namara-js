'use strict';

const webpackConfig = require('../../webpack.conf');

module.exports = function(config) {
  config.set({
    basePath: '../../',
    frameworks: ['jasmine'],
    files: [
      'spec/**/*.spec.js'
    ],
    preprocessors: {
      'spec/**/*.spec.js': ['webpack']
    },
    webpack: {
      module: webpackConfig.module
    },
    webpackMiddleware: {
      noInfo: true
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['Chrome'],
    singleRun: true,
    concurrency: Infinity
  })
}

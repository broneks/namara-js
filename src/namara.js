'use strict';

const env = (typeof process === 'object' && Object.prototype.toString.call(process) === '[object process]')
  ? 'server'
  : 'browser';

const xhr = require('./xhr-' + env);
const encode = require('./encode');

class Namara {
  constructor (apiKey = (env === 'server' ? process.env.NAMARA_APIKEY : null), debug = false, apiVersion = 'v0', host = 'api.namara.io') {
    if (!apiKey || typeof apiKey !== 'string') throw Error('a namara.io API key is required.');

    this.apiKey = apiKey;
    this.debug = debug;
    this.host = host;
    this.apiVersion = apiVersion;

    this.headers = {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey
    };
  }

  get (dataset, version, options = {}, callback) {
    if ((!dataset || typeof dataset !== 'string') ||
        (!version || typeof version !== 'string')) throw Error('data set ID and version are required.');

    let useCallback = false;

    if (options && typeof options === 'function') {
      callback = options;
      options = {};
    }

    if (callback && typeof callback === 'function') useCallback = true;

    return xhr.call(this, dataset, version, options, useCallback, callback);
  }

  getPath (dataset, version, options = {}) {
    const encodedOptions = encode(options);
    const aggregationPath = Namara.isAggregation(options) ? '/aggregation' : '';

    return `${this.getBasePath(dataset, version)}${aggregationPath}?api_key=${this.apiKey}&${encodedOptions}`;
  }

  getBasePath (dataset, version) {
    return `/${this.apiVersion}/data_sets/${dataset}/data/${version}`;
  }
}

Namara.isAggregation = (options = {}) => {
  const keys = Object.keys(options);

  return keys.length > 0 && keys.indexOf('operation') >= 0;
}

module.exports = Namara;

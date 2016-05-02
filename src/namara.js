'use strict';

const Promise = require('es6-promise').Promise;

const env = (typeof process === 'object' && Object.prototype.toString.call(process) === '[object process]')
  ? 'server'
  : 'browser';

let https;
try {
  https = require('https');
} catch (err) {}

const xhr = {
  browser (dataset, version, options, useCallback, callback) {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      const url = `https://${this.host}${this.getPath(dataset, version, options)}`;

      if (this.debug) console.log(`REQUEST: ${url}\n`);

      request.open('GET', url, true);

      request.onload = () => {
        const data = JSON.parse(request.responseText);

        if (this.debug) {
          console.log(`STATUS: ${request.status}\n`);
          console.log(`HEADERS: ${request.getAllResponseHeaders()}\n`);
        }

        if (this.debug) console.log(`BODY: ${request.responseText}\n`);

        if (request.status >= 200 && request.status < 400) {
          if (useCallback) return callback(null, data);
          return resolve(data);
        } else {
          if (this.debug) console.log(`NAMARA ERROR: ${request.responseText}\n`);

          if (useCallback) return callback(data);
          return reject(data);
        }
      };

      request.onerror = () => {
        console.log(request);
        const err = JSON.parse(request.responseText);

        if (this.debug) console.log(`ERROR: ${request.responseText}\n`);

        if (useCallback) return callback(err);
        return reject(err);
      };

      for (let header in this.headers) {
        request.setRequestHeader(header, this.headers[header]);
      }
      request.send();
    });
  },

  server (dataset, version, options, useCallback, callback) {
    return new Promise((resolve, reject) => {
      const reqOptions = {
        headers: this.headers,
        hostname: this.host,
        path: this.getPath(dataset, version, options)
      };

      if (this.debug) console.log(`REQUEST: https://${reqOptions.hostname}${reqOptions.path}\n`);

      https.get(reqOptions, (res) => {
        let data = '';

        if (this.debug) {
          console.log(`STATUS: ${res.statusCode}\n`);
          console.log(`HEADERS: ${JSON.stringify(res.headers)}\n`);
        }

        res.setEncoding('utf8');

        res.on('data', (chunk) => {
          if (this.debug) console.log(`BODY: ${chunk}\n`);

          return data += chunk;
        });

        res.on('end', () => {
          const json = JSON.parse(data);

          if (res.statusCode !== 200) {
            if (this.debug) console.log(`NAMARA ERROR: ${data}\n`);

            if (useCallback) return callback(json);
            return reject(json);
          }

          if (useCallback) return callback(null, json);
          return resolve(json);
        });
      }).on('error', (err) => {
        if (this.debug) console.log(`ERROR: ${err.message}\n`);

        if (useCallback) return callback(err);
        return reject(err);
      });
    });
  }
};

const encode = (options = {}) => {
  let encoded = [];

  for (let key in options) {
    const option = `${encodeURIComponent(key)}=${encodeURIComponent(options[key])}`;
    encoded.push(option);
  }

  return encoded.join('&');
};

class Namara {
  constructor (apiKey, debug = false, apiVersion = 'v0', host = 'api.namara.io') {
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

    return xhr[env].call(this, dataset, version, options, useCallback, callback);
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

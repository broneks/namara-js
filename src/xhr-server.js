'use strict';

const https = require('https');

module.exports = function (dataset, version, options, useCallback, callback) {
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
};

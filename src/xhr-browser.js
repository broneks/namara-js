'use strict';

const Promise = require('es6-promise').Promise;

module.exports = function (dataset, version, options, useCallback, callback) {
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
};

'use strict';

module.exports = function (options = {}) {
  let encoded = [];

  for (let key in options) {
    const option = `${encodeURIComponent(key)}=${encodeURIComponent(options[key])}`;
    encoded.push(option);
  }

  return encoded.join('&');
};

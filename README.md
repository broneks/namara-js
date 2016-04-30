Namara
======

The official Javascript client for the Namara Open Data service. [namara.io](https://namara.io)

## Installation

```bash
// coming soon...
// npm install --save namara
```
```bash
bower install --save namara
```

## Support

This package works on both the client side (all modern browsers and IE 9+) as well as on the server side with Node.js. It's exported to CommonJS, AMD and as a property on root.

## Usage

### Instantiation

You need a valid API key in order to access Namara (you can find it in your My Account details on namara.io).

```javascript
var Namara = require('namara'); // in the browser "Namara" will be available globally

var namara = new Namara({YOUR_API_KEY});
```

Setting the API key as a Node.js environment variable "NAMARA_APIKEY" is also supported:

```javascript
var namara = new Namara() // defaults to NAMARA_APIKEY env variable
```

You can also optionally enable debug mode:

```javascript
var namara = new Namara({YOUR_API_KEY}, true);

/* OR */

namara.debug = true;
```

### Getting Data

To make a basic request to the Namara API you can call `get` on your instantiated object and pass it the ID of the data set you want and the version of the data set:

```javascript
// as a Promise
namara.get('5885fce0-92c4-4acb-960f-82ce5a0a4650', 'en-1')
  .then(function (data) {
    console.log(data);
  })
  .catch(function (err) {
    console.log(err);
  });

/* OR */

// with a callback
namara.get('5885fce0-92c4-4acb-960f-82ce5a0a4650', 'en-1', function (err, data) {
  if (err) console.log(err);
  // ...
});
```

Without an options argument passed, this will return data with the Namara default offset (0) and limit (250) applied. To specify options, you can pass an options argument:

```javascript
var options = {
  offset: 0,
  limit: 150
};

// as a Promise
namara.get('5885fce0-92c4-4acb-960f-82ce5a0a4650', 'en-1', options)
  .then(function (data) {
    console.log(data);
  })
  .catch(function (err) {
    console.log(err);
  });

/* OR */

// with a callback
namara.get('5885fce0-92c4-4acb-960f-82ce5a0a4650', 'en-1', options, (err, data) => {
  if (err) console.log(err);
  // ...
});
```


### Options

All [Namara data options](http://namara.io/#/api) are supported.

**Basic options**

```javascript
var options = {
  select: 'town, geometry',
  where: 'town = "TORONTO" AND nearby(geometry, 43.6, -79.4, 10km)',
  offset: 0,
  limit: 20
};
```

**Aggregation options**

Only one aggregation option can be specified in a request. In the case of this example, all options are illustrated, but passing more than one in the options object will cause only the last one to return a result.

```javascript
var options = {
  operation: 'sum(p0)',
  operation: 'avg(p0)',
  operation: 'min(p0)',
  operation: 'max(p0)',
  operation: 'count(*)',
  operation: 'geocluster(p3, 10)',
  operation: 'geobounds(p3)'
};
```

### License

Apache License, Version 2.0

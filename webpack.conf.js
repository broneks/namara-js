'use strict';

const path = require('path');
const webpack = require('webpack');

module.exports = {
  target: 'node',
  entry: {
    main: './src/namara.js'
  },
  output: {
    library: 'Namara',
    libraryTarget: 'umd',
    filename: 'namara.js',
    path: path.join(__dirname, 'dist')
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      },
      compress: {
        warnings: false,
        screw_ie8: true,
        keep_fnames: true
      },
      mangle: {
        keep_fnames: true
      }
    }),
    new webpack.IgnorePlugin(/vertx/)
  ]
};

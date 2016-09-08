/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';
var path = require('path');
var nodeExternals = require('webpack-node-externals');

module.exports = {
  cache: true,
  externals: [nodeExternals()],
  target: "node",
  entry: {
    main: ['babel-polyfill', './src/main.ts']
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    library: "Main",
    libraryTarget: "commonjs"
  },
  module: {
    loaders: [{
      test: /\.ts(x?)$/,
      exclude: /node_modules/,
      loader: 'babel-loader?presets[]=es2015&presets[]=react!ts-loader'
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['es2015', 'react']
      }
    }]
  },
  plugins: [
  ],
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },
};

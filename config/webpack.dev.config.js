'use strict';

const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config.js');

const webpack = require('webpack');

module.exports = merge(baseConfig, {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    new webpack.NamedChunksPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hotOnly: true,
    stats: 'errors-only',
    open: true
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
});
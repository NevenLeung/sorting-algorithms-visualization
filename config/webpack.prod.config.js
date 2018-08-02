'use strict';

const path = require('path');
const merge = require('webpack-merge');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractTextPlugin = require("mini-css-extract-plugin");

const baseConfig = require('./webpack.base.config.js');

module.exports = merge(baseConfig, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: "scripts/[name].[hash:8].js"
  },
  module: {
    rules: [
      {
        test: /.css$/,
        use: [
          MiniCssExtractTextPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin('dist', {
      root: path.join(__dirname, '../'),
    }),
    new MiniCssExtractTextPlugin({
      filename: 'styles/styles.[hash:8].css'
    })
  ],
  devtool: 'source-map',
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
});
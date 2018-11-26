const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    open: true,
    host: '0.0.0.0',
    contentBase: path.join(__dirname, 'dist'),
    hot: true,
    compress: true,
    port: 3000
  }
});

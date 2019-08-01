var path = require('path')
var webpack = require('webpack')
var FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
var htmlTemplate = require('./html-templete-plugin')
var config = require('./config')

var { proxy } = require('../proxy')

module.exports = {
  mode: 'development',
  output: {
    publicPath: ''
  },

  plugins: [
    htmlTemplate.dev,
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsWebpackPlugin(),
  ],
  devtool: "cheap-module-eval-source-map",
  devServer: {
    // contentBase: 'public',
    contentBase: path.resolve(__dirname, 'public'),
    // publicPath: 'public',
    compress: false,
    overlay: {
      warnings: true,
      errors: true
    },
    open: config.open,
    host: '0.0.0.0',
    port: 5001, // open: 'Google Chrome',
    proxy,
  }
}

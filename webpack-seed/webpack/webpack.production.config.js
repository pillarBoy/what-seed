var path = require('path')
var MiniCssExtractPlugin = require("mini-css-extract-plugin")
var ManifestPlugin = require('webpack-manifest-plugin')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')

var htmlTemplate = require('./html-templete-plugin')
var config = require('./config')

var webpackModule = {
  mode: 'production',
  devtool: "cheap-module-source-map",
  optimization: {
    // minimize: true,
    minimizer: [new UglifyJsPlugin({
      test: /\.(js|ts)$/,
      exclude: /\/node_modules/,
      parallel: true,
      uglifyOptions: {
        compress: {
          drop_debugger: true,
          drop_console: true
        }
      }
    })],
  },
  plugins: [
    htmlTemplate.prod,
    new CleanWebpackPlugin(),
    new ManifestPlugin(),
    new MiniCssExtractPlugin({
      filename: `css/[name].[hash${config.hashLength ? ':' + config.hashLength : ''}].css`,
      chunkFilename: "[id].css"
    })
  ],
}


module.exports = webpackModule;
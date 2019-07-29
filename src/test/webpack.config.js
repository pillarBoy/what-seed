var merge = require('webpack-merge')

var baseWebpack = require('./webpack/webpack.base.config.js');
var devWebpack = require('./webpack/webpack.dev.config.js')
var productionWebpack = require('./webpack/webpack.production.config.js')

if (process.env.NODE_ENV === 'dev') {
  module.exports = merge(baseWebpack, devWebpack)
}

if (process.env.NODE_ENV === 'prod') {
  module.exports = merge(baseWebpack, productionWebpack)
}
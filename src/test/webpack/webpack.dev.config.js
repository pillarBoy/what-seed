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
  module: {
    rules: [
      {
        test: /\.(s?css)$/,
        use: [
          { loader: "style-loader" }, // 将 JS 字符串生成为 style 节点)
          { loader: "css-loader", }, // 将 CSS 转化成 CommonJS 模块
          { loader: 'px2rem-loader' , options: { remUni: 75, remPrecision: 8 } }, // px to rem
          { loader: 'postcss-loader', options: { sourceMap: true } },
          { loader: "sass-loader" }, // 将 Sass 编译成 CSS
        ]
      }
    ]
  },
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

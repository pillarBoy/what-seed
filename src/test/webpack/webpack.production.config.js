var path = require('path')
// var copyWepackPlugin = require('copy-webpack-plugin')
var MiniCssExtractPlugin = require("mini-css-extract-plugin")
var ManifestPlugin = require('webpack-manifest-plugin')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')

var htmlTemplate = require('./html-templete-plugin')
var config = require('./config')

var webpackModule = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(s?css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader", }, // 将 CSS 转化成 CommonJS 模块
          { loader: 'px2rem-loader', options: { remUni: 75, remPrecision: 8 } }, // px to rem
          { loader: 'postcss-loader', options: { sourceMap: true } }, // auto perfixe
          { loader: "sass-loader" }, // 将 Sass 编译成 CSS
        ]
      }
    ]
  },
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
    }),
    // new copyWepackPlugin([{
    //   from: path.resolve(__dirname, '../public', '**/*'),
    //   to: path.resolve(__dirname, '../dist'),
    //   // flatten 路径
    //   transformPath(targetPath) {
    //     return targetPath.replace('public', '')
    //   }
    // }], {
    //   ignore: ['*.html', '*.ejs']
    // })
  ],
}


module.exports = webpackModule;
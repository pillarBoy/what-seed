var htmlWebpackPlugin = require('html-webpack-plugin')
var path = require('path')
var config = require('./config')

var template = path.resolve(__dirname, '../public/index.html')

var lang = process.env.NODE_LANG || 'zh';

if (config.i18n || config.use_ejs) {
  template = path.resolve(__dirname, '../public/index.ejs') // './index.ejs', // 使用 ejs 文件是为了解决跟 html-loader 冲突
}


module.exports = {
  dev: new htmlWebpackPlugin({
    // path: "public",
    template: template,
    // filename: `${lang}.html`
  }),
  prod: new htmlWebpackPlugin({
    template: template, // 使用 ejs 文件是为了解决跟 html-loader 冲突
    filename: 'index.html',
    baseLang: `/${lang}/`,
    minify: {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
      // 包含 Google、Baidu、多个== 这些关键词的注释，不删除
      ignoreCustomComments: [/.*(Google).*/, /.*(Baidu).*/, /.*(\=\=+).*/],
      minifyJS: true
    }
  }),
} 
var path = require('path')
var config = require('./config')

if (config.isMobile) {
  if (typeof config.entry === 'string') {
    config.entry = {
      setRem: path.resolve(__dirname, '../../common-utils/htmlFontSize.js'),
      index: this.entry
    }
  }
  if (Object.prototype.toString.call(config.entry) === '[object Object]') {
    config.entry = Object.assign({ setRem: path.resolve(__dirname, '../../common-utils/htmlFontSize.js') }, config.entry);
  }
}

const webpackBase = {
  entry: config.entry || './src/index.js',
  output: config.output || {
    path: path.resolve(__dirname, '../dist'),
    filename: `./js/[name].[hash${config.hashLength ? ':' + config.hashLength : ''}].js`,
    // publicPath: '/public/'
  },
  resolve: {
    alias: {
      '@': path.resolve('src'),
      '%': path.resolve(__dirname, '../../common-utils')
    },
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      // file
      {
        test: /\.(png|jpg|gif|ttf|woff2?|eot|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'imgs',
              limit: 10000,
              filename: `[path][name].[hash${config.hashLength ? ':' + config.hashLength : ''}].[ext]`
            }
          }
        ]
      },
      // font
      {
        test: /\.(ttf|woff2?|eot|svg)$/,
        use: [{ loader: 'file-loader', options: { outputPath: 'font', filename: `[path][name].[hash${config.hashLength ? ':' + config.hashLength : ''}].[ext]` } }]
      },

      // ejs
      {
        test: /\.(ejs|html)$/,
        use: [
          {
            loader: 'underscore-template-loader',
            options: {}
          }
        ],
        exclude: [/node_modules/, /dist/, /webpack/, /src/]
      },
      // html
      {
        test: /\.html/,
        use: [
          {
            loader: 'html-loader'
          }
        ]
      },

      // babel
      {
        test: /\.m?jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: { loader: 'babel-loader', options: { presets: ['@babel/preset-env'] } }
      },
      // typescript
      { test: /\.tsx?$/, loader: "ts-loader" }
    ]
  },
}

// eslint
if (config.eslint) {
  webpackBase.module.rules.push(
    {
      test: /\.(js)$/,
      loader: 'eslint-loader',
      options: {
        formatter: require("eslint-friendly-formatter")
      },
      include: [path.resolve(__dirname, '../src')]
    })
}

// tslint
if (config.tslint) {
  webpackBase.module.rules.push(
    {
      test: /\.(ts)$/,
      loader: 'eslint-loader',
      options: {
        formatter: require("eslint-friendly-formatter")
      },
      include: [path.resolve(__dirname, '../src')]
    })
}

module.exports = webpackBase;

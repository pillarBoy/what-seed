module.exports = {
  entry: {
    index: './src/index.js'
  },
  open: true, // 每次启动服务时，自动打开浏览器
  hashLength: 8, // 打包输出js hash码长度
  output: null,
  eslint: false, // 是否开启 eslint 规则校验
  tslint: false,
  isMobile: true, // 默认启用 css rem单位转换，开发时，还是使用px写 
  i18n: false, // 是否需要转换 i18n html输出 启动 i18n时，默认启动 use_ejs
  use_ejs: false // 是否使用ejs 作为html模版 默认使用 html
}
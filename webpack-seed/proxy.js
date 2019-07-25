module.exports = {
  proxy: {
    "/proxy": {
      target: "http://123.166.199.1:8080",
      // "target": "",
      // "secure": false,
      // "logLevel": "debug",
      changeOrigin: true,
      pathRewrite: { '^/proxy': ''},
    }
  }
}
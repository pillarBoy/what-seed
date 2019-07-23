module.exports = {
  proxy: {
    "/proxy": {
      target: "http://159.138.38.208:80",
      // "target": "",
      // "secure": false,
      // "logLevel": "debug",
      changeOrigin: true,
      pathRewrite: { '^/proxy': ''},
    }
  }
}
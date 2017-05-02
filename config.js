// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    index: path.resolve(__dirname, 'dist/index.html'),
    assetsRoot: path.resolve(__dirname, 'dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: process.env.NODE_ENV === 'production' ? '../' : '/',
    productionSourceMap: true
  },
  dev: {
  	env: require('./dev.env'),
    port: 8080,
    proxyTable: {
        // proxy all requests starting with /api to jsonplaceholder
        '/api': {
            target: 'http://sk.jia.cximg.com',   // http://sk.jia.pre.com
            changeOrigin: true,
            secure:false,
            pathRewrite: {
              '^/api': ''
            }
        }
    }
  }
}

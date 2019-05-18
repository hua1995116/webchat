const path = require('path');
function resolve (dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    lintOnSave: true,
    chainWebpack: (config)=>{
        config.resolve.alias
            .set('@', resolve('src'))
            .set('@utils',resolve('src/utils'))
            .set('@components',resolve('src/components'))
            .set('@view',resolve('src/view'))
            .set('@const',resolve('src/const'))
            .set('@api',resolve('src/api'))
    },
    assetsDir: './static/',
    publicPath: process.env.NODE_ENV === 'production' ? '//s3.qiufengh.com/' : '',
    devServer: {
      port: 9099,
      proxy: { // https://cli.vuejs.org/zh/config/#devserver-proxy
        '/socket.io': {
          target: '127.0.0.1:9090',
          ws: true,
          changeOrigin: true
        },
        '/api': {
          target: 'http://127.0.0.1:9090',
          ws: false,
          changeOrigin: true
        },
        '/static': {
          target: 'http://127.0.0.1:9090',
          ws: false,
          changeOrigin: true
        }
      }
    },
    configureWebpack: {
      resolve: {
        alias: {
          'vue$': 'vue/dist/vue.esm.js' // https://github.com/vuejs/vue-cli/issues/2359
        }
      }
    },
    lintOnSave: false //https://blog.csdn.net/weixin_39194138/article/details/82147832
}

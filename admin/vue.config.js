// var webpack = require('webpack');
const path = require('path')
function resolve(dir) {
    return path.join(__dirname, dir)
}
function publicPath(){
    if (process.env.NODE_ENV == 'production') {
        return "/admin/";
    } else {
        return "/";
    }
}
// vue.config.js
module.exports = {
    // publicPath:"././",
    publicPath: publicPath(),
    // 国际化配置 使用其它语言，默认情况下中文语言包依旧是被引入的
    configureWebpack: {
        // plugins: [
        //     new webpack.NormalModuleReplacementPlugin(/element-ui[\/\\]lib[\/\\]locale[\/\\]lang[\/\\]zh-CN/, 'element-ui/lib/locale/lang/en')
        // ]
        resolve: {
            alias: {
                '@': resolve('src')
            }
        }
    },
lintOnSave: false,
    devServer: {
        host: "0.0.0.0", //指定使用一个 host。默认是 localhost，这里默认值即可
        port: 8081, //指定端口
        hot: true, // 开启热更新
        https: false, // 是否开启https模式
        proxy: { // 请求代理服务器
            '/users': {
                target: 'http://localhost:8080/',
                changeOrigin: true
            },
            '/yonghu': {
                target: 'http://localhost:8080/',
                changeOrigin: true
            },
            '/token': {
                target: 'http://localhost:8080/',
                changeOrigin: true
            },
            '/shangpinxinxi': {
                target: 'http://localhost:8080/',
                changeOrigin: true
            },
            '/shangpinfenlei': {
                target: 'http://localhost:8080/',
                changeOrigin: true
            },
            '/orders': {
                target: 'http://localhost:8080/',
                changeOrigin: true
            },
            '/dingdanpingjia': {
                target: 'http://localhost:8080/',
                changeOrigin: true
            },
            '/cart': {
                target: 'http://localhost:8080/',
                changeOrigin: true
            },
            '/storeup': {
                target: 'http://localhost:8080/',
                changeOrigin: true
            },
            '/address': {
                target: 'http://localhost:8080/',
                changeOrigin: true
            },
            '/news': {
                target: 'http://localhost:8080/',
                changeOrigin: true
            },
            '/discussshangpinxinxi': {
                target: 'http://localhost:8080/',
                changeOrigin: true
            },
            '/chat': {
                target: 'http://localhost:8080/',
                changeOrigin: true
            },
            '/config': {
                target: 'http://localhost:8080/',
                changeOrigin: true
            },
            '/common': {
                target: 'http://localhost:8080/',
                changeOrigin: true
            },
            '/file': {
                target: 'http://localhost:8080/',
                changeOrigin: true
            }
        }
    },
chainWebpack(config) {
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
}
}

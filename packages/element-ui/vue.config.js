/*
 * @Author       : djkloop
 * @Date         : 2020-08-15 21:16:03
 * @LastEditors  : djkloop
 * @LastEditTime : 2020-08-15 21:39:59
 * @Description  : 头部注释
 * @FilePath     : /form-create2/packages/element-ui/vue.config.js
 */
module.exports = {
    pages: {
        app: {
            entry: 'examples/main.js',
            template: 'public/index.html',
            filename: 'index.html'
        }
    },
    devServer: {
        port: 3677,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        proxy: {
            '/api': {
                target: 'https://sit-swork.faw.cn/',
                secure: false,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/api',
                },
            },
        },
    },
    configureWebpack: {
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.js'
            }
        }
    }
}

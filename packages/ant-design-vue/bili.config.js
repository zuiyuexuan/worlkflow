const {join} = require('path');
const {author, license, name, version} = require('./package.json');
const cleanup = require('rollup-plugin-cleanup');
const cwd = __dirname;

const {UI_LIB} = process.env;
console.log(`开始打包 -> ${UI_LIB} \n`);

module.exports = {
    plugins: {
        commonjs: true,
        postcss: {
            modules: {
                generateScopedName: '[local]'
            }
        },
        cleanup
    },
    banner: {
        author: `2018-${new Date().getFullYear()} ${author}\n * Github https://github.com/xaboy/form-create`,
        license,
        name,
        version
    },
    globals: {
        vue: 'Vue',
        antd: 'ant-design-vue',
        moment: 'moment'
    },
    externals: ['vue', 'Vue', 'Antd', 'moment'],
    output: {
        format: ['umd', 'umd-min'],
        moduleName: 'formCreate',
        fileName: 'form-create[min].js',
        extractCSS: false
    },
    input: join(cwd, '/src/index.js'),
    env: {
        'NODE_ENV': 'production',
        'VERSION': version,
        'UI': UI_LIB,
    }
};

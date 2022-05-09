const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.common.js')
module.exports = merge(baseConfig, {
  mode: 'development', //开发环境
  devtool: 'inline-source-map', //可以查看代码报错的位置
  devServer: {
    hot: true,
    port: 3000,
  },
})

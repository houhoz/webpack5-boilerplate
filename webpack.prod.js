const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.common.js')
module.exports = merge(baseConfig, {
  mode: 'production', //开启生产环境
  output: {
    clean: true, // webpack5的新特性，在生成文件之前清空 output 目录
  },
})

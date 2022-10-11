// webpack.prod.js

const { merge } = require('webpack-merge')
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const common = require('./webpack.common')
const { resolveApp } = require('./paths')

module.exports = merge(common, {
  mode: 'production',
  // 输出
  output: {
    // bundle 文件名称 【只有这里和开发环境不一样】
    filename: '[name].[contenthash].bundle.js',

    // bundle 文件路径
    path: resolveApp('dist'),

    // 编译前清除目录
    clean: true,
  },
  plugins: [
    // 打包体积分析
    new BundleAnalyzerPlugin(),
  ],
})

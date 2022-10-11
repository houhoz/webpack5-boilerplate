// webpack.dev.js

const { merge } = require('webpack-merge')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const smp = new SpeedMeasurePlugin()
const common = require('./webpack.common')
const { resolveApp } = require('./paths')

module.exports = smp.wrap(
  merge(common, {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    // 输出
    output: {
      // bundle 文件名称
      filename: '[name].bundle.js',

      // bundle 文件路径
      path: resolveApp('dist'),

      // 编译前清除目录
      clean: true,
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new ReactRefreshWebpackPlugin(),
    ],
    devServer: {
      // 告诉服务器位置。
      static: {
        directory: resolveApp('dist'),
      },
      port: 8888,
      open: true, // 自动打开浏览器
      compress: true, // 启动gzip压缩
      hot: true, // 热更新
    },
  })
)

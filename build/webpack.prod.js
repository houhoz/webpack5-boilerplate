const path = require('path')
const { merge } = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].[contenthash].bundle.js',
    clean: true,
    assetModuleFilename: 'images/[hash][ext][query]',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[contenthash].css',
      chunkFilename: '[id].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  // optimization: {
  //   minimize: true,
  //   minimizer: [new CssMinimizerPlugin(), '...'],
  //   runtimeChunk: {
  //     name: 'runtime',
  //   },
  // },
})

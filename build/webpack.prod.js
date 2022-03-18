const { merge } = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const common = require('./webpack.common.js')
const paths = require('./paths')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: paths.build,
    filename: 'js/[name].[contenthash].bundle.js',
    clean: true,
    // assetModuleFilename: 'images/[hash][ext][query]',
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
        test: /\.(sass|scss|css)$/,
        include: [paths.src],
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              sourceMap: false,
              modules: false,
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
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

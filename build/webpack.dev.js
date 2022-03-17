const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { sourceMap: true, importLoaders: 1, modules: false },
          },
        ],
      },
    ],
  },
  devServer: {
    static: './dist',
    historyApiFallback: true,
    open: true,
    compress: true,
    hot: true,
    port: 8080,
  },
})

const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const paths = require('./paths')

module.exports = {
  entry: paths.src + '/index.js',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'webpack打包',
      // favicon: paths.src + '/images/favicon.png',
      template: './public/index.html',
      filename: 'index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [paths.src],
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        include: [paths.src],
        type: 'asset/resource',
      },
      {
        test: /.(woff|woff2|eot|ttf|otf)$/i,
        include: [paths.src],
        type: 'asset/resource',
      },
    ],
  },
}

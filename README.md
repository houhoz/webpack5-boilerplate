## webpack5 打包

### loader

模块 loader 可以链式调用。链中的每个 loader 都将对资源进行转换。链会逆序执行。第一个 loader 将其结果（被转换后的资源）传递给下一个 loader，依此类推。最后，webpack 期望链中的最后的 loader 返回 JavaScript。

应保证 loader 的先后顺序：'style-loader' 在前，而 'css-loader' 在后。如果不遵守此约定，webpack 可能会抛出错误。

### HtmlWebpackPlugin

如果在代码编辑器中打开 index.html，你会看到 HtmlWebpackPlugin 创建了一个全新的文件，所有的 bundle 会自动添加到 html 中。

### 清理 /dist 文件夹

```js
module.exports = {
 ...
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
+   clean: true,
  },
}
```

### source map

我们将使用 inline-source-map 选项，这有助于解释说明示例意图（此配置仅用于示例，不要用于生产环境）

### webpack 提供几种可选方式，帮助你在代码发生变化后自动编译代码：

- webpack's Watch Mode ( 唯一的缺点是，为了看到修改后的实际效果，你需要刷新浏览器。如果能够自动刷新浏览器就更好了，因此接下来我们会尝试通过 webpack-dev-server 实现此功能。)
- webpack-dev-server
- webpack-dev-middleware (https://webpack.docschina.org/guides/development/#using-webpack-dev-middleware)

> webpack-dev-server 在编译之后不会写入到任何输出文件。而是将 bundle 文件保留在内存中，然后将它们 serve 到 server 中，就好像它们是挂载在 server 根路径上的真实文件一样。如果你的页面希望在其他不同路径中找到 bundle 文件，则可以通过 dev server 配置中的 devMiddleware.publicPath 选项进行修改。

### 代码分离

- 入口起点：使用 entry 配置手动地分离代码。
  - 如果入口 chunk 之间包含一些重复的模块，那些重复模块都会被引入到各个 bundle 中。
  - 这种方法不够灵活，并且不能动态地将核心应用程序逻辑中的代码拆分出来。
- 防止重复：使用 Entry dependencies 或者 SplitChunksPlugin 去重和分离 chunk。
- 动态导入：通过模块的内联函数调用来分离代码。

#### 防止重复(prevent duplication)

入口依赖

```js
const path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    index: {
      import: './src/index.js',
      dependOn: 'shared',
    },
    another: {
      import: './src/another-module.js',
      dependOn: 'shared',
    },
    shared: 'lodash',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    runtimeChunk: 'single',
  },
}
```

#### 使用 optimization.splitChunks 配置选项之后

```js
const path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js',
    another: './src/another-module.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
+  optimization: {
+    splitChunks: {
+      chunks: 'all',
+    },
+  },
}
```

#### 动态导入(dynamic import)

```js
async function getComponent() {
  const element = document.createElement('div')
  const { default: _ } = await import('lodash')
  element.innerHTML = _.join(['Hello', 'webpack'], ' ')
  return element
}
getComponent().then(component => {
  document.body.appendChild(component)
})
```

### 缓存

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Caching',
    }),
  ],
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
}
```

### webpack 优化

https://webpack.docschina.org/guides/build-performance/

- 将 loader 应用于最少数量的必要模块
  通过使用 include 字段，仅将 loader 应用在实际需要将其转换的模块：

```js
const path = require('path')
module.exports = {
  //...
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        loader: 'babel-loader',
      },
    ],
  },
}
```

### 开发环境

某些 utility, plugin 和 loader 都只用于生产环境。例如，在开发环境下使用 TerserPlugin 来 minify(压缩) 和 mangle(混淆破坏) 代码是没有意义的。通常在开发环境下，应该排除以下这些工具：

- TerserPlugin
- [fullhash]/[chunkhash]/[contenthash]
- AggressiveSplittingPlugin
- AggressiveMergingPlugin
- ModuleConcatenationPlugin

# 构建 webpack5 知识体系

## webpack 优点

- 拥有依赖管理、动态打包、代码分离、按需加载、代码压缩、静态资源压缩、缓存等配置；
- webpack 扩展性强，插件机制完善，开发者可自定义插件、loader；
- webpack 社区庞大，更新速度快，轮子丰富；

## 基础应用

### entry（入口）

入口是指依赖关系图的开始，从入口开始寻找依赖，打包构建，webpack 允许一个或多个入口配置；

```js
module.exports = {
  entry: './src/index.js',
}

// 多入口配置：

module.exports = {
  entry: {
    index: path.join(srcPath, 'index.js'),
    other: path.join(srcPath, 'other.js'),
  },
}
```

### output（出口）

输出用于配置 webpack 构建打包的出口，如打包的位置，打包的文件名；

```js
module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
}
```

### loader (转换)

webpack 自带 JavaScript 和 JSON 文件的打包构建能力，无需格外配置，对于其他类型的文件如 css 等，则需要安装 loader 处理；  
loader 让 webpack 能够去处理其他类型的文件，并将它们转换为有效模块，以供应用程序使用，以及被添加到依赖图中。

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
}
```

### plugin (插件)

插件则是用于扩展 webpack 的能力；

```js
module.export = {
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
}
```

### mode(模式)

webpack5 提供了模式选择，包括开发模式、生产模式、空模式，并对不同模式做了对应的内置优化。可通过配置模式让项目性能更优；

```js
module.exports = {
  mode: 'development',
}
```

### resolve(解析)

resolve 用于设置模块如何解析，常用配置如下：

- alias：配置别名，简化模块引入；
- extensions：在引入模块时可不带后缀；
- symlinks：用于配置 npm link 是否生效，禁用可提升编译速度。

```js
module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.d.ts'],
    alias: {
      '@': './',
    },
    symlinks: false,
  },
}
```

### optimization(优化)

optimization 用于自定义 webpack 的内置优化配置，一般用于生产模式提升性能，常用配置项如下：

- minimize：是否需要压缩 bundle；
- minimizer：配置压缩工具，如 TerserPlugin、OptimizeCSSAssetsPlugin；
- splitChunks：拆分 bundle；
- runtimeChunk：是否需要将所有生成 chunk 之间共享的运行时文件拆分出来。

```js
module.exports = {
  optimization: {
    minimizer: [new CssMinimizerPlugin()],
    splitChunks: {
      chunks: 'all',
      // 重复打包问题
      cacheGroups: {
        vendors: {
          //node_modules里的代码
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          //chunks name
          name: 'vendors',
          //优先级
          priority: 10,
          enforce: true,
        },
      },
    },
  },
}
```

## 实践

安装的插件

```bash
npm install webpack webpack-cli --save-dev
npm install --save-dev html-webpack-plugin
npm install --save-dev style-loader css-loader
npm install css-minimizer-webpack-plugin --save-dev
```

### 实现目标

- 分离开发环境、生产环境配置；
- 模块化开发；
- sourceMap 定位警告和错误；
- 动态生成引入 bundle.js 的 HTML5 文件；
- 实时编译；
- 封装编译、打包命令。

### output

生产环境的 output 需要通过 contenthash 值来区分版本和变动，可达到清缓存的效果，而本地环境为了构建效率，则不引人 contenthash。

占位符作用 ​

- [name] - chunk name（例如 [name].js -> app.js）。如果 chunk 没有名称，则会使用其 id 作为名称
- [contenthash] - 输出文件内容的 md4-hash（例如 [contenthash].js -> 4ea6ff1de66c537eb9b2.js）

### source-map

使用 source-map 追踪 error 和 warning，将编译后的代码映射回原始源代码；

```js
module.exports = merge(common, {
  mode: 'development',
  // 开发环境，开启 source map，编译调试
  devtool: 'eval-cheap-module-source-map',
})
```

```bash
# 开发
npx webpack --config config/webpack.dev.js

# 生产
npx webpack --config config/webpack.prod.js
```

## 进阶

目标

- 加载图片；
- 加载字体；
- 加载 CSS；
- 使用 SASS；
- 使用 PostCSS，并自动为 CSS 规则添加前缀，解析最新的 CSS 语法，引入 css-modules 解决全局- 命名冲突问题；
- 使用 React；
- 使用 TypeScript；

### 加载图片

<https://webpack.js.org/guides/asset-modules/#resource-assets>

```js
const paths = require('./paths')
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        include: [paths.resolveApp('src')],
        type: 'asset/resource',
      },
    ],
  },
}
```

### 加载 sass

`npm install --save-dev sass-loader sass`

```js
{
   test: /.(scss|sass)$/,
   include: paths.appSrc,
   use: [
      // 将 JS 字符串生成为 style 节点
      'style-loader',
     // 将 CSS 转化成 CommonJS 模块
      'css-loader',
     // 将 Sass 编译成 CSS
      'sass-loader',
  ],
}

```

### PostCSS

PostCSS 是一个用 JavaScript 工具和插件转换 CSS 代码的工具；​

- 可以自动为 CSS 规则添加前缀；
- 将最新的 CSS 语法转换成大多数浏览器都能理解的语法；
- css-modules 解决全局命名冲突问题。

postcss-loader 使用 PostCSS 处理 CSS 的 loader；

安装 PostCSS 相关依赖：  
`npm install --save-dev postcss-loader postcss postcss-preset-env`

```js
{
        test: /\.module\.(scss|sass)$/,
        include: paths.appSrc,
        use: [
          // 将 JS 字符串生成为 style 节点
          'style-loader',
          // 将 CSS 转化成 CommonJS 模块
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 2,
            },
          },
          // 将 PostCSS 编译成 CSS
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    // postcss-preset-env 包含 autoprefixer
                    'postcss-preset-env',
                  ],
                ],
              },
            },
          },
          // 将 Sass 编译成 CSS
          'sass-loader',
        ],
      }
```

### 安装 React 相关和 TypeScript：​

为提高性能，选择最新的 esbuild-loader；

```bash
npm i react react-dom @types/react @types/react-dom -D
npm i -D typescript esbuild-loader
```

加入 TS 配置 tsconfig.json：

```json
{
  "compilerOptions": {
    "outDir": "./dist/",
    "noImplicitAny": true,
    "module": "es6",
    "target": "es5",
    "jsx": "react",
    "allowJs": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true
  }
}
```

```js
module.exports = {
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },4
    module: {
        rules: [
            {
                test: /\.(js|ts|jsx|tsx)$/,
                include: paths.appSrc,
                use: [
                  {
                    loader: 'esbuild-loader',
                    options: {
                      loader: 'tsx',
                      target: 'es2015',
                    },
                  }
                ]
              },
         ]
     }
 }
```

## 优化

本篇将从优化开发体验、加快编译速度、减小打包体积、加快加载速度 4 个角度出发，介绍如何对 webpack 项目进行优化；​

### 编译进度条

`npm i -D progress-bar-webpack-plugin`

```js
// webpack.common.js
const chalk = require('chalk')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
module.exports = {
  plugins: [
    // 进度条
    new ProgressBarPlugin({
      format: `  :msg [:bar] ${chalk.green.bold(':percent')} (:elapsed s)`,
    }),
  ],
}
```

### 编译速度分析

`npm i -D speed-measure-webpack-plugin`

```js
// webpack.dev.js
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const smp = new SpeedMeasurePlugin()
module.exports = smp.wrap({
  // ...webpack config...
})
```

### 打包体积分析

`npm i -D webpack-bundle-analyzer`

```js
// webpack.prod.js
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = {
  plugins: [
    // 打包体积分析
    new BundleAnalyzerPlugin(),
  ],
}
```

### 热更新 react 组件

`npm install -D @pmmmwh/react-refresh-webpack-plugin react-refresh`

```js
// webpack.dev.js
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

module.exports = {
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin(),
  ],
}
```

### 构建速度优化

webpack5 较于 webpack4，新增了持久化缓存、改进缓存算法等优化，webpack5 新特性可查看 参考资料；
​
通过配置 webpack 持久化缓存，cache: filesystem，来缓存生成的 webpack 模块和 chunk，改善构建速度，可提速 90% 左右；
​
webpack.common.js 配置方式如下：

```js
module.exports = {
  cache: {
    type: 'filesystem', // 使用文件缓存
  },
}
```

### 优化 resolve 配置

resolve 用来配置 webpack 如何解析模块，可通过优化 resolve 配置来覆盖默认配置项，减少解析范围；​

1. alias
   alias 可以创建 import 或 require 的别名，用来简化模块引入；​
   webpack.common.js 配置方式如下：​

   ```js
   module.exports = {
     resolve: {
       alias: {
         '@': paths.appSrc, // @ 代表 src 路径
       },
     },
   }
   ```

2. extensions
   extensions 表示需要解析的文件类型列表。
   ​
   根据项目中的文件类型，定义 extensions，以覆盖 webpack 默认的 extensions，加快解析速度；
   ​
   由于 webpack 的解析顺序是从左到右，因此要将使用频率高的文件类型放在左侧，如下我将 tsx 放在最左侧；
   ​webpack.common.js 配置方式如下：

   ```js
   module.exports = {
     resolve: {
       extensions: ['.tsx', '.ts', '.js'],
     },
   }
   ```

3. modules
   modules 表示 webpack 解析模块时需要解析的目录； ​
   指定目录可缩小 webpack 解析范围，加快构建速度；​  
    webpack.common.js 配置方式如下：

   ```js
   module.exports = {
   resolve{
    modules: [
      'node_modules',
       paths.appSrc,
    ]
   }
   }
   ```

4. symlinks
   如果项目不使用 symlinks（例如 npm link 或者 yarn link），可以设置 resolve.symlinks: false，减少解析工作量。​
   webpack.common.js 配置方式如下：

   ```js
   module.exports = {
     resolve: {
       symlinks: false,
     },
   }
   ```

### 多线程

通过 thread-loader 将耗时的 loader 放在一个独立的 worker 池中运行，加快 loader 构建速度；

安装：
`npm i -D thread-loader`

```js
{
    loader: 'thread-loader',
    options: {
        workerParallelJobs: 2
    }
},
```

### 区分环境

切忌在开发环境使用生产环境才会用到的工具，如在开发环境下，应该排除 [fullhash]/[chunkhash]/[contenthash] 等工具。

在生产环境，应该避免使用开发环境才会用到的工具，如 webpack-dev-server 等插件；

### devtool

不同的 devtool 设置，会导致性能差异。在多数情况下，最佳选择是 eval-cheap-module-source-map；​

webpack.dev.js 配置如下：

```js
export.module = {
    devtool: 'eval-cheap-module-source-map',
}
```

### 输出结果不携带路径信息

默认 webpack 会在输出的 bundle 中生成路径信息，将路径信息删除可小幅提升构建速度。

```js
module.exports = {
    output: {
        pathinfo: false,
      },
    };
}
```

### DllPlugin

核心思想是将项目依赖的框架等模块单独构建打包，与普通构建流程区分开。

```js
output: {
    filename: '[name].dll.js',
    // 输出的文件都放到 dist 目录下
    path: distPath,
    library: '_dll_[name]',
  },

  plugins: [
    // 接入 DllPlugin
    new DllPlugin({
      // 动态链接库的全局变量名称，需要和 output.library 中保持一致
      // 该字段的值也就是输出的 manifest.json 文件 中 name 字段的值
      // 例如 react.manifest.json 中就有 "name": "_dll_react"
      name: '_dll_[name]',
      // 描述动态链接库的 manifest.json 文件输出时的文件名称
      path: path.join(distPath, '[name].manifest.json'),
    }),
  ],
```

### externals

Webpack 配置中的 externals 和 DllPlugin 解决的是同一类问题：将依赖的框架等模块从构建过程中移除。

它们的区别在于：

- 在 Webpack 的配置方面，externals 更简单，而 DllPlugin 需要独立的配置文件。
- DllPlugin 包含了依赖包的独立构建流程，而 externals 配置中不包含依赖框架的生成方式，通常使用已传入 CDN 的依赖包。
- externals 配置的依赖包需要单独指定依赖模块的加载方式：全局对象、CommonJS、AMD 等。
- 在引用依赖包的子模块时，DllPlugin 无须更改，而 externals 则会将子模块打入项目包中。

```js
// 引入cdn
;<script
  src='https://code.jquery.com/jquery-3.1.0.js'
  integrity='sha256-slogkvB1K3VOkzAI8QITxV3VzpOnkeNVsKvtkYLMjfk='
  crossorigin='anonymous'
></script>

// webpack配置
module.exports = {
  //...
  externals: {
    jquery: 'jQuery',
  },
}

// 页面
import $ from 'jquery'
$('.my-element').animate(/* ... */)
```

### 减小打包体积

#### 代码压缩

1. JS 压缩
   使用 TerserWebpackPlugin 来压缩 JavaScript；
   webpack5 自带最新的 terser-webpack-plugin，无需手动安装；
   terser-webpack-plugin 默认开启了 parallel: true 配置，并发运行的默认数量： os.cpus().length - 1 ，本文配置的 parallel 数量为 4，使用多进程并发运行压缩以提高构建速度；

   ```js
   // webpack.prod.js 配置方式如下：
   const TerserPlugin = require('terser-webpack-plugin')
   module.exports = {
     optimization: {
       minimizer: [
         new TerserPlugin({
           parallel: 4,
           terserOptions: {
             parse: {
               ecma: 8,
             },
             compress: {
               ecma: 5,
               warnings: false,
               comparisons: false,
               inline: 2,
             },
             mangle: {
               safari10: true,
             },
             output: {
               ecma: 5,
               comments: false,
               ascii_only: true,
             },
           },
         }),
       ],
     },
   }
   ```

2. CSS 压缩
   `npm install -D css-minimizer-webpack-plugin`

   ```js
   // webpack.prod.js 配置方式如下：
   const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

   module.exports = {
     optimization: {
       minimizer: [
         new CssMinimizerPlugin({
           parallel: 4,
         }),
       ],
     },
   }
   ```

### 代码分离

代码分离能够把代码分离到不同的 bundle 中，然后可以按需加载或并行加载这些文件。代码分离可以用于获取更小的 bundle，以及控制资源加载优先级，可以缩短页面加载时间；

1. 抽离重复代码
   SplitChunksPlugin 插件开箱即用，可以将公共的依赖模块提取到已有的入口 chunk 中，或者提取到一个新生成的 chunk；​

   webpack 将根据以下条件自动拆分 chunks：​

   - 新的 chunk 可以被共享，或者模块来自于 node_modules 文件夹；
   - 新的 chunk 体积大于 20kb（在进行 min+gz 之前的体积）；
   - 当按需加载 chunks 时，并行请求的最大数量小于或等于 30；
   - 当加载初始化页面时，并发请求的最大数量小于或等于 30； 通过 splitChunks 把 react 等公共库抽离出来，不重复引入占用体积

   > 注意：切记不要为 cacheGroups 定义固定的 name，因为 cacheGroups.name 指定字符串或始终返回相同字符串的函数时，会将所有常见模块和 vendor 合并为一个 chunk。这会导致更大的初始下载量并减慢页面加载速度；​

   ```js
   // webpack.prod.js 配置方式如下：
   module.exports = {
     optimization: {
       splitChunks: {
         // include all types of chunks
         chunks: 'all',
         // 重复打包问题
         cacheGroups: {
           // node_modules里的代码
           // 第三方模块
           vendors: {
             test: /[\\/]node_modules[\\/]/,
             chunks: 'all',
             // name: 'vendors', 一定不要定义固定的name
             priority: 10, // 优先级
             enforce: true,
           },
           // 公共的模块
           common: {
             name: 'common', // chunk 名称
             priority: 0, // 优先级
             minSize: 0, // 公共模块的大小限制
             minChunks: 2, // 公共模块最少复用过几次
           },
         },
       },
     },
   }
   ```

2. CSS 文件分离
   MiniCssExtractPlugin 插件将 CSS 提取到单独的文件中，为每个包含 CSS 的 JS 文件创建一个 CSS 文件，并且支持 CSS 和 SourceMaps 的按需加载；​

   安装
   `npm install -D mini-css-extract-plugin`
   webpack.common.js 配置方式如下：​

   > 注意：MiniCssExtractPlugin.loader 要放在 style-loader 后面；

   ```js
   // webpack.common.js 配置方式如下：​
   const MiniCssExtractPlugin = require('mini-css-extract-plugin')

   module.exports = {
     plugins: [new MiniCssExtractPlugin()],
     module: {
       rules: [
         {
           test: /\.module\.(scss|sass)$/,
           include: paths.appSrc,
           use: [
             'style-loader',
             isEnvProduction && MiniCssExtractPlugin.loader, // 仅生产环境
             {
               loader: 'css-loader',
               options: {
                 modules: true,
                 importLoaders: 2,
               },
             },
             {
               loader: 'postcss-loader',
               options: {
                 postcssOptions: {
                   plugins: [['postcss-preset-env']],
                 },
               },
             },
             {
               loader: 'thread-loader',
               options: {
                 workerParallelJobs: 2,
               },
             },
             'sass-loader',
           ].filter(Boolean),
         },
       ],
     },
   }
   ```

3. 最小化 entry chunk

   通过配置 optimization.runtimeChunk = true，为运行时代码创建一个额外的 chunk，减少 entry chunk 体积，提高性能；​

   webpack.prod.js 配置方式如下：

   ```js
   module.exports = {
     optimization: {
       runtimeChunk: true,
     },
   }
   ```

### Tree Shaking（摇树）

1 个模块可能有多个⽅法，只要其中的某个方法使⽤到了，则整个⽂件都会被打到 bundle 里面去，tree shaking 就是只把⽤到的方法打入 bundle ，没⽤到的方法会在 uglify 阶段被擦除掉；​

1. JS
   JS Tree Shaking 将 JavaScript 上下文中的未引用代码（Dead Code）移除，通过 package.json 的 "sideEffects" 属性作为标记，向 compiler 提供提示，表明项目中的哪些文件是 "pure(纯正 ES2015 模块)"，由此可以安全地删除文件中未使用的部分；
   Dead Code 一般具有以下几个特征：​

   - 代码不会被执行，不可到达；
   - 代码执行的结果不会被用到；
   - 代码只会影响死变量（只写不读）

   webpack5 sideEffects 设置
   通过 package.json 的 "sideEffects" 属性，来实现这种方式；

   ```json
   {
     "name": "your-project",
     "sideEffects": false
   }
   ```

   需注意的是，当代码有副作用时，需要将 sideEffects 改为提供一个数组，添加有副作用代码的文件路径：

   ```json
   {
     "name": "your-project",
     "sideEffects": ["./src/some-side-effectful-file.js"]
   }
   ```

2. CSS
   使用 purgecss-webpack-plugin 对 CSS Tree Shaking。​
   `npm i purgecss-webpack-plugin -D`
   因为打包时 CSS 默认放在 JS 文件内，因此要结合 webpack 分离 CSS 文件插件 mini-css-extract-plugin 一起使用，先将 CSS 文件分离，再进行 CSS Tree Shaking；​
   webpack.prod.js 配置方式如下：

   ```js
   const glob = require('glob')
   const MiniCssExtractPlugin = require('mini-css-extract-plugin')
   const PurgeCSSPlugin = require('purgecss-webpack-plugin')
   const paths = require('paths')

   module.exports = {
     plugins: [
       // 打包体积分析
       new BundleAnalyzerPlugin(),
       // 提取 CSS
       new MiniCssExtractPlugin({
         filename: '[name].css',
       }),
       // CSS Tree Shaking
       new PurgeCSSPlugin({
         paths: glob.sync(`${paths.appSrc}/**/*`, { nodir: true }),
       }),
     ],
   }
   ```

3. CDN
   通过 CDN 来减小打包体积；​

   将大的静态资源上传至 CDN：​

   字体：压缩并上传至 CDN；
   图片：压缩并上传至 CDN。

<https://juejin.cn/post/7062899360995999780#heading-33>

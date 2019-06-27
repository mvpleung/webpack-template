1.  需要安装的依赖包

    ```bash
    yarn add less less-loader css-loader style-loader postcss-loader postcss-preset-env postcss-import cssnano postcss-safe-parser mini-css-extract-plugin -D
    ```

    > 过去版本的autoprefixer、postcss-cssnext已内置在postcss-preset-env内。

2.  配置

    _默认会将 css 一起打包到 js 里，借助 mini-css-extract-plugin 将 css 分离出来并自动在生成的 html 中 link 引入（过去版本中的 extract-text-webpack-plugin 已不推荐使用）。_

    ```js
    const MiniCssExtractPlugin = require('mini-css-extract-plugin')
    ```

    ```js
    {
         test: /\.(less|css)$/,
         use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader'],
     }

     // 在启用dev-server时，mini-css-extract-plugin插件不能使用contenthash给文件命名 => 所以本地起dev-server服务调试时，使用style-loader
     // USE_HMR是自定义的环境变量，意思是是否使用了热替换中间件
     const styleLoader = process.env.USE_HMR ? 'style-loader' : MiniCssExtractPlugin.loader

     // 通过其他合适的方式判断是否为本地调试环境也一样，自由选择。
     const styleLoader = process.env.BUILD_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader

     {
       test: /\.(less|css)$/,
       use: [styleLoader, 'css-loader', 'postcss-loader', 'less-loader'],
     },
    ```

    ```js
    // 单独使用link标签加载css并设置路径，相对于output配置中的publickPath
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:7].css', // 注意这里使用的是contenthash，否则任意的js改动，打包时都会导致css的文件名也跟着变动。
      chunkFilename: 'static/css/[name].[contenthash:7].css',
    })
    ```

3.  [PostCSS](https://www.webpackjs.com/loaders/postcss-loader/) 本身不会对你的 CSS 做任何事情, 你需要安装一些 plugins 才能开始工作.  
    参考文档： [postcss GitHub 文档](https://github.com/postcss/postcss/blob/master/README-cn.md)

    使用时在 package.json 同级目录新建 postcss.config.js 文件:

    ```js
    module.exports = {
      // parser: 'sugarss', // 是一个以缩进为基础的语法，类似于 Sass 和 Stylus，https://github.com/postcss/sugarss
      plugins: {
        'postcss-import': {},
        'postcss-preset-env': {},
        'cssnano': {},
        'postcss-flexbugs-fixes': {},
      }
    }
    ```

    _常用的插件_:

    - cssnano ——_会压缩你的 CSS 文件来确保在开发环境中下载量尽可能的小_

    _其它有用的插件_:

    - postcss-pxtorem ——_px 单位自动转换 rem_
    - postcss-assets ——_插件用来处理图片和 SVG, 类似 url-load_
    - postcss-sprites ——_将扫描你 CSS 中使用的所有图像，自动生成优化的 Sprites 图像和 CSS Sprites 代码_
    - postcss-font-magician ——_使用自定义字体时, 自动搞定@font-face 声明_

    Less 是预处理，而 PostCSS 是后处理，基本支持 less 等预处理器的功能，自动添加浏览器厂商前缀向前兼容，允许书写下一代 css 语法 ，可以在编译时去除冗余的 css 代码，PostCSS 声称比预处理器快 3-30 倍. **因为 PostCSS，可能我们要放弃 less/sass/stylus 了**。
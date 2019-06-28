- [html-webpack-plugin](https://www.webpackjs.com/plugins/html-webpack-plugin/)插件，配置：

  ```js
  const HtmlWebpackPlugin = require('html-webpack-plugin')
  ```

  ```js
  new HtmlWebpackPlugin({
    favicon: './src/assets/img/favicon.ico', // favicon路径，通过webpack引入同时可以生成hash值
    filename: './views/index.html', // 生成的html存放路径，相对于path
    template: './src/views/index.html', // html模板路径
    title: '首页', // 页面title
    meta: '', // 允许插入meta标签,如=>meta: {viewport: 'width=device-width,initial-scale=1, shrink-to-fit=no'}
    inject: 'body', // js插入的位置，true/'head'/'body'/false
    hash: true, // 为静态资源生成hash值(js和css)
    chunks: ['vendors', 'index'], // 需要在此页面引入的chunk，不配置就会引入所有页面的资源
    minify: {
      // 压缩html文件
      removeComments: true, // 移除html中的注释
      collapseWhitespace: true, // 删除空白符与换行符
    },
  })
  ```
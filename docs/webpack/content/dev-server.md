## [webpack-dev-server](https://www.webpackjs.com/configuration/dev-server/)

1. 安装依赖包  

    ```bash
    yarn add webpack-dev-server -D
    ```

2. 常用配置  

    ```js
    devServer: {
      contentBase: path.join(__dirname, 'static'),    // 告诉服务器从哪里提供内容(默认当前工作目录)
      openPage: 'views/index.html',  // 指定默认启动浏览器时打开的页面
      index: 'views/index.html',  // 指定首页位置
      watchContentBase: true, // contentBase下文件变动将reload页面(默认false)
      host: 'localhost', // 默认localhost,想外部可访问用'0.0.0.0'
      port: 8080, // 默认8080
      inline: true, // 可以监控js变化
      hot: true, // 热启动
      open: true, // 启动时自动打开浏览器（指定打开chrome，open: 'Google Chrome'）
      compress: true, // 一切服务都启用gzip 压缩
      disableHostCheck: true, // true：不进行host检查
      quiet: false,
      https: false,
      clientLogLevel: 'none',
      stats: { // 设置控制台的提示信息
        chunks: false,
        children: false,
        modules: false,
        entrypoints: false, // 是否输出入口信息
        warnings: false,
        performance: false, // 是否输出webpack建议（如文件体积大小）
      },
      historyApiFallback: {
        disableDotRule: true,
      },
      watchOptions: {
        ignored: /node_modules/, // 略过node_modules目录
      },
      proxy: { // 接口代理（这段配置更推荐：写到package.json，再引入到这里）
        "/api-dev": {
          "target": "http://api.test.xxx.com",
          "secure": false,
          "changeOrigin": true,
          "pathRewrite": { // 将url上的某段重写（例如此处是将 api-dev 替换成了空）
            "^/api-dev": ""
          }
        }
      },
      before(app) { },
    }
    ```

    > 根据目录结构的不同，contentBase、openPage 参数要配置合适的值，否则运行时应该不会立刻访问到你的首页; 同时要注意你的 publicPath，静态资源打包后生成的路径是一个需要思考的点，这与你的目录结构有关。

3. package.json 添加运行命令

    ```bash
    "scripts": {
      "dev": "cross-env BUILD_ENV=development webpack-dev-server --mode development --colors --profile"
    }
    ```

    > 不同操作系统传递参数的形式不一样，cross-env 可以抹平这个平台差异。
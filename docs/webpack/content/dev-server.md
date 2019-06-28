## 配置开发服务器，[webpack-dev-server](https://www.webpackjs.com/configuration/dev-server/)

1. 安装依赖包  

    ```bash
    yarn add webpack-dev-server -D
    ```

2. 常用配置  

    ```js
    devServer: {
      contentBase: path.join(__dirname, 'static'),    // # 告诉服务器从哪里提供内容(默认当前工作目录)
      host: 'localhost',  // # 默认localhost,想外部可访问用'0.0.0.0'
      openPage: 'views/index.html',  // # 指定默认启动浏览器时打开的页面
      index: 'views/index.html',  // # 指定首页位置
      port: 9090, // # 默认8080
      inline: true, // # 可以监控js变化
      hot: true, // # 热启动
      open: true, // # 自动打开浏览器
      compress: true,  // # 一切服务都启用gzip 压缩
      watchContentBase: true  // # contentBase下文件变动将reload页面(默认false)
    }
    ```

3. 运行命令 ( package.json 配置命令 => npm run dev )

    ```bash
    "dev": "cross-env BUILD_ENV=development webpack-dev-server --mode development --colors --profile"
    ```

    _根据目录结构的不同, contentBase、openPage 参数要配置合适的值, 否则运行时应该不会立刻访问到你的首页; 同时要注意你的 publicPath, 静态资源打包后生成的路径是一个需要思考的点, 这与你的目录结构有关._
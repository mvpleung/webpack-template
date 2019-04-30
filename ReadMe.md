# webpack-template
> 为懒人准备的webpack模版, 可以直接用于生产.

## 技术栈
> es6 + less + art-template + webpack 4

1. 普通H5开发中,引入组件化；
2. 引入art-template前端渲染引擎——目前前端模版里速度最快；
3. 配置dev-server调试模式，proxy代理接口调试；
4. 配置watch模式，方便在生产环境中用Charles映射到本地文件；
5. optimization配置提取runtime代码；
6. splitChunks配置，提取vendor主要缓存包，提取common次要缓存包；
7. 支持多页、多入口，自动扫描；
8. MockJs模拟mock数据；

## 运行命令
```bash
npm run dev               # 启动本地调试
npm run dev-mock          # 启动本地调试，MockJs模拟接口数据
npm run dev:page-a        # 启动本地调试，仅page-a页面
npm run dev:page-b        # 启动本地调试，仅page-b页面

npm run build-dev         # 打包代码，publicPath以/打头（可通过本地起服务访问build后的代码）
npm run http-server       # 启动http-server服务器，可用来访问npm run build-dev打包的代码
npm run build-test        # 打包测试环境代码
npm run build             # 打包生产环境代码

# watch模式，移除了js、css的压缩，节省时间。
npm run watch-dev         # 启动watch模式，本地开发环境（通常用不上）
npm run watch-test        # 启动watch模式，测试环境
npm run watch             # 启动watch模式，生产环境
```

## Babel转码
> 这是最新的babel配置，和网上的诸多教程可能有不同，可以自行测试验证有效性。
1. 基础依赖包
    ```js
    npm i babel-loader@8 @babel/core -D
    ```

2. 在package.json同级添加.babelrc配置文件，先空着。
    ```js
    {
      "presets": [],  // 预设
      "plugins": []   // 插件
    }
    ```

3. package.json文件可以声明需要支持到的客户端版本
    > package.json中声明的browserslist可以影响到babel、postcss，babel优先读取.babelrc文件中@babel/preset-env的targets属性，未定义会读取package.json中的browserslist。  
    为了统一，会在package.json中统一定义。

    package.json中定义（推荐）
    ```json
    "browserslist": [
      "> 1%",
      "last 2 versions",
      "not ie <= 8"
    ],
    ```

    .babelrc中定义
    ```js
    {
      "presets": [
        [
          "@babel/preset-env",
          {
            "targets": {
              "chrome": "58",
              "ie": "11"
            }
          }
        ]
      ]
    }
    ```

4. > Babel默认只转换新的JavaScript句法（syntax），而不转换新的API，比如Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise等全局对象，以及一些定义在全局对象上的方法（比如Object.assign）都不会转码。  
转译新的API，使用`@babel/preset-env`或`@babel/plugin-transform-runtime`，二选一即可。


5. 使用`@babel/preset-env`
    ```js
    npm i @babel/preset-env @babel/polyfill -D
    ```

    .babelrc文件写上配置
    ```js
    {
      "presets": [
        [
          "@babel/preset-env",
          {
            "targets": {
              "chrome": "58",
              "ie": "11"
            }
            "useBuiltIns": "entry",
            "modules": false,
            
          }
        ]
      ]
    }
    ```

6. 使用`@babel/plugin-transform-runtime`
    ```js
    npm i @babel/plugin-transform-runtime -D
    ```

    .babelrc文件写上配置
    ```js
    {
      "presets": [],
      "plugins": [
        [
          "@babel/plugin-transform-runtime",
          {
            "corejs": 2
          }
        ]
      ]
    }
    ```

7. 参考文档
    1. [一文读懂 babel7 的配置文件加载逻辑](https://segmentfault.com/a/1190000018358854)
    2. [babel polyfill runtime 浅析](https://blog.csdn.net/weixin_34163741/article/details/88015827)
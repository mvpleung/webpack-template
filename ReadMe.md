# webpack-template
> 为懒人准备的webpack模版，可以直接用于生产。

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

## [Babel转码](https://babeljs.io/docs/en/)
> 这是最新的babel配置，和网上的诸多教程可能有不同，可以自行测试验证有效性。
1. 基础依赖包
    ```js
    npm i babel-loader@8 @babel/core -D
    ```
    > 从 babel7 开始，所有的官方插件和主要模块，都放在了 @babel 的命名空间下。从而可以避免在 npm 仓库中 babel 相关名称被抢注的问题。

2. 在package.json同级添加.babelrc配置文件，先空着。
    ```js
    {
      "presets": [],  // 预设
      "plugins": []   // 插件
    }
    ```

3. package.json文件可以声明需要支持到的浏览器版本
    1. package.json中声明的browserslist可以影响到babel、postcss，babel是优先读取.babelrc文件中@babel/preset-env的targets属性，未定义会读取package.json中的browserslist。  
    为了统一，在package.json中定义。

    2. package.json中定义（推荐）
        ```json
        "browserslist": [
          "> 1%",
          "last 2 versions",
          "not ie <= 8"
        ],
        ```

        > 更多定义格式请查看：[browserslist](https://github.com/browserslist/browserslist)

    3. .babelrc中定义（不推荐）
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

4. Babel默认只转换新的JavaScript句法（syntax），而不转换新的API，比如Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise等全局对象，以及一些定义在全局对象上的方法（比如Object.assign）都不会转码。  
需要转译新的API，使用`@babel/preset-env`或`@babel/plugin-transform-runtime`，二选一即可。


5. 使用[@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env)
    1. 安装依赖包：
        ```js
        npm i @babel/preset-env @babel/polyfill -D
        ```

    2. .babelrc文件写上配置，@babel/polyfill不用写入配置，会自动被调用。
        ```js
        {
          "presets": [
            [
              "@babel/preset-env",
              {
                "useBuiltIns": "entry",
                "modules": false,
                
              }
            ]
          ]
        }
        ```

    3. [配置参数](https://babeljs.io/docs/en/babel-preset-env)
        1. `modules`，`"amd" | "umd" | "systemjs" | "commonjs" | "cjs" | "auto" | false`，默认值是auto。  
        用来转换ES6的模块语法。如果使用false，将不会对文件的模块语法进行转化。  
        如果要使用webpack中的一些新特性，比如tree shaking 和 sideEffects，就需要设置为false，对ES6的模块文件不做转化，因为这些特性只对ES6的模块有效。
        2. `useBuiltIns`，`"usage" | "entry" | false`，默认值是false。  
            - `false`：需要在js代码第一行主动import '@babel/polyfill'，会将@babel/polyfill整个包全部导入。  
            （不推荐，能覆盖到所有API的转译，但体积最大）
            - `entry`：需要在js代码第一行主动import '@babel/polyfill'，会将browserslist环境不支持的所有垫片都导入。  
            （能够覆盖到‘hello‘.includes(‘h‘)这种句法，足够安全且代码体积不是特别大）
            - `usage`：项目里不用主动import，会自动将代理已使用到的、且browserslist环境不支持的垫片导入。  
            （但是检测不到‘hello‘.includes(‘h‘)这种句法，对这类原型链上的句法问题不会做转译，**书写代码需注意**）
        3. `targets`，用来配置需要支持的的环境，不仅支持浏览器，还支持node。如果没有配置targets选项，就会读取项目中的browserslist配置项。
        4. `loose`，默认值是false，如果preset-env中包含的plugin支持loose的设置，那么可以通过这个字段来做统一的设置。

6. 使用[@babel/plugin-transform-runtime](https://babeljs.io/docs/en/babel-plugin-transform-runtime#docsNav)
    1. 安装依赖包
        ```js
        npm i @babel/plugin-transform-runtime -D
        ```

        1. 如果配置参数corejs未设置或为false，需安装依赖`@babel/runtime`（这部分代码会被抽离并打包到应用js里，所以可以安装在dependencies里），仅对es6语法转译，而不对新API转译。  
            ```js
            npm i @babel/runtime
            ```

        2. 如果配置参数corejs设置为2，需安装依赖`@babel/runtime-corejs2`（同上，推荐安装在dependencies里。），对语法、新API都转译。  
            ```js
            npm i @babel/runtime-corejs2
            ```
        3. 推荐使用`corejs:2`，但是，检测不到`‘hello‘.includes(‘h‘)`这种句法，所以存在一定隐患，书写代码时需注意。

        4. [@babel/runtime](https://babeljs.io/docs/en/babel-runtime)和[@babel/runtime-corejs2](https://babeljs.io/docs/en/babel-runtime-corejs2)这两个库唯一的区别是：corejs2这个库增加了对core-js（用来对ES6各个语法polyfill的库）这个库的依赖，所以在corejs为false的情况下，只能做语法的转换，并不能polyfill任何新API。

    2. .babelrc文件写上配置
        ```js
        {
          "presets": [],
          "plugins": [
            [
              "@babel/plugin-transform-runtime",
              {
                "corejs": 2 // 推荐
              }
            ]
          ]
        }
        ```

    3. [配置参数](https://babeljs.io/docs/en/babel-plugin-transform-runtime#docsNav)
        1. `corejs`，默认值是false，只对语法进行转换，不对新API进行处理；当设置为2的时候，需要安装`@babel/runtime-corejs2`，这时会对api进行处理。
        2. `helpers`，默认值是true，用来开启是否使用helper函数来重写语法转换的函数。
        3. `useESModules`，默认值是false，是否对文件使用ES的模块语法，使用ES的模块语法可以减少文件的大小。

7. `@babel/preset-env`还是`@babel/plugin-transform-runtime`？ ([传送门：babel polyfill 和 runtime 浅析](https://blog.csdn.net/weixin_34163741/article/details/88015827))
    1. `@babel/preset-env + @babel/polyfill`可以转译语法、新API，但存在污染全局问题；
    
    2. `@babel/plugin-transform-runtime + @babel/runtime-corejs2`，可按需导入，转译语法、新API，且避免全局污染（babel7中@babel/polyfill是@babel/runtime-corejs2的别名），但是检测不到‘hello‘.includes(‘h‘)这种句法；

    3. @babel/polyfill和@babel/runtime-corejs2都使用了core-js(v2)这个库来进行api的处理。  
    core-js(v2)这个库有两个核心的文件夹，分别是library和modules。@babel/runtime-corejs2使用library这个文件夹，@babel/polyfill使用modules这个文件夹。  
        1. library使用helper的方式，局部实现某个api，不会污染全局变量；
        2. modules以污染全局变量的方法来实现api；  
        3. library和modules包含的文件基本相同，最大的不同是_export.js这个文件：  

              - core-js/modules/_exports.js文件如下：
                  ```js
                  var global = require('./_global');
                  var core = require('./_core');
                  var hide = require('./_hide');
                  var redefine = require('./_redefine');
                  var ctx = require('./_ctx');
                  var PROTOTYPE = 'prototype';
                  
                  var $export = function (type, name, source) {
                    var IS_FORCED = type & $export.F;
                    var IS_GLOBAL = type & $export.G;
                    var IS_STATIC = type & $export.S;
                    var IS_PROTO = type & $export.P;
                    var IS_BIND = type & $export.B;
                    var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
                    var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
                    var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
                    var key, own, out, exp;
                    if (IS_GLOBAL) source = name;
                    for (key in source) {
                      // contains in native
                      own = !IS_FORCED && target && target[key] !== undefined;
                      // export native or passed
                      out = (own ? target : source)[key];
                      // bind timers to global for call from export context
                      exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
                      // extend global
                      if (target) redefine(target, key, out, type & $export.U);
                      // export
                      if (exports[key] != out) hide(exports, key, exp);
                      if (IS_PROTO && expProto[key] != out) expProto[key] = out;
                    }
                  };
                  global.core = core;
                  // type bitmap
                  $export.F = 1;   // forced
                  $export.G = 2;   // global
                  $export.S = 4;   // static
                  $export.P = 8;   // proto
                  $export.B = 16;  // bind
                  $export.W = 32;  // wrap
                  $export.U = 64;  // safe
                  $export.R = 128; // real proto method for `library`
                  module.exports = $export;
                  ```

              - core-js/library/_exports.js文件如下：
                  ```js
                  var global = require('./_global');
                  var core = require('./_core');
                  var ctx = require('./_ctx');
                  var hide = require('./_hide');
                  var has = require('./_has');
                  var PROTOTYPE = 'prototype';
                  
                  var $export = function (type, name, source) {
                    var IS_FORCED = type & $export.F;
                    var IS_GLOBAL = type & $export.G;
                    var IS_STATIC = type & $export.S;
                    var IS_PROTO = type & $export.P;
                    var IS_BIND = type & $export.B;
                    var IS_WRAP = type & $export.W;
                    var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
                    var expProto = exports[PROTOTYPE];
                    var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
                    var key, own, out;
                    if (IS_GLOBAL) source = name;
                    for (key in source) {
                      // contains in native
                      own = !IS_FORCED && target && target[key] !== undefined;
                      if (own && has(exports, key)) continue;
                      // export native or passed
                      out = own ? target[key] : source[key];
                      // prevent global pollution for namespaces
                      exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
                      // bind timers to global for call from export context
                      : IS_BIND && own ? ctx(out, global)
                      // wrap global constructors for prevent change them in library
                      : IS_WRAP && target[key] == out ? (function (C) {
                        var F = function (a, b, c) {
                          if (this instanceof C) {
                            switch (arguments.length) {
                              case 0: return new C();
                              case 1: return new C(a);
                              case 2: return new C(a, b);
                            } return new C(a, b, c);
                          } return C.apply(this, arguments);
                        };
                        F[PROTOTYPE] = C[PROTOTYPE];
                        return F;
                      // make static versions for prototype methods
                      })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
                      // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
                      if (IS_PROTO) {
                        (exports.virtual || (exports.virtual = {}))[key] = out;
                        // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
                        if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
                      }
                    }
                  };
                  // type bitmap
                  $export.F = 1;   // forced
                  $export.G = 2;   // global
                  $export.S = 4;   // static
                  $export.P = 8;   // proto
                  $export.B = 16;  // bind
                  $export.W = 32;  // wrap
                  $export.U = 64;  // safe
                  $export.R = 128; // real proto method for `library`
                  module.exports = $export;
                  ```

              3. 可以看出，library下的这个$export方法，会实现一个wrapper函数，防止污染全局变量。

              4. 例如对Promise的转译，@babel/polyfill和@babel/runtime-corejs2的转译方式差异如下：
                  ```js
                  var p = new Promise();
 

                  // @babel/polyfill
                  require("core-js/modules/es6.promise");
                  var p = new Promise();
                  
                  
                  // @babel/runtime-corejs2
                  var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");
                  var _promise = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/promise"));
                  var a = new _promise.default();
                  ```

              5. 从上面这个例子可以看出，对于Promise这个api，@babel/polyfill引用了core-js/modules中的es6.promise.js文件，因为是对全局变量进行处理，所以赋值语句不用做处理；@babel/runtime-corejs2会生成一个局部变量_promise，然后把Promise都替换成_promise，这样就不会污染全局变量了。

      4. **综合上面的分析，得出结论：**
          1. 如果是自己的应用 => `@babel/preset-env + @babel/polyfill`  
              1. `useBuiltIns`设置为`entry`比较不错。  
              在js代码第一行`import '@babel/polyfill'`，或在webpack的入口entry中写入模块`@babel/polyfill`，会将browserslist环境不支持的所有垫片都导入；  
              能够覆盖到`‘hello‘.includes(‘h‘)`这种句法，足够安全且代码体积不是特别大，推荐使用！

              2. `useBuiltIns`设置为`usage`。  
              项目里不用主动import，会自动将代码里已使用到的、且browserslist环境不支持的垫片导入；  
              相对安全且打包的js体积不大，但是，通常我们转译都会排除`node_modules/`目录，如果使用到的第三方包有个别未做好ES6转译，有遇到bug的可能性，并且检测不到`‘hello‘.includes(‘h‘)`这种句法。  
              代码书写规范，且信任第三方包的时候，可以使用！

              3. `useBuiltIns`设置为`false`比较不错。  
              在js代码第一行`import '@babel/polyfill'`，或在webpack的入口entry中写入模块`@babel/polyfill`，会将@babel/polyfill整个包全部导入；  
              最安全，但打包体积会大一些，一般不选用。

              需要安装的全部依赖：
              ```js
              npm i babel-loader@8 @babel/core @babel/preset-env -D
              npm i @babel/polyfill
              ```

              .babelrc配置文件
              ```js
              {
                "presets": [
                  [
                    "@babel/preset-env",
                    {
                      "modules": false, // 推荐
                      "useBuiltIns": "entry", // 推荐
                    }
                  ]
                ],
                "plugins": []
              }
              ```

          2. 如果是开发第三方类库 => `@babel/plugin-transform-runtime + @babel/runtime-corejs2`；  
          （或者，不做转码处理，提醒使用者自己做好兼容处理也可以。）

              需要安装的全部依赖：
              ```js
              npm i babel-loader@8 @babel/core @babel/plugin-transform-runtime -D
              npm i @babel/runtime-corejs2
              ```

              .babelrc配置文件
              ```js
              {
                "presets": [],
                "plugins": [
                  [
                    "@babel/plugin-transform-runtime",
                    {
                      "corejs": 2 // 推荐
                    }
                  ]
                ]
              }
              ```

8. babel 官方认为，把不稳定的 stage0-3 作为一种预设是不太合理的，`@babel/preset-env`、`@babel/polyfill`等只支持到`stage-4`级别，因此babel新版本废弃了 stage 预设，转而让用户自己选择使用哪个 proposal 特性的插件，这将带来更多的明确性（用户无须理解 stage，自己选的插件，自己便能明确的知道代码中可以使用哪个特性）。  
所有建议特性的插件，都改变了命名规范，即类似 `@babel/plugin-proposal-function-bind` 这样的命名方式来表明这是个 proposal 阶段特性。  
所以，处于建议阶段的特性，基本都已从`@babel/preset-env`、`@babel/polyfill`等包中被移除，需要自己去另外安装对应的preset、plugin，（一般你能找到的名称里有proposal字样的包，需要自己在`@babel/preset-env`、`@babel/plugin-transform-runtime`以外做配置）。  
各个级别当前可以选用的proposal插件大概如下（[传送门](https://github.com/babel/babel/blob/master/packages/babel-preset-stage-0/README.md)）：
      ```js
      {
        "plugins": [
          // Stage 0
          "@babel/plugin-proposal-function-bind",

          // Stage 1
          "@babel/plugin-proposal-export-default-from",
          "@babel/plugin-proposal-logical-assignment-operators",
          ["@babel/plugin-proposal-optional-chaining", { "loose": false }],
          ["@babel/plugin-proposal-pipeline-operator", { "proposal": "minimal" }],
          ["@babel/plugin-proposal-nullish-coalescing-operator", { "loose": false }],
          "@babel/plugin-proposal-do-expressions",

          // Stage 2
          ["@babel/plugin-proposal-decorators", { "legacy": true }],
          "@babel/plugin-proposal-function-sent",
          "@babel/plugin-proposal-export-namespace-from",
          "@babel/plugin-proposal-numeric-separator",
          "@babel/plugin-proposal-throw-expressions",

          // Stage 3
          "@babel/plugin-syntax-dynamic-import",
          "@babel/plugin-syntax-import-meta",
          ["@babel/plugin-proposal-class-properties", { "loose": false }],
          "@babel/plugin-proposal-json-strings"
        ]
      }
      ```

9. 配置装饰器语法支持
    1. 安装依赖
        ```js
        npm i @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties -D
        ```

    2. .babelrc增加配置
        ```js
        {
          "presets": [],
          "plugins": [
            [
              "@babel/plugin-proposal-decorators",  // @babel/plugin-proposal-decorators需要在@babel/plugin-proposal-class-properties之前
              {
                "legacy": true // 推荐
              }
            ],
            [
              "@babel/plugin-proposal-class-properties",
              {
                "loose": true // babel编译时，对class的属性采用赋值表达式，而不是Object.defineProperty（更简洁）
              }
            ]
          ]
        }
        ```

10. 配置import动态导入支持
    1. 安装依赖
        ```js
        npm i @babel/plugin-syntax-dynamic-import -D
        ```

    2. .babelrc文件增加配置
        ```js
        {
          "presets": [],
          "plugins": [
            "@babel/plugin-syntax-dynamic-import",
          ]
        }
        ```

9. 参考文档
    1. [一文读懂 babel7 的配置文件加载逻辑](https://segmentfault.com/a/1190000018358854)
    2. [babel polyfill 和 runtime 浅析](https://blog.csdn.net/weixin_34163741/article/details/88015827)


## CSS样式的处理（less预编译和postcss工具）

1. 需要安装的依赖包

   ```bash      
   npm i less less-loader css-loader style-loader postcss-loader postcss-import postcss-cssnext cssnano autoprefixer -D
   ```

2. 配置
   
   *默认会将css一起打包到js里，借助mini-css-extract-plugin将css分离出来并自动在生成的html中link引入（过去版本中的extract-text-webpack-plugin已不推荐使用）。*

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
    const styleLoader = process.env.NODE_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader

    {
      test: /\.(less|css)$/,
      use: [styleLoader, 'css-loader', 'postcss-loader', 'less-loader'],
    },
   ```

   ```js
    // 单独使用link标签加载css并设置路径，相对于output配置中的publickPath
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:7].css',  // 注意这里使用的是contenthash，否则任意的js改动，打包时都会导致css的文件名也跟着变动。
      chunkFilename: 'static/css/[name].[contenthash:7].css',
    })
   ```

3. [PostCSS](https://www.webpackjs.com/loaders/postcss-loader/) 本身不会对你的 CSS 做任何事情, 你需要安装一些 plugins 才能开始工作.   
参考文档:   
    - [PostCSS自学笔记（一）【安装使用篇】](https://segmentfault.com/a/1190000010926812),   
    - [展望未来：使用 PostCSS 和 cssnext 书写 CSS](https://www.cnblogs.com/nzbin/p/5744672.html),   
    - [使用PostCSS+cssnext来写css](http://www.zhaiqianfeng.com/2017/07/postcss-autoprefixer-cssnext.html) ),   
    - [PostCSS及其常用插件介绍](http://www.css88.com/archives/7317)   

    使用时在webpack.config.js同级目录新建postcss.config.js文件:
   
   ```js
   module.exports = {
      // parser: 'sugarss', # 一种更简洁的css语法格式
      plugins: {
        'postcss-import': {},
        'postcss-cssnext': {},
        'cssnano': {}
      }
   }
   ```

   *常用的插件*:
   - autoprefixer     ——*插件在编译时自动给css新特性添加浏览器厂商前缀, 因此, 借助[Modernizr](http://modernizr.cn/)来添加厂商前缀已经不需要了( 还是可以用来做js检测浏览器兼容性的 ).*   
   - postcss-cssnext ——*让你使用下一代css语法, 在最新的css规范里, 已经包含了大量less的内置功能*
   - cssnano ——*会压缩你的 CSS 文件来确保在开发环境中下载量尽可能的小*
 
   *其它有用的插件*:   
   - postcss-pxtorem        ——*px单位自动转换rem*
   - postcss-assets         ——*插件用来处理图片和SVG, 类似url-load*
   - postcss-sprites        ——*将扫描你CSS中使用的所有图像，自动生成优化的 Sprites 图像和 CSS Sprites 代码*
   - postcss-font-magician        ——*使用自定义字体时, 自动搞定@font-face声明*
    
   Less是预处理，而PostCSS是后处理，基本支持less等预处理器的功能，自动添加浏览器厂商前缀向前兼容，允许书写下一代css语法 ，可以在编译时去除冗余的css代码，PostCSS 声称比预处理器快 3-30 倍.   **因为PostCSS，可能我们要放弃less/sass/stylus了**。


## 图片、字体、多媒体等文件的处理
   
   1. css中引入的图片( 或其它资源 ) ==> url-loader   
   配置了url-loader以后，webpack编译时可以自动将小图转成base64编码，将大图改写url并将文件生成到指定目录下 ( *file-loader可以完成文件生成，但是不能小图转base64，所以统一用url-loader，但url-loader在处理大图的时候是自动去调用file-loader，所以你仍然需要install file-loader* )。
      
      ```js
      // 处理图片(file-loader来处理也可以，url-loader更适合图片)
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/assets/images/[name].[hash:7].[ext]',
        },
      },
      // 处理多媒体文件
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/assets/media/[name].[hash:7].[ext]',
        },
      },
      // 处理字体文件
      {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
              limit: 10000,
              name: 'static/assets/fonts/[name].[hash:7].[ext]'
          }
      },
      ```
   2. html页面中引入的图片( 或其它资源 ) ==> html-loader   
   css中的图片url-loader处理即可，而html中img标签引入的图片，不做工作的情况下: 图片将不会被处理，路径也不会被改写，即最终编译完成后这部分图片是找不到的，怎么办? [html-loader](https://www.webpackjs.com/loaders/html-loader/) ！( *这个时候你应该是url-loader和html-loader都配置了，所以css中图片、页面引入的图片、css中的字体文件、页面引入的多媒体文件等， 统统都会在编译时被处理* )。
      
      ```js
      // html中引用的静态资源在这里处理,默认配置参数attrs=img:src,处理图片的src引用的资源.
      {
          test: /\.html$/,
          loader: 'html-loader',
          options: {
              // 除了img的src,还可以继续配置处理更多html引入的资源(不能在页面直接写路径,又需要webpack处理怎么办?先require再js写入).
              attrs: ['img:src', 'img:data-src', 'audio:src'],
              minimize: false,
              removeComments: true,
              collapseWhitespace: false
          }
      }
      ```

   3. 有的时候, 图片可能既不在css中, 也不在html中引入, 怎么办?   

       ```js   
       import img from 'xxx/xxx/123.jpg' 或 let img = require('xxx/xxx/123.jpg')
       ```
       js中引用img，webpack将会自动搞定它。

   4. 图片等资源的访问路径问题：    
    经过上面的处理，静态资源处理基本没有问题了，webpack编译时将会将文件打包到你指定的生成目录，但是不同位置的图片路径改写会是一个问题.   
    *全部通过绝对路径访问即可，在output下的publicPath填上适当的server端头，来保证所有静态资源文件路径能被访问到，具体要根据服务器部署的目录结构来做修改。*   
       
       ```js
       output: {
        path: path.resolve(__dirname, 'dist'), // 输出目录的配置，模板、样式、脚本、图片等资源的路径配置都相对于它
        publicPath: '/', // 模板、样式、脚本、图片等资源对应的server上的路径
       }
       ```


## 自动将打包js引入生成的html文件
   
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
        minify: { // 压缩html文件    
            removeComments: true, // 移除html中的注释
            collapseWhitespace: true // 删除空白符与换行符
        }
      })
      ```


## 自动扫描webpack入口文件和html模版文件
   
   - *正常如果有多个入口，需要在entry中，以对象形式将所有入口都配置一遍，html模版目录也需要new很多个HtmlWebpackPlugin来配置对应的页面模版，是否可以自动扫描? 无论多少个入口，只管新建，而不用管理入口配置？可以的！* 
      
     a. 安装node模块glob ( 扫描文件就靠它了 ). 
      
     ```bash
     npm i glob -D
     ```
     ```js
     const glob = require('glob')   
     ```
     b. 自动扫描获取入口文件、html模版（统一放在utils.js文件里）
     ```js
     /**
      * 获取文件
      * @param {String} filesPath 文件目录
      * @returns {Object} 文件集合(文件名: 文件路径)
      */
     const getFiles = filesPath => {
        let files = glob.sync(filesPath)
        let obj = {}
        let filePath, basename, extname

        for (let i = 0; i < files.length; i++) {
          filePath = files[i]
          extname = path.extname(filePath) // 扩展名 eg: .html
          basename = path.basename(filePath, extname) // 文件名 eg: index
          // eg: { index: '/src/views/index/index.js' }
          obj[basename] = path.resolve(appDirectory, filePath)
        }
        return obj
      }

      /**
       * 打包入口
       *  1.允许文件夹层级嵌套;
       *  2.入口js的名称不允许重名;
       */
      const entries = getFiles('src/views/**/*.js')

      /**
       * 页面的模版
       *  1.允许文件夹层级嵌套;
       *  2.html的名称不允许重名;
       */
      const templates = getFiles('src/views/**/*.html')

      /**
       * 获取entry入口，为了处理在某些时候，entry入口会加 polyfill等:
       *  1.允许文件夹层级嵌套;
       *  2.入口的名称不允许重名;
       *
       * @returns {Object} entry 入口列表(对象形式)
       */
      const getEntries = () => {
        let entry = {}

        for(let name in entries) {
          entry[name] = entries[name]
        }
        return entry
      }
     ```
     c. webpack打包入口
     ```js
     module.exports = {
       entry: utils.getEntries(),
     }
     ```
     d. html模版自动引入打包资源（区分dev和prod环境，配置不同，同样抽离到utils.js文件更好一些）
     ```js
     /**
      * 生成webpack.config.dev.js的plugins下new HtmlWebpackPlugin()配置
      * @returns {Array} new HtmlWebpackPlugin()列表
      */
      const getHtmlWebpackPluginsDev = () => {
        let htmlWebpackPlugins = []
        let setting = null

        for(let name in templates) {
          setting = {
            filename: `${name}.html`,
            template: templates[name],
            inject: false, // js插入的位置，true/'head'/'body'/false
          }

          // (仅)有入口的模版自动引入资源
          if (name in getEntries()) {
            setting.chunks = [name]
            setting.inject = true
          }
          htmlWebpackPlugins.push(new HtmlWebpackPlugin(setting))
          setting = null
        }

        return htmlWebpackPlugins
      }

      /**
      * 生成webpack.config.prod.js的plugins下new HtmlWebpackPlugin()配置
      * @returns {Array} new HtmlWebpackPlugin()列表
      */
      const getHtmlWebpackPluginsProd = () => {
        let htmlWebpackPlugins = []
        let setting = null

        for(let name in templates) {
          setting = {
            filename: `${name}.html`,
            template: templates[name],
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            },
            inject: false, // js插入的位置，true/'head'/'body'/false
          }

          // (仅)有入口的模版自动引入资源
          if (name in getEntries()) {
            setting.chunks = ['manifest', 'vendor', 'common', name]
            setting.inject = true
          }
          htmlWebpackPlugins.push(new HtmlWebpackPlugin(setting))
          setting = null
        }

        return htmlWebpackPlugins
      }
     ```


## [如何在webpack中引入未模块化的库，如：Zepto](https://blog.csdn.net/sinat_17775997/article/details/70495891)
   
   *script-loader 把我们指定的模块 JS 文件转成纯字符串, exports-loader将需要的js对象module.exports导出, 以支持import或require导入.*
   
   1. 安装依赖包
      
      ```bash
      npm i script-loader exports-loader -D
      ```

   2. 配置
      
      ```js
      {
        test: require.resolve('zepto'),
        loader: 'exports-loader?window.Zepto!script-loader'
      }
      ```

      > *以上是正常处理一个 *"可以NPM安装但又不符合webpack模块化规范"* 的库, 例如其它库XX, 处理后可以直接 import xx from XX 后使用; 但是, zepto有点特殊, 默认npm安装的包或者从github clone的包, 都是仅包含5个模块, 其它如常用的touch模块是未包含的, 想要正常使用还需做得更多.*

  3. 怎样拿到一个包含更多模块的zepto包 ?
     
     a) [打包出一个包含更多需要模块的zepto包 ](https://www.cnblogs.com/czf-zone/p/4433657.html)  
        从github clone官方的包下来, 找到名为make的文件 ( 在package.json同级目录 ), 用记事本打开, 找到这一行 `modules = (env['MODULES'] || 'zepto event ajax form ie').split(' ')`, 应该是在第41行, 手动修改加入你想要引入的模块, 然后保存;   

     b) 在make文件同级目录 => 右键打开终端或git bash => 敲npm i安装zepto源码需要的node包 ( 这里你应当是已经已安装过nodejs了, 如果没有, 安装好后再做这一步 ), 等待安装结束.

     c) 在刚才打开的 终端/git bash 敲命令 npm run-script dist, 如果没有报错, 你应该在这个打开的文件夹里可以看到生成了一个文件夹 dist, 打开它, 包含新模块的zepto包就在这了, Over !
     
  4. 拿到新的zepto包后, 建议放到自己的src下lib目录( 第三方工具包目录 ), 不再通过npm的方式去安装和更新zepto了 ( *因为将来npm update后的zepto又将缺少模块,将来别人也会出现误操作* ); 现在开始对这个放在lib目录下的zepto.min.js进行处理: 
     
     a) 通过script-loader、exports-loader转成符合webpack模块化规范的包
     ```js
     {
        // # require.resolve()是nodejs用来查找模块位置的方法,返回模块的入口文件
        test: require.resolve('./src/js/lib/zepto.min.js'),
        loader: 'exports-loader?window.Zepto!script-loader'
     }
     ```

     b) 给模块配置别名
     ```js
     resolve: {
        alias: {
            'zepto': path.resolve(__dirname, './src/js/lib/zepto.min.js')
        }
     }
     ```

     c) 自动加载模块, 不再到处import或require
     ```js
     new webpack.ProvidePlugin({
        $: 'zepto',
        Zepto: 'zepto'
     })
     ```

      *大功告成, 现在使用zepto跟你使用jquery或其它node包是一样的开发体验了 !*

     > *以上, 演示的是对于一个第三方库( 不能npm安装,也不符合webpack规范 ), 如何去处理, 达到和正常npm安装一样的开发体验, 仅就zepto来说, npm库有符合webpack规范的不同版本 ([zepto-webpack](https://www.npmjs.com/package/zepto-webpack), 或 [zepto-modules](https://www.npmjs.com/package/zepto-modules)), 有需要可以试试.  
     平时意图使用某个包, 先去[NPM官网](https://www.npmjs.com/)搜一搜比较好.*



## 使用happypack来优化
   
   - [webpack优化之HappyPack 实战](https://www.jianshu.com/p/b9bf995f3712)
   - [happypack 原理解析](https://yq.aliyun.com/articles/67269)


## 使用[cache-loader](https://www.webpackjs.com/loaders/cache-loader/)缓存编译结果


## 配置开发服务器，[webpack-dev-server](https://www.webpackjs.com/configuration/dev-server/)
   
   - 安装依赖包
      
      ```bash
      npm i webpack-dev-server -D
      ```
   - 常用配置
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
   - 运行命令 ( package.json配置命令 => npm run dev )
      ```bash
      "dev": "cross-env NODE_ENV=development webpack-dev-server --mode development --colors --profile"
      ```
     *根据目录结构的不同, contentBase、openPage参数要配置合适的值, 否则运行时应该不会立刻访问到你的首页; 同时要注意你的publicPath, 静态资源打包后生成的路径是一个需要思考的点, 这与你的目录结构有关.*
     

## 配置node express服务，访问打包后资源
   
   1. 新建prod.server.js文件
      
      ```js
      let express = require('express')
      let compression = require('compression')

      let app = express()
      let port = 9898
  
      app.use(compression())
      app.use(express.static('./static/'))
  
      module.exports = app.listen(port, function (err) {
        if (err) {
            console.log(err)
            return
        }
        console.log('Listening at http://localhost:' + port +   '\n')
      })
      ```

   2. 运行命令
       
       ```bash
       node prod.server.js
       ```

   3. 访问路径
       
       ```bash
       localhost:9898/views/
       ```

<br><br>

## http-server，比自己配置一个express服务更简洁的方式，去访问打包后的资源。
  
  1. 安装依赖
     
     ```bash
     npm i http-server -D
     ```
  2. package.json配置命令
     
     ```json
     "server": "http-server static"
     ```
  3. 访问路径
     
     ```bash
     localhost:8080 或 http://127.0.0.1:8080
     ```
     

<br><br>

## 参考文档:
- [webpack中文文档](https://www.webpackjs.com/concepts/) —— 直接阅读它非常有用，百度出来的教程99%都是管中窥豹，只见一斑，会形成误导（不要问我是怎么知道的 -_-）。
- [基于webpack的前端工程化开发之多页站点篇（一）](https://segmentfault.com/a/1190000004511992)
- [基于webpack的前端工程化开发之多页站点篇（二）](https://segmentfault.com/a/1190000004516832)
- [webpack在前端项目中使用心得一二](https://segmentfault.com/a/1190000009243487)
- [NPM中文文档](https://www.npmjs.com.cn/getting-started/what-is-npm/)
- [手摸手，带你用合理的姿势使用webpack4（上）](https://juejin.im/post/5b56909a518825195f499806)
- [手摸手，带你用合理的姿势使用webpack4（下）](https://juejin.im/post/5b5d6d6f6fb9a04fea58aabc)
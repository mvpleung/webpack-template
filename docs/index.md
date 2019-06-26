> WEB前端工程化 —— webpack搭建详解，随着webpack、babel等的版本升级，会持续更新......

## [Babel 7](https://babeljs.io/docs/en/)

> 这是最新的 babel 配置，和网上的诸多教程可能有不同，可以自行测试验证有效性。

1. 基础依赖包

   ```js
   yarn add babel-loader@8 @babel/core -D
   ```

   > 从 babel7 开始，所有的官方插件和主要模块，都放在了 @babel 的命名空间下。从而可以避免在 npm 仓库中 babel 相关名称被抢注的问题。

2. 在 package.json 同级添加.babelrc 配置文件，先空着。

   ```js
   {
     "presets": [],  // 预设
     "plugins": []   // 插件
   }
   ```

3. package.json 文件可以声明需要支持到的浏览器版本

   1. package.json 中声明的 browserslist 可以影响到 babel、postcss，babel 是优先读取.babelrc 文件中@babel/preset-env 的 targets 属性，未定义会读取 package.json 中的 browserslist。  
      为了统一，在 package.json 中定义。

   2. package.json 中定义（推荐）

      ```json
      "browserslist": [
        "> 1%",
        "last 2 versions",
        "not ie <= 8"
      ],
      ```

      > 更多定义格式请查看：[browserslist](https://github.com/browserslist/browserslist)

   3. .babelrc 中定义（不推荐）
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

4. 基本的语法转换，需要添加预设[@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env)

   1. 安装依赖包
      ```sh
      yarn add @babel/preset-env -D
      ```
   2. 添加配置
      ```js
      {
        "presets": [
          [
             "@babel/preset-env",
             {
               "modules": false, // 对ES6的模块文件不做转化，以便使用tree shaking、sideEffects等
             }
          ]
        ],
        "plugins": []
      }
      ```

5. Babel 默认只转换新的 JavaScript 句法（syntax），而不转换新的 API，比如 Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象，以及一些定义在全局对象上的方法（比如 Object.assign）都不会转码。  
   转译新的 API，需要借助polyfill方案去解决，使用`@babel/polyfill`或`@babel/plugin-transform-runtime`，二选一即可。

6. 使用`@babel/polyfill`

    1. 安装依赖包：

       ```js
       yarn add @babel/polyfill  -D
       ```

    2. .babelrc 文件写上配置，@babel/polyfill 不用写入配置，会根据useBuiltIns参数去决定如何被调用。

       ```js
       {
         "presets": [
           [
             "@babel/preset-env",
             {
               "useBuiltIns": "entry",
               "modules": false,
               "corejs": 2, // 新版本的@babel/polyfill包含了core-js@2和core-js@3版本，所以需要声明版本，否则webpack运行时会报warning，此处暂时使用core-js@2版本（末尾会附上@core-js@3怎么用）
             }
           ]
         ]
       }
       ```

    3. [配置参数](https://babeljs.io/docs/en/babel-preset-env)
       1. `modules`，`"amd" | "umd" | "systemjs" | "commonjs" | "cjs" | "auto" | false`，默认值是 auto。  
          用来转换 ES6 的模块语法。如果使用 false，将不会对文件的模块语法进行转化。  
          如果要使用 webpack 中的一些新特性，比如 tree shaking 和 sideEffects，就需要设置为 false，对 ES6 的模块文件不做转化，因为这些特性只对 ES6 的模块有效。
       2. `useBuiltIns`，`"usage" | "entry" | false`，默认值是 false。
          - `false`：需要在 js 代码第一行主动 import '@babel/polyfill'，会将@babel/polyfill 整个包全部导入。  
            （不推荐，能覆盖到所有 API 的转译，但体积最大）
          - `entry`：需要在 js 代码第一行主动 import '@babel/polyfill'，会将 browserslist 环境不支持的所有垫片都导入。  
            （能够覆盖到‘hello‘.includes(‘h‘)这种句法，足够安全且代码体积不是特别大）
          - `usage`：项目里不用主动 import，会自动将代码里已使用到的、且 browserslist 环境不支持的垫片导入。  
            （但是检测不到‘hello‘.includes(‘h‘)这种句法，对这类原型链上的句法问题不会做转译，**书写代码需注意**）
       3. `targets`，用来配置需要支持的的环境，不仅支持浏览器，还支持 node。如果没有配置 targets 选项，就会读取项目中的 browserslist 配置项。
       4. `loose`，默认值是 false，如果 preset-env 中包含的 plugin 支持 loose 的设置，那么可以通过这个字段来做统一的设置。

7. 使用[@babel/plugin-transform-runtime](https://babeljs.io/docs/en/babel-plugin-transform-runtime#docsNav)

    1. 安装依赖包

       ```js
       yarn add @babel/plugin-transform-runtime -D
       ```

       1. 如果配置参数 corejs 未设置或为 false，需安装依赖`@babel/runtime`（这部分代码会被抽离并打包到应用 js 里，所以可以安装在 dependencies 里），仅对 es6 语法转译，而不对新 API 转译。

          ```js
          yarn add @babel/runtime
          ```

       2. 如果配置参数 corejs 设置为 2，需安装依赖`@babel/runtime-corejs2`（同上，推荐安装在 dependencies 里。），对语法、新 API 都转译。
          ```js
          yarn add @babel/runtime-corejs2
          ```
       3. 推荐使用`corejs:2`，但是，检测不到`‘hello‘.includes(‘h‘)`这种句法，所以存在一定隐患，书写代码时需注意。

       4. [@babel/runtime](https://babeljs.io/docs/en/babel-runtime)和[@babel/runtime-corejs2](https://babeljs.io/docs/en/babel-runtime-corejs2)这两个库唯一的区别是：corejs2 这个库增加了对 core-js（用来对 ES6 各个语法 polyfill 的库）这个库的依赖，所以在 corejs 为 false 的情况下，只能做语法的转换，并不能 polyfill 任何新 API。

    2. .babelrc 文件写上配置

       ```js
       {
         "presets": [
           [
             "@babel/preset-env",
             {
               "modules": false
             }
           ]
         ],
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
       1. `corejs`，默认值是 false，只对语法进行转换，不对新 API 进行处理；当设置为 2 的时候，需要安装`@babel/runtime-corejs2`，这时会对 api 进行处理。
       2. `helpers`，默认值是 true，用来开启是否使用 helper 函数来重写语法转换的函数。
       3. `useESModules`，默认值是 false，是否对文件使用 ES 的模块语法，使用 ES 的模块语法可以减少文件的大小。

8. `@babel/polyfill`还是`@babel/plugin-transform-runtime`？ ([传送门一：babel polyfill 和 runtime 浅析](https://blog.csdn.net/weixin_34163741/article/details/88015827)，[传送门二](https://www.junorz.com/archives/689.html))

    1.  `@babel/preset-env + @babel/polyfill`可以转译语法、新 API，但存在污染全局问题；

    2.  `@babel/preset-env + @babel/plugin-transform-runtime + @babel/runtime-corejs2`，可按需导入，转译语法、新 API，且避免全局污染（babel7 中@babel/polyfill 是@babel/runtime-corejs2 的别名），但是检测不到‘hello‘.includes(‘h‘)这种句法；

    3.  @babel/polyfill 和@babel/runtime-corejs2 都使用了 core-js(v2)这个库来进行 api 的处理。  
    core-js(v2)这个库有两个核心的文件夹，分别是 library 和 modules。@babel/runtime-corejs2 使用 library 这个文件夹，@babel/polyfill 使用 modules 这个文件夹。

        1.  library 使用 helper 的方式，局部实现某个 api，不会污染全局变量； 
        2. modules 以污染全局变量的方法来实现 api；
        3.  library 和 modules 包含的文件基本相同，最大的不同是\_export.js 这个文件：

            ```js
            // core-js/modules/_exports.js
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

            ```js
            // core-js/library/_exports.js
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
          1. 如果是自己的应用 => `@babel/preset-env + @babel/polyfill`，根据useBuiltIns参数确定如何使用@babel/polyfill。
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
              yarn add babel-loader@8 @babel/core @babel/preset-env -D
              yarn add @babel/polyfill
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
                      "corejs": 2, // 新版本的@babel/polyfill包含了core-js@2和core-js@3版本，所以需要声明版本，否则webpack运行时会报warning，此处暂时使用core-js@2版本（末尾会附上@core-js@3怎么用）
                    }
                  ]
                ],
                "plugins": []
              }
              ```

          2. 如果是开发第三方类库 => `@babel/preset-env + @babel/plugin-transform-runtime + @babel/runtime-corejs2`；
          （或者，不做转码处理，提醒使用者自己做好兼容处理也可以。）

              需要安装的全部依赖：
              ```js
              yarn add babel-loader@8 @babel/core @babel/preset-env @babel/plugin-transform-runtime -D
              yarn add @babel/runtime-corejs2
              ```

              .babelrc配置文件
              ```js
              {
                "presets": [
                  [
                    "@babel/preset-env",
                    {
                      "modules": false,
                    }
                  ]
                ],
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

9. babel 官方认为，把不稳定的 stage0-3 作为一种预设是不太合理的，`@babel/preset-env`、`@babel/polyfill`等只支持到`stage-4`级别，因此 babel 新版本废弃了 stage 预设，转而让用户自己选择使用哪个 proposal 特性的插件，这将带来更多的明确性（用户无须理解 stage，自己选的插件，自己便能明确的知道代码中可以使用哪个特性）。  
    所有建议特性的插件，都改变了命名规范，即类似 `@babel/plugin-proposal-function-bind` 这样的命名方式来表明这是个 proposal 阶段特性。  
    所以，处于建议阶段的特性，基本都已从`@babel/preset-env`、`@babel/polyfill`等包中被移除，需要自己去另外安装对应的 preset、plugin，（一般你能找到的名称里有 proposal 字样的包，需要自己在`@babel/preset-env`、`@babel/plugin-transform-runtime`以外做配置）。  
    各个级别当前可以选用的 proposal 插件大概如下（[传送门](https://github.com/babel/babel/blob/master/packages/babel-preset-stage-0/README.md)）：

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

10. 配置装饰器语法支持

    1. 安装依赖

       ```js
       yarn add @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties -D
       ```

    2. .babelrc 增加配置
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

11. 配置 import 动态导入支持

    1. 安装依赖

       ```js
       yarn add @babel/plugin-syntax-dynamic-import -D
       ```

    2. .babelrc 文件增加配置
       ```js
       {
         "presets": [],
         "plugins": [
           "@babel/plugin-syntax-dynamic-import",
         ]
       }
       ```

12. 以上是core-js@2的配置，而core-js@3的更新，带来了新的变化，**@babel/polyfill无法提供core-js@2向core-js@3过渡，所以现在有新的方案去替代@babel/polyfill，**（需要Babel版本升级到7.4.0及以上）。
    1. 相关文档：
       1. [作者的官方阐述](https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md)
       2. [Babel 7.4.0版本的更新内容，及官方的升级建议](https://babeljs.io/blog/2019/03/19/7.4.0)
       3. [core-js@2向core-js@3升级，官方的Pull request](https://github.com/babel/babel/pull/7646)

    2. @babel/preset-env也因core-js@3的原因，需要配置corejs参数，否则webpack运行时会报warning；

    3. @babel/polyfill不必再安装，转而需要依靠`core-js`和`regenerator-runtime`（详细原因请看作者的阐述），替代方案用法如下：

       1. 安装依赖
          ```sh
          yarn add babel-loader@8 @babel/core @babel/preset-env -D
          yarn add core-js regenerator-runtime
          ```
       2. .babelrc配置
          ```js
          {
            "presets": [
              [
                "@babel/preset-env",
                {
                  "modules": false, // 对ES6的模块文件不做转化，以便使用tree shaking、sideEffects等
                  "useBuiltIns": "entry", // browserslist环境不支持的所有垫片都导入
                  // https://babeljs.io/docs/en/babel-preset-env#usebuiltins
                  // https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md
                  "corejs": {
                    "version": 3, // 使用core-js@3
                    "proposals": true,
                  }
                }
              ]
            ],
            "plugins": []
          }
          ```
        3. js代码里取代原先的`import '@babel/polyfill'`，做如下修改：
           ```js
           import "core-js/stable"
           import "regenerator-runtime/runtime"
           ```

    4. 而使@babel/plugin-transform-runtime，也随着core-js@3有更新：
       1. 安装依赖
          ```sh
          yarn add babel-loader@8 @babel/core @babel/preset-env @babel/plugin-transform-runtime -D
          yarn add @babel/runtime-corejs3
          ```

       2. .babelrc文件配置
          ```js
          {
            "presets": [
              [
                "@babel/preset-env",
                {
                  "modules": false,
                }
              ]
            ],
            "plugins": [
              [
                "@babel/plugin-transform-runtime",
                {
                  "corejs": {
                    "version": 3,
                    "proposals": true
                  },
                  "useESModules": true
                }
              ]
            ]
          }
          ```



## 自动扫描 webpack 入口文件和 html 模版文件

- _正常如果有多个入口，需要在 entry 中，以对象形式将所有入口都配置一遍，html 模版目录也需要 new 很多个 HtmlWebpackPlugin 来配置对应的页面模版，是否可以自动扫描? 无论多少个入口，只管新建，而不用管理入口配置？可以的！_

  a. 安装 node 模块 glob ( 扫描文件就靠它了 ).

  ```bash
  yarn add glob -D
  ```

  ```js
  const glob = require('glob')
  ```

  b. 自动扫描获取入口文件、html 模版（统一放在 utils.js 文件里）

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

    for (let name in entries) {
      entry[name] = entries[name]
    }
    return entry
  }
  ```

  c. webpack 打包入口

  ```js
  module.exports = {
    entry: utils.getEntries(),
  }
  ```

  d. html 模版自动引入打包资源（区分 dev 和 prod 环境，配置不同，同样抽离到 utils.js 文件更好一些）

  ```js
  /**
   * 生成webpack.config.dev.js的plugins下new HtmlWebpackPlugin()配置
   * @returns {Array} new HtmlWebpackPlugin()列表
   */
  const getHtmlWebpackPluginsDev = () => {
    let htmlWebpackPlugins = []
    let setting = null

    for (let name in templates) {
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

    for (let name in templates) {
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


## CSS 样式的处理（less 预编译和 postcss 工具）

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

## 图片、字体、多媒体等资源的处理

1.  css 中引入的图片( 或其它资源 ) ==> url-loader  
    配置了 url-loader 以后，webpack 编译时可以自动将小图转成 base64 编码，将大图改写 url 并将文件生成到指定目录下 ( _file-loader 可以完成文件生成，但是不能小图转 base64，所以统一用 url-loader，但 url-loader 在处理大图的时候是自动去调用 file-loader，所以你仍然需要 install file-loader_ )。
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
2.  html 页面中引入的图片( 或其它资源 ) ==> html-loader  
    css 中的图片 url-loader 处理即可，而 html 中 img 标签引入的图片，不做工作的情况下: 图片将不会被处理，路径也不会被改写，即最终编译完成后这部分图片是找不到的，怎么办? [html-loader](https://www.webpackjs.com/loaders/html-loader/) ！( _这个时候你应该是 url-loader 和 html-loader 都配置了，所以 css 中图片、页面引入的图片、css 中的字体文件、页面引入的多媒体文件等， 统统都会在编译时被处理_ )。

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

3.  有的时候, 图片可能既不在 css 中, 也不在 html 中引入, 怎么办?

    ```js
    import img from 'xxx/xxx/123.jpg' 或 let img = require('xxx/xxx/123.jpg')
    ```

    js 中引用 img，webpack 将会自动搞定它。

4.  图片等资源的访问路径问题：  
    经过上面的处理，静态资源处理基本没有问题了，webpack 编译时将会将文件打包到你指定的生成目录，但是不同位置的图片路径改写会是一个问题.  
    _全部通过绝对路径访问即可，在 output 下的 publicPath 填上适当的 server 端头，来保证所有静态资源文件路径能被访问到，具体要根据服务器部署的目录结构来做修改。_
    ```js
    output: {
     path: path.resolve(__dirname, 'dist'), // 输出目录的配置，模板、样式、脚本、图片等资源的路径配置都相对于它
     publicPath: '/', // 模板、样式、脚本、图片等资源对应的server上的路径
    }
    ```

## 自动将打包 js 引入生成的 html 文件

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


## [如何在 webpack 中引入未模块化的库，如：Zepto](https://blog.csdn.net/sinat_17775997/article/details/70495891)

_script-loader 把我们指定的模块 JS 文件转成纯字符串, exports-loader 将需要的 js 对象 module.exports 导出, 以支持 import 或 require 导入._

1.  安装依赖包

    ```bash
    yarn add script-loader exports-loader -D
    ```

2.  配置

    ```js
    {
      test: require.resolve('zepto'),
      loader: 'exports-loader?window.Zepto!script-loader'
    }
    ```

    > _以上是正常处理一个 _"可以 NPM 安装但又不符合 webpack 模块化规范"_ 的库, 例如其它库 XX, 处理后可以直接 import xx from XX 后使用; 但是, zepto 有点特殊, 默认 npm 安装的包或者从 github clone 的包, 都是仅包含 5 个模块, 其它如常用的 touch 模块是未包含的, 想要正常使用还需做得更多._

3.  怎样拿到一个包含更多模块的 zepto 包 ?

    a) [打包出一个包含更多需要模块的 zepto 包 ](https://www.cnblogs.com/czf-zone/p/4433657.html)  
     从 github clone 官方的包下来, 找到名为 make 的文件 ( 在 package.json 同级目录 ), 用记事本打开, 找到这一行 `modules = (env['MODULES'] || 'zepto event ajax form ie').split(' ')`, 应该是在第 41 行, 手动修改加入你想要引入的模块, 然后保存;

    b) 在 make 文件同级目录 => 右键打开终端或 git bash => 敲 yarn add 安装 zepto 源码需要的 node 包 ( 这里你应当是已经已安装过 nodejs 了, 如果没有, 安装好后再做这一步 ), 等待安装结束.

    c) 在刚才打开的 终端/git bash 敲命令 npm run-script dist, 如果没有报错, 你应该在这个打开的文件夹里可以看到生成了一个文件夹 dist, 打开它, 包含新模块的 zepto 包就在这了, Over !

4.  拿到新的 zepto 包后, 建议放到自己的 src 下 lib 目录( 第三方工具包目录 ), 不再通过 npm 的方式去安装和更新 zepto 了 ( _因为将来 npm update 后的 zepto 又将缺少模块,将来别人也会出现误操作_ ); 现在开始对这个放在 lib 目录下的 zepto.min.js 进行处理:

    a) 通过 script-loader、exports-loader 转成符合 webpack 模块化规范的包

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

    c) 自动加载模块, 不再到处 import 或 require

    ```js
    new webpack.ProvidePlugin({
      $: 'zepto',
      Zepto: 'zepto',
    })
    ```

    _大功告成, 现在使用 zepto 跟你使用 jquery 或其它 node 包是一样的开发体验了 !_

    > _以上, 演示的是对于一个第三方库( 不能 npm 安装,也不符合 webpack 规范 ), 如何去处理, 达到和正常 npm 安装一样的开发体验, 仅就 zepto 来说, npm 库有符合 webpack 规范的不同版本 ([zepto-webpack](https://www.npmjs.com/package/zepto-webpack), 或 [zepto-modules](https://www.npmjs.com/package/zepto-modules)), 有需要可以试试.  
    > 平时意图使用某个包, 先去[NPM 官网](https://www.npmjs.com/)搜一搜比较好._


## 打包时排除应用中的某些模块

> 某些时候，应用中依赖了某些模块，但希望将这些模块独立通过CDN引入，以减小包的体积，所以不必将这些模块打包，例如：jQuery。  
特定场景下，这个功能会有用武之地！

```js
module.exports = {
  ...
  output: {
    ...
  },
  externals: {
    jquery: "jQuery"
  },
  ...
}
```


## webpack打包js库

> 通常打包js库会选择rollup，但是webpack同样可以做到，如果是需要对css、图片等有较多应用的js库，webpack会有更多优势。

1. 配置
    > [umd](https://github.com/umdjs/umd) —— 打包出所有环境都可以使用的包

    ```js
    module.exports = {
      ...
      entry: {
        sdk: 'xxxxxxx.js',
      },
      output: {
        ...
        library: '[name]',
        libraryTarget: 'umd',
        libraryExport: 'default', 
        umdNamedDefine: true, // 会对 UMD 的构建过程中的 AMD 模块进行命名，否则就使用匿名的 define
      },
      ...
    }
    ```

2. 代码里导出

    ```js
    export default {
      a: xxxx,
      b: xxxx,
      c: xxxx,
    }
    ```

3. build打包后的js，将支持import、requrie导入，script标签导入，可以通过window.sdk使用等：
    
    ```js
    // import
    import { a, b, c } from '........js'

    // require
    const anything = require('........js')

    // window
    window.sdk
    window.sdk.a

    // node
    global.sdk
    global.sdk.a
    ```

4. 相关文档：

    - [怎样打包一个library？](https://webpack.docschina.org/guides/author-libraries)
    - [一次打包暴露多个库](https://github.com/webpack/webpack/tree/master/examples/multi-part-library)


## 配置开发服务器，[webpack-dev-server](https://www.webpackjs.com/configuration/dev-server/)

- 安装依赖包
  ```bash
  yarn add webpack-dev-server -D
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
- 运行命令 ( package.json 配置命令 => npm run dev )

  ```bash
  "dev": "cross-env BUILD_ENV=development webpack-dev-server --mode development --colors --profile"
  ```

  _根据目录结构的不同, contentBase、openPage 参数要配置合适的值, 否则运行时应该不会立刻访问到你的首页; 同时要注意你的 publicPath, 静态资源打包后生成的路径是一个需要思考的点, 这与你的目录结构有关._

## 配置 node express 服务，访问打包后资源

1.  新建 prod.server.js 文件

    ```js
    let express = require('express')
    let compression = require('compression')

    let app = express()
    let port = 9898

    app.use(compression())
    app.use(express.static('./static/'))

    module.exports = app.listen(port, function(err) {
      if (err) {
        console.log(err)
        return
      }
      console.log('Listening at http://localhost:' + port + '\n')
    })
    ```

2.  运行命令

    ```bash
    node prod.server.js
    ```

3.  访问路径
    ```bash
    localhost:9898/views/
    ```

## http-server

> 比自己配置一个 express 服务更简洁的方式，去访问打包后的资源。

1. 安装依赖

   ```bash
   yarn add http-server -D
   ```

2. package.json 配置命令

   ```json
   "scripts": {
      "http-server": "http-server dist"
   }
   ```

3. 访问路径

   ```bash
   localhost:8080 或 http://127.0.0.1:8080
   ```

## 集成eslint

1. 安装依赖

    ```bash
    yarn add eslint eslint-loader eslint-friendly-formatter babel-eslint -D
    ```

    > eslint-friendly-formatter，指定终端中输出eslint提示信息的格式。  

2. 增加配置

    ```js
    {
        test: /\.js$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        include: [paths.appSrc],
        exclude: [
          /node_modules/,
        ],
        options: {
          formatter: require('eslint-friendly-formatter'),
        },
      },
    ```

3. `package.json`文件同级增加文件`.eslintrc.js`

    ```js
    module.exports = {
        "root": true, 
        "parserOptions": {
            "sourceType": "module",
        },
        "parser": "babel-eslint", // eslint未支持的js新特性先进行转换
        "env": {
            "browser": true,
            "es6": true,
            "node": true,
            "shared-node-browser": true,
            "commonjs": true,
        },
        "globals": {    // 设置全局变量（false：不允许重写；）
            "BUILD_ENV": false,
        },
        "extends": "eslint:recommended", // 使用官方推荐规则，使用其他规则，需要先install，再指定。
        "rules": {
            
        }
    }
    ```

    **配置项含义：**
    
    - root 限定配置文件的使用范围
    - parser 指定eslint的解析器
    - parserOptions 设置解析器选项
    - extends 指定eslint规范
    - plugins 引用第三方的插件
    - env   指定代码运行的宿主环境
    - rules 启用额外的规则或覆盖默认的规则
    - globals 声明在代码中的自定义全局变量

4. [ESLint官方的rules列表](https://cn.eslint.org/docs/rules/)

5. 如果有需要跳过检查的文件/文件夹，新建`.eslintignore`文件

    ```md
    /node_modules
    ```

6. 参考文档

    1. [webpack引入eslint详解](https://www.jianshu.com/p/33597b663481)
    2. [babel-eslint](https://www.jianshu.com/p/72169a86990f)

## 常见性能优化

1. 使用happypack来优化，多进程运行编译，参考文档：

    - [webpack 优化之 HappyPack 实战](https://www.jianshu.com/p/b9bf995f3712)
    - [happypack 原理解析](https://yq.aliyun.com/articles/67269)

2. 使用[cache-loader](https://www.webpackjs.com/loaders/cache-loader/)缓存编译结果

3. [DllPlugin](https://segmentfault.com/a/1190000015489489)拆分基础包

<br><br>

## 参考文档

1. [webpack 中文文档](https://www.webpackjs.com/concepts/) —— 直接阅读它非常有用，百度出来的教程 99%都是管中窥豹，只见一斑，会形成误导（不要问我是怎么知道的 -\_-）。
2. [NPM 中文文档](https://www.npmjs.com.cn/getting-started/what-is-npm/)
3. [基于 webpack 的前端工程化开发之多页站点篇（一）](https://segmentfault.com/a/1190000004511992)
4. [基于 webpack 的前端工程化开发之多页站点篇（二）](https://segmentfault.com/a/1190000004516832)
5. [webpack 在前端项目中使用心得一二](https://segmentfault.com/a/1190000009243487)
6. [webpack4配置详解之逐行分析](https://segmentfault.com/a/1190000016969897)
7. [手摸手，带你用合理的姿势使用 webpack4（上）](https://juejin.im/post/5b56909a518825195f499806)
8. [手摸手，带你用合理的姿势使用 webpack4（下）](https://juejin.im/post/5b5d6d6f6fb9a04fea58aabc)
9. [一文读懂 babel7 的配置文件加载逻辑](https://segmentfault.com/a/1190000018358854)
10. [babel polyfill 和 runtime 浅析](https://blog.csdn.net/weixin_34163741/article/details/88015827)

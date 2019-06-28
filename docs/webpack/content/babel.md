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
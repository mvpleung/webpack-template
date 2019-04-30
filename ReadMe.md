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

## [Babel转码](https://babeljs.io/docs/en/)
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
    1. package.json中声明的browserslist可以影响到babel、postcss，babel是优先读取.babelrc文件中@babel/preset-env的targets属性，未定义会读取package.json中的browserslist。  
    为了统一，会在package.json中统一定义。

    2. package.json中定义（推荐）
        ```json
        "browserslist": [
          "> 1%",
          "last 2 versions",
          "not ie <= 8"
        ],
        ```

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
            （**推荐**，能够覆盖到‘hello‘.includes(‘h‘)这种句法，足够安全且代码体积不是特别大）
            - `usage`：项目里不用主动import，会自动将代理已使用到的、且browserslist环境不支持的垫片导入。  
            （推荐，但是检测不到‘hello‘.includes(‘h‘)这种句法，对这类原型链上的句法问题不会做转译，**书写代码需注意**）
        3. `targets`，用来配置需要支持的的环境，不仅支持浏览器，还支持node。如果没有配置targets选项，就会读取项目中的browserslist配置项。
        4. `loose`，默认值是false，如果preset-env中包含的plugin支持loose的设置，那么可以通过这个字段来做统一的设置。

6. 使用[@babel/plugin-transform-runtime](https://babeljs.io/docs/en/babel-plugin-transform-runtime#docsNav)
    1. 安装依赖包
        ```js
        npm i @babel/plugin-transform-runtime -D
        ```

        1. 如果配置参数corejs未设置或为false，需安装依赖`@babel/runtime`（这部分代码会被抽离并打包到应用js里，所以可以安装在dependencies里），自动调用  
        **备注：corejs:false，仅对es6语法转译，而不对新API转译！！**
            ```js
            npm i @babel/runtime
            ```

        2. 如果配置参数corejs设置为2，需安装依赖`@babel/runtime-corejs2`（同上，推荐安装在dependencies里。）  
        **备注：corejs:2，对语法、新API都转译。**
            ```js
            npm i @babel/runtime-corejs2
            ```
        3. 推荐使用`corejs:2`，但是，检测不到‘hello‘.includes(‘h‘)这种句法，所以存在一定隐患，书写代码时需注意。

        4. [@babel/runtime](https://babeljs.io/docs/en/babel-runtime)和[@babel/runtime-corejs2](https://babeljs.io/docs/en/babel-runtime-corejs2)这两个库唯一的区别是：corejs2这个库增加了对core-js（用来对ES6各个语法polyfill的库）这个库的依赖，所以在corejs为false的情况下，只能做语法的转换，并不能polyfill任何新API。

    2. .babelrc文件写上配置
        ```js
        {
          "presets": [],
          "plugins": [
            [
              "@babel/plugin-transform-runtime",
              {
                "corejs": 2 // 推荐2
              }
            ]
          ]
        }
        ```

    3. [配置参数](https://babeljs.io/docs/en/babel-plugin-transform-runtime#docsNav)
        1. `corejs`，默认值是false，只对语法进行转换，不对新API进行处理；当设置为2的时候，需要安装`@babel/runtime-corejs2`，这时会对api进行处理。
        2. `helpers`，默认值是true，用来开启是否使用helper函数来重写语法转换的函数。
        3. `useESModules`，默认值是false，是否对文件使用ES的模块语法，使用ES的模块语法可以减少文件的大小。

7. `@babel/preset-env`还是`@babel/plugin-transform-runtime`？
    1. `@babel/preset-env + @babel/polyfill`可以转译语法、新API，但存在污染全局问题；
    
    2. `@babel/plugin-transform-runtime + @babel/runtime-corejs2`，可按需导入，转译语法、新API，且避免全局污染（babel7中@babel/polyfill是@babel/runtime-corejs2的别名），但是检测不到‘hello‘.includes(‘h‘)这种句法；

    3. @babel/polyfill和@babel/runtime-corejs2都使用了core-js(v2)这个库来进行api的处理。  
    core-js(v2)这个库有两个核心的文件夹，分别是library和modules。@babel/runtime-corejs2使用library这个文件夹，@babel/polyfill使用modules这个文件夹。  
        1. library使用helper的方式，局部实现某个api，不会污染全局变量；
        2. modules以污染全局变量的方法来实现api；  
        3. library和modules包含的文件基本相同，最大的不同是_export.js这个文件：  
              1. core-js/modules/_exports.js文件如下：
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

              2. core-js/library/_exports.js文件如下：
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
          - 如果是自己的应用 => `@babel/preset-env + @babel/polyfill`  
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

          - 如果是开发第三方类库 => `@babel/plugin-transform-runtime + @babel/runtime-corejs2`；  
          （或者，不做转码处理，提醒使用者自己做好兼容处理也可以。）

8. 参考文档
    1. [一文读懂 babel7 的配置文件加载逻辑](https://segmentfault.com/a/1190000018358854)
    2. [babel polyfill runtime 浅析](https://blog.csdn.net/weixin_34163741/article/details/88015827)
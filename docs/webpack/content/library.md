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

4. 参考文档：  
    1. [怎样打包一个library？](https://webpack.docschina.org/guides/author-libraries)
    2. [一次打包暴露多个库](https://github.com/webpack/webpack/tree/master/examples/multi-part-library)
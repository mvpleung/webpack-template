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
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
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
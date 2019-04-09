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
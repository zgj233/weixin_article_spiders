# weixin
> A spiders' program for weixin which made by Express &amp; cheerio

1. 这个爬虫小软件，通过调用 “搜狗” 微信搜索的接口，捕获到相应的资源。
2. 通过cheerio对文章进行筛选。
3. 通过 fs 模块 在 res 文件夹下生成对应的 JSON 和 img 资源。

**注意** 这个小软件分为 通过关键词查询列表 和 通过**指定**的 url 查单个文章

*只能是指定的单个微信文章页面的网址*

### 如何运行
npm install

然后运行
node app.js

登录 [http://localhost:3000](http://localhost:3000)

# weixin
> A spiders' program for weixin which made by Express &amp; cheerio

1. 这个爬虫小软件，通过调用 “搜狗” 微信搜索的接口，捕获到相应的资源。
2. 通过cheerio对文章进行筛选。
3. 通过 fs 模块 在 res 文件夹下生成对应的 JSON 和 img 资源。

**注意**这个小软件分为
+ 通过关键词查询列表
+ 通过**指定**的 url 查单个文章，须是单个文章的网址，文章列表的网址**不行**


**捕获的资源**
+ 通过关键词搜索出来的微信文章列表会保存在 /res/list 下面
    + 在文章列表中选择 “抓取此条” 之后，会将此条文章保存在 /res/oneArticle 下面
+ 通过 指定 url 抓取出来的 图片和文章会保存到 /res/img-txt 下面

### 如何运行
npm install

然后运行
node app.js

登录 [http://localhost:3000](http://localhost:3000)

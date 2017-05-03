/**
 * Created by zgj on 2017/3/28.
 */
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
require('../tool/babelTime');

var keywordDao = {
    query: function (req, res, next) {
        var urlStr = 'http://weixin.sogou.com/weixin'+
            '?type=' + req.query.type +
            '&query=' + encodeURI(req.query.name);
        request(urlStr, function (err, response, body) {
            if (err) {
                res.send({
                    code: 500,
                    msg: err
                })
            }
            else {
                filterWeixinArticle(body, res);
            }
        })
    },
    get_one :function (req, res, next) {
        var urlStr = req.body.link;
        request(urlStr, function (err, response, body) {
            if (err) {
                res.send({
                    code: 500,
                    msg: err
                })
            }
            else {
                filterOneArticle(body, res);
            }
        })
    }
}

function filterWeixinArticle(html, response) {
    var $ = cheerio.load(html);
    var items = $('#main').find('.txt-box');

    var articalArr = [];
    var title, t_url, id, about, author, timeStamp;
    var articleItem = {};
    var thisItem;

    items.each(function () {
        thisItem = $(this);
        // 文章标题
        title = thisItem.find('h3').text();
        // 文章链接
        t_url = thisItem.find('h3').find('a').attr('href');
        // 文章 id
        id = thisItem.find('h3').find('a').attr('id');

        //文章简介
        about = thisItem.find('p.txt-info').text();

        //文章来源
        author = thisItem.find('.s-p').find('a').text();
        //文章时间
        timeStamp = thisItem.find('.s-p').find('span.s2').html();

        articleItem = {
            article_id: id,
            title: title,
            t_url: t_url,
            about: about,
            article_from: author,
            timeStamp: timeStamp
        };
        articalArr.push(articleItem);
        articleItem = {};

    });
    response.send({
        code: 200,
        rows: articalArr
    });

    //写入文件
    var date = new Date();
    var d_str = date.Format('yyyy-MM-dd_hh-mm-ss_S');
    fs.writeFile('./res/list/'+ d_str + '.json', JSON.stringify(articalArr),  function(err) {
        if (err) {
            console.log(err);
        }
    });
}

function filterOneArticle(html,response){
    var $ = cheerio.load(html);
    var time = $('#post-date').text();
    var author = $('#post-date').next('em').text();
    var items = $('#js_content').find('p');
    var info = [];
    var txt;
    var thisItem;
    items.each(function(){
        thisItem = $(this);
        txt = thisItem.text();
        if(txt){
            info.push(txt)
        }
        else {
        }
    });
    var article ={
        time: time,
        author :author,
        info :info
    };
    response.send({
        code: 200,
        rows: article
    });

    //写入文件
    var date = new Date();
    var d_str = date.Format('yyyy-MM-dd_hh-mm-ss_S');
    fs.writeFile('./res/oneArticle/'+ d_str + '.json', JSON.stringify(article),  function(err) {
        if (err) {
            console.log(err);
        }
    });
}

module.exports = keywordDao;
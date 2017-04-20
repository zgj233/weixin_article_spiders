/**
 * Created by zgj on 2017/3/28.
 */
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var async = require('async');
require('../tool/babelTime');

var articalDao = {
    query: function (req, res, next) {
        var urlStr = req.query.url;
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
}

function filterWeixinArticle(html, res) {
    var $ = cheerio.load(html);
    /*var items = $('#main').find('.txt-box');
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
     });*/

    var main = $('#js_article');

    var imgPathArr = main.find('img');
    var imgPath;
    var imgtype;
    var o;
    var srcArr = [];

    var back_img1;
    var back_img2;
    var len2;
    var back_img3;
    var back_arr = [];
    imgPathArr.each(function () {
        imgPath = $(this).attr('data-src');
        imgtype = $(this).attr('data-type');
        if (imgPath && imgtype) {
            back_img1 = imgPath.split('?');
            back_img2 = back_img1[0].toString().split('/');
            len2 = back_img2.length;
            back_img2[len2-1] = '640';
            back_img3 = back_img2.join('/') + '?' + back_img1[1].toString() + '&tp=webp&wxfrom=5&wx_lazy=1';
            back_arr.push(back_img3);
            o = {
                'url': imgPath,
                'type': imgtype
            };
            srcArr.push(o);
            o = {};
        }
    });

    var my_title = $('#activity-name').text();
    var my_user = $('#post-user').text();
    var my_em_arr = [];
    var my_em;
    $('#img-content').find('em').each(function () {
        my_em = $(this);
        if (my_em.text() && my_em.text().length > 0) {
            my_em_arr.push(my_em.text());
        }

    });
    var my_span_arr = [];
    var my_span;
    var order = 0;
    var isort = 0; //用来表示back_arr 的索引
    var h;
    $('#img-content').find('p').each(function () {
        my_span = $(this);
        if ((my_span.text() && my_span.text().length > 0)&&(my_span.text() !== " ")) {
            h = {
                'content':my_span.text(),
                'contentType':0,
                'order':order
            };
            my_span_arr.push(h);
            h = {};
            order++;
        }

        if(my_span.children('img').length){
            h = {
                'content':back_arr[isort],
                'contentType':1,
                'order':order
            };
            my_span_arr.push(h);
            h = {};
            isort++;
            order++;
        }
    });
    var my = {
        title: my_title,
        cover: back_arr[0],
        summary: my_span_arr[1].content,
        author: my_user,
        time: my_em_arr[0],
        entry: my_span_arr,
    };

    res.send({
        code: 200,
        rows: my,
    });

    //写入文件
    var date = new Date();
    var d_str = date.Format('yyyy-MM-dd_hh-mm-ss');
    var i = 1;
    var filename, i_url, i_type;
    async.each(srcArr,
        function (imgItem, callback) {
            i_url = imgItem.url;
            i_type = imgItem.type;
            filename = './res/list/' + d_str + 'img_' + i + '.' + i_type;
            request
                .get(i_url, function (err) {
                    if (err) {
                        console.log(err);
                    }
                })
                .on('error', function (err) {
                    console.log(err)
                })
                .pipe(fs.createWriteStream(filename));

            callback();
            i++;
        },
        function (err) {
            if (err) {
                console.log(err);
            }
            else {
                console.log('所有图片已经写入完毕');
            }

        }
    );

    fs.writeFile('./res/list/' + d_str + '.json', JSON.stringify(my), function (err) {
        if (err) {
            console.log(err);
        }
    });
}

module.exports = articalDao;
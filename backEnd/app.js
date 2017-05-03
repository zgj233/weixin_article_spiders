var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var articalDao = require('./dao/artical');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});

app.get('/article',function(req, res, next){
   articalDao.query(req, res, next);
});
app.post('/articleOne',function(req, res, next){
    articalDao.get_one(req, res, next);
});
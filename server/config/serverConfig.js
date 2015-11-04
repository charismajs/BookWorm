/**
 * Created by LuckyJS on 15. 10. 30..
 */
var express = require('express');
var engines = require('consolidate');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');


var app = express();
var server = require('http').createServer(app);

var config = require('./config');
var router = require('./../routers/router')(express, config);

app.use(express.static(config.path.client));
app.use(logger('combined'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/', router);

app.set('views', path.join(config.path.server, '/views'));
app.set('view engine', 'jade');
app.engine('html', engines.jade);

var start = function() {
  server.listen(config.port, function() {
    console.log('\n========== Server is running ==========');
    console.log("Server's Info : " + config.server + ':' + config.port);
    console.log('=======================================\n');
  });
};

exports.start = start;
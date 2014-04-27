var express = require('express');
var controllers = require('./controllers')

var host = '127.0.0.1';
var port = 5000;

express()
.set('view engine', 'ejs')
.use(express.bodyParser())
.get('/', controllers.index)
.post ('/user',controllers.createUser)
.listen(port, host);
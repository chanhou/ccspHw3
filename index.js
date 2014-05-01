var express = require('express');
var controllers = require('./controllers')

var host = '127.0.0.1';
var port = 5000;

express()
.use(express.bodyParser())
.use(express.static(__dirname+"/hw2"))//get static file
.get('/items',controllers.showItem)
.post('/items',controllers.addItem)
.put('/items/:id',controllers.updateItem)
.put('/items/:id/reposition/:new_position',controllers.repoItem)
.delete('/items/:id',controllers.deleteItem)
.listen(port, host);
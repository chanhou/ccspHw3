var fs = require('fs');
var User = require('../models/user');

module.exports.addItem = function (req, res) {
	var user=req;
  	User.addItem(req.body, function (user) {
    	res.json(user);
  	});
}

module.exports.showItem = function (req, res) {

	User.showItem(req.body, function (user) {
    	res.json(user);
  	});
}

module.exports.updateItem = function (req, res) {
	var id=req.params.id;
	User.updateItem(id, function (user) {
    	res.json(user);
  	});
}

module.exports.repoItem = function (req, res) {
	User.repoItem(req.params, function (user) {
    	res.json(user);
  	});
}

module.exports.deleteItem = function (req, res) {
	var id=req.params.id;
	User.deleteItem(id, function (user) {
    	res.json(user);
  	});
}
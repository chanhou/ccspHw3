var fs = require('fs');
var User = require('../models/user');

module.exports.index = function (req, res) {
  res.render('index', {title: 'User Registration'});
}

module.exports.createUser = function (req, res) {
  User.create(req.body, function (user) {
    res.json(user);
  });
}
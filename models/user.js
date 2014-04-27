var fs = require('fs');
var usersFilePathname = __dirname + '/users.json';


module.exports.create = function (user, callback) {
  fs.readFile(usersFilePathname, 'utf8', function (err, data) {
    var users = []
    if (!err) {
      users = JSON.parse(data);
    }
    
    user.id = users.length;
    users.push(user);
    fs.writeFile(usersFilePathname, JSON.stringify(users), function (err) {
      if (err) { throw err; }

      callback(user);
    });
  });
}
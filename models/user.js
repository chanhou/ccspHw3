var fs = require('fs');
var itemPath = __dirname + '/items.json';

module.exports.addItem = function (user, callback) {
  fs.readFile(itemPath, 'utf8', function (err, data) {
    var items = []
    if (!err) {
      items = JSON.parse(data);
    }

    //push data 
    user.id = items.length;
    items.splice(0,0,user);//push from head

    //reassign id number
    var count=0;
    items.forEach(function(item, key) {
        item.id=count;
        count++;
    });

    //items=items.reverse();

    console.log(items);
    fs.writeFile(itemPath, JSON.stringify(items), function (err) {
      if (err) { throw err; }

      callback(user);
    });
  });
}

module.exports.showItem = function (user, callback) {
  fs.readFile(itemPath, 'utf8', function (err, data) {
    var items = []
    if (!err) {
      items = JSON.parse(data);
    }
      callback(items);//send file to front-end
  });
}

module.exports.updateItem = function (user, callback) {
  fs.readFile(itemPath, 'utf8', function (err, data) {
    var items = []
    if (!err) {
      items = JSON.parse(data);
    }
    items.forEach(function(item, key) {
        if (item.id== user) {
            item.value=1;//for the class is-done
            //console.log('aaa'+item.id+","+user);
        }
    });
    
    fs.writeFile(itemPath, JSON.stringify(items), function (err) {
      if (err) { throw err; }

      callback(user);
    });
  });
}

module.exports.repoItem = function (user, callback) {
  fs.readFile(itemPath, 'utf8', function (err, data) {
    var items = [];

    if (!err) {
      items = JSON.parse(data);
    }

    var count=0;
    items.forEach(function(item, key) {
        count++;
    });
    
    //reverse id because of json file
    id=user.id;
    newid=user.new_position;
    
    if (user.new_position==-1){ //delete or done event happen
      items.forEach(function(item, key){
        if(item.id==id){//for done event
          item.id=count-1;//assign it to the last position
        }
        else {
          item.id-=1;//move up
        }

      });
    }
    else{  //normal exchange position
          items.forEach(function(item, key) {
              if ((newid-id)>0){//drag downward
                if(item.id<(newid+1) && item.id>id){//for the item between item
                  item.id -=1;//move down
                }
                else if (item.id==id){
                  item.id=newid;
                }
              }
              else if ((newid-id)<0){//drag upward
                  if (item.id>(newid-1) && item.id<id){
                    item.id+=1;//move up
                  }
                  else if(item.id==id){
                    item.id=newid;
                  }
              }
          });
      }
    
    //sort item by id
    var o=items;
    var sorted=o.sort(function(a,b){
      a=a.id;
      b=b.id;
      return a<b?-1:a>b?1:0;
    });
    
    //reOrganized id number
    var count=0;
    sorted.forEach(function(item, key) {
        item.id=count;
        count++;
    });

    console.log(sorted);

    fs.writeFile(itemPath, JSON.stringify(sorted), function (err) {
      if (err) { throw err; }

      callback(user);
    });
  });
}

module.exports.deleteItem = function (user, callback) {
  //console.log('delete'+user);
  fs.readFile(itemPath, 'utf8', function (err, data) {
    var index;
    if (!err) {
      items = JSON.parse(data);
    }

    var count=0;
    items.forEach(function(item, key) {
        //item.id=count;
        count++;
    });

    items.forEach(function(item, key) {
        if (item.id== user) {
            index = key;//get the index of the content
        }
    });

    items.splice(index, 1);//remove data
    //console.log(JSON.stringify(items));

    fs.writeFile(itemPath, JSON.stringify(items), function (err) {
      if (err) { throw err; }
      callback(user);
    });
  });
}
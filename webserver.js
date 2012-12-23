var express = require('express');
var app = express();

app.use(express.bodyParser());

app.get('/packages', function(req, res){
  Package.findAll({order: 'name DESC'}).success(function(packages) {
    res.send(packages);
  });
});

app.post('/packages', function (req, res) {
  var name, url, pkg;
  name = req.param('name');
  url = req.param('url');
  pkg = Package.build({name: name, url: url});
  var errors = pkg.validate();
  if(!errors){
    pkg.save().success(function () {
      res.send(200);
    }).error(function (e) {
      console.log(e.toString());
      res.send(406);
    });
  }
  else{
    console.log(errors);
    res.send(400);
  }
});

app.get('/packages/:name', function (req, res) {
  var name = req.params.name;
  Package.find({where: ["name = ?", name]}).success(function(pkg) {
    if(pkg){
      pkg.hit();
      res.send(pkg.toJSON());
    }
    else{
      res.send(404);
    }
  });
});

app.get('/packages/search/:name', function (req, res) {
  var name = req.params.name;
  Package.findAll({where: ["name ilike ?", '%'+name+'%'], order: 'name DESC'}).success(function(packages) {
    res.send(packages);
  });
});

module.exports = app;

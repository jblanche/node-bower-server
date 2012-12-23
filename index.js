var Sequelize = require("sequelize");
var express = require('express');
var app = express();
var _ = Sequelize.Utils._ ;

var sequelize = new Sequelize('development', 'jblanche', '', {
  dialect: 'postgres',
  port: 5432
});

var Package = sequelize.define('Package',
  {
    name: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    url: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isGitUrl: function(value) {
          if (!value.match(/^git\:\/\//)) {
            throw new Error('is not correct format');
          }
          return this;
        }
      }
    },
    hits: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
  } , {
  instanceMethods: {
    hit: function () {
      this.hits += 1 ;
      this.save();
    }
  }
});

var sync = sequelize.sync();
sync.success(function () {
  var addIndex = sequelize.getQueryInterface().addIndex('Packages', ['name']);
  addIndex.error(function(e) {
    if(e.toString()!=='error: relation "packages_name" already exists'){
      throw e;
    }
  });
});

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

app.listen(3000);

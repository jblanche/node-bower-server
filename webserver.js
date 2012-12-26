var express = require('express');
var util = require("util");

var WebServer = {
    init: function () {
        this.app = express();
        this.app.use(express.bodyParser());

        this.allPackages();
        this.postPackage();
        this.getPackage();
        this.searchPackage();
        return this;
    },

    allPackages: function(){
        this.app.get('/packages', function(req, res){
            this.database.all(function (err, packages) {
              if (err){res.send(406);}
              else{
                res.send(packages);
              }
            });
        }.bind(this));
    },

    postPackage: function () {
        this.app.post('/packages', function (req, res) {
          var name, url;
          name = req.param('name');
          url = req.param('url');

          this.database.create({name: name, url: url}, function(err){
            if(!err){
                res.send(200);
            }
            else if(err.name === 'ValidationError'){
                res.send(400);
            }
            else{
                res.send(406);
            }
          });
        }.bind(this));
    },

    getPackage: function () {
       this.app.get('/packages/:name', function (req, res) {
         var name = req.params.name;

         this.database.findPackage(name, function (err, _package) {
           if (err){res.send(406);}
           else{
             if(_package){
               _package.hit();
               res.send(_package);
             }
             else{
               res.send(404);
             }
           }
         });
       }.bind(this));
    },

    searchPackage: function () {
        this.app.get('/packages/search/:name', function (req, res) {
          var name = req.params.name;
          this.database.search(name, function (err, packages) {
            if (err){res.send(406);}
            else{
              res.send(packages);
            }
          });
        }.bind(this));
    },


    listen: function (port) {
        this.database = this.app.get('database');
        this.app.listen(port);
        return this;
    }
};

module.exports = Object.create(WebServer);

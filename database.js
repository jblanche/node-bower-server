var mongoose = require('mongoose');

var Database = {
  schema: null,
  model: null,

  init: function (cb) {
    mongoose.connect('localhost', 'test');
    var db = mongoose.connection;

    mongoose.set('debug', true);


    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
      this.createSchema();
      this.createMethods();
      this.createModel();
      this.createValidations();
      cb();
    }.bind(this));
    return this;
  },

  createSchema: function () {
    this.schema = mongoose.Schema({
      name:  { type: String, index: { unique: true }, required: true },
      url: { type: String, index: { unique: true }, required: true },
      hits:   {type: Number, default: 0},
      createdAt: {type: Date, default: Date.now }
    });
  },

  createMethods: function () {
    this.schema.methods.hit = function () {
      this.hits += 1 ;
      this.save();
    };
  },
  createModel: function () {
    this.model = mongoose.model('Package', this.schema);
  },
  createValidations: function () {
    this.schema.path('url').validate(function (value) {
      return value.match(/^git\:\/\//);
    }, 'Invalid url');
  },

  all: function(cb) {
    this.model.find(cb);
  },

  findPackage: function (name, cb) {
    this.model.findOne().where('name').equals(name).exec(cb);
  },

  search: function (name, cb) {
    var regexp = new RegExp(name, 'i');
    this.model.find().where('name', regexp).exec(cb);
  },

  create: function (model, cb) {
    var pkg = new this.model(model);
    pkg.save(cb);
  }
};

module.exports = Object.create(Database);

var Sequelize = require("sequelize");
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

module.exports = sequelize;

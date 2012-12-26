var database = require('./database');
var webserver = require('./webserver').init();

database.init(function () {
  webserver.app.set('database', database);
  webserver.listen(3000);
});


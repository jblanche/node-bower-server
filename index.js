var database = require('./database').init();
var webserver = require('./webserver').init();

var sync = database.Package.sync();

sync.success(database.onSync.bind(database));

sync.success(function (pkg) {
  webserver.app.set('pkg', pkg);
  webserver.listen(3000);
});

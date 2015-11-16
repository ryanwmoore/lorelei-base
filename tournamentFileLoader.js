var fs = require('fs');
var path = require('path');
var scrypt = require('scrypt');

var PASSWORD_FILENAME = "password.scrypt";

function TournamentFileLoaderFactory(tournamentDirectory) {

  return function TournamentFileLoader(proposedName, password, callback) {
    var destination = path.join(tournamentDirectory, proposedName);
    var passwordFile = path.join(destination, PASSWORD_FILENAME);

    fs.stat(destination, function(err, stats) {
      if (err) { callback(err); } else {
        if (stats.isDirectory()) {
          verifyPasswordThen(passwordFile, password, callback);
        } else if (stats.isFile()) {
          callback(new Error("Invalid tournament name: Not a directory"), null);
        } else {
          callback(null, null);
        }
      }
    });
  }
}

function verifyPasswordThen(passwordFile, password, callback) {
  var scryptParameters = scrypt.paramsSync();

  fs.readFile(passwordFile, 'utf8', function(err, data) {
    if (err) throw err;

    //should be wrapped in try catch, but leaving it out for brevity
    var kdfResult = scrypt.kdfSync(data, scryptParameters);
    if (scrypt.verifyKdfSync(kdfResult, password)) {
      callback(null, null);
    } else {
      callback(new Error("Passwords did not match"));
    }
  });
}

module.exports = {
  TournamentFileLoaderFactory: TournamentFileLoaderFactory,
};

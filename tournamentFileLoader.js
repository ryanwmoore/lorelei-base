var fs = require('fs');
var path = require('path');
var scrypt = require('scrypt');
var util = require('util');

var FAILED_TO_VERIFY_PASSWORD_ERROR_MESSAGE = "Failed to verify password";
var PASSWORD_FILENAME = "password.scrypt";
var SCRYPT_PARAMS = 1.0;

function TournamentFileLoaderFactory(tournamentDirectory) {

  return function TournamentFileLoader(proposedName, password, callback) {
    var destination = path.join(tournamentDirectory, proposedName);
    var passwordFile = path.join(destination, PASSWORD_FILENAME);

    fs.stat(destination, function(err, stats) {
      if (err) { callback(err); } else {
        if (stats.isDirectory()) {
          verifyPasswordThen(passwordFile, password, callback);
        } else if (stats.isFile()) {
          callback(new Error("Invalid tournament name: Not a directory"));
        } else {
          callback(null, null);
        }
      }
    });
  }
}

function verifyPasswordThen(passwordFile, password, callback) {
  var scryptParameters = scrypt.paramsSync(SCRYPT_PARAMS);

  fs.readFile(passwordFile, 'utf8', function(err, passwordBase64) {
    if (err) {
      callback(new Error(FAILED_TO_VERIFY_PASSWORD_ERROR_MESSAGE));
      return;
    }

    var passwordDecoded = new Buffer(passwordBase64, 'base64');

    //should be wrapped in try catch, but leaving it out for brevity
    //var kdfResult = scrypt.kdfSync(password, scryptParameters);

    if (scrypt.verifyKdfSync(passwordDecoded, new Buffer(password))) {
      callback(null, "??");
    } else {
      callback(new Error(FAILED_TO_VERIFY_PASSWORD_ERROR_MESSAGE));
    }
  });
}

module.exports = {
  TournamentFileLoaderFactory: TournamentFileLoaderFactory,
};

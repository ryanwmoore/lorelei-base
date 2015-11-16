var fs = require('fs');
var path = require('path');
var scrypt = require('scrypt');
var util = require('util');

var FAILED_TO_SAVE_PASSWORD_ERROR_MESSAGE = "Failed to save the password to disk. Try creating a different named tournament?";
var FAILED_TO_VERIFY_PASSWORD_ERROR_MESSAGE = "Failed to verify password";


var PASSWORD_FILENAME = "password.scrypt";
var SCRYPT_PARAMS = 1.0;

var scryptParameters = scrypt.paramsSync(SCRYPT_PARAMS);

function TournamentFileLoaderFactory(tournamentDirectory) {

  return function TournamentFileLoader(proposedName, password, callback) {
    var destination = path.join(tournamentDirectory, proposedName);
    var passwordFile = path.join(destination, PASSWORD_FILENAME);

    fs.stat(destination, function(err, stats) {
      if (err) {
        if (err.code == 'ENOENT') {
          fs.mkdirSync(destination);
          savePasswordInThen(passwordFile, password, callback);
        } else {
          callback(err);
        }
        return;
      } else {
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

function savePasswordInThen(passwordFile, password, callback) {
  var result = scrypt.kdfSync(password, scryptParameters).toString('base64');
  var fd = fs.openSync(passwordFile, 'w');
  var bytesWritten = fs.writeSync(fd, result);

  if (bytesWritten != result.length) {
    fs.unlinkSync(passwordFile);
    callback(new Error(FAILED_TO_SAVE_PASSWORD_ERROR_MESSAGE));
  } else {
    callback(null, "??");
  }
}

function verifyPasswordThen(passwordFile, password, callback) {
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

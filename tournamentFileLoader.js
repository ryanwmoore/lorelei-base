var fs = require('fs');
var path = require('path');
var scrypt = require('scrypt');
var tournament = require('./tournament');
var util = require('util');
var _ = require('underscore');

var FAILED_TO_ITERATE_FOR_TOURNAMENTS = "Failed to attempt to list tournaments";
var STATE_NOT_FOUND = "Could not load tournament state";
var STATE_FILENAME = "state.dat";

function TournamentFileIteratoryFactory(directory_to_scan, callback) {
  fs.readdir(directory_to_scan, function(err, files) {
    if (err) {
      callback(new Error(FAILED_TO_ITERATE_FOR_TOURNAMENTS));
      return;
    }
    callback(null, _.sortBy(_.filter(files, function(file) {
      return fs.statSync(path.join(directory_to_scan, file)).isDirectory();
    })), _.identity);
  });
}

function TournamentFileLoaderFactory(directory_to_scan) {
  return function(tournament_name, password, callback) {
    var full_path_to_tournament_state = path.join(directory_to_scan, tournament_name, STATE_FILENAME);

    var serializationStatResult;

      try {
        serializationStatResult = fs.lstatSync(full_path_to_tournament_state);
      } catch (e) {
        callback(new Error(STATE_NOT_FOUND));
        return;
      }

      if (serializationStatResult.isFile()) {
        var unserializedData = JSON.parse(fs.readFileSync(full_path_to_tournament_state));

        var saveStateCallback = function(tournament) {
          throw new Error("Save state not yet implemented");
        }

        callback(null, tournament.Tournament(unserializedData, password, saveStateCallback));
      } else {
        callback(new Error(STATE_NOT_FOUND));
      }
  };
}

module.exports = {
  TournamentFileLoaderFactory: TournamentFileLoaderFactory,
  TournamentFileIteratoryFactory: TournamentFileIteratoryFactory
};

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var tournament = require('../tournament');
var tournamentFileLoader = require('../tournamentFileLoader');
var util = require('util');

var ANY_PASSWORD = "ANY_PASSWORD";
var FOOBAR_PASSWORD = "foobar";
var FAILED_TO_ITERATE_REGEX = /Failed to attempt to list/;
var COULD_NOT_LOAD_STATE_REGEXP = /Could not load tournament state/;

var MOCKS_DIRECTORY = "mocks";
var TEMPORARY_RANDOM_TESTS_DIRECTORY = "random-test";

describe('TournamentFileLoader', function() {
  describe('#TournamentFileLoader()', function() {

    it('will not load a tournament that is a file', function(done) {
        var loader = tournamentFileLoader.TournamentFileLoaderFactory("test");
        function callback(err, data) {
          assert.equal(true, COULD_NOT_LOAD_STATE_REGEXP.test(err.message));
          done();
        };
        loader("tournamentFileLoader-test.js", ANY_PASSWORD, callback);
    });
  });
  describe('#TournamentFileIteratoryFactory', function() {
    it('can find all tournaments in a valid directory', function(done) {
      function callback(err, list_of_tournaments) {
        assert.deepEqual(["tournament-ongoing","tournament-with-no-state"], list_of_tournaments);
        done();
      }

      tournamentFileLoader.TournamentFileIteratoryFactory(MOCKS_DIRECTORY, callback);
    });
    it('will throw an appropriate exception if it cannot iterate over tournaments', function(done) {
      function callback(err, list_of_tournaments) {
        assert.equal(true, FAILED_TO_ITERATE_REGEX.test(err.message));
        done();
      }

      var NONEXISTENT_DIRECTORY = "foobarbaz";
      tournamentFileLoader.TournamentFileIteratoryFactory(NONEXISTENT_DIRECTORY, callback);
    });
  });

  describe('#TournamentSaveCallbackFactory', function() {
    it('will write the data of the object to the proper location', function(done) {
      var callback = tournamentFileLoader.TournamentSaveCallbackFactory(TEMPORARY_RANDOM_TESTS_DIRECTORY);
      var any_id = "any-id-" + (new Date()).getTime();
      var data_to_serialize = {id: any_id };
      callback(new tournament.Tournament(data_to_serialize, null, null));

      var loader = tournamentFileLoader.TournamentFileLoaderFactory(TEMPORARY_RANDOM_TESTS_DIRECTORY);

      loader(any_id, null, function(err, t) {
        assert.equal(null, err);
        assert.deepEqual(data_to_serialize, t.data);
        done();
      });
    });
  });
});

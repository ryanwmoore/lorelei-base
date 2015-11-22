var assert = require('assert');
var fs = require('fs');
var path = require('path');
var tournamentFileLoader = require('../tournamentFileLoader');
var util = require('util');

var TMP_DIR = "/tmp";

var ANY_PASSWORD = "ANY_PASSWORD";
var FOOBAR_PASSWORD = "foobar";
var PASSWORD_FAILED_REGEXP = /Failed to verify password/;
var FAILED_TO_ITERATE_REGEX = /Failed to attempt to list/;
var NOT_A_DIRECTORY_REGEXP = /Not a directory/;

var MOCKS_DIRECTORY = "mocks";
var TEMPORARY_RANDOM_TESTS_DIRECTORY = "random-test";

describe('TournamentFileLoader', function() {
  describe('#TournamentFileLoader()', function() {

    it('will not load a tournament that is a file', function(done) {
        var loader = tournamentFileLoader.TournamentFileLoaderFactory("test");
        function callback(err, data) {
          assert.equal(true, /Not a directory/.test(err.message));
          done();
        };
        loader("tournamentFileLoader-test.js", ANY_PASSWORD, callback);
    });

    it('will reject when the password file does not exist', function(done) {
        var loader = tournamentFileLoader.TournamentFileLoaderFactory(MOCKS_DIRECTORY);
        function callback(err, data) {
          assert.equal(true, PASSWORD_FAILED_REGEXP.test(err.message));
          done();
        };
        loader("tournament-with-no-password", ANY_PASSWORD, callback);
    });

    it('will reject when the password is wrong', function(done) {
        var loader = tournamentFileLoader.TournamentFileLoaderFactory(MOCKS_DIRECTORY);
        function callback(err, data) {
          assert.equal(true, PASSWORD_FAILED_REGEXP.test(err.message));
          done();
        };
        loader("tournament-with-password-foobar", ANY_PASSWORD, callback);
    });

    it('will accept when the password is correct', function(done) {
        var loader = tournamentFileLoader.TournamentFileLoaderFactory(MOCKS_DIRECTORY);
        function callback(err, data) {
          assert.equal(null, err);
          done();
        };
        loader("tournament-with-password-foobar", FOOBAR_PASSWORD, callback);
    });

    it('will create a password file if loading a tournament that does not exist', function(done) {
      var loader = tournamentFileLoader.TournamentFileLoaderFactory(TEMPORARY_RANDOM_TESTS_DIRECTORY);
      var tournament_name = Math.round(new Date()/1000).toString();
      function callback(err, data) {
        assert.equal(null, err);
        var statsResult = fs.statSync(path.join(TEMPORARY_RANDOM_TESTS_DIRECTORY, tournament_name, "password.scrypt"));
        assert.equal(true, statsResult.isFile());
        done();
      }
      loader(tournament_name, FOOBAR_PASSWORD, callback);
    });

    it('can find all tournaments in a valid directory', function(done) {
      function callback(err, list_of_tournaments) {
        assert.deepEqual(["tournament-ongoing", "tournament-with-no-password", "tournament-with-password-foobar"], list_of_tournaments);
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

    it('throws an appropriate error if trying to load a readonly tournament that is really just a file', function(done) {
      var EMPTY_FILE = "empty-file";
      var loader = tournamentFileLoader.TournamentFileReadOnlyLoaderFactory(MOCKS_DIRECTORY);
      var tournament = loader(EMPTY_FILE, function(err, tournament) {
          assert.equal(true, NOT_A_DIRECTORY_REGEXP.test(err.message));
          done();
      });
    });

    it('can retrieve a readonly list of all players in an active tournament', function(done) {
      var ONGOING_TOURNAMENT = "tournament-ongoing";
      var expected_players = ["amy", "bert", "cody", "derp"];
      var loader = tournamentFileLoader.TournamentFileReadOnlyLoaderFactory(MOCKS_DIRECTORY);
      var tournament = loader(ONGOING_TOURNAMENT, function(err, tournament) {
        assert.equal(null, err);
        done();
      });
    });
  });
});

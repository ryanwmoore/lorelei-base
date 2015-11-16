var assert = require('assert');
var tournamentFileLoader = require('../tournamentFileLoader');
var util = require('util');

var TMP_DIR = "/tmp";

var ANY_PASSWORD = "ANY_PASSWORD";
var FOOBAR_PASSWORD = "foobar";
var PASSWORD_FAILED_REGEXP = /Failed to verify password/;

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
        var loader = tournamentFileLoader.TournamentFileLoaderFactory("mocks");
        function callback(err, data) {
          assert.equal(true, PASSWORD_FAILED_REGEXP.test(err.message));
          done();
        };
        loader("tournament-with-no-password", ANY_PASSWORD, callback);
    });

    it('will reject when the password is wrong', function(done) {
        var loader = tournamentFileLoader.TournamentFileLoaderFactory("mocks");
        function callback(err, data) {
          assert.equal(true, PASSWORD_FAILED_REGEXP.test(err.message));
          done();
        };
        loader("tournament-with-password-foobar", ANY_PASSWORD, callback);
    });

    it('will accept when the password is correct', function(done) {
        var loader = tournamentFileLoader.TournamentFileLoaderFactory("mocks");
        function callback(err, data) {
          assert.equal(null, err);
          done();
        };
        loader("tournament-with-password-foobar", FOOBAR_PASSWORD, callback);
    });
  });
});

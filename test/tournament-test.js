var assert = require('assert');
var tournament = require('../tournament');

describe('Tournament', function() {
  describe('#TournamentNameIsValid()', function() {
    it('smoketest', function() {
      assert.equal(true, tournament.TournamentNameIsValid("abc123"));
    });
    it('allows only number tournament names', function() {
      assert.equal(true, tournament.TournamentNameIsValid("0123455789"));
    });
    it('allows only alphabetic tournament names', function() {
      assert.equal(true, tournament.TournamentNameIsValid("abcdefghijklmnopqrstuvwxyz"));
    });
    it('rejects symbols', function() {
      assert.equal(false, tournament.TournamentNameIsValid("!@#$%^&*()"));
    });
    it('rejects accented characters', function() {
      assert.equal(false, tournament.TournamentNameIsValid("ábc123"));
    });
  });
  describe('#Tournament()', function() {
    it('throws an exception for an invalid tournament name', function() {
      assert.throws(function() {
        var NAME_THAT_IS_NOT_VALID = '';
        var ANY_PASSWORD = 'ANY_PASSWORD';
        new tournament.Tournament(NAME_THAT_IS_NOT_VALID, ANY_PASSWORD, null, null);
      },
        /Invalid tournament name/
      );
    });
  });
  describe('#Tournament::isValid()', function() {
    it('a tournament which could not be loaded is invalid', function() {
      var NAME_THAT_IS_VALID = 'nameThatIsValid';
      var ANY_PASSWORD = 'ANY_PASSWORD';
      var mockLoaderThatAlwaysFails = function(name, password) { return null; }
      var loaded = new tournament.Tournament(NAME_THAT_IS_VALID, ANY_PASSWORD, mockLoaderThatAlwaysFails, null);
      assert.equal(false, loaded.isValid());
    });
  });
});

var assert = require('assert');
var tournament = require('../tournament');

var PASSWORD_DID_NOT_MATCH_REGEXP = /Password did not match/;

function createSampleTournamentWithPassword(password, userEnteredPassword, callback) {
  return new tournament.Tournament(
          {password: tournament.createPasswordHash(password)},
          userEnteredPassword,
          callback
  );
}

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

  describe('#verifyPassword', function() {
    it('does consider equivalent passwords to be equivalent', function() {
      var sample_password = "sample_password";
      var t = createSampleTournamentWithPassword(sample_password, sample_password);
      assert.equal(true, t.verifyPassword())
    });
  });

  describe('#save', function() {
    it('throws an exception if the password does not match', function() {
      var ANY_PASSWORD = "any password";
      var ANY_OTHER_PASSWORD = "any other password";
      var t = createSampleTournamentWithPassword(ANY_PASSWORD, ANY_OTHER_PASSWORD);
      try {
        t.save();
        assert.fail('save should have thrown an exception', 'no exception thrown');
      } catch(e) {
        assert.equal(true, PASSWORD_DID_NOT_MATCH_REGEXP.test(e.message));
      }
    });
    it('calls the serialize callback if the password does match', function(done) {
      var ANY_PASSWORD = "any password";
      var ANY_OTHER_PASSWORD = "any other password";
      var callback = function(tournament) {
        assert.equal(tournament, t)
        done();
      }

      var t = createSampleTournamentWithPassword(ANY_PASSWORD, ANY_PASSWORD, callback);

      t.save();
    });
  });
});

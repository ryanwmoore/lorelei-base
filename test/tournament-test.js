var assert = require('assert');
var tournament = require('../tournament');

var INVALID_TOURNAMENT_ID_REGEXP = /Invalid tournament id/;
var PASSWORD_DID_NOT_MATCH_REGEXP = /Password did not match/;

function createSampleTournamentWithPassword(password, userEnteredPassword, callback) {
  return new tournament.Tournament(
          tournament.TournamentNew("unusedid", password).data,
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

  describe('#TournamentNew', function() {
    it('has the id that is passed in', function() {
      var any_valid_id = "anyvalidid123";
      var any_password = "any password";
      var t = tournament.TournamentNew(any_valid_id, any_password);
      assert.equal(any_valid_id, t.data.id)
    });
    it('rejects invalid IDs', function() {
      var any_invalid_id = "any invalid id!";
      assert.equal(false, tournament.TournamentNameIsValid(any_invalid_id));
      var any_password = "any password";
      try {
        var t = tournament.TournamentNew(any_invalid_id, any_password);
      } catch (e) {
        assert.equal(true, INVALID_TOURNAMENT_ID_REGEXP.test(e));
      }
    });
  });

  describe('#verifyPassword', function() {
    it('does consider equivalent passwords to be equivalent', function() {
      var sample_password = "sample_password";
      var t = createSampleTournamentWithPassword(sample_password, sample_password);
      assert.equal(true, t.verifyPassword())
    });

    it('a null password does not cause an exception when checking against the saved password', function() {
      var sample_password = "sample_password";
      var null_password = null;
      var t = createSampleTournamentWithPassword(sample_password, null_password);
      assert.equal(false, t.verifyPassword());
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
        console.log(tournament.data);
        assert.equal(tournament, t)
        done();
      }

      var t = createSampleTournamentWithPassword(ANY_PASSWORD, ANY_PASSWORD, callback);

      t.save();
    });
  });
});

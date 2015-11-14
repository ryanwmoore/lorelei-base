var assert = require('assert');
var tournament = require('../libs/tournament');

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
});

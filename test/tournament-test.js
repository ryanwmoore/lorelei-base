var assert = require('assert');
var sprintf = require('sprintf-js').sprintf;
var tournament = require('../tournament');
var util = require('util');
var _ = require('underscore');

var NO_AVAILABLE_DATA_REGEX = /No available data/;
var INVALID_TOURNAMENT_ID_REGEXP = /Invalid tournament id/;
var INVALID_UPLOAD_REGEXP = /Invalid XML was uploaded/;
var PASSWORD_DID_NOT_MATCH_REGEXP = /Password did not match/;
var UNAUTHORIZED_UPLOAD_REGEX = /Unauthorized action: addUpload/;

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
    it('starts with no uploads', function() {
      var any_valid_id = "anyvalidid123";
      var any_password = "any password";
      var t = tournament.TournamentNew(any_valid_id, any_password);
      assert.equal(0, t.getUploads().length);
      assert.equal(undefined, t.getActiveUpload());
      assert.equal(null, t.data.activeUploadIndex);
    });
  });

  describe('#addUpload', function() {
    it('requires that the password be correct', function(done) {
      var password_one = "password_one";
      var password_two = "password_two";
      var t = createSampleTournamentWithPassword(password_one, password_two);
      var upload = undefined;

      t.addUpload(upload, function(err, tournament) {
        assert.equal(true, UNAUTHORIZED_UPLOAD_REGEX.test(err.message));
        done();
      });
    });

    it('rejects invalid XML', function(done) {
      var password_one = "password_one";
      var t = createSampleTournamentWithPassword(password_one, password_one);
      var upload = "intentionally invalid xml";

      function callback(err, t) {
        assert.equal(true, INVALID_UPLOAD_REGEXP.test(err.message));
        done();
      }

      t.addUpload(upload, callback, true);
    });

    it('adds to the uploads list on successful upload', function(done) {
      var password_one = "password_one";
      var t = createSampleTournamentWithPassword(password_one, password_one);
      var upload_data = "<node>contents</node>";

      t.addUpload(upload_data, function(err, t) {
        assert.equal(null, err);
        assert.equal(1, t.getUploads().length);
        done();
      });
    });

    it('when successfully uploading it sets the active upload index if requested to', function(done) {
      var password_one = "password_one";
      var t = createSampleTournamentWithPassword(password_one, password_one);
      var upload_data = "<node>contents</node>";

      t.addUpload(upload_data, function(err, t) {
        assert.equal(null, err);
        assert.equal(0, t.data.activeUploadIndex);
        assert.equal(upload_data, t.getActiveUpload().data);
        done();
      }, true);
    });

    it('when successfully uploading it records the date of the upload', function(done) {
      var password_one = "password_one";
      var t = createSampleTournamentWithPassword(password_one, password_one);
      var upload_data = "<node>contents</node>";

      var start = new Date();

      t.addUpload(upload_data, function(err, t) {
        var finish = new Date();
        var uploadDateInformation = t.getActiveUpload().date;

        assert(start <= uploadDateInformation);
        assert(finish >= uploadDateInformation);
        done();
      }, true);
    });
  });


  describe('#getCurrentPlayerList', function() {
    function buildPlayer(userid, first, last) {
      return sprintf("<player userid=\"%s\"><firstname>%s</firstname><lastname>%s</lastname></player>", userid, first, last);
    }

    it('returns null if there is no active data', function() {
      var any_password = "any_password";
      var t = createSampleTournamentWithPassword(any_password);
      assert.equal(null, t.getActiveUpload());
      t.getCurrentPlayerList(function(err, list) {
        assert.equal(true, NO_AVAILABLE_DATA_REGEX.test(err.message));
      });
    });

    it('returns an empty list if the data has no players', function(done) {
      var any_password = "any_password";
      var t = createSampleTournamentWithPassword(any_password, any_password);

      var sample_tournament_prologue = "<tournament><players>";
      var sample_tournament_epilogue = "</players></tournament>";

      var sample_tournament = sprintf("%s%s", sample_tournament_prologue, sample_tournament_epilogue);
      var expected_player_list = [];

      t.addUpload(sample_tournament, function(err, t) {
        assert.equal(null, err);

        if (err != null) {
          //No more additional tests: already failed
          done();
          return;
        }

        t.getCurrentPlayerList(function(err, list) {
          assert.equal(null, err);
          assert.deepEqual(expected_player_list, list);
          done();
        });
      }, true);
    });

    it('returns an empty list if the data has no players', function(done) {
      var any_password = "any_password";
      var t = createSampleTournamentWithPassword(any_password, any_password);

      var sample_tournament_prologue = "<tournament><players>";
      var sample_tournament_epilogue = "</players></tournament>";

      var player_one_userid = "player_one_userid";
      var player_one_first = "player_one_first";
      var player_one_last = "player_one_last";

      var player_two_userid = "player_two_userid";
      var player_two_first = "player_two_first";
      var player_two_last = "player_two_last";

      var sample_tournament = sprintf(
        "%s%s%s%s",
        sample_tournament_prologue,
        buildPlayer(player_one_userid, player_one_first, player_one_last),
        buildPlayer(player_two_userid, player_two_first, player_two_last),
        sample_tournament_epilogue);
      var expected_player_list = [
        {name: sprintf("%s %s", player_one_first, player_one_last)},
        {name: sprintf("%s %s", player_two_first, player_two_last)},
      ];

      t.addUpload(sample_tournament, function(err, t) {
        assert.equal(null, err);

        if (err != null) {
          //No more additional tests: already failed
          done();
          return;
        }

        t.getCurrentPlayerList(function(err, list) {
          assert.equal(null, err);
          assert.deepEqual(expected_player_list, list);
          done();
        });
      }, true);
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
        assert.equal(tournament, t)
        done();
      }

      var t = createSampleTournamentWithPassword(ANY_PASSWORD, ANY_PASSWORD, callback);

      t.save();
    });
    });

    describe('#getAlwaysAvailableJsonRepresentation', function () {
        it('has the id that is passed in', function () {
            var any_valid_id = "anyvalidid123";
            var any_password = "any password";
            var t = tournament.TournamentNew(any_valid_id, any_password);
            
            var representation = t.getAlwaysAvailableJsonRepresentation();
            
            assert.equal(representation.id, any_valid_id);
        });

        it('has no other attributes if there is no upload information', function () {
            var any_valid_id = "anyvalidid123";
            var any_password = "any password";
            var t = tournament.TournamentNew(any_valid_id, any_password);
            
            var representation = t.getAlwaysAvailableJsonRepresentation();
            
            var keys = Object.keys(representation);
            
            assert.equal(t.getActiveUpload(), null);
            assert.deepEqual(keys, ["id"]);
        });
    });

    describe('#buildJsonRepresentation', function () {
        it('is a superset of data given by buildAlwaysAvailableJsonRepresentation', function(done) {
            var any_valid_id = "anyvalidid123";
            var any_password = "any password";
            var t = tournament.TournamentNew(any_valid_id, any_password);
            
            var alwaysAvailableRepresentation = t.getAlwaysAvailableJsonRepresentation();
            
            t.buildJsonRepresentation(function (err, representation) {
                assert.equal(err, null);
                var jsonRepresentationKeys = Object.keys(representation);
                _.forEach(jsonRepresentationKeys, function (element, index, list) {
                    assert.notEqual(alwaysAvailableRepresentation[element], undefined);
                });
                done();
            });
        });
    });
});

var assert = require('assert');
var checkParsing = require('./utils').checkParsing;
var Match = require('../match').Match;
var parseString = require('xml2js').parseString;
var sprintf = require("sprintf-js").sprintf;

var ANY_OUTCOME = 1;
var ANY_USER_ID_1 = 123;
var ANY_USER_ID_2 = 456;
var ANY_TIMESTAMP = '10/03/2015 19:11:48';
var ANY_TABLE_NUMBER = 2;

var match_with_always_available_data = sprintf('<match outcome="%d">', ANY_OUTCOME) +
        sprintf('<timestamp>%s</timestamp>', ANY_TIMESTAMP) +
        sprintf('<tablenumber>%d</tablenumber>', ANY_TABLE_NUMBER) +
    '</match>';

var match_with_two_players =
    sprintf('<match outcome="%d">', ANY_OUTCOME) +
        sprintf('<player1 userid="%d"/>', ANY_USER_ID_1) +
        sprintf('<player2 userid="%d"/>', ANY_USER_ID_2) +
        sprintf('<timestamp>%s</timestamp>', ANY_TIMESTAMP) +
        sprintf('<tablenumber>%d</tablenumber>', ANY_TABLE_NUMBER) +
    '</match>';

var match_with_one_players =
    sprintf('<match outcome="%d">', ANY_OUTCOME) +
        sprintf('<player userid="%d"/>', ANY_USER_ID_1) +
        sprintf('<timestamp>%s</timestamp>', ANY_TIMESTAMP) +
        sprintf('<tablenumber>%d</tablenumber>', ANY_TABLE_NUMBER) +
    '</match>';

describe('Match', function() {
    parseString(match_with_always_available_data, function(err, match_with_always_available_data_json) {
    checkParsing(err);
    parseString(match_with_one_players, function(err, match_with_one_players_json) {
    checkParsing(err);
    parseString(match_with_two_players, function(err, match_with_two_players_json) {
    checkParsing(err);

        var sample_match = new Match(match_with_always_available_data_json["match"]);
        var sample_match_with_one_player = new Match(match_with_one_players_json["match"]);
        var sample_match_with_two_players = new Match(match_with_two_players_json["match"]);

        describe('#getTableNumber()', function() {
            it('will return the table number as an integer', function() {
                assert.equal(ANY_TABLE_NUMBER, sample_match.getTableNumber());
            });
        });

        describe('#getTimeStamp()', function() {
            it('will return the timestamp as a date', function() {
                assert.equal(Date.parse(ANY_TIMESTAMP), sample_match.getTimeStamp());
            });
        });

        describe('#getOutcome()', function() {
            it('will return the outcome as an integer', function() {
                assert.equal(ANY_OUTCOME, sample_match.getOutcome());
            });
        });

        describe('#isBye()', function() {
            it('will return true if the match is a bye', function() {
                assert.equal(true, sample_match_with_one_player.isBye());
            });
            it('will return false if the match is not a bye', function() {
                assert.equal(false, sample_match_with_two_players.isBye());
            });
        });
    });
    });
    });
});


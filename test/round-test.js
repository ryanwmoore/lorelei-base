var assert = require('assert');
var checkParsing = require('./utils').checkParsing;
var parseString = require('xml2js').parseString;
var Match = require('../match').Match;
var Round = require('../round').Round;
var sprintf = require("sprintf-js").sprintf;

var ANY_NUMBER = 1;
var ANY_TYPE = 2;
var ANY_STAGE = 3;
var ANY_TIMELEFT = 4;

var matches_string = '<matches><match outcome="5"><player userid="945526"/><timestamp>10/03/2015 19:11:48</timestamp><tablenumber>0</tablenumber></match></matches>';

var sample_round_xml = sprintf('<round number="%d" type="%d" stage="%d"><timeleft>%d</timeleft>%s</round>',
                               ANY_NUMBER, ANY_TYPE, ANY_STAGE, ANY_TIMELEFT, matches_string
);

describe('Round', function() {
    parseString(sample_round_xml, function(err, sample_round_json) {
    checkParsing(err);
    parseString(matches_string, function(err, matches_json) {
    checkParsing(err);

        var sample_round = new Round(sample_round_json["round"]);

        describe("#getMatches()", function() {
            it('will return the matches given to it', function() {
                var example_match = new Match(matches_json["matches"]["match"][0]);
                assert.deepEqual(sample_round.getMatches(), new Array(example_match));
            });
        });

        describe('#getNumber()', function() {
            it('will return the number as an integer', function() {
                assert.equal(ANY_NUMBER, sample_round.getNumber());
            });
        });
        describe('#getType()', function() {
            it('will return the type as an integer', function() {
                assert.equal(ANY_TYPE, sample_round.getType());
            });
        });
        describe('#getStage()', function() {
            it('will return the stage as an integer', function() {
                assert.equal(ANY_STAGE, sample_round.getStage());
            });
        });
        describe('#getTimeLeft()', function() {
            it('will return the timeleft as an integer', function() {
                assert.equal(ANY_TIMELEFT, sample_round.getTimeLeft());
            });
        });
    });
    });
});

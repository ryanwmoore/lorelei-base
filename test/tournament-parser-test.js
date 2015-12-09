var assert = require('assert');
var fs = require('fs');
var parseString = require('xml2js').parseString;
var sprintf = require('sprintf-js').sprintf;
var tournamentParser = require('../tournament-parser');
var util = require('util');

parseString(fs.readFileSync("./examples/Top Deck Saturday Night Fight Night 10-3.tdf"), function (err, sample_top_deck_fight_night_json_dom) {
    
    if (err) {
        console.log(util.inspect(err));
        throw err;
    }
    
    if (sample_top_deck_fight_night_json_dom == null) {
        throw new Error("Failed to load require sample tournament for unit test");
    }
    
    describe('TournamentParser', function () {
        describe('#getPlayers()', function () {
            it('returns a full list of players in sorted order', function () {
                var parser = new tournamentParser.TournamentParser(sample_top_deck_fight_night_json_dom);
                
                assert.equal(11, parser.getPlayers().length);
                //spot checks
                assert.equal("Alex", parser.getPlayers()[0].getFirstName());
                assert.equal("Demko", parser.getPlayers()[0].getLastName());
                assert.equal("945507", parser.getPlayers()[0].getUserId());
                assert.equal("Tom", parser.getPlayers()[10].getFirstName());
                assert.equal("Phillips", parser.getPlayers()[10].getLastName());
                assert.equal("969849", parser.getPlayers()[10].getUserId());
            });
        });
        
        describe('#getRounds()', function () {
            it('returns a full list of rounds in sorted order', function () {
                var parser = new tournamentParser.TournamentParser(sample_top_deck_fight_night_json_dom);
                var rounds = parser.getRounds();
                
                assert.equal(4, rounds.length);
                //spot checks
                assert.equal(1, rounds[0].getNumber());
                assert.equal(4, rounds[3].getNumber());
            });
        });
    });
});

var assert = require('assert');
var checkParsing = require('./utils').checkParsing;
var parseString = require('xml2js').parseString;
var Player = require('../player').Player;
var sprintf = require('sprintf-js').sprintf;

var ANY_USER_ID = 1;
var ANY_FIRST_NAME = "First_Name";
var ANY_LAST_NAME = "Last_Name";
var ANY_BIRTH_DATE = "1/2/2013";

var player_xml = sprintf(
	                 '<player userid="%s"><firstname>%s</firstname><lastname>%s</lastname><birthdate>%s</birthdate></player>',
					 ANY_USER_ID, ANY_FIRST_NAME, ANY_LAST_NAME, ANY_BIRTH_DATE
				);

describe('Player', function() {
    parseString(player_xml, function(err, player_json) {
    checkParsing(err);

    var player = new Player(player_json["player"]);

	 describe('#getUserId()', function() {
        it('will return the player\'s user id', function() {
            assert.equal(ANY_USER_ID, player.getUserId());
        });
    });

     describe('#getFirstName()', function() {
        it('will return the player\'s first name', function() {
            assert.equal(ANY_FIRST_NAME, player.getFirstName());
        });
    });

    describe('#getLastName()', function() {
        it('will return the player\'s last name', function() {
            assert.equal(ANY_LAST_NAME, player.getLastName());
        });
    });

    describe('#getBirthDate()', function() {
        it('will return the player\'s birth date', function() {
            assert.equal(ANY_BIRTH_DATE, player.getBirthDate());
        });
    });

	});
});

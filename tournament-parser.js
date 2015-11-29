var _ = require('underscore')._;
var Player = require('./player').Player;
var Round = require('./round').Round;

function TournamentParser(json_dom) {
	this.json_dom = json_dom;
}


TournamentParser.prototype.getPlayers = function() {
	if (! this.json_dom['tournament'] || ! this.json_dom['tournament']['players']) {
		return [];
	}

	var players = _.map(this.json_dom['tournament']['players'][0]['player'], function(player_json) {
		return new Player(player_json);
	});

	return _.sortBy(players, function(player) { return player.toJson().name});
}

TournamentParser.prototype.getRounds = function() {
	var pods = this.json_dom['tournament']['pods'][0]['pod'];

	if (pods.length != 1) {
		throw new Error("Only 1-pod tournaments are supported");
	}

	var rounds = _.map(pods[0]['rounds'][0]['round'], function(round_json) {
		return new Round(round_json);
	});

	return _.sortBy(rounds, function(round) { round.getNumber() });
}

module.exports = { TournamentParser: TournamentParser}

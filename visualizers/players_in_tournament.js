var _ = require('underscore')._;
var Player = require('../player').Player;

function GetPlayerList(json_dom) {

	if (! json_dom['tournament'] || ! json_dom['tournament']['players']) {
		return [];
	}

	var players = _.map(json_dom['tournament']['players'][0]['player'], function(player_json) {
		var player = new Player(player_json);
		return player.toJson();
	});

	return _.sortBy(players, 'name');
}

module.exports = { GetPlayerList: GetPlayerList}

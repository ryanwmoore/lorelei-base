var sprintf = require('sprintf-js').sprintf;

function Player(json_for_player) {
	this.json = json_for_player;
}

Player.prototype.getUserId = function() {
	return this.json["$"].userid;
}

Player.prototype.getFirstName = function() {
	return this.json["firstname"];
}

Player.prototype.getLastName = function() {
	return this.json["lastname"];
}

Player.prototype.getBirthDate = function() {
	return this.json["birthdate"];
}

Player.prototype.toJson = function() {
	return {name: sprintf("%s %s", this.getFirstName(), this.getLastName()), id: this.getUserId()};
}

module.exports = { Player: Player };

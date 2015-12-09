function Match(json_for_match) {
    this.json = json_for_match;
}

Match.prototype.getOutcome = function() {
    return this.json["$"]["outcome"];
}

Match.prototype.getPlayer = function(which) {
  if (which == undefined || which == null) {
    which = ""; //for byes
  }
  var data = this.json["player"+which];

  if (data == undefined) {
    return undefined;
  }

  return data[0];
}

Match.prototype.getPlayersAsArray = function () {
    if (this.isBye()) {
        return [this.getPlayer()["$"]["userid"]];
    } else {
        return [this.getPlayer(1)["$"]["userid"], this.getPlayer(2)["$"]["userid"]];
    }
}

Match.prototype.getPlayerViaRoster = function(roster, which) {
  var player_dom = this.getPlayer(which);

  var player_id = player_dom["$"]["userid"];

  for(var i = 0; i < roster.length; i++) {
    if (roster[i].getUserId() == player_id) {
      return roster[i];
    }
  }

  return null;
}

Match.prototype.getTableNumber = function() {
    return this.json["tablenumber"][0];
}

Match.prototype.getTimeStamp = function() {
    return Date.parse(this.json["timestamp"]);
}

Match.prototype.isBye = function() {
    return this.getPlayer(1) === undefined || this.getPlayer(2) === undefined;
}

Match.prototype.toJson = function () {
    return { table: this.getTableNumber(), isBye: this.isBye(), timestamp: this.getTimeStamp(), outcome: this.getOutcome(), players: this.getPlayersAsArray() };
}

module.exports = { Match: Match };

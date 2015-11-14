function Match(json_for_match) {
    this.json = json_for_match;
}

Match.prototype.getOutcome = function() {
    return this.json["$"]["outcome"];
}

Match.prototype.getPlayer = function(which) {
    return this.json["player"+which];
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

module.exports = { Match: Match };

var _ = require('underscore')._;
var Match = require('./match').Match;

function Round(json) {
    this.json = json;
}

Round.prototype.getMatches = function() {
    var matches = _.flatten(_.map(this.json["matches"][0]["match"],
        function(element) {
            return new Match(element);
        }
    ));

    return _.sortBy(matches, function(match) { return [match.isBye(), match.getTableNumber()]});
}

Round.prototype.getNumber = function() {
    return parseInt(this.json["$"].number);
}

Round.prototype.getType = function() {
    return this.json["$"].type;
}

Round.prototype.getStage = function() {
    return this.json["$"].stage;
}

Round.prototype.getTimeLeft = function() {
    return this.json["timeleft"];
}

Round.prototype.toJson = function () {
    return {
        number: this.getNumber(),
        type: this.getType(),
        stage: this.getStage(),
        matches: _.map(this.getMatches(), function (match) { return match.toJson() })
    };
}

module.exports = { Round: Round };

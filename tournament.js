function Tournament(proposedName, password, tournamentLoader, callback) {
    if (! TournamentNameIsValid(proposedName)) {
      throw new Error("Invalid tournament name");
    } else {
      this.tournament = tournamentLoader(proposedName, password, callback);
    }
}

Tournament.prototype.isValid = function() {
  return this.tournament != null;
}

function TournamentNameIsValid(proposedName) {
  return /^[a-z0-9]+$/gi.test(proposedName);
}

module.exports = {
  TournamentNameIsValid: TournamentNameIsValid,
  Tournament : Tournament
};

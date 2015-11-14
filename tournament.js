function Tournament(proposedName, password, tournamentLoader) {
    if (! TournamentNameIsValid(proposedName)) {
      throw new Error("Invalid tournament name");
    } else {
      this.tournament = tournamentLoader(proposedName, password);
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

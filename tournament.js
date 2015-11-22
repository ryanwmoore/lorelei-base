function TournamentNameIsValid(proposedName) {
  return /^[a-z0-9]+$/gi.test(proposedName);
}

module.exports = {
  TournamentNameIsValid: TournamentNameIsValid
};

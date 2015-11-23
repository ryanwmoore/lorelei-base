var scrypt = require('scrypt');
var SCRYPT_PARAMS = 1.0;
var scryptParameters = scrypt.paramsSync(SCRYPT_PARAMS);

var INVALID_TOURNAMENT_ID = "Invalid tournament id";
var CANNOT_SAVE_DUE_TO_PASSWORD_MISMATCHED = "Password did not match: Cannot save tournament state updates";

function TournamentNameIsValid(proposedName) {
  return /^[a-z0-9]+$/gi.test(proposedName);
}

function TournamentNew(id, password) {
  if (TournamentNameIsValid(id) && password != null && password != undefined) {
    var data = TournamentDataNew(id);
    data.password = createPasswordHash(password);
    return new Tournament(data);
  } else {
    throw new Error(INVALID_TOURNAMENT_ID);
  }
}

function TournamentDataNew(id) {
  return {
    id: id
  };
}

function Tournament(data, password, saveCallback) {
  //If password == null, data may only read and/or the caller may have limited access.
  this.data = data;
  this.password = password;
  this.passwordWasAttemptedToBeVerified = false;
  this.passwordVerified = false;
  this.saveCallback = saveCallback;
}

Tournament.prototype.getData = function() { return this.data; }
Tournament.prototype.getId = function() { return this.data.id; }
Tournament.prototype.getPassword = function() { return this.password; }

Tournament.prototype.save = function() {
  this.verifyPasswordIfNecessary();
  if (! this.passwordVerified) {
    throw new Error(CANNOT_SAVE_DUE_TO_PASSWORD_MISMATCHED);
  } else {
    this.saveCallback(this);
  }
}

/* Return whether or not the specified password can be used to load the tournament
*/
Tournament.prototype.verifyPassword = function() {
  var password = this.getPassword();

  this.passwordWasAttemptedToBeVerified = true;
  this.passwordVerified = false;

  if (password != null && password != undefined) { //Shortcut: No point in trying
    var tournamentPassword = this.getData().password;
    var tournamentPasswordDecoded = new Buffer(tournamentPassword, 'base64');

    if (scrypt.verifyKdfSync(tournamentPasswordDecoded, new Buffer(password))) {
      this.passwordVerified = true;
    }
  }

  return this.passwordVerified;
}

Tournament.prototype.verifyPasswordIfNecessary = function() {
  if (! this.passwordWasAttemptedToBeVerified) {
    this.verifyPassword();
  }
}

function createPasswordHash(password) {
  return scrypt.kdfSync(password, scryptParameters).toString('base64');
}

module.exports = {
  TournamentNew: TournamentNew,
  TournamentNameIsValid: TournamentNameIsValid,
  TournamentDataNew: TournamentDataNew,
  Tournament: Tournament,
  createPasswordHash: createPasswordHash
};

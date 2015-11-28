var parseString = require('xml2js').parseString;
var scrypt = require('scrypt');
var SCRYPT_PARAMS = 1.0;
var scryptParameters = scrypt.paramsSync(SCRYPT_PARAMS);

var UNAUTHORIZED_ACTION = "Unauthorized action: ";
var INVALID_TOURNAMENT_ID = "Invalid tournament id";
var INVALID_UPLOAD_XML = "Invalid XML was uploaded";
var CANNOT_SAVE_DUE_TO_PASSWORD_MISMATCHED = "Password did not match: Cannot save tournament state updates";

function TournamentNameIsValid(proposedName) {
  return /^[a-z0-9]+$/gi.test(proposedName);
}

function TournamentNew(id, password) {
  if (TournamentNameIsValid(id) && password != null && password != undefined) {
    var data = TournamentDataNew(id);
    data.password = createPasswordHash(password);
    return new Tournament(data, password);
  } else {
    throw new Error(INVALID_TOURNAMENT_ID + id);
  }
}

function TournamentDataNew(id) {
  return {
    id: id,
    uploads: [],
    activeUploadIndex: undefined
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

Tournament.prototype.addUpload = function (uploadAsString, callback, setToNewRound) {
  var t = this;

  if (! this.passwordIsCorrect()) {
    callback(new Error(UNAUTHORIZED_ACTION + "addUpload"), this);
    return;
  }

  parseString(uploadAsString, function(err, ignored_json_dom) {
    if (err) {
      callback(new Error(INVALID_UPLOAD_XML), t);
      return;
    }

    t.getUploads().push(uploadAsString);

    if (setToNewRound === true) {
      t.data.activeUploadIndex = t.getUploads().length - 1;
    }

    callback(null, t);
  });
};

Tournament.prototype.getActiveUpload = function() {
  if (this.data.activeUploadIndex) {
    return this.getUploads()[activeUploadIndex];
  }
  return undefined;
}
Tournament.prototype.getData = function() { return this.data; }
Tournament.prototype.getId = function() { return this.data.id; }
Tournament.prototype.getUploads = function() { return this.data.uploads; }
Tournament.prototype.getPassword = function() { return this.password; }
Tournament.prototype.setSaveCallback = function(saveCallback) {
  this.saveCallback = saveCallback;
}
Tournament.prototype.save = function() {
  if (! this.passwordIsCorrect()) {
    throw new Error(CANNOT_SAVE_DUE_TO_PASSWORD_MISMATCHED);
  } else {
    this.saveCallback(this);
  }
}

Tournament.prototype.passwordIsCorrect = function() {
  this.verifyPasswordIfNecessary();
  return this.passwordVerified;
}

/* Return whether or not the specified password can be used to load the tournament
*/
Tournament.prototype.verifyPassword = function() {
  var password = this.getPassword();

  this.passwordWasAttemptedToBeVerified = true;
  this.passwordVerified = false;

  if (password != null && password != undefined && password != "") { //Shortcut: No point in trying
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
  Tournament: Tournament,
  createPasswordHash: createPasswordHash
};

var fs = require('fs');
var parseString = require('xml2js').parseString;
/*
var players_in_tournament = require('./libs/visualizers/players_in_tournament.js');

fs.readFile(process.argv[2], 'utf8', function (err, data) {
  if (err) {
    throw err;
  } else {
    parseString(data, function (err, json_dom) {
      if (err) {
        debugger;
        throw err;
      } else {
        process.stdout.write(JSON.stringify(players_in_tournament.GetPlayerList(json_dom)));
      }
    });
  }
});

*/
var loader = require('./tournamentFileLoader').TournamentFileLoaderFactory(".");
loader("blah", null);

var assert = require('assert');

function checkParsing(err) {
    if (err) {
        assert.equal(err, null, 'Did not parse required input correctly: ' + err);
    }
}

module.exports = { checkParsing: checkParsing };
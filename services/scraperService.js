/**
 * The fallback video parse service. Scrapes the page and tries
 * to find any video on it. Saves the first. If it can't find
 * any video, an Unknown entry will be saved of which the Watchit
 * Service will give an overview. This way new parse services
 * can be developed.
 */

var Q = require('q');

function canParse ( url ) {
    return true;
}

function parse ( url ) {

    var deferred = Q.defer();

    return deferred.promise();
}

/***************************
 * API
 */

exports.canParse = canParse;
exports.parse = parse;
/**
 * The fallback video parse service. Scrapes the page and tries
 * to find any video on it. Tries to parse the first through
 * the other services.
 * If it can't find any video, an 'unknown' entry will be saved
 * of which the Watchit Service will give an overview. This way
 * new parsing services can be developed. The unknown entries
 * will display the original page in iframe mode so you can
 * still check the video on that page.
 */

var Q = require('q');

function canParse ( url ) {
    return true;
}

function parse ( url ) {

    var deferred = Q.defer();

    //deferred.resolve({
    //    originalUrl: url,
    //    service: 'unknown'
    //});

    deferred.reject(); // for now

    return deferred.promise;
}

/***************************
 * API
 */

exports.canParse = canParse;
exports.parse = parse;
var Q = require('q');
var urlUtil = require('url');

function canParse ( url ) {

    var parsed = urlUtil.parse( url );

    return ( parsed && /^(www\.)?youtube\./.test( parsed.hostname ) );
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
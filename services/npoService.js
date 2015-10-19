/**
 * Parsing Service for all content made available by Dutch public
 * broadcasters that make use of the POMS Media service.
 */

var Q = require('q');
var urlUtil = require('url');

var REGEXP_MEDIAPLAYER_PATH = /speel\.([^\.]+)\.html$/; // www.vpro.nl and clones specific

function canParse ( url ) {

    var parsed = urlUtil.parse( url );

    return ( parsed &&
        /^((www|3voor12|tegenlicht)\.)?(vpro|npogeschiedenis|cultura|npodoc|human|npo)\.nl/.test( parsed.hostname ) &&
    REGEXP_MEDIAPLAYER_PATH.test( parsed.pathname )
    );
}

function parse ( url ) {

    var deferred = Q.defer();
    var parsed = urlUtil.parse( url );
    var mediaIdMatch = REGEXP_MEDIAPLAYER_PATH.exec( parsed.pathname );

    if ( mediaIdMatch && mediaIdMatch.length === 2 ) {

        deferred.resolve({
            originalUrl: url,
            service: 'npo',
            mediaUri: mediaIdMatch[1]
        });

    } else {

        // TODO: parse the HTML content and search for media id's

        deferred.reject();
    }

    return deferred.promise;
}

/***************************
 * API
 */

exports.canParse = canParse;
exports.parse = parse;
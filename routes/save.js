var bodyParser = require('body-parser');
var dbModels = require('../database/Models');
var express = require('express');
var helpers = require('../lib/helpers');
var Q = require('q');
var router = express.Router();

var pkgConfig = require('../package.json');

var services = pkgConfig.config.services.map( function ( service ) {

    return require('../services/'+ service +'.js');
});

/***************************************************
 * HELPERS
 */

function parseSaveRequest( requestUrl ) {

    var deferred = Q.defer();
    var parsing = false;

    services.forEach( function ( service ) {

        if ( ! parsing && service.canParse( requestUrl ) ) {

            parsing = true;

            service.parse( requestUrl ).then( deferred.resolve, deferred.reject );
        }
    });

    return deferred.promise;
}



function userRequestIsValid ( userName, consumerKey ) {

    var deferred = Q.defer();

    dbModels.Watcher.findOne(
        { name: userName, consumerKey: consumerKey },
        'id name consumerKey',
        function ( error, watcher ) {

            if ( error || ! watcher ) {
                deferred.reject();
            } else {
                deferred.resolve( watcher.id );
            }
        }
    );

    return deferred.promise;
}

/***************************************************
 * ROUTING
 */

router.post('/save/:user', bodyParser.json(), function ( req, res ) {

    if ( ! req.body || ( req.body && ! req.body.url ) ) {

        helpers.respondWithBadRequest( res );

    } else {

        userRequestIsValid( req.params.user, req.body.consumerKey ).then(
            function ( userId ) {
                parseSaveRequest( req.body.url ).then( function ( parsed ) {

                    /**
                     * @param {Object} parsed
                     *      @param {String} parsed.originalUrl
                     *      @param {String} parsed.service
                     *      @param {String} [parsed.mediaUri]
                     */
                    parsed.watcherId = userId;
                    parsed.status = 'new';
                    parsed.pausedAt = 0;

                    var video = new dbModels.Video( parsed );

                    video.save(function ( err ) {

                        if ( err ) {
                            helpers.respondWithServerError( res, 'unable to save video request' );
                        } else {
                            helpers.respondWithSuccess( res );
                        }
                    });

                }, function () {

                    var video = new dbModels.Video({
                        originalUrl: req.body.url,
                        service: 'unknown',
                        status: 'unparseable',
                        watcherId: userId
                    });

                    video.save(function ( err ) {

                        if ( err ) {
                            helpers.respondWithServerError( res, 'unable to save video request' );
                        } else {
                            helpers.respondWithSuccess( res );
                        }
                    });

                } );
            },
            function () {
                helpers.respondWithForbidden( res );
            }
        );
    }
});

module.exports = router;
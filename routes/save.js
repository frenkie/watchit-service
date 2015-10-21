var bodyParser = require('body-parser');
var dbModels = require('watchit-dal/odm/Models');
var debug = require('debug')('save');
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
        '_id name consumerKey',
        function ( error, watcher ) {
            if ( error || ! watcher ) {
                deferred.reject();
            } else {
                deferred.resolve( watcher._id );
            }
        }
    );

    return deferred.promise;
}

/***************************************************
 * ROUTING
 */

router.post('/videos', bodyParser.json(), function ( req, res ) {

    if ( ! req.body || ( req.body && ! req.body.url && ! req.body.username ) ) {

        helpers.respondWithBadRequest( res );

    } else {

        userRequestIsValid( req.body.username, req.body.consumerKey ).then(
            function ( userId ) {

                parseSaveRequest( req.body.url ).then( function ( parsed ) {

                    /**
                     * @param {Object} parsed
                     *      @param {String} parsed.originalUrl
                     *      @param {String} parsed.service
                     *      @param {String} [parsed.mediaUri]
                     */
                    parsed.title = req.body.title || 'Untitled';
                    parsed.watcherId = userId;
                    parsed.status = 'new';
                    parsed.pausedAt = 0;

                    debug( parsed );

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
                        title: req.body.title || 'Untitled',
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
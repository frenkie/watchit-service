var bodyParser = require('body-parser');
var express = require( 'express' );
var Q = require('q');
var spawn = require( 'child_process' ).spawn;


var pkgConfig = require('./package.json');
var services = pkgConfig.config.services.map( function ( service ) {

    return require('./services/'+ service +'.js');
});

var appIp = process.env.IP || '0.0.0.0';
var appPort = process.env.PORT || 4000;
var app = express();


/***************************************************
 * HELPERS
 */

function parseSaveRequestForUser( requestUrl, userId ) {

    var deferred = Q.defer();



    return deferred.promise();
}

function respondWithBadRequest ( res ) {

    res.sendStatus(400);
}

function respondWithForbidden ( res ) {

    res.sendStatus(403);
}

function respondWithServerError ( res, errorMsg ) {

    res.status(500).send( errorMsg );
}

function userRequestIsValid ( userId, consumerKey ) {

    console.log('userRequestIsValid: ', arguments );
    return true;
}

/***************************************************
 * ROUTING
 */

app.post('/save/:user', bodyParser.json(), function ( req, res ) {

    if ( ! req.body ) {

        respondWithBadRequest( res );

    } else if ( userRequestIsValid( req.params.user, req.body.consumerKey ) ) {

        console.log( require('util' ).inspect( req.body ) );

        console.log( req.body.url || 'no url' );

        res.send('jeej');

    } else {
        respondWithForbidden( res );
    }
});


/***************************************************/

app.listen( appPort, appIp, function () {
    console.log('%s: Watch It server started on %s:%d ...',
                Date( Date.now() ), appIp, appPort );
});
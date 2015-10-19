var express = require('express');
var mongoose = require('mongoose');

var appIp = process.env.IP || '0.0.0.0';
var appPort = process.env.PORT || 4000;
var app = express();

var saveRoutes = require('./routes/save');

/***************************************************
 * ROUTING
 */

app.use( saveRoutes );


/***************************************************
 *
 */

mongoose.connect( process.env.MONGODB_URI, function ( error ) {

    if ( error ) {
        throw new Error('error connecting to database, we really need that one...');
    } else {
        app.listen( appPort, appIp, function () {
            console.log('%s: Watch It server started on %s:%d ...',
                        Date( Date.now() ), appIp, appPort );
        });
    }
});
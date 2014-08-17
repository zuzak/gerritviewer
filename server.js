var config = require( './config' );

var express = require( 'express' );
var app = module.exports = express();

require( './routes' );

app.listen( config.get( 'web.port' ) );
console.info( 'Listening on port %d', config.get( 'web.port' ) );

var config = require( './config' );

var express = require( 'express' );
var app = module.exports = express();

var bodyParser = require( 'body-parser' );
var flash = require( 'express-flash' );
var session = require( 'express-session' );

// jade configuration
app.set( 'views', __dirname + '/views' );
app.set( 'view engine', 'jade' );
app.locals.pretty = true;

app.use( bodyParser.urlencoded() );
app.use( session( {
	secret: 'runcible spoon'
} ) );
app.use( flash() );

app.set( 'json spaces', 4 );
require( './routes' );

app.listen( config.get( 'web.port' ) );
console.info( 'Listening on port %d', config.get( 'web.port' ) );

var app = require( '../' );

app.use( function ( req, res ) {
	res.status( 404 );
	res.send( '404: Cannot find that page.' );
} );

app.use( function ( err, req, res, next ) {
	res.status( 500 );
	res.send( '500: Something went wrong.' );
	next;
} );

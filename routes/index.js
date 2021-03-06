var read = require( 'fs' ).readdirSync;

var blacklist = [
	'index.js',
	'error.js'
];

read( __dirname + '/' ).forEach( function ( file ) {
	if ( file.match( '.js$' ) !== null && blacklist.indexOf( file ) === -1 ) {
		var name = file.replace( '.js', '' ); // XXX unsanitized
		exports[name] = require( './' + file );
	}
} );

// needs to be loaded last
exports.error = require( './error.js' );

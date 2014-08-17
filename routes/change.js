var app = require( '../' );
var request = require( 'request' );

app.get( '/c', function ( req, res ) {
	res.render( 'changehome' );
} );

app.post( '/c', function ( req, res ) {
	var change = req.body.change;
	if ( !change ) {
		res.redirect( '/c' );
	} else if ( !isNaN( change ) ) {
		res.redirect( '/c/' + change );
	} else if ( change.length === 41 ) {
		if ( change.match( /^[a-z0-9]+$/i ) ) {
			request( 'https://gerrit.wikimedia.org/r/changes/' + change, function ( err, resp, body ) {
				if ( err || resp.statusCode !== 200 ) {
					req.flash( 'err', 'Unable to fetch that change.' );
					res.render( 'changehome' );
				} else {
					body = body.substr(4);
					var data = JSON.parse( body );
					res.redirect( '/c/' + data._number );
				}
			} );


		} else {
			req.flash( 'err', 'Invalid Change-ID (not alphanumeric)' );
			res.render( 'changehome' );
		}
	} else {
		req.flash( 'err', 'Unable to parse that change.' );
		res.render( 'changehome' );
	}
} );

app.get( '/c/:change', function ( req, res ) {
	res.render( 'change' );
} );

var app = require( '../' );
var request = require( 'request' );
var moment = require( 'moment' );
var fs = require( 'fs' );

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
					body = body.substr( 4 );
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
	if ( req.query.purge || !fs.existsSync( 'cache/' + req.params.change + '.json' ) ) {
		request( 'https://gerrit.wikimedia.org/r/changes/' + req.params.change + '/detail', function ( err, resp, body ) {
			if ( err || resp.statusCode !== 200 ) {
				req.flash( 'err', 'Unable to fetch change ' + req.params.change + ' (gerrit error)' );
				res.redirect( '/c/' );
			} else {
				body = body.substr( 4 );
				var data = JSON.parse( body );
				data._timestamp = moment();
				data._fresh = false;
				fs.writeFile( 'cache/' +  req.params.change + '.json', JSON.stringify( data ) );
				data._fresh = true;
				res.render( 'change', { data: data, locals: { moment: moment } } );
			}
		} );
	} else {
		fs.readFile( 'cache/' + req.params.change + '.json', { encoding: 'utf-8' }, function ( err, data ) {
			if ( err ) {
				res.send( 'not able to read cache' );
			}
			data = JSON.parse( data );
			console.log( data.labels );
			data._age = moment( data._timestamp ).fromNow();
			res.render( 'change', { data: data, locals: { moment: moment } } );
		} );
	}
} );

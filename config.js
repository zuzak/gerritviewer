var convict = require( 'convict' );

var conf = convict( {
	web: {
		port: {
			doc: 'The port to bind.',
			format: 'port',
			default: 3000,
			env: 'PORT'
		}
	}
} );

conf.validate();

module.exports = conf;

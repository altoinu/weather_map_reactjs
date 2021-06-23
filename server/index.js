var app = require('./app.js');

// pm2 shutdown stuff
var doPM2Shutdown = function() {

	app.shutdown().fin(function() {

		// exit
		process.exit(0);

	}).done();

};

process.on('message', function(message) {

	if (message === 'shutdown')
		doPM2Shutdown();

});

process.on('SIGINT', function() {
	doPM2Shutdown();
});
// --------------------------------------------------------------------------
//
// required Node JS modules
//
// --------------------------------------------------------------------------

var cluster = require('cluster');
var os = require('os');
var path = require('path');

var $bodyParser = require('body-parser');
var $express = require('express');
var $q = require('q');

var app_base = require('./utils/app_base.js');
var RouteDefinition = require('./utils/RouteDefinition.js');

var app_vars = require('./models/app_vars.js');

// --------------------------------------------------------------------------
//
// private variables
//
// --------------------------------------------------------------------------

var port = normalizePort(app_vars.port);

var cors = require('./utils/CORS.js')({
	'origin': app_vars.CORS_ALLOW_ORIGIN
});

//--------------------------------------------------------------------------
//
// private functions
//
// --------------------------------------------------------------------------

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {

	var port = parseInt(val, 10);

	if (isNaN(port)) {

		// named pipe
		return val;

	}

	if (port >= 0) {

		// port number
		return port;

	}

	return false;

}

// --------------------------------------------------------------------------
//
// stuff
//
// --------------------------------------------------------------------------

console.log('System info-')
console.log('num cpus- ', os.cpus().length);
console.log('nodejs version:', process.version);
console.log('process:', process.pid);
console.log('cluster.isMaster:', cluster.isMaster);

var appObj = app_base('app_base, app.js:', {
	//baseUrl: '/some/base/path',
	//baseUrl: CONFIG.API.path
	serverPort: port,
	appSettings: [
		{
			name: 'views',
			value: path.join(__dirname, 'hbs_views')
		},
		{
			name: 'view engine',
			value: 'hbs'
		}
	],
	middleware: [
		$bodyParser.json({
			limit: '1mb'
		}),
		$bodyParser.urlencoded({
			parameterLimit: 100000,
			limit: '1mb',
			extended: true
		}),
		cors.allow,
		RouteDefinition([
			path.join(__dirname, '/routes/ConfigRoute.js'),
			{
				route: path.join(__dirname, '/routes/ConfigRoute.js'),
				baseUrl: '/whatever', //optional
				shutdown: function() {

					console.log('shutdown for route /routes/ConfigRoute.js under /whatever');
					return $q.resolve();

				}
			},
			/*
			{
				route: path.join(__dirname, '/routes/ConfigRoute.js'),
				baseUrl: '/whatever', //optional
				shutdown: function () {
	
					console.log('shutdown for this route');
					return $q.resolve();
	
				}
			}
			{
				route: path to module, instance of express.Router(), or require('path to express.Router() module'),
				baseUrl: '/whatever', //optional
				shutdown: function() {
					
					console.log('shutdown for this route');
					return $q.resolve();
					
				}
			}
			*/
			path.join(__dirname, '/routes/OpenWeatherRoute.js'),
		]),
		//$express.static(path.join(__dirname, '../public'))
		// Angularjs front end *********************************************************
		/*
		{
			baseUrl: '/angularjs',
			middleware: $express.static(path.join(__dirname, '../public_angularjs1')),
		},
		*/
		// Angular front end ***********************************************************
		/*
		{
			baseUrl: '/angular',
			middleware: (function () {

				var router = $express.Router();

				var filePath = '../my-angular-app/dist/my-angular-app';

				router.use($express.static(path.join(__dirname, filePath)));

				// For when using client side routing like angular router and sub folder on server
				// (ex http://www.example.com/path/to/angular/app/)
				// https://angular.io/cli/build
				// https://shekhargulati.com/2017/07/06/angular-4-use-of-base-href-and-deploy-url-build-options/
				// https://stackoverflow.com/questions/51182322/whats-the-difference-between-base-href-and-deploy-url-parameters-of-angular
				router.get('/*', function (req, res) {

					console.log('redirect for Angular, yo!', req.baseUrl, req.url, '-> index.html');
					//console.log(req.path);
					//console.log(req.url);

					// redirect to index.html so client side routing can take over
					res.sendFile(path.join(__dirname, filePath, 'index.html'));

				});

				return router;

			})()
		},
		*/
		/*
		{
			// For when using client side routing like angular router and sub folder on server
			// (ex http://www.example.com/path/to/angular/app/)
			// https://angular.io/cli/build
			// https://shekhargulati.com/2017/07/06/angular-4-use-of-base-href-and-deploy-url-build-options/
			// https://stackoverflow.com/questions/51182322/whats-the-difference-between-base-href-and-deploy-url-parameters-of-angular
			baseUrl: '/angular/*',
			method: 'GET',
			middleware: function (req, res) {

				console.log('redirect for Angular', req.baseUrl, req.url, '-> index.html');
				//console.log(req.path);
				//console.log(req.url);

				var filePath = '../my-angular-app/dist/my-angular-app';

				// redirect to index.html so client side routing can take over
				res.sendFile(path.join(__dirname, filePath, 'index.html'));

			}
		},
		*/
		// React front end *************************************************************
		/*
		{
			baseUrl: '/react',
			middleware: (function () {

				var router = $express.Router();

				var filePath = '../my-react-app/build';

				router.use($express.static(path.join(__dirname, filePath)));

				// For when using client side routing like react-router and sub folder on server
				// (ex http://www.example.com/path/to/react/app/)
				// https://create-react-app.dev/docs/deployment/#serving-apps-with-client-side-routing
				// https://muffinman.io/react-router-subfolder-on-server/
				router.get('/*', function (req, res) {

					console.log('redirect for React, yo!', req.baseUrl, req.url, '-> index.html');
					//console.log(req.path);
					//console.log(req.url);

					// redirect to index.html so client side routing can take over
					res.sendFile(path.join(__dirname, filePath, 'index.html'));

				});

				return router;

			})()
		},
		*/
		/*
		{
			// For when using client side routing like react-router and sub folder on server
			// (ex http://www.example.com/path/to/react/app/)
			// https://create-react-app.dev/docs/deployment/#serving-apps-with-client-side-routing
			// https://muffinman.io/react-router-subfolder-on-server/
			baseUrl: '/react/*',
			method: 'GET',
			middleware: function (req, res) {

				console.log('redirect for React', req.url, '-> index.html');
				//console.log(req.path);
				//console.log(req.url);

				var filePath = '../my-react-app/build';

				// redirect to index.html so client side routing can take over
				res.sendFile(path.join(__dirname, filePath, 'index.html'));

			}
		}
		*/
		{
			baseUrl: '/',
			middleware: (function() {

				var router = $express.Router();

				var filePath = '../reactjs/build';

				router.use($express.static(path.join(__dirname, filePath)));

				// For when using client side routing like react-router and sub folder on server
				// (ex http://www.example.com/path/to/react/app/)
				// https://create-react-app.dev/docs/deployment/#serving-apps-with-client-side-routing
				// https://muffinman.io/react-router-subfolder-on-server/
				router.get('/*', function(req, res) {

					console.log('redirect for React, yo!', req.baseUrl, req.url, '-> index.html');
					//console.log(req.path);
					//console.log(req.url);

					// redirect to index.html so client side routing can take over
					res.sendFile(path.join(__dirname, filePath, 'index.html'));

				});

				return router;

			})()
		},
	]
});

module.exports = {
	app: appObj.app,
	shutdown: function() {
		// do necessary shutdown stuff here
		return appObj.shutdown();
	}
}
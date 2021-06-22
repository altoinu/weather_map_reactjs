/**
 * Function to create Express app and server
 * @module app_base
 * @version 1.3.0 2020-05-21
 * @requires express
 * @requires cookie-parser
 * @requires morgan
 * @requires q
 * @requires module:RouteDefinition
 * 
 * @example
 * var app_base = require('app_base.js');
 * var appObj = app_base('app_base, app.js:', {
 *    baseUrl: '/some/base/path',
 *    serverPort: 3000,
 *    appSettings: [
 *       {
 *          name: 'views',
 *          value: path.join(__dirname, 'utils/hbs_views')
 *       },
 *       {
 *          name: 'view engine',
 *          value: 'hbs'
 *       }
 *    ],
 *    middleware: [
 *       $bodyParser.json({
 *          limit: '1mb'
 *       }),
 *       $bodyParser.urlencoded({
 *          parameterLimit: 100000,
 *          limit: '1mb',
 *          extended: true
 *       }),
 *       cors.allow,
 *       RouteDefinition([
 *          path.join(__dirname, '/routes/ConfigRoute.js'),
 *          {
 *             route: express.Router() or require('...'),
 *             baseUrl: '/whatever', //optional
 *             shutdown: function() {
 *                console.log('shutdown for this route');
 *                return $q.resolve();
 *             }
 *          }
 *       ]),
 *       $express.static(path.join(__dirname, '../public')),
 *       {
 *          baseUrl: '/angular',
 *          middleware: $express.static(path.join(__dirname, '../my-angular-app/dist/my-angular-app'))
 *       },
 *       {
 *          baseUrl: '/angular/*',
 *          method: 'GET',
 *          middleware: function (req, res) {
 *             // redirect to index.html
 *             res.sendFile(path.join(__dirname, '../my-angular-app/dist/my-angular-app', 'index.html'));
 *          }
 *       },
 *       {
 *          baseUrl: '/react',
 *          middleware: (function() {
 *             var router = $express.Router();
 *             var filePath = '../my-react-app/build';
 *             router.use($express.static(path.join(__dirname, filePath)));
 *             router.get('/*', function(req, res) {
 *                // redirect to index.html
 *                res.sendFile(path.join(__dirname, filePath, 'index.html'));
 *             });
 * 
 *             return router;
 *          })()
 *       }
 *    ]
 * });
 * 
 * @todo Sample TODO text
 */
/*
 *    routesDef: RouteDefinition([
 *       path.join(__dirname, '/routes/ConfigRoute.js'),
 *       {
 *          route: express.Router() or require('...'),
 *          baseUrl: '/whatever', //optional
 *          shutdown: function() {
 *             console.log('shutdown for this route');
 *             return $q.resolve();
 *          }
 *       }
 *    ])
 */
var VERSION = '1.2.1';

//--------------------------------------------------------------------------
//
// required Node JS modules
//
// --------------------------------------------------------------------------

var mod_express = require('express');
var mod_cookieParser = require('cookie-parser');
var mod_morgan = require('morgan');
var mod_Q = require('q');

var CONSTANTS = require('../models/constants.js');
//var ObjectUtils = require('./ObjectUtils.js');

// --------------------------------------------------------------------------
//
// module
//
// --------------------------------------------------------------------------

/**
 * @param {string} logPrefix
 * @param {Object} config - App configuration.
 * @param {Object} [config.baseUrl] - Base URL
 * @param {string} config.serverPort - Port number for server.
 * @param {Object[]} [config.appSettings]
 * @param {Object[]} [config.middleware]
 */
/*
 * @param {Object} [config.routesDef] - RouteDefinition object
 */
var app_base = function (logPrefix, config) {

	// --------------------------------------------------------------------------
	//
	// private variables
	//
	// --------------------------------------------------------------------------

	var Logger = require('./Logger.js');
	var logger = new Logger();
	logger.prefix = logPrefix;

	var appSettings = config.hasOwnProperty('appSettings') ? config.appSettings : null;
	var middleware = config.hasOwnProperty('middleware') ? config.middleware : null;
	// DEPRECATED - routesDef	
	var routesDef = config.hasOwnProperty('routesDef') ? config.routesDef : null;
	var baseUrl = config.hasOwnProperty('baseUrl') ? config.baseUrl : null;
	if (baseUrl)
		baseUrl = (baseUrl.charAt(0) != '/' ? '/' : '') + baseUrl;
	var serverPort = config.hasOwnProperty('serverPort') ? config.serverPort : null;

	var app = mod_express();

	// --------------------------------------------------------------------------
	//
	// stuff
	//
	// --------------------------------------------------------------------------

	// application settings
	if (appSettings) {

		if (!Array.isArray(appSettings)) {

			appSettings = [
				appSettings
			];

		}

		appSettings.forEach(function (setting, index, array) {

			app.set(setting.name, setting.value);

		});

	}

	// default middlewares
	app.use(mod_morgan('dev'));

	// add middleware
	if (middleware) {

		if (!Array.isArray(middleware)) {

			middleware = [
				middleware
			];

		}

		middleware.forEach(function (mid, index, array) {

			var targetMiddlewareMethod = 'use';
			if (mid.hasOwnProperty('method')) {

				// https://expressjs.com/en/4x/api.html#app.METHOD
				switch (mid.method.toLowerCase()) {

					case 'all':
					case 'checkout':
					case 'copy':
					case 'delete':
					case 'get':
					case 'head':
					case 'lock':
					case 'merge':
					case 'mkactivity':
					case 'mkcol':
					case 'move':
					case 'm-search':
					case 'notify':
					case 'options':
					case 'patch':
					case 'post':
					case 'purge':
					case 'put':
					case 'report':
					case 'search':
					case 'subscribe':
					case 'trace':
					case 'unlock':
					case 'unsubscribe':
						targetMiddlewareMethod = mid.method.toLowerCase();
						break;

					default:
						targetMiddlewareMethod = 'use';

				}

			}

			var targetMiddlewareBaseUrl = (baseUrl ? baseUrl : '') + (mid.hasOwnProperty('baseUrl') ? mid.baseUrl : '');
			var targetMiddleware = mid.hasOwnProperty('middleware') ? mid.middleware : mid;

			if (targetMiddlewareBaseUrl.length > 0)
				app[targetMiddlewareMethod](targetMiddlewareBaseUrl, targetMiddleware);
			else
				app[targetMiddlewareMethod](targetMiddleware);

		});

	}

	// DEPRECATED - routesDef
	if (routesDef) {

		// If path specified, mount routes to there [baseUrl]/[routesDef routes]...
		// (ex baseUrl == /api then /api/[routesDef routes]...
		if (baseUrl)
			app.use(baseUrl, routesDef.routes);
		else
			app.use(routesDef.routes);

	}

	// catch 404 and forward to error handler
	app.use(function (req, res, next) {

		var err = new Error('Not Found');
		err.status = 404;
		next(err);

	});

	// error handlers
	app.use(function (err, req, res, next) {

		res.status(err.status || 500);
		next(err);

	});

	function isDevEnv() {

		//return app.get('env') === 'development';
		return app.get('env') === CONSTANTS.ENV.DEV.name;

	}

	function createErrorReturnObj(error) {

		var errorObj = {
			status: error.status || 500,
			message: error.message
		};

		if (isDevEnv()) {

			// development error handler
			// will print stacktrace
			errorObj.error = error;

		} else {

			// production error handler
			// no stacktraces leaked to user
			errorObj.error = {
				status: error.status
			};

		}

		return errorObj;

	}

	// return as json if .json is in URL
	app.use('/\*.json', function (err, req, res, next) {

		console.log('.json error');

		var errorObj = createErrorReturnObj(err);
		if (isDevEnv())
			errorObj.error = errorObj.error.stack;

		res.json(errorObj);

	});

	// or render
	app.use(function (err, req, res, next) {

		console.log('render error');

		// res.send(ObjectUtils.convertToErrorObj(err));
		res.render('error', createErrorReturnObj(err));

	});

	// server
	var server = app.listen(serverPort, function () {

		var host = server.address().address;
		var port = server.address().port;

		logger.log('listening at port:' + port);

	});

	return {
		app: app,
		server: server,
		shutdown: function () {

			var shutdownPromises = [
				// shutdown server
				(function () {

					var deferred = mod_Q.defer();
					server.close(function () {
						deferred.resolve(server);
					});

					return deferred.promise;

				})()
			];

			// shutdown methods
			if (middleware) {

				shutdownPromises = shutdownPromises.concat(middleware.reduce(function (shutdownActions, mid, index, array) {

					if (mid.hasOwnProperty('shutdown'))
						shutdownActions.push(mid.shutdown());

					return shutdownActions;

				}, []));

			}

			// DEPRECATED - shutdown for routesDef
			if (routesDef)
				shutdownPromises.push(routesDef.shutdown());

			return mod_Q.allSettled(shutdownPromises);

		}
	};

}

app_base.version = VERSION;

module.exports = app_base;
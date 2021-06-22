/**
 * Module to create routes definition to be used by app_base.
 * @module RouteDefinition
 * @version 1.0.0 2020-05-21
 * @requires express
 * @requires q
 * @requires Logger
 * 
 * @example
 * var routes = RouteDefinition([
 *    // path to module
 *    path.join(__dirname, '/routes/ConfigRoute.js'),
 *    // instance of express.Router()
 *    express.Router(),
 *    // require('path to express.Router() module'),
 *    require(path.join(__dirname, '/routes/ConfigRoute.js')),
 *    // object
 *    {
 *       route: path to module, instance of express.Router(), or require('path to express.Router() module'),
 *       baseUrl: '/whatever', //optional
 *       shutdown: function() {
 *          console.log('shutdown for this route');
 *          return $q.resolve();
 *       }
 *    }
 * ]);
 */

var Logger = require('../utils/Logger.js');
var logger = new Logger();
logger.prefix = 'RouteDefinition:';

var mod_express = require('express');
var mod_Q = require('q');

var routesDefObj = [];

/**
 * @param {Object[]} routesDef - Array route definition.<br/>
 * Each module should be either<br/>
 * <ul>
 * <li>file path to module, or</li>
 * <li>instance of express.Router(), or</li>
 * <li>require('path to express.Router() module'), or</li>
 * <li>Object {route, (optional) shutdown, (optional) baseUrl}</li>
 * </ul>
 * @param {(express.Router())} routesDef[].route - path to module, instance of express.Router(),
 * or require('path to express.Router() module'),
 * @param {function} [routesDef[].shutdown] function()
 * @param {string} [routesDef[].baseUrl=''] - Base URL, ex '/api'
 */
function RouteDefinition(routesDef) {

	// --------------------------------------------------------------------------
	//
	// private variables
	//
	// --------------------------------------------------------------------------

	/*
	 * router
	 *    .use(routeCheck()
	 *    .use(subRouter
	 *       .use(subSubRouter
	 *          .use(routeCheck()
	 *          .use(route definition
	 *       .use(subSubRouter
	 *          .use(routeCheck()
	 *          .use(route definition
	 *       ...
	 */
	var router = mod_express.Router();

	// --------------------------------------------------------------------------
	//
	// Routes
	//
	// --------------------------------------------------------------------------

	var routeCheck = function (targetBaseUrl, req, res, next) {

		logger.log('================================================Route');
		logger.log('req.originalUrl', req.method, req.originalUrl);
		logger.log('req.baseUrl', req.baseUrl);
		logger.log('req.path', req.path);
		logger.log('req.url', req.url);
		
		if (targetBaseUrl)
			logger.log('baseUrl for this route:', targetBaseUrl);

		if (req.query) {

			// logger.log('req.query');
			logger.log('req.query', req.query);

		}
		// logger.log('req.route');
		// logger.log(req.route);

		next();

	};

	router.use(routeCheck.bind(this, null));

	var subRouter = mod_express.Router();

	// Read and set defined routes
	var args = Array.prototype.slice.call(routesDef);
	args.forEach(function (def, i, array) {

		logger.log(def);

		var r;
		if (typeof (def) === 'string')
			r = require(def);
		else
			r = def;

		routesDefObj.push(r);

		var targetRoute = r.hasOwnProperty('route') ? r.route : r;
		if (typeof (targetRoute) === 'string')
			targetRoute = require(targetRoute);

		var targetBaseUrl = (r.hasOwnProperty('baseUrl') && r.baseUrl) ? r.baseUrl : null;
		if (targetBaseUrl)
			targetBaseUrl = (targetBaseUrl.charAt(0) != '/' ? '/' : '') + targetBaseUrl;

		var subSubRouter = mod_express.Router();
		subSubRouter.use(routeCheck.bind(this, targetBaseUrl));
		subSubRouter.use(targetRoute);

		// If path specified, mount routes to there [baseUrl]/[routes]...
		if (targetBaseUrl)
			subRouter.use(targetBaseUrl, subSubRouter);
		else
			subRouter.use(targetRoute);

	});

	router.use(subRouter);

	return {
		//routes: router,
		middleware: router,
		shutdown: function () {

			// run shutdown stuff for each route
			return mod_Q.allSettled(routesDefObj.map(function (def, index, array) {

				if (def.hasOwnProperty('shutdown') && (typeof def.shutdown === 'function'))
					return def.shutdown();
				else
					return mod_Q.resolve();

			}));

		}
	};

}

module.exports = RouteDefinition;

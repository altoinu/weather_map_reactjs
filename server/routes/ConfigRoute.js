// --------------------------------------------------------------------------
//
// required Node JS modules
//
// --------------------------------------------------------------------------

var mod_express = require('express');
var mod_Q = require('q');

var app_vars = require('../models/app_vars.js');

var utils = require('../utils/utils.js');

// --------------------------------------------------------------------------
//
// private variables
//
// --------------------------------------------------------------------------

var Logger = require('../utils/Logger.js');
var logger = new Logger();
logger.prefix = 'ConfigRoute:';

// --------------------------------------------------------------------------
//
// stuff
//
// --------------------------------------------------------------------------

var ConfigRoute = mod_express.Router();

/**
 * @api {get} /getip.json Get IP
 * @apiVersion 0.0.0
 * @apiName GetIP
 * @apiGroup Config
 * @apiDescription Gets client IP address.
 * 
 * @apiParam {String} [callback] callback function for jsonp response
 * 
 * @apiExample {curl} Example usage:
 *    curl -i http://localhost/getip.json
 * 
 * @apiSuccess (200) {String} ip IP address of the client.
 * 
 * @apiSuccessExample {json} Success-Response
 *    {
 *       "ip": "1.2.3.4"
 *    }
 */
ConfigRoute.get('/getip.json', function(req, res) {

	logger.log('->getip.json');
	logger.log(req.query);

	var clientIP = req.header('x-forwarded-for') || req.connection.remoteAddress;
	var configValues = {
		ip: clientIP
	};

	res.status(200);
	res.header("Cache-Control", "no-cache, no-store, must-revalidate");
	res.header("Pragma", "no-cache");
	res.header("Expires", 0);

	if (req.query.hasOwnProperty('callback'))
		res.jsonp(configValues);
	else
		res.json(configValues);

});

/**
 * @api {get} /config.json Get Configuration
 * @apiVersion 0.0.0
 * @apiName GetConfig
 * @apiGroup Config
 * @apiDescription Gets configuration.
 * 
 * @apiParam {String} [callback] callback function for jsonp response
 * 
 * @apiExample {curl} Example usage:
 *    curl -i http://localhost/config.json
 * 
 * @apiSuccess (200) {String} env Environment (NODE_ENV).
 * @apiSuccess (200) {String} envName Environment name.
 * @apiSuccess (200) {String} envLongName Environment name, long format.
 * @apiSuccess (200) {String} ip IP address of the client.
 * 
 * @apiSuccessExample {json} Success-Response
 *    {
 *       "env": "production",
 *       "envName": "production",
 *       "envLongName": "Production",
 *       "ip": "1.2.3.4"
 *    }
 */
ConfigRoute.get('/config.json', function(req, res) {

	logger.log('->config.json');
	logger.log(req.query);

	var clientIP = req.header('x-forwarded-for') || req.connection.remoteAddress;

	var envConstants = utils.getENVConstants(app_vars.env);

	var configValues = {
		env: app_vars.env,
		envName: envConstants['name'],
		envLongName: envConstants['longname'],
		ip: clientIP,
	};

	res.status(200);
	res.header("Cache-Control", "no-cache, no-store, must-revalidate");
	res.header("Pragma", "no-cache");
	res.header("Expires", 0);

	if (req.query.hasOwnProperty('callback'))
		res.jsonp(configValues);
	else
		res.json(configValues);

});

module.exports = ConfigRoute;
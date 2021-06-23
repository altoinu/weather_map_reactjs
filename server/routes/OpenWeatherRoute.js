// --------------------------------------------------------------------------
//
// required Node JS modules
//
// --------------------------------------------------------------------------

let $express = require('express');
let $q = require('q');

let app_vars = require('../models/app_vars.js');

// --------------------------------------------------------------------------
//
// private variables
//
// --------------------------------------------------------------------------

let Logger = require('../utils/Logger.js');
let logger = new Logger();
logger.prefix = 'OpenWeatherRoute:';

// --------------------------------------------------------------------------
//
// stuff
//
// --------------------------------------------------------------------------

let route = $express.Router();

route.get('/currentTemperature', (req, res) => {

	logger.log('->currentTemperature', req.query);

	res.status(200);
	res.header("Cache-Control", "no-cache, no-store, must-revalidate");
	res.header("Pragma", "no-cache");
	res.header("Expires", 0);

	res.json({
		wow: 'hello'
	});

});

module.exports = route;

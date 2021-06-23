/**
 * Reads env var/default values for the system to use.
 */
var APP_DEFAULTS = require('./app_defaults.js');

var env = process.env.NODE_ENV || APP_DEFAULTS.env;

// testing process.env
console.log('---------------------');
console.log('env hello', process.env.hello || null);
console.log('---------------------');

module.exports = {
	env: env,
	port: process.env.PORT || '3000',
	CORS_ALLOW_ORIGIN: process.env.CORS_ALLOW_ORIGIN || []
};
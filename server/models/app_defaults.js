/**
 * Default values to be used if not specified in env var.
 * Don't put logics that are too crazy in here
 * Referenced by app_vars.js
 */
var CONSTANTS = require('./constants.js');

module.exports = {
	env: CONSTANTS.ENV.DEV.name
};
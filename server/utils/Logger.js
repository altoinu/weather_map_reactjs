/**
 * Module to handle console.log console.error
 * @module Logger
 * @version 1.1.1
 * 
 * @example
 * var Logger = require('Logger.js');
 * var logger = new Logger();
 * logger.prefix = 'LOG PREFIX:';
 * logger.log('hello');
 */

// TODO: Anonymous function is needed if this file is being used on front end
// (ex via requirejs) but it also breaks jsdoc
(function() {

	'use strict';

	/**
	 * @private
	 */
	function consoleMethod() {

		if (this.enabled) {

			var args = Array.prototype.slice.call(arguments);
			var method = args[0];

			// if (args.length > 1)
			// args[0] = logPrefix + args[0];

			console[method].apply(console, [
				this.prefix
			].concat(args.slice(1)));

		}

	}

	/**
	 * @class Logger
	 * @classdesc Handles logs
	 * 
	 * @param {boolean} [enabled=true] Enable/disable log.
	 * 
	 * @property {boolean} [enabled=true] Enable/disable log.
	 * @property {string} [prefix=''] Prefix displayed before every log.
	 * 
	 * @example
	 * var Logger = require('Logger.js');
	 * var logger = new Logger();
	 * logger.prefix = 'LOG PREFIX:';
	 * logger.log('hello');
	 */
	var Logger = function(enabled) {

		// --------------------------------------------------------------------------
		//
		// public properties
		//
		// --------------------------------------------------------------------------

		/**
		 * Enable/disable log.
		 * @type {boolean}
		 * @default true
		 */
		this.enabled = (enabled === undefined) ? true : enabled;

		/**
		 * Prefix displayed before every log.
		 * @type {string}
		 * @default ''
		 */
		this.prefix = '';

	};

	// --------------------------------------------------------------------------
	//
	// public methods
	//
	// --------------------------------------------------------------------------

	/**
	 * Displays log.
	 * @param {...Object} arguments Contents to display in log.
	 */
	Logger.prototype.log = function() {

		var args = Array.prototype.slice.call(arguments);
		consoleMethod.apply(this, [
			'log'
		].concat(args));

	};

	/**
	 * Displays warn log.
	 * @param {...Object} arguments Contents to display in warn log.
	 */
	Logger.prototype.warn = function() {

		var args = Array.prototype.slice.call(arguments);
		consoleMethod.apply(this, [
			'warn'
		].concat(args));

	};

	/**
	 * Displays error log.
	 * @param {...Object} arguments Contents to display in error log.
	 */
	Logger.prototype.error = function() {

		var args = Array.prototype.slice.call(arguments);
		consoleMethod.apply(this, [
			'error'
		].concat(args));

	};

	var logger = new Logger();
	logger.prefix = 'LOGGER:';

	if (typeof define === 'function') {

		define([
			'require'
		], function(require) {

			logger.log('requirejs define Logger');

			return Logger;

		});

	} else {

		logger.log('module.exports Logger');

		module.exports = Logger;

	}

})();

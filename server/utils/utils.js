var CONSTANTS = require('../models/constants.js');

function getENVConstants(envName) {

	for ( var prop in CONSTANTS.ENV) {

		if (envName == CONSTANTS.ENV[prop].name)
			return CONSTANTS.ENV[prop];

	}

	// default development if no match
	return CONSTANTS.ENV.DEV;

}

function getFileExtension(contentType) {

	switch (contentType) {

		case 'image/bmp':
		case 'image/x-windows-bmp':
			return '.bmp';

		case 'image/gif':
			return '.gif';

		case 'image/x-icon':
			return '.ico';

		case 'image/jpeg':
			return '.jpg';

		case 'image/png':
			return '.png';

		case 'image/tiff':
		case 'image/x-tiff':
			return '.tif';

	}

	return '';

}

module.exports = {
	getENVConstants: getENVConstants,
	getFileExtension: getFileExtension,
};
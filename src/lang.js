'use strict';

var toString = Object.prototype.toString;

function isArray(value) {
	return Array.isArray(value);
}

function isString(value) {
	return toString.call(value) === '[object String]';
}

module.exports = {
	isArray: isArray,
	isString: isString
};

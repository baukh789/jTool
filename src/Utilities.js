'use strict';

var toString = Object.prototype.toString;
var class2type = {
	'[object String]': 'string',
	'[object Boolean]': 'boolean',
	'[object Undefined]': 'undefined',
	'[object Number]': 'number',
	'[object Object]': 'object',
	'[object Error]': 'error',
	'[object Function]': 'function',
	'[object Date]': 'date',
	'[object Array]': 'array',
	'[object RegExp]': 'regexp',
	'[object Null]': 'null'
};

function isArray(value) {
	return Array.isArray(value);
}

function type(value) {
	return class2type[toString.call(value)];
}

function noop() {
	
}

module.exports = {
	isArray: isArray,
	noop: noop,
	type: type
};

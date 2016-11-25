'use strict';

var lang = require('../src/lang');

describe('lang', function() {

	it('isArray', function() {
		expect(lang.isArray([])).toBe(true);
		expect(lang.isArray({})).toBe(false);
		expect(lang.isArray(function(){})).toBe(false);
		expect(lang.isArray(123)).toBe(false);
	});

	it('isString', function() {
		expect(lang.isString('123')).toBe(true);
		expect(lang.isString(String('123'))).toBe(true);
		expect(lang.isString(function(){})).toBe(false);
		expect(lang.isString(123)).toBe(false);
	});

});

'use strict';

var utilities = require('../src/utilities');

describe('utilities', function() {

	it('isArray', function() {
		expect(utilities.isArray([])).toBe(true);
		expect(utilities.isArray({})).toBe(false);
		expect(utilities.isArray(function(){})).toBe(false);
		expect(utilities.isArray(123)).toBe(false);
	});

	it('type', function() {
		expect(utilities.type(undefined)).toBe('undefined');
		expect(utilities.type(null)).toBe('null');
		expect(utilities.type(true)).toBe('boolean');
		expect(utilities.type(Boolean())).toBe('boolean');
		expect(utilities.type(123)).toBe('number');
		expect(utilities.type(Number(123))).toBe('number');
		expect(utilities.type('123')).toBe('string');
		expect(utilities.type(String('123'))).toBe('string');
		expect(utilities.type(function(){})).toBe('function');
		expect(utilities.type([])).toBe('array');
		expect(utilities.type(new Array(1))).toBe('array');
		expect(utilities.type(new Date())).toBe('date');
		expect(utilities.type(Error())).toBe('error');
		expect(utilities.type(/test/)).toBe('regexp');
	});

});

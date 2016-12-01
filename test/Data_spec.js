'use strict';

var _Data = require('../src/Data');
var extend = require('../src/extend');
var Sizzle = require('../src/Sizzle');

describe('Animate', function() {

	var divEle = null;
	var jTool = null;

	beforeEach(function() {
		jTool = function(selector, context) {
			return new Sizzle(selector, context);
		};

		Sizzle.prototype = jTool.prototype = {};

		jTool.extend = jTool.prototype.extend = extend;
		jTool.prototype.extend(_Data);

		divEle = document.createElement('div');
		divEle.id = 'div1';
		document.body.appendChild(divEle);
	});

	afterEach(function() {
		document.body.removeChild(divEle);
		divEle = null;
		jTool = null;
	});

	it('data', function() {
		jTool('#div1').data('name', 'baukh');
		expect(jTool('#div1').data('name')).toBe('baukh');
		jTool('#div1').removeData('name');
		expect(jTool('#div1').data('name')).toBe(undefined);
		jTool('#div1').data('people', {name: 'baukh', sex: 'man'});
		expect(jTool('#div1').data('people')).toEqual({name: 'baukh', sex: 'man'});
		jTool('#div1').removeData('people');
		expect(jTool('#div1').data('people')).toBe(undefined);
	});

	it('attr', function() {
		jTool('#div1').attr('jtool', 'baukh');
		expect(jTool('#div1').attr('jtool')).toBe('baukh');
		jTool('#div1').removeAttr('jtool');
		expect(jTool('#div1').attr('jtool')).toBe(undefined);
	});

	it('prop', function() {
		jTool('#div1').prop('class', 'baukh');
		expect(jTool('#div1').prop('class')).toBe('baukh');
		jTool('#div1').removeProp('class');
		expect(jTool('#div1').prop('class')).toBe(undefined);
	});

	it('val', function() {
		jTool('#div1').val('baukh');
		expect(jTool('#div1').val()).toBe('baukh');
		jTool('#div1').val('');
		expect(jTool('#div1').val()).toBe('');
	});
});

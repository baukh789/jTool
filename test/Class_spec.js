'use strict';

var _Class = require('../src/Class');
var extend = require('../src/extend');
var Sizzle = require('../src/Sizzle');

describe('Class', function() {

	var divEle = null;
	var divEle2 = null;
	var jTool = null;

	beforeEach(function() {
		jTool = function(selector, context) {
			return new Sizzle(selector, context);
		};

		Sizzle.prototype = jTool.prototype = {};

		jTool.extend = jTool.prototype.extend = extend;

		jTool.prototype.extend(_Class);


		divEle = document.createElement('div');
		divEle.id = 'div1';
		divEle.classList.add('class1');
		document.body.appendChild(divEle);

		divEle2 = document.createElement('div');
		divEle2.id = 'div2';
		divEle2.classList.add('class21', 'class22');
		document.body.appendChild(divEle2);
	});

	afterEach(function() {
		document.body.removeChild(divEle);
		document.body.removeChild(divEle2);
		divEle = null;
		divEle2 = null;
		jTool = null;
	});

	it('addClass', function() {
		jTool('#div1').addClass('class2');
		expect(divEle.classList.contains('class2')).toBe(true);

		jTool('#div2').addClass('class23 class24');
		expect(divEle2.classList.toString()).toEqual('class21 class22 class23 class24');
	});

	it('removeClass', function() {
		jTool('#div1').removeClass('class1');
		expect(divEle.classList.contains('class1')).toBe(false);
		jTool('#div2').removeClass('class22 class24');
		expect(divEle2.classList.toString()).toEqual('class21');
	});

	it('hasClass', function() {
		expect(jTool('#div1').hasClass('class1')).toBe(true);
		expect(jTool('#div2').hasClass('class24')).toBe(false);
	});

	it('parseClassName', function() {
		expect(jTool('#div1').parseClassName('class1 class2')).toEqual(['class1', 'class2']);
		expect(jTool('#div2').parseClassName('class24')).toEqual(['class24']);
	});

});

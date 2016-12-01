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


	it('测试animate回调函数', function() {
	});
});

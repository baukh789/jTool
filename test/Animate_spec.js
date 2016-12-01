'use strict';

var _Animate = require('../src/Animate');
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

		jTool.prototype.extend(_Animate);


		divEle = document.createElement('div');
		divEle.id = 'div1';
		divEle.style.height = '50px';
		divEle.style.width = '50px';
		document.body.appendChild(divEle);
	});

	afterEach(function() {
		document.body.removeChild(divEle);
		divEle = null;
		jTool = null;
	});


	it('测试animate回调函数', function() {
		var animateCallbackHandler = jasmine.createSpy('callback');
		jTool('#div1').animate({height: '100px', width: '200px'}, 1000, animateCallbackHandler);
		setTimeout(function(){
			expect(animateCallbackHandler.calls.count()).toBe(1);
		}, 1000);
	});

	it('测试animate无时间参数', function(){
		var animateCallbackHandler = jasmine.createSpy('callback');
		jTool('#div1').animate({height: '100px', width: '200px'}, animateCallbackHandler);
		setTimeout(function(){
			expect(animateCallbackHandler.calls.count()).toBe(1);
		});
	});

	it('测试animate执行效果', function(){
		jTool('#div1').animate({height: '100px', width: '200px'}, 1000);
		setTimeout(function(){
			expect(divEle.style.height).toBe('100px');
			expect(divEle.style.width).toBe('200px');
		}, 1000);
	});

	it('测试show执行效果', function(){
		jTool('#div1').show();
		expect(divEle.style.display).toBe('block');
	});

	it('测试hide执行效果', function(){
		jTool('#div1').hide();
		expect(divEle.style.display).toBe('none');
	});
});

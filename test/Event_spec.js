var _Event = require('../src/Event');
var Sizzle = require('../src/Sizzle');
var extend = require('../src/extend');

describe('Event', function() {

	var jTool = null;
	var pEle = null;

	beforeEach(function() {
		jTool = function(selector, context) {
            return new Sizzle(selector, context);
		};

		Sizzle.prototype = jTool.prototype = {};

		jTool.extend = jTool.prototype.extend = extend;

		jTool.prototype.extend(_Event);


		pEle = document.createElement('p');
		pEle.id = 'p1';

		document.body.appendChild(pEle);
	});

	afterEach(function() {
		jTool = null;
		document.body.removeChild(pEle);
		pEle = null;
	});

	it('注册事件', function() {
		var clickHandler = jasmine.createSpy('clickHandler');

		jTool('#p1').on('click', clickHandler).trigger('click').trigger('click');

		expect(clickHandler.calls.count()).toBe(2);
	});

	it('注册多个事件', function() {
		var clickHandler = jasmine.createSpy('clickHandler');
		var clickHandler2 = jasmine.createSpy('clickHandler');

		jTool('#p1').on('mouseup', clickHandler).on('mouseup', clickHandler2).trigger('mouseup');
		expect(clickHandler.calls.count()).toBe(1);
		expect(clickHandler2.calls.count()).toBe(1);
	});

	it('注册多个不同事件', function() {
		var clickHandler = jasmine.createSpy('clickHandler');
		var clickHandler2 = jasmine.createSpy('clickHandler');
		jTool('#p1').on('mousedown', clickHandler).on('click', clickHandler2).trigger('click').trigger('click').trigger('mousedown');

		expect(clickHandler.calls.count()).toBe(1);
		expect(clickHandler2.calls.count()).toBe(2);
	});

	it('测试window', function () {
		var clickHandler = jasmine.createSpy('clickHandler');
		var clickHandler2 = jasmine.createSpy('clickHandler');
		jTool(window).on('mousedown', clickHandler).on('click', clickHandler2).trigger('click').trigger('click').trigger('mousedown');

		expect(clickHandler.calls.count()).toBe(1);
		expect(clickHandler2.calls.count()).toBe(2);
	});

	it('测试document', function () {
		var clickHandler = jasmine.createSpy('clickHandler');
		var clickHandler2 = jasmine.createSpy('clickHandler');
		jTool(document).on('mousedown', clickHandler).on('click', clickHandler2).trigger('click').trigger('click').trigger('mousedown');

		expect(clickHandler.calls.count()).toBe(1);
		expect(clickHandler2.calls.count()).toBe(2);
	});

	it('测试双击事件', function () {
		var clickHandler = jasmine.createSpy('clickHandler');
		jTool(document).on('dblclick', clickHandler).trigger('dblclick');

		expect(clickHandler.calls.count()).toBe(1);
	});
	// 只有click事件可以通过trigger进行调用, 需要修改.(但是通过真实的事件触发,是不会有问题的)
	it('子选择器预绑定事件', function () {
		var clickHandler = jasmine.createSpy('clickHandler');
		jTool('#p1').on('click', 'span', clickHandler);
		var span1 = document.createElement('span');
		span1.className = 'span1';
		document.querySelector('#p1').appendChild(span1);
		jTool('.span1').trigger('click');
		expect(clickHandler.calls.count()).toBe(1);
	});



});

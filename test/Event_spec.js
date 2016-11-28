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
	
	// it('注册事件', function() {
	// 	var clickHandler = jasmine.createSpy('clickHandler');
	//
	// 	jTool('#p1').on('click', clickHandler).trigger('click').trigger('click');
	//
	// 	expect(clickHandler.calls.count()).toBe(2);
	// });
	//
	// it('注册多个事件', function() {
	// 	var clickHandler = jasmine.createSpy('clickHandler');
	//
	// 	jTool('#p1').on('click', clickHandler).on('click', clickHandler).trigger('click');
	//
	// 	expect(clickHandler.calls.count()).toBe(2);
	// });
	//
	// it('注册多个不同事件', function() {
	// 	var clickHandler = jasmine.createSpy('clickHandler');
	//
	// 	jTool('#p1').on('dblclick', clickHandler).on('click', clickHandler).trigger('click').trigger('dblclick');
	//
	// 	expect(clickHandler.calls.count()).toBe(2);
	// });
});

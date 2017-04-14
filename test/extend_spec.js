'use strict';

var extend = require('../src/extend');

describe('extend', function() {

	var obj1 = null, obj2 = null, obj3 = null, obj4 = null, obj5 = null;

	beforeEach(function() {
		obj1 = {
			prop: 0,
			prop1: 1,
			fun1: function() {

			}
		};

		obj2 = 	{
			prop: 11,
			prop2: 2,
			fun: function() {

			}
		};

		obj3 = {
			prop3: 3,
			fun: function() {

			}
		};

		obj4 = Object.create(obj2);

		obj4.prop4 = 4;

		obj5 = {};

		Object.defineProperty(obj5, 'prop', {
			enumerable: true,
			configurable: false,
			writable: false,
			value: 'enumerable'
		});

		Object.defineProperty(obj5, 'anotherProp', {
			enumerable: false,
			value: 'noEnumerable'
		});
	});

	afterEach(function() {
		obj1 = obj2 = obj3 = obj4 = obj5 = null;
	});

	it('两个对象之间的 extend', function() {
		expect(extend(obj1, obj2)).toEqual({prop:11, prop1:1, prop2:2, fun1: obj1.fun1, fun: obj2.fun});
	});

	it('多个对象之间的 extend', function() {
		expect(extend(obj1, obj2, obj3)).toEqual({prop:11, prop1:1, prop2:2, prop3:3, fun1: obj1.fun1, fun: obj3.fun});
	});

	it('extend 对象自身的属性和方法', function() {
		expect(extend(obj1, obj4)).toEqual({prop:0, prop1: 1, fun1: obj1.fun1, prop4: 4});
	});

	it('extend 可枚举的属性和方法', function() {
		expect(extend(obj1, obj5)).toEqual({prop: 'enumerable', prop1: 1, fun1: obj1.fun1});
	});

	it('extend 可枚举的属性和方法2', function() {
		var o = {name:'baukh', love:{a:1,b:2}};
		var o2 = extend(true, {}, o);
		o2.love.a = 2;
		expect(o.love.a).toBe(1);
		expect(o2.love.a).toBe(2);
	});


	it('对 JTool 对象进行扩展', function() {
		var JTool = {};
		JTool.extend = extend;
		JTool.extend(obj1);

		expect(JTool.fun1).toEqual(obj1.fun1);
		expect(JTool.prop).toEqual(obj1.prop);
		expect(JTool.prop1).toEqual(obj1.prop1);
	});

});

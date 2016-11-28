(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var utilities = require('./utilities');

var _Event = {

	on: function(event, querySelector, callback, useCapture) {
		// 将事件触发执行的函数存储于DOM上, 在清除事件时使用
		return this.addEvent(this.getEventObject(event, querySelector, callback, useCapture));
	},

	off: function(event, querySelector) {
		return this.removeEvent(this.getEventObject(event, querySelector));
	},

	bind: function(event, callback, useCapture) {
		return this.on(event, callback, useCapture);
	},

	unbind: function(event) {
		return this.removeEvent(this.getEventObject(event));
	},

	trigger: function(event) {
		utilities.each(this.DOMList, function(e, element){
			try {
				// TODO 潜在风险 window 不支持这样调用事件
				element['jToolEvent'][event]();
			} catch(err) {
				utilities.error(err);
			}
		});

		return this;
	},

	// 获取 jTool Event 对象
	getEventObject: function(event, querySelector, callback, useCapture) {
		// $(dom).on(event, callback);
		if (typeof querySelector === 'function') {
			callback = querySelector;
			useCapture = callback || false;
			querySelector = undefined;
		}
		// event callback 为必要参数
		if (!event) {
			utilities.error('事件绑定失败,原因: 参数中缺失事件类型');
			return this;
		}

		if (!querySelector) {
			querySelector = '';
		}

		// 存在子选择器 -> 包装回调函数
		if (querySelector !== '') {
			var fn = callback;
			callback = function(e) {
				// 验证子选择器所匹配的 nodeList 中是否包含当前事件源
				if ([].indexOf.call(this.querySelectorAll(querySelector), e.target) !== -1) {
					fn.apply(e.target, arguments);
				}
			};
		}
		var eventSplit = event.split(' ');
		var eventList = [],
			eventScopeSplit,
			eventObj;

		utilities.each(eventSplit, function(i, eventName) {
			if (eventName.trim() === '') {
				return true;
			}

			eventScopeSplit = eventName.split('.');
			eventObj = {
				eventName: eventName + querySelector,
				type: eventScopeSplit[0],
				querySelector: querySelector,
				callback: callback || utilities.noop,
				useCapture: useCapture || false,
				// TODO: nameScope暂时不用
				nameScope: eventScopeSplit[1] || undefined
			};
			eventList.push(eventObj);
		});

		return eventList;
	},

	// 增加事件,并将事件对象存储至DOM节点
	addEvent: function(eventList) {
		var _this = this;
		utilities.each(eventList, function (index, eventObj) {
			utilities.each(_this.DOMList, function(i, v){
				v.jToolEvent = v.jToolEvent || {};
				v.jToolEvent[eventObj.eventName] = v.jToolEvent[eventObj.eventName] || [];
				v.jToolEvent[eventObj.eventName].push(eventObj);
			});
		});
		return _this;
	},

	// 删除事件,并将事件对象移除出DOM节点
	removeEvent: function(eventList) {
		var _this = this;
		var eventFnList; //事件执行函数队列
		utilities.each(eventList, function(index, eventObj) {
			utilities.each(_this.DOMList, function(i, v){
				if (!v.jToolEvent) {
					return;
				}
				eventFnList = v.jToolEvent[eventObj.eventName];
				if (eventFnList) {
					utilities.each(eventFnList, function(i2, v2) {
						v.removeEventListener(v2.type, v2.callback);
					});
					v.jToolEvent[eventObj.eventName] = undefined;
				}
			});
		});
		return _this;
	}
};

module.exports = _Event;

},{"./utilities":6}],2:[function(require,module,exports){
/**
 * Created by baukh on 16/11/25.
 */
// Sizzle 选择器, 类似于 jQuery.Sizzle;

var utilities = require('./utilities');

var Sizzle = function(selector, context) {

	var DOMList;

	// selector -> undefined || null
	if (!selector) {
		selector = null;
	}

	// selector -> window
	else if (utilities.isWindow(selector)) {
		DOMList = [selector];
		context = undefined;
	}

	// selector -> document
	else if (selector === document) {
		DOMList = [document];
		context = undefined;
	}

	// selector -> DOM
	else if (selector instanceof HTMLElement) {
		DOMList = [selector];
		context = undefined;
	}

	// selector -> NodeList || selector -> Array
	else if (selector instanceof NodeList || selector instanceof Array) {
		DOMList = selector;
		context = undefined;
	}

	// selector -> jTool Object
	else if (selector.jTool) {
		DOMList = selector.DOMList;
		context = undefined;
	}

	// selector -> Html String
	else if (/<.+>/.test(selector)) {
		// TODO
		// DOMList = jTool.prototype.createDOM(selector);
		context = undefined;
	}

	// selector -> 字符CSS选择器
	else {
		// context -> undefined
		if (!context) {
			DOMList = document.querySelectorAll(selector);
		}

		// context -> 字符CSS选择器
		else if (typeof context === 'string') {
			context = document.querySelectorAll(context);
		}

		// context -> DOM 将HTMLElement转换为数组
		else if (context instanceof HTMLElement) {
			context = [context];
		}

		// context -> NodeList
		else if (context instanceof NodeList) {
			context = context;
		}

		// context -> jTool Object
		else if (context.jTool) {
			context = context.DOMList;
		}

		// 其它不可以用类型
		else {
			context = undefined;
		}

		// 通过父容器获取 NodeList: 存在父容器
		if (context) {
			DOMList = [];
			utilities.each(context, function (i, v) {
				// NodeList 只是类数组, 直接使用 concat 并不会将两个数组中的参数边接, 而是会直接将 NodeList 做为一个参数合并成为二维数组
				utilities.each(v.querySelectorAll(selector), function (i2, v2) {
					DOMList.push(v2);
				});
			});
		}
	}

	if (!DOMList || DOMList.length === 0) {
		DOMList = undefined;
	}

	// 用于确认是否为jTool对象
	this.jTool = true;

	// 用于存储当前选中的节点
	this.DOMList = DOMList;
	this.length = this.DOMList ? this.DOMList.length : 0;

	// 存储选择器条件
	this.querySelector = selector;

	return this;
};

module.exports = Sizzle;

},{"./utilities":6}],3:[function(require,module,exports){
/*
 * ajax
 * type === GET: data格式 name=baukh&age=29
 * type === POST: data格式 { name: 'baukh', age:29 }
 * 与 jquery 不同的是,[success, error, complete]返回的第二个参数, 并不是返回错误信息, 而是错误码
 * */

var extend = require('./extend');
var utilities = require('./utilities');

function ajax(options) {

	var defaults = {
		url: null,
		type: 'GET',
		data: null,
		headers: {},
		async: true,
		beforeSend: utilities.noop,
		complete: utilities.noop,
		success: utilities.noop,
		error: utilities.noop
	};


	options = extend(defaults, options);


	if (!options.url) {
		utilities.error('jTool ajax: url不能为空');
		return;
	}

	var xhr = new XMLHttpRequest();

	if (options.type === 'POST' && utilities.type(options.data) === 'object') {
		options.data = JSON.stringify(options.data);
	} else if(options.type === 'GET' && utilities.type(options.data) === 'string') {
		options.url = options.url + (options.url.indexOf('?') === -1 ?  '?' : '&') + options.data;
	}

	xhr.open(options.type, options.url, options.async);

	for (var key in options.headers) {
		xhr.setRequestHeader(key, options.headers[key]);
	}

	// 执行发送前事件
	options.beforeSend(xhr);

	// 监听onload并执行完成事件
	xhr.onload = function() {
		// jquery complete(XHR, TS)
		options.complete(xhr, xhr.status);
	};

	// 监听onreadystatechange并执行成功后失败事件
	xhr.onreadystatechange = function() {

		if (xhr.readyState !== 4) {
			return;
		}

		if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
			// jquery success(XHR, TS)
			options.success(xhr.response, xhr.status);
		} else {
			// jquery error(XHR, TS, statusText)
			options.error(xhr, xhr.status, xhr.statusText);
		}
	};

	xhr.send(options.data);
}

function post(url, data, callback) {
	ajax({ url: url, type: 'POST', data: data, success: callback });
}

module.exports = {
	ajax: ajax,
	post: post
};

},{"./extend":4,"./utilities":6}],4:[function(require,module,exports){
// 可以使用 Object.assign() 方法完成该功能

function extend() {
	// 参数为空,返回空对象
	if (arguments.length === 0) {
		return {};
	}

	var deep = false, // 是否递归
		i = 1,
		target = arguments[0],
		options;

	// 如果参数只有一个, 将认为是对jTool进行扩展
	if (arguments.length === 1) {
		target = this;
		i = 0;
	}

	// 暂不支持 递归
	if(typeof(target) === 'boolean') {
		// deep = target;
		target = arguments[1] || {};
	}

	for (; i < arguments.length; i++) {
		options = arguments[i] || {};
		for (var p in options) {
			if (options.hasOwnProperty(p)) {
				target[p] = options[p];
			}
		}
	}
	return target;
}

module.exports = extend;

},{}],5:[function(require,module,exports){


var Sizzle = require('./Sizzle');
var Extend = require('./extend');
var Utilities = require('./utilities');
var Ajax = require('./ajax');
var Event = require('./Event');

// 如果需要集成Angular,React,在此处进行集成
var $ = jTool = function (selector, context){
    return new Sizzle(selector, context);
};

// 把jquery原先的jQuery.fn给省略了.原先的方式是 init = jQuery.fn.init; init.prototype = jQuery.fn;
Sizzle.prototype = jTool.prototype = {};
// 捆绑jTool 工具
jTool.extend = jTool.prototype.extend = Extend;
jTool.extend(Utilities);
jTool.extend(Ajax);

//捆绑jTool 方法
jTool.prototype.extend(Event);

module.exports = jTool;

},{"./Event":1,"./Sizzle":2,"./ajax":3,"./extend":4,"./utilities":6}],6:[function(require,module,exports){
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
	'[object Null]': 'null',
	'[object NodeList]': 'nodeList',
	'[object Arguments]': 'arguments'
};

function isChrome() {
	return navigator.userAgent.indexOf('Chrome') == -1 ? false : true;
}

function isWindow(object) {
	return object !== null && object === object.window;
}

function isArray(value) {
	return Array.isArray(value);
}

function type(value) {
	return class2type[toString.call(value)] || (value instanceof Element ? 'element' : '');
}

function noop() {}

function each(object, callback) {

	// 当前为jTool对象,循环目标更换为jTool.DOMList
	if(object && object.jTool){
		object = object.DOMList;
	}

	var objType = type(object);

	// 为类数组时, 返回: index, value
	if (objType === 'array' || objType === 'nodeList' || objType === 'arguments') {
		// 由于存在类数组 NodeList, 所以不能直接调用 every 方法
		[].every.call(object, function(v, i){
			var tmp = isWindow(v) ? noop() : (v.jTool ? v = v.get(0) : noop()); // 处理jTool 对象
			return callback.call(v, i, v) === false ? false : true;
		});
	} else if (objType === 'object') {
		for(var i in object){
			if(callback.call(object[i], i, object[i]) === false) {
				break;
			}
		}
	}
}

// 清除字符串前后的空格
function trim(text) {
	return text.trim();
}

// 抛出异常信息
function error(msg){
	throw new Error('[jTool Error: '+ msg + ']');
}

// 检测是否为空对象
function isEmptyObject(obj) {

	var isEmptyObj = true;

	for (var pro in obj) {
		if(obj.hasOwnProperty(pro)) {
			isEmptyObj = false;
		}
	}

	return isEmptyObj;
}

// 获取节点样式: key为空时则返回全部
function getStyle(dom, key){
	return key ? window.getComputedStyle(dom)[key] : window.getComputedStyle(dom);
}

// 获取样式的单位
function getStyleUnit(style) {
	var unitList = ['px', 'vem', 'em', '%'],
		unit = '';

	// 样式本身为纯数字,则直接返回单位为空
	if(typeof(style) === 'number'){
		return unit;
	}

	each(unitList, function (i, v) {
		if(style.indexOf(v) !== -1){
			unit = v;
			return false;
		}
	});

	return unit;
}

// 字符格式转换: 连字符转驼峰
function toHump(text) {
	return text.replace(/-\w/g, function(str){
		return str.split('-')[1].toUpperCase();
	});
}

//字符格式转换: 驼峰转连字符
function toHyphen(text) {
	return text.replace(/([A-Z])/g,"-$1").toLowerCase();
}

module.exports = {
	isWindow: isWindow,
	isChrome: isChrome,
	isArray: isArray,
	noop: noop,
	type: type,
	toHyphen: toHyphen,
	toHump: toHump,
	getStyleUnit: getStyleUnit,
	getStyle: getStyle,
	isEmptyObject: isEmptyObject,
	trim: trim,
	error: error,
	each: each
};

},{}]},{},[5]);

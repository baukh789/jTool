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
		DOMList = utilities.createDOM(selector);
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
					if(v2){
						DOMList.push(v2);
					}
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

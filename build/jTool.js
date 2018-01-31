(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * 动画效果
 * --动画中的参数对应--
 * styleObj: 元素将要实现的样式, 只允许为Object格式
 * time: 执行动画的间隔时间
 * callback: 动画执行完成后的回调函数
 * --Ex--
 * 无回调参数: jTool('#div1').animate({height: '100px', width: '200px'}, 1000);
 * 无时间参数: jTool('#div1').animate({height: '100px', width: '200px'}, callback);
 * 完整参数: jTool('#div1').animate({height: '100px', width: '200px'}, 1000, callback);
 * --注意事项--
 * show与hide方法只是一个简单的实现,不支持参数及动画效果
 * */
var utilities = require('./utilities');
var _Css = require('../src/Css');

var _Animate = {
	show: function() {
		utilities.each(this.DOMList, function(i, v) {
			var _display = '';
			var inlineArray = ['SPAN', 'A', 'FONT', 'I'];
			// inline
			if(v.nodeName.indexOf(inlineArray) !== -1) {
				v.style.display = 'inline-block';
				return this;
			}
			// table or block
			switch (v.nodeName){
				case 'TABLE':
					_display = 'table';
					break;
				case 'THEAD':
					_display = 'table-header-group';
					break;
				case 'TBODY':
					_display = 'table-row-group';
					break;
				case 'TR':
					_display = 'table-row';
					break;
				case 'TH':
					_display = 'table-cell';
					break;
				case 'TD':
					_display = 'table-cell';
					break;
				default:
					_display = 'block';
					break;
			}
			v.style.display = _display;
		});
		return this;
	},
	hide: function() {
		utilities.each(this.DOMList, function(i, v){
			v.style.display = 'none';
		});
		return this;
	},
	// 动画效果, 动画样式仅支持以对象类型传入且值需要存在有效的单位
	animate: function(styleObj, time, callback) {
		var _this = this;
		var animateFromText = '',   // 动画执行前样式文本
			animateToText = '',     // 动画执行后样式文本
			node = _this.DOMList[0];
		// 无有效的参数, 直接跳出. 但并不返回错误.
		if(!styleObj){
			return;
		}
		// 参数转换
		if(utilities.type(callback) === 'undefined' && utilities.type(time) === 'function'){
			callback = time;
			time = 0;
		}
		if(utilities.type(callback) === 'undefined'){
			callback = utilities.noop;
		}
		if(utilities.type(time) === 'undefined'){
			time = 0;
		}
		// 组装动画 keyframes
		utilities.each(styleObj, function(key, v){
			key = utilities.toHyphen(key);
			animateFromText += key + ':' + utilities.getStyle(node, key) + ';';
			animateToText += key + ':' + v + ';';
		});
		// 拼接动画样式文本
		var animateText = '@keyframes jToolAnimate {' +
			'from {' +
			animateFromText +
			'}' +
			'to {' +
			animateToText +
			'}' +
			'}';

		// 引入动画样式至页面
		var jToolAnimate = document.createElement('style');
		jToolAnimate.className = 'jTool-animate-style';
		jToolAnimate.type = 'text/css';
		document.head.appendChild(jToolAnimate);
		jToolAnimate.textContent = jToolAnimate.textContent + animateText;

		// 启用动画
		node.style.animation = 'jToolAnimate ' + time / 1000 + 's ease-in-out forwards';

		// 延时执行回调函数及清理操作
		window.setTimeout(function(){
			_Css.css.call(_this, styleObj);
			node.style.animation = '';
			jToolAnimate.remove();
			callback();
		}, time);
	}
};

module.exports = _Animate;

},{"../src/Css":3,"./utilities":13}],2:[function(require,module,exports){
var utilities = require('./utilities');

var _Class = {

    addClass: function(className) {
        return this.changeClass(className, 'add');
    },

	removeClass: function(className) {
        return this.changeClass(className, 'remove');
    },

	toggleClass: function(className) {
        return this.changeClass(className, 'toggle');
    },

	// 不支持多 className
    hasClass: function(className) {
	    return [].some.call(this.DOMList, function(dom) {
			return dom.classList.contains(className);
	    });
    },

    // 解析className 将以空格间格的字符串分割为数组
    parseClassName: function(className) {
        return className.indexOf(' ') ?  className.split(' ') : [className];
    },

    // 执行指定classList方法
    changeClass: function(className, exeName) {
        var classNameList = this.parseClassName(className);
	    utilities.each(this.DOMList, function(i, dom) {
		    utilities.each(classNameList, function(index, name){
                dom.classList[exeName](name);
            });
        });
        return this;
    }
};

module.exports = _Class;

},{"./utilities":13}],3:[function(require,module,exports){
/*
 * CSS
 * */
var utilities = require('./utilities');

var _CSS = {
	// 如果长度是带 px 的值, 会将其转换成 数字
	// 其他情况 不做处理, 返回对应的字符串
	// TODO 颜色处理 返回16进制颜色值, 考虑 rgba 的情况
	css: function(key, value) {
		var _this = this;
		// TODO padding-top 这种格式应该为 paddingTop, 类似的都应该如此. 因为getComputedStyle方法只可以使用paddingTop的方式进行使用
		var pxList = ['width', 'height', 'min-width', 'max-width', 'min-height', 'min-height', 'top', 'left', 'right', 'bottom',
			'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
			'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
			'border-width', 'border-top-width', 'border-left-width', 'border-right-width', 'border-bottom-width'];

		// getter
		if (utilities.type(key) === 'string' && (!value && value !== 0)) {
			if (pxList.indexOf(key) !== -1) {
				return parseInt(utilities.getStyle(this.DOMList[0], key), 10);
			} else {
				return utilities.getStyle(this.DOMList[0], key);
			}
		}

		// setter
		// ex: {width:13px, height:10px}
		if (utilities.type(key) === 'object') {
			var obj = key;
			for(var k in obj){
				setStyle(k, obj[k]);
			}
		}
		// ex: width, 13px
		else {
			setStyle(key, value);
		}

		function setStyle(name, val) {
			if (utilities.type(val) === 'number') {
				val = val.toString();
			}
			if (pxList.indexOf(name) !== -1 && val.indexOf('px') === -1) {
				val = val + 'px';
			}
			utilities.each(_this.DOMList, function(i, v) {
				v.style[name] = val;
			});
		}
		return this;
	},

	width: function(value){
		return this.css('width', value);
	},

	height: function(value){
		return this.css('height', value);
	}
};

module.exports = _CSS;

},{"./utilities":13}],4:[function(require,module,exports){
/*
 * 属性 数据
 * --注意事项--
 * #Data0001: 存储值类型为字符或数字时使用setAttribute, Object则存储在dom.dataKey属性下
 * #Data0002: 获取操作会优先获取dom.dataKey, 如果没有则通过获取getAttribute进行获取
 * #Data0003: removeData时需要同时清除dom上所对应的属性,而removeAttr则不会清除通过data存储的数据
 * #Data0004: get操作时, 如果无有效值,则返回undefined
 * */
var utilities = require('./utilities');

var _Data = {
	// data唯一识别码
	dataKey: 'jTool' + utilities.version,
	// 设置\获取对象类属性
	data: function(key, value) {
		var _this = this,
			_data = {};
		// 未指定参数,返回全部
		if (typeof key === 'undefined' && typeof value === 'undefined') {
			return _this.DOMList[0][_this.dataKey];
		}
		// setter
		if (typeof(value) !== 'undefined') {
			var _type = utilities.type(value);
			// #Data0001: 存储值类型为字符或数字时, 使用attr执行
			if (_type === 'string' || _type === 'number') {
				_this.attr(key, value);
			}
			utilities.each(_this.DOMList, function(i, v) {
				_data = v[_this.dataKey] || {};
				_data[key] = value;
				v[_this.dataKey] = _data;
			});
			return this;
		}
		// getter
		else{
			_data = _this.DOMList[0][_this.dataKey] || {};
			//#Data0002: 获取操作会优先获取dom.dataKey, 如果没有则通过获取getAttribute进行获取
			return this.transformValue(_data[key] || _this.attr(key));
		}
	},
	// 删除对象类属性
	removeData: function(key) {
		var _this = this,
			_data;
		if(typeof key === 'undefined'){
			return;
		}
		utilities.each(_this.DOMList, function(i, v){
			_data = v[_this.dataKey] || {};
			delete _data[key];
		});
		// #Data0003: removeData时需要同时清除dom上所对应的属性
		_this.removeAttr(key);
	},
	// 普通属性
	attr: function(key, value){
		// 未指定参数,返回空字符
		if (typeof key === 'undefined' && typeof value === 'undefined') {
			return '';
		}
		// setter
		if (typeof(value) !== 'undefined') {
			utilities.each(this.DOMList, function(i, v) {
				v.setAttribute(key, value);
			});
			return this;
		}
		// getter
		else{
			return this.transformValue(this.DOMList[0].getAttribute(key));
		}
	},
	// 删除普通属性
	removeAttr: function(key) {
		if (typeof key === 'undefined') {
			return;
		}
		utilities.each(this.DOMList, function(i, v){
			v.removeAttribute(key);
		});
	},
	// 配置固有属性
	prop: function(key, value) {
		// 未指定参数,返回空字符
		if (typeof key === 'undefined' && typeof value === 'undefined') {
			return '';
		}
		// setter
		if (typeof(value) !== 'undefined') {
			utilities.each(this.DOMList, function(i, v) {
				v[key] = value;
			});
			return this;
		}
		// getter
		else{
			return this.transformValue(this.DOMList[0][key]);
		}
	},
	// 删除固有属性
	removeProp: function(key) {
		if (typeof key === 'undefined') {
			return;
		}
		utilities.each(this.DOMList, function(i, v){
			delete v[key];
		});
	},
	// attr -> value
	val: function (value) {
		return this.prop('value', value) || '';
	},
	// 值转换
	transformValue: function (value) {
		// null => undefined
		if(utilities.type(value) === 'null') {
			value = undefined;
		}
		return value;
	}
};

module.exports = _Data;

},{"./utilities":13}],5:[function(require,module,exports){
/*
 * 文档操作
 * */
var utilities = require('./utilities');
var Sizzle = require('./Sizzle');

var _Document = {
	append: function(childList){
		return this.html(childList, 'append');
	},

	prepend: function(childList){
		return this.html(childList, 'prepend');
	},

	before: function (node) {
		if(node.jTool){
			node = node.DOMList[0];
		}
		var thisNode = this.DOMList[0];
		var parentEl = thisNode.parentNode;
		parentEl.insertBefore(node, thisNode);
		return this;
	},

	after: function (node) {
		if(node.jTool){
			node = node.DOMList[0];
		}
		var thisNode = this.DOMList[0];
		var parentEl = thisNode.parentNode;
		if(parentEl.lastChild == thisNode){
			parentEl.appendChild(node);
		}else{
			parentEl.insertBefore(node, thisNode.nextSibling);
		}
		//  parentEl.insertBefore(node, thisNode);
	},
	text: function(text){
		// setter
		if (typeof(text) !== 'undefined') {
			utilities.each(this.DOMList, function(i, v){
				v.textContent = text;
			});
			return this;
			// getter
		} else {
			return this.DOMList[0].textContent;
		}
	},
	html: function(childList, insertType) {
		// getter
		if (typeof(childList) == 'undefined' && typeof(insertType) == 'undefined') {
			return this.DOMList[0].innerHTML;
		}
		// setter
		var _this = this;
		var type = utilities.type(childList);
		if (childList.jTool) {
			childList = childList.DOMList;
		}
		else if(type === 'string'){
			childList = utilities.createDOM(childList || '');
		}
		else if(type === 'element'){
			childList = [childList];
		}
		var firstChild;
		utilities.each(_this.DOMList, function(e, element){
			// html
			if(!insertType){
				element.innerHTML = '';
			}
			// prepend
			else if (insertType === 'prepend') {
				firstChild = element.firstChild;
			}
			utilities.each(childList, function(c, child) {
				child = child.cloneNode(true);
				// text node
				if(!child.nodeType){
					child = document.createTextNode(child);
				}
				if(firstChild){
					element.insertBefore(child, firstChild);
				}
				else{
					element.appendChild(child);
				}
				element.normalize();
			});
		});
		return this;
	},
	wrap: function (elementText) {
		var _this = this;
		var selfDOM = '', //存储当前node 的html
			parentNode;  // 存储父节点
		utilities.each(this.DOMList, function(i, v){
			parentNode = v.parentNode;
			var wrap = new Sizzle(elementText, v.ownerDocument).get(0);
			parentNode.insertBefore(wrap, v);
			// 将原节点添加入wrap中第一个为空的节点内
			wrap.querySelector(':empty').appendChild(v);
		});
		return this;
	},
	// 向上寻找匹配节点
	closest: function(selectorText) {
		var _this = this;
		var parentDOM = this.DOMList[0].parentNode;
		if (typeof selectorText === 'undefined') {
			return new Sizzle(parentDOM);
		}
		var target = document.querySelectorAll(selectorText);

		// 递归查找匹配的父级元素
		function getParentNode() {
			if (!parentDOM || target.length === 0 || parentDOM.nodeType !== 1) {
				parentDOM = null;
				return;
			}

			if ([].indexOf.call(target, parentDOM) !== -1) {
				return;
			}

			parentDOM = parentDOM.parentNode;

			getParentNode();
		}

		getParentNode();

		return new Sizzle(parentDOM);
	},

	// 获取当前元素父级,返回jTool对象
	parent: function() {
		return this.closest();
	},
	//克隆节点: 参数deep克隆节点及其后代
	clone: function(deep) {
		return new Sizzle(this.DOMList[0].cloneNode(deep || false));
	},
	//批量删除节点
	remove: function() {
		utilities.each(this.DOMList, function(i, v) {
			v.remove();
		});
	}
};

module.exports = _Document;

},{"./Sizzle":9,"./utilities":13}],6:[function(require,module,exports){
var Sizzle = require('./Sizzle');

var _Element = {
	// 获取指定DOM Element
	get: function(index){
		return this.DOMList[index];
	},

	// 获取指定索引的jTool对象
	eq: function(index){
		return new Sizzle(this.DOMList[index]);
	},

	// 返回指定选择器的jTool对象
	find: function(selectText) {
		return new Sizzle(selectText, this);
	},

	// 获取当前元素在指定元素中的索引, 当无参数时为当前同级元素中的索引
	index: function (nodeList) {
		var node = this.DOMList[0];
		// 查找范围参数为空时,找寻同层节点
		if (!nodeList) {
			nodeList = node.parentNode.childNodes;
		}
		// 查找范围参数为jTool对象,则使用对象的DOMList
		else if (nodeList.jTool) {
			nodeList = nodeList.DOMList;
		}
		return nodeList ? [].indexOf.call(nodeList, node) : -1;
	}
};

module.exports = _Element;

},{"./Sizzle":9}],7:[function(require,module,exports){
/*
 * Event 事件
 * --事件中的参数对应--
 * event: 事件名
 * querySelector: 子选择器
 * callback: 事件触发后执行的函数
 * useCapture: 指定事件是否在捕获或冒泡阶段执行.true - 事件句柄在捕获阶段执行 false- 默认。事件句柄在冒泡阶段执行
 * http://stackoverflow.com/questions/2381572/how-can-i-trigger-a-javascript-event-click
 * --注意事项--
 * #Event001: 预绑定的事件,无法通过new Event().dispatchEvent()来执行,所以通过属性调用的方式来触发.
 *            存在父级的元素不会是window 或document 所以不会存在问题.
 *            目前只有click事件可以通过trigger进行调用, 需要修改.(但是通过真实的事件触发,是不会有问题的)
 * #Event002: 当前使用的是var myEvent = new Event('click'); element.dispatchEvent(myEvent);
 *            并未使用var myEvent = document.createEvent('HTMLEvents').initEvent(event, true, true); element.dispatchEvent(myEvent);
 *            原因:
 *            1.createEvent已从Web标准中删除 来源地址:[https://developer.mozilla.org/en-US/docs/Web/API/Document/createEvent]
 *            2.initEvent已从Web标准中删除 来源地址:[https://developer.mozilla.org/en-US/docs/Web/API/Event/initEvent]
 *
 * #Event003: 如果存在子选择器,会对回调函数进行包装, 以达到在触发事件时所传参数为当前的window.event对象
 * --EX--
 * 在选择元素上绑定一个或多个事件的事件处理函数: .bind('click mousedown', function(){}) 或.on('click mousedown', function(){})
 * 在选择元素上为当前并不存在的子元素绑定事件处理函数: .on('click mousedown', '.test', function(){})
 * */
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
		return this.on(event, undefined, callback, useCapture);
	},

	unbind: function(event) {
		return this.removeEvent(this.getEventObject(event));
	},

	trigger: function(event) {
		utilities.each(this.DOMList, function(index, element){
			try {
				// #Event001: trigger的事件是直接绑定在当前DOM上的
				if (element.jToolEvent && element.jToolEvent[event].length > 0) {
					var myEvent = new Event(event); // #Event002: 创建一个事件对象，用于模拟trigger效果
					element.dispatchEvent(myEvent);
				}
				// 当前为预绑定: 非click
				else if (event !== 'click'){
					utilities.error('预绑定的事件只有click事件可以通过trigger进行调用');
				}
				// 当前为预绑定: click事件, 该事件为浏览器特性
				else if (event === 'click'){
					element[event]();
				}
			} catch(e) {
				utilities.error('事件:['+ event +']未能正确执行, 请确定方法已经绑定成功');
			}
		});
		return this;
	},

	// 获取 jTool Event 对象
	getEventObject: function(event, querySelector, callback, useCapture) {
		// $(dom).on(event, callback);
		if (typeof querySelector === 'function') {
			useCapture = callback || false;
			callback = querySelector;
			querySelector = undefined;
		}
		// event callback 为必要参数
		if (!event) {
			utilities.error('事件绑定失败,原因: 参数中缺失事件类型');
			return this;
		}

		// 子选择器不存在 或 当前DOM对象包含Window Document 则将子选择器置空
		if(!querySelector || utilities.type(this.DOMList[0]) !== 'element'){
			querySelector = '';
		}
		// #Event003 存在子选择器 -> 包装回调函数, 回调函数的参数
		// 预绑定功能实现
		if(querySelector !== ''){
			var fn = callback;
			callback = function(e){
				// 验证子选择器所匹配的nodeList中是否包含当前事件源 或 事件源的父级
				// 注意: 这个方法为包装函数,此处的this为触发事件的Element
				var target = e.target;
				while(target !== this ){
					if([].indexOf.call( this.querySelectorAll(querySelector), target) !== -1){
						fn.apply(target, arguments);
						break;
					}
					target = target.parentNode;
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
				v.addEventListener(eventObj.type, eventObj.callback, eventObj.useCapture);
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

},{"./utilities":13}],8:[function(require,module,exports){
/*
 * 位置
 * #Offset001: 	返回值是ClientRect对象集合，该对象是与该元素相关的CSS边框。
 * 				每个ClientRect对象包含一组描述该边框的只读属性——left、top、right和bottom，单位为像素，这些属性值是相对于视口的top-left的。
 * 				即使当表格的标题在表格的边框外面，该标题仍会被计算在内。
 * #Offset001:  Element.getBoundingClientRect()方法返回元素的大小及其相对于视口的位置。
 * 				返回值包含了一组用于描述边框的只读属性——left、top、right和bottom，单位为像素。除了 width 和 height 外的属性都是相对于视口的左上角位置而言的。
 * 				返回如{top: 8, right: 1432, bottom: 548, left: 8, width: 1424…}
 * #Offset003:	原先offset()方法使用的是递归形式: 递增寻找position !== static的父级节点offsetTop或offsetLeft的值, 直到node.nodeType !== 1的时候停止
 * 				这种方法正常情况下没什么问题, 但是当body的position !== static时, 所计算的offset值将不包含scroll卷去的值
 * */
var utilities = require('./utilities');

var Offset = {

	// #Offset003
	// 获取匹配元素在当前视口的相对偏移
	offset: function() {
		var offest = {
			top: 0,
			left: 0
		};
		var node = this.DOMList[0];
		// #Offset001
		// 当前为IE11以下, 直接返回{top: 0, left: 0}
		if (!node.getClientRects().length) {
			return offest;
		}
		// 当前DOM节点的 display === 'node' 时, 直接返回{top: 0, left: 0}
		if (utilities.getStyle(node, 'display') === 'none') {
			return offest;
		}
		// #Offset002
		offest = node.getBoundingClientRect();
		var docElement = node.ownerDocument.documentElement;
		return {
			top: offest.top + window.pageYOffset - docElement.clientTop,
			left: offest.left + window.pageXOffset - docElement.clientLeft
		};

	},
	// 获取|设置 匹配元素相对滚动条顶部的偏移 value is number
	scrollTop: function (value) {
		return this.scrollFN(value, 'top');
	},
	// 获取|设置 匹配元素相对滚动条左部的偏移 value is number
	scrollLeft: function (value) {
		return this.scrollFN(value, 'left');
	},
	// 根据参数对位置操作进行get,set分类操作
	scrollFN: function(value, type) {
		var node = this.DOMList[0];
		// setter
		if (value || value === 0) {
			this.setScrollFN(node, type, value);
			return this;
		}
		// getter
		else {
			return this.getScrollFN(node, type);
		}
	},
	// 根据元素的不同对滚动轴进行获取
	getScrollFN: function(node, type){
		// node => window
		if (utilities.isWindow(node)) {
			return type === 'top' ? node.pageYOffset : node.pageXOffset;
		}
		// node => document
		else if (node.nodeType === 9) {
			return type === 'top' ? node.body.scrollTop : node.body.scrollLeft;
		}
		// node => element
		else if (node.nodeType === 1) {
			return type === 'top' ? node.scrollTop : node.scrollLeft;
		}
	},
	// 根据元素的不同对滚动轴进行设置
	setScrollFN: function(node, type, value){
		// node => window
		if (utilities.isWindow(node)) {
			return type === 'top' ? node.document.body.scrollTop = value : node.document.body.scrollLeft = value;
		}
		// node => document
		else if (node.nodeType === 9) {
			return type === 'top' ? node.body.scrollTop = value : node.body.scrollLeft = value;
		}
		// node => element
		else if (node.nodeType === 1) {
			return type === 'top' ? node.scrollTop = value : node.scrollLeft = value;
		}
	}
};

module.exports = Offset;

},{"./utilities":13}],9:[function(require,module,exports){
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

},{"./utilities":13}],10:[function(require,module,exports){
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
		url: null,		// 请求地址
		type: 'GET',	// 请求类型
		data: null,		// 传递数据
		headers: {},	// 请求头信息
		async: true,	// 是否异步执行
		xhrFields: {},  // 设置XHR对象, ajax_xhrFields 中的属性将追加至实例化后的XHR对象上
		beforeSend: utilities.noop,	// 请求发送前执行事件
		complete: utilities.noop,	// 请求发送后执行事件
		success: utilities.noop,	// 请求成功后执行事件
		error: utilities.noop		// 请求失败后执行事件
	};
	options = extend(defaults, options);

	if (!options.url) {
		utilities.error('jTool ajax: url不能为空');
		return;
	}

	var xhr = new XMLHttpRequest();
	var formData = '';

	// 获取表单数据: GET 与 POST(Content-Type !== appliaction/json)时使用
	function getFormData() {
		var data = '';
		if (utilities.type(options.data) === 'object') {
			utilities.each(options.data, function (key, value) {
				if(data !== '') {
					data += '&';
				}
				data += key + '=' + value;
			});
			return data;
		}
		return options.data;
	}

	// GET
	if (options.type.toUpperCase() === 'GET') {
		formData = getFormData();
		if (formData) {
			options.url = options.url + (options.url.indexOf('?') === -1 ?  '?' : '&') + formData;
		}
		formData = null;
	}

	// POST
	if (options.type.toUpperCase() === 'POST') {
		// 配置默认消息主体编码方式
		if(!options.headers['Content-Type']){
			options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
		}

		// Content-Type: application/x-www-form-urlencoded || application/x-www-form-urlencoded;charset=utf-8
		if (options.headers['Content-Type'].indexOf('application/x-www-form-urlencoded') === 0) {
			formData = getFormData();
		}

		// Content-Type: application/json || application/json;charset=utf-8
		if (options.headers['Content-Type'].indexOf('application/json') === 0) {
			formData = JSON.stringify(options.data);
		}
	}

	xhr.open(options.type, options.url, options.async);

	// 设置XHR对象, ajax_xhrFields 中的属性将追加至实例化后的XHR对象上
	// 比如xhrFields = {withCredentials: true}, 那么将会配置跨域访问时协带cookies, authorization headers(头部授权)
	for (var field in options.xhrFields) {
		xhr[field] = options.xhrFields[field];
	}

	// 增加头信息
	for (var header in options.headers) {
		xhr.setRequestHeader(header, options.headers[header]);
	}

	// xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	// 执行发送前事件
	options.beforeSend(xhr);

	// 监听onload并执行完成事件
	xhr.onload = function() {
		// jquery complete(XHR, TS)
		options.complete(xhr, xhr.status);
	};

	// 监听onreadystatechange并执行成功\失败事件
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
	xhr.send(formData);

}

function post(url, data, callback) {
	ajax({ url: url, type: 'POST', data: data, success: callback });
}

function get(url, data, callback) {
	ajax({ url: url, type: 'GET', data: data, success: callback });
}


module.exports = {
	ajax: ajax,
	post: post,
	get: get
};

},{"./extend":11,"./utilities":13}],11:[function(require,module,exports){
// 可以使用 Object.assign() 方法完成该功能

var utilities = require('./utilities');
function extend() {
	// 参数为空,返回空对象
	if (arguments.length === 0) {
		return {};
	}

	var deep = false, // 是否递归
		i = 1,
		target = arguments[0],
		options;

	// 参数只有一个且为对象类形 -> 对jTool进行扩展
	if (arguments.length === 1 && typeof(arguments[0]) === 'object') {
		target = this;
		i = 0;
	}
	// 参数为两个, 且第一个为布尔值 -> 对jTool进行扩展
	else if (arguments.length === 2 && typeof(arguments[0]) === 'boolean') {
		deep = arguments[0];
		target = this;
		i = 1;
	}
	// 参数长度大于2, 且第一个为布尔值 -> 对第二个Object进行扩展
	else if(arguments.length > 2 && typeof(arguments[0]) === 'boolean') {
		deep = arguments[0];
		target = arguments[1] || {};
		i = 2;
	}
	for (; i < arguments.length; i++) {
		options = arguments[i] || {};
		ex(options, target);
	}
	function ex(options, target) {
		for (var key in options) {
			if (options.hasOwnProperty(key)) {
				if(deep && utilities.type(options[key]) === 'object'){
					if(utilities.type(target[key]) !== 'object'){
						target[key] = {};
					}
					ex(options[key], target[key]);
				}else{
					target[key] = options[key];
				}
			}
		}
	}
	return target;
}

module.exports = extend;

},{"./utilities":13}],12:[function(require,module,exports){
var Sizzle = require('./Sizzle');
var Extend = require('./extend');
var Utilities = require('./utilities');
var Ajax = require('./ajax');
var _Event = require('./Event');
var _Css = require('./Css');
var _Class = require('./Class');
var _Document = require('./Document');
var _Offset = require('./Offset');
var _Element = require('./Element');
var _Animate = require('./Animate');
var _Data = require('./Data');

// 如果需要集成Angular,React,在此处进行集成
var jTool = function (selector, context){
	return new Sizzle(selector, context);
};

// 把jquery原先的jQuery.fn给省略了.原先的方式是 init = jQuery.fn.init; init.prototype = jQuery.fn;
Sizzle.prototype = jTool.prototype = {};
// 捆绑jTool 工具
jTool.extend = jTool.prototype.extend = Extend;
jTool.extend(Utilities);
jTool.extend(Ajax);

//捆绑jTool 方法
jTool.prototype.extend(_Event);
jTool.prototype.extend(_Css);
jTool.prototype.extend(_Class);
jTool.prototype.extend(_Document);
jTool.prototype.extend(_Offset);
jTool.prototype.extend(_Element);
jTool.prototype.extend(_Animate);
jTool.prototype.extend(_Data);

// 兼容如jQuery类库的$占用问题
if(typeof(window.$) !== 'undefined') {
	window._$ = $;
}
// 抛出全局变量jTool  $
window.jTool = window.$ = jTool;

module.exports = jTool;

},{"./Animate":1,"./Class":2,"./Css":3,"./Data":4,"./Document":5,"./Element":6,"./Event":7,"./Offset":8,"./Sizzle":9,"./ajax":10,"./extend":11,"./utilities":13}],13:[function(require,module,exports){
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
	'[object Arguments]': 'arguments',
	'[object Window]': 'window',
	'[object HTMLDocument]': 'document'
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

// 通过html字符串, 生成DOM.  返回生成后的子节点
// 该方法无处处理包含table标签的字符串,但是可以处理table下属的标签
function createDOM(htmlString) {
	var jToolDOM = document.querySelector('#jTool-create-dom');
	if (!jToolDOM || jToolDOM.length === 0) {
		// table标签 可以在新建element时可以更好的容错.
		// div标签, 添加thead,tbody等表格标签时,只会对中间的文本进行创建
		// table标签,在添加任务标签时,都会成功生成.且会对table类标签进行自动补全
		var el = document.createElement('table');
		el.id = 'jTool-create-dom';
		el.style.display = 'none';
		document.body.appendChild(el);
		jToolDOM = document.querySelector('#jTool-create-dom');
	}

	jToolDOM.innerHTML = htmlString || '';
	var childNodes = jToolDOM.childNodes;

	// 进行table类标签清理, 原因是在增加如th,td等table类标签时,浏览器会自动补全节点.
	if (childNodes.length == 1 && !/<tbody|<TBODY/.test(htmlString) && childNodes[0].nodeName === 'TBODY') {
		childNodes = childNodes[0].childNodes;
	}
	if (childNodes.length == 1 && !/<thead|<THEAD/.test(htmlString) && childNodes[0].nodeName === 'THEAD') {
		childNodes = childNodes[0].childNodes;
	}
	if (childNodes.length == 1 && !/<tr|<TR/.test(htmlString) &&  childNodes[0].nodeName === 'TR') {
		childNodes = childNodes[0].childNodes;
	}
	if (childNodes.length == 1 && !/<td|<TD/.test(htmlString) && childNodes[0].nodeName === 'TD') {
		childNodes = childNodes[0].childNodes;
	}
	if (childNodes.length == 1 && !/<th|<TH/.test(htmlString) && childNodes[0].nodeName === 'TH') {
		childNodes = childNodes[0].childNodes;
	}
	jToolDOM.remove();
	return childNodes;
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
	each: each,
	createDOM: createDOM,
	version: '1.2.21'
};

},{}]},{},[12]);

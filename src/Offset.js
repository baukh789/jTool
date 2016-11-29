/*
 * 位置
 * */
var utilities = require('./utilities');

var Offset = {

	// 获取匹配元素在当前视口的相对偏移。
	offset: function() {
		var offest = {
			top: 0,
			left: 0
		};

		var _position;

		getOffset(this.DOMList[0], true);

		return offest;

		// 递归获取 offset, 可以考虑使用 getBoundingClientRect
		function getOffset(node, init) {
			if (node.nodeType !== 1) {
				return;
			}
			_position = utilities.getStyle(node, 'position');

			// position=static: 继续递归父节点
			if (typeof(init) === 'undefined' && _position === 'static') {
				getOffset(node.parentNode);
				return;
			}

			offest.top = node.offsetTop + offest.top;
			offest.left = node.offsetLeft + offest.left;
			// position = fixed
			if (_position === 'fixed') {
				return;
			}

			getOffset(node.parentNode);
		}
	},
	// 获取|设置 匹配元素相对滚动条顶部的偏移
	scrollTop: function (value) {
		return this.scrollFN(value, 'top');
	},
	// 获取|设置 匹配元素相对滚动条左部的偏移
	scrollLeft: function (value) {
		return this.scrollFN(value, 'left');
	},
	// 根据参数对位置操作进行get,set分类操作
	scrollFN: function(value, type) {
		var node = this.DOMList[0];
		// setter
		if (value || value === 0) {
			// ''.indexOf.call(value, 'px') !== -1 ? value = value + 'px' : '';
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

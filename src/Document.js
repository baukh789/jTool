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
		else if (type === 'number'){
			childList = utilities.createDOM(childList.toString() || '');
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
	wrap: function (elementText, content) {
		var parentNode;  // 存储父节点
		utilities.each(this.DOMList, function(i, v){
			parentNode = v.parentNode;
			var wrap = new Sizzle(elementText, v.ownerDocument).get(0);
			parentNode.insertBefore(wrap, v);
			// 当未指定原节点所在容器时，将原节点添加入wrap中第一个为空的节点内
			content ? wrap.querySelector(content).appendChild(v) : wrap.querySelector(':empty').appendChild(v);
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
		    // v.remove IE 所有版本都不支持, 使用removeChild替换
		    // v.remove();
            v.parentNode.removeChild(v);
		});
	}
};

module.exports = _Document;

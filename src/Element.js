var utilities = require('./utilities');
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
	},

	// 获取与 th 同列的 td jTool 对象, 该方法的调用者只允许为 Th
	getRowTd: function() {
		var th = this.eq(0);
		if (th.get(0).tagName.toUpperCase() !== 'TH') {
			utilities.error('getRowTd的调用者只允许为Th');
			return;
		}

		var table = th.closest('table'),
			trList = new Sizzle('tbody tr', table);

		var tdList = [],
			thIndex = th.index();

		utilities.each(trList, function(i, v) {
			tdList.push(new Sizzle('td', v).get(thIndex));
		});

		return new Sizzle(tdList);
	}
};

module.exports = _Element;

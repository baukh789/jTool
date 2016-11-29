/*
 * 属性 数据
 * */
// TODO 测试
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
			// 存储值类型为字符或数字时, 使用attr执行
			var _type = utilities.type(value);
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
			return _data[key] || _this.attr(key);
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
			return this.DOMList[0].getAttribute(key);
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
			return this.DOMList[0][key];
		}
	},
	// attr -> value
	val: function (value) {
		return this.attr('value', value) || '';
	},
	// 索引
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

module.exports = _Data;

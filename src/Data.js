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
		return value
	}
};

module.exports = _Data;

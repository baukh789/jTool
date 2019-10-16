/*
 * 属性 数据
 * */
var utilities = require('./utilities');

var _Data = {
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

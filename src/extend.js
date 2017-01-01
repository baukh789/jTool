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
				if(deep && utilities.type(options[key]) === 'object' && utilities.type(target[key]) === 'object'){
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

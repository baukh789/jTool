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

	// 如果参数只有一个, 将认为是对jTool进行扩展
	if (arguments.length === 1 && typeof(arguments[0]) === 'object') {
		target = this;
		i = 0;
	}
	if (arguments.length === 2 && typeof(arguments[0]) === 'boolean') {
		deep = arguments[0];
		target = this;
		i = 1;
	}
	// 递归
	if(arguments.length > 2 && typeof(arguments[0]) === 'boolean') {
		deep = arguments[0];
		target = arguments[1] || {};
		i = 2;
	}

	for (; i < arguments.length; i++) {
		options = arguments[i] || {};
		ex(options, target);
	}
	function ex(options, target) {
		for (var p in options) {
			if (options.hasOwnProperty(p)) {
				if(deep && utilities.type(options[p]) === 'object'){
					ex(options[p], target[p]);
				}else{
					target[p] = options[p];
				}
			}
		}
	}
	return target;
}

module.exports = extend;

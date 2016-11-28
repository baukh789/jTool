// 可以使用 Object.assign() 方法完成该功能

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
	if (arguments.length === 1) {
		target = this;
		i = 0;
	}

	// 暂不支持 递归
	if(typeof(target) === 'boolean') {
		// deep = target;
		target = arguments[1] || {};
	}

	for (; i < arguments.length; i++) {
		options = arguments[i] || {};
		for (var p in options) {
			if (options.hasOwnProperty(p)) {
				target[p] = options[p];
			}
		}
	}
	return target;
}

module.exports = extend;

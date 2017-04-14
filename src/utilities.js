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
	version: '1.2.16'
};

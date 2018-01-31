/*
 * ajax
 * type === GET: data格式 name=baukh&age=29
 * type === POST: data格式 { name: 'baukh', age:29 }
 * 与 jquery 不同的是,[success, error, complete]返回的第二个参数, 并不是返回错误信息, 而是错误码
 * */

var extend = require('./extend');
var utilities = require('./utilities');

function ajax(options) {

	var defaults = {
		url: null,		// 请求地址
		type: 'GET',	// 请求类型
		data: null,		// 传递数据
		headers: {},	// 请求头信息
		async: true,	// 是否异步执行
		xhrFields: {},  // 设置XHR对象, ajax_xhrFields 中的属性将追加至实例化后的XHR对象上
		beforeSend: utilities.noop,	// 请求发送前执行事件
		complete: utilities.noop,	// 请求发送后执行事件
		success: utilities.noop,	// 请求成功后执行事件
		error: utilities.noop		// 请求失败后执行事件
	};
	options = extend(defaults, options);

	if (!options.url) {
		utilities.error('jTool ajax: url不能为空');
		return;
	}

	var xhr = new XMLHttpRequest();
	var formData = '';

	// 获取表单数据: GET 与 POST(Content-Type !== appliaction/json)时使用
	function getFormData() {
		var data = '';
		if (utilities.type(options.data) === 'object') {
			utilities.each(options.data, function (key, value) {
				if(data !== '') {
					data += '&';
				}
				data += key + '=' + value;
			});
			return data;
		}
		return options.data;
	}

	// GET
	if (options.type.toUpperCase() === 'GET') {
		formData = getFormData();
		if (formData) {
			options.url = options.url + (options.url.indexOf('?') === -1 ?  '?' : '&') + formData;
		}
		formData = null;
	}

	// POST
	if (options.type.toUpperCase() === 'POST') {
		// 配置默认消息主体编码方式
		if(!options.headers['Content-Type']){
			options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
		}

		// Content-Type: application/x-www-form-urlencoded || application/x-www-form-urlencoded;charset=utf-8
		if (options.headers['Content-Type'].indexOf('application/x-www-form-urlencoded') === 0) {
			formData = getFormData();
		}

		// Content-Type: application/json || application/json;charset=utf-8
		if (options.headers['Content-Type'].indexOf('application/json') === 0) {
			formData = JSON.stringify(options.data);
		}
	}

	xhr.open(options.type, options.url, options.async);

	// 设置XHR对象, ajax_xhrFields 中的属性将追加至实例化后的XHR对象上
	// 比如xhrFields = {withCredentials: true}, 那么将会配置跨域访问时协带cookies, authorization headers(头部授权)
	for (var field in options.xhrFields) {
		xhr[field] = options.xhrFields[field];
	}

	// 增加头信息
	for (var header in options.headers) {
		xhr.setRequestHeader(header, options.headers[header]);
	}

	// xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	// 执行发送前事件
	options.beforeSend(xhr);

	// 监听onload并执行完成事件
	xhr.onload = function() {
		// jquery complete(XHR, TS)
		options.complete(xhr, xhr.status);
	};

	// 监听onreadystatechange并执行成功\失败事件
	xhr.onreadystatechange = function() {
		if (xhr.readyState !== 4) {
			return;
		}

		if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
			// jquery success(XHR, TS)
			options.success(xhr.response, xhr.status);
		} else {
			// jquery error(XHR, TS, statusText)
			options.error(xhr, xhr.status, xhr.statusText);
		}
	};
	xhr.send(formData);

}

function post(url, data, callback) {
	ajax({ url: url, type: 'POST', data: data, success: callback });
}

function get(url, data, callback) {
	ajax({ url: url, type: 'GET', data: data, success: callback });
}


module.exports = {
	ajax: ajax,
	post: post,
	get: get
};

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
		type: 'GET',	// 请求类形
		data: null,		// 传递数据
		headers: {},	// 请求头信息
		async: true,	// 是否异步执行
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
	if (utilities.type(options.data) === 'object') {
		utilities.each(options.data, function (key, value) {
			if(formData !== '') {
				formData += '&';
			}
			formData += key + '=' + value;
		});
	}else {
		formData = options.data;
	}
	if(options.type === 'GET' && formData) {
		options.url = options.url + (options.url.indexOf('?') === -1 ?  '?' : '&') + formData;
		formData = null;
	}

	xhr.open(options.type, options.url, options.async);

	for (var key in options.headers) {
		xhr.setRequestHeader(key, options.headers[key]);
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
		console.log('ajax')
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

module.exports = {
	ajax: ajax,
	post: post
};

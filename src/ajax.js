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
		url: null,
		type: 'GET',
		data: null,
		headers: {},
		async: true,
		beforeSend: utilities.noop,
		complete: utilities.noop,
		success: utilities.noop,
		error: utilities.noop
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

	// 执行发送前事件
	options.beforeSend(xhr);

	// 监听onload并执行完成事件
	xhr.onload = function() {
		// jquery complete(XHR, TS)
		options.complete(xhr, xhr.status);
	};

	// 监听onreadystatechange并执行成功后失败事件
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

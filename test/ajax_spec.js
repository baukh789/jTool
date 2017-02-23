'use strict';

var ajax = require('../src/ajax');

describe('ajax', function() {

	var success = null, error = null, complete = null;

	beforeEach(function() {
		jasmine.Ajax.install();

		success = jasmine.createSpy('success');
		error = jasmine.createSpy('error');
		complete = jasmine.createSpy('complete');
	});

	afterEach(function() {
		jasmine.Ajax.uninstall();
		success = error = complete = null;
	});


	describe('简单的 get 请求', function() {

		beforeEach(function() {
			ajax.ajax({
				url: '/some/url',
				success: success,
				error: error,
				complete: complete
			});
		});

		it('请求成功', function() {
			expect(jasmine.Ajax.requests.mostRecent().url).toBe('/some/url');
			expect(success).not.toHaveBeenCalled();

			jasmine.Ajax.requests.mostRecent().respondWith({
				'status': 200,
				'contentType': 'text/plain',
				'responseText': 'some response'
			});

			expect(success).toHaveBeenCalledWith('some response', 200);

		});

		it('请求失败 && 请求完成', function() {

			jasmine.Ajax.requests.mostRecent().respondWith({
				'status': 502,
				'statusText': '出错了'
			});

			expect(error.calls.argsFor(0)[1]).toBe(502);
			expect(error.calls.argsFor(0)[2]).toBe('出错了');
			expect(complete.calls.argsFor(0)[1]).toBe(502);

		});

	});

	describe('简单的 post 请求', function() {

		beforeEach(function() {
			ajax.ajax({
				url: '/some/url',
				type: 'POST',
				data: { name: 'hjzheng', job: 'niubi' },
				success: success,
				error: error,
				complete: complete
			});
		});

		it('请求成功', function() {

			var request = jasmine.Ajax.requests.mostRecent();

			expect(request.url).toBe('/some/url');
			expect(request.method).toBe('POST');
			expect(request.params).toEqual('name=hjzheng&job=niubi');
			expect(success).not.toHaveBeenCalled();

			jasmine.Ajax.requests.mostRecent().respondWith({
				'status': 200,
				'contentType': 'text/plain',
				'responseText': 'some response'
			});

			expect(success).toHaveBeenCalledWith('some response', 200);

		});

		it('请求失败 && 请求完成', function() {

			jasmine.Ajax.requests.mostRecent().respondWith({
				'status': 504,
				'statusText': '出错了'
			});

			expect(error.calls.argsFor(0)[1]).toBe(504);
			expect(error.calls.argsFor(0)[2]).toBe('出错了');
			expect(complete.calls.argsFor(0)[1]).toBe(504);

		});

	});


	it('测试 get 请求的 url 参数', function() {

		ajax.ajax({
			url: '/some/url?name=hjzheng'
		});

		expect(jasmine.Ajax.requests.mostRecent().url).toBe('/some/url?name=hjzheng');

		ajax.ajax({
			url: '/some/url',
			data: 'name=hjzheng&job=niubi'
		});

		expect(jasmine.Ajax.requests.mostRecent().url).toBe('/some/url?name=hjzheng&job=niubi');

		ajax.ajax({
			url: '/some/url?name=hjzheng',
			data: 'job=niubi'
		});

		expect(jasmine.Ajax.requests.mostRecent().url).toBe('/some/url?name=hjzheng&job=niubi');
	});

	it('测试请求 header', function() {

		ajax.ajax({
			url: '/some/url',
			headers: {'content-type': 'application/json; charset=UTF-8'}
		});

		expect(jasmine.Ajax.requests.mostRecent().url).toBe('/some/url');
		expect(jasmine.Ajax.requests.mostRecent().requestHeaders).toEqual({'content-type': 'application/json; charset=UTF-8'});
	});


	it('测试请求返回', function() {
		ajax.ajax({
			url: '/some/url',
			success: success
		});

		jasmine.Ajax.requests.mostRecent().respondWith({
			'status': 200,
			'contentType': 'text/plain',
			'responseText': 'some response'
		});

		expect(success).toHaveBeenCalledWith('some response', 200);
	});

	it('测试请求返回 JSON 数据', function() {
		ajax.ajax({
			url: '/some/url',
			success: success
		});

		jasmine.Ajax.requests.mostRecent().respondWith({
			'status': 200,
			'contentType': 'application/json; charset=UTF-8',
			'responseText': {'test': 1}
		});

		expect(success).toHaveBeenCalledWith({'test': 1}, 200);
	});

	it('测试 url 不能为 null', function() {
		try {
			ajax.ajax();
		} catch(e) {
			expect(e.message).toMatch(/url不能为空/);
		}
	});
});

describe('post', function() {

	var success = null;

	beforeEach(function() {
		jasmine.Ajax.install();
		success = jasmine.createSpy('success');
	});

	afterEach(function() {
		jasmine.Ajax.uninstall();
		success = null;
	});

	it('测试请求返回 JSON 数据', function() {
		ajax.post('/some/url', {'test': 1, 'name': 'baukh'}, success);

		var request = jasmine.Ajax.requests.mostRecent();

		expect(request.url).toBe('/some/url');
		expect(request.method).toBe('POST');
		expect(request.params).toEqual('test=1&name=baukh');

		jasmine.Ajax.requests.mostRecent().respondWith({
			'status': 200,
			'contentType': 'application/json; charset=UTF-8',
			'responseText': {'test': 1}
		});
		expect(success).toHaveBeenCalledWith({'test': 1}, 200);
	});
});

describe('get', function() {

	var success = null;

	beforeEach(function() {
		jasmine.Ajax.install();
		success = jasmine.createSpy('success');
	});

	afterEach(function() {
		jasmine.Ajax.uninstall();
		success = null;
	});

	it('测试请求返回 JSON 数据', function() {
		ajax.get('/some/url', {'test': 1, 'name': 'baukh'}, success);

		var request = jasmine.Ajax.requests.mostRecent();

		expect(request.url).toBe('/some/url?test=1&name=baukh');
		expect(request.method).toBe('GET');
		expect(request.params).toBe(null);

		jasmine.Ajax.requests.mostRecent().respondWith({
			'status': 200,
			'contentType': 'application/json; charset=UTF-8',
			'responseText': {'test': 1}
		});
		expect(success).toHaveBeenCalledWith({'test': 1}, 200);
	});
});

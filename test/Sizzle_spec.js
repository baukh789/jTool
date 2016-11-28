var Sizzle = require('../src/Sizzle');

describe('Sizzle', function() {

	var divEle = null;
	var divNodeList = null;
	var spanEle = null;

	var pEle = null;
	var spanEle2 = null;

	beforeEach(function() {
		divEle = document.createElement('div');
		divEle.id = 'div1';
		document.body.appendChild(divEle);
		divNodeList = document.querySelectorAll('div');

		spanEle = document.createElement('span');
		spanEle.id = 'span1';
		document.body.appendChild(spanEle);

		// ------- 构造父子嵌套结构 测试参数 context

		pEle = document.createElement('p');
		pEle.id = 'p1';
		spanEle2 = document.createElement('span');
		spanEle2.id = 'span2';
		pEle.appendChild(spanEle2);

		document.body.appendChild(pEle);
	});

	afterEach(function() {
		document.body.removeChild(divEle);
		document.body.removeChild(spanEle);

		pEle.removeChild(spanEle2);
		document.body.removeChild(pEle);

		divEle = null;
		spanEle = null;
		divNodeList = null;

		pEle = null;
		spanEle2 = null;
	});

	it('测试 null', function() {
		var s = Sizzle(null);
		expect(s.DOMList).toBe(undefined);
		expect(s.length).toBe(0);
		expect(s.querySelector).toBe(null);
		expect(s.jTool).toBe(true);
	});

	it('测试 window', function() {
		var s = Sizzle(window);
		expect(s.DOMList).toEqual([window]);
		expect(s.length).toBe(1);
		expect(s.querySelector).toBe(window);
		expect(s.jTool).toBe(true);
	});

	it('测试 document', function() {
		var s = Sizzle(document);
		expect(s.DOMList).toEqual([document]);
		expect(s.length).toBe(1);
		expect(s.querySelector).toBe(document);
		expect(s.jTool).toBe(true);
	});

	it('测试 DOM', function() {
		var s = Sizzle(divEle);
		expect(s.DOMList).toEqual([divEle]);
		expect(s.length).toBe(1);
		expect(s.querySelector).toBe(divEle);
		expect(s.jTool).toBe(true);
	});

	it('测试 NodeList', function() {
		var s = Sizzle(divNodeList);
		expect(s.DOMList).toEqual(divNodeList);
		expect(s.length).toBe(1);
		expect(s.querySelector).toBe(divNodeList);
		expect(s.jTool).toBe(true);
	});


	it('测试 jTool 对象', function() {
		var jToolObj = Sizzle(divNodeList);
		var s = Sizzle(jToolObj);

		expect(s.DOMList).toEqual([jToolObj]);
		expect(s.length).toBe(1);
		expect(s.querySelector).toBe(jToolObj);
		expect(s.jTool).toBe(true);
	});

	it('测试 字符串 CSS 选择器', function() {
		var s = Sizzle('#div1');
		expect(s.DOMList[0].id).toBe('div1');
		expect(s.length).toBe(1);
		expect(s.querySelector).toBe('#div1');
		expect(s.jTool).toBe(true);
	});

	it('测试 selector 是 html 字符串', function() {

	});

	it('测试 context 是 字符串 CSS 选择器', function() {
		var s = Sizzle('span', '#p1');
		expect(s.DOMList[0].id).toBe('span2');
		expect(s.length).toBe(1);
		expect(s.querySelector).toBe('span');
		expect(s.jTool).toBe(true);
	});

	it('测试 context 是 DOM', function() {
		var s = Sizzle('span', pEle);
		expect(s.DOMList[0].id).toBe('span2');
		expect(s.length).toBe(1);
		expect(s.querySelector).toBe('span');
		expect(s.jTool).toBe(true);
	});

	it('测试 context 是 NodeList', function() {
		var s = Sizzle('span', document.querySelectorAll('p'));
		expect(s.DOMList[0].id).toBe('span2');
		expect(s.length).toBe(1);
		expect(s.querySelector).toBe('span');
		expect(s.jTool).toBe(true);
	});

	it('测试 context 是 jTool 对象', function() {
		var jToolObj = Sizzle('#p1');
		var s = Sizzle('span', jToolObj);
		expect(s.DOMList[0].id).toBe('span2');
		expect(s.length).toBe(1);
		expect(s.querySelector).toBe('span');
		expect(s.jTool).toBe(true);
	});

});

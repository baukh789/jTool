'use strict';

var _Document = require('../src/Document');
var extend = require('../src/extend');
var Sizzle = require('../src/Sizzle');

describe('Document', function() {

	var divEle = null;
	var divEle2 = null;
	var divEle3 = null;
	var divEle4 = null;
	var jTool = null;

	beforeEach(function() {
		jTool = function(selector, context) {
			return new Sizzle(selector, context);
		};

		Sizzle.prototype = jTool.prototype = {};

		jTool.extend = jTool.prototype.extend = extend;

		jTool.prototype.extend(_Document);


		divEle = document.createElement('div');
		divEle.id = 'div1';
		document.body.appendChild(divEle);

		divEle2 = document.createElement('div');
		divEle2.id = 'div2';
		document.body.appendChild(divEle2);

		// ------------
		divEle3 = document.createElement('div');
		divEle3.id = 'div3';
		divEle3.style.left = '60px';
		divEle3.style.top = '80px';
		divEle3.style.position = 'relative';

		// ------------
		divEle4 = document.createElement('div');
		divEle4.id = 'div4';
		divEle4.style.left = '60px';
		divEle4.style.top = '80px';
		divEle4.innerHTML = 'This is a text';


	});

	afterEach(function() {
		document.body.removeChild(divEle);
		document.body.removeChild(divEle2);
		divEle = null;
		divEle2 = null;
		divEle3 = null;
		divEle4 = null;
		jTool = null;
	});

	it('append', function() {
		jTool('#div2').append(divEle3);
		expect(divEle2.lastElementChild.id).toBe(divEle3.id);
		jTool('#div3').remove();
		expect(divEle2.lastElementChild).toBe(null);
	});

	it('prepend', function() {
		jTool('#div2').append(divEle3);
		jTool('#div2').prepend(divEle4);
		expect(divEle2.lastElementChild.id).toBe(divEle3.id);
		expect(divEle2.firstElementChild.id).toBe(divEle4.id);
		jTool('#div3').remove();
		jTool('#div4').remove();
	});

	it('before', function() {
		jTool('#div2').before(divEle3);
		expect(divEle2.previousElementSibling.id).toBe(divEle3.id);
		jTool('#div3').remove();
	});

	it('after', function() {
		jTool('#div2').after(divEle3);
		expect(divEle2.nextElementSibling.id).toBe(divEle3.id);
		jTool('#div3').remove();
	});

	it('text', function() {
		jTool('#div2').after(divEle4);
		expect(jTool(divEle4).text()).toBe(divEle4.textContent);
		jTool(divEle4).remove();

		jTool('#div2').after(divEle4);
		jTool(divEle4).append(divEle3);
		expect(jTool(divEle4).text()).toBe(divEle4.textContent);
		jTool(divEle4).remove();
		jTool(divEle3).remove();

		jTool(divEle4).text('哈哈');
		expect(jTool(divEle4).text()).toBe('哈哈');
		jTool(divEle4).remove();

		jTool('#div2').after(divEle4);
		jTool(divEle4).append(divEle3);
		jTool(divEle4).text('哈哈');
		expect(jTool(divEle4).text()).toBe('哈哈');
		jTool(divEle4).remove();
		jTool(divEle3).remove();
	});

	it('html', function() {
		jTool('#div2').after(divEle4);
		expect(jTool(divEle4).html()).toBe(divEle4.innerHTML);
		jTool(divEle4).remove();

		jTool('#div2').after(divEle4);
		jTool(divEle4).append(divEle3);
		expect(jTool(divEle4).html()).toBe(divEle4.innerHTML);
		jTool(divEle4).remove();
		jTool(divEle3).remove();

		jTool(divEle4).html('<div>哈哈</div>');
		expect(jTool(divEle4).html()).toBe('<div>哈哈</div>');
		jTool(divEle4).remove();

		jTool('#div2').after(divEle4);
		jTool(divEle4).append(divEle3);
		jTool(divEle4).html('<div>哈哈</div>');
		expect(jTool(divEle4).html()).toBe('<div>哈哈</div>');
		jTool(divEle4).remove();
		jTool(divEle3).remove();
	});

	it('wrap', function() {
		// jTool('#div2').append(divEle4);
		// jTool(divEle4).wrap('div');
		// expect(jTool('#div2').html()).toBe(divEle4.innerHTML);
		// jTool(divEle4).remove();
	});

	it('closest', function() {
		expect(jTool('#div2').closest('body').DOMList[0].tagName).toBe(divEle2.parentNode.tagName);
	});

	it('parent', function() {
		expect(jTool('#div2').parent().DOMList[0].tagName).toBe(divEle2.parentNode.tagName);
	});

	it('clone', function() {
		expect(jTool('#div2').clone().DOMList[0].id).toBe(divEle2.id);
	});
});

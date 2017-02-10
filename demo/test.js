/**
 * jTool test
 */
(function ($) {
	// testExtend
	// testExtend();
	function testExtend() {
		var o1 = {
			name: 'baukh',
			age: '29',
			likes: {
				work: 'o1-javascript',
				life: {
					one : 'o1-hehehe',
					two: 'o1-hahaha',
					three: {
						a: 'o1-1',
						b: 'o1-2',
						c: 'o1-3'
					},
					four: 'is four'
				}
			}
		};
		var o2 = {
			name: 'baukh',
			age: '30',
			likes: {
				work: 'o2-javascript java',
				life: {
					one : 'o2-one',
					two: 'o2-two',
					three: {
						a: 'o2-one',
						b: 'o2-two',
						c: 'o2-three'
					}
				}
			}
		};
		var o3 = $.extend(true, {}, o1, o2);
		console.log(o3);
	}
	// testScroll();
	function testScroll() {
		console.log('scroll', $(window).scrollTop());
		console.log('scroll', $(document).scrollTop());
		console.log('scroll', $('.t2').scrollTop());
	}

	//testBindScroll();
	function testBindScroll() {
		$(window).bind('scroll', function (e) {
			console.log(e)
		});
	}
	// testAnimate();
	function testAnimate() {
		$('#testAnimate').animate({height: '200px','margin-left': '500px'}, 3000, function(){
			console.log('高度等于200px了');
		});
	}

	//testOffset();
	function testOffset(){
		console.log($('.tt3').offset());
	}
	// 测试wrap and closest
	// testDOM();
	function testDOM(){
		var t1 = $('.t1');
		t1.wrap('<div class="wrap"><div class="table-div"></div></div>');
		var t1Text = t1.text();
		t1.append('<div class="append-div">'+t1Text+'</div>');
		t1.attr('auto-attr', 'false');
		var wrap = t1.closest('.wrap');
		console.log(t1);
		console.log(wrap);
	}
	// 测试attr and each
	//testAttr();
	function testAttr(){
		var t2 = $('.t2');
		t2.append('<span>append span</span><span>append span</span><span>append span</span>');
		var span = $('span', t2);
		console.log(span);
		$.each(span, function(i, v){
			$(v).attr('test-attr', 'baukh');
		});
	}
	// 测试on
	// testOn();
	function testOn(){
		/*
		 $('.t1').off('mousedown');
		 $('.t1').on('dblclick', function(e){
		 console.log('dblclick=', 'dblclick')
		 }).on('mousedown click', function(e){
		 console.log('mousedown click=', 'mousedown')
		 }).trigger('click');
		 */
		$('.t1').off('mousedown', '#abc');
		$('.t1').on('mousedown', '#abc', function(e){
			console.log('click=', this.innerHTML)
		});
		$('.t1').append('<span id="abc">abc</span>');
		$('#abc').eq(1).trigger('mousedown');
		/*
		 $('div').append('<p>新增加的P元素</p>');

		 $('div').off('mousedown', 'p,span');
		 $('div').on('mousedown', 'p,span', function(e){
		 console.log('mousedown=', this.innerHTML)
		 });
		 $('.t1').off('click', 'p,span');
		 */
	}
	// 测试bind
	// testBind();
	function testBind(){
		$('p').unbind('click.bind');
		$('p').bind('click.bind', function(e){
			console.log(this.innerHTML)
		});
		$('p').eq(1).unbind('click.bind');
		$('p').eq(2).unbind('click');
	}
	// 测试sizzle
	// testSizzle();
	function testSizzle(){
		console.log($('.t1'));
	}
	// 测试ajax
	testAjax();
	function testAjax(){
		$.ajax({
			url: 'http://127.0.0.1:1314/learnLinkManager/getLearnLinkList',
			data: {
				name: 1,
				c:2
			},
			type: 'POST',
			beforeSend: function(xhr){
				// console.log(xhr)
			},
			complete: function (xhr, status) {
				// console.log('complete', xhr, status)
			},
			success : function (data, status) {
				// console.log('success',data, status)
			},
			error: function (xhr, status, statusText) {
				// console.log('error', xhr, status, statusText)
			}
		});
	}
	// 测试post请求
	function testPost(){
		$.post('data/test.json', {a:1,b:2,ccc:22234}, function(data, status){
			console.log(data);
			console.log(status);
		});
	}

	// 测试html
	// testHtml();
	function testHtml(){
		var t1 = $('.t1');
		var t2 = $('.t2');
		t1.html(t2);
	}

	// 测试append
	function testAppend(){
		var a = document.createElement('span');
		a.innerHTML = 'aaaaa';
		$('div').append(a);
		$('div').append('123123');
		$('div').append('<font style="color:red;">hello world</font>');
	}

	// 测试prepend
	function testPrepend(){
		var a = document.createElement('span');
		a.innerHTML = 'aaaaa';
		$('div').prepend(a);
		$('div').prepend('123123');
		$('div').prepend('<font style="color:red;">hello world</font>');
	}

})(jTool);

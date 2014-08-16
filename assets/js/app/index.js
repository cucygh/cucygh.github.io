/**
 * @ignore  =====================================================================================
 * @fileoverview 文章首页
 * @author  yinguohui@360.cn
 * @version 1.0.0
 * @ignore  created in 2013-10-11
 * @ignore  depend Library jQuery
 * @ignore  =====================================================================================
 */
;
(function (window, undefined) {
	/* 命名空间 */
	var pages = {};
	/* 生成分页函数 */
	pages.make_page = function (num, max, w, callback) {
		var s = [],
		num = num * 1,
		w = w * 1,
		max = max * 1,
		up,
		down;
		up = Math.min(max - num, w) + num;
		down = Math.max(num - w, 1);
		for (var i = down; i <= up; i++) {
			s.push(i);
		}
		/*补全长度*/
		if (s.length < w * 2 + 1) {
			if (down == 1) {
				for (var i = up + 1, j = 1; j <= Math.min(w - num + 1, max - up); j++, i++) {
					s.push(i);
				}
			} else {
				for (var i = down - 1, j = 1; j <= Math.min(w - max + num, num - w - 1); j++, i--) {
					s.unshift(i);
				}
			}
		}
		/*上一页，下一页生成函数*/
		if (num - 1 >= 1) {
			s.unshift('<i class="left arrow icon"></i>');
		}
		if (num + 1 <= max) {
			s.push('<i class="right arrow icon"></i>');
		}
		/*页码的二次处理*/
		if (typeof callback == "function") {
			callback.call(this, s);
		}
		return s;
	};
	/* 生成分页 */
	pages.get_page = function () {
		var $page = $('.ui.pagination');
		var cur = $page.attr('pageno');
		var total = $page.attr('pagecount');
		var page_arr = pages.make_page(cur, total, 10);
		console.log(page_arr);
		var html = [];
		for (var i = 0, len = page_arr.length; i < len; i++) {
			if (i == cur - 1) {
				if (cur == 1) {
					html[i] = '<a class="item active" href="' + (i+1 || '') + '">' + page_arr[i] + '</a>';
				} else {
					html[i] = '<a class="item active" href="/pages/page' + (i || '') + '">' + page_arr[i] + '</a>';
				}
			} else {
				if(i==1){
				html[i] = '<a class="item" href="/pages/page' + (i+1 || '') + '">' + page_arr[i] + '</a>';
				}else{
				html[i] = '<a class="item" href="/">' + page_arr[i] + '</a>';
				}
			}
		}
		$page.html(html.join(''));
	}
	$(function () {
		window.pages = pages;
		pages.get_page();
	});
})(window)

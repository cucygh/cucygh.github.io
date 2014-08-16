/**
 * @ignore  =====================================================================================
 * @fileoverview 文章展示页面
 * @author  yinguohui@360.cn
 * @version 1.0.0
 * @ignore  created in 2014-07-03
 * @ignore  depend Library jQuery
 * @ignore  =====================================================================================
 */
;
(function (window, undefined0) {

	/* $(function(){
	window.prettyPrint && prettyPrint();
	}) */

	function saveFile(T, content) { //保存
		var filename = document.all(T).value;
		var win = window.open('', '', 'top=10000,left=10000');
		win.document.write(document.all(content).innerText);
		win.document.execCommand('SaveAs', '', filename)
		win.close();
	}

	$(function () {
		$('pre').addClass('prettyprint linenums prettyPrint');
		window.prettyPrint && prettyPrint();
	});
})(window)

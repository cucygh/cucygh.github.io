/*
 * artZoom 1.0.3
 * Date: 2010-12-14
 * Demo: http://www.planeart.cn/demo/artZoom/
 * (c) 2009-2010 TangBin, http://www.planeArt.cn
 *
 * This is licensed under the GNU LGPL, version 2.1 or later.
 * For details, see: http://creativecommons.org/licenses/LGPL/2.1/
 */
(function ($) {
	
	// 获取路径
	var path = (function (script) {
		script = script[script.length-1].src.replace(/\\/g, '/');
		return script.lastIndexOf('/') < 0 ? '.' : script.substring(0, script.lastIndexOf('/'));
	})(document.getElementsByTagName('script'));
	
	// 自动插入CSS与修复IE自定义指针路径问题
	$(function () {
		var cursorCss = "a.artZoom {cursor:url('" + path + "/images/zoomin.cur'), pointer;}\
			.artZoomBox a.maxImgLink { cursor:url('" + path + "/images/zoomout.cur'), pointer;}"; //IE cursor 路径相对于HTML
		
		// link
		$(document.createElement('link')).attr({
			href: path + "/lrtk.css",
			rel: "stylesheet",
			type: "text/css"
		}).appendTo('head');
		
		// style
		var style = document.createElement('style');
		style.setAttribute('type', 'text/css');
		style.styleSheet && (style.styleSheet.cssText += cursorCss) || style.appendChild(document.createTextNode(cursorCss));
		document.getElementsByTagName('head')[0].appendChild(style);
		style = null;
	});
	
    $.fn.artZoom = function () {
        var maxWidth;
        $(this).on('click', function () {
            var $this = $(this),
				maxImg = $this.attr('href'),
                viewImg = $this.attr('rel').length === 0 ? maxImg : $this.attr('rel'); // 如果连接含有rel属性，则新窗口打开的原图地址为此rel里面的地址
            if ($this.find('.loading').length == 0) $this.append('<span class="loading" title="Loading..">Loading..</span>');
            imgTool($this, maxImg, viewImg);
            return false;
        });

        // 图片预先加载
        var loadImg = function (url, fn) {
            var img = new Image();
            img.src = url;
            if (img.complete) {
                fn.call(img);
            } else {
                img.onload = function () {
                    fn.call(img);
                };
            };
        };

        // 图片工具条
        var imgTool = function (on, maxImg, viewImg) {
            var width = 0,
                height = 0,
                maxWidth = on.parent().innerWidth() - 12,
                tool = function () {
                    on.find('.loading').remove();
                    on.hide();

                    if (on.next('.artZoomBox').length != 0) {
                        return on.next('.artZoomBox').show();
                    };

                    var raw_height = height,
                        raw_width = width;
				
                    if (width > maxWidth) {
                        height = maxWidth / width * height;
                        width = maxWidth;
                    };

                    var html = '<div class="artZoomBox"><div class="tool"><a class="hideImg" href="#" title="\u6536\u8D77">\u6536\u8D77</a><a class="imgLeft" href="#" title="\u5411\u53F3\u8F6C">\u5411\u53F3\u8F6C</a><a class="imgRight" href="#" title="\u5411\u5DE6\u8F6C">\u5411\u5DE6\u8F6C</a><a class="viewImg" href="' + viewImg + '" title="\u67E5\u770B\u539F\u56FE">\u67E5\u770B\u539F\u56FE</a></div><a href="' + viewImg + '" class="maxImgLink"> <img class="maxImg" width="' + width + '" height="' + height + '" maxWidth="' + maxWidth + '" raw_width="' + raw_width + '" raw_height="' + raw_height + '" src="' + maxImg + '" /></a></div>';
                    on.after(html);
                    var box = on.next('.artZoomBox');
                    box.hover(function () {
                        box.addClass('js_hover');
                    }, function () {
                        box.removeClass('js_hover');
                    });
                    box.find('a').bind('click', function () {
						var $this = $(this);
                        // 收起
                        if ($this.hasClass('hideImg') || $this.hasClass('maxImgLink')) {
                            box.hide();
                            box.prev().show();
                        };
                        // 左旋转
                        if ($this.hasClass('imgLeft')) {
                            box.find('.maxImg').rotate('left', maxWidth)
                        };
                        // 右旋转
                        if ($this.hasClass('imgRight')) {
                            box.find('.maxImg').rotate('right', maxWidth)
                        };
                        // 新窗口打开
                        if ($this.hasClass('viewImg')) window.open(viewImg);

                        return false;
                    });

                };

            loadImg(maxImg, function () {
                width = this.width;
                height = this.height;
                tool();
            });

        };
    };
	

	// 图片旋转
	// 方案修改自：http://byzuo.com/
	$.fn.rotate = function (name, maxWidth) {

		var img = $(this)[0],
			step = img.getAttribute('step');

		if (!this.data('width') && !$(this).data('height')) {
			this.data('width', img.width);
			this.data('height', img.height);
		};

		if (step == null) step = 0;
		if (name === 'left') {
			(step == 3) ? step = 0 : step++;
		} else if (name === 'right') {
			(step == 0) ? step = 3 : step--;
		};
		img.setAttribute('step', step);
		var show_width = this.data('width'),
			show_height = this.data('height');
		if ((step == 1 || step == 3) && this.data('width') < this.data('height') && this.data('height') > maxWidth) {
			show_height = maxWidth;
			show_width = this.data('width') * maxWidth / this.data('height');
		}
		// IE浏览器使用滤镜旋转
		if (document.all) {
			img.style.filter = 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + step + ')';
			img.width = show_width;
			img.height = show_height;
			// IE8高度设置
			if ($.browser.version == 8) {
				switch (step) {
				case 0:
					this.parent().height('');
					break;
				case 1:
					this.parent().height(this.data('width') + 10);
					break;
				case 2:
					this.parent().height('');
					break;
				case 3:
					this.parent().height(this.data('width') + 10);
					break;
				};
			};
			// 对现代浏览器写入HTML5的元素进行旋转： canvas
		} else {
			var c = this.next('canvas')[0];
			if (this.next('canvas').length == 0) {
				this.css({
					'visibility': 'hidden',
					'position': 'absolute'
				});
				c = document.createElement('canvas');
				c.setAttribute('class', 'maxImg canvas');
				img.parentNode.appendChild(c);
			}
			var canvasContext = c.getContext('2d');
			var resizefactor = 1;
			show_height = img.raw_height = $(img).attr('raw_height');	//图片原始高度
			show_width = img.raw_width = $(img).attr('raw_width'); 		//原始宽度
			if ((step == 1 || step == 3) && img.raw_height > maxWidth) {
				resizefactor = maxWidth / img.raw_height;
				show_height = maxWidth;
				show_width = resizefactor * img.raw_width;
			}
			if ((step == 0 || step == 2) && img.raw_width > maxWidth) {
				resizefactor = maxWidth / img.raw_width;
				show_height = resizefactor * img.raw_height;
				show_width = maxWidth;
			}
			switch (step) {
			default:
			case 0:
				c.setAttribute('width', show_width);
				c.setAttribute('height', show_height);
				canvasContext.rotate(0 * Math.PI / 180);
				canvasContext.scale(resizefactor, resizefactor);						
				canvasContext.drawImage(img, 0, 0);
				break;
			case 1:
				c.setAttribute('width', show_height);
				c.setAttribute('height', show_width);
				canvasContext.rotate(90 * Math.PI / 180);
				canvasContext.scale(resizefactor, resizefactor);
				canvasContext.drawImage(img, 0, -img.raw_height);
				break;
			case 2:
				c.setAttribute('width', show_width);
				c.setAttribute('height', show_height);
				canvasContext.rotate(180 * Math.PI / 180);
				canvasContext.scale(resizefactor, resizefactor);
				canvasContext.drawImage(img, -img.raw_width, -img.raw_height);
				break;
			case 3:
				c.setAttribute('width', show_height);
				c.setAttribute('height', show_width);
				canvasContext.rotate(270 * Math.PI / 180);
				canvasContext.scale(resizefactor, resizefactor);
				canvasContext.drawImage(img, -img.raw_width, 0);
				break;
			};
		};
	};


})(jQuery);
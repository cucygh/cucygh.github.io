---
layout: post
title: 那些年我们一起清除过的浮动
categories: css
own: 转载
---
浮动(float)，一个我们即爱又恨的属性。爱，因为通过浮动，我们能很方便地布局； 恨，浮动之后遗留下来太多的问题需要解决，特别是IE6-7（以下无特殊说明均指 windows 平台的 IE浏览器）。也许很多人都有这样的疑问，浮动从何而来？我们为何要清除浮动？清除浮动的原理是什么？本文将一步一步地深入剖析其中的奥秘，让浮动使用起来更加得心应手。

### 清除浮动 还是 闭合浮动

很多人都已经习惯称之为清除浮动，以前我也一直这么叫着，但是确切地来说是不准确的。我们应该用严谨的态度来对待代码，也能更好地帮助我们理解开头的三个问题。

1）清除浮动：清除对应的单词是 clear，对应CSS中的属性是 clear：left | right | both | none；

2）闭合浮动：更确切的含义是使浮动元素闭合，从而减少浮动带来的影响。

通过以上实例发现，其实我们想要达到的效果更确切地说是闭合浮动，而不是单纯的清除浮动，在footer上设置clear：both清除浮动并不能解决warp高度塌陷的问题。  
结论：用闭合浮动比清除浮动更加严谨，所以后文中统一称之为：闭合浮动。

### 为何要清除浮动？

要解答这个问题，我们得先说说CSS中的定位机制：普通流，浮动，绝对定位 （其中"position:fixed" 是 "position:absolute" 的一个子类）。

1）普通流：很多人或者文章称之为文档流或者普通文档流，其实标准里根本就没有这个词。如果把文档流直译为英文就是 document flow ，但标准里只有另一个词，叫做普通流 （normal flow)，或者称之为常规流。但似乎大家更习惯文档流的称呼，因为很多中文翻译的书就是这么来的。比如《CSS Mastery》，英文原书中至始至终都只有普通流 normal flow（普通流） 这一词，从来没出现过document flow （文档流）

2）浮动：浮动的框可以左右移动，直至它的外边缘遇到包含框或者另一个浮动框的边缘。浮动框不属于文档中的普通流，当一个元素浮动之后，不会影响到块级框的布局而只会影响内联框（通常是文本）的排列，文档中的普通流就会表现得和浮动框不存在一样，当浮动框高度超出包含框的时候，也就会出现包含框不会自动伸高来闭合浮动元素（“高度塌陷”现象）。顾名思义，就是漂浮于普通流之上，像浮云一样，但是只能左右浮动。

正是因为浮动的这种特性，导致本属于普通流中的元素浮动之后，包含框内部由于不存在其他普通流元素了，也就表现出高度为0（高度塌陷）。在实际布局中，往往这并不是我们所希望的，所以需要闭合浮动元素，使其包含框表现出正常的高度。

绝对定位就不多说了，不在本文讨论范围之内，下回分解。

### 清除浮动的原理

1）添加额外标签
这是在学校老师就告诉我们的 一种方法，通过在浮动元素末尾添加一个空的标签例如 <div style=”clear:both”></div>，其他标签br等亦可。

<iframe width="100%" height="140" src="http://jsfiddle.net/cuc_ygh/b5e5p3ea/6/embedded/html/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

优点：通俗易懂，容易掌握
缺点：可以想象通过此方法，会添加多少无意义的空标签，有违结构与表现的分离，在后期维护中将是噩梦，这是坚决不能忍受的，所以你看了这篇文章之后还是建议不要用了吧。

2）使用 br标签和其自身的 html属性
这个方法有些小众，br 有 clear=“all | left | right | none” 属性

<iframe width="100%" height="140" src="http://jsfiddle.net/cuc_ygh/b5e5p3ea/7/embedded/html/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

优点：比空标签方式语义稍强，代码量较少
缺点：同样有违结构与表现的分离，不推荐使用

3)父元素设置 overflow：hidden
通过设置父元素overflow值设置为hidden；在IE6中还需要触发 hasLayout ，例如 zoom：1；

<iframe width="100%" height="140" src="http://jsfiddle.net/cuc_ygh/b5e5p3ea/8/embedded/html/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

优点：不存在结构和语义化问题，代码量极少
缺点：内容增多时候容易造成不会自动换行导致内容被隐藏掉，无法显示需要溢出的元素；04年POPO就发现overflow:hidden会导致中键失效，这是我作为一个多标签浏览控所不能接受的。所以还是不要使用了

4)父元素设置 overflow：auto 属性
同样IE6需要触发hasLayout，演示和3差不多
优点：不存在结构和语义化问题，代码量极少
缺点：多个嵌套后，firefox某些情况会造成内容全选；IE中 mouseover 造成宽度改变时会出现最外层模块有滚动条等，firefox早期版本会无故产生focus等, 请看 嗷嗷的 Demo ,不要使用

5）父元素也设置浮动
优点：不存在结构和语义化问题，代码量极少
缺点：使得与父元素相邻的元素的布局会受到影响，不可能一直浮动到body，不推荐使用

6）父元素设置display:table
优点：结构语义化完全正确，代码量极少
缺点：盒模型属性已经改变，由此造成的一系列问题，得不偿失，不推荐使用

7）使用:after 伪元素
需要注意的是 :after是伪元素（Pseudo-Element），不是伪类（某些CSS手册里面称之为“伪对象”），很多清除浮动大全之类的文章都称之为伪类，不过csser要严谨一点，这是一种态度。
由于IE6-7不支持:after，使用 zoom:1触发 hasLayout。

<iframe width="100%" height="300" src="http://jsfiddle.net/cuc_ygh/b5e5p3ea/9/embedded/html/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

优点：结构和语义化完全正确,代码量居中
缺点：复用方式不当会造成代码量增加


### 闭合浮动方法(精益求精)

上面已经列举了7种闭合浮动的方法，我们发现其实更多的：display：table-cell，display：inline-block等只要触发了BFC的属性值都可以闭合浮动。从各个方面比较，after伪元素闭合浮动无疑是相对比较好的解决方案了，下面详细说说该方法。

<iframe width="100%" height="100" src="http://jsfiddle.net/cuc_ygh/b5e5p3ea/10/embedded/css/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

1) display:block 使生成的元素以块级元素显示,占满剩余空间;
2) height:0 避免生成内容破坏原有布局的高度。
3) visibility:hidden 使生成的内容不可见，并允许可能被生成内容盖住的内容可以进行点击和交互;
4）通过 content:"."生成内容作为最后一个元素，至于content里面是点还是其他都是可以的，例如oocss里面就有经典的 content:"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",有些版本可能content 里面内容为空,一丝冰凉是不推荐这样做的,firefox直到7.0 content:”" 仍然会产生额外的空隙；
5）zoom：1 触发IE hasLayout。
通过分析发现，除了clear：both用来清除浮动的，其他代码无非都是为了隐藏掉content生成的内容，这也就是其他版本的闭合浮动为什么会有font-size：0，line-height：0。

#### 精益求精方案一：

<iframe width="100%" height="100" src="http://jsfiddle.net/cuc_ygh/b5e5p3ea/11/embedded/css" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

#### 精益求精方案二

由Nicolas Gallagher 大湿提出来的,原文:[A new micro clearfix hack](http://nicolasgallagher.com/micro-clearfix-hack/)，该方法也不存在firefox中空隙的问题。
相对于空标签闭合浮动的方法代码似乎还是有些冗余，通过查询发现Unicode字符里有一个“零宽度空格”，也就是U+200B，这个字符本身是不可见的，所以我们完全可以省略掉 visibility:hidden了

<iframe width="100%" height="100" src="http://jsfiddle.net/cuc_ygh/b5e5p3ea/12/embedded/css" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

需要注意的是：
上面的方法用到了  ：before伪元素，很多人对这个有些迷惑，到底我什么时候需要用before呢？为什么方案一没有呢？其实它是用来处理margin边距重叠的，由于内部元素 float 创建了BFC，导致内部元素的margin-top和 上一个盒子的margin-bottom 发生叠加。如果这不是你所希望的，那么就可以加上before，如果只是单纯的闭合浮动，after就够了！并不是如同大漠[《Clear Float》](http://www.w3cplus.com/css/clear-float)一文所说的：但只使用clearfix:after时在跨浏览器兼容问题会存在一个垂直边距叠加的bug，这不是bug，是BFC应该有的特性。
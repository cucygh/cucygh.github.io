---
layout: post
title: 360彩票走势图项目前端架构
categories: flex
own: 原创
---

### 项目介绍

2013年360彩票发展日新月异，历史合作终止。这要求系统独立、完整、稳定，也就是在这个时刻部门觉得业务整体改版进而保证发展需要。
改版主页分为：投注类和工具类。

根据人员和时间等因素，决定两条线并行完成。投注类1名前端、1名PHP、1名产品；工具类（走势图）1名前端、1名PHP、1名产品。

工具类预计完成时间2个月。

### 功能划分

新版的问题除了要克服老版的遗留问题，还要实现新的功能点，对比后得出一份新的功能清单：

 a、打开速度快
 
 b、数据更新稳定
 
 c、界面与时俱进
 
 d、新增选号器
 
 d、新增快速投注
 
 e、新增绘图工具
 
 f、新增开奖倒计时
 
 g、新增历史开奖
 
 h、K线图、直方图由原来的PHP输出图片改为flash效果
 
 i、新增自定义查询
 
### 结构设计

设计原则：高复用、低耦合;无交互的数据直接输出，交互的数据采用配置+模块化的方式实现；任何工具模块不涉及页面的交互，功能单一。
任何功能性完整的模块单一文件处理，即遵循AMD协议，方便后续使用require或seajs，为将来改版做好准备。
	
视图结构
	

<a class="artZoom" href="/assets/img/blog/flex/view.jpg" rel="/assets/img/blog/flex/view.jpg"><img src="/assets/img/blog/flex/view.jpg" alt="" /></a>

视图结构这样处理的原因符合设计原则，每个功能隔离出来，便于设计控制结构。

控制结构

<a href="/assets/img/blog/flex/control.jpg" class="artZoom" rel="/assets/img/blog/flex/control.jpg"><img src="/assets/img/blog/flex/control.jpg" alt="" /></a>

### 代码示例

绘图工具：paint.js

<iframe width="100%" height="600" src="http://jsfiddle.net/cuc_ygh/ypa7pdrv/1/embedded/js/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

控制器操作：control.js

<iframe width="100%" height="600" src="http://jsfiddle.net/cuc_ygh/ypa7pdrv/2/embedded/js/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

### 效果图

绘图工具效果

<a href="/assets/img/blog/flex/paint-tool.png" class="srtZoom" rel="/assets/img/blog/flex/paint-tool.png"><img src="/assets/img/blog/flex/paint-tool.png" alt="" /></a>


控制器效果

<a href="/assets/img/blog/flex/control-tool.gif" class="srtZoom" rel="/assets/img/blog/flex/control-tool.gif"><img src="/assets/img/blog/flex/control-tool.gif" alt="" /></a>



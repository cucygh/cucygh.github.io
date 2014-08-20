---
layout: post
title: 前端项目压缩方式改进
categories: flex
own: 原创
---

### 问题描述

360彩票前端项目压缩工具改进，由于支付和历史原因项目越来越大，压缩css会比较慢，主要涉及css中的图片压缩。改进需求如下：

1、支持单个文件

2、支持单个目录

### 实现状态

1、支持单个文件

2、支持单个目录

3、支持多个文件

4、支持多个目录

5、支持文件、目录混合方式



### 改进思路

<b>第一版</b> 以js压缩做尝试，读黄欢的文档想到最简单的办法是设置不同的根目录来实现。原理很简单把每个参数提取出来，如果本身是目录把该目录设置为跟目录，如果是文件将文件的父级目录作为根目录即可。

这一版在js中用的很不错，在转移到css就出问题了。css里的路径是相对于根目录的，所以上述方法找不到图片的。后来想文件搜索图片路径进行转换，然后走接口上传图片在替换，想想太麻烦了，放弃。

<b>第二版</b> 

考虑到上述问题，再考虑上不同项目同时压缩最终的核心问题就是路径问题。最后的解决方案就是设置www为根目录，然后在根目录下设置临时目录，根据压缩参数提取文件做根目录的路径映射，设置exclude之压缩临时目录，然后根据映射关系把压缩的文件复制到应该放置的地方，删除临时目录。


### 代码

	<?php 
		require_once (dirname(__FILE__) . "/../../../../../www/auto_load.php");
		include dirname(__FILE__) . "/../staticconf/pageResConfInc.php";
		/* ==================================变量声明和定义=============================== */
		/* 分给彩票的命名空间 */
		$cp_name="caipiao";
		/* 分给彩票的Token */
		$cp_token="oole5Lenoyuquaqu";
		/* 设置静床根目录 */
		$file_path = TextConf::STATIC_ROOT_PATH."/src/www/";
		
		/* 设置静态发布目录 */
		$published_path = TextConf::STATIC_ROOT_PATH."/src/www/published/";
		/* 设置排除目录 */
		
		/* 设置临时目录 */
		$tmp_dir = $file_path.'cp_compile_random';
		$tmp_dir_dst = $file_path.'published/cp_compile_random';
		$start_time=time();
		$start_date=date('y-m-d h:i:s');
		/* 调试开关 */
		$err_debug=false;
		/* ==================================功能函数================================= */
		
		/*功能函数：创建临时目录 */
		function init_dir() {
			global $tmp_dir;
			global $err_debug;
			/* 创建临时根目录 */
			if (!is_dir($tmp_dir)) {
				$dir_make = mkdir($tmp_dir);
				if (!$dir_make) {
					die('=================: make root dir fail!'."\n");
				}
			} else {
				if ($err_debug) {
					echo '==================: root dir exit, skip.....'."\n";
				}
			}
		}
		
		
		/* 功能函数：删除非空目录 */
		function del_dir($dir) {
			global $err_debug;
			if ($handle = opendir($dir)) {
				while (false !== ($item = readdir($handle))) {
					if ($item != "." && $item != "..") {
						if (is_dir($dir."/".$item)) {
							del_dir($dir."/".$item);
						} else {
							$is_del=unlink($dir."/".$item);
							if ($err_debug&&$is_del) {
								echo " del ".$dir."/".$item."\n";
							}
						}
					}
				}
				closedir($handle);
				rmdir($dir);
				if ($err_debug) {
					echo " remove ".$dir." successfully! \n";
				}
			}
		}
	 
		/*功能函数：删除临时目录 */
		function remove_dir() {
			global $tmp_dir;
			global $tmp_dir_dst;
			// 删除原始目录
			del_dir($tmp_dir);
			// 删除压缩目录
			del_dir($tmp_dir_dst);
		}
		
		/*功能函数：获取文件后缀 */
		function suffix($file_name) {
			$extend = explode(".", $file_name);
			$va = count($extend) - 1;
			return $extend[$va];
		}
		
		/* 功能函数：复制目录及子目录 */
		function copy_dir($from_dir, $to_dir) {
			global $err_debug;
			if (!is_dir($from_dir)) {
				return false;
			}
			if ($err_debug) {
				echo "\n from:".$from_dir."\n to".$to_dir."\n";
			}
			$from_files = scandir($from_dir);
			//如果不存在目标目录，则尝试创建
			if (!file_exists($to_dir)) {
				 mkdir($to_dir);
			}
			if (!empty($from_files)) {
				foreach($from_files as $file) {
					if ($file == '.' || $file == '..' || $file == '.svn') {
						continue;
					}
					if (is_dir($from_dir.'/'.$file)) { //如果是目录，则调用自身
						copy_dir($from_dir.'/'.$file, $to_dir.'/'.$file);
					} else { //直接copy到目标文件夹
						$ext=suffix($file);
						if ($ext == 'js' || $ext == 'css') {
							copy($from_dir.'/'.$file, $to_dir.'/'.$file);
						}
					}
				}
			}
		}
		
		/*功能函数: 复制所有文件到指定目录 */
		function copy_files($src,$dst){
			if(is_dir($src)){
				copy_dir($src,$dst);
			}else{
				if(file_exists($src)){
					$file=basename($src);
					copy($src, $dst.'/'.$file);
				}else{
					die('====================: the file '.$src.' is not exists'."\n\n");
				}
			}
		}
		
		/*功能函数：更新本地文件 */
		function update_svn() {
			echo "=======================更新本地文件============================= \n\n";
			$SVN_up = "svn up ".TextConf::STATIC_ROOT_PATH;
			system($SVN_up);
			echo "=======================更新本地文件结束========================= \n\n";
		}
		
		/* 提交本地文件 */
		function commit_svn() {
			global $published_path;
			echo "=======================正在提交压缩文件========================= \n\n";
			$SVN_add = "svn add "." --force ".$published_path;
			// echo $SVN_add."\n";
			system($SVN_add);
			$SVN_submit = "svn ci -m \"deploy\" ".$published_path;
			// echo $SVN_submit."\n";
			system($SVN_submit);
			echo "\n=======================提交结束================================= \n\n";
		}
		
		/* 统计压缩时间 */
		function statis_time(){
			global $start_date;
			global $start_time;
			echo "=======================开始时刻：".$start_date."\n";
			echo "=======================结束时刻：".date('y-m-d h:i:s')."\n";
			echo "=======================总共耗时：".(time()-$start_time)." 秒\n";
		}
		
		/* =============================开始操作=================================== */
		/* 移除参数列表中文件本身名 */
		array_shift($argv);
		/* 子版本号 */
		$y=0;
		/* 更新本地文件 */
		update_svn();
		/* 遍历其他参数 */
		foreach($argv as $i) {
			init_dir();
			$y++;
			/* 获取当前根目录 */
			$cur_root = getcwd();
			/* 获取相对根目录里文件绝对目录 */
			$cur_path = dirname($i);
			$cur_file = $cur_root.'/'.$cur_path.'/'.basename($i);
			$receive_dir = is_dir($i) ? preg_replace('/(.*src\/www\/)/', '', $cur_file) : preg_replace('/(.*src\/www)/', '', $cur_root.'/'.$cur_path);
			$receive_dir = $published_path.$receive_dir;
			copy_files($i, $tmp_dir);
			/* 静床配置 */
			$qsconf = new QStaticConf(
					$cp_name, //这是分给你应用的Namespace
					$cp_token, //这是分给你应用的API Token
					$file_path, //这个是你静态文件根目录夹,如：/path/to/app/static_root
					'v'.time().'_'.$y
				);
			$qsconf->EXCLUDE = array('.svn', '/^((?!cp_compile_random).)*$/');
			/* 发布 */
			//根据conf生成$qstatic实例
			$qstatic = QStaticClient::getInstance($qsconf);
			$qstatic->deployFile($published_path);
			copy_files($tmp_dir_dst, $receive_dir);
			remove_dir();
		}
		/* 未指定任何目录 */
		if ($y == 0) {
			$qsconf = new QStaticConf(
					$cp_name, //这是分给你应用的Namespace
					$cp_token, //这是分给你应用的API Token
					$file_path, //这个是你静态文件根目录夹,如：/path/to/app/static_root
					'v'.time().'_'.$y);
			$qsconf->EXCLUDE = array('.svn', '/published/','jquery/jquery');
			/* 发布 */
			//根据conf生成$qstatic实例
			$qstatic = QStaticClient::getInstance($qsconf);
			$qstatic->deployFile($published_path);
		}
		/* 合并文件 */
		$pageConf -> mergeFile($pageConf->jsFileConf, "js");
		$pageConf -> mergeFile($pageConf->cssFileConf, "css");
		
		/* 提交文件 */
		commit_svn();
		/* 统计时间 */
		statis_time();
		/* =============================结束操作=================================== */
	?>
/**
 * JARING - 4 commemorate
 *
 * Copyleft 2011, CROSSYOU.CN
 * Released under LGPL License.
 *
 * License: http://dev.crossyou.cn/license
 *
 * This file loads the js files from source instead of a merged copy.
 * 
 * Version: $Id$
 */

 (function(){
 	var scripts = [];

 	//---------------------------------------------------------------
 	function getPath(){
 		var nl = document.getElementsByTagName('script');
		for (var i = 0; i < nl.length; i++) {
			var src = nl[i].src;
			if (src && src.indexOf('jaring-dev-mode.js') != -1) {
				return dirname(dirname(src));
			}
		}
 	}

 	function dirname(dirstr){
 		var dir = dirstr.substring(0, dirstr.lastIndexOf('/'));
 		if (dir) {
			return dir ;
		} else {
			return dirstr;
		}
 	}

 	function init(scripts){
 		var output = '';
		for (var i = 0; i < scripts.length; i++){
			output += '<script type="text/javascript" src="' + scripts[i] + '"></script>\n';
		}
		document.write(output);
 	}

 	function require(jsfile){
 		var base = getPath();
		scripts.push(base + '/src/' + jsfile);
	}
	//----------------------------------------------------------------
	
	require('jaring.js');
	require('core/constant.js');
	require('core/util.js');
	require('core/browser.js');
	require('core/event.js');
	require('core/Observable.js');
	require('core/MVCObject.js');

	require('type/Event.js');
	require('type/Offset.js');
	require('type/Point.js');

	require('core/dom.js');

	require('widget/Draggable.js');

	//Core 核心文件
	
	//-----------------------------------------------------------------
	init(scripts);
 })();
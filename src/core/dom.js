/**
 * DOMUtil 实现了一些 简单的dom操作
 * 
 * 简单的链式调用
 * 
 * @author junlong.yang
 * @version $Id$
 */
(function(){
	Jaring.dom = {
		get: function(id){
			var el = (typeof id === 'string' ? document.getElementById(id) : id);
			//el.__jaring_property_ = el.__jaring_property_ || {};
			Jaring.util.extendIf(el, this,'__jaring_property_');
			return el;
		},

		create: function(tagName){
			var el = document.createElement(tagName);
			//el.__jaring_property_ = el.__jaring_property_ || {};
			Jaring.util.extendIf(el, this,'__jaring_property_');
			return el;
		},

		//DOM EVENT : BEGIN
		on: function(){
			var args = Array.prototype.slice.call(arguments, 0);

			if(Jaring.util.is(args[0], 'string')){
				var el = this;
				args.unshift(el);
			} else {
				var el = args[0];
			}
			el.listeners = el.listeners || [];

			el.listeners.push(Jaring.event.addDomListener.apply(Jaring.event, args));
			return el;
		},

		un: function(listener){
			var listeners = listener ? (listener.listeners || listener) : this.listeners;
			if(!Jaring.util.is(listeners, 'array')){
				listeners = [listeners];
			}
			for(var i = 0, l = listeners.length; i < l; i++){
				Jaring.event.removeListener(listeners[i]);
			}
		},

		/**
		 * 为一个DOM对象, 值注册一次事件处理程序
		 * 当该事件处理程序触发后, 立刻注销该处理程序
		 * 
		 * 传参情况说明:
		 * 1.(instance, eventName, handler, capture)
		 * 2.(eventName, handler, capture)
		 * 其中 capture 为可选参数 控制事件属于:冒泡还是捕获
		 * 
		 * @return {Element} [DOM Element]
		 */
		once: function(){
			var args = Array.prototype.slice.call(arguments, 0);

			if(Jaring.util.is(args[0], 'string')){
				var el = this;
				args.unshift(el);
			} else {
				var el = instance;
			}
			
			var listener = Jaring.event.addDomListenerOnce.apply(Jaring.event, args);
			el.listener = listener;
			return el;
		},
		//DOM EVENT : END
		
		/**
		 * 判断Element是否存在给定的className
		 * 
		 * @author junlong.yang
		 * @since 1.0.0
		 * @param  {[type]}  mix  [description]
		 * @param  {[type]}  name [description]
		 * @return {Boolean}      [description]
		 */
		hasClass: function (mix, name) {
			var el = name ? mix : this,
				cn = name || mix;

			return (el.className.length > 0) &&
					new RegExp('(^|\\s)' + cn + '(\\s|$)').test(el.className);
		},

		addClass: function(mix, name){
			var el = name ? mix : this,
				cn = name || mix;

			if (!el.hasClass(el, cn)) {
				el.className += (el.className ? ' ' : '') + cn;
			}

			return el;
		},

		removeClass: function (mix, name) {
			var el = name ? mix : this,
				cn = name || mix;

			el.className = el.className.replace(/(\S+)\s*/g, function (w, match) {
				if (match === cn) {
					return '';
				}
				return w;
			}).replace(/^\s+/, '');

			return el;
		},


		/**
		 * 获取DOM Element 计算后的 样式属性值
		 * 该方法是一个比较强大的方法
		 * 暂未考虑性能问题, 感觉这是一个比较变态的条件判断~~ !
		 * 
		 * 传参情况说明:
		 * 1.(element, prop, value) 为element设置style样式 setStyle
		 * 2.(prop, value) 为this.element设置style样式 setStyle
		 * 3.(element, props) setStyles
		 * 4.(props) setStyles
		 * 5.(element, prop) getStyle
		 * 6.(prop) getStyle
		 * 7.(element, '') clearStyle
		 * 8.('') clearStyle
		 * 9.(element) getStyles
		 * 10.() getStyles
		 * 
		 * @author junlong.yang
		 * @since 1.0.0
		 * 
		 * @param  {[type]} mix  [description]
		 * @param  {[type]} name [description]
		 * @return {[type]}      [description]
		 */
		css: function(){
			var args = Array.prototype.slice.call(arguments, 0),
				last = args[args.length - 1];
				lastnd = args[args.length - 2];

			if(Jaring.util.is(last, 'string') && Jaring.util.is(lastnd, 'string')) {//setStyle
				if(args.length = 2) {
					args.unshift(this);
				}
				var elem = args[0], 
					prop = args[1], 
					value = args[2];

					switch (prop) {
						case "opacity":
							this.opacity(elem, value);
							break;
						case "float":
						$ = Jaring.browser.msie ? "styleFloat": "cssFloat";
						default:
						elem.style[prop] = value;
					}

					return elem;

			} else if(Jaring.util.is(last, 'object') && (last instanceof Object)) {//setStyles
				if(args.length = 1) {
					args.unshift(this);
				}
				var elem = args[0], 
					props = args[1];

					for (var prop in props) {
						if (typeof props[C] != "function") {
							this.css(elem, prop, props[prop])
						}
					}

			} else if(Jaring.util.is(last, 'string')){//getStyle
				var el = args[1] ? args[0] : this,
					cn = args[1] || args[0],
					ret = null;
				if(document.defaultView && document.defaultView.getComputedStyle) {
					if (cn == 'float') {
						cn = 'cssFloat';
					}
					if (ret = el.style[cn]) {
						return ret;
					}
					var style = document.defaultView.getComputedStyle(el, null);
					ret = style ? style[cn] : null;
				} else {
					if (cn == 'opacity') {
						return this.opacity(el);
					} else if (cn == 'float') {
						cn = 'styleFloat';
					}

					if (ret = el.style[cn]) {
						return ret;
					}

					var style = el.currentStyle;
					ret = style ? style[cn] : null;
				}
				return (ret === 'auto' ? null : ret);

			} else if(last == '') { //clearStyle
				//TODO
			} else {//getStyles
				//TODO
				return null;
			}
		},

		/**
		 * 设置/获取/清空 DOM Element 的透明度
		 * 
		 * 参数可能情况:
		 * 1、(element, opacity) 为element设置透明度 setOpacity
		 * 2、(element, '') 清空element的透明度 clearOpcity
		 * 3、(opacity) 为this.element设置透明度 setOpacity
		 * 4、('') 清空this.element的透明度 clearOpcity
		 * 5、(element) 获取element的透明度 getOpacity
		 * 6、() 获取this.element的透明度 getOpacity
		 * 
		 * @author junlong.yang
		 * @since 1.0.0
		 */
		opacity: function(){
			var args = Array.prototype.slice.call(arguments, 0),
				last = parseFloat(args[args.length - 1]);

			if(typeof last == 'number') {//setOpacity

				var el = (typeof parseFloat(args[0]) == 'number') ? this : args[0];

				if(Jaring.browser.msie) {//IE
					el.style.zoom = 1;
					el.style.filter = value !== 1 ? 'alpha(opacity=' + Math.round(value * 100) + ')' : '';
				} else {
					el.style.opacity = last;
				}
				return el;

			} else if(last == ''){//clearOpacity

				var el = args[0] == '' ? this : args[0];

				if (Jaring.browser.msie) {
					if (typeof el.style.filter == 'string' && (/alpha/i).test(el.style.filter)) {
						el.style.filter = '';
					}
				} else {
					el.style.opacity = '';
					el.style['-moz-opacity'] = '';
					 el.style['-khtml-opacity'] = '';
				}

				return el;

			} else {//getOpacity

				var el = args[0] || this;

				if (typeof el.style.filter == 'string') {
					var match = el.style.filter.match(/alpha\(opacity=(.*)\)/i);
					if (match) {
						var opacity = parseFloat(match[1]);
						if (!isNaN(opacity)) {
							return opacity ? opacity / 100: 0;
						}
					}
					return 1;
				} else {
					return parseFloat(el.style.opacity) || 1;
				}

			}
		},

		width: function(){
			var args = Array.prototype.slice.call(arguments, 0),
				last = parseFloat(args[args.length - 1]);
			if (Jaring.util.is(last, 'number') && !isNaN(last)){
				var el = Jaring.util.is(args[0], 'number')? this : args[0];
				el.style.width = last + 'px';
				el._jaring_width_ = last;
				return el;
			} else {
				var el = args[0] || this;
				if (el._jaring_width_){
					return el._jaring_width_;
				}

				if (el == document){
					return Jaring.browser.msie ? (Jaring.browser.strict ? document.documentElement.clientWidth: document.body.clientWidth) : self.innerWidth;
				}
				return el.clientWidth;
			}
		},

		height: function(){
			var args = Array.prototype.slice.call(arguments, 0),
				last = parseFloat(args[args.length - 1]);
			if (Jaring.util.is(last, 'number') && !isNaN(last)){
				var el = Jaring.util.is(args[0], 'number')? this : args[0];
				el.style.height = last + 'px';
				el._jaring_height_ = last;
				return el;
			} else {
				var el = args[0] || this;
				if (el._jaring_height_){
					return el._jaring_height_;
				}

				if (el == document){
					return Jaring.browser.msie ? (Jaring.browser.strict ? document.documentElement.clientHeight: document.body.clientHeight) : self.innerHeight;
				}
				return el.clientHeight;
			}
		},

		/**
		 * 返回/获取 DOM Element 的长度 宽度
		 * 
		 * 传参情况说明:
		 * 1.(element) getSize
		 * 2.() getSize
		 * 3.(element, size) setSize
		 * 4.(size) setSize
		 * 
		 * @author junlong.yang
		 * @since 1.0.0
		 * @return {Size} size [Jaring.maps.Size]
		 */
		size: function(){
			var args = Array.prototype.slice.call(arguments, 0),
				last = args[args.length - 1];

			if (last instanceof Jaring.maps.Size){
				var el = (args[0] instanceof Jaring.maps.Size) ? this : args[0];
				this.width(el, last.width);
				this.height(el, last.height);
				el._jaring_size_ = last;
				return el;
			} else {
				var el = args[0] || this;
				if (el._jaring_size_){
					return el._jaring_size_;
				}

				return new Jaring.maps.Size(this.width(el)||0, this.height(el)||0);
			}
		},

		/**
		 * 设置/获取元素的 innerHTML
		 * 
		 * 传参情况说明
		 * 1.(el, html) setHtml
		 * 2.(html) setHtml
		 * 3.(el) getHtml
		 * 4.() getHtml
		 * 
		 * @param  {[type]} el   [description]
		 * @param  {[type]} html [description]
		 * @return {[type]}      [description]
		 */
		html: function(){
			var args = Array.prototype.slice.call(arguments, 0),
				last = args[args.length - 1];

			if(Jaring.util.is(last, 'string')){//setHtml
				var el = Jaring.util.is(args[0], 'string') ? this : args[0];
				el.innerHTML = last;
				return el;
			} else {
				var el = last || this;
				return el.innerHTML;
			}
		},

		attr: function(){
			//TODO
		},

		prop: function(){
			//TODO
		},

		/**
		 * 移除DOM元素
		 * 
		 * 参数情况说明:
		 * 1.(element,boolean)
		 * 2.(element)
		 * 3.()
		 * 4.(boolean)
		 * 
		 * @return {[type]} [description]
		 */
		remove: Jaring.browser.msie ? function() {
			var _temp_div,_obj_array,i,l;
			return function(mix, b) {
				var el = (typeof b == 'boolean') ? mix : this,
					b = b || mix;

				if (el && el.tagName != 'BODY') {
					_obj_array = el.getElementsByTagName('OBJECT');
					l = _obj_array.length;
					for (i = 0; i < l; i++) {
						_obj_array[0].parentNode.removeChild(_obj_array[0]);
					}
					if (!b) {
						el.parentNode.removeChild(el);
						return;
					}
					_temp_div = _temp_div || document.createElement('div');
					_temp_div.appendChild(el);
					_temp_div.innerHTML = '';
				}
			}
		}() : function(element) {
			var el = element || this;
        	if (el && el.parentNode && el.tagName != 'BODY') {
        		el.parentNode.removeChild(el)
        	}
		},

		append: function(child){
			this.appendChild(child);
			return this;
		},

		appendTo: function(parent){
			parent.appendChild(this);
			return this;
		},
		
		/**
		 * 集成了各种与offset相关的方法
		 * 
		 * 传参情况说明:
		 * 1.(element, offset) 为element设置left,top值
		 * 2.(offset) 为this.element设置left,top值
		 * 3.(element) 获取element的left,top值
		 * 4.() 获取this.element的left,top值
		 * 5.(element, true) 获取element,相对于文档页面左上角的left,top值
		 * 6.(true) 获取this.element 相对于文档页面左上角的left,top值
		 * 
		 * @author junlong.yang
		 * @since 1.0.0
		 * 
		 * @param  {Mix} mix [description]
		 * @return {Element/Offset}         [description]
		 */
		offset: function () {
			var args = Array.prototype.slice.call(arguments, 0);
			var last = args[args.length - 1];
			
			if( last === true ) {

				var element = args[0] === true ? this : args[0];

				var top = 0,
					left = 0,
					el = element,
					body = document.body;

				do {
					top += el.offsetTop || 0;
					left += el.offsetLeft || 0;

					if (el.offsetParent === body &&
							Jaring.dom.css(el, 'position') === 'absolute') {
						break;
					}
					el = el.offsetParent;
				} while (el);

				el = element;

				do {
					if (el === body) {
						break;
					}

					top -= el.scrollTop || 0;
					left -= el.scrollLeft || 0;

					el = el.parentNode;
				} while (el);

				return new Jaring.maps.Offset(left, top);

			} else if(last instanceof Jaring.maps.Offset) {

				var el = (args[0] instanceof Jaring.maps.Offset) ? this : args[0];
				el.style.left = last.left + 'px';
				el.style.top  = last.top  + 'px';
				el._jaring_offset_ = last;
				return el;

			} else {

				var el = args[0] || this;
				if (el._jaring_offset_){
					return el._jaring_offset_;
				}

				return new Jaring.maps.Offset(el.style.left||0, el.style.top||0);
			}
		},

		/**
		 * 获取浏览器滚动条 偏移量
		 * 
		 * @author junlong.yang
		 * @return {Offset} [Jaring.maps.Offsets]
		 */
		scroll: function() {
			var html = document.documentElement,
				body = document.body,
				scrollLeft = 0,
				scrollTop  = 0;

			if (html && (html.scrollTop || html.scrollLeft)){
				scrollLeft = html.scrollLeft;
				scrollTop  = html.scrollTop;
			} else if (body){
				scrollLeft = body.scrollLeft;
				scrollTop  = body.scrollTop;
			}
			return new Jaring.maps.Offset(scrollLeft, scrollTop);
		},

		/**
		 * 禁用页面文本选择
		 * 
		 * @return {[type]} [description]
		 */
		disableTextSelection: function () {
			if (document.selection && document.selection.empty) {
				document.selection.empty();
			}
			if (!this._jaring_onselect_start_) {
				this._jaring_onselect_start_ = document.onselectstart;
				document.onselectstart = Jaring.falseFn;
			}
		},

		/**
		 * 启用页面文本选择
		 * 
		 * @return {[type]} [description]
		 */
		enableTextSelection: function () {
			document.onselectstart = this._jaring_onselect_start_;
			this._jaring_onselect_start_ = null;
		}
	}
})();
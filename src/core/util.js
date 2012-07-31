/**
 * util
 * 
 * @author junlong.yang
 * @version $Id$
 */
(function(Jaring){
	Jaring.util = {
		/**
		 * 通用唯一识别码 (Universally Unique Identifier)
		 * 
		 * @return {String} [一个识别串]
		 */
		uuid: function(){
			var _uuid = [],
				_stra = "0123456789ABCDEF".split('');
			for (var i = 0; i < 36; i++){
				_uuid[i] = Math.floor(Math.random() * 16);
			}
			_uuid[14] = 4;
			_uuid[19] = (_uuid[19] & 3) | 8;
			for (i = 0; i < 36; i++) {
				_uuid[i] = _stra[_uuid[i]];
			}
			_uuid[8] = _uuid[13] = _uuid[18] = _uuid[23] = '-';
			return _uuid.join('');
		},

		/**
		 * 判断对象是否为给定的类型
		 * 
		 * @return Boolean
		 */
		is: function(object, type) {
			if (!type){
				return object !== undefined;
			}

			if (type == 'array' && (object.hasOwnProperty && object instanceof Array)){
				return true;
			}

			return typeof(object) == type;
		},

		/**
		 * 单词首字母大写
		 * 
		 * @return {String} [description]
		 */
		camelCase:(function(){
			var list = {};
			return function(string){
				return list[string] || (list[string] = string.substr(0, 1).toUpperCase() + string.substr(1));
			}
		})(),

		trim: function( string ) {
			return (string||"").replace(/^\s+|\s+$/g, "");
		},

		inArray: function( b, array ) {
			for ( var i = 0, l = array.length; i < l; i++ ) {
				if ( array[i] == b ){
					return i;
				}
			}
			return -1;
		},

		/**
		 * 柯里化(currying) bind方法
		 * 
		 * @param  {Function} fn    [description]
		 * @param  {Scope}   scope [description]
		 * @return {Function} fn    [description]
		 */
		bind: function(fn, scope){
			if (2 < arguments.length) {
				var _t_args = Array.prototype.slice.call(arguments, 2);
				return function() {
					return fn.apply(scope || this, 0 < arguments.length ? _t_args.concat(Array.prototype.slice.call(arguments, 0)) : _t_args)
				};
			}
			return function() {
				return fn.apply(scope || this, arguments);
			}
		},

		each: function(object, callback, scope) {
			var n, l;

			if (!object || !this.is(callback,'function'))
				return 0;

			scope = scope || object;

			if (this.is(object, 'array')) {
				// Indexed arrays, needed for Safari
				for (n = 0, l = object.length; n < l; n++) {
					if (callback.call(scope, object[n], n, object) === false)
						return 0;
				}
			} else {
				// Hashtables
				if(object.__jaring_property_){//这是一个DOM对象
					object = object.__jaring_property_;
				}
				for (n in object) {
					if (object.hasOwnProperty(n)) {
						if (callback.call(scope, object[n], n, object) === false)
							return 0;
					}
				}
			}

			return 1;
		},

		/**
		 * 判断某元素是否在数组中，若在数组中，返回其位置索引值，否则返回 -1
		 * 
		 * @param {Array} array
		 * @param {Mixed} value
		 * @return {Number} index
		 */
		inArray: function(array, value) {
			var i, l;

			if (array) {
				for (i = 0, l = array.length; i < l; i++) {
					if (array[i] === value)
						return i;
				}
			}

			return -1;
		},
		
		trim: function(s) {
			return (s ? '' + s : '').replace(whiteSpaceReg, '');
		},

		/**
		 * 一种类继承的方法
		 * 
		 * @param  {Class} destination [description]
		 * @param  {Class} source      [description]
		 * @return {Class}             [description]
		 */
		inherit: function(destination, source) {},

		/**
		 * 简单的浅拷贝, 覆盖已经存在的属性
		 */
		extend: function(destination) {
			//支持DOM对象的扩展 2012/05/28 by junlong.yang 暂不考虑IE6/7
			if(!destination){
				return;
			}

			var args = Array.prototype.slice.call(arguments, 1),
				last = args[args.length - 1];

			if(Jaring.util.is(last, 'string')){
				if(destination[last]){
					return destination;
				}
				destination[last] = {};
				args.pop();

				for (var i = 0, l = args.length; i < l; i++) {
					var source = args[i];
					if(source && source[last]){
						source = source[last];
					}

					for(var property in source){
						var value = source[property];
						if (value !== undefined){
							destination[property] = value;
							if(destination[last]){
								destination[last][property] = value;
							}
						}
					}
				}
			} else {
				for (i = 0, l = args.length; i < l; i++) {
					var source = args[i];

					for(var property in source){
						var value = source[property];
						if (value !== undefined){
							destination[property] = value;
						}
					}
				}
			}

			return destination;
		},

		extendIf: function(destination) {
			//支持DOM对象的扩展
			if(!destination){
				return;
			}

			var args = Array.prototype.slice.call(arguments, 1),
				last = args[args.length - 1];

			if(Jaring.util.is(last, 'string')){
				if(destination[last]){
					return destination;
				}
				destination[last] = {};
				args.pop();

				for (var i = 0, l = args.length; i < l; i++) {
					var source = args[i];
					if(source && source[last]){
						source = source[last];
					}

					for(var property in source){
						var value = source[property];
						if (value !== undefined && destination[property] === undefined){
							destination[property] = value;
							if(destination[last]){
								destination[last][property] = value;
							}
						}
					}
				}
			} else {
				for (i = 0, l = args.length; i < l; i++) {
					var source = args[i];

					for(var property in source){
						var value = source[property];
						if (value !== undefined && destination[property] === undefined){
							destination[property] = value;
						}
					}
				}
			}

			return destination;
		},


		/**
		 * 创建命名空间
		 */
		namespace: function(namespace,root){
			var i, v, ns;

			ns = root || window;

			if(namespace == ''){
				return ns;
			}

			namespace = namespace.split('.');
			for (i=0; i<namespace.length; i++) {
				v = namespace[i];

				if (!ns[v]){
					ns[v] = {};
				}

				ns = ns[v];
			}

			return ns;
		},
		
		/**
		 * 创建一个类
		 */
		createClass: function(name,body,root){
			var part, namespace, classname, extendclass, construct, haveConstruct = false;
			
			part = /^((static) )?([\w.]+)( extends ([\w.]+))?/.exec(name);
			
			//classname 类名称
			classname = part[3].match(/(^|\.)(\w+)$/i)[2];
			
			//类命名空间
			namespace = part[3].replace(/\.\w+$/, '');
			
			namespace = classname == namespace?'':namespace;
			
			namespace = this.namespace(namespace,root);
			
			//若在给定命名空间下的类已经存在，则返回
			if(namespace[classname]){
				return;
			}
			
			//静态类，对象字面量
			if (part[2] == 'static') {
				namespace[classname] = body;
				
				return;
			}
			
			// Create default constructor
			if (!body[classname]) {
				body[classname] = Jaring.emptyFn;//默认空的构造方法(函数)
				haveConstruct = true;
			}
			
			//在给定命名空间下创建类/构造函数
			namespace[classname] = function(){
				this.__uuid = Jaring.uuid();
				body[classname].apply(this, arguments);
			};
			this.extend(namespace[classname].prototype, body);
			//extends
			extendclass = part[5];
			if (extendclass) {
				superprototype = this.resolve(extendclass).prototype;
				superclassname = extendclass.match(/\.(\w+)$/i)[1];
				
				construct = namespace[classname];
				
				if (haveConstruct) {
					// Add passthrough constructor
					namespace[classname] = function() {
						return superprototype[superclassname].apply(this, arguments);
					};
				} else {
					// Add inherit constructor
					namespace[classname] = function() {
						this.parent = superprototype[superclassname];
						return construct.apply(this, arguments);
					};
				}
				//起什么作用了?
				namespace[classname].prototype[classname] = namespace[classname];
				namespace[classname].prototype.toString = function(){
					return classname;
				};
				// Add super methods
				this.each(superprototype, function(fn, name) {
					if(name != superclassname){
						namespace[classname].prototype[name] = fn;
					}
				});
				
				// Add overridden methods
				this.each(body, function(fn, name) {
					// Extend methods if needed
					if (superprototype[name]) {
						namespace[classname].prototype[name] = function() {
							this.parent = superprototype[name];
							return fn.apply(this, arguments);
						};
					} else {
						if (name != classname){
							namespace[classname].prototype[name] = fn;
						}
					}
				});
			}

			namespace[classname].prototype.toString = function(){
				return classname;
			};
			
			// 添加类静态方法
			this.each(body['static'], function(f, n) {
				namespace[classname][n] = f;
			});
		},
		
		resolve: function(Class, root) {
			var i, l, n, o;

			o = root || window;

			n = Class.split('.');

			for (i = 0, l = n.length; i < l; i++) {
				o = o[n[i]];

				if (!o){
					throw new Error('类{'+Class+'}未定义');
					break;
				}
					
			}

			return o;
		},
	}

	//Jaring.util.createClass方法别名
	Jaring.create = Jaring.util.bind(Jaring.util.createClass, Jaring.util);
	Jaring.uuid = Jaring.guid = Jaring.util.uuid;
})(Jaring);
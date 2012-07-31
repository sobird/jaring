/**
 * 这是来自谷歌的事件处理机制, 纯粹借鉴参考, 你懂的！
 * 该时间机制包括了DOM原生事件以及自定义事件，自己做了一些改进
 * 
 * @author junlong.yang
 * @version $Id$
 */
(function(){
	Jaring.event = {
		/**
		 * 跨浏览器事件处理程序注册。
		 * 可以通过调用该函数所返回句柄的 eventRemoveListener(handle) 来删除此监听器。
		 * 
		 * @param {Object} instance  [description]
		 * @param {String} eventName [description]
		 * @param {Function} handler   [description]
		 * @param {Boolean} capture   [description]
		 * @return {Undefined} [description]
		 */
		addDomListener: function(instance, eventName, handler, capture){
			var listener = null;
			var _filterEvent = function(event) {
				return handler.call(this, new Jaring.event.Event(event || window.event));
			};
			if (instance.addEventListener) {
				var type = capture ? 4 : 1;
				instance.addEventListener(eventName, _filterEvent, capture);
				listener = new EventListener(instance, eventName, _filterEvent, type);
			} else if (instance.attachEvent) {
				listener = new EventListener(instance, eventName, _filterEvent, 2);
				instance.attachEvent('on' + eventName, fixListener(listener));
			} else {
				instance['on' + eventName] = handler;
				listener = new EventListener(instance, eventName, _filterEvent, 3);
			}
			return listener;
		},

		/**
		 * 将在第一个事件之后删除侦听器的 addDomListener 周围的包装。
		 * 
		 * @param {[Object]} instance  [description]
		 * @param {[String]} eventName [description]
		 * @param {[Function]} handler   [description]
		 * @param {[Boolean]} capture   [description]
		 * @return {Undefined} [description]
		 */
		addDomListenerOnce: function(instance, eventName, handler, capture){
			var listener = this.addDomListener(instance, eventName, function(){
				listener.remove();
				handler.apply(instance, arguments);
			}, capture);
			return listener;
		},

		/**
		 * 将指定侦听器函数添加到指定对象实例的指定事件名称。
		 * 返回监听器的标识符，该标识符可与 removeListener() 配合使用。
		 * 
		 * @param {[Object]} instance  [description]
		 * @param {[String]} eventName [description]
		 * @param {[Function]} handler   [description]
		 * @return {Undefined} [description]
		 */
		addListener: function(instance, eventName, handler){
			return new EventListener(instance, eventName, handler, 0);
		},

		/**
		 * 将指定侦听器函数添加到指定对象实例的指定事件名称。
		 * 返回监听器的标识符，该标识符可与 removeListener() 配合使用。
		 * 
		 * @param {[Object]} instance  [description]
		 * @param {[String]} eventName [description]
		 * @param {[Function]} handler   [description]
		 * @return {Undefined} [description]
		 */
		addListenerOnce: function(instance, eventName, handler){
			var listener = this.addListener(instance, eventName, function(){
				listener.remove();
				handler.apply(instance, arguments);
			});
			return listener;
		},

		/**
		 * 对于指定实例，删除其所有事件的所有侦听器。
		 * 
		 * @param  {[Object]} instance [description]
		 * @return {[Undefined]}          [description]
		 */
		clearInstanceListeners: function(instance){
			var _eventList = getEventList(instance);
			for (var _uid in _eventList) {
				_eventList[_uid] && _eventList[_uid].remove();
			}
		},

		/**
		 * 对于指定实例，删除其指定事件的所有侦听器。
		 * 
		 * @param  {[Object]} instance  [description]
		 * @param  {[String]} eventName [description]
		 * @return {[Undefined]}           [description]
		 */
		clearListeners:function(instance, eventName){
			var _eventList = getEventList(instance, eventName);
			for (var _uid in _eventList) {
				_eventList[_uid] && _eventList[_uid].remove();
			}
		},

		/**
		 * 删除应由上述 addListener 返回的指定监听器。
		 * 
		 * @param  {[EventListener]} listener [description]
		 * @return {[Undefined]}          [description]
		 */
		removeListener: function(listener){
			listener.remove();
		},

		/**
		 * 触发指定事件。eventName 后的所有参数都以参数的形式传递到侦听器。
		 * 
		 * @param  {Object} instance  [description]
		 * @param  {String} eventName [description]
		 * @param  {*} event  [description]
		 * @return {Undefined           [description]
		 */
		trigger: function(instance, eventName, event){
			if(event instanceof Jaring.event.Event){
				event.type = eventName;
			}
			var _events = instance.__events_;
			if(_events && _events[eventName]) {
				var _args = Array.prototype.slice.call(arguments, 2),
				_eventList = getEventList(instance, eventName);

				for(var _uid in _eventList){
					var _event = _eventList[_uid];
					_event &&　_event.handler.apply(_event.target, _args);
				}
			}


		},

		bind: function(instance, eventName, handler, scope){
			return this.addListener(instance, eventName,Jaring.util.bind(handler, scope));
		},

		forward: function(instance, eventName, otherInstance){
			return this.addListener(instance, eventName,(function(eventName, otherInstance){
				return function() {
					var _args = [otherInstance, eventName];
					for (var l = arguments ? arguments.length : 0, i = 0; i < l; ++i) {
						_args.push(arguments[i]);
					}
					EventUtil.trigger.apply(this, _args);
				}
			})(eventName, otherInstance));
		}
	};

	// --- private member ---
	var eventListenerIdIndex = 0;

	var fixListener = function(listener){
		return listener.bindHandler = function(event){
			event = event || window.event;
			if(event && event.target) try {
				event.target = event.srcElement;
			} catch (e) {}

			var returnValue = listener.handler.apply(listener.target, [event]);
			if(event && 'click' == event.type){
				var target = event.srcElement;
				if(target && target.tagName === 'A' && target.href === 'javascript:void(0)') {
					return false;
				}
			}
			return returnValue;
		}
	}
	var getEventList = function(instance, eventName) {
		if (eventName) {
			instance.__events_ || (instance.__events_ = {});
			var _events = instance.__events_;
			_events[eventName] || (_events[eventName] = {});
			return _events[eventName];
		} else {
			var _eventList, _events = instance.__events_ || {};
			_eventList = {};
			for (var _eventName in _events) {
				for (var _uid in _events[_eventName]) {
					_eventList[_uid] = _events[_eventName][_uid];
				}
			}
			return _eventList
		}
	}


	/**
	 * 事件监听器 类
	 * EventListener Class
	 * This class is opaque. 
	 * It has no methods and no constructor. 
	 * Its instances are returned from addListener(), addDomListener() and are eventually passed back to removeListener().
	 * 
	 * @param {[type]} target    [description]
	 * @param {[type]} eventName [description]
	 * @param {[type]} handler   [description]
	 * @param {[type]} type      [description]
	 */
	var EventListener = function(target, eventName, handler, type){
		this.target = target;
		this.eventName = eventName;
		this.handler = handler;
		this.type = type;
		this.bindHandler = null;
		this.id = eventListenerIdIndex++;
		getEventList(target, eventName)[this.id] = this;
		target = null;
	}
	EventListener.prototype.remove = function() {
		if (this.target) {
			switch (this.type) {
				case 1:
					this.target.removeEventListener(this.eventName, this.handler, false);
					break;
                case 4:
					this.target.removeEventListener(this.eventName, this.handler, true);
					break;
                case 2:
					this.target.detachEvent('on' + this.eventName, this.bindHandler);
					break;
                case 3:
					this.target['on' + this.eventName] = null;
					break;
			}
			delete getEventList(this.target, this.eventName)[this.id];
			this.handler = this.target = this.bindHandler = null;
		}
	}
})();


/**
 * 事件类标准化封装
 * 
 * @author junlong.yang CrossYou2009@gmail.com
 * @version $Id$
 */

(function(){
	Jaring.create('Jaring.event.Event', {
		/**
		 * 地图事件类, 让事件看起来更符合 W3C 标准
		 * 
		 * @author junlong.yang
		 * @since 1.0.0
		 * @param {[type]} type [description]
		 */
		Event: function(event){
			var event = event || window.event;
			this.originalEvent = event;
			Jaring.util.extendIf(this, event);

			//事件属性 兼容 ~~
			this.ctrlKey = event.ctrlKey || event.metaKey;

			if (typeof(event.button) !== "undefined") {
				var MOUSE_BUTTON = Jaring.constant.MOUSE_BUTTON;
				this.button = (typeof(event.which) !== "undefined") ? event.button: (event.button === 4) ? MOUSE_BUTTON.middle: (event.button === 2) ? MOUSE_BUTTON.right: MOUSE_BUTTON.left;
			}

			if (event.type === "keypress"){
				this.charCode = event.charCode || event.keyCode || 0;
			} else if (event.keyCode && (event.keyCode === 46)){
				this.keyCode = 127;
			}

			this.domType = this.type;

			this.domTarget = this.trigger = this.target = this.resolveTextNode(event.target || event.srcElement);
			
			this.pageX = this.x();
			this.pageY = this.y();

			//this.point = new Jaring.maps.Point(this.pageX, this.pageY);

			if (event.type == "DOMMouseScroll") {
				this.type = "mousewheel";
				this.wheelDelta = this.getWheelDelta() * 24;
			}
		},

		/**
		 * 获取鼠标事件触发时的X坐标值,单位:像素
		 * 
		 * 传参情况说明:
		 * 1.(event)
		 * 2.()
		 * 
		 * @param  {event/none} event/none [鼠标事件]
		 * @return {Number} x [X像素坐标值]
		 */
		x: function(event){
			var event = event ? (event.originalEvent || event) : this.originalEvent;
				
			return event.pageX ? (event.pageX || 0) : (event.clientX || 0) + Jaring.dom.scroll().left;
		},

		/**
		 * 类似 x()
		 * 
		 * @param  {[type]} event [description]
		 * @return {[type]}       [description]
		 */
		y: function(event){
			var event = event ? (event.originalEvent || event) : this.originalEvent;
				
			return event.pageY ? (event.pageY || 0) : (event.clientY || 0) + Jaring.dom.scroll().top;
		},

		/**
		 * 阻止/停止 事件冒泡
		 * 可以阻止原生事件(window.event), 以及封装的事件(Jaring.event.Event)
		 * 
		 * @author junlong.yang
		 * @since 1.0.0
		 * @param  {Event} event [可选]
		 * @return {Jaring.event.Event}       [description]
		 */
		stopPropagation: function(event){
			var event = event ? (event.originalEvent || event) : this.originalEvent;
			if (event.stopPropagation) {
				event.stopPropagation();
			} else {
				event.cancelBubble = true;
			}
			return this;
		},

		/**
		 * 阻止浏览器默认行为
		 * 
		 * @param  {[type]} event [description]
		 * @return {[type]}       [description]
		 */
		preventDefault: function(event){
			var event = event ? (event.originalEvent || event) : this.originalEvent;
			if (event.preventDefault) {
				event.preventDefault();
			} else {
				event.returnValue = false;
			}
			return this;
		},

		/**
		 * 阻止事件
		 * 包括阻止浏览器默认行为, 阻止事件冒泡
		 * 
		 * @param  {[type]} event [description]
		 * @return {[type]}       [description]
		 */
		stop: function(event){
			var event = event ? (event.originalEvent || event) : this.originalEvent;
			return this.preventDefault().stopPropagation();
		},

		/**
		 * 获取鼠标滚轮值
		 * 
		 * @param  {[type]} event [description]
		 * @return {[type]}       [description]
		 */
		getWheelDelta: function(event){
			var event = event ? (event.originalEvent || event) : this.originalEvent;
			var delta = 0;
			if (event.wheelDelta) {
				delta = event.wheelDelta / 120;
			}
			if (event.detail) {
				delta = -event.detail / 3;
			}
			return delta;
		},

		resolveTextNode: function(target) {
			try {
				return target && !target.tagName ? target.parentNode: target;
			} catch(e) {
				return null;
			}
		},

		getRelatedTarget: function(event) {
			var event = event ? (event.originalEvent || event) : this.originalEvent;
			var relatedTarget = event.relatedTarget;

			if (!relatedTarget){
				if (event.type == "mouseout"){
					relatedTarget = event.toElement;
				} else if (event.type == "mouseover"){
					relatedTarget = event.fromElement;
				} else if (event.type == "blur"){
					relatedTarget = document.elementFromPoint(this.x, this.y);
				}
			}
			return this.resolveTextNode(target)
		},

		/**
		 * 吞掉一些属性,消化成自己的属性
		 * swallow then digest
		 * 
		 * @param  {[type]} event [description]
		 * @return {[type]}       [description]
		 */
		swallow: function(event){
			Jaring.util.extendIf(this, event);

			//drain
			return this;
		}
	});
})();
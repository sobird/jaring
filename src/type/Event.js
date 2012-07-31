/**
 * DOM事件类标准化封装
 * 
 * @author junlong.yang
 * @version $Id$
 */

(function(){
	Jaring.create('Jaring.type.Event', {
		/**
		 * 事件类, 让事件看起来更符合 W3C 标准
		 * 
		 * @author junlong.yang
		 * @since 1.0.0
		 * @param {Event} event [description]
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
		 * @param  {Event} event [description]
		 * @return {Event}       [description]
		 */
		swallow: function(event){
			Jaring.util.extendIf(this, event);

			//drain
			return this;
		}
	});
})();
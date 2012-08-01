/**
 * DOM元素 通用拖放 类
 */
(function() {
	Jaring.create('Jaring.Draggable extends Jaring.Observable', {
		Draggable: function(dragElement, dragTarget) {
			this.dragElement = Jaring.dom.get(dragElement);
			this.dragTarget = Jaring.dom.get(dragTarget);
		},

		/**
		 * 启用鼠标拖放功能
		 * 
		 * @return {Jaring.Draggable} draggable [description]
		 */
		enable: function() {
			if (this.enabled) {
				//如果已经启用了, 则返回
				return;
			}

			//给要拖动的DOM对象添加 mousedown 事件
			this.dragTarget.on('mousedown', Jaring.util.bind(onMouseDown, this));
			this.enabled = true;
		},

		/**
		 * 禁用鼠标拖放功能
		 * 
		 * @return {[type]} [description]
		 */
		disable: function() {
			if (!this.enabled) {
				//如果未启用, 则返回
				return;
			}
			this.dragTarget.un();
			this.enabled = false;
			this.moved = false;
		}
	});

	// -- private member --
	/**
	 * 鼠标按下 事件处理程序
	 * 
	 * @access private
	 * @param  {Jaring.type.Event} event [description]
	 * @return {None}   [description]
	 */
	var onMouseDown = function(event) {

		//阻止浏览器默认行为
		event.preventDefault();

		this.moved = false;
		if (this.moving) {
			return;
		}

		this._startOffset = this._lastOffset = this.dragElement.offset();
		this._startPoint = new Jaring.type.Point(event.pageX, event.pageY);


		//给document添加 mousemove 和 mouseup 事件处理程序
		this.dragingListener = Jaring.dom.on(document, 'mousemove', Jaring.util.bind(onMouseMove, this));
		this.dragendListener = Jaring.dom.on(document, 'mouseup',   Jaring.util.bind(onMouseUp,   this));
	};

	var onMouseMove = function(event) {
		
		//阻止浏览器默认行为
		event.preventDefault();

		if (!this.moved) {
			this.fire('dragstart', event);
			this.moved = true;
		}
		this.moving = true;

		var deltaOffset = new Jaring.type.Point(event.pageX, event.pageY).subtract(this._startPoint).toOffset();

		this._lastOffset = this._startOffset.plus(deltaOffset);

		this.dragElement.offset(this._lastOffset);
	};

	var onMouseUp = function(event) {

		Jaring.dom.un(this.dragingListener);
		Jaring.dom.un(this.dragendListener);

		this.dragingListener = null;
		this.dragendListener = null;

		if (this.moved) {
			this.fire('dragend', event);
		}
		this.moving = false;
	};
})();
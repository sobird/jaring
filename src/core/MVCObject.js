/**
 * 来自谷歌(Google)的一个MVCObject类
 *
 * @author junlong.yang
 * @extends {Jaring.Observable}
 * @version $Id$
 */
(function(){
	Jaring.create('Jaring.MVCObject extends Jaring.Observable',{
		/**
		 * MVCObject 获取值
		 * 
		 * @param {String} str
		 * @return {*}
		 */
		get : function(key) {
			var _accessor = getAccessors(this)[key];
			if (_accessor) {
				var _targetKey = _accessor.targetKey,
				_target = _accessor.target,
				_getterName = "get" + camelCase(_targetKey);
				return _target[_getterName] ? _target[_getterName]() : _target.get(_targetKey);
			} else {
				return this[key];
			}
		},
		
		/**
		 * MVCObject 设置值
		 * 
		 * @param {String} str
		 * @param {*} value
		 */
		set : function(key, value) {
			var _accessors = getAccessors(this);
			if (_accessors.hasOwnProperty(key)) {
				var _accessor = _accessors[key],
				_targetKey = _accessor.targetKey,
				_target = _accessor.target,
				_setterName = "set" + camelCase(_targetKey);
				if (_target[_setterName]){
					_target[_setterName](value);
				}else{
					_target.set(_targetKey, value);
				}
			} else {
				var oldValue = this[key];
				if(oldValue !== value){
					this[key] = value;
					triggerChanged(this, key, oldValue);
				}
			}
			
		},
		
		/**
		 * 通知所有观察者此属性有所改变。这会通知绑定到对象属性的对象以及绑定到的对象。
		 * 
		 * @param {String} key
		 */
		notify : function(key) {
			var _accessors = getAccessors(this);
			if(_accessors.hasOwnProperty(key)){
				var _accessor = _accessors[key];
				_accessor.target.notify(_accessor.targetKey);
			}else{
				triggerChanged(this, key);
			}
		},
		
		/**
		 * 设置键值对集合
		 * 
		 * @param {Object|undefined} keyValues
		 * @return {None}
		 */
		setValues : function(keyValues) {
			for (var key in keyValues) {
				var _value = keyValues[key],
				_setterName = "set" + camelCase(key);
				this[_setterName] ? this[_setterName](_value) : this.set(key, _value);
			}
		},
		
		/**
		 * 将视图绑定到模型
		 * 
		 * @param {String} key
		 * @param {MVCObject} target
		 * @param {String} targetKey
		 * @param {Boolean} noNotify
		 */
		bindTo : function(key, target, targetKey, noNotify) {
			var targetKey = targetKey || key,
			_self = this,
			eventName = targetKey.toLowerCase() + "changed",
			handler = function() {
				triggerChanged(_self, key);
			};
			_self.unbind(key);
			//绑定外部监听器
			getBindings(_self)[key] = this.on(target, eventName,handler);
			setAccessor(_self, key, target, targetKey, noNotify);
		},
		
		/**
		 * 删除绑定。取消绑定会将未绑定属性设置为当前值。将不会通知该对象，因为值尚未更改。
		 * 
		 * @param {String} key
		 */
		unbind : function(key) {
			var _listener = getBindings(this)[key];
			 if (_listener) {
				 delete getBindings(this)[key];
				 //移除外部绑定的监听器
				 this.un(_listener);
				 var _value = this.get(key);
				 delete getAccessors(this)[key];
				 this[key] = _value;
			 }
		},
		
		/**
		 * 删除所有绑定
		 */
		unbindAll : function() {
			var _keys = [];
			var _listeners = getBindings(this);
			for (var key in _listeners) {
				_keys.push(key);
			}
			if(_keys){
				var _self = this;
				for (var i = 0, len = _keys.length; i < len; ++i){
					(function() {
						return _self.unbind.apply(_self || this, arguments);
					})(_keys[i], i);
				}
			}
		},
		
		changed : function(key){}
	});

	function getAccessors(mvcobj) {
		mvcobj.__jar_accessors_ || (mvcobj.__jar_accessors_ = {});
		return mvcobj.__jar_accessors_;
	}

	function setAccessor(mvcObject, key, target, targetKey, noNotify) {
		getAccessors(mvcObject)[key] = {
			'target': target,
			'targetKey': targetKey
		};
		noNotify || triggerChanged(mvcObject, key);
	}

	function getBindings(mvcobj) {
		mvcobj.__jar_bindings_ || (mvcobj.__jar_bindings_ = {});
		return mvcobj.__jar_bindings_
	}
	
	/**
	 * MVCObject 事件触发
	 * junlong.yang at 2012/05/23 修改更新
	 * 为事件句柄 传递 changeEvent 参数
	 * 
	 * @param  {[type]} mvcObj   [description]
	 * @param  {[type]} key      [description]
	 * @param  {[type]} oldValue [description]
	 * @return {[type]}          [description]
	 */
	function triggerChanged(mvcObj, key, oldValue) {
		var onKeyChanged = 'on' + camelCase(key) + "Changed";

		var changeEvent = {
			key: key,
			type: key.toLowerCase() + "changed",
			oldValue: oldValue,
			newValue: mvcObj[key]
		}

		if (mvcObj[onKeyChanged]){
			mvcObj[onKeyChanged](changeEvent);
		}else{
			mvcObj['changed'](key, changeEvent);
		}

		//触发外部注册的观察者 
		mvcObj.fire(key.toLowerCase() + "changed",changeEvent);//触发事件
	}
})();
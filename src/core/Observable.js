/**
 * Jaring 框架顶层事件机制模型封装
 * 该事件模型借用了Google的事件模型
 *
 * @see  /core/event.js
 * 
 * 对Google的事件模型进行了一个简单的封装
 * 
 * @author junlong.yang
 * @version $Id$
 */
(function(){
	Jaring.create('Jaring.Observable',{
		on: function(eventName, handler){
			return Jaring.event.addListener(this, eventName, handler);
		},

		un: function(listener){
			return Jaring.event.removeListener(listener);
		},

		once: function(){
			return Jaring.event.addListenerOnce(this, eventName, handler);
		},

		fire: function(eventName){
			var args = Array.prototype.slice.call(arguments, 0);
			args.unshift(this);
			return Jaring.event.trigger.apply(Jaring.event, args);
		},

		bind: function(eventName, handler, scope){
			return Jaring.event.bind(this, eventName, handler, scope);
		},
		
		clear: function(eventName){
			if(eventName){
				Jaring.event.clearListeners(this, eventName);
			} else {
				Jaring.event.clearInstanceListeners(this);
			}
			
		}
	});
})();
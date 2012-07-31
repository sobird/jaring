/**
 * 浏览器检测~~
 *
 * @author junlong.yang
 * @version $Id$
 */
(function() {
	var na = navigator,
		ua = na.userAgent;

	Jaring.browser = {
		strict: document.compatMode == "CSS1Compat",
		
		/**
		 * Constant that is true if the browser is Opera.
		 *
		 * @property opera
		 * @type Boolean
		 * @final
		 */
		opera: window.opera && opera.buildNumber,

		/**
		 * Constant that is true if the browser is WebKit (Safari/Chrome).
		 *
		 * @property webkit
		 * @type Boolean
		 * @final
		 */
		webkit: /WebKit/.test(ua),

		/**
		 * Constant that is true if the browser is IE.
		 *
		 * @property msie
		 * @type Boolean
		 * @final
		 */
		msie: !this.webkit && !this.opera && (/MSIE/gi).test(ua) && (/Explorer/gi).test(na.appName),

		/**
		 * Constant that is true if the browser is IE 6 or older.
		 *
		 * @property msie6
		 * @type Boolean
		 * @final
		 */
		msie6: this.msie && /MSIE [56]/.test(ua),

		/**
		 * Constant that is true if the browser is Gecko.
		 *
		 * @property gecko
		 * @type Boolean
		 * @final
		 */
		gecko: !this.webkit && /Gecko/.test(ua),

		/**
		 * Constant that is true if the os is Mac OS.
		 *
		 * @property mac
		 * @type Boolean
		 * @final
		 */
		mac: ua.indexOf('Mac') != -1,

		/**
		 * Constant that is true if the runtime is Adobe Air.
		 *
		 * @property air
		 * @type Boolean
		 * @final
		 */
		air: /adobeair/i.test(ua),

		/**
		 * Constant that tells if the current browser is an iPhone or iPad.
		 *
		 * @property idevice
		 * @type Boolean
		 * @final
		 */
		idevice: /(iPad|iPhone)/.test(ua),

		/**
		 * Constant that tells if the current browser is an android.
		 * 
		 * @type {Boolean}
		 * @final
		 */
		android: ua.indexOf("android") !== -1,

		/**
		 * Constant that tells if the current browser is an touch device.
		 * 
		 * @return {[type]} [description]
		 */
		touch: (function () {
			var touchSupported = false,
				startName = 'ontouchstart';

			// WebKit, etc
			if (startName in document.documentElement) {
				return true;
			}

			// Firefox/Gecko
			var e = document.createElement('div');

			// If no support for basic event stuff, unlikely to have touch support
			if (!e.setAttribute || !e.removeAttribute) {
				return false;
			}

			e.setAttribute(startName, 'return;');
			if (typeof e[startName] === 'function') {
				touchSupported = true;
			}

			e.removeAttribute(startName);
			e = null;

			return touchSupported;
		}())
	}
})();
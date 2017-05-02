// JavaScript Document
;
(function(factory) {
	if (typeof define === 'function' && define.amd) { // AMD
		// you may need to change `define([------>'jquery'<------], factory)`
		// if you use zepto, change it rely name, such as `define(['zepto'], factory)`
		define(factory)
			// define(['zepto'], factory)
	} else { // Global
		factory()
	}
})
(function() {
	
	// 字体控制
	function setFontsize() {
	    document.querySelector('html').style.fontSize = (document.body.clientWidth / 375 * 100 + 'px');
	}

	setFontsize();

	window.onresize = function() {
	    setFontsize();
	}

})
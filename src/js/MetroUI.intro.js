function capitaliseFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

(function() {
	"use strict",
	window.MetroUI = function(params) {
		$.ajaxSetup({ cache: false });
	
		var app = this;
	
		app.version = "1.0 Developer Preview 2";
	
		app.params = {
			/* Themes */
			theming: true,
			showCustomThemes: false,
			availThemes: ["lime","green","emerald","teal","cyan","cobalt","indigo","violet","pink","magenta","crimson","red","orange","amber","yellow","brown","olive","steel","mauve","taupe"],
			customThemes: ['lambda'],
			/* Setup */
			initFastClick: true,
			optimizeIpad: true,
			preventDefault: false,
			pushHomeToHistory: true,
			/* Window Size Limit */
			windowSizeLimit: 768,
			/* Bars */
			barsRightClick: true,
			barsOnOpen: 'both',
			closeBarsOnIconClick: false,
			/* Select */
			select: true,
			/* Switch */
			switchDynamics: true,
			/* Modals */
			modalTitle: "MetroUI",
			modalOkTitle: "ok",
			modalCancelTitle: "cancel",
			promptPlaceholder: "Enter text",
			userPlaceholder: "Username",
			passPlaceholder: "Password",
			/* Notifications */
			notifyAnimTimeout: 300,
			notifyIgnoreAnimTimeout: function() { return ((window.innerWidth > this.windowSizeLimit)) ? 5000 : 300},
			notifyDuration: 5000,
			/* Pages */
			pageTransitions: true,
			pageTransitionInOnStart: true,
			pageCreateScroll: false,
			/* Default iScroll Configuration */
			scrollX: true,
			scrollY: false,
			mouseWheel: true,
			disableMouse: true,
			scrollbars: 'custom',
			interactiveScrollbars: true,
			fadeScrollbars: true,
			shrinkScrollbars: 'clip',
			eventPassthrough: true,
			/* Hidden Parameters, not for use in Production */
			barsOpen: false,
			contextOpen: false,
			showsNotification: false,
		};
	
		for (var param in params) {
			app.params[param] = params[param];
		}
	
		// INTERNAL CONFIGURATION //
		app.touchEventStart = (('ontouchend' in window)) ? 'touchstart' : 'mousedown';
		app.touchEventEnd = (('ontouchend' in window)) ? 'touchend' : 'mouseup';
	
		app.switches = {
			selfWidth: ((window.innerWidth > app.params.windowSizeLimit)) ? 50 : 60,
			selfBorder: 0,
			handleWidth: 13,
			handleBorder: 0,
			width: function() { return this.selfWidth - this.handleWidth + this.selfBorder - (this.handleBorder*2); },
			mouseDown: false,
			click: false,
			x: 0,
			deltaX: 0
		};
	
		app.grid = {
			scroll: 0,
			lastScroll: 0
		};
	
		app.timeouts = [];
		app.history = [];
	
		app.clearTimeouts = function(timeout) {
			for (var i=0; i<timeout.length; i++) {
				clearTimeout(timeout[i]);
			}
		};
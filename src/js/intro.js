/*
 * MetroUI 2.1.1
 * CSS definitions to create Metro (Windows Phone 8) UI Elements in HTML
 *
 * Copyright 2015, SniperGER
 * Janik Schmidt (SniperGER)
 *
 * Licensed under GNU GPLv2
*/

var $ = function(query) { if (document.querySelector(query)) return document.querySelector(query); };
var $$ = function(query) { if (document.querySelectorAll(query)) return document.querySelectorAll(query); };

(function() {
	"use strict";
	window.MetroUI = function(params) {
		var app = this;

		app.version = "2.1.1";
		app.build = parseInt("{{app.buildNumber}}")+1;
		app.buildDate = "{{app.buildDate}}";

		app.params = {
			useLegacyInit: false,
			splashScreenDelay: 1500,
			availableThemesWin: ["dark-gray","light-gray","dark-red","red","orange","yellow","bright-yellow","bright-green","green","dark-green","darker-green","dark-lime","dark-teal","light-teal","cyan","dark-cyan","darker-cyan","very-dark-cyan","very-dark-purple","darker-purple","dark-purple","purple","darker-pink","dark-pink","pink"],
			availableThemesPhone: ["lime","green","emerald","teal","cyan","cobalt","indigo","violet","pink","magenta","crimson","red","orange","amber","yellow","brown","olive","steel","mauve","taupe","lumia-green","lumia-purple"],
			alertConfirmButton: "ok",
			alertCancelButton: "cancel",
			modalDefaultTitle: "Untitled",
			modalDefaultContent: "No content",
			theming: true,
			lists: true,
			switches: true,
			radios: true,
			checkbox: true,
			progress: true,
			notificationTransitions: true,
/*
			pageLoading: true,
			pageTransitions: true,
			pageTransitionMode: 3,
			mobileWidthLimit: 504,
*/
			phoneWidth: 504,
			tabletWidth: 960,
/*
			menuPageWidthLimit: 1024,
			barsOnContext: true,
			customKeyboard: true,
			kbLanguage: navigator.language,
*/
		};
		for (var param in params) {
			app.params[param] = params[param];
		}

		app.previousTheme = "";

		app.listOpen = false;
		app.contextOpen = false;
		app.appBarOpen = false;

		app.activeInput = undefined;

		app.history = [];
		app.menuHistory = [];
		app.activePage = undefined;

		app.views = [];
		app.viewNames = [];

		app.notificationTimeouts = [];
		app.notificationRemoveTimeouts = [];
		app.progressIntervals = [];

		app.touchEventStart = (('ontouchend' in window)) ? 'touchstart' : 'mousedown';
		app.touchEventEnd = (('ontouchend' in window)) ? 'ontouchend' : 'onclick';
		app.touchMove = (('ontouchend' in window)) ? 'touchmove' : 'scroll';

		app.plugins = {};

		window.isPhone = (window.innerWidth <= app.params.phoneWidth) ? true : false;
		window.isTablet = (window.innerWidth <= app.params.tabletWidth && window.innerWidth > app.params.phoneWidth) ? true : false;
		window.isDesktop = (window.innerWidth > app.params.tabletWidth) ? true : false;
		
		app.pageCallbacks = {};
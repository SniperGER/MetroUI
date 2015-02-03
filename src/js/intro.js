/*
 * MetroUI 2.1
 * CSS definitions to create Metro (Windows Phone 8) UI Elements in HTML
 *
 * Copyright 2015, SniperGER
 * Janik Schmidt (SniperGER)
 *
 * Licensed under GNU GPLv2
*/

(function() {
		"use strict";
		window.MetroUI = function(params) {
				var app = this;

		app.version = "2.1 (2B248d)";

		app.params = {
			availableThemesWin: ["dark-gray","light-gray","dark-red","red","orange","yellow","bright-yellow","bright-green","green","dark-green","darker-green","dark-lime","dark-teal","light-teal","cyan","dark-cyan","darker-cyan","very-dark-cyan","very-dark-purple","darker-purple","dark-purple","purple","darker-pink","dark-pink","pink"],
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
			pageLoading: true,
			pageTransitions: true,
			pageTransitionMode: 3,
			notificationTransitions: true,
			menuPageWidthLimit: 1024,
			barsOnContext: true,
		};
		for (var param in params) {
			app.params[param] = params[param];
		}

		app.previousTheme = "";

		app.listOpen = false;
		app.contextOpen = false;
		app.appBarOpen = false;

		app.history = [];
		app.menuHistory = [];
		app.menuPageHistory = [];
		
		app.notificationTimeouts = [];
		app.progressIntervals = [];

		app.touchEventStart = (('ontouchend' in window)) ? 'touchstart' : 'mousedown';
		app.touchEventEnd = (('ontouchend' in window)) ? 'touchend' : 'click';

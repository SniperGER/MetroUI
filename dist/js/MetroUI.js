/*
 * MetroUI 2.0.0
 * CSS definitions to create Metro (Windows Phone 8) UI Elements in HTML
 *
 * Copyright 2014, SniperGER
 * Janik Schmidt (SniperGER)
 *
 * Licensed under GNU GPLv2
 *
 * Built: October 14 2014, 9:45:35 PM
*/

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
		/* Application Initialization */

		app.init = function() {
			/* Init FastClick */
			if (app.params.initFastClick) {
				window.addEventListener('load', function() {
					FastClick.attach(document.body);
				}, false);
			}

			/* Add iPad Classes */
			if (app.params.optimizeIpad) {
				if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i) && navigator.userAgent.match(/Mobile/) && navigator.userAgent.match(/Safari/)) {
					$('html').addClass('ipad ios7');
				}
			}

			/* Prevent Scrolling on touch devices */
			if (app.params.preventDefault) {
				$('body').on('touchmove',function(e) {
					e.preventDefault();
				});
			}

			/* Add current URL to Navigation History */
			if (app.params.pushHomeToHistory) {
				app.history.push(window.location.href);
			}

			/* Open Bars on Right click */
			if (app.params.barsRightClick) {
				$(document).on("contextmenu", function() {
					switch (app.params.barsOnOpen) {
						case ("appBar"): app.toggleAppbar(); break;
						case ("navBar"): app.toggleNavbar(); break;
						case ("both"): app.toggleBars(); break;
						default: console.error("MetroUIError: (AppBar) '"+app.params.barsOnOpen+"' is not a valid AppBar type."); break;
					}
					return false;
				});
			}
			$(window).scroll(function() {
			    var scrollloaction = $(document).scrollTop();   
			    var vanishingpoint = scrollloaction + window.innerHeight / 2;
			    $("div.pages").css('-webkit-perspective-origin', ' 50% ' + vanishingpoint + 'px');
			});

			/* Click Document to close Select/Bars/Context Menus */
			$(document).on("click", function() {
				if (app.params.barsOpen && !app.params.contextOpen && !app.params.showsNotification) {
					if ($('.application-bar').hasClass("extended") || $('.navigation-bar').hasClass("extended")) {
						app.params.barsOpen = false;
						app.closeBars();
					}
				}
				if ($('div.select.open') != undefined) {
					var el = $('div.select.open');
					
					if (window.innerWidth > app.params.windowSizeLimit) {
						el.removeClass("open").children("div").removeAttr("style").children("ul").removeAttr("style");
						el.children("div").children("ul").css({
							"margin-top": "-"+((el.children("div").children("ul").children("li.checked").index()*28))+"px"
						});
					} else {
						el.removeClass("open").removeAttr("style").children("ul").removeAttr("style");
						el.children("ul").css({
							"margin-top": "-"+((el.children("ul").children("li.checked").index()*28))+"px"
						});
					}
				}
				if ($('.popover').length>0) {
					var timeout = ((window.innerWidth > app.windowSizeLimit)) ? 200 : 0;
					$('.popover').removeClass("slideFromTop slideFromBottom").addClass("popoverFadeOut");
					setTimeout(function() {
						app.params.contextOpen = false;
						$('.popover, .notification-background').remove();
						$('[data-child]').removeAttr("data-child");
					}, timeout);
				}
			});
			$('.application-bar, .navigation-bar').on("click", function() {
				if ($('.popover').length>0 && app.params.contextOpen) {
					$('.popover').removeClass("slideFromTop slideFromBottom").addClass("popoverFadeOut");
					setTimeout(function() {
						app.params.contextOpen = false;
						$('.popover').remove();
						$('[data-child]').removeAttr("data-child");
					}, 200);
				}
			});
			$('div.select.color').on("click", function() {
				$('body').append('<div class="accent-picker"><div class="accent-picker-wrapper"><div class="pivot-title">Accents</div></div></div>');
				for (var i=0;i<app.params.availThemes.length;i++) {
					$('div.accent-picker-wrapper').append('<div class="accent-tile" data-color="'+app.params.availThemes[i]+'"></div>');
				}
				$('div.accent-tile').on("click", function() {
					$('body').attr("data-color", $(this).attr("data-color"));
					app.initColorSelect();
					$('.accent-picker').remove();
				});
			});


			app.initSwitches();
			app.initCheckboxes();
			app.initRadios();
			app.initSelect();
			app.initBars();
			app.initPages();
			app.initThemeSelector();
			app.initColorSelect();
			app.bindLinks();
		};
		app.initSwitches = function() {
			$('.switch:not(.disabled) .switch-content').on("mousedown touchstart", function(e) {
				app.switches.mouseDown = true;
				if ("ontouchend" in window) {
					app.switches.x = e.originalEvent.touches[0].pageX;
				} else {
					app.switches.x = e.pageX;
				}
			});
			$('.switch:not(.disabled) .switch-content').on("mousemove touchmove", function(e) {
				var el = $(this).parent();
				if (app.switches.mouseDown && app.params.switchDynamics) {
					el.children("div.switch-content").children("div.switch-inner").removeClass("transitioning");
					el.children("div.switch-content").children("div.switch-button").removeClass("transitioning");
					if ("ontouchend" in window) {
						app.switches.deltaX = e.originalEvent.touches[0].pageX - app.switches.x;
					} else {
						app.switches.deltaX = e.pageX - app.switches.x;
					}
					if (el.children(".switch-content").children("input").attr("checked")) {
						if (app.switches.deltaX <= 0 && app.switches.deltaX >= app.switches.width()*(-1)) {
							$(this).children("div.switch-content").children("div.switch-button").css({
								"left": app.switches.width()-(app.switches.deltaX*-1)+"px"
							});
							$(this).children("div.switch-content").children("div.switch-inner").css({
								"background-position-x": app.switches.width()-(app.switches.deltaX*-1)+"px"
							});
						}
						if (app.switches.deltaX < app.switches.width()*(-1)) {
							$(this).children("div.switch-content").children("div.switch-button").css({
								"left": app.switches.handleBorder*(-1)-app.switches.selfBorder+"px"
							});
							$(this).children("div.switch-content").children("div.switch-inner").css({
								"background-position-x": app.switches.selfBorder*(-1)+app.switches.selfBorder+"px"
							});
						}
						if (app.switches.deltaX > 0) {
							$(this).children("div.switch-content").children("div.switch-button").css({
								"left": app.switches.width()+"px"
							});
							$(this).children("div.switch-content").children("div.switch-inner").css({
								"background-position-x": app.switches.width()+"px"
							});
						}
					} else {
						if (app.switches.deltaX >= 0 && app.switches.deltaX <= app.switches.width()) {
							$(this).children("div.switch-content").children("div.switch-button").css({
								"left": app.switches.deltaX+"px"
							});
							$(this).children("div.switch-content").children("div.switch-inner").css({
								"background-position-x": app.switches.deltaX+"px"
							});
						}
						if (app.switches.deltaX >= app.switches.width()) {
							$(this).children("div.switch-content").children("div.switch-button").css({
								"left": app.switches.width()+"px"
							});
							$(this).children("div.switch-content").children("div.switch-inner").css({
								"background-position-x": app.switches.width()+"px"
							});
						}
						if (app.switches.deltaX < 0) {
							$(this).children("div.switch-content").children("div.switch-button").css({
								"left": (app.switches.handleBorder*(-1))-app.switches.selfBorder+"px"
							});
							$(this).children("div.switch-content").children("div.switch-inner").css({
								"background-position-x": (app.switches.selfBorder*(-1))+app.switches.selfBorder+"px"
							});
						}
					}
					e.preventDefault();

				}
			});
			$('.switch .switch-content').on("mouseup touchend", function() {
				var el = $(this).parent();
				var input = el.children(".switch-content").children("input");
				if (app.switches.mouseDown) {
					app.switches.mouseDown = false;
					el.children("div.switch-content").children("div.switch-inner").addClass("transitioning").removeAttr("style");
					el.children("div.switch-content").children("div.switch-button").addClass("transitioning").removeAttr("style");
					if (app.switches.deltaX >= app.switches.width()/2 && !input.is(":checked")) {
						input.addClass("").attr("checked","checked");
					} else if (app.switches.deltaX*(-1) >= app.switches.width()/2 && input.is(":checked")) {
						input.addClass("").removeAttr("checked");
					}
					if (app.switches.deltaX < 3 && app.switches.deltaX > -3) {
						if (!input.is(":checked")) {
							input.addClass("").attr("checked","checked");
						} else {
							input.addClass("").removeAttr("checked");
						}
					}
				}
				app.switches.deltaX = 0;
			});
		};
		app.initCheckboxes = function() {
			$('.checkbox:not(.disabled)').on("click", function() {
				var el = $(this);
				if (el.children(".checkbox-content").children("input").attr("checked")) {
					el.children(".checkbox-content").children("input").prop("checked", false);
				} else {
					el.children(".checkbox-content").children("input").prop("checked", true);
				}
				el.change();
			});

		};
		app.initRadios = function() {
			$('.radio:not(.disabled)').on("click", function() {
				var el = $(this);
				if (!el.children(".radio-content").children("input").is(":checked")) {
					$('input[type="radio"]').removeAttr("checked");
					el.children(".radio-content").children("input").prop("checked", true);
				}
			});
		};
		app.initSelect = function() {
			if (app.params.select) {
			var selects = $('body').find("div.select select");
			$.each(selects, function() {
				var el = $(this);
				if (window.innerWidth > app.params.windowSizeLimit) {
					el.parent().append("<div class=\"select-inner-wrapper\">");
					el.parent().children("div.select-inner-wrapper").append("<ul class=\"select-inner\">");
					for (var i=0; i<el.children("option").length; i++) {
						el.parent().children("div.select-inner-wrapper").children("ul.select-inner").append("<li>"+el.children("option:nth-child("+(i+1)+")").html()+"</li>");
						var attr = el.children("option:nth-child("+(i+1)+")").attr("selected");
						if (typeof attr !== typeof undefined && attr !== false) {
							el.parent().children("div.select-inner-wrapper").children("ul").children("li:nth-child("+(i+1)+")").addClass("checked");
						}
					}
					el.parent().children("div").children("ul").css({
						"margin-top": "-"+((el.parent().children("div").children("ul").children("li.checked").index()*28))+"px"
					});
				} else if (!el.parent().hasClass("color")) {
					el.parent().append("<ul class=\"select-inner\">");
					for (var i=0; i<el.children("option").length; i++) {
						el.parent().children("ul.select-inner").append("<li>"+el.children("option:nth-child("+(i+1)+")").html()+"</li>");
						var attr = el.children("option:nth-child("+(i+1)+")").attr("selected");
						if (typeof attr !== typeof undefined && attr !== false) {
							el.parent().children("ul").children("li:nth-child("+(i+1)+")").addClass("checked");
						}
					}
					el.parent().children("ul").css({
						"-webkit-transform": "translate3d(0,-"+((el.parent().children("ul").children("li.checked").index()*28))+"px,0)"
					});
				}
			});
			$('div.select:not(.disabled):not(.color)').on("click", function() {
				var el = $(this);
				if (!el.hasClass("open")) {
					el.addClass("open");
					if (window.innerWidth > app.params.windowSizeLimit) {
						el.children("div").children("ul").removeAttr("style");
						var upperHeight = 0, lowerHeight = 0, totalHeight = 0;
						upperHeight = (el.children("div").children("ul").children("li.checked").index() * 40);
						for (var i=el.children("div").children("ul").children("li.checked").index()+1; i<el.children("div").children("ul").children("li").length; i++) {
							lowerHeight = lowerHeight+40;
						}
						if (upperHeight > lowerHeight) {
							totalHeight = upperHeight*2 + 40;
							el.children("div").css({
								"height": (totalHeight+2),
								"-webkit-transform":"translate3d(0,-"+(upperHeight+2)+"px,0)"
							});
							el.children("div").children("ul").css({
								"-webkit-transform":"translate3d(0,"+(upperHeight+2)+"px,0)",
								"margin-top":"-"+(upperHeight)+"px"
							});
						} else if (upperHeight < lowerHeight) {
							totalHeight = lowerHeight*2 + 40;
							el.children("div").css({
								"height": (totalHeight+2),
								"-webkit-transform":"translate3d(0,-"+(lowerHeight)+"px,0)"
							});
							el.children("div").children("ul").css({
								"-webkit-transform":"translate3d(0,"+lowerHeight+"px,0)",
								"margin-top": "-"+(upperHeight)+"px"
							});
						} else {
							totalHeight = upperHeight*2 + 40;
							el.children("div").css({
								"height": (totalHeight+4),
								"-webkit-transform":"translate3d(0,-"+(upperHeight+2)+"px,0)"
							});
							el.children("div").children("ul").css({
								"-webkit-transform":"translate3d(0,"+upperHeight+"px,0)",
								"margin-top":"-"+(upperHeight-2)+"px"
							});
						}
					} else {
						el.removeAttr("style").css("height",(el.children("ul").children("li").length*40)+"px");
						el.children("ul").removeAttr("style");
					}
				}
				return false;
			});
			$('div.select:not(.disabled):not(.color) div ul li').on("click", function() {
				var el = $(this);
				if (el.parent().parent().parent().hasClass("open") && window.innerWidth > app.params.windowSizeLimit)  {
					setTimeout(function() {
						el.parent().children("li").removeClass("checked");
						el.closest("div.select").children("select").children("option").removeAttr("selected");
						el.closest("div.select").children("select").children("option:nth-child("+(el.index()+1)+")").attr("selected",true);
						el.addClass("checked");
						$('div.select.open').removeClass("open").children("div").removeClass("transitioning").removeAttr("style").children("ul").removeAttr("style");
						el.parent().css({
							"margin-top": "-"+((el.parent().children("li.checked").index()*28))+"px"
						});
						
						el.closest("div.select").children("select").trigger("change");
					}, 10);
				}
			});
			$('div.select:not(.disabled):not(.color) ul li').on("click", function() {
				var el = $(this);
				if (el.parent().parent().hasClass("open") && window.innerWidth <= app.params.windowSizeLimit)  {
					setTimeout(function() {
						el.parent().children("li").removeClass("checked");
						el.closest("div.select").children("select").children("option").removeAttr("selected");
						el.closest("div.select").children("select").children("option:nth-child("+(el.index()+1)+")").attr("selected",true);
						el.addClass("checked");
						$('div.select.open').removeClass("open").removeAttr("style");
						el.parent().css({
							"-webkit-transform": "translate3d(0,-"+((el.parent().children("li.checked").index()*28))+"px,0)"
						});
						setTimeout(function() {
							el.closest("div.select").children("select").trigger("change");
						}, 200);
					}, 10);
				}
			});			
			}
		};
		app.initBars = function() {
			$('div.application-bar, div.navigation-bar').on("click", function() {
				return false;
			});

			$('div.application-bar div.icon-more').on("click", function() {
				switch (app.params.barsOnOpen) {
					case ("appBar"): app.toggleAppbar(); break;
					case ("navBar"): app.toggleNavbar(); break;
					case ("both"): app.toggleBars(); break;
					default: console.error("MetroUIError: (AppBar) '"+app.params.barsOnOpen+"' is not a valid AppBar type."); break;
				}
				return false;
			});
		};
		app.initPages = function() {
			$('div.pages div.page:first-child').addClass("page-transition-in current");
			setTimeout(function() {
				$('div.pages div.page:first-child').removeClass("page-transition-in").addClass("page-transition-in-done");
			}, 1000);
		};
		app.initThemeSelector = function() {
			if (app.params.theming) {
				if ($('.theme-selector').length > 0) {
					if (window.innerWidth > app.params.windowSizeLimit) {
						for (var i=0;i<app.params.availThemes.length;i++) {
							$('.theme-selector').append('<div class="selector '+app.params.availThemes[i]+'" data-color="'+app.params.availThemes[i]+'"></div>');
						}
						if (app.params.showCustomThemes) {
							for (var i=0;i<app.params.customThemes.length;i++) {
								$('.theme-selector').append('<div class="selector '+app.params.customThemes[i]+'" data-color="'+app.params.customThemes[i]+'"></div>');
							}
						}
						$('.theme-selector div.indicator').css({
							left: ($('div.theme-selector div.selector[data-color="'+$('body').attr("data-color")+'"]').index()-1)*30+"px"
						});
						$('.theme-selector div.selector').on("click", function() {
							var el = $(this);
							$('.theme-selector div.indicator').css({
								left: (el.index()-1)*30+"px"
							});
							$('body').attr("data-color", el.attr("data-color"));
						});
					}
				}
			}
		};
		app.initColorSelect = function() {
			if (app.params.theming) {
				if ($('div.select.color div.accent-preview').length > 0) {
					$('div.select.color span').html(capitaliseFirstLetter($('body').attr("data-color")));
				} else {
					$('div.select.color').append('<ul class=\"select-inner\"><li><div class="accent-preview"></div><span>'+capitaliseFirstLetter($('body').attr("data-color"))+'</span></li></ul>');
				}
			}
		};
		/* Modals */
		
		app.modal = function(params) {
			params = params || {};
			params.okTitle = params.okTitle || app.params.modalOkTitle;
			params.cancelTitle = params.cancelTitle || undefined;

			if ($('.alert').length < 1) {
				if ($('body').find("div.notification-center").length < 1) {
					if (params.type != "prompt") {
						$('button, input').blur();
						$('body').append("<div class=\"notification-background slide-in\"></div>");
						$('body').append("<div class=\"notification-center\"><div class=\"alert slide-in\">");
						$('div.alert').append("<div class=\"title\">"+params.title+"</div>");
						$('div.alert').append("<div class=\"content\">"+params.message+"</div>");
						$('div.alert').append("<div class=\"button-container\">");
						
						$.each(params.buttons, function(index, e) {
							var text = params.buttons[index].text;
							$('div.alert div.button-container').append('<button data-type="'+params.buttons[index].type+'">'+params.buttons[index].text+'</button>');
							if (params.buttons[index].color) {
								$('div.alert div.button-container button:last-child').addClass("color");
							}
							if (params.buttons[index].callback && typeof(params.buttons[index].callback) === "function") {
								$('div.alert div.button-container button:last-child').on("click", params.buttons[index].callback);
							}
						});
						setTimeout(function() {
							$('div.alert').removeClass("slide-in");
						}, app.params.notifyAnimTimeout);
	
											
						$('body').append("</div></div></div>");
						
						$('.notification-background, .notification-center, .notification-center *').on("touchstart", function(e) {
							e.preventDefault();
						});
						
						$('.alert').css({
							"height": ($('.alert').height()-27)+$('.alert .title').height() + "px"
						}).css({
							"height": ($('.alert').height()-20)+$('.alert .content').height() + "px"
						})
						
						if (window.innerWidth > app.params.windowSizeLimit) {					
							$('.alert').css({
								"margin-top": "-"+($('.alert').height() / 2)+"px"
							});
						}
						
						$('.alert .content').css({
							"top": 28 + $('.alert .title').height() + 15 + "px"
						});
						
						$('.alert').on("click", function() {
							return false;
						});
						
						$('div.alert button').on("click", function() {
							$('.pages').removeAttr("style");
							$('.alert, .notification-background').removeClass("slide-in").addClass("slide-out");
							setTimeout(function() {
								$('.notification-background, .notification-center').remove();
							}, app.params.notifyAnimTimeout);
						});
					} else {
						$('div.pages').append('<div class="page page-transition-out-done" data-page="prompt" data-page-back="'+$('div.pages').attr("data-page")+'" data-category=""><div class="page-header"><div class="pivot-header">'+params.title+'</div></div><div class="page-content"><div class="page-content-wrapper"><div class="scroll-content">'+params.message+'<div class="buttons-wrapper"></div></div></div></div>');
						$.each(params.buttons, function(index, e) {
							$('div.page[data-page="prompt"] div.buttons-wrapper').append('<button>'+params.buttons[index].text+'</button>');
							$('div.page[data-page="prompt"] div.buttons-wrapper button:last-child').on("click", params.buttons[index].callback);
						});
						app.loadPage("prompt");
						$('div.page[data-page="prompt"] button').on("click", function() {
							if (params.loadPrevious || !params.loadPrevious && params.nextPage == undefined) {
								app.loadPage($('div.page[data-page="prompt"]').attr("data-page-back"));
							} else {
								app.loadPage(params.nextPage);
							}
							$('body').removeClass("prompt-open");
							setTimeout(function() {
								$('div.page[data-page="prompt"]').remove();
								$('div.application-bar').removeClass("minimized");
							}, 200);

						});
						$('.application-bar').addClass("minimized");
						setTimeout(function() {
							$('body').addClass("prompt-open");
						}, 200);
					}
				} else { return false; }
			}
		};
		app.notify = function(title, message, icon, callback) {
			if ($('div.notification').length < 1) {
				if (title != undefined && message != undefined) {
					app.params.showsNotification = true;
					if ($('body').children(".notification-center").length < 1) {
						$('body').append("<div class=\"notification-center\">");
					}
					if (icon != undefined) {
						$('div.notification-center').append("<div class=\"notification icon slide-in\">");
					} else {
						$('div.notification-center').append("<div class=\"notification slide-in\">");
					}
					
					$('div.notification').append("<div class=\"icon\"></div>");
					$('div.notification').append("<div class=\"title\">"+title+"</div>");
					$('div.notification').append("<div class=\"content\" id=\"ellipsis\"><p>"+message+"</p></div>");
					
					$('body').append("</div></div>");
					if (window.innerWidth > 596) {
						var element = document.getElementById('ellipsis');
						var ellipsis = new Ellipsis(element);
						
						ellipsis.calc();
						ellipsis.set();
					}
					$('.notification').on("mousedown touchstart", function() {
						app.clearTimeouts(app.timeouts);
						$(this).removeClass("slide-out fade-out");
					});
					$('.notification').on("mouseup touchend", function() {
						$(this).addClass("slide-out");
						setTimeout(function() {
							$('.notification-background').remove();
							if ($('.notification-center').children().length < 2) {
								$('.notification-center').remove();
							}
							if (callback && typeof(callback) === "function") {
								callback();	
							}
							app.params.showsNotification = false;
						}, app.params.notifyAnimTimeout);
					});
					app.timeouts.push(setTimeout(function() {
						$('div.notification').removeClass("slide-in").addClass("fade-out");
						setTimeout(function() {
							$('div.notification-center').remove();
							app.params.showsNotification = false;
						}, app.params.notifyIgnoreAnimTimeout());
					}, app.params.notifyDuration));
				} else { return false; }
			}
		};
		app.alert = function(title, message, okCallback) {
			app.modal({
				title: title,
				message: message,
				buttons: [
					{
						text: app.params.modalOkTitle,
						type: "ok-button",
						color: true,
						callback: okCallback
					}
				]
			});
		};
		app.confirm = function(title, message, okCallback, cancelCallback) {
			app.modal({
				title: title,
				message: message,
				buttons: [
					{
						text: app.params.modalCancelTitle,
						type: "cancel-button",
						color: false,
						callback: cancelCallback
					},
					{
						text: app.params.modalOkTitle,
						type: "ok-button",
						color: true,
						callback: okCallback
					},
				]
			});
		};
		app.prompt = function(title, message, okCallback, cancelCallback) {
			app.modal({
				type: "prompt",
				title: title,
				message: message+'<input id="modal_text" type="text" placeholder="'+app.params.promptPlaceholder+'">' || '<input id="modal_text" type="text" placeholder="'+app.params.promptPlaceholder+'">',
				buttons: [
					{
						text: app.params.modalCancelTitle,
						type: "cancel-button",
						color: false,
						callback: cancelCallback
					},
					{
						text: app.params.modalOkTitle,
						type: "ok-button",
						color: true,
						callback: okCallback
					},
				]
			});
		};
		app.modalLogin = function(options) {
			options = options || {};
			options.message = options.message || "";
			app.modal({
				type: "prompt",
				title: options.title,
				message: options.message+'<input id="modal_user" type="text" placeholder="'+app.params.userPlaceholder+'"><input id="modal_pass" type="password" placeholder="'+app.params.passPlaceholder+'">' || '<input id="modal_user" type="text" placeholder="'+app.params.userPlaceholder+'"><input id="modal_pass" type="password" placeholder="'+app.params.passPlaceholder+'">',
				loadPrevious: options.loadPrevious,
				nextPage: options.nextPage,
				buttons: [
					{
						text: app.params.modalCancelTitle,
						type: "cancel-button",
						color: false,
						callback: options.cancelCallback
					},
					{
						text: app.params.modalOkTitle,
						type: "ok-button",
						color: true,
						callback: options.okCallback
					},
				]
			});
		};
		app.modalPassword = function(title, message, okCallback, cancelCallback) {
			app.modal({
				type: "prompt",
				title: title,
				message: message+'<input id="modal_pass" type="password" placeholder="'+app.params.passPlaceholder+'">' || '<input id="modal_pass" type="password" placeholder="'+app.params.passPlaceholder+'">',
				buttons: [
					{
						text: app.params.modalCancelTitle,
						type: "cancel-button",
						color: false,
						callback: cancelCallback
					},
					{
						text: app.params.modalOkTitle,
						type: "ok-button",
						color: true,
						callback: okCallback
					},
				]
			});
		};
		/* XHR - Page Loading */
		app.loadPage = function(page, createScroll) {
			if (page != undefined && $('.pages').attr("data-page") != page && $('.page[data-page="'+page+'"]').length > 0) {
				$('.pages').attr("data-page", page);
				$('.page.current').addClass("page-transition-out").removeClass("page-transition-in page-transition-in-done");
				setTimeout(function() {
					$('.pages').removeAttr("style");
					$('.page.current').addClass("page-transition-out-done").removeClass("page-transition-out current");
					$('.page[data-page="'+page+'"]').removeClass("page-transition-out-done").addClass("page-transition-in");
					if (app.params.pageCreateScroll && createScroll) {
						new IScroll('.page[data-page="'+page+'"] .page-content-wrapper', {
							scrollX: app.params.scrollX,
							scrollY: app.params.scrollY,
							mouseWheel: app.params.mouseWheel,
							disableMouse: app.params.disableMouse,
							scrollbars: app.params.scrollbars,
							interactiveScrollbars: app.params.interactiveScrollbars,
							fadeScrollbars: app.params.fadeScrollbars,
							shrinkScrollbars: app.params.shrinkScrollbars,
							eventPassthrough: app.params.eventPassthrough,
						});
					}
					setTimeout(function() {
						$('.page[data-page="'+page+'"]').addClass("page-transition-in-done current").removeClass("page-transition-in");
					}, 750);
				}, 200);
			} else if ($('.page[data-page="'+page+'"]').length < 1) {
				app.alert("An error occured.","The specified page could not be found.");
			} else {
				return false;
			}
		};
		app.loadPageExternal = function(url) {
			if (url != "#") {
				$.ajax({
					url: url,
					type: 'GET',
					success: function(data){
						$('div.page.current').addClass("page-transition-out").removeClass("page-transition-in page-transition-in-done");
						app.history.push(url);
						app.clearTimeouts(app.timeouts);
						setTimeout(function() {
							$('div.page.current').removeClass("current").addClass("page-transition-out-done last");
							$('div.pages').append(data);
							$('div.page').trigger("beforeAnim");
							$('div.pages div.page:last-child').addClass("page-transition-in current navbar-back");
							app.bindLinks();
							$('div.page .navigation-back').on("click", function() {
								app.navigateBack();
							});
							if (app.params.pageCreateScroll) {
								app.createPageScroll();
							}
							app.timeouts.push(setTimeout(function() {
								$('div.pages div.page.page-transition-in-done').removeClass("page-transition-in-done");
								$('div.pages div.page:last-child').removeClass("page-transition-in").addClass("page-transition-in-done");
							}, 750));
						}, 200);
					},
					error: function(data) {
						app.alert("Error","The requested URL could not be loaded:<br><b>"+url+"</b><br><br>Error code: "+data.status);
					}
				});
			}
		};
		app.bindLinks = function() {
			$('a:not(.external)').click(function (event) { 
				event.preventDefault();

				var url = $(this).attr('href');
				var page = $(this).attr('data-page');
				var scroll = $(this).attr('data-scroll') || false;
				if (url != "#") {
					app.loadPageExternal(url);
				} else {
					app.loadPage(page, scroll);
				}
			});
		};
		app.navigateBack = function() {
			$('div.page.current').removeClass("page-transition-in-done").addClass("page-transition-out");

			setTimeout(function() {
				$('div.page.current').remove();
				$('div.page.last:last-child').removeClass("page-transition-out page-transition-out-done").addClass("page-transition-in");
				setTimeout(function() {
					$('div.pages div.page.last:last-child').removeClass("page-transition-in last").addClass("page-transition-in-done current");
				}, 750);
			}, 200);
		};
		app.createPageScroll = function(page) {
			new IScroll(".page:last-child .page-content-wrapper", {
				scrollX: app.params.scrollX,
				scrollY: app.params.scrollY,
				mouseWheel: app.params.mouseWheel,
				disableMouse: app.params.disableMouse,
				scrollbars: app.params.scrollbars,
				interactiveScrollbars: app.params.interactiveScrollbars,
				fadeScrollbars: app.params.fadeScrollbars,
				shrinkScrollbars: app.params.shrinkScrollbars,
				eventPassthrough: app.params.eventPassthrough,
			});
		};

		/* Page Callbacks */
		app.triggerCallback = function(page, callbackType) {};

		/* Bars */
		app.openBars = function() {
			app.params.barsOpen = true;
			app.openAppbar();
			app.openNavbar();
		};
		app.closeBars = function() {
			app.params.barsOpen = false;
			app.closeAppbar();
			app.closeNavbar();

			return false;
		};
		app.toggleBars = function() {
			if (!$('div.application-bar').hasClass("extended") && !$('div.navigation-bar').hasClass("extended")) {
				app.openBars();
			} else {
				app.closeBars();
			}

			return false;
		};

		app.openNavbar = function() {
			app.params.barsOpen = true;
			$('.navigation-bar').addClass("extended");
			var currentCategory = $('div.page.current').attr("data-category");
			$('div.navigation-bar .button').removeClass("selected");
			$('div.navigation-bar .button[data-category="'+currentCategory+'"]').addClass("selected");
			
			var scrollValue = ($('div.navigation-bar div.button.selected').index() * 210) + ($('div.navigation-bar div.button.selected').index() * 10) + 20;
			//$('div.navigation-bar').scrollLeft(scrollValue);

			return false;
		};
		app.closeNavbar = function() {
			app.params.barsOpen = false;
			$('.navigation-bar').removeClass("extended");

			return false;
		};
		app.toggleNavbar = function() {
			if (!$('div.navigation-bar').hasClass("extended")) {
				app.openNavbar();
			} else {
				app.closeNavbar();
			}

			return false;
		};

		app.openAppbar = function() {
			app.params.barsOpen = true;
			$('.application-bar').addClass("extended");
			if (window.innerWidth < app.params.windowSizeLimit) {
				if ($('.application-bar').attr("data-maxheight") != undefined) {
					$('.application-bar').css({
						'height': $('.application-bar').height() + parseInt($('.application-bar').attr("data-maxheight"))
					});
				}
			}
			return false;
		};
		app.closeAppbar = function() {
			app.params.barsOpen = false;
			$('.application-bar').removeClass("extended");
			if (window.innerWidth < app.params.windowSizeLimit) {
				$('.application-bar').removeAttr("style");
			}
			return false;
		};
		app.toggleAppbar = function() {
			if (!$('div.application-bar').hasClass("extended")) {
				app.openAppbar();
			} else {
				app.closeAppbar();
			}

			return false;
		};

		/* Context Menus */
		app.contextMenu = function(parameters) {
			setTimeout(function() {
				if (window.innerWidth > app.params.windowSizeLimit) {
					if ($('.popover').length < 1 && $(parameters.target).attr("data-child") == undefined) {
						var undefinedParams = {};
						undefinedParams.positionH = (($(parameters.target).offset().left < window.innerWidth/2)) ? "left" : "right";
						undefinedParams.positionV = (($(parameters.target).offset().top < window.innerHeight/2)) ? "top" : "bottom";
					
						var params = parameters || {};
						params.buttons = parameters.buttons || [];
						params.positionH = parameters.positionH || undefinedParams.positionH;
						params.positionV = parameters.positionV || undefinedParams.positionV;
	
						setTimeout(function() {
							app.params.contextOpen = true;
						}, 300);
	
						var milliseconds = (new Date).getTime();
						$('body').append('<div class="popover" data-parent="'+milliseconds+'"></div>');
						$(params.target).attr("data-child",milliseconds);
						if (params.buttons != undefined) {
							for (var i=0; i<params.buttons.length;i++) {
								if (params.buttons[i].href != undefined) {
									$('.popover').append('<a href="'+params.buttons[i].href+'" target="_blank"><div class="'+params.buttons[i].type+'">'+params.buttons[i].text+'</div></a>');
								} else {
									$('.popover').append('<div class="'+params.buttons[i].type+'">'+params.buttons[i].text+'</div>');
								}
								if (params.buttons[i].disabled) {
									$('.popover div:nth-child('+(i+1)+')').addClass("disabled");
								}
								if (params.buttons[i].selected) {
									$('.popover div:nth-child('+(i+1)+')').addClass("selected");
								}
								if (params.buttons[i].onclick && typeof(params.buttons[i].onclick) === "function") {
									$('.popover div:nth-child('+(i+1)+'):not(.disabled)').on("click", params.buttons[i].onclick);
								}
							}
						}
	
						var offsetLeft = $(params.target).offset().left,
							offsetTop = $(params.target).offset().top,
							offsetWidth = $(params.target).outerWidth(),
							offsetHeight = $(params.target).outerHeight(),
							selfWidth = $('.popover').outerWidth(),
							selfHeight = $('.popover').outerHeight(),
							padding = 10;
	
						if (params.positionH == "left") {
							if (params.positionV == "top") {
								$('.popover').addClass("slideFromTop").css({
									left: offsetLeft,
									top: (offsetTop+padding)
								});
							} else if (params.positionV == "bottom") {
								$('.popover').addClass("slideFromBottom").css({
									left: offsetLeft,
									top: (offsetTop-selfHeight-padding)
								});
							}
						} else if (params.positionH == "right") {
							if (params.positionV == "top") {
								$('.popover').addClass("slideFromTop").css({
									left: (offsetLeft-selfWidth)+offsetWidth,
									top: (offsetTop+padding)
								});
							} else if (params.positionV == "bottom") {
								$('.popover').addClass("slideFromBottom").css({
									left: (offsetLeft-selfWidth)+offsetWidth,
									top: (offsetTop-selfHeight-padding)
								});
							}
						} else if (params.positionH == "center") {
							if (params.positionV == "top") {
								$('.popover').addClass("slideFromTop").css({
									left: (offsetLeft + offsetWidth/2) - selfWidth/2,
									top: (offsetTop+padding)
								});
							} else if (params.positionV == "bottom") {
								$('.popover').addClass("slideFromBottom").css({
									left: (offsetLeft + offsetWidth/2) - selfWidth/2,
									top: (offsetTop-selfHeight-padding)
								});
							}
						}
	
						$('.popover .button:not(.disabled)').on("click", function() {
							$('.popover').removeClass("slideFromTop slideFromBottom").addClass("popoverFadeOut");
							setTimeout(function() {
								app.params.contextOpen = false;
								$('.popover').remove();
							}, 200);
						});
					} else if ($('.popover').length > 0 && $(parameters.target).attr("data-child") == $('.popover').attr("data-parent")) {
						$('.popover').removeClass("slideFromTop slideFromBottom").addClass("popoverFadeOut");
						setTimeout(function() {
							app.params.contextOpen = false;
							$('.popover').remove();
							$(parameters.target).removeAttr("data-child");
						}, 200);
					} else if ($('.popover').length > 0 && $(parameters.target).attr("data-child") != $('.popover').attr("data-parent")) {
						$('.popover').remove();
						app.params.contextOpen = false;
						$(parameters.target).removeAttr("data-child");
						app.contextMenu(parameters);
					}
				} else {
					if ($('.popover').length < 1 && $(parameters.target).attr("data-child") == undefined) {
						var params = parameters || {};
						params.buttons = parameters.buttons || [];
						$('notification-background').remove();
						$('body').append('<div class="notification-background slide-in"></div>');
						$('body').append('<div class="popover not-extended"></div>');
						if (params.title != undefined) {
							$('div.popover').append('<div class="pivot-title">'+params.title+'</div>');
						}
						$('div.popover').append('<div class="buttons"></div>');
						if (params.buttons != undefined) {
							for (var i=0; i<params.buttons.length;i++) {
								if (params.buttons[i].href != undefined) {
									$('.popover .buttons').append('<a href="'+params.buttons[i].href+'" target="_blank"><div class="'+params.buttons[i].type+'">'+params.buttons[i].text+'</div></a>');
								} else {
									$('.popover .buttons').append('<div class="'+params.buttons[i].type+'">'+params.buttons[i].text+'</div>');
								}
								if (params.buttons[i].disabled) {
									$('.popover .buttons div:nth-child('+(i+1)+')').addClass("disabled");
								}
								if (params.buttons[i].selected) {
									$('.popover .buttons div:nth-child('+(i+1)+')').addClass("selected");
								}
								if (params.buttons[i].onclick && typeof(params.buttons[i].onclick) === "function") {
									$('.popover .buttons div:nth-child('+(i+1)+'):not(.disabled)').on("click", params.buttons[i].onclick);
								}
							}
							$('.popover').css({
								"height": ($('.popover .buttons div').length*44)+28+"px"
							});
							if (params.title != undefined) {
								$('.popover').css({
									"height": ($('.popover .buttons div').length*44)+68+"px"
								});
							}

							setTimeout(function() {
								$('.popover').removeClass("not-extended");
							}, 50);
						}
					}
				}
			}, 50);
		};

		/* Init application */
		app.init();
	}
})();
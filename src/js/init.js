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
						el.parent().children("div.select-inner-wrapper").children("ul.select-inner").append("<li data-value='"+el.children("option:nth-child("+(i+1)+")").attr("value")+"'>"+el.children("option:nth-child("+(i+1)+")").html()+"</li>");
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
						var accentName = localStorage.accentColor || $('body').attr("data-color");
						var themeName = localStorage.themeColor || $('body').attr("data-theme");
						app.changeAccent(accentName);
						app.changeTheme(themeName);
						$('.theme-selector div.indicator').css({
							left: ($('div.theme-selector div.selector[data-color="'+accentName+'"]').index()-1)*30+"px"
						});
						$('.theme-selector div.selector').on("click", function() {
							var el = $(this);
							$('.theme-selector div.indicator').css({
								left: (el.index()-1)*30+"px"
							});
							app.changeAccent(el.attr("data-color"));
						});
					}
				}
				
				var themeName = localStorage.themeColor || $('body').attr("data-theme");
				$('div.select.background select option[value="'+themeName+'"]').attr("selected",true);
				$('div.select.background div ul li').removeClass("checked");
				$('div.select.background div ul li[data-value="'+themeName+'"]').addClass("checked");
				$('div.select.background div ul').css({
					"margin-top": "-"+(($('div.select.background div ul').children("li.checked").index()*28))+"px"
				});
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
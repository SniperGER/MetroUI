/*
 * MetroUI JavaScript Components
 * Version 1.0
 *
 * https://github.com/SniperGER/MetroUI
 *
 * © 2014 Janik Schmidt
 * All Rights reserved
 *
 * Required by MetroUI
 * Requires jQuery
*/
	var touchEventStart = (('ontouchend' in window)) ? 'touchstart' : 'mousedown';
	var touchEventEnd = (('ontouchend' in window)) ? 'touchend' : 'mouseup';


(function() {
	"use strict",
	window.MetroUI = function(params) {
		$.ajaxSetup({ cache: false });
		
		var component = this;
		
		this.params = {
			modalOkTitle: "ok",
			modalCancelTitle: "cancel"
		};
		this.button = {
			selfWidth: ((window.innerWidth > 596)) ? 50 : 60,
			selfBorder: 0,
			handleWidth: 13,
			handleBorder: 0,
			width: 0,
			mouseDown: false,
			click: false,
			x: 0,
			deltaX: 0
		};
		this.button.width = this.button.selfWidth - this.button.handleWidth + this.button.selfBorder - (this.button.handleBorder*2);
		
		this.notification = {
			animationTimeout: ((window.innerWidth > 596)) ? 300 : 300,
			ignoreAnimationTimeout: ((window.innerWidth > 596)) ? 5000 : 300
		};
		this.timeouts = [];
		this.init = function() {
			window.addEventListener('load', function() {
				FastClick.attach(document.body);
			}, false);
			
//			$('body:not(div.select):not(div.select ul):not(div.select ul li)').on("click", function() {
//				$('div.select').removeClass("open");
//			});
			$('.switch:not(.disabled)').on("mousedown touchstart", function(e) {
				component.button.mouseDown = true;
				if ("ontouchend" in window) {
					component.button.x = e.originalEvent.touches[0].pageX;
				} else {
					component.button.x = e.pageX;
				}
			});
			$('.switch:not(.disabled)').on("mousemove touchmove", function(e) {
				var el = $(this);
				if (component.button.mouseDown) {
					el.children("div.switch-content").children("div.switch-inner").removeClass("transitioning");
					el.children("div.switch-content").children("div.switch-button").removeClass("transitioning");
					if ("ontouchend" in window) {
						component.button.deltaX = e.originalEvent.touches[0].pageX - component.button.x;
					} else {
						component.button.deltaX = e.pageX - component.button.x;
					}
					if (el.children(".switch-content").children("input").attr("checked")) {
						if (component.button.deltaX <= 0 && component.button.deltaX >= component.button.width*(-1)) {
							$(this).children("div.switch-content").children("div.switch-button").css({
								"left": component.button.width-(component.button.deltaX*-1)+"px"
							});
							$(this).children("div.switch-content").children("div.switch-inner").css({
								"background-position-x": component.button.width-(component.button.deltaX*-1)+"px"
							});
						}
						if (component.button.deltaX < component.button.width*(-1)) {
							$(this).children("div.switch-content").children("div.switch-button").css({
								"left": component.button.handleBorder*(-1)-component.button.selfBorder+"px"
							});
							$(this).children("div.switch-content").children("div.switch-inner").css({
								"background-position-x": component.button.selfBorder*(-1)+component.button.selfBorder+"px"
							});
						}
						if (component.button.deltaX > 0) {
							$(this).children("div.switch-content").children("div.switch-button").css({
								"left": component.button.width+"px"
							});
							$(this).children("div.switch-content").children("div.switch-inner").css({
								"background-position-x": component.button.width+"px"
							});
						}
					} else {
						if (component.button.deltaX >= 0 && component.button.deltaX <= component.button.width) {
							$(this).children("div.switch-content").children("div.switch-button").css({
								"left": component.button.deltaX+"px"
							});
							$(this).children("div.switch-content").children("div.switch-inner").css({
								"background-position-x": component.button.deltaX+"px"
							});
						}
						if (component.button.deltaX >= component.button.width) {
							$(this).children("div.switch-content").children("div.switch-button").css({
								"left": component.button.width+"px"
							});
							$(this).children("div.switch-content").children("div.switch-inner").css({
								"background-position-x": component.button.width+"px"
							});
						}
						if (component.button.deltaX < 0) {
							$(this).children("div.switch-content").children("div.switch-button").css({
								"left": (component.button.handleBorder*(-1))-component.button.selfBorder+"px"
							});
							$(this).children("div.switch-content").children("div.switch-inner").css({
								"background-position-x": (component.button.selfBorder*(-1))+component.button.selfBorder+"px"
							});
						}
					}
					e.preventDefault();

				}
			});
			$('.switch').on("mouseup touchend", function() {
				var el = $(this);
				var input = el.children(".switch-content").children("input");
				if (component.button.mouseDown) {
					component.button.mouseDown = false;
					el.children("div.switch-content").children("div.switch-inner").addClass("transitioning").removeAttr("style");
					el.children("div.switch-content").children("div.switch-button").addClass("transitioning").removeAttr("style");
					if (component.button.deltaX >= component.button.width/2 && !input.is(":checked")) {
						input.addClass("").attr("checked","checked");
					} else if (component.button.deltaX*(-1) >= component.button.width/2 && input.is(":checked")) {
						input.addClass("").removeAttr("checked");
					}
					if (component.button.deltaX < 3 && component.button.deltaX > -3) {
						if (!input.is(":checked")) {
							input.addClass("").attr("checked","checked");
						} else {
							input.addClass("").removeAttr("checked");
						}
					}
				}
				component.button.deltaX = 0;
			});
			$('.checkbox:not(.disabled)').on("click", function() {
				var el = $(this);
				if (el.children(".checkbox-content").children("input").attr("checked")) {
					el.children(".checkbox-content").children("input").prop("checked", false);
				} else {
					el.children(".checkbox-content").children("input").prop("checked", true);
				}
			});
			$('.radio:not(.disabled)').on("click", function() {
				var el = $(this);
				if (!el.children(".radio-content").children("input").is(":checked")) {
					$('input[type="radio"]').removeAttr("checked");
					el.children(".radio-content").children("input").prop("checked", true);
				}
			});
			
			$('div.navigation-bar div.content').css({
				width: ($('div.navigation-bar').children("div").children("div.button").length * 210) + (($('.navigation-bar').children("div").children("div.button").length-1) * 10) + "px"
			});
			$('div.application-bar, div.navigation-bar').on("click", function() {
				return false;
			});

			$('div.application-bar div.icon-more').on("click", function() {
				var el = $(this);
				setTimeout(function() {
					$('div.application-bar').toggleClass("extended");
					$('div.navigation-bar').toggleClass("extended");
				}, 10);
				return false;
			});
		};
		this.setupSelect = function() {
			var selects = $('body').find("div.select select");
			$.each(selects, function() {
				var el = $(this);
				if (window.innerWidth > 596) {
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
				} else {
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
			$('div.select:not(.disabled)').on("click", function() {
				var el = $(this);
				if (!el.hasClass("open")) {
					el.addClass("open");
					if (window.innerWidth > 596) {
						el.children("div").children("ul").removeAttr("style");
						var upperHeight = 0, lowerHeight = 0, totalHeight = 0;
						/*for (var i=0; i<el.children("div").children("ul").children("li.checked").index(); i++) {
							upperHeight = upperHeight+40;
						}*/
						upperHeight = (el.children("div").children("ul").children("li.checked").index() * 40);
						for (var i=el.children("div").children("ul").children("li.checked").index()+1; i<el.children("div").children("ul").children("li").length; i++) {
							lowerHeight = lowerHeight+40;
						}
						//console.log(upperHeight+", "+lowerHeight);
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
						el.children("div").css({
							//"height": totalHeight,
							//"margin-top": "-"+totalHeight/2+"px"
						}).children("ul").css({
							//"-webkit-transform": "translate3d(0,-"+((el.children("div").children("ul").children("li.checked").index()*40))+"px,0)"
						});
					} else {
						el.removeAttr("style").css("height",(el.children("ul").children("li").length*40)+"px");
						el.children("ul").removeAttr("style");
					}
				}
				return false;
			});
			$('div.select:not(.disabled) div ul li').on("click", function() {
				var el = $(this);
				if (el.parent().parent().parent().hasClass("open") && window.innerWidth > 596)  {
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
			$('div.select:not(.disabled) ul li').on("click", function() {
				var el = $(this);
				if (el.parent().parent().hasClass("open") && window.innerWidth <= 596)  {
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
		};
		
		this.notify = function(title,message,icon,callback) {
			if ($('div.notification').length < 1) {
				if (title != undefined && message != undefined) {
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
						component.clearTimeouts(component.timeouts);
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
						}, component.notification.animationTimeout);
					});
					component.timeouts.push(setTimeout(function() {
						$('div.notification').removeClass("slide-in").addClass("fade-out");
						setTimeout(function() {
							$('div.notification-center').remove();
						}, component.notification.ignoreAnimationTimeout);
					}, 10000));
				} else { return false; }
			}
		};
		this.alert = function(title,message,dismissTitle) {
			component.modal({
				title:title || "",
				message:message || "",
				okTitle:dismissTitle
			});
		};
		this.confirm = function(title,message,okCallback,cancelCallback) {
			component.modal({
				title:title || "",
				message:message || "",
				cancelTitle:component.params.modalCancelTitle,
				okCallback:okCallback || undefined,
				cancelCallback:cancelCallback || undefined,
			})
		}
		this.modal = function(options) {
			options.okTitle = options.okTitle || component.params.modalOkTitle;
			options.cancelTitle = options.cancelTitle || undefined;
			if ($('.alert').length < 1) {
				if ($('body').find("div.notification-center").length < 1) {
					$('body').append("<div class=\"notification-background slide-in\"></div>");
					$('body').append("<div class=\"notification-center\"><div class=\"alert slide-in\">");
					$('div.alert').append("<div class=\"title\">"+options.title+"</div>");
					$('div.alert').append("<div class=\"content\">"+options.message+"</div>");
					$('div.alert').append("<div class=\"button-container\">");
					if (options.cancelTitle) {
						$('div.button-container').append("<button id=\"cancel\">"+options.cancelTitle+"</button>");
					}
					$('div.button-container').append("<button class=\"color\" id=\"ok\">"+options.okTitle+"</button>");
					
					$('body').append("</div></div></div>");
					
					$('.notification-background, .notification-center, .notification-center *').on("touchstart", function(e) {
						e.preventDefault();
					});
					
					$('.alert').css({
						"height": ($('.alert').height()-27)+$('.alert .title').height() + "px"
					}).css({
						"height": ($('.alert').height()-20)+$('.alert .content').height() + "px"
					})
					
					if (window.innerWidth > 596) {					
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
					
					$('#ok').on("click", function() {
						$('.alert, .notification-background').removeClass("slide-in").addClass("slide-out");
						setTimeout(function() {
							$('.notification-background, .notification-center').remove();
						}, component.notification.animationTimeout);
						if (options.okCallback && typeof(options.okCallback) === "function") {
							options.okCallback();
						}
					});
					if (options.cancelTitle) {
						$('#cancel').on("click", function() {
							$('.alert, .notification-background').removeClass("slide-in").addClass("slide-out");
							setTimeout(function() {
								$('.notification-background, .notification-center').remove();
							}, 200);
							if (options.cancelCallback && typeof(options.cancelCallback) === "function") {
								options.cancelCallback();
							}
						});
					}

				} else { return false; }
			}
		};

		this.loadPageExternal = function(url) {
			$.get(url, function(data) {
				$('div.pages div.page.current').removeClass("page-transition-in").addClass("page-transition-out");
				setTimeout(function() {
					$('div.pages div.page.current').addClass("page-transition-out-done").removeClass("current");
					$('div.pages').append(data);
					$('div.pages div.page:last-child').addClass("current external");
					component.bindNavigationBack();
				}, 200);
			});
		};
		this.bindNavigationBack = function() {
			$('div.page .navigation-back').on("click", function() {
				$('div.pages div.page.current').removeClass("page-transition-in").addClass("page-transition-out");
				
				setTimeout(function() {
					$('div.pages div.page.current').remove();
					
					setTimeout(function() {
						$('div.pages div.page:last-child').removeClass("page-transition-out page-transition-out-done").addClass("page-transition-in current");
					}, 0);
				}, 200);
			});
		}
		
		this.openAppBar = function() {
			$('div.application-bar').addClass("extended");
			$('div.navigation-bar').addClass("extended");
			return false;
		};
		this.closeAppBar = function() {
			$('div.application-bar').removeClass("extended");
			$('div.navigation-bar').removeClass("extended");
			return false;
		};
		this.toggleAppBar = function() {
			$('div.application-bar').toggleClass("extended");
			$('div.navigation-bar').toggleClass("extended");
			return false;
		};
		
		this.clearTimeouts = function(timeout) {
			for (var i=0; i<timeout.length; i++) {
				clearTimeout(timeout[i]);
			}
		};
		
		$(document).on("contextmenu", function() {
			if ($('.notification-center').length < 1) {
				component.toggleAppBar();
			}
			return false;
		});
		$('html').on("click", function() {
			if ($('.application-bar').hasClass("extended") || $('.navigation-bar').hasClass("extended")) {
				$('.application-bar').removeClass("extended");
				$('.navigation-bar').removeClass("extended");
			}
			if ($('div.select.open') != undefined) {
				var el = $('div.select.open');
				
				if (window.innerWidth > 596) {
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
		});
		
		$('button.trigger-notification').on("click", function() {
			MetroUI.notify("Lorem Ipsum","Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
		});
		$('button.trigger-alert').on("click", function() {
			MetroUI.alert("Lorem ipsum dolor sit amet.","Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
		});
		$('button.trigger-confirm').on("click", function() {
			MetroUI.confirm("Lorem ipsum dolor sit amet.","Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
		});

		
		this.init();
		this.setupSelect();
	}
})();


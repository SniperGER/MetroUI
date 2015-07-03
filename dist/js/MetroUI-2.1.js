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
		app.build = parseInt("1099")+1;
		app.buildDate = "150702-1052";

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
		app.init = function() {
			if (_$("div.menu").length > 0) {
				_$("div.menu:first-child").addClass("menu-active");
				_$("div.menu").addClass("menu-cached");

				app.menuHistory.push("#"+_$("div.menu:first-child").attr("data-menu"));

				if (_$("div.navbar header[data-hide-phone=\"true\"][data-menu=\""+_$("div.menu:first-child").attr("data-menu")+"\"]").length > 0 && window.isPhone) {
					_$("div.navbar").addClass("hidden");
					if (_$("div.navbar header[data-menu=\""+_$("div.menu:first-child").attr("data-menu")+"\"]").length > 0) {
						_$("div.navbar header[data-menu=\""+_$("div.menu:first-child").attr("data-menu")+"\"]").addClass("header-active");
					}
				} else if (_$("div.navbar header[data-menu=\""+_$("div.menu:first-child").attr("data-menu")+"\"]").length > 0) {
					_$("div.navbar header[data-menu=\""+_$("div.menu:first-child").attr("data-menu")+"\"]").addClass("header-active");
				} else {
					_$("div.navbar").addClass("hidden");
				}

				setTimeout(function() {
					if (window.isTablet || window.isDesktop) {
						app.animation.menuSlideIn(_$("div.menu:first-child").attr("data-menu"));
					} else {
						app.animation.menuRotateIn(_$("div.menu:first-child").attr("data-menu"));
					}
				}, (window.isPhone)?350:150);

				app.navigation.initLinks("menu");
			}

			if (_$("div.appbar div.panel[data-page=\""+_$("div.page:first-child").attr("data-page")+"\"]").length > 0) {
				_$("div.appbar div.panel[data-page=\""+_$("div.page:first-child").attr("data-page")+"\"]").addClass("panel-active");
			} else {
				_$("div.appbar").addClass("hidden");
			}

			if (_$("div.page")) {
				_$("div.page:first-child").addClass("page-active");
				_$("div.page").addClass("page-cached");
				app.history.push(["#"+_$("div.page:first-child").attr("data-page")]);
				app.animation.pageSlideIn(_$("div.page:first-child").attr("data-page"));
			}
			app.initPage();

			if ($("div.app-controls") && !$("div.app-controls").classList.contains("hidden")) {
				_$("body").addClass("app-controls");
			}
			if ($("div.navbar:not(.hidden)")) {
				_$("body").addClass("navbar");
			}
			if ($("div.appbar:not(.hidden)")) {
				_$("body").addClass("appbar");
			}
			if ($("footer")) {
				_$("body").addClass("footer");
			}

			app.initBars();

			if (_$("footer div.navigate-back")) {
				_$("footer div.navigate-back").on("click", function() {
					if (_$("div.theme-overlay").length > 0) {
						app.design.hide();
					} else {
						if ($("div.menus.hidden")) {
							app.navigation.pageToMenu();
						} else {
							app.navigation.menuBack();
						}
					}
				});
			}
			//if ($("div.app-controls div.navigate-back")) {
			setTimeout(function() {
				_$("div.app-controls div.navigate-back").on("click", function() {
					if (_$("div.theme-overlay").length > 0) {
						app.design.hide();
					} else {
						if ($("div.menus.hidden")) {
							app.navigation.pageToMenu();
						} else {
							app.navigation.menuBack();
						}
					}
				});
			}, 50);
			//}

			if ('ontouchend' in window) {
				_$("body").addClass("touch");
			}
			document.addEventListener('DOMContentLoaded', function() {
				FastClick.attach(document.body);
			}, false);

			window.onresize = function() {
				window.isPhone = (window.innerWidth <= app.params.phoneWidth) ? true : false;
				window.isTablet = (window.innerWidth <= app.params.tabletWidth && window.innerWidth > app.params.phoneWidth) ? true : false;
				window.isDesktop = (window.innerWidth > app.params.tabletWidth) ? true : false;

				if (window.isPhone) {
					if (app.activePage) {
						if (_$("div.page[data-page=\""+app.activePage+"\"]")) {
							if (!_$("div.page[data-page=\""+app.activePage+"\"]").attr("data-landing-page") || _$("div.page[data-page=\""+app.activePage+"\"]").attr("data-landing-page") == "false") {
								if (_$("div.menus")) {
									_$("div.menus").addClass("hidden");
								}
							}
						}
					}
				} else if (window.isTablet) {
					if (_$("div.menu.menu-active div.link.selected")) {
						_$("div.menu.menu-active div.link.selected").removeClass("selected");
					}
					if (app.activePage) {
						if (_$("div.page[data-page=\""+app.activePage+"\"]") && !_$("div.page[data-page=\""+app.activePage+"\"]").attr("data-landing-page") || _$("div.page[data-page=\""+app.activePage+"\"]").attr("data-landing-page") == "false") {
							if (_$("div.menus")) {
								_$("div.menus").addClass("hidden");
							}
							app.navigation.load.navbarInternal(_$("div.page[data-page=\""+app.activePage+"\"]").attr("data-page"))
						}
					}
					/*if ($("div.page.page-active")) {
						$("div.page.page-active").classList.remove("page-active");
					}*/
				} else if (window.isDesktop) {
					if (app.activePage && _$("div.page[data-page=\""+app.activePage+"\"]")) {
						_$("div.page[data-page=\""+app.activePage+"\"]").addClass("page-active");
						_$("div.page[data-page=\""+app.activePage+"\"]").addClass("slide-in");
						if (_$("div.page.page-active") && _$("div.menu.menu-active div.link[href=\"#"+_$("div.page.page-active").attr("data-page")+"\"]")) {
							_$("div.menu.menu-active div.link[href=\"#"+_$("div.page.page-active").attr("data-page")+"\"]").addClass("selected");
						}
					} else if (_$("div.page.page-active")) {
						_$("div.page.page-active").addClass("page-active");
						_$("div.page.page-active").addClass("slide-in");
						if (_$("div.page.page-active") && _$("div.menu.menu-active div.link[href=\"#"+_$("div.page.page-active").attr("data-page")+"\"]")) {
							_$("div.menu.menu-active div.link[href=\"#"+_$("div.page.page-active").attr("data-page")+"\"]").addClass("selected");
						}
					} else {
						if (_$("div.menu.menu-active") && _$("div.menu.menu-active").attr("data-initial-page")) {
							_$("div.page[data-page=\""+_$("div.menu.menu-active").attr("data-initial-page")+"\"]").addClass("page-active");
							_$("div.page[data-page=\""+_$("div.menu.menu-active").attr("data-initial-page")+"\"]").addClass("slide-in");
							if (_$("div.page.page-active") && _$("div.menu.menu-active div.link[href=\"#"+_$("div.page.page-active").attr("data-page")+"\"]")) {
								_$("div.menu.menu-active div.link[href=\"#"+_$("div.page.page-active").attr("data-page")+"\"]").addClass("selected");
							}
						}
					}

					if (_$("div.menu") && _$("div.menu p.label")) {
						_$("div.menu p.label").removeAttr("style");
					}

					_$("div.menu.menu-active").addClass("slide-in");
					if (!_$("div.menus").hasClass("hidden")) {
						app.navigation.load.navbarInternal(_$("div.menu.menu-active").attr("data-menu"));
					}

					if (_$("div.page.page-active") && _$("div.page.page-active").attr("data-hide-menu") && _$("div.page.page-active").attr("data-hide-menu") == "true") {

					} else {
						if (_$("div.menus.hidden")) {
							_$("div.menus.hidden").removeClass("hidden");
						}
					}
				}
				app.design.init();
				app.initLists();
			};
			window.onclick = function(event) {
				event.stopPropagation();
				var a = event.target;
				var els = [];
				while (a) {
					els.unshift(a);
					a = a.parentNode;
				}

				if (app.listOpen) {
					setTimeout(function() {
						if (_$("div.list.open")) {
							for (var i=0; i<$$("div.list.open").length; i++) {
								var el = $$("div.list.open")[i];
								el.children[1].style.top = "-"+((indexInParent(el.querySelector("li.checked"))*28))+"px";
							}
							_$("div.list.open").removeClass("open");
						}
						app.listOpen = false;
					}, 10);
				}

				if (app.contextOpen) {
					if (els.indexOf($("div.popover")) == -1) {
						setTimeout(function() {
							_$("div.popover").addClass("fade-out");
							setTimeout(function() {
								_$("div.popover").remove()

								if (_$("div.notification-background")) {
									_$("div.notification-background").remove();
								}
							}, 100);
							app.contextOpen = false;
						}, 10);
					}
				}
				if (app.appBarOpen) {
					if (els.indexOf($("div.menu")) > -1 || els.indexOf($("div.pages")) > -1) {
						if (_$("div.navigation-bar")) {
							_$("div.navigation-bar").removeClass("extended");
						}
						if (_$("div.application-bar")) {
							app.bars.closeAppBar();
						}
					}
				}
				if (app.activeInput && els.indexOf($("div.keyboard")) < 0) {
					//app.keyboard.hide();
				}
			};
		};
		app.init2 = function() {
			if (_$("footer div.navigate-back")) {
				_$("footer div.navigate-back").on("click", function() {
					if (_$("div.theme-overlay").length > 0) {
						app.design.hide();
					} else {
						if ($("div.menus.hidden")) {
							app.navigation.pageToMenu();
						} else {
							app.navigation.menuBack();
						}
					}
				});
			}

			//if ($("div.app-controls div.navigate-back")) {
			setTimeout(function() {
				_$("div.app-controls div.navigate-back").on("click", function() {
					if (_$("div.theme-overlay").length > 0) {
						app.design.hide();
					} else {
						if ($("div.menus.hidden")) {
							app.navigation.pageToMenu();
						} else {
							app.navigation.menuBack();
						}
					}
				});
			}, 50);
			//}

			if ($("div.appbar")) {
				$("div.appbar div.more").addEventListener("click", function() {
					$("div.appbar").classList.toggle("extended");
				});
			}

			window.onclick = function(event) {
				event.stopPropagation();
				var a = event.target;
				var els = [];
				while (a) {
					els.unshift(a);
					a = a.parentNode;
				}

				if (app.listOpen) {
					setTimeout(function() {
						if (_$("div.list.open")) {
							for (var i=0; i<$$("div.list.open").length; i++) {
								var el = $$("div.list.open")[i];
								el.children[1].style.top = "-"+((indexInParent(el.querySelector("li.checked"))*28))+"px";
							}
							_$("div.list.open").removeClass("open");
						}
						app.listOpen = false;
					}, 10);
				}

				if (app.contextOpen) {
					if (els.indexOf($("div.popover")) == -1) {
						setTimeout(function() {
							_$("div.popover").addClass("fade-out");
							setTimeout(function() {
								_$("div.popover").remove()

								if (_$("div.notification-background")) {
									_$("div.notification-background").remove();
								}
							}, 100);
							app.contextOpen = false;
						}, 10);
					}
				}
				if (app.appBarOpen) {
					if (els.indexOf($("div.menu")) > -1 || els.indexOf($("div.pages")) > -1) {
						if (_$("div.navigation-bar")) {
							_$("div.navigation-bar").removeClass("extended");
						}
						if (_$("div.application-bar")) {
							app.bars.closeAppBar();
						}
					}
				}
				if (app.activeInput && els.indexOf($("div.keyboard")) < 0) {
					//app.keyboard.hide();
				}
			};
			window.onresize = function() {
				window.isPhone = (window.innerWidth <= app.params.phoneWidth) ? true : false;
				window.isTablet = (window.innerWidth <= app.params.tabletWidth && window.innerWidth > app.params.phoneWidth) ? true : false;
				window.isDesktop = (window.innerWidth > app.params.tabletWidth) ? true : false;
			};

			if ('ontouchend' in window) {
				_$("body").addClass("touch");
			}
			document.addEventListener('DOMContentLoaded', function() {
				FastClick.attach(document.body);
			}, false);
		}

		app.initPage = function() {
			app.triggerPageCallbacks("beforeInit",_$("div.page.page-active").attr("data-page"),{});

			app.initSwitches();
			app.initCheckboxes();
			app.initRadios();
			app.initProgress();
			app.initLists();
			//app.initTabs();
			app.design.init();

			app.triggerPageCallbacks("init",_$("div.page.page-active").attr("data-page"),{});

			app.navigation.initLinks("page");
		};
		app.initSwitches = function() {
			var switches = $$("div.page-active div.switch:not(.disabled) div.switch-inner");
			for (var i=0; i<switches.length; i++) {
				if (switches[i].parentNode.children[0].hasAttribute("checked")) {
					switches[i].parentNode.children[2].innerHTML = "On";
					switches[i].parentNode.style.opacity = 0.99;
				}
				switches[i].onclick = function() {
					if (this.parentNode.children[0].hasAttribute("checked")) {
						this.parentNode.children[0].removeAttribute("checked");
						this.parentNode.children[2].innerHTML = "Off";
					} else {
						this.parentNode.children[0].setAttribute("checked", true);
						this.parentNode.children[2].innerHTML = "On";
					}
					var el = this.parentNode;
					var visibility = el.style.opacity;
					el.style.opacity = '0.99';
					setTimeout( function() {
						el.removeAttribute("style");
					}, 10);
					var parent = this.parentNode;
					var event = document.createEvent("UIEvents");
					event.initUIEvent("change", true, true);
					parent.children[0].dispatchEvent(event);

				};
			}
		};
		app.initCheckboxes = function() {
			var checkboxes = $$("div.page-active div.checkbox:not(.disabled)");
			for (var i=0; i<checkboxes.length; i++) {
				checkboxes[i].onclick = function() {
					if (this.children[0].hasAttribute("checked")) {
						this.children[0].removeAttribute("checked");
					} else {
						this.children[0].setAttribute("checked", true);
					}
					var el = this.children[2];
					var visibility = el.style.opacity;
					el.style.opacity = '0.99';
					setTimeout( function() {
						el.style.opacity = visibility;
					}, 1);
				};
			}
		};
		app.initRadios = function() {
			var checkboxes = $$("div.page-active div.radio:not(.disabled)");
			for (var i=0; i<checkboxes.length; i++) {

				checkboxes[i].onclick = function() {
					for (var j=0; j<checkboxes.length; j++) {
						checkboxes[j].children[0].removeAttribute("checked");
					}
					this.children[0].setAttribute("checked", true);
					var event = document.createEvent("UIEvents");
					event.initUIEvent("change", true, true, window, 1);
					this.children[0].dispatchEvent(event);

				};
			}
		};
		app.initProgress = function() {
			for (var i=0;i<$$("div.page-active div.progress:not(.indeterminate)").length;i++) {
				var el = $$("div.page-active div.progress:not(.indeterminate)")[i];
				el.querySelector("div.progress-inner").style.width = el.children[0].value + "%";
				var observer = new MutationObserver(function (mutations) {
					// Whether you iterate over mutations..
					mutations.forEach(function (mutation) {
					// or use all mutation records is entirely up to you
						el.querySelector("div.progress-inner").style.width = mutation.target.value + "%";
					});
				});
				observer.observe(el.children[0], {
					attributes: true,
					attributesOldValue: true,
					subtree: true,
					characterData: true
				});
			}
		};
		app.initLists = function() {
			app.design.initTheme();

			var lists = $$("div.page-active div.list");
			for (var i=0; i<lists.length; i++) {
				if (lists[i].querySelectorAll("div.select-inner-wrapper").length < 1) {
					lists[i].innerHTML += "<div class=\"select-inner-wrapper\"><ul class=\"select-inner\"></ul></div>";
					var el = lists[i];
					lists[i].onclick = function() {
						var el = this;
						setTimeout(function() {
							if (!el.classList.contains("disabled")) {
								if (!el.classList.contains("open")) {
									el.classList.add("open");
									if (window.isPhone) {
										el.children[1].removeAttribute("style");
										new Velocity(el, {
											height: el.children[1].children[0].children.length * 40
										}, {
											duration: 200,
											easing: "ease-in-out"
										});

										for (var i=0; i<el.children[1].children[0].children.length; i++) {
											new Velocity(el.children[1].children[0].children[i], {
												lineHeight: 40
											}, {
												duration: 200,
												easing: "ease-in-out"
											});
										}
									}
								}

								var index = indexInParent(el.querySelector("li.checked"));
								if (!window.isPhone) {
									el.querySelector("div.select-inner-wrapper").style.top = "-"+((index*40)+6)+"px";
								}
								app.listOpen = true;
							}
						}, 0);
					};
					for (var j=0; j<lists[i].children[0].children.length; j++) {
						if (lists[i].children[0].children[j].innerHTML !== "") {
							if (lists[i].children[0].children[j].getAttribute("selected") !== null) {
								lists[i].children[1].children[0].innerHTML += "<li class=\"checked\">" + lists[i].children[0].children[j].innerHTML + "</li>";
							} else {
								lists[i].children[1].children[0].innerHTML += "<li>" + lists[i].children[0].children[j].innerHTML + "</li>";
							}
							var index = indexInParent(lists[i].children[0].querySelector("option[selected]"));
							if (!window.isPhone) {
								lists[i].children[1].style.top = "-"+(index*28)+"px";
							} else {
								lists[i].children[1].style.marginTop = "-"+(index*28)+"px";
							}

							for (var k=0; k<lists[i].querySelectorAll("li").length; k++) {
								lists[i].querySelectorAll("li")[k].onclick = function() {
									var elInside = this;
									var parent = elInside.parentNode.parentNode.parentNode;
									if (parent.classList.contains("open")) {
										setTimeout(function() {
											parent.classList.remove("open");
											if (window.isPhone) {
												new Velocity(parent, {
													height: 28
												}, {
													duration: 200,
													easing: "ease-in-out"
												});
												for (var i=0; i<parent.children[1].children[0].children.length; i++) {
													new Velocity(parent.children[1].children[0].children[i], {
														lineHeight: 28
													}, {
														duration: 200,
														easing: "ease-in-out"
													});
												}
											}

											var indexInside = indexInParent(elInside);
											if (!window.isPhone) {
												parent.children[1].style.top = "-"+(indexInside*28)+"px";
											} else {
												parent.children[1].style.marginTop = "-"+(indexInside*28)+"px";
											}

											parent.children[0].querySelector("option[selected]").removeAttribute("selected");
											parent.children[0].children[indexInside].setAttribute("selected", "");
											var event = document.createEvent("UIEvents");
											event.initUIEvent("change", true, true, window, 1);
											parent.children[0].dispatchEvent(event);

											parent.querySelector("li.checked").classList.remove("checked");
											elInside.classList.add("checked");

											setTimeout(function() {
												app.listOpen = false;
											}, 10);
										}, 10);
									}
								};
							}
						} else {
							lists[i].classList.add("error");
							lists[i].classList.add("disabled");
							lists[i].children[1].children[0].innerHTML += "<li class=\"error\">Invalid List</li>";
							break;
						}
					}
				}
				lists[i].removeAttribute("style");

				if (!lists[i].classList.contains("theme")) {
					if (window.isPhone) {
						var pTop = lists[i].children[1].style.top;
						lists[i].children[1].removeAttribute("style");
						lists[i].children[1].style.marginTop = pTop;
					} else {
						var pTop = lists[i].children[1].style.marginTop;
						lists[i].children[1].removeAttribute("style");
						lists[i].children[1].style.top = pTop;
					}

					for (var j=0; j<lists[i].children[1].children[0].children.length; j++) {
						lists[i].children[1].children[0].children[j].removeAttribute("style");
					}
				}
			}
		};
		app.initTabs = function() {
			if ($("div.navbar header.header-active div.split-control")) {
				$("div.navbar header.header-active div.split-control").onclick = function() {
					if ($("div.page.page-active div.tab-control")) {
						$("div.page.page-active div.tab-control").classList.toggle("extended");
					}
				}
			}

			if ($("div.page.page-active div.tab")) {
				$("div.page.page-active div.tab").classList.add("tab-active");
			}

			if ($("div.page.page-active div.tab-control")) {
				if ($("div.page.page-active div.tab-control div.tab-link")) {
					for (var i=0; i<$$("div.page.page-active div.tab-control div.tab-link").length; i++) {
						$$("div.page.page-active div.tab-control div.tab-link")[i].onclick = function() {
							var el = this;
							if ($("div.page.page-active div.tab.tab-active:not(#"+el.getAttribute("data-tab")+")")) {
								while ($("div.page.page-active div.tab.tab-active:not(#"+el.getAttribute("data-tab")+")")) {
									$("div.page.page-active div.tab.tab-active:not(#"+el.getAttribute("data-tab")+")").classList.remove("tab-active");
								}
							}

							if ($("div.page.page-active div.tab#"+el.getAttribute("data-tab"))) {
								if (!$("div.page.page-active div.tab#"+el.getAttribute("data-tab")).classList.contains("tab-active")) {
									$("div.page.page-active div.tab#"+el.getAttribute("data-tab")).classList.add("tab-active");
									if ($("div.page.page-active div.tab-control").classList.contains("extended")) {
										$("div.page.page-active div.tab-control").classList.remove("extended");
										app.animation.pageSlideIn($("div.page.page-active").getAttribute("data-page"));
									} else {
										app.animation.pageSlideIn($("div.page.page-active").getAttribute("data-page"), false);
									}
								} else {
									$("div.page.page-active div.tab-control").classList.remove("extended");
								}
							}
						}
					}
				}
			}
		}

		app.initBars = function() {
			if ($("div.appbar")) {
				$("div.appbar div.more").addEventListener("click", function() {
					$("div.appbar").classList.toggle("extended");
				});
			}
		};
		/*
app.notify = function(title,message,callback) {
			new MetroUI.Notification(app,title,message,callback);
		};
*/

		app.notifyTimeoutsDone = function() {
			for (var i=0; i<app.notificationTimeouts.length; i++) {
				if (app.notificationTimeouts[i] !== undefined) {
					return false;
				}
			}
			return true;
		};
		app.context = function(parameters) {
			if ($$("div.popover").length < 1) {
				setTimeout(function() {
					var milliseconds = (new Date()).getTime();
					var popover = document.createElement("div");
					popover.className = "popover";
					popover.id = milliseconds;

					var a = parameters.target;
					var els = [];
					while (a) {
						els.unshift(a);
						a = a.parentNode;
					}


					var positionH = ((cumulativeOffset(parameters.target).left < window.innerWidth/2)) ? "left" : "right";
					var positionV = ((cumulativeOffset(parameters.target).top < window.innerHeight/2)) ? "top" : "bottom";

					if (typeof(parameters.html) !== "undefined") {
						popover.classList.add("html");
						popover.innerHTML = parameters.html;
					}

					var buttonContainer = document.createElement("div");
					buttonContainer.className = "buttons";
					if (typeof(parameters.buttons) !== "undefined") {
						for (var i=0;i<parameters.buttons.length;i++) {
							if (parameters.buttons[i].type == "button") {
								var link = document.createElement("a");
								link.setAttribute("target", "_blank");

								link.setAttribute("href", parameters.buttons[i].href);

								var button = document.createElement("div");
								button.className = "button";
								button.innerHTML = parameters.buttons[i].text;
								button.onclick = function() {
									$$("div.popover")[0].classList.add("fade-out");
										setTimeout(function() {
										var el = $$("div.popover")[0];
										el.parentNode.removeChild(el);
									}, 100);
									app.contextOpen = false;
								};

								link.appendChild(button);
								buttonContainer.appendChild(link);
							}
							if (parameters.buttons[i].type == "separator") {
								var separator = document.createElement("div");
								separator.className = "seperator";
								buttonContainer.appendChild(separator);
							}
						}
					}

					popover.appendChild(buttonContainer);
					if (window.isPhone) {
						if ($$("div.notification-center").length < 1) {
							var notificationCenter = document.createElement("div");
							notificationCenter.className = "notification-center";
							document.body.appendChild(notificationCenter);
						}

						var notificationBG = document.createElement("div");
						notificationBG.className = "notification-background";

						$("div.notification-center").appendChild(notificationBG);
						$("div.notification-center").appendChild(popover);

						$("div.notification-background").addEventListener("mousewheel", function(e) {
							e.preventDefault();
							e.stopPropagation();
						});
					} else {
						$("body").appendChild(popover);
					}
					app.contextOpen = true;

					if (els.indexOf($("div.application-bar")) != -1) {
						document.getElementById(milliseconds).style.position = "fixed";
						document.getElementById(milliseconds).style.zIndex = 2100;
					}

					if (!window.isPhone) {
						if (positionV == "bottom") {
							document.getElementById(milliseconds).classList.add("slide-from-bottom");
							document.getElementById(milliseconds).style.top = (cumulativeOffset(parameters.target).top - document.getElementById(milliseconds).offsetHeight - 5) + "px";
						} else {
							document.getElementById(milliseconds).classList.add("slide-from-top");
							document.getElementById(milliseconds).style.top = (cumulativeOffset(parameters.target).top + parameters.target.offsetHeight + 5) + "px";
						}

						if (positionH == "left") {
							document.getElementById(milliseconds).style.left = cumulativeOffset(parameters.target).left + "px";
						} else {
							document.getElementById(milliseconds).style.left = (cumulativeOffset(parameters.target).left - document.getElementById(milliseconds).offsetWidth + parameters.target.offsetWidth) + "px";
						}
					} else {
						document.getElementById(milliseconds).style.top = window.innerHeight/2 - document.getElementById(milliseconds).offsetHeight/2 +"px";
						new Velocity(document.getElementById(milliseconds), { height:[document.getElementById(milliseconds).offsetHeight,0] },{easing: [0.77, 0, 0.175, 1]});
					}
				}, 50);
			}
		};

		app.pageCallbacks = {};
		Dom7.app = app;

		app.onPage = function (callbackName, pageName, callback) {
			if (pageName && pageName.split(' ').length > 1) {
				var pageNames = pageName.split(' ');
				var returnCallbacks = [];
				for (var i = 0; i < pageNames.length; i++) {
					returnCallbacks.push(app.onPage(callbackName, pageNames[i], callback));
				}
				returnCallbacks.remove = function () {
					for (var i = 0; i < returnCallbacks.length; i++) {
						returnCallbacks[i].remove();
					}
				};
				returnCallbacks.trigger = function () {
					for (var i = 0; i < returnCallbacks.length; i++) {
						returnCallbacks[i].trigger();
					}
				};
				return returnCallbacks;
			}
			var callbacks = app.pageCallbacks[callbackName][pageName];
			if (!callbacks) {
				callbacks = app.pageCallbacks[callbackName][pageName] = [];
			}
			app.pageCallbacks[callbackName][pageName].push(callback);
			return {
				remove: function () {
					var removeIndex;
					for (var i = 0; i < callbacks.length; i++) {
						if (callbacks[i].toString() === callback.toString()) {
							removeIndex = i;
						}
					}
					if (typeof removeIndex !== 'undefined') callbacks.splice(removeIndex, 1);
				},
				trigger: callback
			};
		};

		function createPageCallback(callbackName) {
		    var capitalized = callbackName.replace(/^./, function (match) {
		        return match.toUpperCase();
		    });
		    app['onPage' + capitalized] = function (pageName, callback) {
		        return app.onPage(callbackName, pageName, callback);
		    };
		}

		var pageCallbacksNames = ('beforeInit init reinit beforeAnimation afterAnimation back afterBack beforeRemove').split(' ');
		for (var i = 0; i < pageCallbacksNames.length; i++) {
			  app.pageCallbacks[pageCallbacksNames[i]] = {};
			  createPageCallback(pageCallbacksNames[i]);
		}

		app.triggerPageCallbacks = function (callbackName, pageName, pageData) {
		    var allPagesCallbacks = app.pageCallbacks[callbackName]['*'];
		    if (allPagesCallbacks) {
		        for (var j = 0; j < allPagesCallbacks.length; j++) {
		            allPagesCallbacks[j](pageData);
		        }
		    }
		    var callbacks = app.pageCallbacks[callbackName][pageName];
		    if (!callbacks || callbacks.length === 0) return;
		    for (var i = 0; i < callbacks.length; i++) {
		        callbacks[i](pageData);
		    }
		};
		app.navigation = {
			loadPage: function(url,type,back) {
				back = back ? back : false;
				if (url.length > 1 && url[0] == "#") {
					// Internal loading
					if ((type == "page" && $("div.page[data-page=\""+url.slice(1)+"\"]")) || ($("div.page[data-page=\""+url.slice(1)+"\"]") && type != "menu")) {
						app.navigation.load.pageInternal(url,back);
					}
					if ((type == "menu" && $("div.menu[data-menu=\""+url.slice(1)+"\"]")) || ($("div.menu[data-menu=\""+url.slice(1)+"\"]") && type != "page")) {
						app.navigation.load.menuInternal(url,back);
					}
				if (_$("div.app-controls")) {
					if (app.history.length > 1 || app.menuHistory.length > 1) {
						_$("div.app-controls div.navigate-back").removeClass("hidden");
					} else {
						_$("div.app-controls div.navigate-back").addClass("hidden");
					}
				}

				} else if (url.length > 1) {
					// External loading
					var xhr = new XMLHttpRequest();
					xhr.addEventListener("error", function() {
						xhr.abort();
					}, false);
					xhr.addEventListener("load", function() {
						var parser = new DOMParser();
						var page = parser.parseFromString(xhr.response, "text/html");

						setTimeout(function() {
							app.navigation.load.menuExternal(page);
							app.navigation.load.pageExternal(page);
							if (_$("div.app-controls")) {
								if (app.history.length > 1 || app.menuHistory.length > 1) {
									_$("div.app-controls div.navigate-back").removeClass("hidden");
								} else {
									_$("div.app-controls div.navigate-back").addClass("hidden");
								}
							}
						}, 10);
					}, false);
					xhr.open('GET',url+"?"+(new Date()).getTime(), true);
					xhr.send(null);
				}

			},
			load: {
				menuInternal: function(url, back) {
					if ($("div.menu[data-menu=\""+url.slice(1)+"\"]")) {
						if ($("div.menu.menu-active")) {
							$("div.menu.menu-active").classList.remove("menu-active");
						}
						$("div.menu[data-menu=\""+url.slice(1)+"\"]").classList.add("menu-active");

						app.navigation.load.navbarInternal($("div.menu[data-menu=\""+url.slice(1)+"\"]").getAttribute("data-menu"));
						app.navigation.load.appbarInternal($("div.menu[data-menu=\""+url.slice(1)+"\"]").getAttribute("data-menu"));

						if ($("div.menu.menu-active").getAttribute("data-initial-page")) {
							var firstPage = $("div.page:not(.page-active)[data-page=\""+$("div.menu.menu-active").getAttribute("data-initial-page")+"\"]");

							if ($("div.page.page-active")) {
								$("div.page.page-active").classList.remove("page-active");
							}
							firstPage.classList.add("page-active");

							if (window.innerWidth > 960) {
								app.activePage = firstPage.getAttribute("data-page");
							}

							if (!back && window.innerWidth > 960) {
								$("div.menu.menu-active div.link[href=\"#"+$("div.menu.menu-active").getAttribute("data-initial-page")+"\"]").classList.add("selected");
							}
						}

						if (!back) {
							app.menuHistory.push(url);
						}
					}
				},
				menuExternal: function(page) {
					if (page.body.querySelector("div.menu")) {
						$("div.menus").appendChild(page.body.querySelector("div.menu").cloneNode(true));

						var firstMenu = $$("div.menu:not(.menu-active)")[0];

						$("div.menu.menu-active").classList.remove("menu-active");
						firstMenu.classList.add("menu-active");

						app.navigation.load.navbarExternal(page, firstMenu.getAttribute("data-menu"));
						app.navigation.load.appbarExternal(page, firstMenu.getAttribute("data-menu"));

						if (window.innerWidth <= 504) {
							app.animation.menuRotateIn(firstMenu.getAttribute("data-menu"));
						} else {
							app.animation.menuSlideIn(firstMenu.getAttribute("data-menu"));
						}

						if (firstMenu.getAttribute("data-initial-page") && window.innerWidth > 960) {
							$("div.menu.menu-active div.link[href=\"#"+firstMenu.getAttribute("data-initial-page")+"\"]").classList.add("selected");
						}

						app.navigation.load.navbarInternal(firstMenu.getAttribute("data-menu"));
						app.navigation.load.appbarInternal(firstMenu.getAttribute("data-menu"));

						app.menuHistory.push("#"+firstMenu.getAttribute("data-menu"));
						app.navigation.initLinks("menu");
					} else {

					}
				},

				pageInternal: function(url,back) {
					if ($("div.page[data-page=\""+url.slice(1)+"\"]")) {
						if ($("div.page.page-active")) {
							$("div.page.page-active").classList.remove("page-active");
						}
						$("div.page[data-page=\""+url.slice(1)+"\"]").classList.add("page-active");

						app.activePage = url.slice(1);

						if ($("div.page[data-page=\""+url.slice(1)+"\"]").classList.contains("menu-hidden") && !back) {
							app.history.push(url);
						}
						app.initPage();
						app.navigation.load.navbarInternal($("div.page[data-page=\""+url.slice(1)+"\"]").getAttribute("data-page"));
						setTimeout(function() {

							app.navigation.load.appbarInternal($("div.page[data-page=\""+url.slice(1)+"\"]").getAttribute("data-page"));

							if (window.innerWidth<=504) {
								app.animation.pageRotateIn(url.slice(1));
							} else {
								app.animation.pageSlideIn(url.slice(1));
							}
						}, (typeof(app.navigation.win10delay) !== "undefined") ? app.navigation.win10delay : 200);
					}
				},
				pageExternal: function(page) {
					if (page.body.querySelector("div.page")) {
						var newPages = [];
						for (var i=0; i<page.querySelectorAll("div.page").length; i++) {
							var pageInsert = true;
							for (var j=0; j<$$("div.page").length; j++) {
								if ($$("div.page")[j].getAttribute("data-page") == page.body.querySelectorAll("div.page")[i].getAttribute("data-page")) {
									pageInsert = false;
									break;
								}
							}

							if (pageInsert) {
								$("div.pages").appendChild(page.body.querySelectorAll("div.page")[i].cloneNode(true));
								app.navigation.load.navbarExternal(page, page.body.querySelectorAll("div.page")[i].getAttribute("data-page"));
								app.navigation.load.appbarExternal(page, page.body.querySelectorAll("div.page")[i].getAttribute("data-page"));
								newPages.push("#"+page.body.querySelectorAll("div.page")[i].getAttribute("data-page"));
							}
						}
						app.history.push(newPages);

						if (page.body.querySelector("div.menu")) {
							if (page.body.querySelector("div.menu").getAttribute("data-initial-page")) {
								if (true) {
									var firstPage = $("div.page:not(.page-active)[data-page=\""+page.body.querySelector("div.menu").getAttribute("data-initial-page")+"\"]");

									if ($("div.page.page-active")) {
										$("div.page.page-active").classList.remove("page-active");
									}

									if (window.innerWidth > 960) {
										//firstPage.classList.add("page-active");
										//app.activePage = page.body.querySelector("div.menu").getAttribute("data-initial-page");
										app.navigation.load.pageInternal("#"+firstPage.getAttribute("data-page"),false);
										setTimeout(function() {
											if (window.innerWidth <= 504) {
												app.animation.pageRotateIn(page.body.querySelector("div.menu").getAttribute("data-initial-page"));
											} else {
												app.animation.pageSlideIn(page.body.querySelector("div.menu").getAttribute("data-initial-page"));
											}
										}, 0);
									}
								}
							} else {
								var firstPage = $$("div.page:not(.page-active)")[0];

								if ($("div.page.page-active")) {
									$("div.page.page-active").classList.remove("page-active");
								}
								firstPage.classList.add("page-active");

								app.navigation.load.navbarInternal(firstPage.getAttribute("data-page"));
								app.navigation.load.appbarInternal(firstPage.getAttribute("data-page"));

								setTimeout(function() {
									if (window.innerWidth <= 504) {
										app.animation.pageRotateIn(firstPage.getAttribute("data-page"));
									} else {
										app.animation.pageSlideIn(firstPage.getAttribute("data-page"));
									}
								}, 0);
							}
						} else {
							var firstPage = $("div.page[data-page=\""+page.body.querySelectorAll("div.page")[0].getAttribute("data-page")+"\"]");

							if ($("div.page.page-active")) {
								$("div.page.page-active").classList.remove("page-active");
							}
							firstPage.classList.add("page-active");

							if (firstPage.getAttribute("data-hide-menu") && firstPage.getAttribute("data-hide-menu") == "true" || window.innerWidth <= 960) {
								firstPage.classList.add("page-fullscreen");
								if ($("div.menus")) {
									$("div.menus").classList.add("hidden");
								}
							} else if (window.innerWidth > 960) {
								app.history.pop();
							}

							app.navigation.load.navbarInternal(firstPage.getAttribute("data-page"));
							app.navigation.load.appbarInternal(firstPage.getAttribute("data-page"));

							app.activePage = firstPage.getAttribute("data-page");

							setTimeout(function() {
								if (window.innerWidth <= 504) {
									app.animation.pageRotateIn(firstPage.getAttribute("data-page"));
								} else {
									app.animation.pageSlideIn(firstPage.getAttribute("data-page"));
								}
							}, 0);
							app.initPage();
						}
						app.navigation.initLinks("page");
					}
				},

				navbarInternal: function(url) {
					if ($("div.navbar") && $("div.navbar header[data-menu=\""+url+"\"]")) {
						$("div.navbar").classList.remove("hidden");
						if ($("div.navbar header.header-active")) {
							$("div.navbar header.header-active").classList.remove("header-active");
						}
						$("div.navbar header[data-menu=\""+url+"\"]").classList.add("header-active");
					} else if ($("div.navbar") && $("div.navbar header[data-page=\""+url+"\"]") && $("div.page[data-page=\""+url+"\"]").getAttribute("data-hide-menu") == "true" || window.innerWidth <= 960 && $("div.navbar") && $("div.navbar header[data-page=\""+url+"\"]")) {
						$("div.navbar").classList.remove("hidden");
						if ($("div.navbar header.header-active")) {
							$("div.navbar header.header-active").classList.remove("header-active");
						}
						$("div.navbar header[data-page=\""+url+"\"]").classList.add("header-active");
					} else if ($("div.navbar") && !$("div.navbar header[data-menu=\""+url+"\"]") && !$("div.navbar header[data-page=\""+url+"\"]")) {
						$("div.navbar").classList.add("hidden");
						if ($("div.navbar header.header-active")) {
							$("div.navbar header.header-active").classList.remove("header-active");
						}
					}
					if ($("div.navbar header[data-hide-phone=\"true\"][data-menu=\""+url+"\"]") && window.innerWidth <= 504) {
						$("div.navbar").classList.add("hidden");
						if ($("div.navbar header.header-active")) {
							$("div.navbar header.header-active").classList.remove("header-active");
						}
					}
				},
				navbarExternal: function(page, url) {
					if (page.querySelector("div.navbar header[data-menu=\""+url+"\"]") && !$("div.navbar header[data-menu=\""+url+"\"]")) {
						$("div.navbar").appendChild(page.querySelector("div.navbar header[data-menu=\""+url+"\"]").cloneNode(true));
					}
					if (page.querySelector("div.navbar header[data-page=\""+url+"\"]") && !$("div.navbar header[data-page=\""+url+"\"]")) {
						$("div.navbar").appendChild(page.querySelector("div.navbar header[data-page=\""+url+"\"]").cloneNode(true));
					}
				},

				appbarInternal: function(url) {
					if ($("div.appbar") && $("div.appbar div.panel[data-menu=\""+url+"\"]")) {
						$("div.appbar").classList.remove("hidden");
						document.body.classList.add("appbar");
						if ($("div.appbar div.panel.panel-active")) {
							$("div.appbar div.panel.panel-active").classList.remove("panel-active");
						}
						$("div.appbar div.panel[data-menu=\""+url+"\"]").classList.add("panel-active");
					} else if ($("div.appbar") && $("div.appbar div.panel[data-page=\""+url+"\"]")) {
						$("div.appbar").classList.remove("hidden");
						document.body.classList.add("appbar");
						if ($("div.appbar div.panel.panel-active")) {
							$("div.appbar div.panel.panel-active").classList.remove("panel-active");
						}
						$("div.appbar div.panel[data-page=\""+url+"\"]").classList.add("panel-active");
					} else if ($("div.appbar") && !$("div.appbar div.panel[data-menu=\""+url+"\"]") && !$("div.appbar div.panel[data-page=\""+url+"\"]")) {
						$("div.appbar").classList.add("hidden");
						document.body.classList.remove("appbar");
						if ($("div.appbar div.panel.panel-active")) {
							$("div.appbar div.panel.panel-active").classList.remove("panel-active");
						}
					}

				},
				appbarExternal: function(page, url) {
					if (page.querySelector("div.appbar div.panel[data-menu=\""+url+"\"]") && !$("div.appbar div.panel[data-menu=\""+url+"\"]")) {
						$("div.appbar").appendChild(page.querySelector("div.appbar div.panel[data-menu=\""+url+"\"]").cloneNode(true));
					}
					if (page.querySelector("div.appbar div.panel[data-page=\""+url+"\"]") && !$("div.appbar div.panel[data-page=\""+url+"\"]")) {
						$("div.appbar").appendChild(page.querySelector("div.appbar div.panel[data-page=\""+url+"\"]").cloneNode(true));
					}

				}
			},
			pageBack: undefined,

			win10delay: undefined,
			menuBack: function() {
				if (app.menuHistory.length > 1) {
					for (var i=0; i<app.history[app.history.length-1].length; i++) {
						$("div.page[data-page=\""+app.history[app.history.length-1][i].slice(1)+"\"]").remove();
						if ($("div.navbar header[data-page=\""+app.history[app.history.length-1][i].slice(1)+"\"]")) {
							$("div.navbar header[data-page=\""+app.history[app.history.length-1][i].slice(1)+"\"]").remove();
						}
						if ($("div.appbar div.panel[data-page=\""+app.history[app.history.length-1][i].slice(1)+"\"]")) {
							$("div.appbar div.panel[data-page=\""+app.history[app.history.length-1][i].slice(1)+"\"]").remove();
						}
					}
					app.history.pop();

					if (window.innerWidth <= 504) {
						app.animation.menuRotateOut($("div.menu.menu-active").getAttribute("data-menu"), null, true);
					}

					setTimeout(function() {
						$("div.menu[data-menu=\""+app.menuHistory[app.menuHistory.length-1].slice(1)+"\"]").remove();
						if ($("div.navbar header[data-menu=\""+app.menuHistory[app.menuHistory.length-1].slice(1)+"\"]")) {
							$("div.navbar header[data-menu=\""+app.menuHistory[app.menuHistory.length-1].slice(1)+"\"]").remove();
						}
						if ($("div.appbar div.panel[data-menu=\""+app.menuHistory[app.menuHistory.length-1].slice(1)+"\"]")) {
							$("div.appbar div.panel[data-menu=\""+app.menuHistory[app.menuHistory.length-1].slice(1)+"\"]").remove();
						}
						app.menuHistory.pop();

						app.navigation.loadPage(app.menuHistory[app.menuHistory.length-1], "menu", true);

						if (window.innerWidth <= 504) {
							setTimeout(function() {
								app.animation.menuRotateIn($("div.menu.menu-active").getAttribute("data-menu"), true);
							}, 200);
						} else {
							for (var i=0; i<$$("header h1").length; i++) {
								$$("header h1")[i].removeAttribute("style");
							}
							for (var i=0; i<$$("div.tile").length; i++) {
								$$("div.tile")[i].removeAttribute("style");
							}
							app.animation.pageSlideIn($("div.page.page-active").getAttribute("data-page"));
						}
					}, (window.innerWidth <= 504) ? ((typeof(app.navigation.win10delay) !== "undefined") ? app.navigation.win10delay : app.animation.animationDuration) : 0);
				}
			},
			pageToMenu: function() {
				if (app.history.length > 1) {
					if (window.innerWidth <= 504) {
						app.animation.pageRotateOutBack($("div.page.page-active").getAttribute("data-page"));
					}
					setTimeout(function() {
						if ($("div.navbar header[data-page=\""+$("div.page.page-active").getAttribute("data-page")+"\"]")) {
							$("div.navbar header[data-page=\""+$("div.page.page-active").getAttribute("data-page")+"\"]").remove();
						}
						app.history.pop();
						if ($("div.page.page-active") && $("div.page.page-active").getAttribute("data-hide-menu") && $("div.page.page-active").getAttribute("data-hide-menu") == "true") {
							if (app.history[0].indexOf($("div.page.page-active").getAttribute("data-page")) < 0) {
								$("div.page.page-active").remove();
							}
						}

						if ($("div.page.page-active")) {
							for (var i=0; i<$$("div.page.page-active").length; i++) {
								$$("div.page.page-active")[i].classList.remove("slide-in");
								$$("div.page.page-active")[i].classList.remove("page-active");
							}
						}

						if ($("div.menu.menu-active div.link.selected")) {
							$("div.menu.menu-active div.link.selected").classList.remove("selected");
						}

						if ($("div.menus.hidden")) {
							$("div.menus.hidden").classList.remove("hidden");
						}

						if ($("div.menu.menu-active") && $("div.menu.menu-active").getAttribute("data-initial-page")) {
							if ($("div.page[data-page=\""+app.activePage+"\"]")) {
								$("div.page[data-page=\""+app.activePage+"\"]").classList.add("page-active");
							}
							if (window.innerWidth > 960) {
								app.activePage = $("div.menu.menu-active").getAttribute("data-initial-page");
								app.navigation.load.pageInternal("#"+app.activePage,false);
							} else if (window.innerWidth <= 960) {
								app.activePage = undefined;
							}
						}
						app.navigation.load.navbarInternal($("div.menu.menu-active").getAttribute("data-menu"));
						app.navigation.load.appbarInternal($("div.menu.menu-active").getAttribute("data-menu"));

						if (_$("div.app-controls")) {
							if (app.history.length > 1 || app.menuHistory.length > 1) {
								_$("div.app-controls div.navigate-back").removeClass("hidden");
							} else {
								_$("div.app-controls div.navigate-back").addClass("hidden");
							}
						}

						if (window.innerWidth > 960) {
							app.activePage = undefined;
							//app.navigation.load.pageInternal("#"+$("div.menu.menu-active").getAttribute("data-initial-page"),false);
						} else if (window.innerWidth <= 504) {
							setTimeout(function() {
								app.animation.menuRotateIn($("div.menu.menu-active").getAttribute("data-menu"), true);
							}, 200);
						}
					}, (window.innerWidth<=504) ? ((typeof(app.navigation.win10delay) !== "undefined") ? app.navigation.win10delay : 500) : 0);
				}
			},
			initLinks: function(type) {
				if (type == "menu") {
					if ($("div.menu.menu-active [href]")) {
						for (var i=0; i<$$("div.menu.menu-active [href]").length; i++) {
							$$("div.menu.menu-active [href]")[i].onclick = function() {
								var el = this;

								if (window.innerWidth <= 504) {
									app.animation.menuRotateOut($("div.menu.menu-active").getAttribute("data-menu"), el);

									setTimeout(function() {
										app.navigation.loadPage(el.getAttribute("href"));
									}, (typeof(app.navigation.win10delay) !== "undefined" && !$("div.menu.menu-active").classList.contains("tiles")) ? app.navigation.win10delay : app.animation.animationDuration);
								} else {
									app.navigation.loadPage(el.getAttribute("href"));
								}

								if (el.getAttribute("href")[0] == "#" && el.getAttribute("href").length > 1 && window.innerWidth > 960) {
									if ($("div.menu.menu-active div.link.selected")) {
										$("div.menu.menu-active div.link.selected").classList.remove("selected");
									}
									el.classList.add("selected");
								} else if (el.getAttribute("href")[0] == "#" && el.getAttribute("href").length > 1 && window.innerWidth <= 960) {
									var delay = ($$("div.menu.menu-active div.tile") && window.innerWidth<=504) ? $$("div.menu.menu-active div.tile").length*25+1000 : 0;
									delay = ($$("div.menu.menu-active div.tile") && window.innerWidth<=504) ? $$("div.menu.menu-active div.link").length*25+1000 : delay;
									delay = (typeof(app.navigation.win10delay) !== "undefined") ? app.navigation.win10delay : delay;

									setTimeout(function() {
										el.parentNode.parentNode.classList.add("hidden");
									}, delay);
								}
							};
						}
					}
					if ($("div.menu.menu-active div.navigate-back")) {
						$("div.menu.menu-active div.navigate-back").onclick = function() {
							app.navigation.menuBack();
						};
					}
				}
				if (type == "page") {
					if ($("div.page.page-active div.navigate-back")) {
						$("div.page.page-active div.navigate-back").onclick = function() {
							app.navigation.pageToMenu();
						};
					}
					if ($("div.page.page-active [href]:not(.external)")) {
						for (var i=0; i<$$("div.page.page-active [href]:not(.external)").length; i++) {
							$$("div.page.page-active [href]:not(.external)")[i].onclick = function() {
								var el = this;

								app.navigation.loadPage(el.getAttribute("href"));
							};
						}
					}
				}
			}
		};
		app.animation = {
			// Windows Desktop Animations
			menuSlideIn: function(menuPage, view) {
				_$("div.view.view-active div.menu").removeAttr("style");
				var menuEl = document.querySelector(view + " div.menu[data-menu=\""+menuPage+"\"]");
				menuEl.classList.remove("slide-in");
				setTimeout(function() {
					menuEl.classList.add("slide-in");
					new Velocity(menuEl, {
						translateX: [0,50],
						opacity: [1,0]
					}, {
						easing: [0.1, 0.9, 0.2, 1],
						duration: 1000,
						delay: 100
					});

					setTimeout(function() {
						menuEl.classList.add("done");
					}, 1000);
				}, 100);
			},
			pageSlideIn: function(page, timeout, split) {
				timeout = (typeof timeout !== 'undefined') ? timeout : true;
				var pageEl = document.querySelector("div.view.view-active div.page[data-page=\""+page+"\"]");
				if (!pageEl.classList.contains("slide-in")) {

					while ($("div.view.view-active div.page.slide-in")) {
						$("div.view.view-active div.page.slide-in").classList.remove("slide-in");
					}
					_$("div.view.view-active div.page header").removeAttr("style");
					_$("div.view.view-active div.page div.content").removeAttr("style");

					setTimeout(function() {
						pageEl.classList.add("slide-in");
						new Velocity(pageEl.querySelector("header"), {
							translateX: [0,50],
							opacity: [1,0]
						}, {
							easing: [0.1, 0.9, 0.2, 1],
							duration: 1000,
							delay: 100
						});

						for (var i=0; i<pageEl.querySelectorAll("div.content").length; i++) {
							new Velocity(pageEl.querySelectorAll("div.content")[i], "stop");
							new Velocity(pageEl.querySelectorAll("div.content")[i], {
								translateX: [0,50],
								opacity: [1,0]
							}, {
								easing: [0.1, 0.9, 0.2, 1],
								duration: 1000,
								delay: 260
							});
						}
					}, (timeout)?200:0);
				}
			},

			// Windows Phone Animations
			animationDuration: 0,
			menuRotateIn: function(menuPage, reverse) {
				var menu = $("div.menu[data-menu=\""+menuPage+"\"]");

				if (menu.classList.contains("tiles")) {
					app.animation.tileRotateIn(menuPage, reverse);
				} else {
					if (menu) {
						var els = [];
						for (var i=0;i<menu.querySelectorAll("div.link p.label").length;i++) {
							var min = (cumulativeOffset(menu.querySelectorAll("div.link p.label")[i]).top + menu.querySelectorAll("div.link p.label")[i].offsetHeight) - menu.parentNode.scrollTop;
							var max = cumulativeOffset(menu.querySelectorAll("div.link p.label")[i]).top - menu.parentNode.scrollTop;

							if (min >= 53 && max < window.innerHeight) {
								els.push(menu.querySelectorAll("div.link p.label")[i]);
							} else {
								menu.querySelectorAll("div.link p.label")[i].style.opacity = 1;
							}
							app.animation.animationDuration = (els.length*25)+800;
						}
						if (reverse) {
							els.reverse();
							console.log(menu.getAttribute("data-scroll-y"));
							if (menu.getAttribute("data-scroll-y")) {
								$("div.menus").scrollTop = parseInt(menu.getAttribute("data-scroll-y"));
							} else {
								scrollTo($("div.menus"),0,0);
							}
						} else {
							scrollTo($("div.menus"),0,0);
						}

						if ($("div.navbar") && $("div.navbar header[data-menu=\""+menuPage+"\"]")) {
							new Velocity($("div.navbar header[data-menu=\""+menuPage+"\"]"), {
								rotateY: (!reverse) ? [0, 90] : [[0], -80],
								translateX: (!reverse) ? [0, 150] : [[0], -50],
								translateZ: (!reverse) ? [0, 50] : [[0], 50],
								opacity: [1,1],
							}, {
								duration: 500,
								easing: [0.1, 0.9, 0.2, 1],
								delay: (!reverse) ? 0 : els.length*25
							});
						}
						for (var j=0;j<els.length;j++) {
							var delay = (j+1)*25;

							els[j].style.visibility = "";

							new Velocity(els[j], {
								rotateY: (!reverse) ? [0, 90] : [[0], -80],
								translateX: (!reverse) ? [0, 50] : [[0], -50],
								translateZ: (!reverse) ? [0, 50] : [[0], -50],
								opacity: [1,1],
							}, {
								duration: 500,
								easing: [0.1, 0.9, 0.2, 1],
								delay: delay
							});
						}
						setTimeout(function() {
							menu.classList.add("slide-in");
						}, app.animation.animationDuration);
					}
				}
			},
			menuRotateOut: function(menuPage, element, reverse) {
				var menu = $("div.menu[data-menu=\""+menuPage+"\"]");

				if (menu.classList.contains("tiles")) {
					app.animation.tileRotateOut(menuPage, element, reverse);
				} else {
					if (menu) {
						var els = [];
						for (var i=0;i<menu.querySelectorAll("div.link p.label").length;i++) {
							var min = (cumulativeOffset(menu.querySelectorAll("div.link p.label")[i]).top + menu.querySelectorAll("div.link p.label")[i].offsetHeight) - menu.parentNode.scrollTop;
							var max = cumulativeOffset(menu.querySelectorAll("div.link p.label")[i]).top - menu.parentNode.scrollTop;

							if (min >= 53 && max < window.innerHeight) {
								els.push(menu.querySelectorAll("div.link p.label")[i]);
							} else {
								menu.querySelectorAll("div.link p.label")[i].style.opacity = 0;
							}
							app.animation.animationDuration = (els.length*25)+ ((!reverse) ? 800 : 350);
						}
						if (reverse) {
							els.reverse();
						} else {
							menu.setAttribute("data-scroll-y", $("div.menus").scrollTop);
						}

						if ($("div.navbar") && $("div.navbar header[data-menu=\""+menuPage+"\"]")) {
							new Velocity($("div.navbar header[data-menu=\""+menuPage+"\"]"), {
								rotateY: (!reverse) ? [-90, 0] : [90, 0],
								translateX: (!reverse) ? [-50, 0] : [50, 0],
								translateZ: (!reverse) ? [50, 0] : [50, 0],
								opacity: (!reverse) ? [1,1] : [0, "easeInExpo", 1],
							}, {
								duration: (!reverse) ? 500 : 150,
								easing: [0.895, 0.03, 0.685, 0.22],
								delay: (!reverse) ? 0 : els.length*25
							});
						}
						for (var j=0;j<els.length;j++) {
							var delay = (j+1)*25;
							var el = els[j].parentNode;

							if (el == element) {
								delay = (menu.querySelectorAll("div.link").length*25)+300;
							}

							new Velocity(els[j], {
								rotateY: (!reverse) ? [-90, 0] : [90, 0],
								translateX: (!reverse) ? [-50, 0] : [50, 0],
								translateZ: (!reverse) ? [50, 0] : [50, 0],
								opacity: (!reverse) ? [1,1] : [0, "easeInExpo", 1],
							}, {
								duration: (!reverse) ? 500 : 150,
								easing: [0.895, 0.03, 0.685, 0.22],
								delay: delay,
								complete: function(elements) {
									elements[0].style.visibility = "hidden";
								}
							});
						}
					}
				}
			},

			tileRotateIn: function(menuPage, reverse) {
				var menu = $("div.menu[data-menu=\""+menuPage+"\"]");

				if (menu) {
					var els = [];
					for (var i=0;i<menu.querySelectorAll("div.tile").length;i++) {
						var min = (cumulativeOffset(menu.querySelectorAll("div.tile")[i]).top + menu.querySelectorAll("div.tile")[i].offsetHeight) - menu.parentNode.scrollTop;
						var max = cumulativeOffset(menu.querySelectorAll("div.tile")[i]).top - menu.parentNode.scrollTop;

						if (min >= 0 && max < window.innerHeight) {
							els.push(menu.querySelectorAll("div.tile")[i]);
						} else {
							menu.querySelectorAll("div.tile")[i].style.opacity = 1;
							menu.querySelectorAll("div.tile")[i].style.transform = "";
							menu.querySelectorAll("div.tile")[i].style.webkitTransform = "";
						}
						app.animation.animationDuration = (els.length*25)+800;
					}
					//if (reverse) {
						els.reverse();
					//}

					new Velocity(menu.querySelector("header h1"), {
						rotateY: (!reverse) ? [0, 90] : [[0], -80],
						translateX: (!reverse) ? [0, 50] : [[0], -50],
						translateZ: (!reverse) ? [0, 50] : [[0], 50],
						opacity: [1,1],
					}, {
						duration: 500,
						easing: [0.1, 0.9, 0.2, 1],
						delay: (!reverse) ? 0 : els.length*25
					});
					for (var j=0;j<els.length;j++) {
						var delay = (j+1)*25;

						els[j].classList.add("animating");
						els[j].style.webkitTransformOrigin = "-" + cumulativeOffset(els[j]).left + "px 0px";

						new Velocity(els[j], {
							rotateY: (!reverse) ? [0, 90] : [[0], -80],
							translateX: (!reverse) ? [0, 50] : [[0], -50],
							translateZ: (!reverse) ? [0, 50] : [[0], -50],
							opacity: [1,1],
						}, {
							duration: 500,
							easing: [0.1, 0.9, 0.2, 1],
							delay: delay,
							complete: function(elements) {
								elements[0].classList.remove("animating");

								setTimeout(function() {
									elements[0].style.webkitTransform = "";
									elements[0].style.webkitTransformOrigin = "";
								}, els.length*25);
							}
						});
					}
					setTimeout(function() {
						menu.classList.add("slide-in");
					}, els.length*25+800);
				}
			},
			tileRotateOut: function(menuPage, element, reverse) {
				var menu = $("div.menu[data-menu=\""+menuPage+"\"]");

				if (menu) {
					var els = [];
					for (var i=0;i<menu.querySelectorAll("div.tile").length;i++) {
						var min = (cumulativeOffset(menu.querySelectorAll("div.tile")[i]).top + menu.querySelectorAll("div.tile")[i].offsetHeight) - menu.parentNode.scrollTop;
						var max = cumulativeOffset(menu.querySelectorAll("div.tile")[i]).top - menu.parentNode.scrollTop;

						if (min >= 0 && max < window.innerHeight) {
							els.push(menu.querySelectorAll("div.tile")[i]);
						} else {
							menu.querySelectorAll("div.tile")[i].style.opacity = 0;
						}
						app.animation.animationDuration = (els.length*25)+ ((!reverse) ? 1000 : 350);
					}
					//if (reverse) {
						els.reverse();
					//}

					new Velocity(menu.querySelector("header h1"), {
						rotateY: (!reverse) ? [-90, 0] : [90, 0],
						translateX: (!reverse) ? [-50, 0] : [50, 0],
						translateZ: (!reverse) ? [50, 0] : [50, 0],
						opacity: (!reverse) ? [1,1] : [0, "easeInExpo", 1],
					}, {
						duration: (!reverse) ? 500 : 150,
						easing: [0.895, 0.03, 0.685, 0.22],
						delay: (!reverse) ? 0 : els.length*25
					});
					for (var j=0;j<els.length;j++) {
						var delay = (j+1)*25;
						if (els[j] == element) {
							delay = 250;
						}
						els[j].style.webkitTransformOrigin = "-" + cumulativeOffset(els[j]).left + "px 0px";

						new Velocity(els[j], {
							rotateY: (!reverse) ? [-90, 0] : [90, 0],
							translateX: (!reverse) ? [-50, 0] : [50, 0],
							translateZ: (!reverse) ? [50, 0] : [50, 0],
							opacity: (!reverse) ? [1,1] : [0, "easeInExpo", 1],
						}, {
							duration: (!reverse) ? 500 : 150,
							easing: [0.895, 0.03, 0.685, 0.22],
							delay: delay
						});
					}
				}
			},

			pageRotateIn: function(pageName) {
				var page = $("div.page[data-page=\""+pageName+"\"]");
				page.parentNode.style.webkitPerspectiveOriginY = window.innerHeight/2+"px";

				if ($("div.navbar") && $("div.navbar header[data-page=\""+pageName+"\"]")) {
					$("div.navbar header[data-page=\""+pageName+"\"]").classList.remove("slide-in");
				}

				setTimeout(function() {
					scrollTo($("div.pages"),0,0);
					if (page) {
						if ($("div.navbar") && $("div.navbar header[data-page=\""+pageName+"\"]")) {
							new Velocity($("div.navbar header[data-page=\""+pageName+"\"]"), {
								rotateY: [0, 90],
								translateX: [0, 150],
								translateZ: [0, 50],
								opacity: [1,1],
							}, {
								duration: 1000,
								easing: [0.1, 0.9, 0.2, 1]
							});
						}

						page.classList.remove("slide-out");
						page.classList.remove("slide-in-back");
						page.classList.remove("slide-out-back");
						page.classList.add("slide-in");
					}
				}, (typeof(app.navigation.win10delay) !== "undefined") ? app.navigation.win10delay : 200);
			},
			pageRotateOut: function(pageName) {
				var page = $("div.page[data-page=\""+pageName+"\"]");
				page.parentNode.style.webkitPerspectiveOriginY = window.innerHeight/2+"px";
				page.setAttribute("data-scroll-y", $("div.pages").scrollTop);
				if (page) {
					if ($("div.navbar") && $("div.navbar header[data-page=\""+pageName+"\"]")) {
						new Velocity($("div.navbar header[data-page=\""+pageName+"\"]"), {
							rotateY: [-90, 0],
							translateX: [-50, 0],
							translateZ: [50, 0],
							opacity: [1,1],
						}, {
							duration: 500,
							easing: [0.895, 0.03, 0.685, 0.22]
						});
					}

					page.classList.remove("slide-in");
					page.classList.remove("slide-in-back");
					page.classList.remove("slide-out-back");
					page.classList.add("slide-out");

					setTimeout(function() {
						page.classList.remove("slide-out");
					}, 500);
				}
			},
			pageRotateInBack: function(pageName) {
				var page = $("div.page[data-page=\""+pageName+"\"]");
				page.parentNode.style.webkitPerspectiveOriginY = window.innerHeight/2+"px";

				if (page) {

					if ($("div.navbar") && $("div.navbar header[data-page=\""+pageName+"\"]")) {
						new Velocity($("div.navbar header[data-page=\""+pageName+"\"]"), {
							rotateY: [[0], -80],
							translateX: [[0], -50],
							translateZ: [[0], 50],
							opacity: [1,1],
						}, {
							duration: 500,
							easing: [0.1, 0.9, 0.2, 1],
						});
					}

					page.classList.remove("slide-in");
					page.classList.remove("slide-out");
					page.classList.remove("slide-out-back");
					page.classList.add("slide-in-back");
				}
			},
			pageRotateOutBack: function(pageName) {
				var page = $("div.page[data-page=\""+pageName+"\"]");
				page.parentNode.style.webkitPerspectiveOriginY = window.innerHeight/2+"px";

				if (page) {
					if ($("div.navbar") && $("div.navbar header[data-page=\""+pageName+"\"]")) {
						new Velocity($("div.navbar header[data-page=\""+pageName+"\"]"), {
							rotateY: [90, 0],
							translateX: [50, 0],
							translateZ: [50, 0],
							opacity: [0, "easeInExpo", 1],
						}, {
							duration: 150,
							easing: [0.895, 0.03, 0.685, 0.22],
						});
					}

					page.classList.remove("slide-in");
					page.classList.remove("slide-out");
					page.classList.remove("slide-in-back");
					page.classList.add("slide-out-back");

					setTimeout(function() {
						page.classList.remove("slide-out-back");
					}, 500);
				}
			},
		};
		app.design = {
			init: function() {
				if ($("div.theme-color")) {
					$("div.theme-selector").innerHTML = "";
				}
				if ($("div.theme-selector")) {
					var colors = ((window.isPhone)) ? app.params.availableThemesPhone : app.params.availableThemesWin;

					if (window.isPhone) {
						var colorWrapper = document.createElement("div");
						colorWrapper.className = "theme-selector-wrapper";
					} else {
						var indicator = document.createElement("div");
						indicator.className = "indicator";
						$("div.theme-selector").appendChild(indicator);
					}

					for (var i=0; i<colors.length; i++) {
						var color = document.createElement("div");
						color.className = "theme-color";

						if (window.isPhone) {
							color.setAttribute("data-tint-wp", app.params.availableThemesPhone[i]);
							color.innerHTML = app.params.availableThemesPhone[i].replace(/^[a-z]/, function(m){ return m.toUpperCase(); }).replace(/Lumia-green/g, "Lumia Green").replace(/Lumia-purple/g, "Lumia Purple");
							$("div.theme-selector").appendChild(color);
						} else {
							color.setAttribute("data-tint-win", app.params.availableThemesWin[i]);
							$("div.theme-selector").appendChild(color);
						}
					}
				}
				var currentThemeWin = document.body.getAttribute("data-tint-win");
				var index = app.params.availableThemesWin.indexOf(currentThemeWin);

				if ($("div.theme-selector") && !window.isPhone) {
					$("div.theme-selector").querySelector("div.indicator").style.left = (index*30)+"px";

					var colorElements = $("div.theme-selector").querySelectorAll("div.theme-color");
					for (var i=0; i<colorElements.length;i++) {
						colorElements[i].addEventListener("click", function() {
							document.body.setAttribute("data-tint-win", this.getAttribute("data-tint-win"));
							var currentThemeWin = document.body.getAttribute("data-tint-win");
							var index = app.params.availableThemesWin.indexOf(currentThemeWin);
							$("div.theme-selector").querySelector("div.indicator").style.left = (index*30)+"px";
						});
					}
				} else if ($("div.theme-selector")) {
					$("div.theme-selector").addEventListener("click", function() {
						app.design.call();
					});
				}
			},
			initTheme: function() {
				if ($("div.list.theme")) {
					if (window.isPhone) {
						$("div.list.theme select option:checked").removeAttribute("selected");
						$("div.list.theme select option[value=\""+document.body.getAttribute("data-bg-wp")+"\"]").setAttribute("selected", "");
					} else {
						$("div.list.theme select option:checked").removeAttribute("selected");
						$("div.list.theme select option[value=\""+document.body.getAttribute("data-bg")+"\"]").setAttribute("selected", "");
					}

					if ($("div.list.theme div.select-inner-wrapper")) {
						var el = $("div.list.theme div.select-inner-wrapper");
						el.parentNode.removeChild(el);
					}
				}
				if ($("div.radio#theme_light")) {
					if (document.body.getAttribute((window.innerWidth<=504?"data-bg-wp":"data-bg")) == "light") {
						$("div.radio#theme_light input[type=\"radio\"]").setAttribute("checked", true);
						if ($("div.radio#theme_dark")) {
							$("div.radio#theme_dark input[type=\"radio\"]").removeAttribute("checked");
						}
					}
				}
				if ($("div.radio#theme_dark")) {
					if (document.body.getAttribute((window.innerWidth<=504?"data-bg-wp":"data-bg")) == "dark") {
						$("div.radio#theme_dark input[type=\"radio\"]").setAttribute("checked", true);
						if ($("div.radio#theme_light")) {
							$("div.radio#theme_light input[type=\"radio\"]").removeAttribute("checked");
						}
					}
				}
				if ($("div.switch.more-tiles")) {
					if (document.body.classList.contains("more-tiles")) {
						$("div.switch.more-tiles input[type=\"checkbox\"]").setAttribute("checked", true);
					} else {
						$("div.switch.more-tiles input[type=\"checkbox\"]").removeAttribute("checked");
					}
				}
			},
			changeTheme: function(element) {
				if (!document.body.classList.contains("colored") && app.params.theming) {
					setTimeout(function() {
						if (window.innerWidth > 504) {
							document.body.setAttribute('data-bg', element.options[element.selectedIndex].value);
						} else {
							document.body.setAttribute('data-bg-wp', element.options[element.selectedIndex].value);
						}
					}, 200);
				}
			},
			changeThemeByValue: function(value) {
				if (!document.body.classList.contains("colored") && app.params.theming) {
					if (window.innerWidth > 504) {
						document.body.setAttribute('data-bg', value);
					} else {
						document.body.setAttribute('data-bg-wp', value);
					}
				}
			},
			coloredPages: function(element) {
				if (app.params.theming && !window.isPhone) {
					if (element.checked) {
						document.body.classList.add("colored");
						app.previousTheme = document.body.getAttribute("data-bg");
					} else {
						document.body.classList.remove("colored");
						document.body.setAttribute("data-bg", app.previousTheme);
					}
					if (document.body.classList.contains("colored")) {
						document.body.setAttribute("data-bg", "dark");

						for (var i=0; i<$$("div.list.theme").length; i++) {
							$$("div.list.theme")[i].classList.add("disabled");
						}
					} else {
						for (var j=0; j<$$("div.list.theme").length; j++) {
							$$("div.list.theme")[j].classList.remove("disabled");
						}
					}
				}
			},
			call: function() {
				var colorWrapper = document.createElement("div");
				colorWrapper.className = "theme-overlay";
				for (var i=0; i<Math.ceil(app.params.availableThemesPhone.length/4); i++) {
					var colorContainer = document.createElement("div");
					colorContainer.className = "theme-color-wrapper";

					for (var j=1; j<=app.params.availableThemesPhone.length/5; j++) {
						if (typeof(app.params.availableThemesPhone[j+(4*i)-1]) !== "undefined") {
							var color = document.createElement("div");
							color.className = "theme-color";
							color.setAttribute("data-tint-wp", app.params.availableThemesPhone[j+(4*i)-1]);
							color.addEventListener("click", function() {
								var el = this;
								document.body.setAttribute("data-tint-wp", el.getAttribute("data-tint-wp"));

								if (document.getElementById("current-theme")) {
									document.getElementById("current-theme").innerHTML = el.getAttribute("data-tint-wp").replace(/lumia-green/g, "Lumia Green").replace(/lumia-purple/g, "Lumia Purple");
								}
								app.design.hide();
							});
							colorContainer.appendChild(color);
						}
					}
					colorWrapper.appendChild(colorContainer);
				}
				setTimeout(function() {
					for (var i=1; i<=app.params.availableThemesPhone.length; i++) {
						new Velocity($$("div.theme-overlay div.theme-color")[i-1], {
							rotateX:["0deg","90deg"],
							opacity: [[1],1000]
						}, {
							duration: 75,
							easing: "ease-in",
							delay: Math.ceil(i/4)*25
						});
					}
				}, 20);
				document.body.appendChild(colorWrapper);
			},
			hide: function() {
				for (var i=0; i<$$("div.theme-overlay div.theme-color").length; i++) {
					$$("div.theme-overlay div.theme-color")[i].classList.add("slide-out");
				}
				for (var i=1; i<=app.params.availableThemesPhone.length; i++) {
					new Velocity($$("div.theme-overlay div.theme-color")[i-1], {
						rotateX:["-90deg","0deg"],
						opacity: [[1],1000]
					}, {
						duration: 75,
						easing: "ease-out",
						delay: Math.ceil(i/4)*25
					});
				}
				setTimeout(function() {
					if ($("div.theme-overlay")) {
						document.body.removeChild($("div.theme-overlay"));
					}
				}, (Math.ceil(app.params.availableThemesPhone.length/4)*25)+75);
			}
		};
		app.tileSizes = {
			width: (window.innerWidth-30),
			height: 140,

			//        w     h       more-tiles
			small: 	[[65,	65],	[0,0]],
			normal: [[140,	140],	[0,0]],
			wide: 	[[290,	140],	[0,0]],
			large: 	[[290,	290],	[0,0]],

			tileSpace: 10
		};
		app.tiles = {
			sizes: {
				width: (window.innerWidth-30),
				height: 140,

				small: {w: 65, h: 65},
				normal: {w: 140, h: 140},
				wide: {w: 290, h: 140},
				large: {w: 290, h: 290},

				tileSpace: 10
			},

			init: function(menu) {
				while ($("div.menu[data-menu=\""+menu+"\"] div.tile-row")) {
					$("div.menu[data-menu=\""+menu+"\"] div.tile-row").remove();
				}
				var tileRequest = new XMLHttpRequest();
				tileRequest.open("GET", "tiles.json?"+(new Date()).getTime(), false);
				tileRequest.send(null);
				var tilesResult = JSON.parse(tileRequest.responseText);
				app.tiles.loadedTiles = tilesResult;

				var x = app.tiles.sizes.width, y = app.tiles.sizes.height;

				var smallPrevious = false;
				if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")]) {
					for (var i=0; i<tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")].length; i++) {
						var container;
						if ($$("div.menu[data-menu=\""+menu+"\"] div.tile-row").length < 1) {
							container = document.createElement("div");
							container.className = "tile-row";
						} else if (x <= 0) {
							container = document.createElement("div");
							container.className = "tile-row";
						}
						if (x <= 0) {
							x = app.tiles.sizes.width;
						}
						if (y <= 0) {
							y = app.tiles.sizes.height;
						}

						if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].type == "bar") {
							for (var j=0; j<tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].tiles.length; j++) {
								var tile = document.createElement("div");
								tile.className = "tile small";
								if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].tiles[j].href) {
									tile.setAttribute("href", tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].tiles[j].href);
								}

								if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].tiles[j].label) {
									var tileLabel = document.createElement("p");
									tileLabel.className = "label";
									tileLabel.innerHTML = tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].tiles[j].label;
									tile.appendChild(tileLabel);
								}

								container.appendChild(tile);
							}

							$("div.menu[data-menu=\""+menu+"\"]").appendChild(container);
						}

						if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].type == "square") {
							if (x == app.tiles.sizes.width || x < app.tiles.sizes.normal.w) {
								x = app.tiles.sizes.width;
								container = document.createElement("div");
								container.className = "tile-row";
							}

							var tileContainer = document.createElement("div");
							tileContainer.className = "tile medium tile-container";
							for (var j=0; j<tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].tiles.length; j++) {
								var tile = document.createElement("div");
								tile.className = "tile small";
								if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].tiles[j].href) {
									tile.setAttribute("href", tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].tiles[j].href);
								}
								if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].tiles[j].label) {
									var tileLabel = document.createElement("p");
									tileLabel.className = "label";
									tileLabel.innerHTML = tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].tiles[j].label;
									tile.appendChild(tileLabel);
								}
								tileContainer.appendChild(tile);
							}

							x -= app.tiles.sizes.normal.w + app.tiles.sizes.tileSpace;
							container.appendChild(tileContainer);
							$("div.menu[data-menu=\""+menu+"\"]").appendChild(container);
						}

						if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].type != "bar" && tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].type != "square") {
							if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].size == "small") {
								if (x == app.tiles.sizes.width || x < app.tiles.sizes.small.w-1) {
									if (!smallPrevious) {
										x = app.tiles.sizes.width;
										container = document.createElement("div");
										container.className = "tile-row";
									}
								}

								var tile = document.createElement("div");
								tile.className = "tile small";

								if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].href) {
									tile.setAttribute("href", tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].href);
								}
								if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].label) {
									var tileLabel = document.createElement("p");
									tileLabel.className = "label";
									tileLabel.innerHTML = tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].label;
									tile.appendChild(tileLabel);
								}
								container.appendChild(tile);

								y -= app.tiles.sizes.small.h + app.tiles.sizes.tileSpace;
								if (smallPrevious) {
									x -= app.tiles.sizes.small.w + app.tiles.sizes.tileSpace;
								}
								smallPrevious = true;
							}

							if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].size == "normal") {
								if (x == app.tiles.sizes.width || x < app.tiles.sizes.normal.w-1) {
									x = app.tiles.sizes.width;
									container = document.createElement("div");
									container.className = "tile-row";
								}

								var tile = document.createElement("div");
								tile.className = "tile medium";

								if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].href) {
									tile.setAttribute("href", tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].href);
								}
								if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].label) {
									var tileLabel = document.createElement("p");
									tileLabel.className = "label";
									tileLabel.innerHTML = tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].label;
									tile.appendChild(tileLabel);
								}
								container.appendChild(tile);

								x -= app.tiles.sizes.normal.w + app.tiles.sizes.tileSpace;
								smallPrevious = false;
							}

							if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].size == "wide") {
								//if (x == app.tiles.sizes.width || x < app.tiles.sizes.wide.w) {
									x = app.tiles.sizes.width;
									container = document.createElement("div");
									container.className = "tile-row";
								//}

								var tile = document.createElement("div");
								tile.className = "tile wide";
								if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].href) {
									tile.setAttribute("href", tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].href);
								}
								if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].label) {
									var tileLabel = document.createElement("p");
									tileLabel.className = "label";
									tileLabel.innerHTML = tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].label;
									tile.appendChild(tileLabel);
								}
								container.appendChild(tile);

								//x -= app.tiles.sizes.wide.w;
							}

							if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].size == "large") {
								//if (x == app.tiles.sizes.width || x < app.tiles.sizes.large.w) {
									x = app.tiles.sizes.width;
									container = document.createElement("div");
									container.className = "tile-row";
								//}

								var tile = document.createElement("div");
								tile.className = "tile large";
								if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].href) {
									tile.setAttribute("href", tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].href);
								}
								if (tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].label) {
									var tileLabel = document.createElement("p");
									tileLabel.className = "label";
									tileLabel.innerHTML = tilesResult[$("div.menu[data-menu=\""+menu+"\"]").getAttribute("data-tiles")][i].label;
									tile.appendChild(tileLabel);
								}
								container.appendChild(tile);

								//x -= app.tiles.sizes.large.w;
							}

							$("div.menu[data-menu=\""+menu+"\"]").appendChild(container);
						}
						//app.navigation.initLinks("menu");
					}
				}
			},
			initBackground: function(menu) {
				for (var i=0;i<$$("div.tile").length;i++) {
					$$("div.tile")[i].style.backgroundPositionX = -cumulativeOffset($$("div.tile")[i]).left + "px";
					$$("div.tile")[i].style.backgroundPositionY = -cumulativeOffset($$("div.tile")[i]).top + "px";
				}
			}
		};
	app.pluginAPI = {
		init: function () {
			app.plugins = MetroUI.prototype.plugins;
			for (var plugin in app.plugins) {
				var p = app.plugins[plugin](app);
			}
		}
	};
	app.pluginAPI.init();
		//app.init();
		/*setTimeout(function() {
			app.triggerPageCallbacks("init",_$("div.page:first-child").attr("data-page"),{});
		}, 50);*/

		if (app.params.useLegacyInit) {
			app.tiles.init("index");
			app.init();
		} else {
			app.init2();
		}
	};
	MetroUI.prototype.plugins = {};
})();

(function() {
	"use strict";
	MetroUI.View = function(params) {
		var view = this;

		view.params = {
			app: undefined,
			selector: ""
		};
		for (var param in params) {
			view.params[param] = params[param];
		}

		view.menuNames = [];
		view.menus = [];	// Menus w/o page history, separate history inside menu object
		view.pageNames = [];
		view.pages = [];	// Pages w/o menus

		view.pageCallbacks = {};

		view.history = [];
		view.back = function() {
			if (view.history.length > 1 && !$("div.theme-overlay")) {
				var timeout = false;
				if (window.isPhone) {
					timeout = true;
				}
				if ($(view.params.selector + " div.page[data-page=\""+view.history[view.history.length-1].slice(1)+"\"]")) {
					if (window.isPhone) {
						view.params.app.animation.pageRotateOutBack(view.history[view.history.length-1].slice(1));
					}
					setTimeout(function() {
						if (view.pages[view.pageNames.indexOf(view.history[view.history.length-1].slice(1))]) {
							view.pages[view.pageNames.indexOf(view.history[view.history.length-1].slice(1))].destroy();
							view.pages.splice(view.pageNames.indexOf(view.history[view.history.length-1].slice(1)),1);
							view.pageNames.splice(view.pageNames.indexOf(view.history[view.history.length-1].slice(1)),1);

							view.loadView(view.history[view.history.length-2],"menu",true);
							if (!window.isPhone && !window.isTablet) {
								view.menus[view.menus.length-1].loadPage("#"+view.menus[view.menus.length-1].pageNames[0], "page");
							} else {
								view.load.navbarInternal(view.menus[view.menus.length-1].pageNames[0]);
								view.load.appbarInternal(view.menus[view.menus.length-1].pageNames[0]);
							}

						} else {
							$(view.params.selector + " div.page[data-page=\""+view.history[view.history.length-1].slice(1)+"\"]").classList.remove("page-active");
							$(view.params.selector + " div.page[data-page=\""+view.history[view.history.length-1].slice(1)+"\"]").classList.remove("slide-in");
							view.loadView(view.history[view.history.length-2],"menu",true);
							view.load.navbarInternal(view.history[view.history.length-2].slice(1));
							view.load.appbarInternal(view.history[view.history.length-2].slice(1));
						}
						view.history.pop();
					}, (timeout)?200:0);
				} else if ($(view.params.selector + " div.menu[data-menu=\""+view.history[view.history.length-1].slice(1)+"\"]")) {
					if (window.isPhone) {
						view.params.app.animation.menuRotateOut(view.history[view.history.length-1].slice(1),null,true);
					}
					setTimeout(function() {
						view.menus[view.menuNames.indexOf(view.history[view.history.length-1].slice(1))].destroy();
						view.menus.splice(view.menuNames.indexOf(view.history[view.history.length-1].slice(1)),1);
						view.menuNames.splice(view.menuNames.indexOf(view.history[view.history.length-1].slice(1)),1);

						//view.params.app.animation.menuSlideIn(view.history[view.history.length-2].slice(1));

						view.loadView(view.history[view.history.length-2],"menu",true);
						if (!window.isPhone && !window.isTablet) {
							view.menus[view.menus.length-1].loadPage("#"+view.menus[view.menus.length-1].pageNames[0], "page");
						} else {
							view.load.navbarInternal(view.menus[view.menus.length-1].pageNames[0]);
							view.load.appbarInternal(view.menus[view.menus.length-1].pageNames[0]);
						}
						view.history.pop();
					}, (timeout)?view.params.app.animation.animationDuration:0);
				}
			} else if ($("div.theme-overlay")) {
				view.params.app.design.hide();
			}
		}

		view.addMenu = function(menuParams) {
			view.menus.push(new MetroUI.Menu(menuParams));
			view.menuNames.push(menuParams.id)
		};
		view.addPage = function(pageParams) {
			view.pages.push(new MetroUI.Page(pageParams));
		};

		view.loadPage = function() {};
		view.loadContent = function(name,html) {};

		view.load = {
			menuInternal: function(name, back) {
				back = back ? back : false;

				_$(view.menus[view.menuNames.indexOf(name)].params.selector).addClass("menu-active");
				_$(view.params.selector + " div.menus").removeClass("hidden");
				if (!window.isPhone) {
					view.params.app.animation.menuSlideIn(name, view.params.selector);
				} else {
					if (!back) {
						view.params.app.animation.menuRotateIn(name);
					} else {
						view.params.app.animation.menuRotateIn(name, true);
					}
				}
				view.load.navbarInternal(name);
				view.load.appbarInternal(name);
			},
			menuExternal: function(page) {
				if (page.body.querySelector("div.menu")) {
					$(view.params.selector + " div.menus").appendChild(page.body.querySelector("div.menu").cloneNode(true));

					var firstMenu = $$(view.params.selector + " div.menu:not(.menu-active)")[0];

					view.addMenu({
						app: view.params.app,
						id: firstMenu.getAttribute("data-menu"),
						selector: _$(firstMenu),
						parentView: view
					});

					$(view.params.selector + " div.menu.menu-active").classList.remove("menu-active");
					firstMenu.classList.add("menu-active");

					view.load.navbarExternal(page, firstMenu.getAttribute("data-menu"));
					view.load.appbarExternal(page, firstMenu.getAttribute("data-menu"));

					if (window.innerWidth <= 504) {
						view.params.app.animation.menuRotateIn(firstMenu.getAttribute("data-menu"));
					} else {
						view.params.app.animation.menuSlideIn(firstMenu.getAttribute("data-menu"), view.params.selector);
					}

					if (firstMenu.getAttribute("data-initial-page") && window.innerWidth > 960) {
						if ($(view.params.selector + " div.menu.menu-active div.link[href=\"#"+firstMenu.getAttribute("data-initial-page")+"\"]")) {
							$(view.params.selector + " div.menu.menu-active div.link[href=\"#"+firstMenu.getAttribute("data-initial-page")+"\"]").classList.add("selected");
						}
					}

					view.load.navbarInternal(firstMenu.getAttribute("data-menu"));
					view.load.appbarInternal(firstMenu.getAttribute("data-menu"));

					view.history.push("#"+firstMenu.getAttribute("data-menu"));
					//app.navigation.initLinks("menu");

					view.menus[view.menus.length-1].load.pageExternal(page);
				} else {
					view.load.pageExternal(page);
				}
			},

			pageInternal: function(name, back) {},
			pageExternal: function(page) {
				if (page.body.querySelector("div.page")) {
					var newPages = [];
					var newPagesNames = [];
					for (var i=0; i<page.querySelectorAll("div.page").length; i++) {
						var pageInsert = true;
						for (var j=0; j<$$(view.params.selector + " div.page").length; j++) {
							if ($$(view.params.selector + " div.page")[j].getAttribute("data-page") == page.body.querySelectorAll("div.page")[i].getAttribute("data-page")) {
								pageInsert = false;
								break;
							}
						}

						if (pageInsert) {
							var newPage = new MetroUI.Page({
								app: view.params.app,
								id: page.body.querySelectorAll("div.page")[i].getAttribute("data-page"),
								selector: _$(page.body.querySelectorAll("div.page")[i]),
								parentMenu: view.menus[view.menus.length-1],
								parentView: view
							});
							$(view.params.selector + " div.pages").appendChild(page.body.querySelectorAll("div.page")[i].cloneNode(true));

							view.load.navbarExternal(page, page.body.querySelectorAll("div.page")[i].getAttribute("data-page"));
							view.load.appbarExternal(page, page.body.querySelectorAll("div.page")[i].getAttribute("data-page"));

							view.pages.push(newPage);
							view.pageNames.push(page.body.querySelectorAll("div.page")[i].getAttribute("data-page"));
						}
					}
					var firstPage = $(view.params.selector + " div.page[data-page=\""+page.body.querySelectorAll("div.page")[0].getAttribute("data-page")+"\"]");

					if ($(view.params.selector + " div.page.page-active")) {
						$(view.params.selector + " div.page.page-active").classList.remove("page-active");
					}
					firstPage.classList.add("page-active");
					if (!firstPage.classList.contains("split-view")) {
						if (!window.isPhone) {
							view.params.app.animation.pageSlideIn(firstPage.getAttribute("data-page"));
						} else {
							view.params.app.animation.pageRotateIn(firstPage.getAttribute("data-page"));
						}
					}

					if (firstPage.getAttribute("data-hide-menu") && firstPage.getAttribute("data-hide-menu") == "true" || window.innerWidth <= 960) {
						firstPage.classList.add("page-fullscreen");
						if ($(view.params.selector + " div.menus")) {
							$(view.params.selector + " div.menus").classList.add("hidden");
						}
						view.history.push("#"+firstPage.getAttribute("data-page"));
					}

					view.load.navbarInternal(firstPage.getAttribute("data-page"));
					view.load.appbarInternal(firstPage.getAttribute("data-page"));
				}
			},

			navbarInternal: function(url) {
				if ($(view.params.selector + " div.navbar") && $(view.params.selector + " div.navbar header[data-menu=\""+url+"\"]")) {
					$(view.params.selector + " div.navbar").classList.remove("hidden");
					if ($(view.params.selector + " div.navbar header.header-active")) {
						$(view.params.selector + " div.navbar header.header-active").classList.remove("header-active");
					}
					$(view.params.selector + " div.navbar header[data-menu=\""+url+"\"]").classList.add("header-active");
					_$(view.params.selector).addClass("view-navbar");
				} else if ($(view.params.selector + " div.navbar") && $(view.params.selector + " div.navbar header[data-page=\""+url+"\"]") && $(view.params.selector + " div.page[data-page=\""+url+"\"]").getAttribute("data-hide-menu") == "true" || !window.isDesktop && $(view.params.selector + " div.navbar") && $(view.params.selector + " div.navbar header[data-page=\""+url+"\"]")) {
					$(view.params.selector + " div.navbar").classList.remove("hidden");
					if ($(view.params.selector + " div.navbar header.header-active")) {
						$(view.params.selector + " div.navbar header.header-active").classList.remove("header-active");
					}
					$(view.params.selector + " div.navbar header[data-page=\""+url+"\"]").classList.add("header-active");
					_$(view.params.selector).addClass("view-navbar");
				} else if ($(view.params.selector + " div.navbar") && !$(view.params.selector + " div.navbar header[data-menu=\""+url+"\"]") && !$(view.params.selector + " div.navbar header[data-page=\""+url+"\"]")) {
					$(view.params.selector + " div.navbar").classList.add("hidden");
					if ($(view.params.selector + " div.navbar header.header-active")) {
						$(view.params.selector + " div.navbar header.header-active").classList.remove("header-active");
					}
					_$(view.params.selector).removeClass("view-navbar");
				}
				if ($(view.params.selector + " div.navbar header[data-hide-phone=\"true\"][data-menu=\""+url+"\"]") && window.isPhone) {
					$(view.params.selector + " div.navbar").classList.add("hidden");
					if ($(view.params.selector + " div.navbar header.header-active")) {
						$(view.params.selector + " div.navbar header.header-active").classList.remove("header-active");
					}
					_$(view.params.selector).removeClass("view-navbar");
				}
			},
			navbarExternal: function(page,url) {
				if (page.querySelector("div.navbar header[data-menu=\""+url+"\"]") && !$(view.params.selector + " div.navbar header[data-menu=\""+url+"\"]")) {
					$(view.params.selector + " div.navbar").appendChild(page.querySelector("div.navbar header[data-menu=\""+url+"\"]").cloneNode(true));
				}
				if (page.querySelector("div.navbar header[data-page=\""+url+"\"]") && !$(view.params.selector + " div.navbar header[data-page=\""+url+"\"]")) {
					$(view.params.selector + " div.navbar").appendChild(page.querySelector("div.navbar header[data-page=\""+url+"\"]").cloneNode(true));
				}
			},

			appbarInternal: function(url) {
				if ($(view.params.selector + " div.appbar") && $(view.params.selector + " div.appbar div.panel[data-menu=\""+url+"\"]")) {
					$(view.params.selector + " div.appbar").classList.remove("hidden");
					if ($(view.params.selector + " div.appbar div.panel.panel-active")) {
						$(view.params.selector + " div.appbar div.panel.panel-active").classList.remove("panel-active");
					}
					$(view.params.selector + " div.appbar div.panel[data-menu=\""+url+"\"]").classList.add("panel-active");
					_$(view.params.selector).addClass("view-appbar");
				} else if ($(view.params.selector + " div.appbar") && $(view.params.selector + " div.appbar div.panel[data-page=\""+url+"\"]")) {
					$(view.params.selector + " div.appbar").classList.remove("hidden");
					if ($(view.params.selector + " div.appbar div.panel.panel-active")) {
						$(view.params.selector + " div.appbar div.panel.panel-active").classList.remove("panel-active");
					}
					$(view.params.selector + " div.appbar div.panel[data-page=\""+url+"\"]").classList.add("panel-active");
					_$(view.params.selector).addClass("view-appbar");
				} else if ($(view.params.selector + " div.appbar") && !$(view.params.selector + " div.appbar div.panel[data-menu=\""+url+"\"]") && !$(view.params.selector + " div.appbar div.panel[data-page=\""+url+"\"]")) {
					$(view.params.selector + " div.appbar").classList.add("hidden");
					if ($(view.params.selector + " div.appbar div.panel.panel-active")) {
						$(view.params.selector + " div.appbar div.panel.panel-active").classList.remove("panel-active");
					}
					_$(view.params.selector).removeClass("view-appbar");
				}
			},
			appbarExternal: function(page,url) {
				if (page.querySelector("div.appbar div.panel[data-menu=\""+url+"\"]") && !$(view.params.selector + " div.appbar div.panel[data-menu=\""+url+"\"]")) {
					$(view.params.selector + " div.appbar").appendChild(page.querySelector("div.appbar div.panel[data-menu=\""+url+"\"]").cloneNode(true));
				}
				if (page.querySelector("div.appbar div.panel[data-page=\""+url+"\"]") && !$(view.params.selector + " div.appbar div.panel[data-page=\""+url+"\"]")) {
					$(view.params.selector + " div.appbar").appendChild(page.querySelector("div.appbar div.panel[data-page=\""+url+"\"]").cloneNode(true));
				}
			}
		};
		view.loadView = function(url,type,back) {
			if (url.length > 1 && url[0] == "#") {
				if (type == "menu") {
					view.load.menuInternal(url.slice(1),back);
				}
				if (type == "page") {
					view.load.pageInternal(url.slice(1));
				}
			} else if (url.length > 1) {
				// External loading
				var xhr = new XMLHttpRequest();
				xhr.addEventListener("error", function() {
					xhr.abort();
				}, false);
				xhr.addEventListener("load", function() {
					var parser = new DOMParser();
					var page = parser.parseFromString(xhr.response, "text/html");

					setTimeout(function() {
						view.load.menuExternal(page);
						view.load.pageExternal(page);
						if (_$("div.app-controls")) {
							if (app.history.length > 1 || app.menuHistory.length > 1) {
								_$("div.app-controls div.navigate-back").removeClass("hidden");
							} else {
								_$("div.app-controls div.navigate-back").addClass("hidden");
							}
						}
					}, 10);
				}, false);
				xhr.open('GET',url+"?"+(new Date()).getTime(), true);
				xhr.send(null);
			}
		};

		view.onPage = function(callbackName, pageName, callback) {
			if (pageName && pageName.split(' ').length > 1) {
				var pageNames = pageName.split(' ');
				var returnCallbacks = [];
				for (var i = 0; i < pageNames.length; i++) {
					returnCallbacks.push(view.onPage(callbackName, pageNames[i], callback));
				}
				returnCallbacks.remove = function () {
					for (var i = 0; i < returnCallbacks.length; i++) {
						returnCallbacks[i].remove();
					}
				};
				returnCallbacks.trigger = function () {
					for (var i = 0; i < returnCallbacks.length; i++) {
						returnCallbacks[i].trigger();
					}
				};
				return returnCallbacks;
			}
			var callbacks = app.pageCallbacks[callbackName][pageName];
			if (!callbacks) {
				callbacks = app.pageCallbacks[callbackName][pageName] = [];
			}
			view.pageCallbacks[callbackName][pageName].push(callback);
			return {
				remove: function () {
					var removeIndex;
					for (var i = 0; i < callbacks.length; i++) {
						if (callbacks[i].toString() === callback.toString()) {
							removeIndex = i;
						}
					}
					if (typeof removeIndex !== 'undefined') callbacks.splice(removeIndex, 1);
				},
				trigger: callback
			};
		};
		function createPageCallback(callbackName) {
		    var capitalized = callbackName.replace(/^./, function (match) {
		        return match.toUpperCase();
		    });
		    view['onPage' + capitalized] = function (pageName, callback) {
		        return view.onPage(callbackName, pageName, callback);
		    };
		}

		var pageCallbacksNames = ('beforeInit init reinit beforeAnimation afterAnimation back afterBack beforeRemove').split(' ');
		for (var i = 0; i < pageCallbacksNames.length; i++) {
			  view.pageCallbacks[pageCallbacksNames[i]] = {};
			  createPageCallback(pageCallbacksNames[i]);
		}
		view.triggerPageCallbacks = function(callbackName, pageName, callback) {
			var allPagesCallbacks = view.pageCallbacks[callbackName]['*'];
		    if (allPagesCallbacks) {
		        for (var j = 0; j < allPagesCallbacks.length; j++) {
		            allPagesCallbacks[j](pageData);
		        }
		    }
		    var callbacks = view.pageCallbacks[callbackName][pageName];
		    if (!callbacks || callbacks.length === 0) return;
		    for (var i = 0; i < callbacks.length; i++) {
		        callbacks[i](pageData);
		    }
		};


		view.init = function() {
			if ($(view.params.selector +" div.navbar:not(.hidden)")) {
				_$(view.params.selector).addClass("view-navbar");
			}
			if ($(view.params.selector +" div.app-controls")) {
				_$(view.params.selector).addClass("view-app-controls");
			}
			if ($("footer")) {
				_$(view.params.selector).addClass("view-footer");
			}

			if ($(view.params.selector + " div.menu")) {
				for (var i=0; i<$$(view.params.selector + " div.menu").length; i++) {
					view.addMenu({
						app: view.params.app,
						id: $$(view.params.selector + " div.menu")[i].getAttribute("data-menu"),
						selector: _$($$(view.params.selector + " div.menu")[i]),
						parentView: view
					});
				}
				view.history.push("#"+view.menuNames[0]);
				view.loadView("#"+view.menuNames[0],"menu");
			}
			view.params.app.views.push(view);
			view.params.app.viewNames.push(view.params.selector);
		}
		view.init();

		return view;
	};
})();
(function() {
	"use strict";
	MetroUI.Menu = function(params) {
		var menu = this;

		menu.params = {
			app: undefined,
			id: "",
			selector: undefined,
			parentView: undefined,
			tiles: "tiles.json"
		}
		for (var param in params) {
			menu.params[param] = params[param];
		}


		menu.pageNames = [];
		menu.pages = [];
		menu.tiles = [];
		menu.currentPage = undefined;

		menu.addPage = function(pageParams) {
			menu.pages.push(new MetroUI.Page(pageParams));
			menu.pageNames.push(pageParams.id);
		};

		menu.load = {
			menuInternal: function(name,back) {
				menu.params.parentView.load.menuInternal(name,back);
			},
			menuExternal: function(page) {
				menu.params.parentView.load.menuExternal(page);
			},

			pageInternal: function(name,back) {
				if ($(menu.params.parentView.params.selector + " div.page.page-active")) {
					$(menu.params.parentView.params.selector + " div.page.page-active").classList.remove("page-active");
				}
				$(menu.params.parentView.params.selector + " div.page[data-page=\""+name+"\"]").classList.add("page-active");

				menu.params.parentView.load.navbarInternal($(menu.params.parentView.params.selector + " div.page[data-page=\""+name+"\"]").getAttribute("data-page"));
				menu.params.parentView.load.appbarInternal($(menu.params.parentView.params.selector + " div.page[data-page=\""+name+"\"]").getAttribute("data-page"));

				menu.pages[menu.pageNames.indexOf(name)].init();

				if (window.isPhone || window.isTablet) {
					menu.params.parentView.history.push("#"+name);
				}
				if (window.isTablet || window.isDesktop) {
					menu.params.app.animation.pageSlideIn(name);
				} else if (window.isPhone) {
					menu.params.app.animation.pageRotateIn(name);
				}
			},
			pageExternal: function(page) {
				if (page.body.querySelector("div.page")) {
					var newPages = [];
					var newPagesNames = [];
					for (var i=0; i<page.querySelectorAll("div.page").length; i++) {
						var pageInsert = true;
						for (var j=0; j<$$(menu.params.parentView.params.selector + " div.page").length; j++) {
							if ($$(menu.params.parentView.params.selector + " div.page")[j].getAttribute("data-page") == page.body.querySelectorAll("div.page")[i].getAttribute("data-page")) {
								pageInsert = false;
								console.log(pageInsert);
								break;
							}
						}

						if (pageInsert) {
							var newPage = new MetroUI.Page({
								app: menu.params.app,
								id: page.body.querySelectorAll("div.page")[i].getAttribute("data-page"),
								selector: _$(page.body.querySelectorAll("div.page")[i]),
								parentMenu: menu,
								parentView: menu.params.parentView
							});
							$(menu.params.parentView.params.selector + " div.pages").appendChild(page.body.querySelectorAll("div.page")[i].cloneNode(true));

							menu.params.parentView.load.navbarExternal(page, page.body.querySelectorAll("div.page")[i].getAttribute("data-page"));
							menu.params.parentView.load.appbarExternal(page, page.body.querySelectorAll("div.page")[i].getAttribute("data-page"));

							menu.pages.push(newPage);
							menu.pageNames.push(page.body.querySelectorAll("div.page")[i].getAttribute("data-page"));
						}
					}
					if (page.body.querySelector("div.menu")) {
						if (page.body.querySelector("div.menu").getAttribute("data-initial-page")) {
							var firstPage = $(menu.params.parentView.params.selector + " div.page:not(.page-active)[data-page=\""+page.body.querySelector("div.menu").getAttribute("data-initial-page")+"\"]");

							if ($(menu.params.parentView.params.selector + " div.page.page-active")) {
								$(menu.params.parentView.params.selector + " div.page.page-active").classList.remove("page-active");
							}

							if (window.innerWidth > 960) {
								//firstPage.classList.add("page-active");
								//app.activePage = page.body.querySelector("div.menu").getAttribute("data-initial-page");
								menu.load.pageInternal(firstPage.getAttribute("data-page"),false);
								setTimeout(function() {
									if (window.innerWidth <= 504) {
										//app.animation.pageRotateIn(page.body.querySelector("div.menu").getAttribute("data-initial-page"));
									} else {
										//app.animation.pageSlideIn(firstPage.getAttribute("data-page"));
									}
								}, 0);
							}
						} else {
							var firstPage = $$(menu.params.parentView.params.selector + " div.page:not(.page-active)")[0];

							if ($(menu.params.parentView.params.selector + " div.page.page-active")) {
								$(menu.params.parentView.params.selector + " div.page.page-active").classList.remove("page-active");
							}
							firstPage.classList.add("page-active");

							menu.params.parentView.load.navbarInternal(firstPage.getAttribute("data-page"));
							menu.params.parentView.load.appbarInternal(firstPage.getAttribute("data-page"));

							setTimeout(function() {
								if (window.innerWidth <= 504) {
									//app.animation.pageRotateIn(firstPage.getAttribute("data-page"));
								} else {
									//app.animation.pageSlideIn(firstPage.getAttribute("data-page"));
								}
							}, 0);
						}
					} else {
						var firstPage = $(menu.params.parentView.params.selector + " div.page[data-page=\""+page.body.querySelectorAll("div.page")[0].getAttribute("data-page")+"\"]");

						if ($(menu.params.parentView.params.selector + " div.page.page-active")) {
							$(menu.params.parentView.params.selector + " div.page.page-active").classList.remove("page-active");
						}
						firstPage.classList.add("page-active");

						if (firstPage.getAttribute("data-hide-menu") && firstPage.getAttribute("data-hide-menu") == "true" || window.innerWidth <= 960) {
							firstPage.classList.add("page-fullscreen");
							if ($(menu.params.parentView.params.selector + " div.menus")) {
								$(menu.params.parentView.params.selector + " div.menus").classList.add("hidden");
							}
						} else if (window.innerWidth > 960) {
							//app.history.pop();
						}

						menu.params.parentView.load.navbarInternal(firstPage.getAttribute("data-page"));
						menu.params.parentView.load.appbarInternal(firstPage.getAttribute("data-page"));

						//app.activePage = firstPage.getAttribute("data-page");

						setTimeout(function() {
							if (window.innerWidth <= 504) {
								//app.animation.pageRotateIn(firstPage.getAttribute("data-page"));
							} else {
								//app.animation.pageSlideIn(firstPage.getAttribute("data-page"));
							}
						}, 0);
						//app.initPage();
					}
					//app.navigation.initLinks("page");
				}
			},
		};
		menu.loadPage = function(url,type,back) {
			if (url.length > 1 && url[0] == "#") {
				if ((type == "page" && $(menu.params.parentView.params.selector + " div.page[data-page=\""+url.slice(1)+"\"]")) || ($(menu.params.parentView.params.selector + " div.page[data-page=\""+url.slice(1)+"\"]") && type != "menu")) {
					menu.load.pageInternal(url.slice(1))
				}
			} else if (url.length > 1) {
				// External loading
				var xhr = new XMLHttpRequest();
				xhr.addEventListener("error", function() {
					xhr.abort();
				}, false);
				xhr.addEventListener("load", function() {
					var parser = new DOMParser();
					var page = parser.parseFromString(xhr.response, "text/html");

					setTimeout(function() {
						menu.load.menuExternal(page);
						//menu.load.pageExternal(page);
						if (_$("div.app-controls")) {
							if (menu.params.parentView.history.length > 1) {
								_$("div.app-controls div.navigate-back").removeClass("hidden");
							} else {
								_$("div.app-controls div.navigate-back").addClass("hidden");
							}
						}
					}, 10);
				}, false);
				xhr.open('GET',url+"?"+(new Date()).getTime(), true);
				xhr.send(null);
			}
		};

		menu.initTiles = function() {
			menu.params.app.tiles.init(menu.params.id);
		};
		menu.initLinks = function() {
			if ($(menu.params.parentView.params.selector + " div.menu[data-menu=\""+menu.params.id+"\"] [href]")) {
				for (var i=0; i<$$(menu.params.parentView.params.selector + " div.menu[data-menu=\""+menu.params.id+"\"] [href]").length; i++) {
					$$(menu.params.parentView.params.selector + " div.menu[data-menu=\""+menu.params.id+"\"] [href]")[i].onclick = function() {
						var el = this;

						if (window.innerWidth <= 504) {
							menu.params.app.animation.menuRotateOut($(menu.params.parentView.params.selector + " div.menu[data-menu=\""+menu.params.id+"\"]").getAttribute("data-menu"), el);

							setTimeout(function() {
								menu.loadPage(el.getAttribute("href"));
							}, (typeof(app.navigation.win10delay) !== "undefined" && !$(menu.params.parentView.params.selector + " div.menu[data-menu=\""+menu.params.id+"\"]").classList.contains("tiles")) ? app.navigation.win10delay : app.animation.animationDuration);
						} else {
							menu.loadPage(el.getAttribute("href"));
						}

						if (el.getAttribute("href")[0] == "#" && el.getAttribute("href").length > 1 && window.innerWidth > 960) {
							if ($(menu.params.parentView.params.selector + " div.menu[data-menu=\""+menu.params.id+"\"] div.link.selected")) {
								$(menu.params.parentView.params.selector + " div.menu[data-menu=\""+menu.params.id+"\"] div.link.selected").classList.remove("selected");
							}
							el.classList.add("selected");
						} else if (el.getAttribute("href")[0] == "#" && el.getAttribute("href").length > 1 && window.innerWidth <= 960) {
							var delay = ($$(menu.params.parentView.params.selector + " div.menu[data-menu=\""+menu.params.id+"\"] div.tile") && window.innerWidth<=504) ? $$(menu.params.parentView.params.selector + " div.menu[data-menu=\""+menu.params.id+"\"] div.tile").length*25+1000 : 0;
							delay = ($$(menu.params.parentView.params.selector + " div.menu[data-menu=\""+menu.params.id+"\"] div.tile") && window.innerWidth<=504) ? $$(menu.params.parentView.params.selector + " div.menu[data-menu=\""+menu.params.id+"\"] div.link").length*25+1000 : delay;
							delay = (typeof(menu.params.app.navigation.win10delay) !== "undefined") ? menu.params.app.navigation.win10delay : delay;

							setTimeout(function() {
								el.parentNode.parentNode.classList.add("hidden");
							}, delay);
						}
					};
				}
			}
			if ($(menu.params.parentView.params.selector + " div.menu[data-menu=\""+menu.params.id+"\"] div.navigate-back")) {
				$(menu.params.parentView.params.selector + " div.menu[data-menu=\""+menu.params.id+"\"] div.navigate-back").onclick = function() {
					menu.params.parentView.back();
				};
			}

		};
		menu.init = function() {
			menu.initTiles();
			menu.initLinks();

			if ($(menu.params.parentView.params.selector + " div.page[data-menu=\""+menu.params.id+"\"]")) {
				for (var i=0; i<$$(menu.params.parentView.params.selector + " div.page[data-menu=\""+menu.params.id+"\"]").length; i++) {
					menu.addPage({
						app: menu.params.app,
						id: $$(menu.params.parentView.params.selector + " div.page[data-menu=\""+menu.params.id+"\"]")[i].getAttribute("data-page"),
						selector: _$($$(menu.params.parentView.params.selector + " div.page[data-menu=\""+menu.params.id+"\"]")[i]),
						parentMenu: menu,
						parentView: menu.params.parentView
					});
				}
				if (!window.isPhone && !window.isTablet) {
					menu.loadPage("#"+menu.pageNames[0],"page");
				} else {
					menu.params.parentView.load.navbarInternal(menu.pageNames[0]);
					menu.params.parentView.load.appbarInternal(menu.pageNames[0]);
				}
			}
		}
		menu.destroy = function() {
			for (var i=0; i<menu.pages.length; i++) {
				menu.pages[i].destroy();
			}
			_$(menu.params.parentView.params.selector + " div.menu[data-menu=\""+menu.params.id+"\"]").remove();
		}

		menu.init();

		return menu;
	}
})();
(function() {
	"use strict";
	MetroUI.Page = function(params) {
		var page = this;

		page.params = {
			app: undefined,
			id: "",
			parentMenu: undefined,
			parentView: undefined,
			selector: undefined
		}
		for (var param in params) {
			page.params[param] = params[param];
		}

		page.pageCallbacks = {};

		page.initLinks = function() {
			if ($("div.page[data-page=\""+page.params.id+"\"] div.navigate-back")) {
				$("div.page[data-page=\""+page.params.id+"\"] div.navigate-back").onclick = function() {
					page.params.parentView.back();
				};
			}
			if ($("div.page[data-page=\""+page.params.id+"\"] [href]:not(.external)")) {
				for (var i=0; i<$$("div.page[data-page=\""+page.params.id+"\"] [href]:not(.external)").length; i++) {
					$$("div.page[data-page=\""+page.params.id+"\"] [href]:not(.external)")[i].onclick = function() {
						var el = this;

						app.navigation.loadPage(el.getAttribute("href"));
					};
				}
			}
		};
		page.initSwitches = function() {
			if (page.params.app.params.switches) {
				var switches = $$("div.page[data-page=\""+page.params.id+"\"] div.switch:not(.disabled) div.switch-inner");
				for (var i=0; i<switches.length; i++) {
					if (switches[i].parentNode.children[0].hasAttribute("checked")) {
						switches[i].parentNode.children[2].innerHTML = "On";
						switches[i].parentNode.style.opacity = 0.99;
					}
					switches[i].onclick = function() {
						if (this.parentNode.children[0].hasAttribute("checked")) {
							this.parentNode.children[0].removeAttribute("checked");
							this.parentNode.children[2].innerHTML = "Off";
						} else {
							this.parentNode.children[0].setAttribute("checked", true);
							this.parentNode.children[2].innerHTML = "On";
						}
						var el = this.parentNode;
						var visibility = el.style.opacity;
						el.style.opacity = '0.99';
						setTimeout( function() {
							el.removeAttribute("style");
						}, 10);
						var parent = this.parentNode;
						var event = document.createEvent("UIEvents");
						event.initUIEvent("change", true, true);
						parent.children[0].dispatchEvent(event);

					};
				}
			}
		};
		page.initCheckboxes = function() {
			if (page.params.app.params.checkbox) {
				var checkboxes = $$("div.page[data-page=\""+page.params.id+"\"] div.checkbox:not(.disabled)");
				for (var i=0; i<checkboxes.length; i++) {
					checkboxes[i].onclick = function() {
						if (this.children[0].hasAttribute("checked")) {
							this.children[0].removeAttribute("checked");
						} else {
							this.children[0].setAttribute("checked", true);
						}
						var el = this.children[2];
						var visibility = el.style.opacity;
						el.style.opacity = '0.99';
						setTimeout( function() {
							el.style.opacity = visibility;
						}, 1);
					};
				}
			}
		};
		page.initRadios = function() {
			if (page.params.app.params.radios) {
				var checkboxes = $$("div.page[data-page=\""+page.params.id+"\"] div.radio:not(.disabled)");
				for (var i=0; i<checkboxes.length; i++) {

					checkboxes[i].onclick = function() {
						for (var j=0; j<checkboxes.length; j++) {
							checkboxes[j].children[0].removeAttribute("checked");
						}
						this.children[0].setAttribute("checked", true);
						var event = document.createEvent("UIEvents");
						event.initUIEvent("change", true, true, window, 1);
						this.children[0].dispatchEvent(event);

					};
				}
			}
		};
		page.initProgress = function() {
			if (page.params.app.params.progress) {
				for (var i=0;i<$$("div.page[data-page=\""+page.params.id+"\"] div.progress:not(.indeterminate)").length;i++) {
					var el = $$("div.page[data-page=\""+page.params.id+"\"] div.progress:not(.indeterminate)")[i];
					el.querySelector("div.progress-inner").style.width = el.children[0].value + "%";
					var observer = new MutationObserver(function (mutations) {
						// Whether you iterate over mutations..
						mutations.forEach(function (mutation) {
						// or use all mutation records is entirely up to you
							el.querySelector("div.progress-inner").style.width = mutation.target.value + "%";
						});
					});
					observer.observe(el.children[0], {
						attributes: true,
						attributesOldValue: true,
						subtree: true,
						characterData: true
					});
				}
			}
		};
		page.initLists = function() {
			if (page.params.app.params.lists) {
				page.params.app.design.initTheme();

				var lists = $$("div.page[data-page=\""+page.params.id+"\"] div.list");
				for (var i=0; i<lists.length; i++) {
					if (lists[i].querySelectorAll("div.select-inner-wrapper").length < 1) {
						lists[i].innerHTML += "<div class=\"select-inner-wrapper\"><ul class=\"select-inner\"></ul></div>";
						var el = lists[i];
						lists[i].onclick = function() {
							var el = this;
							setTimeout(function() {
								if (!el.classList.contains("disabled")) {
									if (!el.classList.contains("open")) {
										el.classList.add("open");
										if (window.isPhone) {
											el.children[1].removeAttribute("style");
											new Velocity(el, {
												height: el.children[1].children[0].children.length * 40
											}, {
												duration: 200,
												easing: "ease-in-out"
											});

											for (var i=0; i<el.children[1].children[0].children.length; i++) {
												new Velocity(el.children[1].children[0].children[i], {
													lineHeight: 40
												}, {
													duration: 200,
													easing: "ease-in-out"
												});
											}
										}
									}

									var index = indexInParent(el.querySelector("li.checked"));
									if (!window.isPhone) {
										el.querySelector("div.select-inner-wrapper").style.top = "-"+((index*40)+6)+"px";
									}
									page.params.app.listOpen = true;
								}
							}, 0);
						};
						for (var j=0; j<lists[i].children[0].children.length; j++) {
							if (lists[i].children[0].children[j].innerHTML !== "") {
								if (lists[i].children[0].children[j].getAttribute("selected") !== null) {
									lists[i].children[1].children[0].innerHTML += "<li class=\"checked\">" + lists[i].children[0].children[j].innerHTML + "</li>";
								} else {
									lists[i].children[1].children[0].innerHTML += "<li>" + lists[i].children[0].children[j].innerHTML + "</li>";
								}
								var index = indexInParent(lists[i].children[0].querySelector("option[selected]"));
								if (!window.isPhone) {
									lists[i].children[1].style.top = "-"+(index*28)+"px";
								} else {
									lists[i].children[1].style.marginTop = "-"+(index*28)+"px";
								}

								for (var k=0; k<lists[i].querySelectorAll("li").length; k++) {
									lists[i].querySelectorAll("li")[k].onclick = function() {
										var elInside = this;
										var parent = elInside.parentNode.parentNode.parentNode;
										if (parent.classList.contains("open")) {
											setTimeout(function() {
												parent.classList.remove("open");
												if (window.isPhone) {
													new Velocity(parent, {
														height: 28
													}, {
														duration: 200,
														easing: "ease-in-out"
													});
													for (var i=0; i<parent.children[1].children[0].children.length; i++) {
														new Velocity(parent.children[1].children[0].children[i], {
															lineHeight: 28
														}, {
															duration: 200,
															easing: "ease-in-out"
														});
													}
												}

												var indexInside = indexInParent(elInside);
												if (!window.isPhone) {
													parent.children[1].style.top = "-"+(indexInside*28)+"px";
												} else {
													parent.children[1].style.marginTop = "-"+(indexInside*28)+"px";
												}

												parent.children[0].querySelector("option[selected]").removeAttribute("selected");
												parent.children[0].children[indexInside].setAttribute("selected", "");
												var event = document.createEvent("UIEvents");
												event.initUIEvent("change", true, true, window, 1);
												parent.children[0].dispatchEvent(event);

												parent.querySelector("li.checked").classList.remove("checked");
												elInside.classList.add("checked");

												setTimeout(function() {
													page.params.app.listOpen = false;
												}, 10);
											}, 10);
										}
									};
								}
							} else {
								lists[i].classList.add("error");
								lists[i].classList.add("disabled");
								lists[i].children[1].children[0].innerHTML += "<li class=\"error\">Invalid List</li>";
								break;
							}
						}
					}
					lists[i].removeAttribute("style");

					if (!lists[i].classList.contains("theme")) {
						if (window.isPhone) {
							var pTop = lists[i].children[1].style.top;
							lists[i].children[1].removeAttribute("style");
							lists[i].children[1].style.marginTop = pTop;
						} else {
							var pTop = lists[i].children[1].style.marginTop;
							lists[i].children[1].removeAttribute("style");
							lists[i].children[1].style.top = pTop;
						}

						for (var j=0; j<lists[i].children[1].children[0].children.length; j++) {
							lists[i].children[1].children[0].children[j].removeAttribute("style");
						}
					}
				}
			}
		};
		page.init = function() {
			page.params.app.triggerPageCallbacks("beforeInit",page.params.id,{});

			page.initLinks();
			page.initSwitches();
			page.initCheckboxes();
			page.initRadios();
			page.initProgress();
			page.initLists();
			page.params.app.design.init();

			page.params.app.triggerPageCallbacks("init",page.params.id,{});
		};


		page.destroy = function() {
			_$(page.params.parentView.params.selector + " div.page[data-page=\""+page.params.id+"\"]").remove();
		}

		setTimeout(function() {
			page.init();
			return page;
		}, 10);
	}
})();
(function() {
	"use strict";
	MetroUI.Alert = function(app,title,message,callback) {
		if ($$("div.notification-center").length < 1) {
			var notificationCenter = document.createElement("div");
			notificationCenter.className = "notification-center";
			document.body.appendChild(notificationCenter);
		}

		var alertBG = document.createElement("div");
		alertBG.className = "notification-background fade-in";
		alertBG.addEventListener("mousewheel", function(e) {
			e.preventDefault();
			e.stopPropagation();
		});
		alertBG.addEventListener("touchmove", function(e) {
			e.preventDefault();
			e.stopPropagation();
		});

		var alertWrapper = document.createElement("div");
		alertWrapper.classList.add("alert-wrapper");

		var alertBox = document.createElement("div");
		alertBox.className = "alert colored fade-in";
		alertBox.id = "alert";
		alertBox.addEventListener("mousewheel", function(e) {
			e.preventDefault();
			e.stopPropagation();
		});
		alertBox.addEventListener("touchmove", function(e) {
			e.preventDefault();
			e.stopPropagation();
		});

		var alertTitle = document.createElement("div");
		alertTitle.className = "title";
		alertTitle.innerHTML = ((typeof(title)!=="undefined"))?title:"Untitled";
		alertBox.appendChild(alertTitle);

		var alertContent = document.createElement("div");
		alertContent.className = "content";
		alertContent.innerHTML = ((typeof(message)!=="undefined"))?message:"No content.";
		alertBox.appendChild(alertContent);

		var alertButtonContainer = document.createElement("div");
		alertButtonContainer.className = "button-container";
		var okButton = document.createElement("button");
		okButton.className = "colored";
		okButton.innerHTML = app.params.alertConfirmButton;
		okButton.addEventListener("click", function() {
			$("div.notification-background.fade-in").className = "notification-background fade-out";
			$("div.alert.fade-in").className = "alert colored fade-out";

			setTimeout(function() {
				var alertBGChild = $("div.notification-background");
				var alertChild = $("div.alert-wrapper");

				alertBGChild.parentNode.removeChild(alertBGChild);
				alertChild.parentNode.removeChild(alertChild);

				if (typeof callback === 'function') {
					callback();
				}
			}, 300);
		});
		alertButtonContainer.appendChild(okButton);
		alertBox.appendChild(alertButtonContainer);
		alertWrapper.appendChild(alertBox);

		document.getElementsByClassName("notification-center")[0].appendChild(alertBG);
		document.getElementsByClassName("notification-center")[0].appendChild(alertWrapper);

		if (window.innerWidth > app.params.mobileWidthLimit) {
			document.getElementById("alert").style.marginTop = "-" + document.getElementById("alert").clientHeight/2;
		} else {
			document.getElementById("alert").parentNode.style.height = document.getElementById("alert").offsetHeight;
		}
	};
	MetroUI.Confirm = function(app,title,message,callback) {
		if ($$("div.notification-center").length < 1) {
			var notificationCenter = document.createElement("div");
			notificationCenter.className = "notification-center";
			document.body.appendChild(notificationCenter);
		}

		var alertBG = document.createElement("div");
		alertBG.className = "notification-background fade-in";
		alertBG.addEventListener("mousewheel", function(e) {
			e.preventDefault();
			e.stopPropagation();
		});
		alertBG.addEventListener("touchmove", function(e) {
			e.preventDefault();
			e.stopPropagation();
		});

		var alertWrapper = document.createElement("div");
		alertWrapper.classList.add("alert-wrapper");


		var alertBox = document.createElement("div");
		alertBox.className = "alert colored fade-in";
		alertBox.id = "alert";
		alertBox.addEventListener("mousewheel", function(e) {
			e.preventDefault();
			e.stopPropagation();
		});
		alertBox.addEventListener("touchmove", function(e) {
			e.preventDefault();
			e.stopPropagation();
		});

		var alertTitle = document.createElement("div");
		alertTitle.className = "title";
		alertTitle.innerHTML = ((typeof(title)!=="undefined"))?title:"Untitled";
		alertBox.appendChild(alertTitle);

		var alertContent = document.createElement("div");
		alertContent.className = "content";
		alertContent.innerHTML = ((typeof(message)!=="undefined"))?message:"No content.";
		alertBox.appendChild(alertContent);

		var alertButtonContainer = document.createElement("div");
		alertButtonContainer.className = "button-container";
		var cancelButton = document.createElement("button");
		cancelButton.className = "";
		cancelButton.innerHTML = app.params.alertCancelButton;
		cancelButton.addEventListener("click", function() {
			$("div.notification-background.fade-in").className = "notification-background fade-out";
			$("div.alert.fade-in").className = "alert colored fade-out";

			setTimeout(function() {
				var alertBGChild = $("div.notification-background");
				var alertChild = $("div.alert-wrapper");

				alertBGChild.parentNode.removeChild(alertBGChild);
				alertChild.parentNode.removeChild(alertChild);
			}, 300);
		});
		alertButtonContainer.appendChild(cancelButton);
		var okButton = document.createElement("button");
		okButton.className = "colored inline";
		okButton.innerHTML = app.params.alertConfirmButton;
		okButton.addEventListener("click", function() {
			$("div.notification-background.fade-in").className = "notification-background fade-out";
			$("div.alert.fade-in").className = "alert colored fade-out";

			setTimeout(function() {
				var alertBGChild = $("div.notification-background");
				var alertChild = $("div.alert-wrapper");

				alertBGChild.parentNode.removeChild(alertBGChild);
				alertChild.parentNode.removeChild(alertChild);

				if (typeof callback === 'function') {
					callback();
				}
			}, 300);
		});

		alertButtonContainer.appendChild(okButton);
		alertBox.appendChild(alertButtonContainer);
		alertWrapper.appendChild(alertBox);

		document.getElementsByClassName("notification-center")[0].appendChild(alertBG);
		document.getElementsByClassName("notification-center")[0].appendChild(alertWrapper);

		if (window.innerWidth > app.params.mobileWidthLimit) {
			document.getElementById("alert").style.marginTop = "-" + document.getElementById("alert").clientHeight/2;
		} else {
			document.getElementById("alert").parentNode.style.height = document.getElementById("alert").offsetHeight;
		}
	};

	MetroUI.prototype.alert = function(title,message,callback) {
		new MetroUI.Alert(this,title,message,callback);
	};
	MetroUI.prototype.confirm = function(title,message,callback) {
		new MetroUI.Confirm(this,title,message,callback);
	};
})();
(function() {
	"use strict";
	MetroUI.Notification = function(app,title,message,callback) {
		if ($$("div.notification-center").length < 1) {
			var notificationCenter = document.createElement("div");
			notificationCenter.className = "notification-center";
			document.body.appendChild(notificationCenter);
		}

		var notificationWrapper = document.createElement("div");
		notificationWrapper.className = "notification-wrapper";

		var notification = document.createElement("div");
		notification.className = ((app.params.notificationTransitions))?"notification slide-in":"notification";
		notification.addEventListener(app.touchEventStart, function() {
			if (!window.isPhone) {
				this.style.webkitTransform = "rotateY(-7deg)";
			}
		});
		notification.addEventListener("mouseover", function() {
			clearTimeout(app.notificationTimeouts[this.id]);
			clearTimeout(app.notificationRemoveTimeouts[this.id]);
			app.notificationTimeouts[this.id] = undefined;
			app.notificationRemoveTimeouts[this.id] = undefined;
			this.classList.remove("slide-in");
			this.classList.remove("fade-out");
		});
		notification.addEventListener("mouseout", function() {
			var el = this;
			if (!el.classList.contains("slide-out")) {
				app.notificationTimeouts[el.id] = setTimeout(function() {
					el.classList.add("fade-out");
					app.notificationRemoveTimeouts[el.id] = setTimeout(function() {
						el.parentNode.parentNode.removeChild(el.parentNode);

						app.notificationTimeouts[el.id] = undefined;
						app.notificationRemoveTimeouts[el.id] = undefined;

						if (app.notifyTimeoutsDone()) {
							app.notificationTimeouts = [];
							app.notificationRemoveTimeouts = [];
						}
					}, ((!window.isPhone))?3000:300);
				}, 5000);
			}
		});
		notification.addEventListener("click", function() {
			this.removeAttribute("style");

			var elNot = this;
			var parent = this.parentNode;
			setTimeout(function() {
				elNot.className = ((app.params.notificationTransitions))?"notification slide-out":"notification";

				setTimeout(function() {
					parent.parentNode.removeChild(parent);
					for (var i=0; i<$$("div.notification-wrapper").length;i++) {
						var el = $$("div.notification-wrapper")[i];
						if (el && !window.isPhone) {
							el.style.top = 20 + (($$("div.notification-wrapper").length-(i+1))*100) + "px";
						}
					}
					if (typeof callback === 'function') {
						callback();
					}
				}, ((app.params.notificationTransitions))?300:0);
			}, 300);
		});

		var notificationClose = document.createElement("div");
		notificationClose.className = "close-box";
		notificationClose.addEventListener(app.touchEventStart, function() {
			var el = this;
			setTimeout(function() {
				var top = el.parentNode.style.top;
				el.parentNode.removeAttribute("style");
				el.parentNode.style.top = top;
			}, 0);
		});
		notificationClose.addEventListener("mouseup", function() {
			var parent = this.parentNode.parentNode;
			this.parentNode.className = ((app.params.notificationTransitions))?"notification slide-out":"notification";

			setTimeout(function() {
				for (var i=0; i<$$("div.notification-wrapper").length;i++) {
					var el = $$("div.notification-wrapper")[i];
					if (el) {
						el.style.top = 20 + (($$("div.notification-wrapper").length-(i+1))*100) + "px";
					}
				}
			}, ((app.params.notificationTransitions))?300:0);
		});
		notification.appendChild(notificationClose);

		var notificationTitle = document.createElement("div");
		notificationTitle.className = "title";
		notificationTitle.innerHTML = ((typeof(title)!=="undefined"))?title:app.params.modalDefaultTitle;
		notification.appendChild(notificationTitle);

		var notificationContent = document.createElement("div");
		notificationContent.className = "content";
		var notificationContentText = document.createElement("p");
		notificationContentText.innerHTML = ((typeof(message)!=="undefined"))?message:"No content";
		notificationContent.appendChild(notificationContentText);
		notification.appendChild(notificationContent);
		notificationWrapper.appendChild(notification);

		if ($$("div.notification-wrapper").length > 0) {
			for (var i=0; i<$$("div.notification-wrapper").length;i++) {
				var el = $$("div.notification-wrapper")[i];
				if (!window.isPhone) {
					el.style.top = 20 + (($$("div.notification-wrapper").length-i)*100) + "px";
				}
			}
		}


		document.getElementsByClassName("notification-center")[0].appendChild(notificationWrapper);
		setTimeout(function() {
			var el = $("div.notification-center div.notification-wrapper:last-child div.content");
			var elNot = $("div.notification-center div.notification-wrapper:last-child div.notification");
			var ellipsis = new Ellipsis(el);

			ellipsis.calc();
			ellipsis.set();

			elNot.id = app.notificationTimeouts.length;
			app.notificationTimeouts.push(setTimeout(function() {
				if ($("div.notification-center div.notification-wrapper:last-child div.notification")) {
					elNot.classList.add("fade-out");
				}
				app.notificationRemoveTimeouts.push(setTimeout(function() {
					if ($("div.notification-center div.notification-wrapper:last-child div.notification") && $("div.notification-center div.notification-wrapper:last-child div.notification").parentNode) {
						elNot.parentNode.parentNode.removeChild(elNot.parentNode);
					}

					app.notificationTimeouts[elNot.id] = undefined;
					app.notificationRemoveTimeouts[elNot.id] = undefined;

					if (app.notifyTimeoutsDone()) {
						app.notificationTimeouts = [];
						app.notificationRemoveTimeouts = [];
					}
				}, ((!window.isPhone))?3000:300));
			}, 5000));
		}, 10);
		return notificationWrapper;
	};
	MetroUI.notifyTimeoutsDone = function() {
		for (var i=0; i<app.notificationTimeouts.length; i++) {
			if (app.notificationTimeouts[i] !== undefined) {
				return false;
			}
		}
		return true;
	};
	MetroUI.prototype.notify = function(title,message,callback) {
		new MetroUI.Notification(this,title,message,callback);
	};
})();

(function() {
	"use strict";
	MetroUI.Pivot = function(page, params) {
		var pivotParams = {
			slideClass: "pivot-slide",
			wrapperClass: "pivot-wrapper",
			slidesPerView: 1,
			loop: true,
			loopAdditionalSlides: 0,
			spaceBetween: 15,
			watchSlidesProgress: true,
			runCallbacksOnInit: false,
			mousewheelControl: !window.isPhone,
			simulateTouch: window.isPhone,

			pivotEnableParallax: true,

			onInit: function(swiper, event) {
				new Dom7("div.page[data-page=\""+page+"\"] div.pivot").removeClass("transitioning");

				var tabs = $$("div.navbar header[data-page=\""+page+"\"] h1");

				if (pivotParams.loop) {
					for (var i=0; i<2;i++) {
						var newTab = tabs[i].cloneNode(true)
						newTab.classList.add("pivot-duplicate");
						$("div.navbar header[data-page=\""+page+"\"] div.pivot-controls").appendChild(newTab);
					}
					for (var i=1;i>=0;i--) {
						var newTab = tabs[i].cloneNode(true);
						newTab.classList.add("pivot-duplicate");
						$("div.navbar header[data-page=\""+page+"\"] div.pivot-controls").insertBefore(newTab, $("div.navbar header[data-page=\""+page+"\"] div.pivot-controls h1:first-child"));
					}
					_$("div.navbar header[data-page=\""+page+"\"] h1.pivot-active").removeClass("pivot-active");
					$$("div.navbar header[data-page=\""+page+"\"] h1")[swiper.snapIndex+1].classList.add("pivot-active");
					_$("div.navbar header[data-page=\""+page+"\"] h1[data-tab=\""+$$("div.navbar header[data-page=\""+page+"\"] h1")[swiper.snapIndex+1].getAttribute("data-tab")+"\"]").addClass("pivot-active");
				}

				if (pivotParams.pivotEnableParallax) {
					var difference;
					if (swiper.slides[swiper.snapIndex].progress < 0) {
						difference = calcPivotSnapPoints(page)[swiper.snapIndex+1] - calcPivotSnapPoints(page)[swiper.snapIndex];
					} else {
						difference = calcPivotSnapPoints(page)[swiper.snapIndex+2] - calcPivotSnapPoints(page)[swiper.snapIndex+1];
					}
					_$("div.navbar header[data-page=\""+page+"\"] div.pivot-controls").transform("translate3d("+(-calcPivotSnapPoints("pivot")[swiper.snapIndex+1]-(difference*swiper.slides[swiper.snapIndex].progress))+"px,0,0)");
				}
			},

			onSetTranslate: function(swiper, translate) {
				if (!_$("div.pivot").hasClass("transitioning") && pivotParams.pivotEnableParallax) {
					var difference;
					if (swiper.slides[swiper.snapIndex].progress < 0) {
						difference = calcPivotSnapPoints(page)[swiper.snapIndex+1] - calcPivotSnapPoints(page)[swiper.snapIndex];
					} else {
						difference = calcPivotSnapPoints(page)[swiper.snapIndex+2] - calcPivotSnapPoints(page)[swiper.snapIndex+1];
					}
					_$("div.navbar header[data-page=\""+page+"\"] div.pivot-controls").transform("translate3d("+(-calcPivotSnapPoints("pivot")[swiper.snapIndex+1]-(difference*swiper.slides[swiper.snapIndex].progress))+"px,0,0)");
				}
			},

			onTransitionStart: function(swiper, event) {
				if (pivotParams.pivotEnableParallax) {
					new Dom7("div.page[data-page=\""+page+"\"] div.pivot").addClass("transitioning");

					var difference = 0;
					difference = calcPivotSnapPoints(page)[swiper.snapIndex+1] - calcPivotSnapPoints(page)[swiper.snapIndex];
					$$("div.navbar header[data-page=\""+page+"\"] h1")[swiper.snapIndex+1].parentNode.style.webkitTransition = "-webkit-transform 300ms ease";
						_$("div.navbar header[data-page=\""+page+"\"] div.pivot-controls").transform("translate3d("+(-calcPivotSnapPoints(page)[swiper.snapIndex+1]-(difference*swiper.slides[swiper.snapIndex].progress))+"px,0,0)");

					_$("div.navbar header[data-page=\""+page+"\"] h1.pivot-active").removeClass("pivot-active");
					$$("div.navbar header[data-page=\""+page+"\"] h1")[swiper.snapIndex+1].classList.add("pivot-active");
					_$("div.navbar header[data-page=\""+page+"\"] h1[data-tab=\""+$$("div.navbar header[data-page=\""+page+"\"] h1")[swiper.snapIndex+1].getAttribute("data-tab")+"\"]").addClass("pivot-active");
				}
			},
			onTransitionEnd: function(swiper, event) {
				if (pivotParams.pivotEnableParallax) {
					new Dom7("div.page[data-page=\""+page+"\"] div.pivot").removeClass("transitioning");
					$$("div.navbar header[data-page=\""+page+"\"] h1")[swiper.snapIndex+1].parentNode.style.webkitTransition = "";
				}
			}
		};
		for (var param in params) {
			pivotParams[param] = params[param];
		}

		var pivot = new Swiper(new Dom7("div.page[data-page=\""+page+"\"] div.pivot"), pivotParams);

		return pivot;
	}
})();

function calcPivotSnapPoints(header) {
	var snaps = [];
	_$("div.navbar header[data-page=\""+header+"\"] h1").each(function(index,el) {
		snaps.push(el.offsetLeft-15);
	});
	return snaps;
}
(function() {
	"use strict";
	MetroUI.Hub = function(page) {
		var hub = this;

		hub.init = function() {
			var hubRequest = new XMLHttpRequest();
			hubRequest.open("GET", "hubs.json?"+(new Date()).getTime(), false);
			hubRequest.send(null);
			var hubResult = JSON.parse(hubRequest.responseText).hubs;

			if (hubResult.title) {
				_$("div.page[data-page=\""+page+"\"] header h1").text(_$("div.page[data-page=\""+page+"\"] header h1").text().replace(/{{HubTitle}}/g, hubResult.title));
			}
			if (hubResult.sections) {
				for (var i=0; i<hubResult.sections.length; i++) {
					var slide = document.createElement("div");
					slide.className = "hub-slide";
					slide.setAttribute("data-tab", hubResult.sections[i].id);

					var slideContent = document.createElement("div");
					slideContent.className = "content";

					var slideHeader = document.createElement("h2");
					slideHeader.innerHTML = hubResult.sections[i].title;
					slideContent.appendChild(slideHeader);

					var tileCount = 0, tileDetailCount = 0, tileWideCount = 0, tilePromoCount = 0;
					for (var j=0; j<hubResult.sections[i].items.length; j++) {
						var tile = document.createElement("div");
						tile.className = hubResult.sections[i].items[j].type;

						if (hubResult.sections[i].items[j].type == "tile") {
							tileCount++;
						} else if (hubResult.sections[i].items[j].type == "tile detail") {
							slide.classList.add("detail");
							tileDetailCount++;

							var tileTitle = document.createElement("p");
							tileTitle.className = "title";
							var tileDesc = document.createElement("p");
							tileDesc.className = "description";
							tile.appendChild(tileTitle);
							tile.appendChild(tileDesc);
						} else if (hubResult.sections[i].items[j].type == "tile wide") {
							tileWideCount++;
						} else if (hubResult.sections[i].items[j].type == "tile promo") {
							tilePromoCount++;
						}

						slideContent.appendChild(tile);
					}
					if (tilePromoCount == 1) {
						//slide.style.width = "495px";
						slide.classList.add("promo");
						if (tileCount > 3 || (tileWideCount == 1 && tileCount > 2)) {
							//slide.style.width = "825px";
							slide.classList.add("wide");
						}
					} else if (tileDetailCount >= 4) {
						//slide.style.width = "905px";
						slide.classList.add("wide");
					}

					slide.appendChild(slideContent);
					$("div.page[data-page=\""+page+"\"] div.pivot-wrapper").appendChild(slide);
				}
				//$("div.page[data-page=\""+page+"\"] div.hub-slide:last-child").style.width = ($("div.page[data-page=\""+page+"\"] div.hub-slide:last-child").offsetWidth+135)+"px";
			}

			return new MetroUI.Pivot(page, {
				freeMode: true,
				loop: false,
				spaceBetween: (window.isPhone)?35:65,
				mousewheelForceToAxis: false,
				slidesPerView: "auto",
				slideClass: "hub-slide",
				pivotEnableParallax: false
			});
		}
		hub.init();
	};
})();
(function() {
	"use strict";
	MetroUI.TabControl = function(page, params) {
		var tab = {};

		tab.params = {
			app: undefined,
			splitView: false,
			autoSplitViewModern: true,
			autoPivotPhone: true,
		};
		for (var param in params) {
			tab.params[param] = params[param];
		}

		tab.init = function() {
			if (!tab.params.splitView) {
				if ($("div.page[data-page=\""+page+"\"] div.tab")) {
					$("div.page[data-page=\""+page+"\"] div.tab").classList.add("tab-active");
					$("div.navbar header[data-page=\""+page+"\"] div.tab-control h1").classList.add("tab-active");
				}

				if ($("div.navbar header[data-page=\""+page+"\"] div.tab-control")) {
					_$("div.navbar").addClass("tab-controls");
					_$("div.navbar header[data-page=\""+page+"\"]").addClass("slide-in");

					for (var i=0; i<$$("div.navbar header[data-page=\""+page+"\"] div.tab-control h1").length; i++) {
						$$("div.navbar header[data-page=\""+page+"\"] div.tab-control h1")[i].onclick = function() {
							var el = this;
							var gotoTab = el.getAttribute("data-tab");

							if ($("div.page[data-page=\""+page+"\"] div.tab.tab-active:not(#"+gotoTab+")")) {
								while ($("div.page[data-page=\""+page+"\"] div.tab.tab-active:not(#"+gotoTab+")")) {
									$("div.page[data-page=\""+page+"\"] div.tab.tab-active:not(#"+gotoTab+")").classList.remove("tab-active");
								}
							}

							if ($("div.navbar header[data-page=\""+page+"\"] div.tab-control h1.tab-active:not([data-tab=\""+gotoTab+"\"])")) {
								while ($("div.navbar header[data-page=\""+page+"\"] div.tab-control h1.tab-active:not([data-tab=\""+gotoTab+"\"])")) {
									$("div.navbar header[data-page=\""+page+"\"] div.tab-control h1.tab-active:not([data-tab=\""+gotoTab+"\"])").classList.remove("tab-active");
								}
							}

							if ($("div.page[data-page=\""+page+"\"] div.tab#"+gotoTab)) {
								if (!$("div.page[data-page=\""+page+"\"] div.tab#"+gotoTab).classList.contains("tab-active")) {
									$("div.page[data-page=\""+page+"\"] div.tab#"+gotoTab).classList.add("tab-active");
									$("div.navbar header[data-page=\""+page+"\"] div.tab-control h1[data-tab=\""+gotoTab+"\"]").classList.add("tab-active");
									tab.params.app.animation.pageSlideIn(page, false);
								}
							}
						}
					}
				}
			}
		};

		tab.init();
	};
})();
(function() {
	"use strict";
	MetroUI.SplitControl = function(page, params) {
		var tab = {};

		tab.params = {
			app: undefined,
			splitView: true,
			autoSplitViewModern: true,
			autoPivotPhone: true,
		};
		for (var param in params) {
			tab.params[param] = params[param];
		}

		tab.init = function() {
			if (tab.params.splitView) {
				tab.params.app.animation.pageSlideIn(page,true,true);
				if ($("div.navbar header[data-page=\""+page+"\"] div.split-control")) {
					$("div.navbar header[data-page=\""+page+"\"] div.split-control").onclick = function() {
						if ($("div.page[data-page=\""+page+"\"] div.tab-control")) {
							$("div.page[data-page=\""+page+"\"] div.tab-control").classList.toggle("extended");
						}
					}
				}

				if ($("div.page[data-page=\""+page+"\"] div.tab")) {
					$("div.page[data-page=\""+page+"\"] div.tab").classList.add("tab-active");
					$("div.page[data-page=\""+page+"\"] div.tab-control div.tab-link").classList.add("tab-active");
				}

				if ($("div.page[data-page=\""+page+"\"] div.tab-control")) {
					if ($("div.page[data-page=\""+page+"\"] div.tab-control div.tab-link")) {
						for (var i=0; i<$$("div.page[data-page=\""+page+"\"] div.tab-control div.tab-link").length; i++) {
							$$("div.page[data-page=\""+page+"\"] div.tab-control div.tab-link")[i].onclick = function() {
								var el = this;
								if ($("div.page[data-page=\""+page+"\"] div.tab.tab-active:not(#"+el.getAttribute("data-tab")+")")) {
									while ($("div.page[data-page=\""+page+"\"] div.tab.tab-active:not(#"+el.getAttribute("data-tab")+")")) {
										$("div.page[data-page=\""+page+"\"] div.tab.tab-active:not(#"+el.getAttribute("data-tab")+")").classList.remove("tab-active");
									}
								}
								if ($("div.page[data-page=\""+page+"\"] div.tab-control div.tab-active:not(#"+el.getAttribute("data-tab")+")")) {
									while ($("div.page[data-page=\""+page+"\"] div.tab-control div.tab-active:not(#"+el.getAttribute("data-tab")+")")) {
										$("div.page[data-page=\""+page+"\"] div.tab-control div.tab-active:not(#"+el.getAttribute("data-tab")+")").classList.remove("tab-active");
									}
								}
								el.classList.add("tab-active")

								if ($("div.page[data-page=\""+page+"\"] div.tab#"+el.getAttribute("data-tab"))) {
									if (!$("div[data-page=\""+page+"\"] div.tab#"+el.getAttribute("data-tab")).classList.contains("tab-active")) {
										$("div.page[data-page=\""+page+"\"] div.tab#"+el.getAttribute("data-tab")).classList.add("tab-active");
										$("div.page[data-page=\""+page+"\"]").classList.remove("slide-in");
										if ($("div.page[data-page=\""+page+"\"] div.tab-control").classList.contains("extended")) {
											$("div.page[data-page=\""+page+"\"] div.tab-control").classList.remove("extended");
											tab.params.app.animation.pageSlideIn(page, true, true);
										} else {
											tab.params.app.animation.pageSlideIn(page, false, true);
										}
									} else {
										$("div.page[data-page=\""+page+"\"] div.tab-control").classList.remove("extended");
									}
								}
							}
						}
					}
				}
			}
		};

		tab.init();
		return tab;
	};
})();
/*===========================
Dom7 Library
© iDangero.us

This library is only
temporary and will be
replaced soon.
===========================*/
var Dom7 = (function() {
	var Dom7 = function (arr) {
		var _this = this, i = 0;
		// Create array-like object
		for (i = 0; i < arr.length; i++) {
			_this[i] = arr[i];
		}
		_this.length = arr.length;
		// Return collection with methods
		return this;
	};
	var $ = function (selector, context) {
		var arr = [], i = 0;
		if (selector && !context) {
			if (selector instanceof Dom7) {
				return selector;
			}
		}
		if (selector) {
			// String
			if (typeof selector === 'string') {
				var els, tempParent, html = selector.trim();
				if (html.indexOf('<') >= 0 && html.indexOf('>') >= 0) {
					var toCreate = 'div';
					if (html.indexOf('<li') === 0) toCreate = 'ul';
					if (html.indexOf('<tr') === 0) toCreate = 'tbody';
					if (html.indexOf('<td') === 0 || html.indexOf('<th') === 0) toCreate = 'tr';
					if (html.indexOf('<tbody') === 0) toCreate = 'table';
					if (html.indexOf('<option') === 0) toCreate = 'select';
					tempParent = document.createElement(toCreate);
					tempParent.innerHTML = selector;
					for (i = 0; i < tempParent.childNodes.length; i++) {
						arr.push(tempParent.childNodes[i]);
					}
				}
				else {
					if (!context && selector[0] === '#' && !selector.match(/[ .<>:~]/)) {
						// Pure ID selector
						els = [document.getElementById(selector.split('#')[1])];
					}
					else {
						// Other selectors
						els = (context || document).querySelectorAll(selector);
					}
					for (i = 0; i < els.length; i++) {
						if (els[i]) arr.push(els[i]);
					}
				}
			}
			// Node/element
			else if (selector.nodeType || selector === window || selector === document) {
				arr.push(selector);
			}
			//Array of elements or instance of Dom
			else if (selector.length > 0 && selector[0].nodeType) {
				for (i = 0; i < selector.length; i++) {
					arr.push(selector[i]);
				}
			}
		}
//		if (arr.length > 0) {
			return new Dom7(arr);
//		} else {
//			return false;
//		}
	};
	Dom7.prototype = {
		// Classes and attriutes
		addClass: function (className) {
			if (typeof className === 'undefined') {
				return this;
			}
			var classes = className.split(' ');
			for (var i = 0; i < classes.length; i++) {
				for (var j = 0; j < this.length; j++) {
					if (typeof this[j].classList !== 'undefined') this[j].classList.add(classes[i]);
				}
			}
			return this;
		},
		removeClass: function (className) {
			var classes = className.split(' ');
			for (var i = 0; i < classes.length; i++) {
				for (var j = 0; j < this.length; j++) {
					if (typeof this[j].classList !== 'undefined') this[j].classList.remove(classes[i]);
				}
			}
			return this;
		},
		hasClass: function (className) {
			if (!this[0]) return false;
			else return this[0].classList.contains(className);
		},
		toggleClass: function (className) {
			var classes = className.split(' ');
			for (var i = 0; i < classes.length; i++) {
				for (var j = 0; j < this.length; j++) {
					if (typeof this[j].classList !== 'undefined') this[j].classList.toggle(classes[i]);
				}
			}
			return this;
		},
		attr: function (attrs, value) {
			if (arguments.length === 1 && typeof attrs === 'string') {
				// Get attr
				if (this[0]) return this[0].getAttribute(attrs);
				else return undefined;
			}
			else {
				// Set attrs
				for (var i = 0; i < this.length; i++) {
					if (arguments.length === 2) {
						// String
						this[i].setAttribute(attrs, value);
					}
					else {
						// Object
						for (var attrName in attrs) {
							this[i][attrName] = attrs[attrName];
							this[i].setAttribute(attrName, attrs[attrName]);
						}
					}
				}
				return this;
			}
		},
		removeAttr: function (attr) {
			for (var i = 0; i < this.length; i++) {
				this[i].removeAttribute(attr);
			}
			return this;
		},
		prop: function (props, value) {
			if (arguments.length === 1 && typeof props === 'string') {
				// Get prop
				if (this[0]) return this[0][props];
				else return undefined;
			}
			else {
				// Set props
				for (var i = 0; i < this.length; i++) {
					if (arguments.length === 2) {
						// String
						this[i][props] = value;
					}
					else {
						// Object
						for (var propName in props) {
							this[i][propName] = props[propName];
						}
					}
				}
				return this;
			}
		},
		data: function (key, value) {
			if (typeof value === 'undefined') {
				// Get value
				if (this[0]) {
					var dataKey = this[0].getAttribute('data-' + key);
					if (dataKey) return dataKey;
					else if (this[0].dom7ElementDataStorage && (key in this[0].dom7ElementDataStorage)) return this[0].dom7ElementDataStorage[key];
					else return undefined;
				}
				else return undefined;
			}
			else {
				// Set value
				for (var i = 0; i < this.length; i++) {
					var el = this[i];
					if (!el.dom7ElementDataStorage) el.dom7ElementDataStorage = {};
					el.dom7ElementDataStorage[key] = value;
				}
				return this;
			}
		},
		removeData: function(key) {
			for (var i = 0; i < this.length; i++) {
				var el = this[i];
				if (el.dom7ElementDataStorage && el.dom7ElementDataStorage[key]) {
					el.dom7ElementDataStorage[key] = null;
					delete el.dom7ElementDataStorage[key];
				}
			}
		},
		dataset: function () {
			var el = this[0];
			if (el) {
				var dataset = {};
				if (el.dataset) {
					for (var dataKey in el.dataset) {
						dataset[dataKey] = el.dataset[dataKey];
					}
				}
				else {
					for (var i = 0; i < el.attributes.length; i++) {
						var attr = el.attributes[i];
						if (attr.name.indexOf('data-') >= 0) {
							dataset[$.toCamelCase(attr.name.split('data-')[1])] = attr.value;
						}
					}
				}
				for (var key in dataset) {
					if (dataset[key] === 'false') dataset[key] = false;
					else if (dataset[key] === 'true') dataset[key] = true;
					else if (parseFloat(dataset[key]) === dataset[key] * 1) dataset[key] = dataset[key] * 1;
				}
				return dataset;
			}
			else return undefined;
		},
		val: function (value) {
			if (typeof value === 'undefined') {
				if (this[0]) return this[0].value;
				else return undefined;
			}
			else {
				for (var i = 0; i < this.length; i++) {
					this[i].value = value;
				}
				return this;
			}
		},
		// Transforms
		transform : function (transform) {
			for (var i = 0; i < this.length; i++) {
				var elStyle = this[i].style;
				elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.MozTransform = elStyle.OTransform = elStyle.transform = transform;
			}
			return this;
		},
		transition: function (duration) {
			if (typeof duration !== 'string') {
				duration = duration + 'ms';
			}
			for (var i = 0; i < this.length; i++) {
				var elStyle = this[i].style;
				elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.MozTransitionDuration = elStyle.OTransitionDuration = elStyle.transitionDuration = duration;
			}
			return this;
		},
		//Events
		on: function (eventName, targetSelector, listener, capture) {
			var app = window.Dom7.app;
			function handleLiveEvent(e) {
				var target = e.target;
				if ($(target).is(targetSelector)) listener.call(target, e);
				else {
					var parents = $(target).parents();
					for (var k = 0; k < parents.length; k++) {
						if ($(parents[k]).is(targetSelector)) listener.call(parents[k], e);
					}
				}
			}
			var events = eventName.split(' ');
			var i, j;
			for (i = 0; i < this.length; i++) {
				if (typeof targetSelector === 'function' || targetSelector === false) {
					// Usual events
					if (typeof targetSelector === 'function') {
						listener = arguments[1];
						capture = arguments[2] || false;
					}
					for (j = 0; j < events.length; j++) {
						this[i].addEventListener(events[j], listener, capture);
					}
				}
				else {
					//Live events
					for (j = 0; j < events.length; j++) {
						if (!this[i].dom7LiveListeners) this[i].dom7LiveListeners = [];
						this[i].dom7LiveListeners.push({listener: listener, liveListener: handleLiveEvent});
						this[i].addEventListener(events[j], handleLiveEvent, capture);
					}
				}
			}

			return this;
		},
		off: function (eventName, targetSelector, listener, capture) {
			var events = eventName.split(' ');
			for (var i = 0; i < events.length; i++) {
				for (var j = 0; j < this.length; j++) {
					if (typeof targetSelector === 'function' || targetSelector === false) {
						// Usual events
						if (typeof targetSelector === 'function') {
							listener = arguments[1];
							capture = arguments[2] || false;
						}
						this[j].removeEventListener(events[i], listener, capture);
					}
					else {
						// Live event
						if (this[j].dom7LiveListeners) {
							for (var k = 0; k < this[j].dom7LiveListeners.length; k++) {
								if (this[j].dom7LiveListeners[k].listener === listener) {
									this[j].removeEventListener(events[i], this[j].dom7LiveListeners[k].liveListener, capture);
								}
							}
						}
					}
				}
			}
			return this;
		},
		once: function (eventName, targetSelector, listener, capture) {
			var dom = this;
			if (typeof targetSelector === 'function') {
				targetSelector = false;
				listener = arguments[1];
				capture = arguments[2];
			}
			function proxy(e) {
				listener(e);
				dom.off(eventName, targetSelector, proxy, capture);
			}
			dom.on(eventName, targetSelector, proxy, capture);
		},
		trigger: function (eventName, eventData) {
			for (var i = 0; i < this.length; i++) {
				var evt;
				try {
					evt = new CustomEvent(eventName, {detail: eventData, bubbles: true, cancelable: true});
				}
				catch (e) {
					evt = document.createEvent('Event');
					evt.initEvent(eventName, true, true);
					evt.detail = eventData;
				}
				this[i].dispatchEvent(evt);
			}
			return this;
		},
		transitionEnd: function (callback) {
			var events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'],
				i, j, dom = this;
			function fireCallBack(e) {
				/*jshint validthis:true */
				if (e.target !== this) return;
				callback.call(this, e);
				for (i = 0; i < events.length; i++) {
					dom.off(events[i], fireCallBack);
				}
			}
			if (callback) {
				for (i = 0; i < events.length; i++) {
					dom.on(events[i], fireCallBack);
				}
			}
			return this;
		},
		animationEnd: function (callback) {
			var events = ['webkitAnimationEnd', 'OAnimationEnd', 'MSAnimationEnd', 'animationend'],
				i, j, dom = this;
			function fireCallBack(e) {
				callback(e);
				for (i = 0; i < events.length; i++) {
					dom.off(events[i], fireCallBack);
				}
			}
			if (callback) {
				for (i = 0; i < events.length; i++) {
					dom.on(events[i], fireCallBack);
				}
			}
			return this;
		},
		// Sizing/Styles
		width: function () {
			if (this[0] === window) {
				return window.innerWidth;
			}
			else {
				if (this.length > 0) {
					return parseFloat(this.css('width'));
				}
				else {
					return null;
				}
			}
		},
		outerWidth: function (includeMargins) {
			if (this.length > 0) {
				if (includeMargins) {
					var styles = this.styles();
					return this[0].offsetWidth + parseFloat(styles.getPropertyValue('margin-right')) + parseFloat(styles.getPropertyValue('margin-left'));
				}
				else
					return this[0].offsetWidth;
			}
			else return null;
		},
		height: function () {
			if (this[0] === window) {
				return window.innerHeight;
			}
			else {
				if (this.length > 0) {
					return parseFloat(this.css('height'));
				}
				else {
					return null;
				}
			}
		},
		outerHeight: function (includeMargins) {
			if (this.length > 0) {
				if (includeMargins) {
					var styles = this.styles();
					return this[0].offsetHeight + parseFloat(styles.getPropertyValue('margin-top')) + parseFloat(styles.getPropertyValue('margin-bottom'));
				}
				else
					return this[0].offsetHeight;
			}
			else return null;
		},
		offset: function () {
			if (this.length > 0) {
				var el = this[0];
				var box = el.getBoundingClientRect();
				var body = document.body;
				var clientTop  = el.clientTop  || body.clientTop	 || 0;
				var clientLeft = el.clientLeft || body.clientLeft || 0;
				var scrollTop  = window.pageYOffset || el.scrollTop;
				var scrollLeft = window.pageXOffset || el.scrollLeft;
				return {
					top: box.top  + scrollTop  - clientTop,
					left: box.left + scrollLeft - clientLeft
				};
			}
			else {
				return null;
			}
		},
		hide: function () {
			for (var i = 0; i < this.length; i++) {
				this[i].style.display = 'none';
			}
			return this;
		},
		show: function () {
			for (var i = 0; i < this.length; i++) {
				this[i].style.display = 'block';
			}
			return this;
		},
		styles: function () {
			var i, styles;
			if (this[0]) return window.getComputedStyle(this[0], null);
			else return undefined;
		},
		css: function (props, value) {
			var i;
			if (arguments.length === 1) {
				if (typeof props === 'string') {
					if (this[0]) return window.getComputedStyle(this[0], null).getPropertyValue(props);
				}
				else {
					for (i = 0; i < this.length; i++) {
						for (var prop in props) {
							this[i].style[prop] = props[prop];
						}
					}
					return this;
				}
			}
			if (arguments.length === 2 && typeof props === 'string') {
				for (i = 0; i < this.length; i++) {
					this[i].style[props] = value;
				}
				return this;
			}
			return this;
		},

		//Dom manipulation
		each: function (callback) {
			for (var i = 0; i < this.length; i++) {
				callback.call(this[i], i, this[i]);
			}
			return this;
		},
		html: function (html) {
			if (typeof html === 'undefined') {
				return this[0] ? this[0].innerHTML : undefined;
			}
			else {
				for (var i = 0; i < this.length; i++) {
					this[i].innerHTML = html;
				}
				return this;
			}
		},
		text: function (text) {
			if (typeof text === 'undefined') {
				if (this[0]) {
					return this[0].textContent.trim();
				}
				else return null;
			}
			else {
				for (var i = 0; i < this.length; i++) {
					this[i].textContent = text;
				}
			}
		},
		is: function (selector) {
			if (!this[0] || typeof selector === 'undefined') return false;
			var compareWith, i;
			if (typeof selector === 'string') {
				var el = this[0];
				if (el === document) return selector === document;
				if (el === window) return selector === window;

				if (el.matches) return el.matches(selector);
				else if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
				else if (el.mozMatchesSelector) return el.mozMatchesSelector(selector);
				else if (el.msMatchesSelector) return el.msMatchesSelector(selector);
				else {
					compareWith = $(selector);
					for (i = 0; i < compareWith.length; i++) {
						if (compareWith[i] === this[0]) return true;
					}
					return false;
				}
			}
			else if (selector === document) return this[0] === document;
			else if (selector === window) return this[0] === window;
			else {
				if (selector.nodeType || selector instanceof Dom7) {
					compareWith = selector.nodeType ? [selector] : selector;
					for (i = 0; i < compareWith.length; i++) {
						if (compareWith[i] === this[0]) return true;
					}
					return false;
				}
				return false;
			}

		},
		indexOf: function (el) {
			for (var i = 0; i < this.length; i++) {
				if (this[i] === el) return i;
			}
		},
		index: function () {
			if (this[0]) {
				var child = this[0];
				var i = 0;
				while ((child = child.previousSibling) !== null) {
					if (child.nodeType === 1) i++;
				}
				return i;
			}
			else return undefined;
		},
		eq: function (index) {
			if (typeof index === 'undefined') return this;
			var length = this.length;
			var returnIndex;
			if (index > length - 1) {
				return new Dom7([]);
			}
			if (index < 0) {
				returnIndex = length + index;
				if (returnIndex < 0) return new Dom7([]);
				else return new Dom7([this[returnIndex]]);
			}
			return new Dom7([this[index]]);
		},
		append: function (newChild) {
			var i, j;
			for (i = 0; i < this.length; i++) {
				if (typeof newChild === 'string') {
					var tempDiv = document.createElement('div');
					tempDiv.innerHTML = newChild;
					while (tempDiv.firstChild) {
						this[i].appendChild(tempDiv.firstChild);
					}
				}
				else if (newChild instanceof Dom7) {
					for (j = 0; j < newChild.length; j++) {
						this[i].appendChild(newChild[j]);
					}
				}
				else {
					this[i].appendChild(newChild);
				}
			}
			return this;
		},
		prepend: function (newChild) {
			var i, j;
			for (i = 0; i < this.length; i++) {
				if (typeof newChild === 'string') {
					var tempDiv = document.createElement('div');
					tempDiv.innerHTML = newChild;
					for (j = tempDiv.childNodes.length - 1; j >= 0; j--) {
						this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
					}
					// this[i].insertAdjacentHTML('afterbegin', newChild);
				}
				else if (newChild instanceof Dom7) {
					for (j = 0; j < newChild.length; j++) {
						this[i].insertBefore(newChild[j], this[i].childNodes[0]);
					}
				}
				else {
					this[i].insertBefore(newChild, this[i].childNodes[0]);
				}
			}
			return this;
		},
		insertBefore: function (selector) {
			var before = $(selector);
			for (var i = 0; i < this.length; i++) {
				if (before.length === 1) {
					before[0].parentNode.insertBefore(this[i], before[0]);
				}
				else if (before.length > 1) {
					for (var j = 0; j < before.length; j++) {
						before[j].parentNode.insertBefore(this[i].cloneNode(true), before[j]);
					}
				}
			}
		},
		insertAfter: function (selector) {
			var after = $(selector);
			for (var i = 0; i < this.length; i++) {
				if (after.length === 1) {
					after[0].parentNode.insertBefore(this[i], after[0].nextSibling);
				}
				else if (after.length > 1) {
					for (var j = 0; j < after.length; j++) {
						after[j].parentNode.insertBefore(this[i].cloneNode(true), after[j].nextSibling);
					}
				}
			}
		},
		next: function (selector) {
			if (this.length > 0) {
				if (selector) {
					if (this[0].nextElementSibling && $(this[0].nextElementSibling).is(selector)) return new Dom7([this[0].nextElementSibling]);
					else return new Dom7([]);
				}
				else {
					if (this[0].nextElementSibling) return new Dom7([this[0].nextElementSibling]);
					else return new Dom7([]);
				}
			}
			else return new Dom7([]);
		},
		nextAll: function (selector) {
			var nextEls = [];
			var el = this[0];
			if (!el) return new Dom7([]);
			while (el.nextElementSibling) {
				var next = el.nextElementSibling;
				if (selector) {
					if($(next).is(selector)) nextEls.push(next);
				}
				else nextEls.push(next);
				el = next;
			}
			return new Dom7(nextEls);
		},
		prev: function (selector) {
			if (this.length > 0) {
				if (selector) {
					if (this[0].previousElementSibling && $(this[0].previousElementSibling).is(selector)) return new Dom7([this[0].previousElementSibling]);
					else return new Dom7([]);
				}
				else {
					if (this[0].previousElementSibling) return new Dom7([this[0].previousElementSibling]);
					else return new Dom7([]);
				}
			}
			else return new Dom7([]);
		},
		prevAll: function (selector) {
			var prevEls = [];
			var el = this[0];
			if (!el) return new Dom7([]);
			while (el.previousElementSibling) {
				var prev = el.previousElementSibling;
				if (selector) {
					if($(prev).is(selector)) prevEls.push(prev);
				}
				else prevEls.push(prev);
				el = prev;
			}
			return new Dom7(prevEls);
		},
		parent: function (selector) {
			var parents = [];
			for (var i = 0; i < this.length; i++) {
				if (selector) {
					if ($(this[i].parentNode).is(selector)) parents.push(this[i].parentNode);
				}
				else {
					parents.push(this[i].parentNode);
				}
			}
			return $($.unique(parents));
		},
		parents: function (selector) {
			var parents = [];
			for (var i = 0; i < this.length; i++) {
				var parent = this[i].parentNode;
				while (parent) {
					if (selector) {
						if ($(parent).is(selector)) parents.push(parent);
					}
					else {
						parents.push(parent);
					}
					parent = parent.parentNode;
				}
			}
			return $($.unique(parents));
		},
		find : function (selector) {
			var foundElements = [];
			for (var i = 0; i < this.length; i++) {
				var found = this[i].querySelectorAll(selector);
				for (var j = 0; j < found.length; j++) {
					foundElements.push(found[j]);
				}
			}
			return new Dom7(foundElements);
		},
		children: function (selector) {
			var children = [];
			for (var i = 0; i < this.length; i++) {
				var childNodes = this[i].childNodes;

				for (var j = 0; j < childNodes.length; j++) {
					if (!selector) {
						if (childNodes[j].nodeType === 1) children.push(childNodes[j]);
					}
					else {
						if (childNodes[j].nodeType === 1 && $(childNodes[j]).is(selector)) children.push(childNodes[j]);
					}
				}
			}
			return new Dom7($.unique(children));
		},
		remove: function () {
			for (var i = 0; i < this.length; i++) {
				if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
			}
			return this;
		},
		detach: function () {
			return this.remove();
		},
		add: function () {
			var dom = this;
			var i, j;
			for (i = 0; i < arguments.length; i++) {
				var toAdd = $(arguments[i]);
				for (j = 0; j < toAdd.length; j++) {
					dom[dom.length] = toAdd[j];
					dom.length++;
				}
			}
			return dom;
		}
	};

	// Shortcuts
	(function () {
		var shortcuts = ('click blur focus focusin focusout keyup keydown keypress submit change mousedown mousemove mouseup mouseenter mouseleave mouseout mouseover touchstart touchend touchmove resize scroll').split(' ');
		var notTrigger = ('resize scroll').split(' ');
		function createMethod(name) {
			Dom7.prototype[name] = function (handler) {
				var i;
				if (typeof handler === 'undefined') {
					for (i = 0; i < this.length; i++) {
						if (notTrigger.indexOf(name) < 0) {
							if (name in this[i]) this[i][name]();
							else {
								$(this[i]).trigger(name);
							}
						}
					}
					return this;
				}
				else {
					return this.on(name, handler);
				}
			};
		}
		for (var i = 0; i < shortcuts.length; i++) {
			createMethod(shortcuts[i]);
		}
	})();
	// Global Ajax Setup
	var globalAjaxOptions = {};
	$.ajaxSetup = function (options) {
		if (options.type) options.method = options.type;
		$.each(options, function (optionName, optionValue) {
			globalAjaxOptions[optionName]	 = optionValue;
		});
	};

	// Ajax
	var _jsonpRequests = 0;
	$.ajax = function (options) {
		var defaults = {
			method: 'GET',
			data: false,
			async: true,
			cache: true,
			user: '',
			password: '',
			headers: {},
			xhrFields: {},
			statusCode: {},
			processData: true,
			dataType: 'text',
			contentType: 'application/x-www-form-urlencoded',
			timeout: 0
		};
		var callbacks = ['beforeSend', 'error', 'complete', 'success', 'statusCode'];


		//For jQuery guys
		if (options.type) options.method = options.type;

		// Merge global and defaults
		$.each(globalAjaxOptions, function (globalOptionName, globalOptionValue) {
			if (callbacks.indexOf(globalOptionName) < 0) defaults[globalOptionName] = globalOptionValue;
		});

		// Function to run XHR callbacks and events
		function fireAjaxCallback (eventName, eventData, callbackName) {
			var a = arguments;
			if (eventName) $(document).trigger(eventName, eventData);
			if (callbackName) {
				// Global callback
				if (callbackName in globalAjaxOptions) globalAjaxOptions[callbackName](a[3], a[4], a[5], a[6]);
				// Options callback
				if (options[callbackName]) options[callbackName](a[3], a[4], a[5], a[6]);
			}
		}

		// Merge options and defaults
		$.each(defaults, function (prop, defaultValue) {
			if (!(prop in options)) options[prop] = defaultValue;
		});

		// Default URL
		if (!options.url) {
			options.url = window.location.toString();
		}
		// Parameters Prefix
		var paramsPrefix = options.url.indexOf('?') >= 0 ? '&' : '?';

		// UC method
		var _method = options.method.toUpperCase();
		// Data to modify GET URL
		if ((_method === 'GET' || _method === 'HEAD') && options.data) {
			var stringData;
			if (typeof options.data === 'string') {
				// Should be key=value string
				if (options.data.indexOf('?') >= 0) stringData = options.data.split('?')[1];
				else stringData = options.data;
			}
			else {
				// Should be key=value object
				stringData = $.serializeObject(options.data);
			}
			options.url += paramsPrefix + stringData;
		}
		// JSONP
		if (options.dataType === 'json' && options.url.indexOf('callback=') >= 0) {

			var callbackName = 'f7jsonp_' + Date.now() + (_jsonpRequests++);
			var abortTimeout;
			var callbackSplit = options.url.split('callback=');
			var requestUrl = callbackSplit[0] + 'callback=' + callbackName;
			if (callbackSplit[1].indexOf('&') >= 0) {
				var addVars = callbackSplit[1].split('&').filter(function (el) { return el.indexOf('=') > 0; }).join('&');
				if (addVars.length > 0) requestUrl += '&' + addVars;
			}

			// Create script
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.onerror = function() {
				clearTimeout(abortTimeout);
				fireAjaxCallback(undefined, undefined, 'error', null, 'scripterror');
			};
			script.src = requestUrl;

			// Handler
			window[callbackName] = function (data) {
				clearTimeout(abortTimeout);
				fireAjaxCallback(undefined, undefined, 'success', data);
				script.parentNode.removeChild(script);
				script = null;
				delete window[callbackName];
			};
			document.querySelector('head').appendChild(script);

			if (options.timeout > 0) {
				abortTimeout = setTimeout(function () {
					script.parentNode.removeChild(script);
					script = null;
					fireAjaxCallback(undefined, undefined, 'error', null, 'timeout');
				}, options.timeout);
			}

			return;
		}

		// Cache for GET/HEAD requests
		if (_method === 'GET' || _method === 'HEAD') {
			if (options.cache === false) {
				options.url += (paramsPrefix + '_nocache=' + Date.now());
			}
		}

		// Create XHR
		var xhr = new XMLHttpRequest();

		// Save Request URL
		xhr.requestUrl = options.url;
		xhr.requestParameters = options;

		// Open XHR
		xhr.open(_method, options.url, options.async, options.user, options.password);

		// Create POST Data
		var postData = null;

		if ((_method === 'POST' || _method === 'PUT') && options.data) {
			if (options.processData) {
				var postDataInstances = [ArrayBuffer, Blob, Document, FormData];
				// Post Data
				if (postDataInstances.indexOf(options.data.constructor) >= 0) {
					postData = options.data;
				}
				else {
					// POST Headers
					var boundary = '---------------------------' + Date.now().toString(16);

					if (options.contentType === 'multipart\/form-data') {
						xhr.setRequestHeader('Content-Type', 'multipart\/form-data; boundary=' + boundary);
					}
					else {
						xhr.setRequestHeader('Content-Type', options.contentType);
					}
					postData = '';
					var _data = $.serializeObject(options.data);
					if (options.contentType === 'multipart\/form-data') {
						boundary = '---------------------------' + Date.now().toString(16);
						_data = _data.split('&');
						var _newData = [];
						for (var i = 0; i < _data.length; i++) {
							_newData.push('Content-Disposition: form-data; name="' + _data[i].split('=')[0] + '"\r\n\r\n' + _data[i].split('=')[1] + '\r\n');
						}
						postData = '--' + boundary + '\r\n' + _newData.join('--' + boundary + '\r\n') + '--' + boundary + '--\r\n';
					}
					else {
						postData = options.contentType === 'application/x-www-form-urlencoded' ? _data : _data.replace(/&/g, '\r\n');
					}
				}
			}
			else {
				postData = options.data;
			}

		}

		// Additional headers
		if (options.headers) {
			$.each(options.headers, function (headerName, headerCallback) {
				xhr.setRequestHeader(headerName, headerCallback);
			});
		}

		// Check for crossDomain
		if (typeof options.crossDomain === 'undefined') {
			options.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(options.url) && RegExp.$2 !== window.location.host;
		}

		if (!options.crossDomain) {
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		}

		if (options.xhrFields) {
			$.each(options.xhrFields, function (fieldName, fieldValue) {
				xhr[fieldName] = fieldValue;
			});
		}

		var xhrTimeout;
		// Handle XHR
		xhr.onload = function (e) {
			if (xhrTimeout) clearTimeout(xhrTimeout);
			if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 0) {
				var responseData;
				if (options.dataType === 'json') {
					try {
						responseData = JSON.parse(xhr.responseText);
						fireAjaxCallback('ajaxSuccess', {xhr: xhr}, 'success', responseData, xhr.status, xhr);
					}
					catch (err) {
						fireAjaxCallback('ajaxError', {xhr: xhr, parseerror: true}, 'error', xhr, 'parseerror');
					}
				}
				else {
					fireAjaxCallback('ajaxSuccess', {xhr: xhr}, 'success', xhr.responseText, xhr.status, xhr);
				}
			}
			else {
				fireAjaxCallback('ajaxError', {xhr: xhr}, 'error', xhr, xhr.status);
			}
			if (options.statusCode) {
				if (globalAjaxOptions.statusCode && globalAjaxOptions.statusCode[xhr.status]) globalAjaxOptions.statusCode[xhr.status](xhr);
				if (options.statusCode[xhr.status]) options.statusCode[xhr.status](xhr);
			}
			fireAjaxCallback('ajaxComplete', {xhr: xhr}, 'complete', xhr, xhr.status);
		};

		xhr.onerror = function (e) {
			if (xhrTimeout) clearTimeout(xhrTimeout);
			fireAjaxCallback('ajaxError', {xhr: xhr}, 'error', xhr, xhr.status);
		};

		// Ajax start callback
		fireAjaxCallback('ajaxStart', {xhr: xhr}, 'start', xhr);
		fireAjaxCallback(undefined, undefined, 'beforeSend', xhr);


		// Send XHR
		xhr.send(postData);

		// Timeout
		if (options.timeout > 0) {
			xhrTimeout = setTimeout(function () {
				xhr.abort();
				fireAjaxCallback('ajaxError', {xhr: xhr, timeout: true}, 'error', xhr, 'timeout');
				fireAjaxCallback('ajaxComplete', {xhr: xhr, timeout: true}, 'complete', xhr, 'timeout');
			}, options.timeout);
		}

		// Return XHR object
		return xhr;
	};
	// Shrotcuts
	(function () {
		var methods = ('get post getJSON').split(' ');
		function createMethod(method) {
			$[method] = function (url, data, success) {
				return $.ajax({
					url: url,
					method: method === 'post' ? 'POST' : 'GET',
					data: typeof data === 'function' ? undefined : data,
					success: typeof data === 'function' ? data : success,
					dataType: method === 'getJSON' ? 'json' : undefined
				});
			};
		}
		for (var i = 0; i < methods.length; i++) {
			createMethod(methods[i]);
		}
	})();
	// DOM Library Utilites
	$.parseUrlQuery = function (url) {
		var query = {}, i, params, param;
		if (url.indexOf('?') >= 0) url = url.split('?')[1];
		else return query;
		params = url.split('&');
		for (i = 0; i < params.length; i++) {
			param = params[i].split('=');
			query[param[0]] = param[1];
		}
		return query;
	};
	$.isArray = function (arr) {
		if (Object.prototype.toString.apply(arr) === '[object Array]') return true;
		else return false;
	};
	$.each = function (obj, callback) {
		if (typeof obj !== 'object') return;
		if (!callback) return;
		var i, prop;
		if ($.isArray(obj) || obj instanceof Dom7) {
			// Array
			for (i = 0; i < obj.length; i++) {
				callback(i, obj[i]);
			}
		}
		else {
			// Object
			for (prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					callback(prop, obj[prop]);
				}
			}
		}
	};
	$.unique = function (arr) {
		var unique = [];
		for (var i = 0; i < arr.length; i++) {
			if (unique.indexOf(arr[i]) === -1) unique.push(arr[i]);
		}
		return unique;
	};
	$.serializeObject = function (obj) {
		if (typeof obj === 'string') return obj;
		var resultArray = [];
		var separator = '&';
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				if ($.isArray(obj[prop])) {
					var toPush = [];
					for (var i = 0; i < obj[prop].length; i ++) {
						toPush.push(encodeURIComponent(prop) + '=' + encodeURIComponent(obj[prop][i]));
					}
					if (toPush.length > 0) resultArray.push(toPush.join(separator));
				}
				else {
					// Should be string
					resultArray.push(encodeURIComponent(prop) + '=' + encodeURIComponent(obj[prop]));
				}
			}

		}

		return resultArray.join(separator);
	};
	$.toCamelCase = function (string) {
		return string.toLowerCase().replace(/-(.)/g, function(match, group1) {
			return group1.toUpperCase();
		});
	};
	$.dataset = function (el) {
		return $(el).dataset();
	};
	$.getTranslate = function (el, axis) {
		var matrix, curTransform, curStyle, transformMatrix;

		// automatic axis detection
		if (typeof axis === 'undefined') {
			axis = 'x';
		}

		curStyle = window.getComputedStyle(el, null);
		if (window.WebKitCSSMatrix) {
			// Some old versions of Webkit choke when 'none' is passed; pass
			// empty string instead in this case
			transformMatrix = new WebKitCSSMatrix(curStyle.webkitTransform === 'none' ? '' : curStyle.webkitTransform);
		}
		else {
			transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform	|| curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
			matrix = transformMatrix.toString().split(',');
		}

		if (axis === 'x') {
			//Latest Chrome and webkits Fix
			if (window.WebKitCSSMatrix)
				curTransform = transformMatrix.m41;
			//Crazy IE10 Matrix
			else if (matrix.length === 16)
				curTransform = parseFloat(matrix[12]);
			//Normal Browsers
			else
				curTransform = parseFloat(matrix[4]);
		}
		if (axis === 'y') {
			//Latest Chrome and webkits Fix
			if (window.WebKitCSSMatrix)
				curTransform = transformMatrix.m42;
			//Crazy IE10 Matrix
			else if (matrix.length === 16)
				curTransform = parseFloat(matrix[13]);
			//Normal Browsers
			else
				curTransform = parseFloat(matrix[5]);
		}

		return curTransform || 0;
	};

	$.requestAnimationFrame = function (callback) {
		if (window.requestAnimationFrame) return window.requestAnimationFrame(callback);
		else if (window.webkitRequestAnimationFrame) return window.webkitRequestAnimationFrame(callback);
		else if (window.mozRequestAnimationFrame) return window.mozRequestAnimationFrame(callback);
		else {
			return window.setTimeout(callback, 1000 / 60);
		}
	};
	$.cancelAnimationFrame = function (id) {
		if (window.cancelAnimationFrame) return window.cancelAnimationFrame(id);
		else if (window.webkitCancelAnimationFrame) return window.webkitCancelAnimationFrame(id);
		else if (window.mozCancelAnimationFrame) return window.mozCancelAnimationFrame(id);
		else {
			return window.clearTimeout(id);
		}
	};
	$.supportTouch = !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);

	// Link to prototype
	$.fn = Dom7.prototype;

	// Plugins
	$.fn.scrollTo = function (left, top, duration, easing, callback) {
		if (arguments.length === 4 && typeof easing === 'function') {
			callback = easing;
			easing = undefined;
		}
		return this.each(function () {
			var el = this;
			var currentTop, currentLeft, maxTop, maxLeft, newTop, newLeft, scrollTop, scrollLeft;
			var animateTop = top > 0 || top === 0;
			var animateLeft = left > 0 || left === 0;
			if (typeof easing === 'undefined') {
				easing = 'swing';
			}
			if (animateTop) {
				currentTop = el.scrollTop;
				if (!duration) {
					el.scrollTop = top;
				}
			}
			if (animateLeft) {
				currentLeft = el.scrollLeft;
				if (!duration) {
					el.scrollLeft = left;
				}
			}
			if (!duration) return;
			if (animateTop) {
				maxTop = el.scrollHeight - el.offsetHeight;
				newTop = Math.max(Math.min(top, maxTop), 0);
			}
			if (animateLeft) {
				maxLeft = el.scrollWidth - el.offsetWidth;
				newLeft = Math.max(Math.min(left, maxLeft), 0);
			}
			var startTime = null;
			if (animateTop && newTop === currentTop) animateTop = false;
			if (animateLeft && newLeft === currentLeft) animateLeft = false;
			function render(time) {
				if (time === undefined) {
					time = new Date().getTime();
				}
				if (startTime === null) {
					startTime = time;
				}
				var doneLeft, doneTop, done;
				var progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
				var easeProgress = easing === 'linear' ? progress : (0.5 - Math.cos( progress * Math.PI ) / 2);
				if (animateTop) scrollTop = currentTop + (easeProgress * (newTop - currentTop));
				if (animateLeft) scrollLeft = currentLeft + (easeProgress * (newLeft - currentLeft));
				if (animateTop && newTop > currentTop && scrollTop >= newTop)  {
					el.scrollTop = newTop;
					done = true;
				}
				if (animateTop && newTop < currentTop && scrollTop <= newTop)  {
					el.scrollTop = newTop;
					done = true;
				}

				if (animateLeft && newLeft > currentLeft && scrollLeft >= newLeft)	{
					el.scrollLeft = newLeft;
					done = true;
				}
				if (animateLeft && newLeft < currentLeft && scrollLeft <= newLeft)	{
					el.scrollLeft = newLeft;
					done = true;
				}

				if (done) {
					if (callback) callback();
					return;
				}
				if (animateTop) el.scrollTop = scrollTop;
				if (animateLeft) el.scrollLeft = scrollLeft;
				$.requestAnimationFrame(render);
			}
			$.requestAnimationFrame(render);
		});
	};
	$.fn.scrollTop = function (top, duration, easing, callback) {
		if (arguments.length === 3 && typeof easing === 'function') {
			callback = easing;
			easing = undefined;
		}
		var dom = this;
		if (typeof top === 'undefined') {
			if (dom.length > 0) return dom[0].scrollTop;
			else return null;
		}
		return dom.scrollTo(undefined, top, duration, easing, callback);
	};
	$.fn.scrollLeft = function (left, duration, easing, callback) {
		if (arguments.length === 3 && typeof easing === 'function') {
			callback = easing;
			easing = undefined;
		}
		var dom = this;
		if (typeof left === 'undefined') {
			if (dom.length > 0) return dom[0].scrollLeft;
			else return null;
		}
		return dom.scrollTo(left, undefined, duration, easing, callback);
	};
	return $;
})();

// Export to local scope
var _$ = Dom7;

// Export to Window
window.Dom7 = Dom7;
function indexInParent(node) {
	var children = node.parentNode.childNodes;
	var num = 0;
	for (var i=0; i<children.length; i++) {
		 if (children[i]==node) return num;
		 if (children[i].nodeType==1) num++;
	}
	return -1;
}

var cumulativeOffset = function(element) {
	var top = 0, left = 0;
	do {
		top += element.offsetTop  || 0;
		left += element.offsetLeft || 0;
		element = element.offsetParent;
	} while(element);

	return {
		top: top,
		left: left
	};
};
function getContrastYIQ(hexcolor){
			hexcolor = hexcolor.replace(/#/g, "");
			var r = parseInt(hexcolor.substr(0,2),16);
			var g = parseInt(hexcolor.substr(2,2),16);
			var b = parseInt(hexcolor.substr(4,2),16);
			var yiq = ((r*299)+(g*587)+(b*114))/1000;
			return (yiq >= 128) ? 'black' : 'white';
		}
function getContrast50(hexcolor){
	return (parseInt(hexcolor, 16) > 0xffffff/2) ? 'black':'white';
}
function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

(function(DOMParser) {
	"use strict";
	var DOMParser_proto = DOMParser.prototype
	  , real_parseFromString = DOMParser_proto.parseFromString;

	// Firefox/Opera/IE throw errors on unsupported types
	try {
		// WebKit returns null on unsupported types
		if ((new DOMParser()).parseFromString("", "text/html")) {
			// text/html parsing is natively supported
			return;
		}
	} catch (ex) {}

	DOMParser_proto.parseFromString = function(markup, type) {
		if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
			var doc = document.implementation.createHTMLDocument("")
			  , doc_elt = doc.documentElement
			  , first_elt;

			doc_elt.innerHTML = markup;
			first_elt = doc_elt.firstElementChild;

			if (doc_elt.childElementCount === 1 && first_elt.localName.toLowerCase() === "html") {
				doc.replaceChild(first_elt, doc_elt);
			}

			return doc;
		} else {
			return real_parseFromString.apply(this, arguments);
		}
	};
}(DOMParser));

DOMTokenList.prototype.removemany = function(input) {
	var classValues = input.split(' ');
	var classValuesCount = classValues.length;

	for (var i = 0; i < classValuesCount; i++) {
		if (this.contains(classValues[i])) {
			this.remove(classValues[i]);
		}
	}
};
function scrollTo(element, to, duration) {
	var start = element.scrollTop,
		change = to - start,
		currentTime = 0,
		increment = 20;

	var animateScroll = function(){
		currentTime += increment;
		var val = Math.easeInOutQuad(currentTime, start, change, duration);
		element.scrollTop = val;
		if(currentTime < duration) {
			setTimeout(animateScroll, increment);
		}
	};
	animateScroll();
}

//t = current time
//b = start value
//c = change in value
//d = duration
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};
Array.prototype.getIndexBy = function (name, value) {
	for (var i = 0; i < this.length; i++) {
		if (this[i][name] == value) {
			return i;
		}
	}
};
;(function () {
	'use strict';

	/**
	 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
	 *
	 * @codingstandard ftlabs-jsv2
	 * @copyright The Financial Times Limited [All Rights Reserved]
	 * @license MIT License (see LICENSE.txt)
	 */

	/*jslint browser:true, node:true*/
	/*global define, Event, Node*/


	/**
	 * Instantiate fast-clicking listeners on the specified layer.
	 *
	 * @constructor
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	function FastClick(layer, options) {
		var oldOnClick;

		options = options || {};

		/**
		 * Whether a click is currently being tracked.
		 *
		 * @type boolean
		 */
		this.trackingClick = false;


		/**
		 * Timestamp for when click tracking started.
		 *
		 * @type number
		 */
		this.trackingClickStart = 0;


		/**
		 * The element being tracked for a click.
		 *
		 * @type EventTarget
		 */
		this.targetElement = null;


		/**
		 * X-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartX = 0;


		/**
		 * Y-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartY = 0;


		/**
		 * ID of the last touch, retrieved from Touch.identifier.
		 *
		 * @type number
		 */
		this.lastTouchIdentifier = 0;


		/**
		 * Touchmove boundary, beyond which a click will be cancelled.
		 *
		 * @type number
		 */
		this.touchBoundary = options.touchBoundary || 10;


		/**
		 * The FastClick layer.
		 *
		 * @type Element
		 */
		this.layer = layer;

		/**
		 * The minimum time between tap(touchstart and touchend) events
		 *
		 * @type number
		 */
		this.tapDelay = options.tapDelay || 200;

		/**
		 * The maximum time for a tap
		 *
		 * @type number
		 */
		this.tapTimeout = options.tapTimeout || 700;

		if (FastClick.notNeeded(layer)) {
			return;
		}

		// Some old versions of Android don't have Function.prototype.bind
		function bind(method, context) {
			return function() { return method.apply(context, arguments); };
		}


		var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
		var context = this;
		for (var i = 0, l = methods.length; i < l; i++) {
			context[methods[i]] = bind(context[methods[i]], context);
		}

		// Set up event handlers as required
		if (deviceIsAndroid) {
			layer.addEventListener('mouseover', this.onMouse, true);
			layer.addEventListener('mousedown', this.onMouse, true);
			layer.addEventListener('mouseup', this.onMouse, true);
		}

		layer.addEventListener('click', this.onClick, true);
		layer.addEventListener('touchstart', this.onTouchStart, false);
		layer.addEventListener('touchmove', this.onTouchMove, false);
		layer.addEventListener('touchend', this.onTouchEnd, false);
		layer.addEventListener('touchcancel', this.onTouchCancel, false);

		// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
		// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
		// layer when they are cancelled.
		if (!Event.prototype.stopImmediatePropagation) {
			layer.removeEventListener = function(type, callback, capture) {
				var rmv = Node.prototype.removeEventListener;
				if (type === 'click') {
					rmv.call(layer, type, callback.hijacked || callback, capture);
				} else {
					rmv.call(layer, type, callback, capture);
				}
			};

			layer.addEventListener = function(type, callback, capture) {
				var adv = Node.prototype.addEventListener;
				if (type === 'click') {
					adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
						if (!event.propagationStopped) {
							callback(event);
						}
					}), capture);
				} else {
					adv.call(layer, type, callback, capture);
				}
			};
		}

		// If a handler is already declared in the element's onclick attribute, it will be fired before
		// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
		// adding it as listener.
		if (typeof layer.onclick === 'function') {

			// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
			// - the old one won't work if passed to addEventListener directly.
			oldOnClick = layer.onclick;
			layer.addEventListener('click', function(event) {
				oldOnClick(event);
			}, false);
			layer.onclick = null;
		}
	}

	/**
	* Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
	*
	* @type boolean
	*/
	var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

	/**
	 * Android requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;


	/**
	 * iOS requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;


	/**
	 * iOS 4 requires an exception for select elements.
	 *
	 * @type boolean
	 */
	var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


	/**
	 * iOS 6.0-7.* requires the target element to be manually derived
	 *
	 * @type boolean
	 */
	var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);

	/**
	 * BlackBerry requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

	/**
	 * Determine whether a given element requires a native click.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element needs a native click
	 */
	FastClick.prototype.needsClick = function(target) {
		switch (target.nodeName.toLowerCase()) {

		// Don't send a synthetic click to disabled inputs (issue #62)
		case 'button':
		case 'select':
		case 'textarea':
			if (target.disabled) {
				return true;
			}

			break;
		case 'input':

			// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
			if ((deviceIsIOS && target.type === 'file') || target.disabled) {
				return true;
			}

			break;
		case 'label':
		case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
		case 'video':
			return true;
		}

		return (/\bneedsclick\b/).test(target.className);
	};


	/**
	 * Determine whether a given element requires a call to focus to simulate click into element.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
	 */
	FastClick.prototype.needsFocus = function(target) {
		switch (target.nodeName.toLowerCase()) {
		case 'textarea':
			return true;
		case 'select':
			return !deviceIsAndroid;
		case 'input':
			switch (target.type) {
			case 'button':
			case 'checkbox':
			case 'file':
			case 'image':
			case 'radio':
			case 'submit':
				return false;
			}

			// No point in attempting to focus disabled inputs
			return !target.disabled && !target.readOnly;
		default:
			return (/\bneedsfocus\b/).test(target.className);
		}
	};


	/**
	 * Send a click event to the specified element.
	 *
	 * @param {EventTarget|Element} targetElement
	 * @param {Event} event
	 */
	FastClick.prototype.sendClick = function(targetElement, event) {
		var clickEvent, touch;

		// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
		if (document.activeElement && document.activeElement !== targetElement) {
			document.activeElement.blur();
		}

		touch = event.changedTouches[0];

		// Synthesise a click event, with an extra attribute so it can be tracked
		clickEvent = document.createEvent('MouseEvents');
		clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
		clickEvent.forwardedTouchEvent = true;
		targetElement.dispatchEvent(clickEvent);
	};

	FastClick.prototype.determineEventType = function(targetElement) {

		//Issue #159: Android Chrome Select Box does not open with a synthetic click event
		if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
			return 'mousedown';
		}

		return 'click';
	};


	/**
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.focus = function(targetElement) {
		var length;

		// Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
		if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
			length = targetElement.value.length;
			targetElement.setSelectionRange(length, length);
		} else {
			targetElement.focus();
		}
	};


	/**
	 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
	 *
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.updateScrollParent = function(targetElement) {
		var scrollParent, parentElement;

		scrollParent = targetElement.fastClickScrollParent;

		// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
		// target element was moved to another parent.
		if (!scrollParent || !scrollParent.contains(targetElement)) {
			parentElement = targetElement;
			do {
				if (parentElement.scrollHeight > parentElement.offsetHeight) {
					scrollParent = parentElement;
					targetElement.fastClickScrollParent = parentElement;
					break;
				}

				parentElement = parentElement.parentElement;
			} while (parentElement);
		}

		// Always update the scroll top tracker if possible.
		if (scrollParent) {
			scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
		}
	};


	/**
	 * @param {EventTarget} targetElement
	 * @returns {Element|EventTarget}
	 */
	FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {

		// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
		if (eventTarget.nodeType === Node.TEXT_NODE) {
			return eventTarget.parentNode;
		}

		return eventTarget;
	};


	/**
	 * On touch start, record the position and scroll offset.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchStart = function(event) {
		var targetElement, touch, selection;

		// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
		if (event.targetTouches.length > 1) {
			return true;
		}

		targetElement = this.getTargetElementFromEventTarget(event.target);
		touch = event.targetTouches[0];

		if (deviceIsIOS) {

			// Only trusted events will deselect text on iOS (issue #49)
			selection = window.getSelection();
			if (selection.rangeCount && !selection.isCollapsed) {
				return true;
			}

			if (!deviceIsIOS4) {

				// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
				// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
				// with the same identifier as the touch event that previously triggered the click that triggered the alert.
				// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
				// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
				// Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
				// which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
				// random integers, it's safe to to continue if the identifier is 0 here.
				if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
					event.preventDefault();
					return false;
				}

				this.lastTouchIdentifier = touch.identifier;

				// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
				// 1) the user does a fling scroll on the scrollable layer
				// 2) the user stops the fling scroll with another tap
				// then the event.target of the last 'touchend' event will be the element that was under the user's finger
				// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
				// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
				this.updateScrollParent(targetElement);
			}
		}

		this.trackingClick = true;
		this.trackingClickStart = event.timeStamp;
		this.targetElement = targetElement;

		this.touchStartX = touch.pageX;
		this.touchStartY = touch.pageY;

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			event.preventDefault();
		}

		return true;
	};


	/**
	 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.touchHasMoved = function(event) {
		var touch = event.changedTouches[0], boundary = this.touchBoundary;

		if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
			return true;
		}

		return false;
	};


	/**
	 * Update the last position.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchMove = function(event) {
		if (!this.trackingClick) {
			return true;
		}

		// If the touch has moved, cancel the click tracking
		if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
			this.trackingClick = false;
			this.targetElement = null;
		}

		return true;
	};


	/**
	 * Attempt to find the labelled control for the given label element.
	 *
	 * @param {EventTarget|HTMLLabelElement} labelElement
	 * @returns {Element|null}
	 */
	FastClick.prototype.findControl = function(labelElement) {

		// Fast path for newer browsers supporting the HTML5 control attribute
		if (labelElement.control !== undefined) {
			return labelElement.control;
		}

		// All browsers under test that support touch events also support the HTML5 htmlFor attribute
		if (labelElement.htmlFor) {
			return document.getElementById(labelElement.htmlFor);
		}

		// If no for attribute exists, attempt to retrieve the first labellable descendant element
		// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
		return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
	};


	/**
	 * On touch end, determine whether to send a click event at once.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchEnd = function(event) {
		var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

		if (!this.trackingClick) {
			return true;
		}

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			this.cancelNextClick = true;
			return true;
		}

		if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
			return true;
		}

		// Reset to prevent wrong click cancel on input (issue #156).
		this.cancelNextClick = false;

		this.lastClickTime = event.timeStamp;

		trackingClickStart = this.trackingClickStart;
		this.trackingClick = false;
		this.trackingClickStart = 0;

		// On some iOS devices, the targetElement supplied with the event is invalid if the layer
		// is performing a transition or scroll, and has to be re-detected manually. Note that
		// for this to function correctly, it must be called *after* the event target is checked!
		// See issue #57; also filed as rdar://13048589 .
		if (deviceIsIOSWithBadTarget) {
			touch = event.changedTouches[0];

			// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
			targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
			targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
		}

		targetTagName = targetElement.tagName.toLowerCase();
		if (targetTagName === 'label') {
			forElement = this.findControl(targetElement);
			if (forElement) {
				this.focus(targetElement);
				if (deviceIsAndroid) {
					return false;
				}

				targetElement = forElement;
			}
		} else if (this.needsFocus(targetElement)) {

			// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
			// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
			if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
				this.targetElement = null;
				return false;
			}

			this.focus(targetElement);
			this.sendClick(targetElement, event);

			// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
			// Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
			if (!deviceIsIOS || targetTagName !== 'select') {
				this.targetElement = null;
				event.preventDefault();
			}

			return false;
		}

		if (deviceIsIOS && !deviceIsIOS4) {

			// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
			// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
			scrollParent = targetElement.fastClickScrollParent;
			if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
				return true;
			}
		}

		// Prevent the actual click from going though - unless the target node is marked as requiring
		// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
		if (!this.needsClick(targetElement)) {
			event.preventDefault();
			this.sendClick(targetElement, event);
		}

		return false;
	};


	/**
	 * On touch cancel, stop tracking the click.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.onTouchCancel = function() {
		this.trackingClick = false;
		this.targetElement = null;
	};


	/**
	 * Determine mouse events which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onMouse = function(event) {

		// If a target element was never set (because a touch event was never fired) allow the event
		if (!this.targetElement) {
			return true;
		}

		if (event.forwardedTouchEvent) {
			return true;
		}

		// Programmatically generated events targeting a specific element should be permitted
		if (!event.cancelable) {
			return true;
		}

		// Derive and check the target element to see whether the mouse event needs to be permitted;
		// unless explicitly enabled, prevent non-touch click events from triggering actions,
		// to prevent ghost/doubleclicks.
		if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

			// Prevent any user-added listeners declared on FastClick element from being fired.
			if (event.stopImmediatePropagation) {
				event.stopImmediatePropagation();
			} else {

				// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
				event.propagationStopped = true;
			}

			// Cancel the event
			event.stopPropagation();
			event.preventDefault();

			return false;
		}

		// If the mouse event is permitted, return true for the action to go through.
		return true;
	};


	/**
	 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
	 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
	 * an actual click which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onClick = function(event) {
		var permitted;

		// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
		if (this.trackingClick) {
			this.targetElement = null;
			this.trackingClick = false;
			return true;
		}

		// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
		if (event.target.type === 'submit' && event.detail === 0) {
			return true;
		}

		permitted = this.onMouse(event);

		// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
		if (!permitted) {
			this.targetElement = null;
		}

		// If clicks are permitted, return true for the action to go through.
		return permitted;
	};


	/**
	 * Remove all FastClick's event listeners.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.destroy = function() {
		var layer = this.layer;

		if (deviceIsAndroid) {
			layer.removeEventListener('mouseover', this.onMouse, true);
			layer.removeEventListener('mousedown', this.onMouse, true);
			layer.removeEventListener('mouseup', this.onMouse, true);
		}

		layer.removeEventListener('click', this.onClick, true);
		layer.removeEventListener('touchstart', this.onTouchStart, false);
		layer.removeEventListener('touchmove', this.onTouchMove, false);
		layer.removeEventListener('touchend', this.onTouchEnd, false);
		layer.removeEventListener('touchcancel', this.onTouchCancel, false);
	};


	/**
	 * Check whether FastClick is needed.
	 *
	 * @param {Element} layer The layer to listen on
	 */
	FastClick.notNeeded = function(layer) {
		var metaViewport;
		var chromeVersion;
		var blackberryVersion;
		var firefoxVersion;

		// Devices that don't support touch don't need FastClick
		if (typeof window.ontouchstart === 'undefined') {
			return true;
		}

		// Chrome version - zero for other browsers
		chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

		if (chromeVersion) {

			if (deviceIsAndroid) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// Chrome 32 and above with width=device-width or less don't need FastClick
					if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}

			// Chrome desktop doesn't need FastClick (issue #15)
			} else {
				return true;
			}
		}

		if (deviceIsBlackBerry10) {
			blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

			// BlackBerry 10.3+ does not require Fastclick library.
			// https://github.com/ftlabs/fastclick/issues/251
			if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// user-scalable=no eliminates click delay.
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// width=device-width (or less than device-width) eliminates click delay.
					if (document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}
			}
		}

		// IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
		if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		// Firefox version - zero for other browsers
		firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

		if (firefoxVersion >= 27) {
			// Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

			metaViewport = document.querySelector('meta[name=viewport]');
			if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
				return true;
			}
		}

		// IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
		// http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
		if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		return false;
	};


	/**
	 * Factory method for creating a FastClick object
	 *
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	FastClick.attach = function(layer, options) {
		return new FastClick(layer, options);
	};


	if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {

		// AMD. Register as an anonymous module.
		define(function() {
			return FastClick;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = FastClick.attach;
		module.exports.FastClick = FastClick;
	} else {
		window.FastClick = FastClick;
	}
}());

;(function(){

  'use strict';

  /**
   * Aliases
   */

  var indexOf = Array.prototype.indexOf;
  var getStyle = window.getComputedStyle;

  /**
   * CSS Classes
   */

  var overflowingChildClass = 'ellipsis-overflowing-child';
  var containerClass = 'ellipsis-set';

  /**
   * Vendor Info
   */

  var vendor = getVendorData();

  /**
   * Initialize a new Ellipsis
   * instance with the given element.
   *
   * Options:
   *
   *  - `container` A parent container element
   *  - `reRender` Forces a redraw after ellipsis applied
   *
   * @constructor
   * @param {Element} el
   * @param {Object} options
   * @api public
   */
  function Ellipsis(el, options) {
    if (!el) return;
    this.el = el;
    this.container = options && options.container;
    this.reRender = options && options.reRender;
  }

  /**
   * Measures the element and
   * finds the overflowing child.
   *
   * @return {Ellipsis}
   * @api public
   */
  Ellipsis.prototype.calc = function() {
    if (!this.el) return this;
    var style = getStyle(this.el);
    var size = getSize(this.el);

    this.columnHeight = size[1];
    this.columnCount = getColumnCount(style);
    this.columnGap = getColumnGap(style);
    this.columnWidth = size[0] / this.columnCount;
    this.lineHeight = getLineHeight(this.el, style);
    this.deltaHeight = size[1] % this.lineHeight;
    this.linesPerColumn = Math.floor(this.columnHeight / this.lineHeight);
    this.totalLines = this.linesPerColumn * this.columnCount;

    // COMPLEX:
    // We set the height on the container
    // explicitly to work around problem
    // with columned containers not fitting
    // all lines when the height is exactly
    // divisible by the line height.
    if (!this.deltaHeight && this.columnCount > 1) {
      this.el.style.height = this.columnHeight + 'px';
    }

    this.child = this.getOverflowingChild();

    return this;
  };

  /**
   * Clamps the overflowing child using
   * the information acquired from #calc().
   *
   * @return {Ellipsis}
   * @api public
   */
  Ellipsis.prototype.set = function() {
    if (!this.el || !this.child) return this;

    this.clampChild();
    siblingsAfter(this.child.el, { display: 'none' });
    this.markContainer();

    return this;
  };

  /**
   * Unclamps the overflowing child.
   *
   * @return {Ellipsis}
   * @api public
   */

  Ellipsis.prototype.unset = function() {
    if (!this.el || !this.child) return this;

    this.el.style.height = '';
    this.unclampChild(this.child);
    siblingsAfter(this.child.el, { display: '' });
    this.unmarkContainer();
    this.child = null;

    return this;
  };

  /**
   * Clears any references
   *
   * @return {Ellipsis}
   * @api public
   */

  Ellipsis.prototype.destroy = function() {

    // It's super important that we clear references
    // to any DOM nodes here so that we don't end up
    // with any 'detached nodes' lingering in memory
    this.el = this.child = this.container = null;

    return this;
  };

  /**
   * Returns the overflowing child with some
   * extra data required for clamping.
   *
   * @param  {Ellipsis} instance
   * @return {Object}
   * @api private
   */
  Ellipsis.prototype.getOverflowingChild = function() {
    var self = this;
    var child = {};
    var lineCounter = 0;

    // Loop over each child element
    each(this.el.children, function(el) {
      var lineCount, overflow, underflow;
      var startColumnIndex = Math.floor(lineCounter / self.linesPerColumn) || 0;

      // Get the line count of the
      // child and increment the counter
      lineCounter += lineCount = self.getLineCount(el);

      // If this is the overflowing child
      if (lineCounter >= self.totalLines) {
        overflow = lineCounter - self.totalLines;
        underflow = lineCount - overflow;

        child.el = el;
        child.clampedLines = underflow;
        child.clampedHeight = child.clampedLines * self.lineHeight;
        child.visibleColumnSpan = self.columnCount - startColumnIndex;
        child.gutterSpan = child.visibleColumnSpan - 1;
        child.applyTopMargin = self.shouldApplyTopMargin(child);

        // COMPLEX:
        // In order to get the overflowing
        // child height correct we have to
        // add the delta for each gutter the
        // overflowing child crosses. This is
        // just how webkit columns work.
        if (vendor.webkit && child.clampedLines > 1) {
          child.clampedHeight += child.gutterSpan * self.deltaHeight;
        }

        return child;
      }
    });

    return child;
  };

  /**
   * Returns the number
   * of lines an element has.
   *
   * If the element is larger than
   * the column width we make the
   * assumption that this is FireFox
   * and the element is broken across
   * a column boundary. In this case
   * we have to get the height using
   * `getClientRects()`.
   *
   * @param  {Element} el
   * @return {Number}
   * @api private
   */

  Ellipsis.prototype.getLineCount = function(el) {
    return (el.offsetWidth > this.columnWidth) ? getLinesFromRects(el, this.lineHeight) : lineCount(el.clientHeight, this.lineHeight);
  };

  /**
   * If a container has been
   * declared we mark it with
   * a class for styling purposes.
   *
   * @api private
   */
  Ellipsis.prototype.markContainer = function() {
    if (!this.container) return;
    this.container.classList.add(containerClass);
    if (this.reRender) reRender(this.container);
  };

  /**
   * Removes the class
   * from the container.
   *
   * @api private
   */
  Ellipsis.prototype.unmarkContainer = function() {
    if (!this.container) return;
    this.container.classList.remove(containerClass);
    if (this.reRender) reRender(this.container);
  };

  /**
   * Determines whether top margin should be
   * applied to the overflowing child.
   *
   * This is to counteract an annoying
   * column-count/-webkit-box bug, whereby the
   * flexbox element falls into the delta are under
   * the previous sibling. Top margin keeps it
   * in the correct column.
   *
   * @param  {Element} el
   * @param  {Ellipsis} instance
   * @return {Boolean}
   * @api private
   */
  Ellipsis.prototype.shouldApplyTopMargin = function(child) {
    var el = child.el;

    // Dont't if it's not webkit
    if (!vendor.webkit) return;

    // Don't if it's a single column layout
    if (this.columnCount === 1) return;

    // Don't if the delta height is minimal
    if (this.deltaHeight <= 3) return;

    // Don't if it's the first child
    if (!el.previousElementSibling) return;

    // FINAL TEST: If the element is at the top or bottom of its
    // parent container then we require top margin.
    return (el.offsetTop === 0 || el.offsetTop === this.columnHeight);
  };

  /**
   * Clamps the child element to the set
   * height and lines.
   *
   * @param  {Object} child
   * @api private
   */
  Ellipsis.prototype.clampChild = function() {
    var child = this.child;
    if (!child || !child.el) return;

    // Clamp the height
    child.el.style.height = child.clampedHeight + 'px';

    // Use webkit line clamp
    // for webkit browsers.
    if (vendor.webkit) {
      child.el.style.webkitLineClamp = child.clampedLines;
      child.el.style.display = '-webkit-box';
      child.el.style.webkitBoxOrient = 'vertical';
    }

    if (this.shouldHideOverflow()) child.el.style.overflow = 'hidden';

    // Apply a top margin to fix webkit
    // column-count mixed with flexbox bug,
    // if we have decided it is neccessary.
    if (child.applyTopMargin) child.el.style.marginTop = '2em';

    // Add the overflowing
    // child class as a style hook
    child.el.classList.add(overflowingChildClass);

    // Non webkit browsers get a helper
    // element that is styled as an alternative
    // to the webkit-line-clamp ellipsis.
    // Must be position relative so that we can
    // position the helper element.
    if (!vendor.webkit) {
      child.el.style.position = 'relative';
      child.helper = child.el.appendChild(this.helperElement());
    }
  };

  /**
   * Removes all clamping styles from
   * the overflowing child.
   *
   * @param  {Object} child
   * @api private
   */
  Ellipsis.prototype.unclampChild = function(child) {
    if (!child || !child.el) return;
    child.el.style.display = '';
    child.el.style.height = '';
    child.el.style.webkitLineClamp = '';
    child.el.style.webkitBoxOrient = '';
    child.el.style.marginTop = '';
    child.el.style.overflow = '';
    child.el.classList.remove(overflowingChildClass);

    if (child.helper) {
      child.helper.parentNode.removeChild(child.helper);
    }
  };

  /**
   * Creates the helper element
   * for non-webkit browsers.
   *
   * @return {Element}
   * @api private
   */
  Ellipsis.prototype.helperElement = function() {
    var el = document.createElement('span');
    var columns = this.child.visibleColumnSpan - 1;
    var rightOffset, marginRight;

    el.className = 'ellipsis-helper';
    el.style.display = 'block';
    el.style.height = this.lineHeight + 'px';
    el.style.width = '5em';
    el.style.position = 'absolute';
    el.style.bottom = 0;
    el.style.right = 0;

    // HACK: This is a work around to deal with
    // the wierdness of positioning elements
    // inside an element that is broken across
    // more than one column.
    if (vendor.moz && columns) {
      rightOffset = -(columns * 100);
      marginRight = -(columns * this.columnGap);
      el.style.right = rightOffset + '%';
      el.style.marginRight = marginRight + 'px';
      el.style.marginBottom = this.deltaHeight + 'px';
    }

    return el;
  };

  /**
   * Determines whether overflow
   * should be hidden on clamped
   * child.
   *
   * NOTE:
   * Overflow hidden is only required
   * for single column containers as
   * multi-column containers overflow
   * to the right, so are not visible.
   * `overflow: hidden;` also messes
   * with column layout in Firefox.
   *
   * @return {Boolean}
   * @api private
   */
  Ellipsis.prototype.shouldHideOverflow = function() {
    var hasColumns = this.columnCount > 1;

    // If there is not enough room to show
    // even one line; hide all overflow.
    if (this.columnHeight < this.lineHeight) return true;

    // Hide all single column overflow
    return !hasColumns;
  };

  /**
   * Re-render with no setTimeout, boom!
   *
   * NOTE:
   * We have to assign the return value
   * to something global so that Closure
   * Compiler doesn't strip it out.
   *
   * @param  {Element} el
   * @api private
   */
  function reRender(el) {
    el.style.display = 'none';
    Ellipsis.r = el.offsetTop;
    el.style.display = '';
  }

  /**
   * Sets the display property on
   * all siblingsafter the given element.
   *
   * Options:
   *   - `display` the css display type to use
   *
   * @param  {Node} el
   * @param  {Options} options
   * @api private
   */

  function siblingsAfter(el, options) {
    if (!el) return;
    var display = options && options.display;
    var siblings = el.parentNode.children;
    var index = indexOf.call(siblings, el);

    for (var i = index + 1, l = siblings.length; i < l; i++) {
      siblings[i].style.display = display;
    }
  }

  /**
   * Returns total line
   * count from a rect list.
   *
   * @param  {Element} el
   * @param  {Number} lineHeight
   * @return {Number}
   * @api private
   */

  function getLinesFromRects(el, lineHeight) {
    var rects = el.getClientRects();
    var lines = 0;

    each(rects, function(rect) {
      lines += lineCount(rect.height, lineHeight);
    });

    return lines;
  }

  /**
   * Calculates a line count
   * from the passed height.
   *
   * @param  {Number} height
   * @param  {Number} lineHeight
   * @return {Number}
   * @api private
   */

  function lineCount(height, lineHeight) {
    return Math.floor(height / lineHeight);
  }

  /**
   * Returns infomation about
   * the current vendor.
   *
   * @return {Object}
   * @api private
   */

   function getVendorData() {
     var el = document.createElement('test');
     var result = {};
     var vendors = {
       'Webkit': ['WebkitColumnCount', 'WebkitColumnGap'],
       'Moz': ['MozColumnCount', 'MozColumnGap'],
       'ms': ['msColumnCount', 'msColumnGap'],
       '': ['columnCount', 'columnGap']
     };

     for (var vendor in vendors) {
       if (vendors[vendor][0] in el.style) {
         result.columnCount = vendors[vendor][0];
         result.columnGap = vendors[vendor][1];
         result[vendor.toLowerCase()] = true;
       }
     }

     return result;
   }

   /**
    * Gets the column count of an
    * element using the vendor prefix.
    *
    * @param  {CSSStyleDeclaration} style  [description]
    * @return {Number}
    * @api private
    */

   function getColumnCount(style) {
     return parseInt(style[vendor.columnCount], 10) || 1;
   }

   /**
    * Returns the gap between columns
    *
    * @param  {CSSStyleDeclaration} style
    * @return {Number}
    * @api private
    */

   function getColumnGap(style) {
     return parseInt(style[vendor.columnGap], 10) || 0;
   }

  /**
   * Gets the line height
   * from the style declaration.
   *
   * @param  {CSSStyleDeclaration} style
   * @return {Number|null}
   * @api private
   */

  function getLineHeight(el, style) {
    var lineHeightStr = style.lineHeight;

    if (lineHeightStr) {
      if (lineHeightStr.indexOf('px') < 0) {
        throw Error('The ellipsis container ' + elementName(el) + ' must have line-height set using px unit, found: ' + lineHeightStr);
      }

      var lineHeight = parseInt(lineHeightStr, 10);
      if (lineHeight) {
        return lineHeight;
      }
    }
    throw Error('The ellipsis container ' + elementName(el) + ' must have line-height set on it, found: ' + lineHeightStr);
  }

  /**
   * Returns the width and
   * height of the given element.
   *
   * @param  {Element} el
   * @return {Array}
   * @api private
   */

  function getSize(el) {
    return [el.offsetWidth, el.offsetHeight];
  }

  /**
   * Little iterator
   *
   * @param  {Array}   list
   * @param  {Function} fn
   * @api private
   */

  function each(list, fn) {
    for (var i = 0, l = list.length; i < l; i++) if (fn(list[i])) break;
  }

  function elementName(el) {
    var name = el.tagName;
    if (el.id) name += '#' + el.id;
    if (el.className) name += (' ' + el.className).replace(/\s+/g,'.');
    return name;
  }

  /**
   * Expose `Ellipsis`
   */

  if (typeof exports === 'object') {
    module.exports = function(el, options) {
      return new Ellipsis(el, options);
    };
    module.exports.Ellipsis = Ellipsis;
  } else if (typeof define === 'function' && define.amd) {
    define(function() { return Ellipsis; });
  } else {
    window.Ellipsis = Ellipsis;
  }

})();
/*! VelocityJS.org (1.2.2). (C) 2014 Julian Shapiro. MIT @license: en.wikipedia.org/wiki/MIT_License */
/*! VelocityJS.org jQuery Shim (1.0.1). (C) 2014 The jQuery Foundation. MIT @license: en.wikipedia.org/wiki/MIT_License. */

/*jshint -W008*/
/*jshint -W018*/
/*jshint -W030*/
/*jshint -W033*/
/*jshint -W038*/
/*jshint -W041*/
/*jshint -W058*/
/*jshint -W084*/
/*jshint -W093*/
/*jshint es5: true*/
!function(e) {
    function t(e) {
        var t = e.length, r = $.type(e);
        return "function" === r || $.isWindow(e)?!1 : 1 === e.nodeType && t?!0 : "array" === r || 0 === t || "number" == typeof t && t > 0 && t - 1 in e
    }
    if (!e.jQuery) {
        var $ = function(e, t) {
            return new $.fn.init(e, t)
        };
        $.isWindow = function(e) {
            return null != e && e == e.window
        }, $.type = function(e) {
            return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? a[o.call(e)] || "object" : typeof e
        }, $.isArray = Array.isArray || function(e) {
            return "array" === $.type(e)
        }, $.isPlainObject = function(e) {
            var t;
            if (!e || "object" !== $.type(e) || e.nodeType || $.isWindow(e))
                return !1;
            try {
                if (e.constructor&&!n.call(e, "constructor")&&!n.call(e.constructor.prototype, "isPrototypeOf"))
                    return !1
            } catch (r) {
                return !1
            }
            for (t in e);
            return void 0 === t || n.call(e, t)
        }, $.each = function(e, r, a) {
            var n, o = 0, i = e.length, s = t(e);
            if (a) {
                if (s)
                    for (; i > o && (n = r.apply(e[o], a), n!==!1); o++);
                else
                    for (o in e)
                        if (n = r.apply(e[o], a), n===!1)
                            break
            } else if (s)
                for (; i > o && (n = r.call(e[o], o, e[o]), n!==!1); o++);
            else
                for (o in e)
                    if (n = r.call(e[o], o, e[o]), n===!1)
                        break;
            return e
        }, $.data = function(e, t, a) {
            if (void 0 === a) {
                var n = e[$.expando], o = n && r[n];
                if (void 0 === t)
                    return o;
                if (o && t in o)
                    return o[t]
            } else if (void 0 !== t) {
                var n = e[$.expando] || (e[$.expando]=++$.uuid);
                return r[n] = r[n] || {}, r[n][t] = a, a
            }
        }, $.removeData = function(e, t) {
            var a = e[$.expando], n = a && r[a];
            n && $.each(t, function(e, t) {
                delete n[t]
            })
        }, $.extend = function() {
            var e, t, r, a, n, o, i = arguments[0] || {}, s = 1, l = arguments.length, u=!1;
            for ("boolean" == typeof i && (u = i, i = arguments[s] || {}, s++), "object" != typeof i && "function" !== $.type(i) && (i = {}), s === l && (i = this, s--); l > s; s++)
                if (null != (n = arguments[s]))
                    for (a in n)
                        e = i[a], r = n[a], i !== r && (u && r && ($.isPlainObject(r) || (t = $.isArray(r))) ? (t ? (t=!1, o = e && $.isArray(e) ? e : []) : o = e && $.isPlainObject(e) ? e : {}, i[a] = $.extend(u, o, r)) : void 0 !== r && (i[a] = r));
            return i
        }, $.queue = function(e, r, a) {
            function n(e, r) {
                var a = r || [];
                return null != e && (t(Object(e))?!function(e, t) {
                    for (var r =+ t.length, a = 0, n = e.length; r > a;)
                        e[n++] = t[a++];
                    if (r !== r)
                        for (; void 0 !== t[a];)
                            e[n++] = t[a++];
                    return e.length = n, e
                }(a, "string" == typeof e ? [e] : e) : [].push.call(a, e)), a
            }
            if (e) {
                r = (r || "fx") + "queue";
                var o = $.data(e, r);
                return a ? (!o || $.isArray(a) ? o = $.data(e, r, n(a)) : o.push(a), o) : o || []
            }
        }, $.dequeue = function(e, t) {
            $.each(e.nodeType ? [e] : e, function(e, r) {
                t = t || "fx";
                var a = $.queue(r, t), n = a.shift();
                "inprogress" === n && (n = a.shift()), n && ("fx" === t && a.unshift("inprogress"), n.call(r, function() {
                    $.dequeue(r, t)
                }))
            })
        }, $.fn = $.prototype = {
            init: function(e) {
                if (e.nodeType)
                    return this[0] = e, this;
                throw new Error("Not a DOM node.")
            },
            offset: function() {
                var t = this[0].getBoundingClientRect ? this[0].getBoundingClientRect(): {
                    top: 0,
                    left: 0
                };
                return {
                    top: t.top + (e.pageYOffset || document.scrollTop || 0) - (document.clientTop || 0),
                    left: t.left + (e.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || 0)
                }
            },
            position: function() {
                function e() {
                    for (var e = this.offsetParent || document; e && "html"===!e.nodeType.toLowerCase && "static" === e.style.position;)
                        e = e.offsetParent;
                    return e || document
                }
                var t = this[0], e = e.apply(t), r = this.offset(), a = /^(?:body|html)$/i.test(e.nodeName) ? {
                    top: 0,
                    left: 0
                }
                : $(e).offset();
                return r.top -= parseFloat(t.style.marginTop) || 0, r.left -= parseFloat(t.style.marginLeft) || 0, e.style && (a.top += parseFloat(e.style.borderTopWidth) || 0, a.left += parseFloat(e.style.borderLeftWidth) || 0), {
                    top: r.top - a.top,
                    left: r.left - a.left
                }
            }
        };
        var r = {};
        $.expando = "velocity" + (new Date).getTime(), $.uuid = 0;
        for (var a = {}, n = a.hasOwnProperty, o = a.toString, i = "Boolean Number String Function Array Date RegExp Object Error".split(" "), s = 0; s < i.length; s++)
            a["[object " + i[s] + "]"] = i[s].toLowerCase();
        $.fn.init.prototype = $.fn, e.Velocity = {
            Utilities: $
        }
    }
}(window), function(e) {
    ("object" == typeof module && "object" == typeof module.exports ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : e())
}(function() {
    return function(e, t, r, a) {
        function n(e) {
            for (var t =- 1, r = e ? e.length : 0, a = []; ++t < r;) {
                var n = e[t];
                n && a.push(n)
            }
            return a
        }
        function o(e) {
            return g.isWrapped(e) ? e = [].slice.call(e) : g.isNode(e) && (e = [e]), e
        }
        function i(e) {
            var t = $.data(e, "velocity");
            return null === t ? a : t
        }
        function s(e) {
            return function(t) {
                return Math.round(t * e) * (1 / e)
            }
        }
        function l(e, r, a, n) {
            function o(e, t) {
                return 1 - 3 * t + 3 * e
            }
            function i(e, t) {
                return 3 * t - 6 * e
            }
            function s(e) {
                return 3 * e
            }
            function l(e, t, r) {
                return ((o(t, r) * e + i(t, r)) * e + s(t)) * e
            }
            function u(e, t, r) {
                return 3 * o(t, r) * e * e + 2 * i(t, r) * e + s(t)
            }
            function c(t, r) {
                for (var n = 0; m > n; ++n) {
                    var o = u(r, e, a);
                    if (0 === o)
                        return r;
                    var i = l(r, e, a) - t;
                    r -= i / o
                }
                return r
            }
            function p() {
                for (var t = 0; b > t; ++t)
                    w[t] = l(t * x, e, a)
            }
            function f(t, r, n) {
                var o, i, s = 0;
                do
                    i = r + (n - r) / 2, o = l(i, e, a) - t, o > 0 ? n = i : r = i;
                while (Math.abs(o) > h&&++s < v);
                return i
            }
            function d(t) {
                for (var r = 0, n = 1, o = b - 1; n != o && w[n] <= t; ++n)
                    r += x;
                --n;
                var i = (t - w[n]) / (w[n + 1] - w[n]), s = r + i * x, l = u(s, e, a);
                return l >= y ? c(t, s) : 0 == l ? s : f(t, r, r + x)
            }
            function g() {
                V=!0, (e != r || a != n) && p()
            }
            var m = 4, y = .001, h = 1e-7, v = 10, b = 11, x = 1 / (b - 1), S = "Float32Array"in t;
            if (4 !== arguments.length)
                return !1;
            for (var P = 0; 4 > P; ++P)
                if ("number" != typeof arguments[P] || isNaN(arguments[P]) ||!isFinite(arguments[P]))
                    return !1;
            e = Math.min(e, 1), a = Math.min(a, 1), e = Math.max(e, 0), a = Math.max(a, 0);
            var w = S ? new Float32Array(b): new Array(b), V=!1, C = function(t) {
                return V || g(), e === r && a === n ? t : 0 === t ? 0 : 1 === t ? 1 : l(d(t), r, n)
            };
            C.getControlPoints = function() {
                return [{
                    x: e,
                    y: r
                }, {
                    x: a,
                    y: n
                }
                ]
            };
            var T = "generateBezier(" + [e, r, a, n] + ")";
            return C.toString = function() {
                return T
            }, C
        }
        function u(e, t) {
            var r = e;
            return g.isString(e) ? v.Easings[e] || (r=!1) : r = g.isArray(e) && 1 === e.length ? s.apply(null, e) : g.isArray(e) && 2 === e.length ? b.apply(null, e.concat([t])) : g.isArray(e) && 4 === e.length ? l.apply(null, e) : !1, r===!1 && (r = v.Easings[v.defaults.easing] ? v.defaults.easing : h), r
        }
        function c(e) {
            if (e) {
                var t = (new Date).getTime(), r = v.State.calls.length;
                r > 1e4 && (v.State.calls = n(v.State.calls));
                for (var o = 0; r > o; o++)
                    if (v.State.calls[o]) {
                        var s = v.State.calls[o], l = s[0], u = s[2], f = s[3], d=!!f, m = null;
                        f || (f = v.State.calls[o][3] = t - 16);
                        for (var y = Math.min((t - f) / u.duration, 1), h = 0, b = l.length; b > h; h++) {
                            var S = l[h], w = S.element;
                            if (i(w)) {
                                var V=!1;
                                if (u.display !== a && null !== u.display && "none" !== u.display) {
                                    if ("flex" === u.display) {
                                        var C = ["-webkit-box", "-moz-box", "-ms-flexbox", "-webkit-flex"];
                                        $.each(C, function(e, t) {
                                            x.setPropertyValue(w, "display", t)
                                        })
                                    }
                                    x.setPropertyValue(w, "display", u.display)
                                }
                                u.visibility !== a && "hidden" !== u.visibility && x.setPropertyValue(w, "visibility", u.visibility);
                                for (var T in S)
                                    if ("element" !== T) {
                                        var k = S[T], A, F = g.isString(k.easing) ? v.Easings[k.easing]: k.easing;
                                        if (1 === y)
                                            A = k.endValue;
                                        else {
                                            var E = k.endValue - k.startValue;
                                            if (A = k.startValue + E * F(y, u, E), !d && A === k.currentValue)
                                                continue
                                        }
                                        if (k.currentValue = A, "tween" === T)
                                            m = A;
                                        else {
                                            if (x.Hooks.registered[T]) {
                                                var j = x.Hooks.getRoot(T), H = i(w).rootPropertyValueCache[j];
                                                H && (k.rootPropertyValue = H)
                                            }
                                            var N = x.setPropertyValue(w, T, k.currentValue + (0 === parseFloat(A) ? "" : k.unitType), k.rootPropertyValue, k.scrollData);
                                            x.Hooks.registered[T] && (i(w).rootPropertyValueCache[j] = x.Normalizations.registered[j] ? x.Normalizations.registered[j]("extract", null, N[1]) : N[1]), "transform" === N[0] && (V=!0)
                                        }
                                    }
                                    u.mobileHA && i(w).transformCache.translate3d === a && (i(w).transformCache.translate3d = "(0px, 0px, 0px)", V=!0), V && x.flushTransformCache(w)
                                }
                            }
                            u.display !== a && "none" !== u.display && (v.State.calls[o][2].display=!1), u.visibility !== a && "hidden" !== u.visibility && (v.State.calls[o][2].visibility=!1), u.progress && u.progress.call(s[1], s[1], y, Math.max(0, f + u.duration - t), f, m), 1 === y && p(o)
                        }
                }
            v.State.isTicking && P(c)
        }
        function p(e, t) {
            if (!v.State.calls[e])
                return !1;
            for (var r = v.State.calls[e][0], n = v.State.calls[e][1], o = v.State.calls[e][2], s = v.State.calls[e][4], l=!1, u = 0, c = r.length; c > u; u++) {
                var p = r[u].element;
                if (t || o.loop || ("none" === o.display && x.setPropertyValue(p, "display", o.display), "hidden" === o.visibility && x.setPropertyValue(p, "visibility", o.visibility)), o.loop!==!0 && ($.queue(p)[1] === a ||!/\.velocityQueueEntryFlag/i.test($.queue(p)[1])) && i(p)) {
                    i(p).isAnimating=!1, i(p).rootPropertyValueCache = {};
                    var f=!1;
                    $.each(x.Lists.transforms3D, function(e, t) {
                        var r = /^scale/.test(t) ? 1: 0, n = i(p).transformCache[t];
                        i(p).transformCache[t] !== a && new RegExp("^\\(" + r + "[^.]").test(n) && (f=!0, delete i(p).transformCache[t])
                    }), o.mobileHA && (f=!0, delete i(p).transformCache.translate3d), f && x.flushTransformCache(p), x.Values.removeClass(p, "velocity-animating")
                }
                if (!t && o.complete&&!o.loop && u === c - 1)
                    try {
                        o.complete.call(n, n)
                    } catch (d) {
                    setTimeout(function() {
                        throw d
                    }, 1)
                }
                s && o.loop!==!0 && s(n), i(p) && o.loop===!0&&!t && ($.each(i(p).tweensContainer, function(e, t) {
                    /^rotate/.test(e) && 360 === parseFloat(t.endValue) && (t.endValue = 0, t.startValue = 360), /^backgroundPosition/.test(e) && 100 === parseFloat(t.endValue) && "%" === t.unitType && (t.endValue = 0, t.startValue = 100)
                }), v(p, "reverse", {
                    loop: !0,
                    delay: o.delay
                })), o.queue!==!1 && $.dequeue(p, o.queue)
            }
            v.State.calls[e]=!1;
            for (var g = 0, m = v.State.calls.length; m > g; g++)
                if (v.State.calls[g]!==!1) {
                    l=!0;
                    break
                }
            l===!1 && (v.State.isTicking=!1, delete v.State.calls, v.State.calls = [])
        }
        var f = function() {
            if (r.documentMode)
                return r.documentMode;
            for (var e = 7; e > 4; e--) {
                var t = r.createElement("div");
                if (t.innerHTML = "<!--[if IE " + e + "]><span></span><![endif]-->", t.getElementsByTagName("span").length)
                    return t = null, e
            }
            return a
        }(), d = function() {
            var e = 0;
            return t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame || function(t) {
                var r = (new Date).getTime(), a;
                return a = Math.max(0, 16 - (r - e)), e = r + a, setTimeout(function() {
                    t(r + a)
                }, a)
            }
        }(), g = {
            isString: function(e) {
                return "string" == typeof e
            },
            isArray: Array.isArray || function(e) {
                return "[object Array]" === Object.prototype.toString.call(e)
            },
            isFunction: function(e) {
                return "[object Function]" === Object.prototype.toString.call(e)
            },
            isNode: function(e) {
                return e && e.nodeType
            },
            isNodeList: function(e) {
                return "object" == typeof e && /^\[object (HTMLCollection|NodeList|Object)\]$/.test(Object.prototype.toString.call(e)) && e.length !== a && (0 === e.length || "object" == typeof e[0] && e[0].nodeType > 0)
            },
            isWrapped: function(e) {
                return e && (e.jquery || t.Zepto && t.Zepto.zepto.isZ(e))
            },
            isSVG: function(e) {
                return t.SVGElement && e instanceof t.SVGElement
            },
            isEmptyObject: function(e) {
                for (var t in e)
                    return !1;
                return !0
            }
        }, $, m=!1;
        if (e.fn && e.fn.jquery ? ($ = e, m=!0) : $ = t.Velocity.Utilities, 8 >= f&&!m)
            throw new Error("Velocity: IE8 and below require jQuery to be loaded before Velocity.");
        if (7 >= f)
            return void(jQuery.fn.velocity = jQuery.fn.animate);
        var y = 400, h = "swing", v = {
            State: {
                isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
                isAndroid: /Android/i.test(navigator.userAgent),
                isGingerbread: /Android 2\.3\.[3-7]/i.test(navigator.userAgent),
                isChrome: t.chrome,
                isFirefox: /Firefox/i.test(navigator.userAgent),
                prefixElement: r.createElement("div"),
                prefixMatches: {},
                scrollAnchor: null,
                scrollPropertyLeft: null,
                scrollPropertyTop: null,
                isTicking: !1,
                calls: []
            },
            CSS: {},
            Utilities: $,
            Redirects: {},
            Easings: {},
            Promise: t.Promise,
            defaults: {
                queue: "",
                duration: y,
                easing: h,
                begin: a,
                complete: a,
                progress: a,
                display: a,
                visibility: a,
                loop: !1,
                delay: !1,
                mobileHA: !0,
                _cacheValues: !0
            },
            init: function(e) {
                $.data(e, "velocity", {
                    isSVG: g.isSVG(e),
                    isAnimating: !1,
                    computedStyle: null,
                    tweensContainer: null,
                    rootPropertyValueCache: {},
                    transformCache: {}
                })
            },
            hook: null,
            mock: !1,
            version: {
                major: 1,
                minor: 2,
                patch: 2
            },
            debug: !1
        };
        t.pageYOffset !== a ? (v.State.scrollAnchor = t, v.State.scrollPropertyLeft = "pageXOffset", v.State.scrollPropertyTop = "pageYOffset") : (v.State.scrollAnchor = r.documentElement || r.body.parentNode || r.body, v.State.scrollPropertyLeft = "scrollLeft", v.State.scrollPropertyTop = "scrollTop");
        var b = function() {
            function e(e) {
                return - e.tension * e.x - e.friction * e.v
            }
            function t(t, r, a) {
                var n = {
                    x: t.x + a.dx * r,
                    v: t.v + a.dv * r,
                    tension: t.tension,
                    friction: t.friction
                };
                return {
                    dx: n.v,
                    dv: e(n)
                }
            }
            function r(r, a) {
                var n = {
                    dx: r.v,
                    dv: e(r)
                }, o = t(r, .5 * a, n), i = t(r, .5 * a, o), s = t(r, a, i), l = 1 / 6 * (n.dx + 2 * (o.dx + i.dx) + s.dx), u = 1 / 6 * (n.dv + 2 * (o.dv + i.dv) + s.dv);
                return r.x = r.x + l * a, r.v = r.v + u * a, r
            }
            return function a(e, t, n) {
                var o = {
                    x: - 1,
                    v: 0,
                    tension: null,
                    friction: null
                }, i = [0], s = 0, l = 1e-4, u = .016, c, p, f;
                for (e = parseFloat(e) || 500, t = parseFloat(t) || 20, n = n || null, o.tension = e, o.friction = t, c = null !== n, c ? (s = a(e, t), p = s / n * u) : p = u; ;)
                    if (f = r(f || o, p), i.push(1 + f.x), s += 16, !(Math.abs(f.x) > l && Math.abs(f.v) > l))
                        break;
                return c ? function(e) {
                    return i[e * (i.length - 1) | 0]
                } : s
            }
        }();
        v.Easings = {
            linear: function(e) {
                return e
            },
            swing: function(e) {
                return .5 - Math.cos(e * Math.PI) / 2
            },
            spring: function(e) {
                return 1 - Math.cos(4.5 * e * Math.PI) * Math.exp(6*-e)
            }
        }, $.each([["ease", [.25, .1, .25, 1]], ["ease-in", [.42, 0, 1, 1]], ["ease-out", [0, 0, .58, 1]], ["ease-in-out", [.42, 0, .58, 1]], ["easeInSine", [.47, 0, .745, .715]], ["easeOutSine", [.39, .575, .565, 1]], ["easeInOutSine", [.445, .05, .55, .95]], ["easeInQuad", [.55, .085, .68, .53]], ["easeOutQuad", [.25, .46, .45, .94]], ["easeInOutQuad", [.455, .03, .515, .955]], ["easeInCubic", [.55, .055, .675, .19]], ["easeOutCubic", [.215, .61, .355, 1]], ["easeInOutCubic", [.645, .045, .355, 1]], ["easeInQuart", [.895, .03, .685, .22]], ["easeOutQuart", [.165, .84, .44, 1]], ["easeInOutQuart", [.77, 0, .175, 1]], ["easeInQuint", [.755, .05, .855, .06]], ["easeOutQuint", [.23, 1, .32, 1]], ["easeInOutQuint", [.86, 0, .07, 1]], ["easeInExpo", [.95, .05, .795, .035]], ["easeOutExpo", [.19, 1, .22, 1]], ["easeInOutExpo", [1, 0, 0, 1]], ["easeInCirc", [.6, .04, .98, .335]], ["easeOutCirc", [.075, .82, .165, 1]], ["easeInOutCirc", [.785, .135, .15, .86]]], function(e, t) {
            v.Easings[t[0]] = l.apply(null, t[1])
        });
        var x = v.CSS = {
            RegEx: {
                isHex: /^#([A-f\d]{3}){1,2}$/i,
                valueUnwrap: /^[A-z]+\((.*)\)$/i,
                wrappedValueAlreadyExtracted: /[0-9.]+ [0-9.]+ [0-9.]+( [0-9.]+)?/,
                valueSplit: /([A-z]+\(.+\))|(([A-z0-9#-.]+?)(?=\s|$))/gi
            },
            Lists: {
                colors: ["fill", "stroke", "stopColor", "color", "backgroundColor", "borderColor", "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor", "outlineColor"],
                transformsBase: ["translateX", "translateY", "scale", "scaleX", "scaleY", "skewX", "skewY", "rotateZ"],
                transforms3D: ["transformPerspective", "translateZ", "scaleZ", "rotateX", "rotateY"]
            },
            Hooks: {
                templates: {
                    textShadow: ["Color X Y Blur", "black 0px 0px 0px"],
                    boxShadow: ["Color X Y Blur Spread", "black 0px 0px 0px 0px"],
                    clip: ["Top Right Bottom Left", "0px 0px 0px 0px"],
                    backgroundPosition: ["X Y", "0% 0%"],
                    transformOrigin: ["X Y Z", "50% 50% 0px"],
                    perspectiveOrigin: ["X Y", "50% 50%"]
                },
                registered: {},
                register: function() {
                    for (var e = 0; e < x.Lists.colors.length; e++) {
                        var t = "color" === x.Lists.colors[e] ? "0 0 0 1": "255 255 255 1";
                        x.Hooks.templates[x.Lists.colors[e]] = ["Red Green Blue Alpha", t]
                    }
                    var r, a, n;
                    if (f)
                        for (r in x.Hooks.templates) {
                            a = x.Hooks.templates[r], n = a[0].split(" ");
                            var o = a[1].match(x.RegEx.valueSplit);
                            "Color" === n[0] && (n.push(n.shift()), o.push(o.shift()), x.Hooks.templates[r] = [n.join(" "), o.join(" ")])
                        }
                    for (r in x.Hooks.templates) {
                        a = x.Hooks.templates[r], n = a[0].split(" ");
                        for (var e in n) {
                            var i = r + n[e], s = e;
                            x.Hooks.registered[i] = [r, s]
                        }
                    }
                },
                getRoot: function(e) {
                    var t = x.Hooks.registered[e];
                    return t ? t[0] : e
                },
                cleanRootPropertyValue: function(e, t) {
                    return x.RegEx.valueUnwrap.test(t) && (t = t.match(x.RegEx.valueUnwrap)[1]), x.Values.isCSSNullValue(t) && (t = x.Hooks.templates[e][1]), t
                },
                extractValue: function(e, t) {
                    var r = x.Hooks.registered[e];
                    if (r) {
                        var a = r[0], n = r[1];
                        return t = x.Hooks.cleanRootPropertyValue(a, t), t.toString().match(x.RegEx.valueSplit)[n]
                    }
                    return t
                },
                injectValue: function(e, t, r) {
                    var a = x.Hooks.registered[e];
                    if (a) {
                        var n = a[0], o = a[1], i, s;
                        return r = x.Hooks.cleanRootPropertyValue(n, r), i = r.toString().match(x.RegEx.valueSplit), i[o] = t, s = i.join(" ")
                    }
                    return r
                }
            },
            Normalizations: {
                registered: {
                    clip: function(e, t, r) {
                        switch (e) {
                        case"name":
                            return "clip";
                        case"extract":
                            var a;
                            return x.RegEx.wrappedValueAlreadyExtracted.test(r) ? a = r : (a = r.toString().match(x.RegEx.valueUnwrap), a = a ? a[1].replace(/,(\s+)?/g, " ") : r), a;
                        case"inject":
                            return "rect(" + r + ")"
                        }
                    },
                    blur: function(e, t, r) {
                        switch (e) {
                        case"name":
                            return v.State.isFirefox ? "filter" : "-webkit-filter";
                        case"extract":
                            var a = parseFloat(r);
                            if (!a && 0 !== a) {
                                var n = r.toString().match(/blur\(([0-9]+[A-z]+)\)/i);
                                a = n ? n[1] : 0
                            }
                            return a;
                        case"inject":
                            return parseFloat(r) ? "blur(" + r + ")" : "none"
                        }
                    },
                    opacity: function(e, t, r) {
                        if (8 >= f)
                            switch (e) {
                            case"name":
                                return "filter";
                            case"extract":
                                var a = r.toString().match(/alpha\(opacity=(.*)\)/i);
                                return r = a ? a[1] / 100 : 1;
                            case"inject":
                                return t.style.zoom = 1, parseFloat(r) >= 1 ? "" : "alpha(opacity=" + parseInt(100 * parseFloat(r), 10) + ")"
                            } else
                                switch (e) {
                                case"name":
                                    return "opacity";
                                case"extract":
                                    return r;
                                case"inject":
                                    return r
                                }
                    }
                },
                register: function() {
                    9 >= f || v.State.isGingerbread || (x.Lists.transformsBase = x.Lists.transformsBase.concat(x.Lists.transforms3D));
                    for (var e = 0; e < x.Lists.transformsBase.length; e++)
                        !function() {
                            var t = x.Lists.transformsBase[e];
                            x.Normalizations.registered[t] = function(e, r, n) {
                                switch (e) {
                                case"name":
                                    return "transform";
                                case"extract":
                                    return i(r) === a || i(r).transformCache[t] === a ? /^scale/i.test(t) ? 1 : 0 : i(r).transformCache[t].replace(/[()]/g, "");
                                case"inject":
                                    var o=!1;
                                    switch (t.substr(0, t.length - 1)) {
                                    case"translate":
                                        o=!/(%|px|em|rem|vw|vh|\d)$/i.test(n);
                                        break;
                                    case"scal":
                                    case"scale":
                                        v.State.isAndroid && i(r).transformCache[t] === a && 1 > n && (n = 1), o=!/(\d)$/i.test(n);
                                        break;
                                    case"skew":
                                        o=!/(deg|\d)$/i.test(n);
                                        break;
                                    case"rotate":
                                        o=!/(deg|\d)$/i.test(n)
                                    }
                                    return o || (i(r).transformCache[t] = "(" + n + ")"), i(r).transformCache[t]
                                }
                            }
                        }();
                    for (var e = 0; e < x.Lists.colors.length; e++)
                        !function() {
                            var t = x.Lists.colors[e];
                            x.Normalizations.registered[t] = function(e, r, n) {
                                switch (e) {
                                case"name":
                                    return t;
                                case"extract":
                                    var o;
                                    if (x.RegEx.wrappedValueAlreadyExtracted.test(n))
                                        o = n;
                                    else {
                                        var i, s = {
                                            black: "rgb(0, 0, 0)",
                                            blue: "rgb(0, 0, 255)",
                                            gray: "rgb(128, 128, 128)",
                                            green: "rgb(0, 128, 0)",
                                            red: "rgb(255, 0, 0)",
                                            white: "rgb(255, 255, 255)"
                                        };
                                        /^[A-z]+$/i.test(n) ? i = s[n] !== a ? s[n] : s.black : x.RegEx.isHex.test(n) ? i = "rgb(" + x.Values.hexToRgb(n).join(" ") + ")" : /^rgba?\(/i.test(n) || (i = s.black), o = (i || n).toString().match(x.RegEx.valueUnwrap)[1].replace(/,(\s+)?/g, " ")
                                    }
                                    return 8 >= f || 3 !== o.split(" ").length || (o += " 1"), o;
                                case"inject":
                                    return 8 >= f ? 4 === n.split(" ").length && (n = n.split(/\s+/).slice(0, 3).join(" ")) : 3 === n.split(" ").length && (n += " 1"), (8 >= f ? "rgb" : "rgba") + "(" + n.replace(/\s+/g, ",").replace(/\.(\d)+(?=,)/g, "") + ")"
                                }
                            }
                        }()
                }
            },
            Names: {
                camelCase: function(e) {
                    return e.replace(/-(\w)/g, function(e, t) {
                        return t.toUpperCase()
                    })
                },
                SVGAttribute: function(e) {
                    var t = "width|height|x|y|cx|cy|r|rx|ry|x1|x2|y1|y2";
                    return (f || v.State.isAndroid&&!v.State.isChrome) && (t += "|transform"), new RegExp("^(" + t + ")$", "i").test(e)
                },
                prefixCheck: function(e) {
                    if (v.State.prefixMatches[e])
                        return [v.State.prefixMatches[e], !0];
                    for (var t = ["", "Webkit", "Moz", "ms", "O"], r = 0, a = t.length; a > r; r++) {
                        var n;
                        if (n = 0 === r ? e : t[r] + e.replace(/^\w/, function(e) {
                            return e.toUpperCase()
                        }), g.isString(v.State.prefixElement.style[n]))
                            return v.State.prefixMatches[e] = n, [n, !0]
                    }
                    return [e, !1]
                }
            },
            Values: {
                hexToRgb: function(e) {
                    var t = /^#?([a-f\d])([a-f\d])([a-f\d])$/i, r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i, a;
                    return e = e.replace(t, function(e, t, r, a) {
                        return t + t + r + r + a + a
                    }), a = r.exec(e), a ? [parseInt(a[1], 16), parseInt(a[2], 16), parseInt(a[3], 16)] : [0, 0, 0]
                },
                isCSSNullValue: function(e) {
                    return 0 == e || /^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i.test(e)
                },
                getUnitType: function(e) {
                    return /^(rotate|skew)/i.test(e) ? "deg" : /(^(scale|scaleX|scaleY|scaleZ|alpha|flexGrow|flexHeight|zIndex|fontWeight)$)|((opacity|red|green|blue|alpha)$)/i.test(e) ? "" : "px"
                },
                getDisplayType: function(e) {
                    var t = e && e.tagName.toString().toLowerCase();
                    return /^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|var|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i.test(t) ? "inline" : /^(li)$/i.test(t) ? "list-item" : /^(tr)$/i.test(t) ? "table-row" : /^(table)$/i.test(t) ? "table" : /^(tbody)$/i.test(t) ? "table-row-group" : "block"
                },
                addClass: function(e, t) {
                    e.classList ? e.classList.add(t) : e.className += (e.className.length ? " " : "") + t
                },
                removeClass: function(e, t) {
                    e.classList ? e.classList.remove(t) : e.className = e.className.toString().replace(new RegExp("(^|\\s)" + t.split(" ").join("|") + "(\\s|$)", "gi"), " ")
                }
            },
            getPropertyValue: function(e, r, n, o) {
                function s(e, r) {
                    function n() {
                        u && x.setPropertyValue(e, "display", "none")
                    }
                    var l = 0;
                    if (8 >= f)
                        l = $.css(e, r);
                    else {
                        var u=!1;
                        if (/^(width|height)$/.test(r) && 0 === x.getPropertyValue(e, "display") && (u=!0, x.setPropertyValue(e, "display", x.Values.getDisplayType(e))), !o) {
                            if ("height" === r && "border-box" !== x.getPropertyValue(e, "boxSizing").toString().toLowerCase()) {
                                var c = e.offsetHeight - (parseFloat(x.getPropertyValue(e, "borderTopWidth")) || 0) - (parseFloat(x.getPropertyValue(e, "borderBottomWidth")) || 0) - (parseFloat(x.getPropertyValue(e, "paddingTop")) || 0) - (parseFloat(x.getPropertyValue(e, "paddingBottom")) || 0);
                                return n(), c
                            }
                            if ("width" === r && "border-box" !== x.getPropertyValue(e, "boxSizing").toString().toLowerCase()) {
                                var p = e.offsetWidth - (parseFloat(x.getPropertyValue(e, "borderLeftWidth")) || 0) - (parseFloat(x.getPropertyValue(e, "borderRightWidth")) || 0) - (parseFloat(x.getPropertyValue(e, "paddingLeft")) || 0) - (parseFloat(x.getPropertyValue(e, "paddingRight")) || 0);
                                return n(), p
                            }
                        }
                        var d;
                        d = i(e) === a ? t.getComputedStyle(e, null) : i(e).computedStyle ? i(e).computedStyle : i(e).computedStyle = t.getComputedStyle(e, null), "borderColor" === r && (r = "borderTopColor"), l = 9 === f && "filter" === r ? d.getPropertyValue(r) : d[r], ("" === l || null === l) && (l = e.style[r]), n()
                    }
                    if ("auto" === l && /^(top|right|bottom|left)$/i.test(r)) {
                        var g = s(e, "position");
                        ("fixed" === g || "absolute" === g && /top|left/i.test(r)) && (l = $(e).position()[r] + "px")
                    }
                    return l
                }
                var l;
                if (x.Hooks.registered[r]) {
                    var u = r, c = x.Hooks.getRoot(u);
                    n === a && (n = x.getPropertyValue(e, x.Names.prefixCheck(c)[0])), x.Normalizations.registered[c] && (n = x.Normalizations.registered[c]("extract", e, n)), l = x.Hooks.extractValue(u, n)
                } else if (x.Normalizations.registered[r]) {
                    var p, d;
                    p = x.Normalizations.registered[r]("name", e), "transform" !== p && (d = s(e, x.Names.prefixCheck(p)[0]), x.Values.isCSSNullValue(d) && x.Hooks.templates[r] && (d = x.Hooks.templates[r][1])), l = x.Normalizations.registered[r]("extract", e, d)
                }
                if (!/^[\d-]/.test(l))
                    if (i(e) && i(e).isSVG && x.Names.SVGAttribute(r))
                        if (/^(height|width)$/i.test(r))
                            try {
                                l = e.getBBox()[r]
                            } catch (g) {
                    l = 0
                } else
                    l = e.getAttribute(r);
                    else
                        l = s(e, x.Names.prefixCheck(r)[0]);
            return x.Values.isCSSNullValue(l) && (l = 0), v.debug >= 2 && console.log("Get " + r + ": " + l), l
        },
        setPropertyValue: function(e, r, a, n, o) {
            var s = r;
            if ("scroll" === r)
                o.container ? o.container["scroll" + o.direction] = a : "Left" === o.direction ? t.scrollTo(a, o.alternateValue) : t.scrollTo(o.alternateValue, a);
            else if (x.Normalizations.registered[r] && "transform" === x.Normalizations.registered[r]("name", e))
                x.Normalizations.registered[r]("inject", e, a), s = "transform", a = i(e).transformCache[r];
            else {
                if (x.Hooks.registered[r]) {
                    var l = r, u = x.Hooks.getRoot(r);
                    n = n || x.getPropertyValue(e, u), a = x.Hooks.injectValue(l, a, n), r = u
                }
                if (x.Normalizations.registered[r] && (a = x.Normalizations.registered[r]("inject", e, a), r = x.Normalizations.registered[r]("name", e)), s = x.Names.prefixCheck(r)[0], 8 >= f)
                    try {
                        e.style[s] = a
                } catch (c) {
                    v.debug && console.log("Browser does not support [" + a + "] for [" + s + "]")
                } else
                    i(e) && i(e).isSVG && x.Names.SVGAttribute(r) ? e.setAttribute(r, a) : e.style[s] = a;
                v.debug >= 2 && console.log("Set " + r + " (" + s + "): " + a)
            }
            return [s, a]
        },
        flushTransformCache: function(e) {
            function t(t) {
                return parseFloat(x.getPropertyValue(e, t))
            }
            var r = "";
            if ((f || v.State.isAndroid&&!v.State.isChrome) && i(e).isSVG) {
                var a = {
                    translate: [t("translateX"), t("translateY")],
                    skewX: [t("skewX")],
                    skewY: [t("skewY")],
                    scale: 1 !== t("scale") ? [t("scale"), t("scale")]: [t("scaleX"), t("scaleY")],
                    rotate: [t("rotateZ"), 0, 0]
                };
                $.each(i(e).transformCache, function(e) {
                    /^translate/i.test(e) ? e = "translate" : /^scale/i.test(e) ? e = "scale" : /^rotate/i.test(e) && (e = "rotate"), a[e] && (r += e + "(" + a[e].join(" ") + ") ", delete a[e])
                })
            } else {
                var n, o;
                $.each(i(e).transformCache, function(t) {
                    return n = i(e).transformCache[t], "transformPerspective" === t ? (o = n, !0) : (9 === f && "rotateZ" === t && (t = "rotate"), void(r += t + n + " "))
                }), o && (r = "perspective" + o + " " + r)
            }
            x.setPropertyValue(e, "transform", r)
        }
    };
    x.Hooks.register(), x.Normalizations.register(), v.hook = function(e, t, r) {
        var n = a;
        return e = o(e), $.each(e, function(e, o) {
            if (i(o) === a && v.init(o), r === a)
                n === a && (n = v.CSS.getPropertyValue(o, t));
            else {
                var s = v.CSS.setPropertyValue(o, t, r);
                "transform" === s[0] && v.CSS.flushTransformCache(o), n = s
            }
        }), n
    };
    var S = function() {
        function e() {
            return l ? T.promise || null : f
        }
        function n() {
            function e(e) {
                function p(e, t) {
                    var r = a, i = a, s = a;
                    return g.isArray(e) ? (r = e[0], !g.isArray(e[1]) && /^[\d-]/.test(e[1]) || g.isFunction(e[1]) || x.RegEx.isHex.test(e[1]) ? s = e[1] : (g.isString(e[1])&&!x.RegEx.isHex.test(e[1]) || g.isArray(e[1])) && (i = t ? e[1] : u(e[1], o.duration), e[2] !== a && (s = e[2]))) : r = e, t || (i = i || o.easing), g.isFunction(r) && (r = r.call(n, w, P)), g.isFunction(s) && (s = s.call(n, w, P)), [r || 0, i, s]
                }
                function f(e, t) {
                    var r, a;
                    return a = (t || "0").toString().toLowerCase().replace(/[%A-z]+$/, function(e) {
                        return r = e, ""
                    }), r || (r = x.Values.getUnitType(e)), [a, r]
                }
                function d() {
                    var e = {
                        myParent: n.parentNode || r.body,
                        position: x.getPropertyValue(n, "position"),
                        fontSize: x.getPropertyValue(n, "fontSize")
                    }, a = e.position === N.lastPosition && e.myParent === N.lastParent, o = e.fontSize === N.lastFontSize;
                    N.lastParent = e.myParent, N.lastPosition = e.position, N.lastFontSize = e.fontSize;
                    var s = 100, l = {};
                    if (o && a)
                        l.emToPx = N.lastEmToPx, l.percentToPxWidth = N.lastPercentToPxWidth, l.percentToPxHeight = N.lastPercentToPxHeight;
                    else {
                        var u = i(n).isSVG ? r.createElementNS("http://www.w3.org/2000/svg", "rect"): r.createElement("div");
                        v.init(u), e.myParent.appendChild(u), $.each(["overflow", "overflowX", "overflowY"], function(e, t) {
                            v.CSS.setPropertyValue(u, t, "hidden")
                        }), v.CSS.setPropertyValue(u, "position", e.position), v.CSS.setPropertyValue(u, "fontSize", e.fontSize), v.CSS.setPropertyValue(u, "boxSizing", "content-box"), $.each(["minWidth", "maxWidth", "width", "minHeight", "maxHeight", "height"], function(e, t) {
                            v.CSS.setPropertyValue(u, t, s + "%")
                        }), v.CSS.setPropertyValue(u, "paddingLeft", s + "em"), l.percentToPxWidth = N.lastPercentToPxWidth = (parseFloat(x.getPropertyValue(u, "width", null, !0)) || 1) / s, l.percentToPxHeight = N.lastPercentToPxHeight = (parseFloat(x.getPropertyValue(u, "height", null, !0)) || 1) / s, l.emToPx = N.lastEmToPx = (parseFloat(x.getPropertyValue(u, "paddingLeft")) || 1) / s, e.myParent.removeChild(u)
                    }
                    return null === N.remToPx && (N.remToPx = parseFloat(x.getPropertyValue(r.body, "fontSize")) || 16), null === N.vwToPx && (N.vwToPx = parseFloat(t.innerWidth) / 100, N.vhToPx = parseFloat(t.innerHeight) / 100), l.remToPx = N.remToPx, l.vwToPx = N.vwToPx, l.vhToPx = N.vhToPx, v.debug >= 1 && console.log("Unit ratios: " + JSON.stringify(l), n), l
                }
                if (o.begin && 0 === w)
                    try {
                        o.begin.call(m, m)
                } catch (y) {
                    setTimeout(function() {
                        throw y
                    }, 1)
                }
                if ("scroll" === k) {
                    var S = /^x$/i.test(o.axis) ? "Left": "Top", V = parseFloat(o.offset) || 0, C, A, F;
                    o.container ? g.isWrapped(o.container) || g.isNode(o.container) ? (o.container = o.container[0] || o.container, C = o.container["scroll" + S], F = C + $(n).position()[S.toLowerCase()] + V) : o.container = null : (C = v.State.scrollAnchor[v.State["scrollProperty" + S]], A = v.State.scrollAnchor[v.State["scrollProperty" + ("Left" === S ? "Top" : "Left")]], F = $(n).offset()[S.toLowerCase()] + V), s = {
                        scroll: {
                            rootPropertyValue: !1,
                            startValue: C,
                            currentValue: C,
                            endValue: F,
                            unitType: "",
                            easing: o.easing,
                            scrollData: {
                                container: o.container,
                                direction: S,
                                alternateValue: A
                            }
                        },
                        element: n
                    }, v.debug && console.log("tweensContainer (scroll): ", s.scroll, n)
                } else if ("reverse" === k) {
                    if (!i(n).tweensContainer)
                        return void $.dequeue(n, o.queue);
                    "none" === i(n).opts.display && (i(n).opts.display = "auto"), "hidden" === i(n).opts.visibility && (i(n).opts.visibility = "visible"), i(n).opts.loop=!1, i(n).opts.begin = null, i(n).opts.complete = null, b.easing || delete o.easing, b.duration || delete o.duration, o = $.extend({}, i(n).opts, o);
                    var E = $.extend(!0, {}, i(n).tweensContainer);
                    for (var j in E)
                        if ("element" !== j) {
                            var H = E[j].startValue;
                            E[j].startValue = E[j].currentValue = E[j].endValue, E[j].endValue = H, g.isEmptyObject(b) || (E[j].easing = o.easing), v.debug && console.log("reverse tweensContainer (" + j + "): " + JSON.stringify(E[j]), n)
                        }
                    s = E
                } else if ("start" === k) {
                    var E;
                    i(n).tweensContainer && i(n).isAnimating===!0 && (E = i(n).tweensContainer), $.each(h, function(e, t) {
                        if (RegExp("^" + x.Lists.colors.join("$|^") + "$").test(e)) {
                            var r = p(t, !0), n = r[0], o = r[1], i = r[2];
                            if (x.RegEx.isHex.test(n)) {
                                for (var s = ["Red", "Green", "Blue"], l = x.Values.hexToRgb(n), u = i ? x.Values.hexToRgb(i) : a, c = 0; c < s.length; c++) {
                                    var f = [l[c]];
                                    o && f.push(o), u !== a && f.push(u[c]), h[e + s[c]] = f
                                }
                                delete h[e]
                            }
                        }
                    });
                    for (var R in h) {
                        var O = p(h[R]), z = O[0], q = O[1], M = O[2];
                        R = x.Names.camelCase(R);
                        var I = x.Hooks.getRoot(R), B=!1;
                        if (i(n).isSVG || "tween" === I || x.Names.prefixCheck(I)[1]!==!1 || x.Normalizations.registered[I] !== a) {
                            (o.display !== a && null !== o.display && "none" !== o.display || o.visibility !== a && "hidden" !== o.visibility) && /opacity|filter/.test(R)&&!M && 0 !== z && (M = 0), o._cacheValues && E && E[R] ? (M === a && (M = E[R].endValue + E[R].unitType), B = i(n).rootPropertyValueCache[I]) : x.Hooks.registered[R] ? M === a ? (B = x.getPropertyValue(n, I), M = x.getPropertyValue(n, R, B)) : B = x.Hooks.templates[I][1] : M === a && (M = x.getPropertyValue(n, R));
                            var W, G, D, X=!1;
                            if (W = f(R, M), M = W[0], D = W[1], W = f(R, z), z = W[0].replace(/^([+-\/*])=/, function(e, t) {
                                return X = t, ""
                            }), G = W[1], M = parseFloat(M) || 0, z = parseFloat(z) || 0, "%" === G && (/^(fontSize|lineHeight)$/.test(R) ? (z/=100, G = "em") : /^scale/.test(R) ? (z/=100, G = "") : /(Red|Green|Blue)$/i.test(R) && (z = z / 100 * 255, G = "")), /[\/*]/.test(X))
                                G = D;
                            else if (D !== G && 0 !== M)
                                if (0 === z)
                                    G = D;
                                else {
                                    l = l || d();
                                    var Y = /margin|padding|left|right|width|text|word|letter/i.test(R) || /X$/.test(R) || "x" === R ? "x": "y";
                                    switch (D) {
                                    case"%":
                                        M*="x" === Y ? l.percentToPxWidth : l.percentToPxHeight;
                                        break;
                                    case"px":
                                        break;
                                    default:
                                        M*=l[D + "ToPx"]
                                    }
                                    switch (G) {
                                    case"%":
                                        M*=1 / ("x" === Y ? l.percentToPxWidth : l.percentToPxHeight);
                                        break;
                                    case"px":
                                        break;
                                    default:
                                        M*=1 / l[G + "ToPx"]
                                    }
                                }
                            switch (X) {
                            case"+":
                                z = M + z;
                                break;
                            case"-":
                                z = M - z;
                                break;
                            case"*":
                                z = M * z;
                                break;
                            case"/":
                                z = M / z
                            }
                            s[R] = {
                                rootPropertyValue: B,
                                startValue: M,
                                currentValue: M,
                                endValue: z,
                                unitType: G,
                                easing: q
                            }, v.debug && console.log("tweensContainer (" + R + "): " + JSON.stringify(s[R]), n)
                        } else
                            v.debug && console.log("Skipping [" + I + "] due to a lack of browser support.")
                        }
                    s.element = n
                }
                s.element && (x.Values.addClass(n, "velocity-animating"), L.push(s), "" === o.queue && (i(n).tweensContainer = s, i(n).opts = o), i(n).isAnimating=!0, w === P - 1 ? (v.State.calls.push([L, m, o, null, T.resolver]), v.State.isTicking===!1 && (v.State.isTicking=!0, c())) : w++)
            }
            var n = this, o = $.extend({}, v.defaults, b), s = {}, l;
            switch (i(n) === a && v.init(n), parseFloat(o.delay) && o.queue!==!1 && $.queue(n, o.queue, function(e) {
                v.velocityQueueEntryFlag=!0, i(n).delayTimer = {
                    setTimeout: setTimeout(e, parseFloat(o.delay)),
                    next: e
                }
            }), o.duration.toString().toLowerCase()) {
            case"fast":
                o.duration = 200;
                break;
            case"normal":
                o.duration = y;
                break;
            case"slow":
                o.duration = 600;
                break;
            default:
                o.duration = parseFloat(o.duration) || 1
            }
            v.mock!==!1 && (v.mock===!0 ? o.duration = o.delay = 1 : (o.duration*=parseFloat(v.mock) || 1, o.delay*=parseFloat(v.mock) || 1)), o.easing = u(o.easing, o.duration), o.begin&&!g.isFunction(o.begin) && (o.begin = null), o.progress&&!g.isFunction(o.progress) && (o.progress = null), o.complete&&!g.isFunction(o.complete) && (o.complete = null), o.display !== a && null !== o.display && (o.display = o.display.toString().toLowerCase(), "auto" === o.display && (o.display = v.CSS.Values.getDisplayType(n))), o.visibility !== a && null !== o.visibility && (o.visibility = o.visibility.toString().toLowerCase()), o.mobileHA = o.mobileHA && v.State.isMobile&&!v.State.isGingerbread, o.queue===!1 ? o.delay ? setTimeout(e, o.delay) : e() : $.queue(n, o.queue, function(t, r) {
                return r===!0 ? (T.promise && T.resolver(m), !0) : (v.velocityQueueEntryFlag=!0, void e(t))
            }), "" !== o.queue && "fx" !== o.queue || "inprogress" === $.queue(n)[0] || $.dequeue(n)
        }
        var s = arguments[0] && (arguments[0].p || $.isPlainObject(arguments[0].properties)&&!arguments[0].properties.names || g.isString(arguments[0].properties)), l, f, d, m, h, b;
        if (g.isWrapped(this) ? (l=!1, d = 0, m = this, f = this) : (l=!0, d = 1, m = s ? arguments[0].elements || arguments[0].e : arguments[0]), m = o(m)) {
            s ? (h = arguments[0].properties || arguments[0].p, b = arguments[0].options || arguments[0].o) : (h = arguments[d], b = arguments[d + 1]);
            var P = m.length, w = 0;
            if (!/^(stop|finish)$/i.test(h)&&!$.isPlainObject(b)) {
                var V = d + 1;
                b = {};
                for (var C = V; C < arguments.length; C++)
                    g.isArray(arguments[C]) ||!/^(fast|normal|slow)$/i.test(arguments[C])&&!/^\d/.test(arguments[C]) ? g.isString(arguments[C]) || g.isArray(arguments[C]) ? b.easing = arguments[C] : g.isFunction(arguments[C]) && (b.complete = arguments[C]) : b.duration = arguments[C]
            }
            var T = {
                promise: null,
                resolver: null,
                rejecter: null
            };
            l && v.Promise && (T.promise = new v.Promise(function(e, t) {
                T.resolver = e, T.rejecter = t
            }));
            var k;
            switch (h) {
            case"scroll":
                k = "scroll";
                break;
            case"reverse":
                k = "reverse";
                break;
            case"finish":
            case"stop":
                $.each(m, function(e, t) {
                    i(t) && i(t).delayTimer && (clearTimeout(i(t).delayTimer.setTimeout), i(t).delayTimer.next && i(t).delayTimer.next(), delete i(t).delayTimer)
                });
                var A = [];
                return $.each(v.State.calls, function(e, t) {
                    t && $.each(t[1], function(r, n) {
                        var o = b === a ? "": b;
                        return o===!0 || t[2].queue === o || b === a && t[2].queue===!1 ? void $.each(m, function(r, a) {
                            a === n && ((b===!0 || g.isString(b)) && ($.each($.queue(a, g.isString(b) ? b : ""), function(e, t) {
                                g.isFunction(t) && t(null, !0)
                            }), $.queue(a, g.isString(b) ? b : "", [])), "stop" === h ? (i(a) && i(a).tweensContainer && o!==!1 && $.each(i(a).tweensContainer, function(e, t) {
                                t.endValue = t.currentValue
                            }), A.push(e)) : "finish" === h && (t[2].duration = 1))
                        }) : !0
                    })
                }), "stop" === h && ($.each(A, function(e, t) {
                    p(t, !0)
                }), T.promise && T.resolver(m)), e();
            default:
                if (!$.isPlainObject(h) || g.isEmptyObject(h)) {
                    if (g.isString(h) && v.Redirects[h]) {
                        var F = $.extend({}, b), E = F.duration, j = F.delay || 0;
                        return F.backwards===!0 && (m = $.extend(!0, [], m).reverse()), $.each(m, function(e, t) {
                            parseFloat(F.stagger) ? F.delay = j + parseFloat(F.stagger) * e : g.isFunction(F.stagger) && (F.delay = j + F.stagger.call(t, e, P)), F.drag && (F.duration = parseFloat(E) || (/^(callout|transition)/.test(h) ? 1e3 : y), F.duration = Math.max(F.duration * (F.backwards ? 1 - e / P : (e + 1) / P), .75 * F.duration, 200)), v.Redirects[h].call(t, t, F || {}, e, P, m, T.promise ? T : a)
                        }), e()
                    }
                    var H = "Velocity: First argument (" + h + ") was not a property map, a known action, or a registered redirect. Aborting.";
                    return T.promise ? T.rejecter(new Error(H)) : console.log(H), e()
                }
                k = "start"
            }
            var N = {
                lastParent: null,
                lastPosition: null,
                lastFontSize: null,
                lastPercentToPxWidth: null,
                lastPercentToPxHeight: null,
                lastEmToPx: null,
                remToPx: null,
                vwToPx: null,
                vhToPx: null
            }, L = [];
            $.each(m, function(e, t) {
                g.isNode(t) && n.call(t)
            });
            var F = $.extend({}, v.defaults, b), R;
            if (F.loop = parseInt(F.loop), R = 2 * F.loop - 1, F.loop)
                for (var O = 0; R > O; O++) {
                    var z = {
                        delay: F.delay,
                        progress: F.progress
                    };
                    O === R - 1 && (z.display = F.display, z.visibility = F.visibility, z.complete = F.complete), S(m, "reverse", z)
                }
            return e()
        }
    };
    v = $.extend(S, v), v.animate = S;
    var P = t.requestAnimationFrame || d;
    return v.State.isMobile || r.hidden === a || r.addEventListener("visibilitychange", function() {
        r.hidden ? (P = function(e) {
            return setTimeout(function() {
                e(!0)
            }, 16)
        }, c()) : P = t.requestAnimationFrame || d
    }), e.Velocity = v, e !== t && (e.fn.velocity = S, e.fn.velocity.defaults = v.defaults), $.each(["Down", "Up"], function(e, t) {
        v.Redirects["slide" + t] = function(e, r, n, o, i, s) {
            var l = $.extend({}, r), u = l.begin, c = l.complete, p = {
                height: "",
                marginTop: "",
                marginBottom: "",
                paddingTop: "",
                paddingBottom: ""
            }, f = {};
            l.display === a && (l.display = "Down" === t ? "inline" === v.CSS.Values.getDisplayType(e) ? "inline-block" : "block" : "none"), l.begin = function() {
                u && u.call(i, i);
                for (var r in p) {
                    f[r] = e.style[r];
                    var a = v.CSS.getPropertyValue(e, r);
                    p[r] = "Down" === t ? [a, 0] : [0, a]
                }
                f.overflow = e.style.overflow, e.style.overflow = "hidden"
            }, l.complete = function() {
                for (var t in f)
                    e.style[t] = f[t];
                c && c.call(i, i), s && s.resolver(i)
            }, v(e, p, l)
        }
    }), $.each(["In", "Out"], function(e, t) {
        v.Redirects["fade" + t] = function(e, r, n, o, i, s) {
            var l = $.extend({}, r), u = {
                opacity: "In" === t ? 1: 0
            }, c = l.complete;
            l.complete = n !== o - 1 ? l.begin = null : function() {
                c && c.call(i, i), s && s.resolver(i)
            }, l.display === a && (l.display = "In" === t ? "auto" : "none"), v(this, u, l)
        }
    }), v
}(window.jQuery || window.Zepto || window, window, document)
});


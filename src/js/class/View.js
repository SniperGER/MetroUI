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
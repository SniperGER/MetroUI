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
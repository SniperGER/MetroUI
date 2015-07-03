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
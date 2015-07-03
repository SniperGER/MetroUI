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
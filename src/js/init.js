app.init = function() {
			app.initLinks.menu();
			app.initLinks.content();
			
			if (app.params.checkbox)
				app.initCheckboxes();
			
			if (app.params.radios)
				app.initRadios();
			
			if (app.params.theming) {
				app.initDesign.theme();
				app.initDesign.coloredPages();
			}
			
			if (app.params.switches)
				app.initSwitches();
				
			if (app.params.progress)
				app.initProgress();
			
			if (app.params.lists)
				app.initLists();
			
			if (app.params.theming)
				app.initThemeSelector();

			if ('ontouchend' in window) {
				 document.body.classList.add("touch");
			}

			if (document.body.classList.contains("colored") && app.params.theming) {
				document.body.setAttribute("data-bg", "dark");

				for (var i=0; i<document.querySelectorAll("div.list.theme").length; i++) {
					document.querySelectorAll("div.list.theme")[i].classList.add("disabled");
				}
			}
			if (app.history.length < 1) {
				app.history.push(document.querySelector("div.page:last-child").getAttribute("data-page"));
			}


			window.addEventListener('load', function() {
				app.animation.pageSlideIn(app.history[app.history.length-1]);
				app.animation.menuSlideIn("index");
			}, false );
			window.onclick = function(event) {
				 event.stopPropagation();
				if (app.listOpen) {
					setTimeout(function() {
						for (var i=0; i<document.querySelectorAll("div.list.open").length;i++) {
							document.querySelectorAll("div.list.open")[i].children[1].removeAttribute("style");
							document.querySelectorAll("div.list.open")[i].classList.remove("open");
						}
						app.listOpen = false;
					}, 10);
				}
				if (app.contextOpen) {
					var a = event.target;
					var els = [];
					while (a) {
						els.unshift(a);
						a = a.parentNode;
					}
					if (els.indexOf(document.querySelector("div.popover")) == -1) {
						setTimeout(function() {
							document.querySelectorAll("div.popover")[0].classList.add("fade-out");
							setTimeout(function() {
								var el = document.querySelectorAll("div.popover")[0];
								el.parentNode.removeChild(el);
							}, 100);
							app.contextOpen = false;
						}, 10);
					}
				}
				if (app.appBarOpen) {
					var a = event.target;
					var els = [];
					while (a) {
						els.unshift(a);
						a = a.parentNode;
					}
					if (els.indexOf(document.querySelector("div.pages")) > -1) {
						if (document.querySelector("div.navigation-bar")) {
							document.querySelector("div.navigation-bar").classList.toggle("minimal");
						}
						if (document.querySelector("div.application-bar")) {
							document.querySelector("div.application-bar").classList.toggle("minimal");
						}
						app.appBarOpen = false;
					}
				}
			};
			if (document.querySelectorAll("div.application-bar").length == 1) {
				 document.querySelector("div.application-bar div.icon-more").onclick = function() {
					var el = this;
					setTimeout(function() {
						if (document.querySelectorAll("div.navigation-bar").length == 1) {
							document.querySelector("div.navigation-bar").classList.remove("minimal");
						}

						el.parentNode.classList.remove("minimal");
						app.appBarOpen = true;
					}, 10);
				 };
				 document.querySelector("div.application-bar").onclick = function() {
					if (!this.classList.contains("minimal")) {
						app.appBarOpen = true;
					}
				 };
			}
			window.oncontextmenu = function(e) {
				if (app.params.barsOnContext) {
					e.preventDefault();
					if (document.querySelector("div.navigation-bar")) {
						document.querySelector("div.navigation-bar").classList.toggle("minimal");
					}
					if (document.querySelector("div.application-bar")) {
						document.querySelector("div.application-bar").classList.toggle("minimal");
					}
					app.appBarOpen = !app.appBarOpen;
					return false;
				}
			};

			//var attachFastClick = Origami.fastclick;
			//attachFastClick(document.body);
			document.addEventListener('DOMContentLoaded', function() {
		        FastClick.attach(document.body);
		    }, false);
		

		};
		app.initLinks = {
			menu: function() {
				for (var k=0; k<document.querySelectorAll("div.menu div.frame:last-child a").length; k++) {
					document.querySelectorAll("div.menu div.frame:last-child a")[k].onclick = function(e) {
						e.stopPropagation();
						e.preventDefault();
						if (!this.children[0].classList.contains("selected") && !this.children[0].classList.contains("preselected")) {
							app.navigation.loadPage(this.getAttribute("href"), false);
							for (var i=0; i<document.querySelectorAll("div.menu div.link.selected").length;i++) {
								document.querySelectorAll("div.menu div.link.selected")[i].classList.remove("selected");
							}
							for (var i=0; i<document.querySelectorAll("div.menu div.link.preselected").length;i++) {
								document.querySelectorAll("div.menu div.link.preselected")[i].classList.remove("preselected");
							}
							this.children[0].classList.add("selected");
						}
					};
				}
				for (var i=0; i<document.querySelectorAll("div.navigation-bar a").length; i++) {
					document.querySelectorAll("div.navigation-bar a")[i].onclick = function(e) {
						e.stopPropagation();
						e.preventDefault();
						if (document.querySelector("div.navigation-bar")) {
							document.querySelector("div.navigation-bar").classList.add("minimal");
						}
						if (document.querySelector("div.application-bar")) {
							document.querySelector("div.application-bar").classList.add("minimal");
						}
						app.appBarOpen = false;
						app.navigation.loadPage(this.getAttribute("href"));
					};
				}
			},
			content: function() {
				for (var i=0;i<document.querySelectorAll("div.page:last-child header div.navigate-back").length;i++) {
					document.querySelectorAll("div.page:last-child header div.navigate-back")[i].addEventListener("click", function(e) {
						app.navigation.back();
					});
				}
				for (var j=0;j<document.querySelectorAll("div.page:last-child div.content a:not(.external)").length;j++) {
					document.querySelectorAll("div.page:last-child div.content a:not(.external)")[j].addEventListener("click", function(e) {
						 e.stopPropagation();
						e.preventDefault();
						app.navigation.loadPage(this.getAttribute("href"));
					});
				}
			}
		};
		app.initSwitches = function() {
			var switches = document.querySelectorAll("div.switch:not(.disabled) div.switch-inner");
			for (var i=0; i<switches.length; i++) {
				if (switches[i].parentNode.children[0].hasAttribute("checked")) {
					switches[i].parentNode.children[2].innerHTML = "On";
				}
				switches[i].onclick = function() {
					if (this.parentNode.children[0].hasAttribute("checked")) {
						this.parentNode.children[0].removeAttribute("checked");
						this.parentNode.children[2].innerHTML = "Off";
					} else {
						this.parentNode.children[0].setAttribute("checked", true);
						this.parentNode.children[2].innerHTML = "On";
					}
					var el = this.parentNode.children[2];
					var visibility = el.style.opacity;
					el.style.opacity = '0.99';
					setTimeout( function() {
						el.style.opacity = visibility;
					}, 1);
					var parent = this.parentNode;
					var event = document.createEvent("UIEvents");
					event.initUIEvent("change", true, true);
					parent.children[0].dispatchEvent(event);

				};
			}
		};
		app.initCheckboxes = function() {
			var checkboxes = document.querySelectorAll("div.checkbox:not(.disabled)");
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
			var checkboxes = document.querySelectorAll("div.radio:not(.disabled)");
			for (var i=0; i<checkboxes.length; i++) {

				checkboxes[i].onclick = function() {
					for (var j=0; j<checkboxes.length; j++) {
						checkboxes[j].children[0].removeAttribute("checked");
					}
					this.children[0].setAttribute("checked", true);
				};
			}
		};
		app.initProgress = function() {
			for (var i=0;i<document.querySelectorAll("div.progress:not(.indeterminate)").length;i++) {
				var el = document.querySelectorAll("div.progress:not(.indeterminate)")[i];
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
			var lists = document.querySelectorAll("div.list");
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
								}

								var index =indexInParent(el.querySelector("li.checked"));
								el.querySelector("div.select-inner-wrapper").style.top = "-"+((index*40)+6)+"px";
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
							lists[i].children[1].style.top = "-"+(index*28)+"px";
							for (var k=0; k<lists[i].querySelectorAll("li").length; k++) {
								lists[i].querySelectorAll("li")[k].onclick = function() {
									var elInside = this;
									var parent = elInside.parentNode.parentNode.parentNode;
									if (parent.classList.contains("open")) {
										setTimeout(function() {
											parent.classList.remove("open");

											var indexInside = indexInParent(elInside);
											parent.children[1].style.top = "-"+(indexInside*28)+"px";

											parent.children[0].querySelector("option[selected]").removeAttribute("selected");
											parent.children[0].children[indexInside].setAttribute("selected", "");
											var event = document.createEvent("UIEvents");
											event.initUIEvent("change", true, true);
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
						}
					}
				}
			}
		};
		app.initThemeSelector = function() {
			var currentThemeWin = document.body.getAttribute("data-tint-win");
			var index = app.params.availableThemesWin.indexOf(currentThemeWin);

			if (document.querySelector("div.theme-selector")) {
				document.querySelector("div.theme-selector").querySelector("div.indicator").style.left = (index*30)+"px";

				var colorElements = document.querySelector("div.theme-selector").querySelectorAll("div.theme-color");
				for (var i=0; i<colorElements.length;i++) {
					colorElements[i].addEventListener("click", function() {
						document.body.setAttribute("data-tint-win", this.getAttribute("data-tint-win"));
						var currentThemeWin = document.body.getAttribute("data-tint-win");
						var index = app.params.availableThemesWin.indexOf(currentThemeWin);
						document.querySelector("div.theme-selector").querySelector("div.indicator").style.left = (index*30)+"px";
					});
				}
			}
		};
		app.initDesign = {
			theme: function() {
				var bg = (app.previousTheme)?app.previousTheme:document.body.getAttribute("data-bg");
				if (document.querySelectorAll("div.list.theme").length > 0) {
					document.querySelector("div.list.theme select option[selected]").removeAttribute("selected");
					document.querySelector("div.list.theme select option[value="+bg+"]").setAttribute("selected", "");
				}
			},
			coloredPages: function() {
				if (document.body.classList.contains("colored")) {
					for (var i=0; i<document.querySelectorAll("div.switch.colored-pages input").length;i++) {
						document.querySelectorAll("div.switch.colored-pages input")[i].setAttribute("checked", "");
					}
				}
			}
		};

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
		
		app.progressIntervals = [];

		app.touchEventStart = (('ontouchend' in window)) ? 'touchstart' : 'mousedown';
		app.touchEventEnd = (('ontouchend' in window)) ? 'touchend' : 'click';

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

			var attachFastClick = Origami.fastclick;
			attachFastClick(document.body);

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

		app.notify = function(title,message,callback) {
			if (document.querySelectorAll("div.notification-center").length < 1) {
				var notificationCenter = document.createElement("div");
				notificationCenter.className = "notification-center";
				document.body.appendChild(notificationCenter);
			}
			for (var i=0; i<document.querySelectorAll("div.notification-wrapper").length;i++) {
				var el = document.querySelectorAll("div.notification-wrapper")[i];
				if (el) {
					el.style.top = 20 + ((document.querySelectorAll("div.notification-wrapper").length-i)*100) + "px";
				}
			}

			var notificationWrapper = document.createElement("div");
			notificationWrapper.className = "notification-wrapper";

			var notification = document.createElement("div");
			notification.className = ((app.params.notificationTransitions))?"notification slide-in":"notification";
			notification.addEventListener("mousedown", function() {
				this.style.webkitTransform = "rotateY(-7deg)";
			});
			notification.addEventListener("mouseup", function() {
				this.removeAttribute("style");
				var parent = this.parentNode;
				this.className = ((app.params.notificationTransitions))?"notification slide-out":"notification";

				setTimeout(function() {
					parent.parentNode.removeChild(parent);
					for (var i=0; i<document.querySelectorAll("div.notification-wrapper").length;i++) {
						var el = document.querySelectorAll("div.notification-wrapper")[i];
						if (el) {
							el.style.top = 20 + ((document.querySelectorAll("div.notification-wrapper").length-(i+1))*100) + "px";
						}
					}
					if (typeof callback === 'function') {
						callback();
					}
				}, ((app.params.notificationTransitions))?300:0);
			});

			var notificationClose = document.createElement("div");
			notificationClose.className = "close-box";
			notificationClose.addEventListener("mousedown", function() {
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
					for (var i=0; i<document.querySelectorAll("div.notification-wrapper").length;i++) {
						var el = document.querySelectorAll("div.notification-wrapper")[i];
						if (el) {
							el.style.top = 20 + ((document.querySelectorAll("div.notification-wrapper").length-(i+1))*100) + "px";
						}
					}
				}, ((app.params.notificationTransitions))?300:0);
			});
			notification.appendChild(notificationClose);

			var notificationTitle = document.createElement("div");
			notificationTitle.className = "title";
			notificationTitle.innerHTML = ((title!=="undefined"))?title:app.params.modalDefaultTitle;
			notification.appendChild(notificationTitle);

			var notificationContent = document.createElement("div");
			notificationContent.className = "content";
			var notificationContentText = document.createElement("p");
			notificationContentText.innerHTML = ((message!=="undefined"))?message:"No content";
			notificationContent.appendChild(notificationContentText);
			notification.appendChild(notificationContent);
			notificationWrapper.appendChild(notification);

			document.getElementsByClassName("notification-center")[0].appendChild(notificationWrapper);
		};
		app.alert = function(title,message,callback) {
			if (document.querySelectorAll("div.notification-center").length < 1) {
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

			var alertBox = document.createElement("div");
			alertBox.className = "alert fade-in";
			alertBox.id = "alert";
			alertBox.addEventListener("mousewheel", function(e) {
				e.preventDefault();
				e.stopPropagation();
			});

			var alertTitle = document.createElement("div");
			alertTitle.className = "title";
			alertTitle.innerHTML = ((title!=="undefined"))?title:"Untitled";
			alertBox.appendChild(alertTitle);

			var alertContent = document.createElement("div");
			alertContent.className = "content";
			alertContent.innerHTML = ((message!=="undefined"))?message:"No content.";
			alertBox.appendChild(alertContent);

			var alertButtonContainer = document.createElement("div");
			alertButtonContainer.className = "button-container";
			var okButton = document.createElement("button");
			okButton.className = "colored";
			okButton.innerHTML = "ok";
			okButton.addEventListener("click", function() {
				document.querySelector("div.notification-background.fade-in").className = "notification-background fade-out";
				document.querySelector("div.alert.fade-in").className = "alert fade-out";

				setTimeout(function() {
					var alertBGChild = document.querySelector("div.notification-background");
					var alertChild = document.querySelector("div.alert");

					alertBGChild.parentNode.removeChild(alertBGChild);
					alertChild.parentNode.removeChild(alertChild);

					if (typeof callback === 'function') {
						callback();
					}
				}, 200);
			});
			alertButtonContainer.appendChild(okButton);
			alertBox.appendChild(alertButtonContainer);

			document.getElementsByClassName("notification-center")[0].appendChild(alertBG);
			document.getElementsByClassName("notification-center")[0].appendChild(alertBox);

			document.getElementById("alert").style.marginTop = "-" + document.getElementById("alert").clientHeight/2;
		};
		app.confirm = function(title,message,callback) {
			if (document.querySelectorAll("div.notification-center").length < 1) {
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

			var alertBox = document.createElement("div");
			alertBox.className = "alert fade-in";
			alertBox.id = "alert";
			alertBox.addEventListener("mousewheel", function(e) {
				e.preventDefault();
				e.stopPropagation();
			});

			var alertTitle = document.createElement("div");
			alertTitle.className = "title";
			alertTitle.innerHTML = ((title!=="undefined"))?title:"Untitled";
			alertBox.appendChild(alertTitle);

			var alertContent = document.createElement("div");
			alertContent.className = "content";
			alertContent.innerHTML = ((message!=="undefined"))?message:"No content.";
			alertBox.appendChild(alertContent);

			var alertButtonContainer = document.createElement("div");
			alertButtonContainer.className = "button-container";
			var cancelButton = document.createElement("button");
			cancelButton.className = "";
			cancelButton.innerHTML = "cancel";
			cancelButton.addEventListener("click", function() {
				document.querySelector("div.notification-background.fade-in").className = "notification-background fade-out";
				document.querySelector("div.alert.fade-in").className = "alert fade-out";

				setTimeout(function() {
					var alertBGChild = document.querySelector("div.notification-background");
					var alertChild = document.querySelector("div.alert");

					alertBGChild.parentNode.removeChild(alertBGChild);
					alertChild.parentNode.removeChild(alertChild);
				}, 200);
			});
			alertButtonContainer.appendChild(cancelButton);
			var okButton = document.createElement("button");
			okButton.className = "colored inline";
			okButton.innerHTML = "ok";
			okButton.addEventListener("click", function() {
				document.querySelector("div.notification-background.fade-in").className = "notification-background fade-out";
				document.querySelector("div.alert.fade-in").className = "alert fade-out";

				setTimeout(function() {
					var alertBGChild = document.querySelector("div.notification-background");
					var alertChild = document.querySelector("div.alert");

					alertBGChild.parentNode.removeChild(alertBGChild);
					alertChild.parentNode.removeChild(alertChild);

					if (typeof callback === 'function') {
						callback();
					}
				}, 200);
			});
			alertButtonContainer.appendChild(okButton);

			alertBox.appendChild(alertButtonContainer);

			document.getElementsByClassName("notification-center")[0].appendChild(alertBG);
			document.getElementsByClassName("notification-center")[0].appendChild(alertBox);

			document.getElementById("alert").style.marginTop = "-" + document.getElementById("alert").clientHeight/2;
		};
		
		app.preloader = function(title, duration) {
			if (document.querySelectorAll("div.notification-center").length < 1) {
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

			var alertBox = document.createElement("div");
			alertBox.className = "alert preloader colored fade-in";
			alertBox.id = "alert";
			alertBox.addEventListener("mousewheel", function(e) {
				e.preventDefault();
				e.stopPropagation();
			});

			var alertTitle = document.createElement("div");
			alertTitle.className = "title";
			alertTitle.innerHTML = ((title!=="undefined"))?title:"Untitled";
			alertBox.appendChild(alertTitle);
			
			var ring = document.createElement("img");
			ring.src = "img/preloader/dark/win-ring-40.gif?"+(new Date()).getMilliseconds();
			
			setTimeout(function() {
				alertBox.appendChild(ring);
				document.querySelector("#alert img").style.marginLeft = "-"+(document.querySelector("#alert div.title").offsetWidth/2 + document.querySelector("#alert img").offsetWidth + 10);
			}, 500);
			
			document.getElementsByClassName("notification-center")[0].appendChild(alertBG);
			document.getElementsByClassName("notification-center")[0].appendChild(alertBox);
			
			setTimeout(function() {
				document.querySelector("#alert div.title").style.marginLeft = "-"+document.querySelector("#alert div.title").offsetWidth/2;
			}, 10);

			document.getElementById("alert").style.marginTop = "-" + document.getElementById("alert").clientHeight/2;
			
			if (typeof(duration) !== "undefined") {
				setTimeout(app.hidePreloader, duration*1000);
			}
		};
		app.hidePreloader = function() {
			document.querySelector("div.notification-background.fade-in").className = "notification-background fade-out";
			document.querySelector("div.alert.fade-in").className = "alert preloader colored fade-out";

			setTimeout(function() {
				var alertBGChild = document.querySelector("div.notification-background");
				var alertChild = document.querySelector("div.alert");

				alertBGChild.parentNode.removeChild(alertBGChild);
				alertChild.parentNode.removeChild(alertChild);
			}, 200);
		};

		app.context = function(parameters) {
			if (document.querySelectorAll("div.popover").length < 1) {
				setTimeout(function() {
					var milliseconds = (new Date()).getMilliseconds();
					var popover = document.createElement("div");
					popover.className = "popover";
					popover.id = milliseconds;

					popover.style.left = parameters.target.offsetLeft;
					
					if (typeof(parameters.html) !== "undefined") {
						popover.classList.add("html");
						popover.innerHTML = parameters.html;
					}

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
									document.querySelectorAll("div.popover")[0].classList.add("fade-out");
										setTimeout(function() {
										var el = document.querySelectorAll("div.popover")[0];
										el.parentNode.removeChild(el);
									}, 100);
									app.contextOpen = false;
								};
	
								link.appendChild(button);
								popover.appendChild(link);
							}
							if (parameters.buttons[i].type == "separator") {
								var separator = document.createElement("div");
								separator.className = "seperator";
								popover.appendChild(separator);
							}
						}
					}

					document.querySelector("div.page:last-child").appendChild(popover);
					app.contextOpen = true;


					if (parameters.target.offsetTop > window.innerHeight/2) {
						document.getElementById(milliseconds).classList.add("slide-from-bottom");
						document.getElementById(milliseconds).style.top = (parameters.target.offsetTop - document.getElementById(milliseconds).offsetHeight - 5);
					} else {
						document.getElementById(milliseconds).classList.add("slide-from-top");
						document.getElementById(milliseconds).style.top = (parameters.target.offsetTop + parameters.target.offsetHeight + 5);
					}
				}, 50);
			}
		};

		app.navigation = {
			loadPage: function(url, history) {
				if (typeof(history)==='undefined') history = true;
				if (url != "#") {
					app.animation.pageFadeOut(document.querySelector("div.pages").getAttribute("data-current-page"));

					var xhr = new XMLHttpRequest();
					xhr.onreadystatechange = function() {
						if (xhr.readyState == 4) {
							setTimeout(function() {
								var parser = new DOMParser();
								var page = parser.parseFromString(xhr.response, "text/html");
								if (document.querySelectorAll("div.page[data-page=\""+page.firstChild.children[1].firstChild.getAttribute("data-page")+"\"]").length < 1) {
									document.querySelector("div.pages").appendChild(page.firstChild.children[1].firstChild);	
								
									if (history) {
										app.history.push(document.querySelector("div.page:last-child").getAttribute("data-page"));
										document.querySelector("div.pages").setAttribute("data-current-page", app.history[app.history.length-1]);
										app.animation.pageSlideIn(app.history[app.history.length-1]);
									} else {
										app.menuPageHistory.push(document.querySelector("div.page:last-child").getAttribute("data-page"));
										document.querySelector("div.pages").setAttribute("data-current-page", document.querySelector("div.page:last-child").getAttribute("data-page"));
										
										app.animation.pageSlideIn(document.querySelector("div.page:last-child").getAttribute("data-page"));
										document.querySelector("div.page:last-child").classList.add("no-navigation");
									}
									app.init();
								} else {
									app.animation.pageSlideIn(page.firstChild.children[1].firstChild.getAttribute("data-page"));
										
									document.querySelector("div.pages").setAttribute("data-current-page", page.firstChild.children[1].firstChild.getAttribute("data-page"));
								}
							}, 100);
						}
					};
					xhr.open('GET',url+"?"+(new Date()).getTime(), true);
					xhr.send(null);
				} else {
					app.animation.pageFadeOut(document.querySelector("div.page:last-child").getAttribute("data-page"));
					setTimeout(function() {
						var el = document.querySelectorAll("div.page:not(:first-child)");
						for (var i=0; i<el.length;i++) {
							el[i].parentNode.removeChild(el[i]);
						}
						app.animation.pageSlideIn(document.querySelector("div.page:first-child").getAttribute("data-page"));
							
						app.history = [app.history[0]];
						document.querySelector("div.pages").setAttribute("data-current-page", app.history[app.history.length-1]);
					}, 75);
				}
			},
			back: function() {
				if (app.history.length > 1) {
					app.animation.pageFadeOut(app.history[app.history.length-1]);

					var page = document.querySelector("div.page[data-page=\""+app.history[app.history.length-1]+"\"]");
					app.history.pop();
					setTimeout(function() {
						page.parentNode.removeChild(page);
						document.querySelector("div.pages").setAttribute("data-current-page", document.querySelector("div.page:last-child").getAttribute("data-page"));
						app.animation.pageSlideIn(document.querySelector("div.page:last-child").getAttribute("data-page"));
					}, 100);
				} else if (app.menuPageHistory.length > 0) {
					app.animation.pageFadeOut(app.menuPageHistory[app.menuPageHistory.length-1]);
					setTimeout(function() {
						var el = document.querySelector("div.page[data-page=\""+app.menuPageHistory[app.menuPageHistory.length-1]+"\"]");
						el.parentNode.removeChild(el);
						app.animation.pageSlideIn(app.history[app.history.length-1]);
					}, 100);
				}
			},
		};

		app.animation = {
			pageFadeOut: function(identifier) {
				if (app.params.pageTransitions)
				document.querySelector("div.page[data-page=\""+identifier+"\"]").classList.add("fade-out");
				setTimeout(function() {
					document.querySelector("div.page[data-page=\""+identifier+"\"]").classList.add("hidden");
					document.querySelector("div.page[data-page=\""+identifier+"\"]").classList.removemany("fade-out slide-in one-segment two-segments three-segments");
				}, 50);
			},
			pageSlideIn: function(identifier) {
				document.querySelector("div.page[data-page=\""+identifier+"\"]").classList.remove("hidden");
				
				if (app.params.pageTransitions) {
					document.querySelector("div.page[data-page=\""+identifier+"\"]").classList.add("slide-in");
				} else {
					document.querySelector("div.page[data-page=\""+identifier+"\"]").classList.add("pop-in");
				}

				if (document.querySelector("div.page[data-page=\""+identifier+"\"]").classList.contains("menu-hidden")	&& document.querySelectorAll("div.menu").length) {
					 document.querySelector("div.menu").classList.add("hidden");
				} else if (document.querySelectorAll("div.menu").length) {
					 document.querySelector("div.menu").classList.remove("hidden");
				}

				switch(app.params.pageTransitionMode) {
					case 1: document.querySelector("div.page[data-page=\""+identifier+"\"]").classList.add("one-segment"); break;
					case 2: document.querySelector("div.page[data-page=\""+identifier+"\"]").classList.add("two-segments"); break;
					case 3: document.querySelector("div.page[data-page=\""+identifier+"\"]").classList.add("three-segments"); break;
					default: break;
				}
			},
			menuFadeOut: function(identifier) {
				if (document.querySelector("div.menu")) {
					document.querySelector("div.menu div.frame[data-frame=\""+identifier+"\"]").classList.remove("slide-in");
					
					if (app.params.pageTransitions)
					document.querySelector("div.menu div.frame[data-frame=\""+identifier+"\"]").classList.add("fade-out");
					
					setTimeout(function() {
						document.querySelector("div.menu div.frame[data-frame=\""+identifier+"\"]").classList.removemany("fade-out slide-in");
						document.querySelector("div.menu div.frame[data-frame=\""+identifier+"\"]").classList.add("hidden");
					}, 50);
				}
			},
			menuSlideIn: function(identifier) {
				if (document.querySelector("div.menu")) {
					if (app.params.pageTransitions) {
						document.querySelector("div.menu div.frame[data-frame=\""+identifier+"\"]").classList.add("slide-in");
					} else {
						document.querySelector("div.menu div.frame[data-frame=\""+identifier+"\"]").classList.add("pop-in");
					}
					document.querySelector("div.menu div.frame[data-frame=\""+identifier+"\"]").classList.removemany("fade-out hidden");
				}
			}
		};

		app.design = {
			changeTheme: function(element) {
				if (!document.body.classList.contains("colored") && app.params.theming) {
					document.body.setAttribute('data-bg', element.options[element.selectedIndex].value);
				}
			},
			coloredPages: function(element) {
				if (app.params.theming) {
					if (element.checked) {
						document.body.classList.add("colored");
						app.previousTheme = document.body.getAttribute("data-bg");
					} else {
						document.body.classList.remove("colored");
						document.body.setAttribute("data-bg", app.previousTheme);
					}
					if (document.body.classList.contains("colored")) {
						document.body.setAttribute("data-bg", "dark");
	
						for (var i=0; i<document.querySelectorAll("div.list.theme").length; i++) {
							document.querySelectorAll("div.list.theme")[i].classList.add("disabled");
						}
					} else {
						for (var j=0; j<document.querySelectorAll("div.list.theme").length; j++) {
							document.querySelectorAll("div.list.theme")[j].classList.remove("disabled");
						}
					}
				}
			}
		};

		app.init();
	};
})();

function indexInParent(node) {
	var children = node.parentNode.childNodes;
	var num = 0;
	for (var i=0; i<children.length; i++) {
		 if (children[i]==node) return num;
		 if (children[i].nodeType==1) num++;
	}
	return -1;
}

!function e(t,n,r){function i(a,s){if(!n[a]){if(!t[a]){var c="function"==typeof require&&require;if(!s&&c)return c(a,!0);if(o)return o(a,!0);var u=new Error("Cannot find module '"+a+"'");throw u.code="MODULE_NOT_FOUND",u}var l=n[a]={exports:{}};t[a][0].call(l.exports,function(e){var n=t[a][1][e];return i(n?n:e)},l,l.exports,e,t,n,r)}return n[a].exports}for(var o="function"==typeof require&&require,a=0;a<r.length;a++)i(r[a]);return i}({1:[function(e,t){!function(){"use strict";function e(t,n){function i(e,t){return function(){return e.apply(t,arguments)}}var o;if(n=n||{},this.trackingClick=!1,this.trackingClickStart=0,this.targetElement=null,this.touchStartX=0,this.touchStartY=0,this.lastTouchIdentifier=0,this.touchBoundary=n.touchBoundary||10,this.layer=t,this.tapDelay=n.tapDelay||200,this.tapTimeout=n.tapTimeout||700,!e.notNeeded(t)){for(var a=["onMouse","onClick","onTouchStart","onTouchMove","onTouchEnd","onTouchCancel"],s=this,c=0,u=a.length;u>c;c++)s[a[c]]=i(s[a[c]],s);r&&(t.addEventListener("mouseover",this.onMouse,!0),t.addEventListener("mousedown",this.onMouse,!0),t.addEventListener("mouseup",this.onMouse,!0)),t.addEventListener("click",this.onClick,!0),t.addEventListener("touchstart",this.onTouchStart,!1),t.addEventListener("touchmove",this.onTouchMove,!1),t.addEventListener("touchend",this.onTouchEnd,!1),t.addEventListener("touchcancel",this.onTouchCancel,!1),Event.prototype.stopImmediatePropagation||(t.removeEventListener=function(e,n,r){var i=Node.prototype.removeEventListener;"click"===e?i.call(t,e,n.hijacked||n,r):i.call(t,e,n,r)},t.addEventListener=function(e,n,r){var i=Node.prototype.addEventListener;"click"===e?i.call(t,e,n.hijacked||(n.hijacked=function(e){e.propagationStopped||n(e)}),r):i.call(t,e,n,r)}),"function"==typeof t.onclick&&(o=t.onclick,t.addEventListener("click",function(e){o(e)},!1),t.onclick=null)}}var n=navigator.userAgent.indexOf("Windows Phone")>=0,r=navigator.userAgent.indexOf("Android")>0&&!n,i=/iP(ad|hone|od)/.test(navigator.userAgent)&&!n,o=i&&/OS 4_\d(_\d)?/.test(navigator.userAgent),a=i&&/OS [6-7]_\d/.test(navigator.userAgent),s=navigator.userAgent.indexOf("BB10")>0;e.prototype.needsClick=function(e){switch(e.nodeName.toLowerCase()){case"button":case"select":case"textarea":if(e.disabled)return!0;break;case"input":if(i&&"file"===e.type||e.disabled)return!0;break;case"label":case"iframe":case"video":return!0}return/\bneedsclick\b/.test(e.className)},e.prototype.needsFocus=function(e){switch(e.nodeName.toLowerCase()){case"textarea":return!0;case"select":return!r;case"input":switch(e.type){case"button":case"checkbox":case"file":case"image":case"radio":case"submit":return!1}return!e.disabled&&!e.readOnly;default:return/\bneedsfocus\b/.test(e.className)}},e.prototype.sendClick=function(e,t){var n,r;document.activeElement&&document.activeElement!==e&&document.activeElement.blur(),r=t.changedTouches[0],n=document.createEvent("MouseEvents"),n.initMouseEvent(this.determineEventType(e),!0,!0,window,1,r.screenX,r.screenY,r.clientX,r.clientY,!1,!1,!1,!1,0,null),n.forwardedTouchEvent=!0,e.dispatchEvent(n)},e.prototype.determineEventType=function(e){return r&&"select"===e.tagName.toLowerCase()?"mousedown":"click"},e.prototype.focus=function(e){var t;i&&e.setSelectionRange&&0!==e.type.indexOf("date")&&"time"!==e.type&&"month"!==e.type?(t=e.value.length,e.setSelectionRange(t,t)):e.focus()},e.prototype.updateScrollParent=function(e){var t,n;if(t=e.fastClickScrollParent,!t||!t.contains(e)){n=e;do{if(n.scrollHeight>n.offsetHeight){t=n,e.fastClickScrollParent=n;break}n=n.parentElement}while(n)}t&&(t.fastClickLastScrollTop=t.scrollTop)},e.prototype.getTargetElementFromEventTarget=function(e){return e.nodeType===Node.TEXT_NODE?e.parentNode:e},e.prototype.onTouchStart=function(e){var t,n,r;if(e.targetTouches.length>1)return!0;if(t=this.getTargetElementFromEventTarget(e.target),n=e.targetTouches[0],i){if(r=window.getSelection(),r.rangeCount&&!r.isCollapsed)return!0;if(!o){if(n.identifier&&n.identifier===this.lastTouchIdentifier)return e.preventDefault(),!1;this.lastTouchIdentifier=n.identifier,this.updateScrollParent(t)}}return this.trackingClick=!0,this.trackingClickStart=e.timeStamp,this.targetElement=t,this.touchStartX=n.pageX,this.touchStartY=n.pageY,e.timeStamp-this.lastClickTime<this.tapDelay&&e.preventDefault(),!0},e.prototype.touchHasMoved=function(e){var t=e.changedTouches[0],n=this.touchBoundary;return Math.abs(t.pageX-this.touchStartX)>n||Math.abs(t.pageY-this.touchStartY)>n?!0:!1},e.prototype.onTouchMove=function(e){return this.trackingClick?((this.targetElement!==this.getTargetElementFromEventTarget(e.target)||this.touchHasMoved(e))&&(this.trackingClick=!1,this.targetElement=null),!0):!0},e.prototype.findControl=function(e){return void 0!==e.control?e.control:e.htmlFor?document.getElementById(e.htmlFor):e.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")},e.prototype.onTouchEnd=function(e){var t,n,s,c,u,l=this.targetElement;if(!this.trackingClick)return!0;if(e.timeStamp-this.lastClickTime<this.tapDelay)return this.cancelNextClick=!0,!0;if(e.timeStamp-this.trackingClickStart>this.tapTimeout)return!0;if(this.cancelNextClick=!1,this.lastClickTime=e.timeStamp,n=this.trackingClickStart,this.trackingClick=!1,this.trackingClickStart=0,a&&(u=e.changedTouches[0],l=document.elementFromPoint(u.pageX-window.pageXOffset,u.pageY-window.pageYOffset)||l,l.fastClickScrollParent=this.targetElement.fastClickScrollParent),s=l.tagName.toLowerCase(),"label"===s){if(t=this.findControl(l)){if(this.focus(l),r)return!1;l=t}}else if(this.needsFocus(l))return e.timeStamp-n>100||i&&window.top!==window&&"input"===s?(this.targetElement=null,!1):(this.focus(l),this.sendClick(l,e),i&&"select"===s||(this.targetElement=null,e.preventDefault()),!1);return i&&!o&&(c=l.fastClickScrollParent,c&&c.fastClickLastScrollTop!==c.scrollTop)?!0:(this.needsClick(l)||(e.preventDefault(),this.sendClick(l,e)),!1)},e.prototype.onTouchCancel=function(){this.trackingClick=!1,this.targetElement=null},e.prototype.onMouse=function(e){return this.targetElement?e.forwardedTouchEvent?!0:e.cancelable&&(!this.needsClick(this.targetElement)||this.cancelNextClick)?(e.stopImmediatePropagation?e.stopImmediatePropagation():e.propagationStopped=!0,e.stopPropagation(),e.preventDefault(),!1):!0:!0},e.prototype.onClick=function(e){var t;return this.trackingClick?(this.targetElement=null,this.trackingClick=!1,!0):"submit"===e.target.type&&0===e.detail?!0:(t=this.onMouse(e),t||(this.targetElement=null),t)},e.prototype.destroy=function(){var e=this.layer;r&&(e.removeEventListener("mouseover",this.onMouse,!0),e.removeEventListener("mousedown",this.onMouse,!0),e.removeEventListener("mouseup",this.onMouse,!0)),e.removeEventListener("click",this.onClick,!0),e.removeEventListener("touchstart",this.onTouchStart,!1),e.removeEventListener("touchmove",this.onTouchMove,!1),e.removeEventListener("touchend",this.onTouchEnd,!1),e.removeEventListener("touchcancel",this.onTouchCancel,!1)},e.notNeeded=function(e){var t,n,i,o;if("undefined"==typeof window.ontouchstart)return!0;if(n=+(/Chrome\/([0-9]+)/.exec(navigator.userAgent)||[,0])[1]){if(!r)return!0;if(t=document.querySelector("meta[name=viewport]")){if(-1!==t.content.indexOf("user-scalable=no"))return!0;if(n>31&&document.documentElement.scrollWidth<=window.outerWidth)return!0}}if(s&&(i=navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/),i[1]>=10&&i[2]>=3&&(t=document.querySelector("meta[name=viewport]")))){if(-1!==t.content.indexOf("user-scalable=no"))return!0;if(document.documentElement.scrollWidth<=window.outerWidth)return!0}return"none"===e.style.msTouchAction||"manipulation"===e.style.touchAction?!0:(o=+(/Firefox\/([0-9]+)/.exec(navigator.userAgent)||[,0])[1],o>=27&&(t=document.querySelector("meta[name=viewport]"),t&&(-1!==t.content.indexOf("user-scalable=no")||document.documentElement.scrollWidth<=window.outerWidth))?!0:"none"===e.style.touchAction||"manipulation"===e.style.touchAction?!0:!1)},e.attach=function(t,n){return new e(t,n)},"function"==typeof define&&"object"==typeof define.amd&&define.amd?define(function(){return e}):"undefined"!=typeof t&&t.exports?(t.exports=e.attach,t.exports.FastClick=e):window.FastClick=e}()},{}],2:[function(e){window.Origami={fastclick:e("./bower_components/fastclick/lib/fastclick.js")}},{"./bower_components/fastclick/lib/fastclick.js":1}]},{},[2]);;(function() {function trigger(){document.dispatchEvent(new CustomEvent('o.load'))};document.addEventListener('load',trigger);if (document.readyState==='ready') trigger();}());(function() {function trigger(){document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'))};document.addEventListener('DOMContentLoaded',trigger);if (document.readyState==='interactive') trigger();}());

/* inspired by https://gist.github.com/1129031 */
/*global document, DOMParser*/

(function(DOMParser) {
	"use strict";

	var
		proto = DOMParser.prototype
	, nativeParse = proto.parseFromString
	;

	// Firefox/Opera/IE throw errors on unsupported types
	try {
		// WebKit returns null on unsupported types
		if ((new DOMParser()).parseFromString("", "text/html")) {
			// text/html parsing is natively supported
			return;
		}
	} catch (ex) {}

	proto.parseFromString = function(markup, type) {
		if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
			var
				 doc = document.implementation.createHTMLDocument("")
			;
			 		if (markup.toLowerCase().indexOf('<!doctype') > -1) {
					doc.documentElement.innerHTML = markup;
					}
					else {
					doc.body.innerHTML = markup;
					}
			return doc;
		} else {
			return nativeParse.apply(this, arguments);
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
}

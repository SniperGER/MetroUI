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
		
		app.notificationTimeouts = [];
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
			notification.addEventListener(app.touchEventStart, function() {
				this.style.webkitTransform = "rotateY(-7deg)";
			});
			notification.addEventListener("mouseover", function() {
				clearTimeout(app.notificationTimeouts[this.id]);
				app.notificationTimeouts[this.id] = undefined;
				this.classList.remove("slide-in");
				this.classList.remove("fade-out");
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
			notificationTitle.innerHTML = ((typeof(title)!=="undefined"))?title:app.params.modalDefaultTitle;
			notification.appendChild(notificationTitle);

			var notificationContent = document.createElement("div");
			notificationContent.className = "content";
			var notificationContentText = document.createElement("p");
			notificationContentText.innerHTML = ((typeof(message)!=="undefined"))?message:"No content";
			notificationContent.appendChild(notificationContentText);
			notification.appendChild(notificationContent);
			notificationWrapper.appendChild(notification);

			document.getElementsByClassName("notification-center")[0].appendChild(notificationWrapper);
			
			setTimeout(function() {
				var el = document.querySelector("div.notification-center div.notification-wrapper:last-child div.content");
				var elNot = document.querySelector("div.notification-center div.notification-wrapper:last-child div.notification");
				var ellipsis = new Ellipsis(el);
				
				ellipsis.calc();
				ellipsis.set();
				
				elNot.id = app.notificationTimeouts.length;
				app.notificationTimeouts.push(setTimeout(function() {
					elNot.classList.add("fade-out");
					setTimeout(function() {
						elNot.parentNode.parentNode.removeChild(elNot.parentNode);
					}, 3000);
				}, 5000));
			}, 10);
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
			alertTitle.innerHTML = ((typeof(title)!=="undefined"))?title:"Untitled";
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
				setTimeout(app.hidePreloader, duration*1000+500);
			}
		};
		app.hidePreloader = function() {
			var el = document.querySelector("div.alert img");
			el.parentNode.removeChild(el);
			
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

					if (els.indexOf(document.querySelector("div.application-bar")) != -1) {
						document.getElementById(milliseconds).style.position = "fixed";
						document.getElementById(milliseconds).style.zIndex = 2100;
					}

					if (positionV == "bottom") {
						document.getElementById(milliseconds).classList.add("slide-from-bottom");
						document.getElementById(milliseconds).style.top = (cumulativeOffset(parameters.target).top - document.getElementById(milliseconds).offsetHeight - 5);
					} else {
						document.getElementById(milliseconds).classList.add("slide-from-top");
						document.getElementById(milliseconds).style.top = (cumulativeOffset(parameters.target).top + parameters.target.offsetHeight + 5);
					}
					
					if (positionH == "left") {
						document.getElementById(milliseconds).style.left = cumulativeOffset(parameters.target).left;
					} else {
						document.getElementById(milliseconds).style.left = (cumulativeOffset(parameters.target).left - document.getElementById(milliseconds).offsetWidth + parameters.target.offsetWidth);
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
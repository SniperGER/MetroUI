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
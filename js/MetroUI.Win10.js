MetroUI.prototype.plugins.Win10 = function(app) {
	app.params.availableThemesWin10 = [];
	for (var i=1; i<=48; i++) {
		app.params.availableThemesWin10.push("win10-"+((i<10)?"0"+i:i));
	}
	app.design.init = function() {
		if ($("div.theme-selector")) {
			if ($("div.theme-row")) {
				while ($("div.theme-row")) {
					$("div.theme-row").remove();
				}
			}
			var colors = app.params.availableThemesWin10.slice();
			var colorGroups = [];

			while (colors.length > 0) {
				colorGroups.push(colors.splice(0, 6));
			}
			
			for (var i=0; i<colorGroups.length; i++) {
				var themeContainer = document.createElement("div");
				themeContainer.className = "theme-row";
				
				for (var j=0; j<colorGroups[i].length; j++) {
					var themeTile = document.createElement("div");
					themeTile.className = "theme-tile";
					themeTile.setAttribute("data-tint-win10", colorGroups[i][j]);
					themeTile.addEventListener("click", function() {
						document.body.setAttribute("data-tint-win10", this.getAttribute("data-tint-win10"));
					})
					
					themeContainer.appendChild(themeTile);
				}
				$("div.theme-selector").appendChild(themeContainer);
			}
		}
	}

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
								}

								el.children[1].style.top = "-"+((indexInParent(el.querySelector("li.checked"))*40)+6)+"px";
								if ($("div.navbar:not(.hidden)") && cumulativeOffset(el.children[1]).top < 58) {
									el.children[1].style.top = "-"+((indexInParent(el.querySelector("li.checked"))*40)+6-(58-cumulativeOffset(el.children[1]).top))+"px";
								}

								var index = indexInParent(el.querySelector("li.checked"));
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

							lists[i].children[1].style.top = "-"+(index*40)+"px";

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
			}
		};

	
	app.tiles.sizes = {
		width: (window.innerWidth-8),
		height: 156,

		small: {w: 77, h: 77},
		normal: {w: 155, h: 156},
		wide: {w: 312, h: 156},
		large: {w: 312, h: 312},
		
		tileSpace: 2
	};
	app.tileSizes = {
		width: (window.innerWidth-8),
		height: 156,
		
		small: [[77,77],[50,50]],
		normal: [[155,156],[103,103]],
		wide: [[312,156],[]],
		large: [[312,312],[]],

		tileSpace: 2
	};
	
	app.animation.menuRotateIn = function(menuPage, reverse) {
		var menu = $("div.menu[data-menu=\""+menuPage+"\"]");
		menu.classList.remove("slide-in");
				
		if (menu.classList.contains("tiles")) {
			app.animation.tileRotateIn(menuPage, reverse);
		} else {
			if (menu) {
				var els = [];
				for (var i=0;i<menu.querySelectorAll("div.link p.label").length;i++) {
					var min = (cumulativeOffset(menu.querySelectorAll("div.link p.label")[i]).top + menu.querySelectorAll("div.link p.label")[i].offsetHeight) - menu.parentNode.scrollTop + 58;
					var max = cumulativeOffset(menu.querySelectorAll("div.link p.label")[i]).top - menu.parentNode.scrollTop;
					
					if (min >= 58 && max < window.innerHeight) {
						els.push(menu.querySelectorAll("div.link p.label")[i]);
					} else {
						menu.querySelectorAll("div.link p.label")[i].style.opacity = 1;
					}
					app.animation.animationDuration = (els.length*25)+800;
				}
				if (reverse) {
					els.reverse();
				}
				
				for (var j=0;j<els.length;j++) {
					var delay = (j+1)*25;

					new Velocity(els[j], {
						translateY: [0, 30],
						opacity: [1,0],
					}, {
						duration: 500,
						easing: [0.1, 0.9, 0.2, 1],
						delay: 0
					});
				}
				setTimeout(function() {
					menu.classList.add("slide-in");
				}, app.animation.animationDuration-700);
			}
		}
	}
	app.animation.menuRotateOut = function(menuPage, element, reverse) {
		var menu = $("div.menu[data-menu=\""+menuPage+"\"]");
		
		if (menu.classList.contains("tiles")) {
			app.animation.tileRotateOut(menuPage, element, reverse);
		} else {
			if (menu) {
				var els = [];
				for (var i=0;i<menu.querySelectorAll("div.link p.label").length;i++) {
					var min = (cumulativeOffset(menu.querySelectorAll("div.link p.label")[i]).top + menu.querySelectorAll("div.link p.label")[i].offsetHeight) - menu.parentNode.scrollTop + 58;
					var max = cumulativeOffset(menu.querySelectorAll("div.link p.label")[i]).top - menu.parentNode.scrollTop;
					
					if (min >= 58 && max < window.innerHeight) {
						els.push(menu.querySelectorAll("div.link p.label")[i]);
					} else {
						menu.querySelectorAll("div.link p.label")[i].style.opacity = 0;
					}
					app.animation.animationDuration = (els.length*25)+ ((!reverse) ? 800 : 350);
				}
				if (reverse) {
					els.reverse();
				}
				
				for (var j=0;j<els.length;j++) {
					var delay = (j+1)*25;
					var el = els[j].parentNode;

					if (el == element) {
						delay = (menu.querySelectorAll("div.link").length*25)+300;
					}

					new Velocity(els[j], {
						opacity: [0,0]
					}, {
						duration: (!reverse) ? 500 : 150,
						easing: [0.895, 0.03, 0.685, 0.22],
						delay: 100
					});
				}

				menu.classList.remove("slide-in");
			}
		}
	}

	app.animation.tileRotateIn = function(menuPage, reverse) {
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
				}
				app.animation.animationDuration = (els.length*25)+800;
			}
			els.reverse();
			
			new Velocity(menu.querySelector("header h1"), {
				rotateY: (!reverse) ? [0, 90] : [[0], -80],
				translateX: (!reverse) ? [0, 50] : [[0], -50],
				translateZ: (!reverse) ? [0, 50] : [[0], 50],
				opacity: [1,1],
			}, {
				duration: 250,
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
					duration: 350,
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
	}
	app.animation.tileRotateOut = function(menuPage, element, reverse) {
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
				app.animation.animationDuration = (els.length*50)+ ((!reverse) ? 500 : 350);
			}

			els.reverse();
			
			new Velocity(menu.querySelector("header h1"), {
				rotateY: (!reverse) ? [-90, 0] : [90, 0],
				translateX: (!reverse) ? [-50, 0] : [50, 0],
				translateZ: (!reverse) ? [50, 0] : [50, 0],
				opacity: (!reverse) ? [1,1] : [0, "easeInExpo", 1],
			}, {
				duration: (!reverse) ? 350 : 150,
				easing: [0.895, 0.03, 0.685, 0.22],
				delay: (!reverse) ? 0 : els.length*25
			});
			for (var j=0;j<els.length;j++) {
				var delay = (j+1)*50;

				els[j].style.webkitTransformOrigin = "-" + cumulativeOffset(els[j]).left + "px 0px";

				new Velocity(els[j], {
					rotateY: (!reverse) ? [-90, 0] : [90, 0],
					translateX: (!reverse) ? [-50, 0] : [50, 0],
					translateZ: (!reverse) ? [50, 0] : [50, 0],
					opacity: (!reverse) ? [1,1] : [0, "easeInExpo", 1],
				}, {
					duration: (!reverse) ? 350 : 150,
					easing: [0.895, 0.03, 0.685, 0.22],
					delay: delay
				});
			}
		}
	}

	app.animation.pageRotateIn = function(pageName) {
		var page = $("div.page[data-page=\""+pageName+"\"]");
		page.parentNode.style.webkitPerspectiveOriginY = window.innerHeight/2+"px";
		scrollTo($("div.pages"),0,0);
		if (page) {
			page.classList.remove("slide-out");
			page.classList.remove("slide-in-back");
			page.classList.remove("slide-out-back");
			page.classList.add("slide-in");
		}
	}
	app.animation.pageRotateOut = function(pageName) {
		var page = $("div.page[data-page=\""+pageName+"\"]");
		page.parentNode.style.webkitPerspectiveOriginY = window.innerHeight/2+"px";
		
		if (page) {
			page.classList.remove("slide-in");
			page.classList.remove("slide-in-back");
			page.classList.remove("slide-out-back");
			page.classList.add("slide-out");
			
			setTimeout(function() {
				page.classList.remove("slide-out");
			}, 500);
		}
	}
	app.animation.pageRotateInBack = function(pageName) {
		var page = $("div.page[data-page=\""+pageName+"\"]");
		page.parentNode.style.webkitPerspectiveOriginY = window.innerHeight/2+"px";
		
		if (page) {
			page.classList.remove("slide-in");
			page.classList.remove("slide-out");
			page.classList.remove("slide-out-back");
			page.classList.add("slide-in-back");
		}
	}
	app.animation.pageRotateOutBack = function(pageName) {
		var page = $("div.page[data-page=\""+pageName+"\"]");
		page.parentNode.style.webkitPerspectiveOriginY = window.innerHeight/2+"px";
		
		if (page) {
			page.classList.remove("slide-in");
			page.classList.remove("slide-out");
			page.classList.remove("slide-in-back");
			page.classList.add("slide-out-back");

			setTimeout(function() {
				page.classList.remove("slide-out-back");
			}, 500);
		}
	}
	
	app.navigation.win10delay = 0;

}
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
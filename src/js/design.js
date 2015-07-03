		app.design = {
			init: function() {
				if ($("div.theme-color")) {
					$("div.theme-selector").innerHTML = "";
				}
				if ($("div.theme-selector")) {
					var colors = ((window.isPhone)) ? app.params.availableThemesPhone : app.params.availableThemesWin;

					if (window.isPhone) {
						var colorWrapper = document.createElement("div");
						colorWrapper.className = "theme-selector-wrapper";
					} else {
						var indicator = document.createElement("div");
						indicator.className = "indicator";
						$("div.theme-selector").appendChild(indicator);
					}

					for (var i=0; i<colors.length; i++) {
						var color = document.createElement("div");
						color.className = "theme-color";

						if (window.isPhone) {
							color.setAttribute("data-tint-wp", app.params.availableThemesPhone[i]);
							color.innerHTML = app.params.availableThemesPhone[i].replace(/^[a-z]/, function(m){ return m.toUpperCase(); }).replace(/Lumia-green/g, "Lumia Green").replace(/Lumia-purple/g, "Lumia Purple");
							$("div.theme-selector").appendChild(color);
						} else {
							color.setAttribute("data-tint-win", app.params.availableThemesWin[i]);
							$("div.theme-selector").appendChild(color);
						}
					}
				}
				var currentThemeWin = document.body.getAttribute("data-tint-win");
				var index = app.params.availableThemesWin.indexOf(currentThemeWin);

				if ($("div.theme-selector") && !window.isPhone) {
					$("div.theme-selector").querySelector("div.indicator").style.left = (index*30)+"px";

					var colorElements = $("div.theme-selector").querySelectorAll("div.theme-color");
					for (var i=0; i<colorElements.length;i++) {
						colorElements[i].addEventListener("click", function() {
							document.body.setAttribute("data-tint-win", this.getAttribute("data-tint-win"));
							var currentThemeWin = document.body.getAttribute("data-tint-win");
							var index = app.params.availableThemesWin.indexOf(currentThemeWin);
							$("div.theme-selector").querySelector("div.indicator").style.left = (index*30)+"px";
						});
					}
				} else if ($("div.theme-selector")) {
					$("div.theme-selector").addEventListener("click", function() {
						app.design.call();
					});
				}
			},
			initTheme: function() {
				if ($("div.list.theme")) {
					if (window.isPhone) {
						$("div.list.theme select option:checked").removeAttribute("selected");
						$("div.list.theme select option[value=\""+document.body.getAttribute("data-bg-wp")+"\"]").setAttribute("selected", "");
					} else {
						$("div.list.theme select option:checked").removeAttribute("selected");
						$("div.list.theme select option[value=\""+document.body.getAttribute("data-bg")+"\"]").setAttribute("selected", "");
					}

					if ($("div.list.theme div.select-inner-wrapper")) {
						var el = $("div.list.theme div.select-inner-wrapper");
						el.parentNode.removeChild(el);
					}
				}
				if ($("div.radio#theme_light")) {
					if (document.body.getAttribute((window.innerWidth<=504?"data-bg-wp":"data-bg")) == "light") {
						$("div.radio#theme_light input[type=\"radio\"]").setAttribute("checked", true);
						if ($("div.radio#theme_dark")) {
							$("div.radio#theme_dark input[type=\"radio\"]").removeAttribute("checked");
						}
					}
				}
				if ($("div.radio#theme_dark")) {
					if (document.body.getAttribute((window.innerWidth<=504?"data-bg-wp":"data-bg")) == "dark") {
						$("div.radio#theme_dark input[type=\"radio\"]").setAttribute("checked", true);
						if ($("div.radio#theme_light")) {
							$("div.radio#theme_light input[type=\"radio\"]").removeAttribute("checked");
						}
					}
				}
				if ($("div.switch.more-tiles")) {
					if (document.body.classList.contains("more-tiles")) {
						$("div.switch.more-tiles input[type=\"checkbox\"]").setAttribute("checked", true);
					} else {
						$("div.switch.more-tiles input[type=\"checkbox\"]").removeAttribute("checked");
					}
				}
			},
			changeTheme: function(element) {
				if (!document.body.classList.contains("colored") && app.params.theming) {
					setTimeout(function() {
						if (window.innerWidth > 504) {
							document.body.setAttribute('data-bg', element.options[element.selectedIndex].value);
						} else {
							document.body.setAttribute('data-bg-wp', element.options[element.selectedIndex].value);
						}
					}, 200);
				}
			},
			changeThemeByValue: function(value) {
				if (!document.body.classList.contains("colored") && app.params.theming) {
					if (window.innerWidth > 504) {
						document.body.setAttribute('data-bg', value);
					} else {
						document.body.setAttribute('data-bg-wp', value);
					}
				}
			},
			coloredPages: function(element) {
				if (app.params.theming && !window.isPhone) {
					if (element.checked) {
						document.body.classList.add("colored");
						app.previousTheme = document.body.getAttribute("data-bg");
					} else {
						document.body.classList.remove("colored");
						document.body.setAttribute("data-bg", app.previousTheme);
					}
					if (document.body.classList.contains("colored")) {
						document.body.setAttribute("data-bg", "dark");

						for (var i=0; i<$$("div.list.theme").length; i++) {
							$$("div.list.theme")[i].classList.add("disabled");
						}
					} else {
						for (var j=0; j<$$("div.list.theme").length; j++) {
							$$("div.list.theme")[j].classList.remove("disabled");
						}
					}
				}
			},
			call: function() {
				var colorWrapper = document.createElement("div");
				colorWrapper.className = "theme-overlay";
				for (var i=0; i<Math.ceil(app.params.availableThemesPhone.length/4); i++) {
					var colorContainer = document.createElement("div");
					colorContainer.className = "theme-color-wrapper";

					for (var j=1; j<=app.params.availableThemesPhone.length/5; j++) {
						if (typeof(app.params.availableThemesPhone[j+(4*i)-1]) !== "undefined") {
							var color = document.createElement("div");
							color.className = "theme-color";
							color.setAttribute("data-tint-wp", app.params.availableThemesPhone[j+(4*i)-1]);
							color.addEventListener("click", function() {
								var el = this;
								document.body.setAttribute("data-tint-wp", el.getAttribute("data-tint-wp"));

								if (document.getElementById("current-theme")) {
									document.getElementById("current-theme").innerHTML = el.getAttribute("data-tint-wp").replace(/lumia-green/g, "Lumia Green").replace(/lumia-purple/g, "Lumia Purple");
								}
								app.design.hide();
							});
							colorContainer.appendChild(color);
						}
					}
					colorWrapper.appendChild(colorContainer);
				}
				setTimeout(function() {
					for (var i=1; i<=app.params.availableThemesPhone.length; i++) {
						new Velocity($$("div.theme-overlay div.theme-color")[i-1], {
							rotateX:["0deg","90deg"],
							opacity: [[1],1000]
						}, {
							duration: 75,
							easing: "ease-in",
							delay: Math.ceil(i/4)*25
						});
					}
				}, 20);
				document.body.appendChild(colorWrapper);
			},
			hide: function() {
				for (var i=0; i<$$("div.theme-overlay div.theme-color").length; i++) {
					$$("div.theme-overlay div.theme-color")[i].classList.add("slide-out");
				}
				for (var i=1; i<=app.params.availableThemesPhone.length; i++) {
					new Velocity($$("div.theme-overlay div.theme-color")[i-1], {
						rotateX:["-90deg","0deg"],
						opacity: [[1],1000]
					}, {
						duration: 75,
						easing: "ease-out",
						delay: Math.ceil(i/4)*25
					});
				}
				setTimeout(function() {
					if ($("div.theme-overlay")) {
						document.body.removeChild($("div.theme-overlay"));
					}
				}, (Math.ceil(app.params.availableThemesPhone.length/4)*25)+75);
			}
		};
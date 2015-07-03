		app.context = function(parameters) {
			if ($$("div.popover").length < 1) {
				setTimeout(function() {
					var milliseconds = (new Date()).getTime();
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

					var buttonContainer = document.createElement("div");
					buttonContainer.className = "buttons";
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
									$$("div.popover")[0].classList.add("fade-out");
										setTimeout(function() {
										var el = $$("div.popover")[0];
										el.parentNode.removeChild(el);
									}, 100);
									app.contextOpen = false;
								};

								link.appendChild(button);
								buttonContainer.appendChild(link);
							}
							if (parameters.buttons[i].type == "separator") {
								var separator = document.createElement("div");
								separator.className = "seperator";
								buttonContainer.appendChild(separator);
							}
						}
					}

					popover.appendChild(buttonContainer);
					if (window.isPhone) {
						if ($$("div.notification-center").length < 1) {
							var notificationCenter = document.createElement("div");
							notificationCenter.className = "notification-center";
							document.body.appendChild(notificationCenter);
						}

						var notificationBG = document.createElement("div");
						notificationBG.className = "notification-background";

						$("div.notification-center").appendChild(notificationBG);
						$("div.notification-center").appendChild(popover);

						$("div.notification-background").addEventListener("mousewheel", function(e) {
							e.preventDefault();
							e.stopPropagation();
						});
					} else {
						$("body").appendChild(popover);
					}
					app.contextOpen = true;

					if (els.indexOf($("div.application-bar")) != -1) {
						document.getElementById(milliseconds).style.position = "fixed";
						document.getElementById(milliseconds).style.zIndex = 2100;
					}

					if (!window.isPhone) {
						if (positionV == "bottom") {
							document.getElementById(milliseconds).classList.add("slide-from-bottom");
							document.getElementById(milliseconds).style.top = (cumulativeOffset(parameters.target).top - document.getElementById(milliseconds).offsetHeight - 5) + "px";
						} else {
							document.getElementById(milliseconds).classList.add("slide-from-top");
							document.getElementById(milliseconds).style.top = (cumulativeOffset(parameters.target).top + parameters.target.offsetHeight + 5) + "px";
						}

						if (positionH == "left") {
							document.getElementById(milliseconds).style.left = cumulativeOffset(parameters.target).left + "px";
						} else {
							document.getElementById(milliseconds).style.left = (cumulativeOffset(parameters.target).left - document.getElementById(milliseconds).offsetWidth + parameters.target.offsetWidth) + "px";
						}
					} else {
						document.getElementById(milliseconds).style.top = window.innerHeight/2 - document.getElementById(milliseconds).offsetHeight/2 +"px";
						new Velocity(document.getElementById(milliseconds), { height:[document.getElementById(milliseconds).offsetHeight,0] },{easing: [0.77, 0, 0.175, 1]});
					}
				}, 50);
			}
		};

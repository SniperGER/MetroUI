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

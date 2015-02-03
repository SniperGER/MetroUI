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

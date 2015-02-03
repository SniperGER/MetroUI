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
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
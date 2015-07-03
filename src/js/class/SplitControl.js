(function() {
	"use strict";
	MetroUI.SplitControl = function(page, params) {
		var tab = {};

		tab.params = {
			app: undefined,
			splitView: true,
			autoSplitViewModern: true,
			autoPivotPhone: true,
		};
		for (var param in params) {
			tab.params[param] = params[param];
		}

		tab.init = function() {
			if (tab.params.splitView) {
				tab.params.app.animation.pageSlideIn(page,true,true);
				if ($("div.navbar header[data-page=\""+page+"\"] div.split-control")) {
					$("div.navbar header[data-page=\""+page+"\"] div.split-control").onclick = function() {
						if ($("div.page[data-page=\""+page+"\"] div.tab-control")) {
							$("div.page[data-page=\""+page+"\"] div.tab-control").classList.toggle("extended");
						}
					}
				}

				if ($("div.page[data-page=\""+page+"\"] div.tab")) {
					$("div.page[data-page=\""+page+"\"] div.tab").classList.add("tab-active");
					$("div.page[data-page=\""+page+"\"] div.tab-control div.tab-link").classList.add("tab-active");
				}

				if ($("div.page[data-page=\""+page+"\"] div.tab-control")) {
					if ($("div.page[data-page=\""+page+"\"] div.tab-control div.tab-link")) {
						for (var i=0; i<$$("div.page[data-page=\""+page+"\"] div.tab-control div.tab-link").length; i++) {
							$$("div.page[data-page=\""+page+"\"] div.tab-control div.tab-link")[i].onclick = function() {
								var el = this;
								if ($("div.page[data-page=\""+page+"\"] div.tab.tab-active:not(#"+el.getAttribute("data-tab")+")")) {
									while ($("div.page[data-page=\""+page+"\"] div.tab.tab-active:not(#"+el.getAttribute("data-tab")+")")) {
										$("div.page[data-page=\""+page+"\"] div.tab.tab-active:not(#"+el.getAttribute("data-tab")+")").classList.remove("tab-active");
									}
								}
								if ($("div.page[data-page=\""+page+"\"] div.tab-control div.tab-active:not(#"+el.getAttribute("data-tab")+")")) {
									while ($("div.page[data-page=\""+page+"\"] div.tab-control div.tab-active:not(#"+el.getAttribute("data-tab")+")")) {
										$("div.page[data-page=\""+page+"\"] div.tab-control div.tab-active:not(#"+el.getAttribute("data-tab")+")").classList.remove("tab-active");
									}
								}
								el.classList.add("tab-active")

								if ($("div.page[data-page=\""+page+"\"] div.tab#"+el.getAttribute("data-tab"))) {
									if (!$("div[data-page=\""+page+"\"] div.tab#"+el.getAttribute("data-tab")).classList.contains("tab-active")) {
										$("div.page[data-page=\""+page+"\"] div.tab#"+el.getAttribute("data-tab")).classList.add("tab-active");
										$("div.page[data-page=\""+page+"\"]").classList.remove("slide-in");
										if ($("div.page[data-page=\""+page+"\"] div.tab-control").classList.contains("extended")) {
											$("div.page[data-page=\""+page+"\"] div.tab-control").classList.remove("extended");
											tab.params.app.animation.pageSlideIn(page, true, true);
										} else {
											tab.params.app.animation.pageSlideIn(page, false, true);
										}
									} else {
										$("div.page[data-page=\""+page+"\"] div.tab-control").classList.remove("extended");
									}
								}
							}
						}
					}
				}
			} 
		};

		tab.init();
		return tab;
	};
})();
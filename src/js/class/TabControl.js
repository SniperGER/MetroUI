(function() {
	"use strict";
	MetroUI.TabControl = function(page, params) {
		var tab = {};

		tab.params = {
			app: undefined,
			splitView: false,
			autoSplitViewModern: true,
			autoPivotPhone: true,
		};
		for (var param in params) {
			tab.params[param] = params[param];
		}

		tab.init = function() {
			if (!tab.params.splitView) {
				if ($("div.page[data-page=\""+page+"\"] div.tab")) {
					$("div.page[data-page=\""+page+"\"] div.tab").classList.add("tab-active");
					$("div.navbar header[data-page=\""+page+"\"] div.tab-control h1").classList.add("tab-active");
				}

				if ($("div.navbar header[data-page=\""+page+"\"] div.tab-control")) {
					_$("div.navbar").addClass("tab-controls");
					_$("div.navbar header[data-page=\""+page+"\"]").addClass("slide-in");

					for (var i=0; i<$$("div.navbar header[data-page=\""+page+"\"] div.tab-control h1").length; i++) {
						$$("div.navbar header[data-page=\""+page+"\"] div.tab-control h1")[i].onclick = function() {
							var el = this;
							var gotoTab = el.getAttribute("data-tab");

							if ($("div.page[data-page=\""+page+"\"] div.tab.tab-active:not(#"+gotoTab+")")) {
								while ($("div.page[data-page=\""+page+"\"] div.tab.tab-active:not(#"+gotoTab+")")) {
									$("div.page[data-page=\""+page+"\"] div.tab.tab-active:not(#"+gotoTab+")").classList.remove("tab-active");
								}
							}

							if ($("div.navbar header[data-page=\""+page+"\"] div.tab-control h1.tab-active:not([data-tab=\""+gotoTab+"\"])")) {
								while ($("div.navbar header[data-page=\""+page+"\"] div.tab-control h1.tab-active:not([data-tab=\""+gotoTab+"\"])")) {
									$("div.navbar header[data-page=\""+page+"\"] div.tab-control h1.tab-active:not([data-tab=\""+gotoTab+"\"])").classList.remove("tab-active");
								}
							}
	
							if ($("div.page[data-page=\""+page+"\"] div.tab#"+gotoTab)) {
								if (!$("div.page[data-page=\""+page+"\"] div.tab#"+gotoTab).classList.contains("tab-active")) {
									$("div.page[data-page=\""+page+"\"] div.tab#"+gotoTab).classList.add("tab-active");
									$("div.navbar header[data-page=\""+page+"\"] div.tab-control h1[data-tab=\""+gotoTab+"\"]").classList.add("tab-active");
									tab.params.app.animation.pageSlideIn(page, false);
								}
							}
						}
					}
				}
			}
		};

		tab.init();
	};
})();
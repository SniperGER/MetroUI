		/* Bars */
		app.openBars = function() {
			app.params.barsOpen = true;
			app.openAppbar();
			app.openNavbar();
		};
		app.closeBars = function() {
			app.params.barsOpen = false;
			app.closeAppbar();
			app.closeNavbar();

			return false;
		};
		app.toggleBars = function() {
			if (!$('div.application-bar').hasClass("extended") && !$('div.navigation-bar').hasClass("extended")) {
				app.openBars();
			} else {
				app.closeBars();
			}

			return false;
		};

		app.openNavbar = function() {
			app.params.barsOpen = true;
			$('.navigation-bar').addClass("extended");
			var currentCategory = $('div.page.current').attr("data-category");
			$('div.navigation-bar .button').removeClass("selected");
			$('div.navigation-bar .button[data-category="'+currentCategory+'"]').addClass("selected");
			
			var scrollValue = ($('div.navigation-bar div.button.selected').index() * 210) + ($('div.navigation-bar div.button.selected').index() * 10) + 20;
			//$('div.navigation-bar').scrollLeft(scrollValue);

			return false;
		};
		app.closeNavbar = function() {
			app.params.barsOpen = false;
			$('.navigation-bar').removeClass("extended");

			return false;
		};
		app.toggleNavbar = function() {
			if (!$('div.navigation-bar').hasClass("extended")) {
				app.openNavbar();
			} else {
				app.closeNavbar();
			}

			return false;
		};

		app.openAppbar = function() {
			app.params.barsOpen = true;
			$('.application-bar').addClass("extended");
			if (window.innerWidth < app.params.windowSizeLimit) {
				if ($('.application-bar').attr("data-maxheight") != undefined) {
					$('.application-bar').css({
						'height': $('.application-bar').height() + parseInt($('.application-bar').attr("data-maxheight"))
					});
				}
			}
			return false;
		};
		app.closeAppbar = function() {
			app.params.barsOpen = false;
			$('.application-bar').removeClass("extended");
			if (window.innerWidth < app.params.windowSizeLimit) {
				$('.application-bar').removeAttr("style");
			}
			return false;
		};
		app.toggleAppbar = function() {
			if (!$('div.application-bar').hasClass("extended")) {
				app.openAppbar();
			} else {
				app.closeAppbar();
			}

			return false;
		};

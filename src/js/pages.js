		/* XHR - Page Loading */
		app.loadPage = function(page, createScroll) {
			if (page != undefined && $('.pages').attr("data-page") != page && $('.page[data-page="'+page+'"]').length > 0) {
				$('.pages').attr("data-page", page);
				$('.page.current').addClass("page-transition-out").removeClass("page-transition-in page-transition-in-done");
				setTimeout(function() {
					$('.pages').removeAttr("style");
					$('.page.current').addClass("page-transition-out-done").removeClass("page-transition-out current");
					$('.page[data-page="'+page+'"]').removeClass("page-transition-out-done").addClass("page-transition-in");
					if (app.params.pageCreateScroll && createScroll) {
						new IScroll('.page[data-page="'+page+'"] .page-content-wrapper', {
							scrollX: app.params.scrollX,
							scrollY: app.params.scrollY,
							mouseWheel: app.params.mouseWheel,
							disableMouse: app.params.disableMouse,
							scrollbars: app.params.scrollbars,
							interactiveScrollbars: app.params.interactiveScrollbars,
							fadeScrollbars: app.params.fadeScrollbars,
							shrinkScrollbars: app.params.shrinkScrollbars,
							eventPassthrough: app.params.eventPassthrough,
						});
					}
					setTimeout(function() {
						$('.page[data-page="'+page+'"]').addClass("page-transition-in-done current").removeClass("page-transition-in");
					}, 750);
				}, 200);
			} else if ($('.page[data-page="'+page+'"]').length < 1) {
				app.alert("An error occured.","The specified page could not be found.");
			} else {
				return false;
			}
		};
		app.loadPageExternal = function(url) {
			if (url != "#") {
				$.ajax({
					url: url,
					type: 'GET',
					success: function(data){
						$('div.page.current').addClass("page-transition-out").removeClass("page-transition-in page-transition-in-done");
						app.history.push(url);
						app.clearTimeouts(app.timeouts);
						setTimeout(function() {
							$('div.page.current').removeClass("current").addClass("page-transition-out-done last");
							$('div.pages').append(data);
							$('div.page').trigger("beforeAnim");
							$('div.pages div.page:last-child').addClass("page-transition-in current navbar-back");
							app.bindLinks();
							$('div.page .navigation-back').on("click", function() {
								app.navigateBack();
							});
							if (app.params.pageCreateScroll) {
								app.createPageScroll();
							}
							app.timeouts.push(setTimeout(function() {
								$('div.pages div.page.page-transition-in-done').removeClass("page-transition-in-done");
								$('div.pages div.page:last-child').removeClass("page-transition-in").addClass("page-transition-in-done");
							}, 750));
						}, 200);
					},
					error: function(data) {
						app.alert("Error","The requested URL could not be loaded:<br><b>"+url+"</b><br><br>Error code: "+data.status);
					}
				});
			}
		};
		app.bindLinks = function() {
			$('a:not(.external)').click(function (event) { 
				event.preventDefault();

				var url = $(this).attr('href');
				var page = $(this).attr('data-page');
				var scroll = $(this).attr('data-scroll') || false;
				if (url != "#") {
					app.loadPageExternal(url);
				} else {
					app.loadPage(page, scroll);
				}
			});
		};
		app.navigateBack = function() {
			$('div.page.current').removeClass("page-transition-in-done").addClass("page-transition-out");

			setTimeout(function() {
				$('div.page.current').remove();
				$('div.page.last:last-child').removeClass("page-transition-out page-transition-out-done").addClass("page-transition-in");
				setTimeout(function() {
					$('div.pages div.page.last:last-child').removeClass("page-transition-in last").addClass("page-transition-in-done current");
				}, 750);
			}, 200);
		};
		app.createPageScroll = function(page) {
			new IScroll(".page:last-child .page-content-wrapper", {
				scrollX: app.params.scrollX,
				scrollY: app.params.scrollY,
				mouseWheel: app.params.mouseWheel,
				disableMouse: app.params.disableMouse,
				scrollbars: app.params.scrollbars,
				interactiveScrollbars: app.params.interactiveScrollbars,
				fadeScrollbars: app.params.fadeScrollbars,
				shrinkScrollbars: app.params.shrinkScrollbars,
				eventPassthrough: app.params.eventPassthrough,
			});
		};

		/* Page Callbacks */
		app.triggerCallback = function(page, callbackType) {};

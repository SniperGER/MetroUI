		/* Modals */
		
		app.modal = function(params) {
			params = params || {};
			params.okTitle = params.okTitle || app.params.modalOkTitle;
			params.cancelTitle = params.cancelTitle || undefined;

			if ($('.alert').length < 1) {
				if ($('body').find("div.notification-center").length < 1) {
					if (params.type != "prompt") {
						$('button, input').blur();
						$('body').append("<div class=\"notification-background slide-in\"></div>");
						$('body').append("<div class=\"notification-center\"><div class=\"alert slide-in\">");
						$('div.alert').append("<div class=\"title\">"+params.title+"</div>");
						$('div.alert').append("<div class=\"content\">"+params.message+"</div>");
						$('div.alert').append("<div class=\"button-container\">");
						
						$.each(params.buttons, function(index, e) {
							var text = params.buttons[index].text;
							$('div.alert div.button-container').append('<button data-type="'+params.buttons[index].type+'">'+params.buttons[index].text+'</button>');
							if (params.buttons[index].color) {
								$('div.alert div.button-container button:last-child').addClass("color");
							}
							if (params.buttons[index].callback && typeof(params.buttons[index].callback) === "function") {
								$('div.alert div.button-container button:last-child').on("click", params.buttons[index].callback);
							}
						});
						setTimeout(function() {
							$('div.alert').removeClass("slide-in");
						}, app.params.notifyAnimTimeout);
	
											
						$('body').append("</div></div></div>");
						
						$('.notification-background, .notification-center, .notification-center *').on("touchstart", function(e) {
							e.preventDefault();
						});
						
						$('.alert').css({
							"height": ($('.alert').height()-27)+$('.alert .title').height() + "px"
						}).css({
							"height": ($('.alert').height()-20)+$('.alert .content').height() + "px"
						})
						
						if (window.innerWidth > app.params.windowSizeLimit) {					
							$('.alert').css({
								"margin-top": "-"+($('.alert').height() / 2)+"px"
							});
						}
						
						$('.alert .content').css({
							"top": 28 + $('.alert .title').height() + 15 + "px"
						});
						
						$('.alert').on("click", function() {
							return false;
						});
						
						$('div.alert button').on("click", function() {
							$('.pages').removeAttr("style");
							$('.alert, .notification-background').removeClass("slide-in").addClass("slide-out");
							setTimeout(function() {
								$('.notification-background, .notification-center').remove();
							}, app.params.notifyAnimTimeout);
						});
					} else {
						$('div.pages').append('<div class="page page-transition-out-done" data-page="prompt" data-page-back="'+$('div.pages').attr("data-page")+'" data-category=""><div class="page-header"><div class="pivot-header">'+params.title+'</div></div><div class="page-content"><div class="page-content-wrapper"><div class="scroll-content">'+params.message+'<div class="buttons-wrapper"></div></div></div></div>');
						$.each(params.buttons, function(index, e) {
							$('div.page[data-page="prompt"] div.buttons-wrapper').append('<button class="no-break">'+params.buttons[index].text+'</button>');
							$('div.page[data-page="prompt"] div.buttons-wrapper button:last-child').on("click", params.buttons[index].callback);
						});
						app.loadPage("prompt");
						$('div.page[data-page="prompt"] button').on("click", function() {
							if (params.loadPrevious || !params.loadPrevious && params.nextPage == undefined) {
								app.loadPage($('div.page[data-page="prompt"]').attr("data-page-back"));
							} else {
								app.loadPage(params.nextPage);
							}
							$('body').removeClass("prompt-open");
							setTimeout(function() {
								$('div.page[data-page="prompt"]').remove();
								$('div.application-bar').removeClass("minimized");
							}, 200);

						});
						$('.application-bar').addClass("minimized");
						setTimeout(function() {
							$('body').addClass("prompt-open");
						}, 200);
					}
				} else { return false; }
			}
		};
		app.notify = function(title, message, icon, callback) {
			if ($('div.notification').length < 1) {
				if (title != undefined && message != undefined) {
					app.params.showsNotification = true;
					if ($('body').children(".notification-center").length < 1) {
						$('body').append("<div class=\"notification-center\">");
					}
					if (icon != undefined) {
						$('div.notification-center').append("<div class=\"notification icon slide-in\">");
					} else {
						$('div.notification-center').append("<div class=\"notification slide-in\">");
					}
					
					$('div.notification').append("<div class=\"icon\"></div>");
					$('div.notification').append("<div class=\"title\">"+title+"</div>");
					$('div.notification').append("<div class=\"content\" id=\"ellipsis\"><p>"+message+"</p></div>");
					
					$('body').append("</div></div>");
					if (window.innerWidth > 596) {
						var element = document.getElementById('ellipsis');
						var ellipsis = new Ellipsis(element);
						
						ellipsis.calc();
						ellipsis.set();
					}
					$('.notification').on("mousedown touchstart", function() {
						app.clearTimeouts(app.timeouts);
						$(this).removeClass("slide-out fade-out");
					});
					$('.notification').on("mouseup touchend", function() {
						$(this).addClass("slide-out");
						setTimeout(function() {
							$('.notification-background').remove();
							if ($('.notification-center').children().length < 2) {
								$('.notification-center').remove();
							}
							if (callback && typeof(callback) === "function") {
								callback();	
							}
							app.params.showsNotification = false;
						}, app.params.notifyAnimTimeout);
					});
					app.timeouts.push(setTimeout(function() {
						$('div.notification').removeClass("slide-in").addClass("fade-out");
						setTimeout(function() {
							$('div.notification-center').remove();
							app.params.showsNotification = false;
						}, app.params.notifyIgnoreAnimTimeout());
					}, app.params.notifyDuration));
				} else { return false; }
			}
		};
		app.alert = function(title, message, okCallback) {
			app.modal({
				title: title,
				message: message,
				buttons: [
					{
						text: app.params.modalOkTitle,
						type: "ok-button",
						color: true,
						callback: okCallback
					}
				]
			});
		};
		app.confirm = function(title, message, okCallback, cancelCallback) {
			app.modal({
				title: title,
				message: message,
				buttons: [
					{
						text: app.params.modalCancelTitle,
						type: "cancel-button",
						color: false,
						callback: cancelCallback
					},
					{
						text: app.params.modalOkTitle,
						type: "ok-button",
						color: true,
						callback: okCallback
					},
				]
			});
		};
		app.prompt = function(title, message, okCallback, cancelCallback) {
			app.modal({
				type: "prompt",
				title: title,
				message: message+'<input id="modal_text" type="text" placeholder="'+app.params.promptPlaceholder+'">' || '<input id="modal_text" type="text" placeholder="'+app.params.promptPlaceholder+'">',
				buttons: [
					{
						text: app.params.modalCancelTitle,
						type: "cancel-button",
						color: false,
						callback: cancelCallback
					},
					{
						text: app.params.modalOkTitle,
						type: "ok-button",
						color: true,
						callback: okCallback
					},
				]
			});
		};
		app.modalLogin = function(options) {
			options = options || {};
			options.message = options.message || "";
			app.modal({
				type: "prompt",
				title: options.title,
				message: options.message+'<input id="modal_user" type="text" placeholder="'+app.params.userPlaceholder+'"><input id="modal_pass" type="password" placeholder="'+app.params.passPlaceholder+'">' || '<input id="modal_user" type="text" placeholder="'+app.params.userPlaceholder+'"><input id="modal_pass" type="password" placeholder="'+app.params.passPlaceholder+'">',
				loadPrevious: options.loadPrevious,
				nextPage: options.nextPage,
				buttons: [
					{
						text: app.params.modalCancelTitle,
						type: "cancel-button",
						color: false,
						callback: options.cancelCallback
					},
					{
						text: app.params.modalOkTitle,
						type: "ok-button",
						color: true,
						callback: options.okCallback
					},
				]
			});
		};
		app.modalPassword = function(title, message, okCallback, cancelCallback) {
			app.modal({
				type: "prompt",
				title: title,
				message: message+'<input id="modal_pass" type="password" placeholder="'+app.params.passPlaceholder+'">' || '<input id="modal_pass" type="password" placeholder="'+app.params.passPlaceholder+'">',
				buttons: [
					{
						text: app.params.modalCancelTitle,
						type: "cancel-button",
						color: false,
						callback: cancelCallback
					},
					{
						text: app.params.modalOkTitle,
						type: "ok-button",
						color: true,
						callback: okCallback
					},
				]
			});
		};
		/* Context Menus */
		app.contextMenu = function(parameters) {
			setTimeout(function() {
				if (window.innerWidth > app.params.windowSizeLimit) {
					if ($('.popover').length < 1 && $(parameters.target).attr("data-child") == undefined) {
						var undefinedParams = {};
						undefinedParams.positionH = (($(parameters.target).offset().left < window.innerWidth/2)) ? "left" : "right";
						undefinedParams.positionV = (($(parameters.target).offset().top < window.innerHeight/2)) ? "top" : "bottom";
					
						var params = parameters || {};
						params.buttons = parameters.buttons || [];
						params.positionH = parameters.positionH || undefinedParams.positionH;
						params.positionV = parameters.positionV || undefinedParams.positionV;
	
						setTimeout(function() {
							app.params.contextOpen = true;
						}, 300);
	
						var milliseconds = (new Date).getTime();
						$('body').append('<div class="popover" data-parent="'+milliseconds+'"></div>');
						$(params.target).attr("data-child",milliseconds);
						if (params.buttons != undefined) {
							for (var i=0; i<params.buttons.length;i++) {
								if (params.buttons[i].href != undefined) {
									$('.popover').append('<a href="'+params.buttons[i].href+'" target="_blank"><div class="'+params.buttons[i].type+'">'+params.buttons[i].text+'</div></a>');
								} else {
									$('.popover').append('<div class="'+params.buttons[i].type+'">'+params.buttons[i].text+'</div>');
								}
								if (params.buttons[i].disabled) {
									$('.popover div:nth-child('+(i+1)+')').addClass("disabled");
								}
								if (params.buttons[i].selected) {
									$('.popover div:nth-child('+(i+1)+')').addClass("selected");
								}
								if (params.buttons[i].onclick && typeof(params.buttons[i].onclick) === "function") {
									$('.popover div:nth-child('+(i+1)+'):not(.disabled)').on("click", params.buttons[i].onclick);
								}
							}
						}
	
						var offsetLeft = $(params.target).offset().left,
							offsetTop = $(params.target).offset().top,
							offsetWidth = $(params.target).outerWidth(),
							offsetHeight = $(params.target).outerHeight(),
							selfWidth = $('.popover').outerWidth(),
							selfHeight = $('.popover').outerHeight(),
							padding = 10;
	
						if (params.positionH == "left") {
							if (params.positionV == "top") {
								$('.popover').addClass("slideFromTop").css({
									left: offsetLeft,
									top: (offsetTop+padding)
								});
							} else if (params.positionV == "bottom") {
								$('.popover').addClass("slideFromBottom").css({
									left: offsetLeft,
									top: (offsetTop-selfHeight-padding)
								});
							}
						} else if (params.positionH == "right") {
							if (params.positionV == "top") {
								$('.popover').addClass("slideFromTop").css({
									left: (offsetLeft-selfWidth)+offsetWidth,
									top: (offsetTop+padding)
								});
							} else if (params.positionV == "bottom") {
								$('.popover').addClass("slideFromBottom").css({
									left: (offsetLeft-selfWidth)+offsetWidth,
									top: (offsetTop-selfHeight-padding)
								});
							}
						} else if (params.positionH == "center") {
							if (params.positionV == "top") {
								$('.popover').addClass("slideFromTop").css({
									left: (offsetLeft + offsetWidth/2) - selfWidth/2,
									top: (offsetTop+padding)
								});
							} else if (params.positionV == "bottom") {
								$('.popover').addClass("slideFromBottom").css({
									left: (offsetLeft + offsetWidth/2) - selfWidth/2,
									top: (offsetTop-selfHeight-padding)
								});
							}
						}
	
						$('.popover .button:not(.disabled)').on("click", function() {
							$('.popover').removeClass("slideFromTop slideFromBottom").addClass("popoverFadeOut");
							setTimeout(function() {
								app.params.contextOpen = false;
								$('.popover').remove();
							}, 200);
						});
					} else if ($('.popover').length > 0 && $(parameters.target).attr("data-child") == $('.popover').attr("data-parent")) {
						$('.popover').removeClass("slideFromTop slideFromBottom").addClass("popoverFadeOut");
						setTimeout(function() {
							app.params.contextOpen = false;
							$('.popover').remove();
							$(parameters.target).removeAttr("data-child");
						}, 200);
					} else if ($('.popover').length > 0 && $(parameters.target).attr("data-child") != $('.popover').attr("data-parent")) {
						$('.popover').remove();
						app.params.contextOpen = false;
						$(parameters.target).removeAttr("data-child");
						app.contextMenu(parameters);
					}
				} else {
					if ($('.popover').length < 1 && $(parameters.target).attr("data-child") == undefined) {
						var params = parameters || {};
						params.buttons = parameters.buttons || [];
						$('notification-background').remove();
						$('body').append('<div class="notification-background slide-in"></div>');
						$('body').append('<div class="popover not-extended"></div>');
						if (params.title != undefined) {
							$('div.popover').append('<div class="pivot-title">'+params.title+'</div>');
						}
						$('div.popover').append('<div class="buttons"></div>');
						if (params.buttons != undefined) {
							for (var i=0; i<params.buttons.length;i++) {
								if (params.buttons[i].href != undefined) {
									$('.popover .buttons').append('<a href="'+params.buttons[i].href+'" target="_blank"><div class="'+params.buttons[i].type+'">'+params.buttons[i].text+'</div></a>');
								} else {
									$('.popover .buttons').append('<div class="'+params.buttons[i].type+'">'+params.buttons[i].text+'</div>');
								}
								if (params.buttons[i].disabled) {
									$('.popover .buttons div:nth-child('+(i+1)+')').addClass("disabled");
								}
								if (params.buttons[i].selected) {
									$('.popover .buttons div:nth-child('+(i+1)+')').addClass("selected");
								}
								if (params.buttons[i].onclick && typeof(params.buttons[i].onclick) === "function") {
									$('.popover .buttons div:nth-child('+(i+1)+'):not(.disabled)').on("click", params.buttons[i].onclick);
								}
							}
							$('.popover').css({
								"height": ($('.popover .buttons div').length*44)+28+"px"
							});
							if (params.title != undefined) {
								$('.popover').css({
									"height": ($('.popover .buttons div').length*44)+68+"px"
								});
							}

							setTimeout(function() {
								$('.popover').removeClass("not-extended");
							}, 50);
						}
					}
				}
			}, 50);
		};

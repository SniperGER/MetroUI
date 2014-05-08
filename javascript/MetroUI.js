var touchEventStart = (('ontouchend' in window)) ? 'touchstart' : 'mousedown';
var touchEventEnd = (('ontouchend' in window)) ? 'touchend' : 'click';
var timeouts = [];

var availableAccentColors = ["lime", "green", "emerald", "teal", "cyan", "cobalt", "indigo", "violet", "pink", "magenta", "crimson", "red", "orange", "amber", "yellow", "brown", "olive", "steel", "mauve", "taupe"];
var accentColorsStringDE = ["Lindgr&uuml;n", "Gr&uuml;n", "Smaragdgr&uuml;n", "Blaugr&uuml;n", "Zyan", "Kobalt", "Indigo", "Violett", "Rosa", "Magenta", "Purpur", "Rot", "Orange", "Bernstein", "Gelb", "Braun", "Olivgr&uuml;n", "Stahlgrau", "Mauve", "Taupe"];
var currentAccentColor = "cyan";


$(document).ready(function() {
	$('.innerCheckbox').addClass("accent");
	$('.accent:not(.noColor), .accentColor:not(.noColor), .accentBorder:not(.noColor)').addClass(currentAccentColor);
	$('a:not([name])').addClass("accentColor " + currentAccentColor);
	$('button').bind(touchEventStart, function() {
		$(this).addClass("accent " + currentAccentColor);
	});
	$('button').bind(touchEventEnd, function() {
		$(this).removeClass("accent " + currentAccentColor);
	});

});

var MetroUI = {
	/* API FUNCTIONS: show in documentation */
	create: function(options) {
		var options = options || {},
			type = options.type || undefined,
			id = options.id || undefined,
			active = options.active || false,
			startSwitched = options.startSwitched || false,
			label = options.label || "",
			callback = options.callback || function() { };
		
		if (type == "button") {
			$('#'+id).addClass("metro");
			if (active == true && callback != undefined) {
				$('#'+id).bind(touchEventEnd, function() {
					setTimeout(callback, 5);
				});
			}
			if (active == false) {
				$('#'+id).attr("disabled","disabled");
				
			}
		}
		
		if (type == "switch") {
			if (!$('#'+id).hasClass("disabled")) {
				$('#'+id).attr("data-id",id);
				$('body').append("<input class=\"metro\" type=\"checkbox\" data-id=\"" + id + "\">");
				$('#'+id).bind(touchEventEnd, function() {
					var checkboxElement = $('input[type=checkbox][data-id=' + $(this).attr("data-id") + ']');
			
					$(this).toggleClass("checked");
					checkboxElement.attr("checked", !checkboxElement.attr("checked"));
				});
				
				if(startSwitched) {
					$('#'+id).addClass("checked");
					$('input[type=checkbox][data-id=' + id + ']').attr("checked", "checked");
				} else {
					$('#'+id).removeClass("checked");
				}
			}
			if(label != "") {
				$('#'+id).addClass("rightLabel");
				$('div.checkbox#'+id).append("<label>"+label+"</label>");
			}
		}
		if(type=="accentList") {
			$('#'+id).addClass("metro list").append("<p class=\"currentAccentColor\">$accentColor</p><div class=\"currentAccent accent "+currentAccentColor +"\"></div>").bind(touchEventStart, function() {
				$(this).addClass("accent "+currentAccentColor);
			}).bind(touchEventEnd, function() {
				$(this).removeClass("accent "+currentAccentColor);
				MetroUI.loadAccentColors();
			});
			switch($('html').attr("lang")) {
				case "en": $('p.currentAccentColor').html(currentAccentColor); break;
				case "de": $('p.currentAccentColor').html(accentColorsStringDE[$.inArray(currentAccentColor, availableAccentColors)]); break;
				default: $('p.currentAccentColor').html(currentAccentColor); break;
			}
		}
	},
	notify: function(sender,message,iconPath) {
		if($('div.notification').length <= 0) {
			$('body').append("<div class=\"notificationWrapper\"><div class=\"notification accent "+currentAccentColor+"\"><img class=\"notifyImage\" src=\"" + iconPath + "\" /><span class=\"sender\">" + sender + "</span><span class=\"message\">"+message+"</span></div></div>");
			$('div.notification').bind(touchEventEnd, function() {
				MetroUI.dismissNotification();
			});
			setTimeout(function() {
				$('div.notification').addClass("slideIn");
				if (iconPath == undefined) {
					$('img.notifyImage').css("display","none");
				}
			}, 20);
			timeouts.push( setTimeout(function() {
				MetroUI.dismissNotification();
			}, 5310) );
		}
	},
	showAlert: function(title,message,dismissButton) {
		if($('div.alert').length <= 0) {
			$('body').append("<div class=\"alertBG\"></div><div class=\"alertWrapper\"><div class=\"alert\"><p class=\"alertTitle\">"+title+"</p><p class=\"alertContent\">"+message+"</p><div class=\"buttons\"><button id=\"dismiss\" type=\"button\">"+dismissButton+"</button></div></div></div>");
			setTimeout(function() {
				$('div.alert').addClass("rotateIn");
				MetroUI.create({
					type: "button",
					id: "dismiss",
					active: true,
					callback: function() { MetroUI.dismissAlert() }
				});
				$('.alertBG').bind(touchEventStart, function(e) {
					e.preventDefault()
				});
				$('button').bind(touchEventStart, function() {
					$(this).addClass("accent " + currentAccentColor);
				});
				$('button').bind(touchEventEnd, function() {
					$(this).removeClass("accent " + currentAccentColor);
				});
			}, 20);
		}
	},
	showConfirm: function(options) {
		var options = options || {},
			title = options.title || "",
			message = options.message || "",
			confirmButtonTitle = options.confirmButtonTitle || "",
			confirmButtonAction = options.confirmButtonAction || function() {},
			abortButtonTitle = options.abortButtonTitle || "";
		if($('div.alert').length <= 0) {
			$('body').append('<div class="alertBG"></div><div class="alertWrapper"><div class="alert"><p class="alertTitle">'+title+'</p><p class="alertContent">'+message+'</p><div class="buttons"><button id="confirm">'+confirmButtonTitle+'</button><button id="abort">'+abortButtonTitle+'</button></div></div></div>');
			setTimeout(function() {
				$('div.alert').addClass("rotateIn");
				MetroUI.create({
					type: "button",
					id: "confirm",
					active: true,
					callback: function() { MetroUI.dismissAlert(); timeouts.push( setTimeout(confirmButtonAction, 150) ) }
				});
				MetroUI.create({
					type: "button",
					id: "abort",
					active: true,
					callback: function() { MetroUI.dismissAlert() }
				});
				$('.alertBG').bind(touchEventStart, function(e) {
					e.preventDefault()
				});
				$('button').bind(touchEventStart, function() {
					$(this).addClass("accent " + currentAccentColor);
				});
				$('button').bind(touchEventEnd, function() {
					$(this).removeClass("accent " + currentAccentColor);
				});
			}, 20);
		}
	},
	changeAccentColors: function(newAccentColor) {
		$('.accent:not(.noColor), .accentColor:not(.noColor), .accentBorder:not(.noColor)').removeClass(currentAccentColor).addClass(newAccentColor);
		$('a').removeClass(currentAccentColor).addClass(newAccentColor);
		switch($('html').attr("lang")) {
			case "en": $('p.currentAccentColor').html(newAccentColor); break;
			case "de": $('p.currentAccentColor').html(accentColorsStringDE[$.inArray(newAccentColor, availableAccentColors)]); break;
			default: $('p.currentAccentColor').html(newAccentColor); break;
		}
		currentAccentColor = newAccentColor;
	},
	
	/* NON-API FUNCTIONS: do not show in documentation */
	dismissNotification: function() {
		clearTimeouts();
		$('div.notification').addClass("slideOut").removeClass("slideIn");
		setTimeout(function() {
			$('div.notification').remove();
		}, 200);
	},
	dismissAlert: function() {
		clearTimeouts();
		$('div.alert').removeClass("rotateIn").addClass("rotateOut");
		setTimeout(function() {
			$('div.alert, div.alertBG, div.alertWrapper').remove();
		}, 150);
	},
	loadAccentColors: function(options) {
		var options = options || {},
			standalone = options.standalone || true,
			className = options.className || undefined;
			
		if (standalone) {
			$('body').append('<div class="accentColorPickerUI"><div class="alertBG"></div><div class="tilesWrapper"><div class="closeBox"></div><p class="title-category">Accent color</p><div><div class="outerTile" style="-webkit-perspective: 1000px"><div class="tile accent noColor" style="top: 80px; left: 15px;"></div></div><div class="outerTile" style="-webkit-perspective: 1000px"><div class="tile accent noColor" style="top: 80px; left: 90px;"></div></div><div class="outerTile" style="-webkit-perspective: 1000px"><div class="tile accent noColor" style="top: 80px; left: 165px;"></div></div><div class="outerTile" style="-webkit-perspective: 1000px"><div class="tile accent noColor" style="top: 80px; left: 240px;"></div></div><div class="outerTile" style="-webkit-perspective: 1000px"><div class="tile accent noColor" style="top: 155px; left: 15px;-webkit-transition-delay: 30ms;"></div></div><div class="outerTile" style="-webkit-perspective: 1000px"><div class="tile accent noColor" style="top: 155px; left: 90px;-webkit-transition-delay: 30ms;"></div></div><div class="outerTile" style="-webkit-perspective: 1000px"><div class="tile accent noColor" style="top: 155px; left: 165px;-webkit-transition-delay: 30ms;"></div></div><div class="outerTile" style="-webkit-perspective: 1000px"><div class="tile accent noColor" style="top: 155px; left: 240px;-webkit-transition-delay: 30ms;"></div></div><div class="outerTile" style="-webkit-perspective: 1000px"><div class="tile accent noColor" style="top: 230px; left: 15px; -webkit-transition-delay: 60ms;"></div></div><div class="outerTile" style="-webkit-perspective: 1000px"><div class="tile accent noColor" style="top: 230px; left: 90px;-webkit-transition-delay: 60ms;"></div></div><div class="outerTile" style="-webkit-perspective: 1000px"><div class="tile accent noColor" style="top: 230px; left: 165px;-webkit-transition-delay: 60ms;"></div></div><div class="outerTile" style="-webkit-perspective: 1000px"><div class="tile accent noColor" style="top: 230px; left: 240px;-webkit-transition-delay: 60ms;"></div></div><div class="outerTile" style="-webkit-perspective: 1000px"><div class="tile accent noColor" style="top: 305px; left: 15px;-webkit-transition-delay: 90ms;"></div></div><div class="outerTile" style="-webkit-perspective: 1000px"><div class="tile accent noColor" style="top: 305px; left: 90px;-webkit-transition-delay: 90ms;"></div></div><div class="outerTile" style="-webkit-perspective: 1000px"><div class="tile accent noColor" style="top: 305px; left: 165px; -webkit-transition-delay: 90ms;"></div></div><div class="outerTile" style="-webkit-perspective: 1000px"><div class="tile accent noColor" style="top: 305px; left: 240px;  -webkit-transition-delay: 90ms;"></div></div><div class="outerTile" style="-webkit-perspective: 1000px"><div class="tile accent noColor" style="top: 380px; left: 15px; -webkit-transition-delay: 120ms;"></div></div><div class="outerTile" style="-webkit-perspective: 1000px"><div class="tile accent noColor" style="top: 380px; left: 90px; -webkit-transition-delay: 120ms;"></div></div><div class="outerTile" style="-webkit-perspective: 1000px"><div class="tile accent noColor" style="top: 380px; left: 165px; -webkit-transition-delay: 120ms;"></div></div><div class="outerTile" style="-webkit-perspective: 1000px"><div class="tile accent noColor" style="top: 380px; left: 240px; -webkit-transition-delay: 120ms;"></div></div></div></div></div>');
			setTimeout(function() {
				$('.closeBox').bind(touchEventStart, function() {
					$(this).css("opacity","0.3");
				});
				$('.closeBox').bind(touchEventEnd, function() {
					$(this).removeAttr("style");
					MetroUI.closeAccentColors();
				});
			}, 20);
			for (var i=0; i<20; i++){
				$('.tilesWrapper .outerTile:nth-child('+(i+1)+') .tile').addClass(availableAccentColors[i]).bind(touchEventEnd, function() {
					var accentColor = $(this).attr("class");
					accentColor = accentColor.replace("tile accent noColor ","");
					setTimeout(function() {
						MetroUI.closeAccentColors();
						setTimeout(function() {
							MetroUI.changeAccentColors(accentColor);
						}, 260);
					}, 20);
				});
			}
			var delay = 0;
			for (var i=1; i<=20; i++) {
				if (i==5 || i==9 || i==13 || i==17) {
					delay = delay+30;
				}
				if (delay > 0) {
					$('.tilesWrapper .outerTile:nth-child('+(i)+') .tile').css({
						'transition-delay': delay + "ms",
						'-webkit-transition-delay': delay + "ms",
						'-moz-transition-delay': delay + "ms"
					});
				}
				
			}
				
			setTimeout(function() {
				$('.tilesWrapper').addClass("rotateIn");
			}, 20);
		}
	},
	closeAccentColors: function(className) {
		$('.tilesWrapper').addClass("rotateOut");
		setTimeout(function() {
			$('.accentColorPickerUI, '+className).remove();
		}, 260);
	}
}

function clearTimeouts() {
	for (var i = 0; i < timeouts.length; i++) {
	    clearTimeout(timeouts[i]);
	}
	//quick reset of the timer array you just cleared
	timeouts = [];
}
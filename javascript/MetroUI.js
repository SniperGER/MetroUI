var touchEventStart = (('ontouchend' in window)) ? 'touchstart' : 'mousedown';
var touchEventEnd = (('ontouchend' in window)) ? 'touchend' : 'click';
var timeouts = [];

var currentAccentColor = "cobalt";
// Available accent colors: "lime", "green", "emerald", "teal", "cyan", "cobalt", "indigo", "violet", "pink", "magenta", "crimson", "red", "orange", "amber", "yellow", "brown", "olive", "steel", "mauve", "taupe"


$(document).ready(function() {
	$('.innerCheckbox').addClass("accent");
	$('.accent:not(.noColor), .accentColor:not(.noColor), .accentBorder:not(.noColor)').addClass(currentAccentColor);
	$('a').addClass("accentColor " + currentAccentColor);
	$('button').bind(touchEventStart, function() {
		$(this).addClass("accent " + currentAccentColor);
	});
	$('button').bind(touchEventEnd, function() {
		$(this).removeClass("accent " + currentAccentColor);
	});
});

var MetroUI = {
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
					setTimeout(callback, 20);
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
	},
	notify: function(sender,message,iconPath) {
		if($('div.notification').length <= 0) {
			$('body').append("<div class=\"notification accent "+currentAccentColor+"\"><img class=\"notifyImage\" src=\"" + iconPath + "\" /><span class=\"sender\">" + sender + "</span><span class=\"message\">"+message+"</span></div>");
			$('div.notification').bind(touchEventEnd, function() {
				MetroUI.dismissNotification();
			});
			timeouts.push( setTimeout(function() {
				$('div.notification').addClass("slideIn");
				if (iconPath == undefined) {
					$('img.notifyImage').css("display","none");
				}
			}, 20) );
			timeouts.push( setTimeout(function() {
				$('div.notification').removeClass("slideIn");
			}, 10500) );
			timeouts.push( setTimeout(function() {
				MetroUI.dismissNotification();
			}, 10800) );
		}
	},
	dismissNotification: function() {
		clearTimeouts();
		$('div.notification').removeClass("slideIn");
		setTimeout(function() {
			$('div.notification').remove();
		}, 300);
	},
	showAlert: function(title,message,dismissButton) {
		if($('div.alert').length <= 0) {
			$('body').append('<div class="alertBG"></div><div class="alertWrapper"><div class="alert"><p class="alertTitle">'+title+'</p><p class="alertContent">'+message+'</p><div class="buttons"><button id="dismiss" type="button">'+dismissButton+'</button></div></div></div>');
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
	dismissAlert: function() {
		clearTimeouts();
		$('div.alert').removeClass("rotateIn").addClass("rotateOut");
		setTimeout(function() {
			$('div.alert, div.alertBG, div.alertWrapper').remove();
		}, 150);
	}
}

function clearTimeouts() {
	for (var i = 0; i < timeouts.length; i++) {
	    clearTimeout(timeouts[i]);
	}
	//quick reset of the timer array you just cleared
	timeouts = [];
}
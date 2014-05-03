var touchEventStart = (('ontouchend' in window)) ? 'touchstart' : 'mousedown';
var touchEventEnd = (('ontouchend' in window)) ? 'touchend' : 'click';

var MetroUI = {
	create: function(options) {

		var options = options || {},
			type = options.type || undefined,
			objID = options.objID || undefined,
			id = options.id || undefined,
			active = options.active || false,
			startSwitched = options.startSwitched || false,
			callback = options.callback || undefined;
		
		if (type == "button") {
			$(objID).addClass("metro");
			if (active == true && callback != undefined) {
				$(objID).bind(touchEventEnd, callback);
			}
			if (active == false) {
				$(objID).attr("disabled","disabled");
				
			}
		}
		
		if (type == "switch") {
			if (!$(objID).hasClass("disabled")) {
				$(objID).attr("data-id",id);
				$('body').append("<input class=\"metro\" type=\"checkbox\" data-id=\"" + id + "\">");
				$(objID).bind(touchEventEnd, function() {
					var checkboxElement = $('input[type=checkbox][data-id=' + $(this).attr("data-id") + ']');
			
					$(this).toggleClass("checked");
					checkboxElement.attr("checked", !checkboxElement.attr("checked"));
				});
				
				if(startSwitched) {
					$(objID).addClass("checked");
					$('input[type=checkbox][data-id=' + id + ']').attr("checked", "checked");
				} else {
					$(objID).removeClass("checked");
				}
			}
		}
	}
}
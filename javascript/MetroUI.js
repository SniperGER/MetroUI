var touchEventStart = (('ontouchend' in window)) ? 'touchstart' : 'mousedown';
var touchEventEnd = (('ontouchend' in window)) ? 'touchend' : 'click';

var MetroUI = {
	init: function(options) {

		var options = options || {},
			objID = options.objID || undefined,
			id = options.id || undefined,
			startEnabled = options.startEnabled || false;
		
		if (!$(objID).hasClass("disabled")) {
			$(objID).attr("data-id",id);
			$('body').append("<input class=\"metro\" type=\"checkbox\" data-id=\"" + id + "\">");
			$(objID).bind(touchEventEnd, function() {
				var checkboxElement = $('input[type=checkbox][data-id=' + $(this).attr("data-id") + ']');
		
				$(this).toggleClass("checked");
				checkboxElement.attr("checked", !checkboxElement.attr("checked"));
			});
			
			if(startEnabled) {
				$(objID).addClass("checked");
				$('input[type=checkbox][data-id=' + id + ']').attr("checked", "checked");
			} else {
				$(objID).removeClass("checked");
			}
		}
	}
}
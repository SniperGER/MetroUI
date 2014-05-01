var touchEventStart = (('ontouchend' in window)) ? 'touchstart' : 'mousedown';
var touchEventEnd = (('ontouchend' in window)) ? 'touchend' : 'click';

$('div[data-id=switch1]').bind(touchEventEnd, function() {
	var $checkboxElement = $('input[type=checkbox][data-id=' + $(this).attr("data-id") + ']');

	$(this).toggleClass("checked");
	$checkboxElement.attr("checked", !$checkboxElement.attr("checked"));
	
	if ($checkboxElement.attr("checked") == "checked") {
		$('p#checkbox1checked').html("Checkbox 1 is: " + $checkboxElement.attr("checked"));
	} else {
		$('p#checkbox1checked').html("Checkbox 1 is: unchecked");
	}
});
/**
 * Analytics event reporting code.
 */

$(document).ready(function() {
	
	$('.analytics-btn').click(function(ev) {
		var btn_type = $(ev.target).attr('data-analytics')
		if ( btn_type == undefined ) {
			return;
		}
		//ga('send', 'event', 'button', 'click', btn_type);
	});
})
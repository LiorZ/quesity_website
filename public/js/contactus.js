$(document).ready(function(){

	var refresh_image = function() {
		$('#img_captcha').removeAttr('src').attr('src','/captcha.jpg');
	}
	
	$('#contact_refresh_image').click(refresh_image);
	
	$('#contact_submit').click(function() {
		var name = $('#contact_fullname').val();
		var email = $('#contact_email').val();
		var message = $('#contact_message').val();
		var captcha = $('#contact_captcha').val();
		
		if ( name == "" || email == "" || message == "" || captcha == "" ) {
			alert("Please fill all fields");
			return;
		}
		
		$.post('/contactus',{
			name: name,
			email:email,
			message:message,
			captcha:captcha
		}).fail(function() {
			alert("Please enter the captcha text correctly");
			refresh_image();
		}).success(function() {
			$(".form-group input").val("");
			$(".form-group textarea").val("");
			$("#contact_submit").attr('disabled','disabled');
			
			alert("Thank you!");
		});
	});
	
});
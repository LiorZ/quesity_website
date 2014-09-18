$(document).ready(function(){

	
	$('#contact_submit').click(function() {
		var name = $('#contact_fullname').val();
		var email = $('#contact_email').val();
		var message = $('#contact_message').val();
		
		if ( name == "" || email == "" || message == "" ) {
			alert("Please fill all fields");
			return;
		}
		
		$.post('/contactus',{
			name: name,
			email:email,
			message:message,
		}).fail(function() {
			alert("An error occurred while sending the form. Please try again later");
		}).success(function() {
			$(".form-group input").val("");
			$(".form-group textarea").val("");
			$("#contact_submit").attr('disabled','disabled');
			
			alert("Thank you!");
		});
	});
	
});
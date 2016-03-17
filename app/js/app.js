
$(function () {
	var timer;

	$(document).on('click', '.start', function() {
		var data = {
			handleOne: $('.handle_1').val(),
			handleTwo: $('.handle_2').val()
		}
		$.ajax({
			type: 'POST',
			url: '/handles',
			data: data,
			success: function(data) {
				timer = window.setInterval(getTweet, 5000);
			}
		});
		$(this).addClass('stop').removeClass('start').text('Stop');
	});

	$(document).on('click', '.stop', function() {
		window.clearInterval(timer);
		$(this).addClass('start').removeClass('stop').text('Start');
	});
});

function getTweet() {
	$.get('/tweet', function(data) {
		// console.log(data);
		$('body').append('<p>' + data + '</p>');
	});
}
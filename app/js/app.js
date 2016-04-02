
$(function () {
	var timer;

	$(document).on('click', '.start', function() {
		var data = {
			handleOne: stripAt($('.handle_1').val()),
			handleTwo: stripAt($('.handle_2').val())
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
		// TODO: add photos of requested profiles
		// $.ajax({
		// 	type: 'GET',
		// 	url: '/photos',
		// 	data: data,
		// 	success function(data) {
				
		// 	}
		// });
	});

	$(document).on('click', '.stop', function() {
		window.clearInterval(timer);
		$(this).addClass('start').removeClass('stop').text('Start');
		// remove photos
	});
});

function getTweet() {
	$.get('/tweet', function(data) {
		var $p = $('<p>')
			.text(data)
			.append(
				$('<a>')
					.addClass('twitter-share-button')
					.attr({
						href : 'https://twitter.com/intent/tweet?text='
								+ encodeURIComponent(data),
						target: '_blank'
					})
					.append($('<i>').addClass('fa fa-twitter'))			
		);

		$('body').append($p);
		$p.addClass('tweet');
	});
}

// if they added an @, strip it
function stripAt(str) {
	if (str.startsWith('@')) {
		str = str.substring(1, str.length);
	}
	return str;
}
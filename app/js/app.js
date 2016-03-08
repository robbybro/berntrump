$(function () {
	window.setInterval(getTweet, 5000);
});

function getTweet() {
	$.get('/tweet', function(data) {
		console.log(data);
		$('body').append('<p>' + data + '</p>');
	});
}
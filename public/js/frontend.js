
$(document).ready(function() {

	var path;
	var data;
	var articleIDArray = window.location.href.split('=');

	function relocateWindow() {
		data = $.param(data);
		window.location = (window.location.origin + path + data);
	}

	$('.col-single-article').click(function() {
		data = {
			articleID: $(event.target).attr('data-obj-id')
		}
		path = '/detail?';
		relocateWindow();
	});

	$('.btn-save-note').click(function() {
		articleIDArray.reverse();
		data = {
			username: $('#username').val().trim(),
			q1: $('#q1').text().trim(),
			a1: $('#sympathy').val().trim(),
			q2: $('#q2').text().trim(),
			a2: $('#antipathy').val().trim(),
			q3: $('#q3').text().trim(),
			a3: $('#examples').val().trim(),
			articleID: articleIDArray[0]
		}
		path = '/submit?'
		relocateWindow();
	});
	$('.btn-show-notes').click(function() {
		articleIDArray.reverse();
		data = {
			showNotes: true, 
			articleID: articleIDArray[0]
		}
		path = '/shownotes?';
		relocateWindow();
	});

	$('.btn-create-note').click(function() {
		articleIDArray.reverse();
		data = {
			showNotes: false,
			articleID: articleIDArray[0]
		}
		path = '/detail?';
		relocateWindow();
	});

	$('.grid').masonry({
  	// options
  	itemSelector: '.col-single-article'
	});
});


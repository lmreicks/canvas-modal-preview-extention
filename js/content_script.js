$(window).on('load', () => {
	main();
});

function main() 
{
	$('a.file_preview_link').on('click', function(e) {
		var $link = $(e.currentTarget);
        $.ajaxJSON($link.attr('href').replace(/\/download/, ""), 'GET', {}, function(data) {
          var attachment = data && data.attachment;
          if (attachment && attachment.canvadoc_session_url) {
			const sanitizedUrl = sanitizeUrl(attachment.canvadoc_session_url)
			var iframe = $('<iframe/>', {
				src: sanitizedUrl,
				width: '100%',
				allowfullscreen: '1',
				css: {border: 0, overflow: 'auto', height: '100%', 'min-height': 0}
			});

			addDocToModal(iframe, generateModal($link.parent(), attachment.id));
          }
        });
	});

	let doc = $('#doc_preview');
	if (doc.length) {
		let id = doc.data('attachment_id');
		let textElement = doc.parent().find('h2');
		addDocToModal(doc.find('iframe'), generateModal(textElement, id));
	}

	let tool = $('.tool_content_wrapper');
	if (tool.length) {
		console.log(tool);
		let id = tool.data('tool-wrapper-id');
		let textElement = $('#assignment_show').find('h1');
		// addDocToModal(tool, generateModal(textElement, id));
	}
}

function addDocToModal(iFrame, modal) {
	iFrame.css('min-height', 0);
	iFrame.css('height', '100%');
	modalBody = modal.find('#fileModalBody');
	iFrame.appendTo(modalBody);
	modal.modal('show');
}

function generateModal(textElement, id) {
	if ($('#' + id).length) {
		return $('#' + id);
	} else {
		let title = $(textElement).text();
		let modal = $(`
			<div class="modal fade" id="${ id }" tabindex="-1" role="dialog" aria-labelledby="fileTitle" aria-hidden="true">
				<div class="modal-dialog modal-lg" style="max-width: 95vw; margin: 0.5rem auto;" role="document">
				<div class="modal-content" style="height: 97vh;">
					<div class="modal-header" style="padding: 0.5rem 1rem">
					<h5 class="modal-title" style="margin: 0" id="fileTitle">${ title }</h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
					</div>
					<div class="modal-body rounded-bottom" style="overflow: hidden; padding: 0" id="fileModalBody">
					
					</div>
				</div>
				</div>
			</div>
		`);

		$(document.body).append(modal);
		return modal;
	}
}


function sanitizeUrl (url) {
	const badSchemeRegex = /javascript:/
	if (url.match(badSchemeRegex)) {
	  return 'about:blank'
	}
	return url
}
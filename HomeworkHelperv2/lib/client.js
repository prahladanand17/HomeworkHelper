const message = m => `<div class="message card">
							<div class="card-content">
								<span class="card-title light-blue-text">${m.author}</span>
								<p>
									${m.content.split(' ').map(s => s[0] === '/' ? 
										`<span style="color: #888">${s}</span>` : s).join(' ')}
								</p>
							</div>
						</div>`;

const table = l => `<div class="message card">
							<div class="card-content">
								<span class="card-title light-blue-text">${l[0]}</span>
								<table class="striped">
									<thead>
										<tr>
											<th>Name</th>
											<th>Number of Parrots</th>
										</tr>
									</thead>
									<tbody>
										${l.splice(1).reduce((acc, r) => (`
											${acc}
											<tr>
												<td>${r.split(': ')[0]}</td>
												<td>${r.split(': ')[1]}</td>
											</tr>
										`), '')}
									</tbody>
									
								</table>
							</div>
						</div>`;

function initChat(nick) {
	const server = new EventSource('/messages');
	$.ajax({type: 'PUT', url: `/register/${nick}`});
	$('#message').focus();
	$('#message-form').submit(() => {
		let $message = $('#message');

		if ($message.val()) {
			$.ajax({
				method: 'PUT',
				url: '/message',
				contentType: 'application/json',
				data: JSON.stringify({
					author: nick,
					content: $message.val()
				})
			});
			$message.val('');
			$message.focus();
		}

		return false;
	});

	function addMessage(m) {
		console.log(`Got message "${m.content}" (from ${m.author}) from the server`);
		const $messageContainer = $('#messages');
		$messageContainer.append($.parseHTML(message(m)));
		$messageContainer.animate({scrollTop: $messageContainer.prop("scrollHeight")}, 1000);
	}

	function addLeaderboard(l) {
		console.log(`Received a leaderboard update from the server`);
		const t = l.split('<br />');
		const $messageContainer = $('#messages');
		$messageContainer.append($.parseHTML(table(t)));
		$messageContainer.animate({scrollTop: $messageContainer.prop("scrollHeight")}, 1000);
	}

	server.addEventListener('message', e => addMessage(JSON.parse(e.data)));
	server.addEventListener('leaderboard', e => addLeaderboard(JSON.parse(e.data).content));
}

$(document).ready(() => {
	const $nickModal = $('.modal');
	let $nickInput = $('#nick');

	$nickModal.modal({
		dismissible: false,
		complete: () => initChat($nickInput.val())
	});
	$nickModal.modal('open');
	$nickInput.focus();
});
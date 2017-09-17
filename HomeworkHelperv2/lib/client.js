// const message = m => `<div class="message card">
// 							<div class="card-content">
// 								<span class="card-title light-blue-text">${m.author}</span>
// 								<p>
// 									${m.content.split(' ').map(s => s[0] === '/' ?
// 										`<span style="color: #888">${s}</span>` : s).join(' ')}
// 								</p>
// 							</div>
// 						</div>`;
//
// const table = l => `<div class="message card">
// 							<div class="card-content">
// 								<span class="card-title light-blue-text">${l[0]}</span>
// 								<table class="striped">
// 									<thead>
// 										<tr>
// 											<th>Name</th>
// 											<th>Number of Parrots</th>
// 										</tr>
// 									</thead>
// 									<tbody>
// 										${l.splice(1).reduce(function(acc, r) (`
// 											${acc}
// 											<tr>
// 												<td>${r.split(': ')[0]}</td>
// 												<td>${r.split(': ')[1]}</td>
// 											</tr>
// 										`), '')}
// 									</tbody>
//
// 								</table>
// 							</div>
// 						</div>`;

function initSearch(subject) {
    const server = new EventSource('/messages');
    $.ajax({
        type: 'PUT',
        url: `/register/${subject}`
    });

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


    server.addEventListener('message', e => addMessage(JSON.parse(e.data)));
    server.addEventListener('functions', e => addLeaderboard(JSON.parse(e.data).content));
}

$(document).ready(() => {
    console.log('test');
    const $nickModal = $('.modal');
    let $nickInput = $('#nick');

    $nickModal.modal({
        dismissible: false,
        complete: () => initSearch($nickInput.val())
    });
    $nickModal.modal('open');
    $nickInput.focus();
});
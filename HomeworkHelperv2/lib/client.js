function initSearch() {
    $('#message-form').submit(function() {
        let $subject = $('#subject');
        let val = $subject.val();

        if (val) {
            $.ajax({
                method: 'GET',
                url: `http://localhost:8080/functions/${val}`,
            });
        }

        return false;
    });
}

$(document).ready(function() {
    console.log('test');
    const $nickModal = $('.modal');
    let $nickInput = $('#nick');

    $nickModal.modal({
        dismissible: false,
        ready: () => initSearch()
    });
    $nickModal.modal('open');
    $nickInput.focus();
});
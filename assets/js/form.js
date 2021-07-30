function form_msg(status, message) {
    var formMessages = $('#form-messages');
    $(formMessages).css('display', 'block');
    $(formMessages).removeClass('bg-danger');
    $(formMessages).removeClass('bg-warn');
    $(formMessages).removeClass('bg-success');
    $(formMessages).addClass(status);
    $(formMessages).text(message);
}

$(function() {

    // Get the form.
    var form = $('#ajax-contact');

    // Set up an event listener for the contact form.
    $(form).submit(function(e) {
        // Stop the browser from submitting the form.
        e.preventDefault();

        grecaptcha.ready(function() {
            grecaptcha.execute('6Ld1dMwbAAAAALM4WzgGBZzCrxpDwPOpVbViieC-', {action: 'submit'}).then(function(token) {

                var msgSending = form.attr("msg-sending");
                var msgSuccess = form.attr("msg-success");
                var msgFailure = form.attr("msg-failure");
                var msgError = form.attr("msg-error");

                if (! msgSending) msgSending = 'Sending message. Just a second';
                if (! msgSuccess) msgSuccess = 'Message sent. We will be in touch shortly';
                if (! msgFailure) msgFailure = 'Message not sent. Please try again';
                if (! msgError) msgError = 'Oops! An error occured and your message could not be sent.';

                $('#token').val(token);

                // Serialize the form data.
                var formData = $(form).serialize();

                form_msg('bg-warn', msgSending);
                // Submit the form using AJAX.
                $.ajax({
                    type: 'POST',
                    url: $(form).attr('action'),
                    data: formData
                })
                    .done(function(response) {
                        if (response.status == "success") {
                            // Make sure that the formMessages div has the 'success' class.
                            form_msg('bg-success', msgSuccess);
                        } else {
                            // Make sure that the formMessages div has the 'danger' class.
                            form_msg('bg-danger', msgFailure);
                        }

                        // Clear the form.
                        $('#name, #email, #message').val('');
                    })
                    .fail(function(data) {
                        // Make sure that the formMessages div has the 'danger' class.
                        form_msg('bg-danger', msgError);
                    });

            });
        });
    });

});
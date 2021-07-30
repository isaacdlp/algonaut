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
            grecaptcha.execute('reCAPTCHA_site_key', {action: 'submit'}).then(function(token) {

                // Serialize the form data.
                var formData = $(form).serialize();

                form_msg('bg-warn', 'Sending message. Just a second');
                // Submit the form using AJAX.
                $.ajax({
                    type: 'POST',
                    url: $(form).attr('action'),
                    data: formData
                })
                    .done(function(response) {
                        if (response.status == "success") {
                            // Make sure that the formMessages div has the 'success' class.
                            form_msg('bg-success', 'Message sent. We will be in touch shortly');
                        } else {
                            // Make sure that the formMessages div has the 'success' class.
                            form_msg('bg-danger', 'Message not sent. Please try again');
                        }

                        // Clear the form.
                        $('#name, #email, #message').val('');
                    })
                    .fail(function(data) {
                        // Make sure that the formMessages div has the 'error' class.
                        form_msg('bg-danger', 'Oops! An error occured and your message could not be sent.');
                    });

            });
        });
    });

});
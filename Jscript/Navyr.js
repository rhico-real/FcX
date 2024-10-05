        $(document).ready(function() {
            // Smooth scrolling for navigation links
            $('a[href^="#"]').on('click', function(event) {
                event.preventDefault();
                $('html, body').animate({
                    scrollTop: $($.attr(this, 'href')).offset().top
                }, 800);
            });

            // Dynamic copyright year
            $('#currentYear').text(new Date().getFullYear());
        });

        // Form validation
        $('#contactForm').submit(function(event) {
            event.preventDefault();
            var name = $('#name').val();
            var email = $('#email').val();
            var message = $('#message').val();

            if (name && email && message) {
                $('#formMessage').text('Thank you for your message! We will get back to you soon.').css('color', 'green');
                // Here you would typically send the form data to a server
            } else {
                $('#formMessage').text('Please fill in all fields.').css('color', 'red');
            }
        });

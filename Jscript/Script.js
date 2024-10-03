 // Add this to your existing <script> section
 $(document).ready(function() {
    let currentIndex = 0;
    const images = $('.home-pic3 img');
    const totalImages = images.length;

    // Show the first image
    $(images[currentIndex]).addClass('active');

     // Function to change images
    function changeImage() {
    $(images[currentIndex]).removeClass('active');
    currentIndex = (currentIndex + 1) % totalImages; // Loop back to the first image
    $(images[currentIndex]).addClass('active');
     }

    // Change image every 3 seconds
    setInterval(changeImage, 3000);
    });
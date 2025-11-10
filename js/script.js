document.addEventListener('DOMContentLoaded', () => {
    const mainPhoto = document.getElementById('main-photo');
    const thumbnailsContainer = document.getElementById('thumbnails');
    const thumbnails = thumbnailsContainer.querySelectorAll('.thumbnail');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    let currentIndex = 0;

    function updateMainPhoto(index, shouldScroll = true) {
        mainPhoto.style.opacity = 0;
        setTimeout(() => {
            mainPhoto.src = thumbnails[index].src;
            mainPhoto.alt = thumbnails[index].alt;
            mainPhoto.style.opacity = 1;

            if (shouldScroll) {
                // Scroll to the main photo and center it
                mainPhoto.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }, 300); // Match this duration with the CSS transition duration

        thumbnails.forEach((thumb, i) => {
            if (i === index) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
    }

    // Thumbnail click event
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            currentIndex = index;
            updateMainPhoto(currentIndex);
        });
    });

    // Previous button click event
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex === 0) ? thumbnails.length - 1 : currentIndex - 1;
        updateMainPhoto(currentIndex);
    });

    // Next button click event
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex === thumbnails.length - 1) ? 0 : currentIndex + 1;
        updateMainPhoto(currentIndex);
    });

    // Initialize the first photo as active, without scrolling
    updateMainPhoto(currentIndex, false);
});

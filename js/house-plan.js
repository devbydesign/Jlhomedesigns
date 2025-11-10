document.addEventListener('DOMContentLoaded', () => {
    const mainPhoto = document.getElementById('plan-main-photo');
    const thumbnailsContainer = document.getElementById('plan-thumbnails');
    const thumbnails = thumbnailsContainer.querySelectorAll('.plan-thumbnail');
    const prevBtn = document.getElementById('plan-prev-btn');
    const nextBtn = document.getElementById('plan-next-btn');

    let currentIndex = 0;
    let isZoomed = false;
    let isDragging = false;
    let hasDragged = false; // New flag to indicate if a drag occurred
    let startX, startY, initialX, initialY;
    const ZOOM_FACTOR = 1.95;

    // Prevent default image drag behavior
    mainPhoto.addEventListener('dragstart', (e) => {
        e.preventDefault();
    });

    function updateMainPhoto(index) {
        mainPhoto.style.opacity = 0;
        setTimeout(() => {
            mainPhoto.src = thumbnails[index].src;
            mainPhoto.alt = thumbnails[index].alt;
            mainPhoto.style.opacity = 1;

            // Reset zoom and position when image changes
            mainPhoto.style.transform = 'scale(1) translate(0, 0)';
            mainPhoto.style.cursor = 'zoom-in';
            isZoomed = false;

            // Scroll to the main photo and center it
            mainPhoto.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
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

    // Zoom functionality: Click to toggle zoom in/out
    mainPhoto.addEventListener('click', (e) => {
        if (isDragging || hasDragged) { // Prevent zoom if dragging just occurred
            hasDragged = false; // Reset the flag
            return;
        }

        isZoomed = !isZoomed;
        if (isZoomed) {
            mainPhoto.style.transform = `scale(${ZOOM_FACTOR}) translate(0, 0)`; // Ensure translate is 0
            mainPhoto.style.cursor = 'grab';
        } else {
            mainPhoto.style.transform = 'scale(1) translate(0, 0)';
            mainPhoto.style.cursor = 'zoom-in';
        }
    });

    // Drag functionality: mouse down to start dragging, mouse up to end
    mainPhoto.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return; // Only allow left-click for dragging
        if (isZoomed) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const transform = window.getComputedStyle(mainPhoto).transform;
            const matrix = new DOMMatrixReadOnly(transform);
            initialX = matrix.m41;
            initialY = matrix.m42;
            mainPhoto.style.cursor = 'grabbing';
            hasDragged = false; // Reset hasDragged at the start of a potential drag

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        }
    });

    const onMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();

        const container = mainPhoto.parentElement; // The .plan-viewer-main div
        const containerRect = container.getBoundingClientRect();
        const currentImageRect = mainPhoto.getBoundingClientRect(); // Get current scaled dimensions

        // Calculate the dimensions of the image *relative to its container* after scaling
        const imageDisplayWidth = currentImageRect.width;
        const imageDisplayHeight = currentImageRect.height;

        // Calculate the maximum possible translation values
        // The image can be dragged until its edge aligns with the container's edge
        const limitX = Math.max(0, (imageDisplayWidth - containerRect.width) / 2);
        const limitY = Math.max(0, (imageDisplayHeight - containerRect.height) / 2);

        let dx = e.clientX - startX;
        let dy = e.clientY - startY;

        // Apply limits to dx and dy
        let newTranslateX = initialX + dx;
        let newTranslateY = initialY + dy;

        // Clamp translation values within limits
        newTranslateX = Math.max(-limitX, Math.min(limitX, newTranslateX));
        newTranslateY = Math.max(-limitY, Math.min(limitY, newTranslateY));

        mainPhoto.style.transform = `scale(${ZOOM_FACTOR}) translate(${newTranslateX}px, ${newTranslateY}px)`;
        hasDragged = true; // Set hasDragged if there's movement during mousedown
    };

    const onMouseUp = () => {
        if (isDragging) {
            isDragging = false;
            mainPhoto.style.cursor = 'grab';
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    };

    // Initialize the first photo as active
    updateMainPhoto(currentIndex);
});

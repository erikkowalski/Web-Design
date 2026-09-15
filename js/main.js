// Small demo script: auto-updates the footer year and powers a
// simple mobile nav toggle. Nothing fancy -- good for walking
// students through DOM selection + event listeners.

document.addEventListener('DOMContentLoaded', function () {

    // 1. Footer year, so it's never out of date.
    var yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // 2. Mobile nav toggle.
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.main-nav');

    if (toggle && nav) {
        toggle.addEventListener('click', function () {
            var isOpen = nav.classList.toggle('nav-open');
            toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    }

    // 3. Lightbox for the gallery grid (home page only -- bails out
    // quietly on any page that doesn't have a .gallery or #lightbox).
    var galleryImages = Array.prototype.slice.call(document.querySelectorAll('.gallery img'));
    var lightbox = document.getElementById('lightbox');

    if (galleryImages.length && lightbox) {
        var lightboxImage = lightbox.querySelector('.lightbox-image');
        var lightboxCaption = lightbox.querySelector('.lightbox-caption');
        var closeBtn = lightbox.querySelector('.lightbox-close');
        var prevBtn = lightbox.querySelector('.lightbox-prev');
        var nextBtn = lightbox.querySelector('.lightbox-next');
        var currentIndex = 0;
        var lastFocused = null;

        var showImage = function (index) {
            currentIndex = (index + galleryImages.length) % galleryImages.length;
            var img = galleryImages[currentIndex];
            var figure = img.closest('figure');
            var caption = figure ? figure.querySelector('figcaption') : null;

            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            lightboxCaption.textContent = caption ? caption.textContent : '';
        };

        var openLightbox = function (index) {
            lastFocused = document.activeElement;
            showImage(index);
            lightbox.classList.add('is-open');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            closeBtn.focus();
        };

        var closeLightbox = function () {
            lightbox.classList.remove('is-open');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            if (lastFocused) {
                lastFocused.focus();
            }
        };

        galleryImages.forEach(function (img, index) {
            img.setAttribute('tabindex', '0');
            img.setAttribute('role', 'button');

            img.addEventListener('click', function () {
                openLightbox(index);
            });

            img.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openLightbox(index);
                }
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', function () { showImage(currentIndex - 1); });
        nextBtn.addEventListener('click', function () { showImage(currentIndex + 1); });

        lightbox.addEventListener('click', function (event) {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', function (event) {
            if (!lightbox.classList.contains('is-open')) {
                return;
            }
            if (event.key === 'Escape') {
                closeLightbox();
            } else if (event.key === 'ArrowRight') {
                showImage(currentIndex + 1);
            } else if (event.key === 'ArrowLeft') {
                showImage(currentIndex - 1);
            }
        });
    }

});

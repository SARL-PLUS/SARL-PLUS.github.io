/**
 * Simple scroll animation sequence
 * Adds 'visible' class to elements with 'animate-on-scroll' class when they enter viewport
 */
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el, index) => {
        // Add staggered delay if multiple elements are in the same parent container
        if (el.dataset.delay) {
            el.style.transitionDelay = `${el.dataset.delay}ms`;
        }
        observer.observe(el);
    });
});

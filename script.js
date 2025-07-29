document.addEventListener("DOMContentLoaded", function() {
    // Fade-in animation
    const fadeInElements = document.querySelectorAll(".fade-in");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    });

    fadeInElements.forEach(element => {
        observer.observe(element);
    });

    // Typing animation
    new Typed('#typing-animation', {
        strings: ['CodeNeutronAI', 'the Future'],
        typeSpeed: 100,
        backSpeed: 50,
        loop: true
    });
});

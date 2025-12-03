/* ============================================
   CodeNeutronAI - Interactive JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initPreloader();
    initCustomCursor();
    initNavbar();
    initParticles();
    initAOS();
    initCounters();
    initSmoothScroll();
    initBackToTop();
    initFormValidation();
    initServicesSlider();
});

/* Services Slider - True Infinite Circular Carousel */
function initServicesSlider() {
    const slider = document.getElementById('servicesSlider');
    const track = slider?.querySelector('.services-track');
    const originalSlides = slider?.querySelectorAll('.service-slide');
    const prevBtn = document.getElementById('servicesPrev');
    const nextBtn = document.getElementById('servicesNext');
    const dotsContainer = document.getElementById('sliderDots');
    
    if (!slider || !track || !originalSlides.length) return;
    
    const totalOriginal = originalSlides.length; // 6 original slides
    let currentIndex = totalOriginal; // Start at first real slide (after clones)
    let isTransitioning = false;
    
    // Clone slides for infinite loop - clone all slides to both ends
    function setupInfiniteSlider() {
        // Clone all slides and append to end
        originalSlides.forEach(slide => {
            const clone = slide.cloneNode(true);
            clone.classList.add('clone');
            track.appendChild(clone);
        });
        
        // Clone all slides and prepend to beginning
        [...originalSlides].reverse().forEach(slide => {
            const clone = slide.cloneNode(true);
            clone.classList.add('clone');
            track.insertBefore(clone, track.firstChild);
        });
    }
    
    // Get all slides after cloning
    function getAllSlides() {
        return track.querySelectorAll('.service-slide');
    }
    
    // Create dots for original 6 slides only
    function createDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalOriginal; i++) {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i + totalOriginal));
            dotsContainer.appendChild(dot);
        }
    }
    
    // Update dots based on current position
    function updateDots() {
        const realIndex = getRealIndex();
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === realIndex);
        });
    }
    
    // Get the real index (0-5) from current position
    function getRealIndex() {
        return ((currentIndex - totalOriginal) % totalOriginal + totalOriginal) % totalOriginal;
    }
    
    // Calculate slide width
    function getSlideWidth() {
        const slides = getAllSlides();
        return slides[0].offsetWidth + 24; // width + gap
    }
    
    // Update slider position
    function updateSlider(animate = true) {
        const slideWidth = getSlideWidth();
        
        if (!animate) {
            track.style.transition = 'none';
        } else {
            track.style.transition = 'transform 0.5s ease';
        }
        
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        updateDots();
    }
    
    // Handle infinite loop jump
    function handleTransitionEnd() {
        const slides = getAllSlides();
        const totalSlides = slides.length; // 18 slides (6 clones + 6 original + 6 clones)
        
        isTransitioning = false;
        
        // If at the end clones, jump to real slides
        if (currentIndex >= totalOriginal * 2) {
            currentIndex = currentIndex - totalOriginal;
            updateSlider(false);
        }
        
        // If at the beginning clones, jump to real slides
        if (currentIndex < totalOriginal) {
            currentIndex = currentIndex + totalOriginal;
            updateSlider(false);
        }
        
        // Re-enable transition after instant jump
        setTimeout(() => {
            track.style.transition = 'transform 0.5s ease';
        }, 20);
    }
    
    // Go to specific slide
    function goToSlide(index) {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex = index;
        updateSlider();
    }
    
    // Next slide
    function nextSlide() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex++;
        updateSlider();
    }
    
    // Previous slide
    function prevSlide() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex--;
        updateSlider();
    }
    
    // Setup infinite slider
    setupInfiniteSlider();
    
    // Event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    track.addEventListener('transitionend', handleTransitionEnd);
    
    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateSlider(false);
            setTimeout(() => {
                track.style.transition = 'transform 0.5s ease';
            }, 50);
        }, 100);
    });
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
    
    // Auto-slide every 4 seconds
    let autoSlide = setInterval(nextSlide, 4000);
    
    // Pause auto-slide on hover
    slider.addEventListener('mouseenter', () => {
        clearInterval(autoSlide);
    });
    
    slider.addEventListener('mouseleave', () => {
        autoSlide = setInterval(nextSlide, 4000);
    });
    
    // Initialize
    createDots();
    
    // Initial position (start at first real slide, after clones)
    setTimeout(() => {
        updateSlider(false);
        setTimeout(() => {
            track.style.transition = 'transform 0.5s ease';
        }, 50);
    }, 100);
}

/* Preloader */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    
    window.addEventListener('load', function() {
        setTimeout(function() {
            preloader.classList.add('hidden');
            document.body.style.overflow = 'visible';
        }, 500);
    });
}

/* Custom Cursor */
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (!cursor || !cursorFollower) return;
    
    // Check if device supports hover
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.body.style.cursor = 'none';
        
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let followerX = 0, followerY = 0;
        
        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        function animateCursor() {
            // Cursor follows immediately
            cursorX += (mouseX - cursorX) * 0.5;
            cursorY += (mouseY - cursorY) * 0.5;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            // Follower has delay
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';
            
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
        
        // Hover effects
        const hoverElements = document.querySelectorAll('a, button, .btn, .service-card, .portfolio-card, .tech-item, .nav-link');
        
        hoverElements.forEach(function(el) {
            el.addEventListener('mouseenter', function() {
                cursor.classList.add('hover');
                cursorFollower.classList.add('hover');
            });
            
            el.addEventListener('mouseleave', function() {
                cursor.classList.remove('hover');
                cursorFollower.classList.remove('hover');
            });
        });
        
        // Hide cursor when leaving window
        document.addEventListener('mouseleave', function() {
            cursor.style.opacity = '0';
            cursorFollower.style.opacity = '0';
        });
        
        document.addEventListener('mouseenter', function() {
            cursor.style.opacity = '1';
            cursorFollower.style.opacity = '1';
        });
    }
}

/* Navbar Scroll Effect */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Scroll effect
    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Active link highlighting
        let current = '';
        
        sections.forEach(function(section) {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    // Close mobile menu on link click
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) bsCollapse.hide();
            }
        });
    });
}

/* Particles.js */
function initParticles() {
    if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 60,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: ['#6366f1', '#8b5cf6', '#0ea5e9']
                },
                shape: {
                    type: 'circle'
                },
                opacity: {
                    value: 0.5,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#6366f1',
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: true,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: true,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 0.5
                        }
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    }
}

/* AOS (Animate On Scroll) */
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50,
            delay: 0
        });
    }
}

/* Number Counter Animation */
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    if (counters.length === 0) return;
    
    const animateCounter = function(counter) {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = function() {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    };
    
    // Intersection Observer for counters
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(function(counter) {
        counterObserver.observe(counter);
    });
}

/* Smooth Scroll */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const offsetTop = target.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* Back to Top Button */
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    if (!backToTop) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* Form Validation & Enhancement */
function initFormValidation() {
    const form = document.querySelector('.contact-form');
    
    if (!form) return;
    
    const inputs = form.querySelectorAll('.form-control');
    
    // Add focus effects
    inputs.forEach(function(input) {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Check for pre-filled inputs
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<span>Sending...</span> <i class="bi bi-hourglass-split"></i>';
        submitBtn.disabled = true;
        
        // Re-enable after form submits (FormSubmit will redirect)
        setTimeout(function() {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 5000);
    });
}

/* Floating Cards Animation Enhancement */
(function() {
    const cards = document.querySelectorAll('.floating-card');
    
    cards.forEach(function(card, index) {
        card.style.animationDelay = (index * 0.5) + 's';
    });
})();

/* Parallax Effect for Hero Section */
(function() {
    const hero = document.querySelector('.hero-section');
    
    if (!hero) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.scrollY;
        const heroContent = hero.querySelector('.hero-content');
        const heroVisual = hero.querySelector('.hero-visual');
        
        if (heroContent) {
            heroContent.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
            heroContent.style.opacity = 1 - (scrolled / 700);
        }
        
        if (heroVisual) {
            heroVisual.style.transform = 'translateY(' + (scrolled * 0.2) + 'px)';
        }
    });
})();

/* Service Cards Tilt Effect */
(function() {
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
})();

/* Typing Effect for Hero (Alternative to Typed.js) */
(function() {
    const texts = ['AI Solutions', 'Web Development', 'App Development', 'Automation'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    const typingElement = document.querySelector('.gradient-text');
    
    if (!typingElement || typingElement.textContent !== 'Your Partner in AI') return;
    
    // Keep the original text, no typing effect needed for current design
})();

/* Image Lazy Loading */
(function() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(function(img) {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for older browsers
        images.forEach(function(img) {
            img.src = img.dataset.src;
        });
    }
})();

/* Video Section Enhancement */
(function() {
    const videoWrapper = document.querySelector('.video-wrapper');
    
    if (!videoWrapper) return;
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                videoWrapper.classList.add('in-view');
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(videoWrapper);
})();

/* Portfolio Card Hover Enhancement */
(function() {
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    
    portfolioCards.forEach(function(card) {
        const image = card.querySelector('.portfolio-image img');
        
        card.addEventListener('mouseenter', function() {
            if (image) {
                image.style.transform = 'scale(1.1)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (image) {
                image.style.transform = 'scale(1)';
            }
        });
    });
})();

/* Tech Items Stagger Animation */
(function() {
    const techItems = document.querySelectorAll('.tech-item');
    
    techItems.forEach(function(item, index) {
        item.style.transitionDelay = (index * 0.1) + 's';
    });
})();

/* Process Timeline Animation */
(function() {
    const processItems = document.querySelectorAll('.process-item');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.2 });
    
    processItems.forEach(function(item) {
        observer.observe(item);
    });
})();

/* Easter Egg - Konami Code */
(function() {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', function(e) {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            
            if (konamiIndex === konamiCode.length) {
                // Easter egg activated!
                document.body.style.animation = 'rainbow 2s linear';
                setTimeout(function() {
                    document.body.style.animation = '';
                }, 2000);
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
})();

/* Console Message */
console.log('%c🚀 CodeNeutronAI', 'font-size: 24px; font-weight: bold; color: #6366f1;');
console.log('%cBuilding the Future with AI', 'font-size: 14px; color: #8b5cf6;');
console.log('%cInterested in working with us? Contact us at info@codeneutronai.com', 'font-size: 12px; color: #9ca3af;');

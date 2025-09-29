// Enhanced Personal Website JavaScript
// Modern, accessible, and feature-rich functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    // Initialize all components
    initializeNavigation();
    initializeThemeToggle();
    initializeSmoothScrolling();
    initializeScrollAnimations();
    initializeSkillBars();
    initializeLazyLoading();
    initializeAccessibility();
    initializeScrollIndicator();
    initializeIntersectionObserver();
}

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');

            // Update ARIA attributes for accessibility
            const isExpanded = navMenu.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Active navigation link highlighting
    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    const scrollPos = window.scrollY + 100; // Offset for navbar height

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollPos >= sectionTop && scrollPos <= sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Theme toggle functionality
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');

    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);

        // Add animation class for smooth transition
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    });

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);

        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
            themeToggle.setAttribute('aria-label', 'Switch to light mode');
        } else {
            themeIcon.className = 'fas fa-moon';
            themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
    }
}

// Enhanced smooth scrolling
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetSection.offsetTop - navbarHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update URL without jumping
                history.pushState(null, null, targetId);

                // Focus management for accessibility
                targetSection.setAttribute('tabindex', '-1');
                targetSection.focus();
                setTimeout(() => {
                    targetSection.removeAttribute('tabindex');
                }, 1000);
            }
        });
    });
}

// Scroll animations and effects
function initializeScrollAnimations() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    let ticking = false;

    function updateScrollEffects() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Navbar background opacity
        if (scrollTop > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.9)';
        }

        // Hide/show navbar on scroll direction (optional)
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        ticking = false;
    }

    function requestScrollUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
}

// Skill bars animation
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    const animatedBars = new Set();

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animatedBars.has(entry.target)) {
                animateSkillBar(entry.target);
                animatedBars.add(entry.target);
            }
        });
    }, observerOptions);

    skillBars.forEach(bar => {
        observer.observe(bar);
    });

    function animateSkillBar(bar) {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';

        setTimeout(() => {
            bar.style.width = targetWidth;
            bar.style.transition = 'width 1.5s ease-out';
        }, 100);
    }
}

// Lazy loading for images and content
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const lazyContent = document.querySelectorAll('[data-lazy]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });

    // Animate content on scroll
    const contentObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });

    lazyContent.forEach(content => {
        contentObserver.observe(content);
    });
}

// Accessibility enhancements
function initializeAccessibility() {
    // Skip to main content link
    const skipLink = createSkipLink();
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Keyboard navigation for cards
    const interactiveCards = document.querySelectorAll('.card, .project-card, .experience-card');
    interactiveCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                card.click();
            }
        });
    });

    // Improve focus management
    const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );

    // Add focus ring styles dynamically for keyboard users
    let isUsingKeyboard = false;

    document.addEventListener('keydown', () => {
        isUsingKeyboard = true;
        document.body.classList.add('keyboard-navigation');
    });

    document.addEventListener('mousedown', () => {
        isUsingKeyboard = false;
        document.body.classList.remove('keyboard-navigation');
    });

    function createSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-color);
            color: white;
            padding: 8px 16px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 9999;
            transition: top 0.3s;
        `;

        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });

        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        return skipLink;
    }
}

// Scroll indicator
function initializeScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');

    if (scrollIndicator) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const viewportHeight = window.innerHeight;

            if (scrolled > viewportHeight * 0.3) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.transform = 'translateX(-50%) translateY(10px)';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.transform = 'translateX(-50%) translateY(0)';
            }
        });

        // Click handler for scroll indicator
        scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// Intersection Observer for animations
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');

                // Stagger animations for child elements
                const children = entry.target.querySelectorAll('.stagger-animation');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate-in');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Observe sections and cards
    const elementsToObserve = document.querySelectorAll(
        'section, .card, .experience-card, .project-card, .achievement-card, .stat-card'
    );

    elementsToObserve.forEach(element => {
        observer.observe(element);
    });
}

// Utility functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Error handling and fallbacks
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // Could implement error reporting here
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}

// Service Worker registration (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Contact form handling (if form exists)
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const submitButton = contactForm.querySelector('button[type="submit"]');

            // Show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            try {
                // Replace with your form handling endpoint
                const response = await fetch('/contact', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    showNotification('Message sent successfully!', 'success');
                    contactForm.reset();
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                showNotification('Failed to send message. Please try again.', 'error');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
            }
        });
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-color)' : 
                    type === 'error' ? 'var(--error-color)' : 'var(--primary-color)'};
        color: white;
        padding: 12px 20px;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: 9999;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Initialize contact form if present
document.addEventListener('DOMContentLoaded', initializeContactForm);

// Export functions for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeWebsite,
        updateActiveNavLink,
        showNotification,
        debounce,
        throttle
    };
}
// Visitor Counter with Country Detection
class VisitorCounter {
    constructor() {
        this.storageKey = 'visitor-count';
        this.lastVisitKey = 'last-visit';
        this.init();
    }

    async init() {
        await this.detectCountry();
        this.updateVisitorCount();
    }

    async detectCountry() {
        try {
            // Using ipapi.co for geolocation (free tier available)
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            
            if (data.country_code) {
                this.updateCountryInfo(data.country_code, data.country_name);
            }
        } catch (error) {
            console.log('Could not detect country:', error);
            // Fallback - show world icon
            this.updateCountryInfo('WORLD', 'Unknown');
        }
    }

    updateCountryInfo(countryCode, countryName) {
        const flagElement = document.getElementById('country-flag');
        const nameElement = document.getElementById('country-name');
        
        if (flagElement && nameElement) {
            if (countryCode === 'WORLD') {
                flagElement.textContent = '🌍';
                nameElement.textContent = 'Global Visitor';
            } else {
                // Convert country code to flag emoji
                const flag = this.getCountryFlag(countryCode);
                flagElement.textContent = flag;
                nameElement.textContent = countryName;
            }
        }
    }

    getCountryFlag(countryCode) {
        // Convert country code to flag emoji
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt());
        return String.fromCodePoint(...codePoints);
    }

    updateVisitorCount() {
        const now = Date.now();
        const lastVisit = localStorage.getItem(this.lastVisitKey);
        const currentCount = parseInt(localStorage.getItem(this.storageKey) || '0');
        
        // Only count as new visit if last visit was more than 1 hour ago
        const oneHour = 60 * 60 * 1000;
        if (!lastVisit || (now - parseInt(lastVisit)) > oneHour) {
            const newCount = currentCount + 1;
            localStorage.setItem(this.storageKey, newCount.toString());
            localStorage.setItem(this.lastVisitKey, now.toString());
            this.displayCount(newCount);
        } else {
            this.displayCount(currentCount);
        }
    }

    displayCount(count) {
        const countElement = document.getElementById('visit-count');
        if (countElement) {
            // Add animation
            countElement.style.opacity = '0';
            setTimeout(() => {
                countElement.textContent = count.toLocaleString();
                countElement.style.opacity = '1';
            }, 200);
        }
    }
}

// Initialize visitor counter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // ... your existing code ...
    new VisitorCounter();
});


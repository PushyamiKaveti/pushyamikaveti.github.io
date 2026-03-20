/* ========================================
   Dr. Pushyami Kaveti - Portfolio Scripts
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Navbar scroll effect ----
    const navbar = document.getElementById('navbar');
    const handleScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ---- Mobile menu toggle ----
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => navMenu.classList.remove('active'));
    });

    // ---- Hero particles (subtle floating dots) ----
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (8 + Math.random() * 12) + 's';
            particle.style.animationDelay = Math.random() * 10 + 's';
            particle.style.width = particle.style.height = (2 + Math.random() * 3) + 'px';
            particlesContainer.appendChild(particle);
        }
    }

    // ---- Scroll-triggered fade-in animations ----
    const animateElements = document.querySelectorAll(
        '.research-card, .field-card, .os-card, .teaching-card, .media-card, ' +
        '.pub-item, .exp-item, .highlight-card, .contact-card, .talk-item, ' +
        '.about-text, .about-sidebar, .section-title, .section-subtitle, .blog-card'
    );

    animateElements.forEach(el => el.classList.add('fade-in'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.01, rootMargin: '0px 0px 50px 0px' });

    animateElements.forEach(el => observer.observe(el));

    // ---- Staggered animation for grid children ----
    const grids = document.querySelectorAll(
        '.research-grid, .field-grid, .os-grid, .teaching-grid, .media-grid, ' +
        '.contact-grid, .about-highlights, .pub-list, .talks-list, .exp-timeline, .blog-grid'
    );

    const gridObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const children = entry.target.querySelectorAll('.fade-in');
                children.forEach((child, i) => {
                    child.style.transitionDelay = (i * 0.07) + 's';
                    child.classList.add('visible');
                });
                gridObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.01, rootMargin: '0px 0px 50px 0px' });

    grids.forEach(grid => gridObserver.observe(grid));

    // ---- Active nav link highlighting ----
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');

    const highlightNav = () => {
        const scrollPos = window.scrollY + 150;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    window.addEventListener('scroll', highlightNav, { passive: true });

    // ---- Smooth scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

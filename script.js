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

    // ---- News pagination ----
    const newsList = document.querySelector('.news-list[data-page-size]');
    const newsPagination = document.querySelector('.news-pagination');
    if (newsList && newsPagination) {
        const newsItems = Array.from(newsList.querySelectorAll('.news-item'));
        const pageSize = Number(newsList.dataset.pageSize) || 5;
        const totalPages = Math.ceil(newsItems.length / pageSize);
        const prevButton = newsPagination.querySelector('[data-news-page="prev"]');
        const nextButton = newsPagination.querySelector('[data-news-page="next"]');
        const pageLinks = Array.from(newsPagination.querySelectorAll('.news-page-link'));

        const updateArrowState = (link, disabled) => {
            link.classList.toggle('is-disabled', disabled);
            link.setAttribute('aria-disabled', disabled ? 'true' : 'false');
            link.tabIndex = disabled ? -1 : 0;
        };

        const renderNewsPage = (pageIndex) => {
            const currentPage = Math.max(1, Math.min(pageIndex, totalPages));
            const start = (currentPage - 1) * pageSize;
            const end = start + pageSize;
            newsList.dataset.currentPage = String(currentPage);

            newsItems.forEach((item, index) => {
                const isVisible = index >= start && index < end;
                item.hidden = !isVisible;
                item.classList.toggle('is-hidden', !isVisible);
                item.style.display = isVisible ? '' : 'none';
            });

            pageLinks.forEach((link, index) => {
                const isCurrent = index + 1 === currentPage;
                link.classList.toggle('is-active', isCurrent);
                if (isCurrent) {
                    link.setAttribute('aria-current', 'page');
                } else {
                    link.removeAttribute('aria-current');
                }
            });

            updateArrowState(prevButton, currentPage === 1);
            updateArrowState(nextButton, currentPage === totalPages);
        };

        const currentPage = Number(newsList.dataset.currentPage) || 1;
        renderNewsPage(currentPage);

        pageLinks.forEach((link) => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                renderNewsPage(Number(link.dataset.newsPageLink));
            });
        });

        prevButton.addEventListener('click', (event) => {
            event.preventDefault();
            if (prevButton.classList.contains('is-disabled')) return;
            renderNewsPage((Number(newsList.dataset.currentPage) || 1) - 1);
        });

        nextButton.addEventListener('click', (event) => {
            event.preventDefault();
            if (nextButton.classList.contains('is-disabled')) return;
            renderNewsPage((Number(newsList.dataset.currentPage) || 1) + 1);
        });
    }


    // ---- Publications pagination ----
    const pubList = document.querySelector('.pub-list[data-page-size]');
    const pubPagination = document.querySelector('.pub-pagination');
    if (pubList && pubPagination) {
        const pubItems = Array.from(pubList.querySelectorAll('.pub-item'));
        const pageSize = Number(pubList.dataset.pageSize) || 5;
        const totalPages = Math.ceil(pubItems.length / pageSize);
        const prevButton = pubPagination.querySelector('[data-pub-page="prev"]');
        const nextButton = pubPagination.querySelector('[data-pub-page="next"]');
        const pageLinks = Array.from(pubPagination.querySelectorAll('.pub-page-link'));

        const updateArrowState = (link, disabled) => {
            link.classList.toggle('is-disabled', disabled);
            link.setAttribute('aria-disabled', disabled ? 'true' : 'false');
            link.tabIndex = disabled ? -1 : 0;
        };

        const renderPubPage = (pageIndex) => {
            const currentPage = Math.max(1, Math.min(pageIndex, totalPages));
            const start = (currentPage - 1) * pageSize;
            const end = start + pageSize;
            pubList.dataset.currentPage = String(currentPage);

            pubItems.forEach((item, index) => {
                const isVisible = index >= start && index < end;
                item.hidden = !isVisible;
                item.classList.toggle('is-hidden', !isVisible);
                item.style.display = isVisible ? '' : 'none';
            });

            pageLinks.forEach((link, index) => {
                const isCurrent = index + 1 === currentPage;
                link.classList.toggle('is-active', isCurrent);
                if (isCurrent) {
                    link.setAttribute('aria-current', 'page');
                } else {
                    link.removeAttribute('aria-current');
                }
            });

            updateArrowState(prevButton, currentPage === 1);
            updateArrowState(nextButton, currentPage === totalPages);
        };

        const currentPage = Number(pubList.dataset.currentPage) || 1;
        renderPubPage(currentPage);

        pageLinks.forEach((link) => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                renderPubPage(Number(link.dataset.pubPageLink));
            });
        });

        prevButton.addEventListener('click', (event) => {
            event.preventDefault();
            if (prevButton.classList.contains('is-disabled')) return;
            renderPubPage((Number(pubList.dataset.currentPage) || 1) - 1);
        });

        nextButton.addEventListener('click', (event) => {
            event.preventDefault();
            if (nextButton.classList.contains('is-disabled')) return;
            renderPubPage((Number(pubList.dataset.currentPage) || 1) + 1);
        });
    }
});

/* ========================================
   Pushyami Kaveti - Portfolio Scripts
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const handleScroll = () => {
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 60);
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => navMenu.classList.remove('active'));
        });
    }

    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (let i = 0; i < 30; i += 1) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDuration = `${8 + Math.random() * 12}s`;
            particle.style.animationDelay = `${Math.random() * 10}s`;
            particle.style.width = `${2 + Math.random() * 3}px`;
            particle.style.height = particle.style.width;
            particlesContainer.appendChild(particle);
        }
    }

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

    const grids = document.querySelectorAll(
        '.research-grid, .field-grid, .os-grid, .teaching-grid, .media-grid, ' +
        '.contact-grid, .about-highlights, .pub-list, .talks-list, .exp-timeline, .blog-grid'
    );

    const gridObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const children = entry.target.querySelectorAll('.fade-in');
                children.forEach((child, i) => {
                    child.style.transitionDelay = `${i * 0.07}s`;
                    child.classList.add('visible');
                });
                gridObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.01, rootMargin: '0px 0px 50px 0px' });

    grids.forEach(grid => gridObserver.observe(grid));

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const highlightNav = () => {
        const scrollPos = window.scrollY + 150;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                const matchingLink = Array.from(navLinks).find(link => link.getAttribute('href') === `#${id}`);
                if (!matchingLink) return;
                navLinks.forEach(link => link.classList.remove('active'));
                matchingLink.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', highlightNav, { passive: true });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', event => {
            event.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    const setupPagination = ({
        listSelector,
        itemSelector,
        paginationSelector,
        currentPageKey,
        prevSelector,
        nextSelector,
        linkContainerSelector,
        linkClass,
        linkDataKey,
    }) => {
        const list = document.querySelector(listSelector);
        const pagination = document.querySelector(paginationSelector);
        if (!list || !pagination) return;

        const items = Array.from(list.querySelectorAll(itemSelector));
        const pageSize = Number(list.dataset.pageSize) || 5;
        const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
        const prevButton = pagination.querySelector(prevSelector);
        const nextButton = pagination.querySelector(nextSelector);
        const linkContainer = pagination.querySelector(linkContainerSelector);

        const updateArrowState = (link, disabled) => {
            if (!link) return;
            link.classList.toggle('is-disabled', disabled);
            link.setAttribute('aria-disabled', disabled ? 'true' : 'false');
            link.tabIndex = disabled ? -1 : 0;
        };

        const renderPageLinks = currentPage => {
            if (!linkContainer) return [];
            linkContainer.innerHTML = '';
            const pageLinks = [];
            for (let page = 1; page <= totalPages; page += 1) {
                const link = document.createElement('a');
                link.className = `${linkClass}${page === currentPage ? ' is-active' : ''}`;
                link.href = '#';
                link.dataset[linkDataKey] = String(page);
                link.textContent = String(page);
                if (page === currentPage) {
                    link.setAttribute('aria-current', 'page');
                }
                link.addEventListener('click', event => {
                    event.preventDefault();
                    render(page);
                });
                linkContainer.appendChild(link);
                pageLinks.push(link);
            }
            return pageLinks;
        };

        const render = pageIndex => {
            const currentPage = Math.max(1, Math.min(pageIndex, totalPages));
            const start = (currentPage - 1) * pageSize;
            const end = start + pageSize;
            list.dataset[currentPageKey] = String(currentPage);
            items.forEach((item, index) => {
                const isVisible = index >= start && index < end;
                item.hidden = !isVisible;
                item.classList.toggle('is-hidden', !isVisible);
                item.style.display = isVisible ? '' : 'none';
            });
            renderPageLinks(currentPage);
            updateArrowState(prevButton, currentPage === 1);
            updateArrowState(nextButton, currentPage === totalPages);
        };

        if (prevButton) {
            prevButton.addEventListener('click', event => {
                event.preventDefault();
                if (prevButton.classList.contains('is-disabled')) return;
                render((Number(list.dataset[currentPageKey]) || 1) - 1);
            });
        }
        if (nextButton) {
            nextButton.addEventListener('click', event => {
                event.preventDefault();
                if (nextButton.classList.contains('is-disabled')) return;
                render((Number(list.dataset[currentPageKey]) || 1) + 1);
            });
        }

        render(Number(list.dataset[currentPageKey]) || 1);
    };

    setupPagination({
        listSelector: '.news-list[data-page-size]',
        itemSelector: '.news-item',
        paginationSelector: '.news-pagination',
        currentPageKey: 'currentPage',
        prevSelector: '[data-news-page="prev"]',
        nextSelector: '[data-news-page="next"]',
        linkContainerSelector: '.news-page-links',
        linkClass: 'news-page-button news-page-link',
        linkDataKey: 'newsPageLink',
    });

    setupPagination({
        listSelector: '.pub-list[data-page-size]',
        itemSelector: '.pub-item',
        paginationSelector: '.pub-pagination',
        currentPageKey: 'currentPage',
        prevSelector: '[data-pub-page="prev"]',
        nextSelector: '[data-pub-page="next"]',
        linkContainerSelector: '.pub-page-links',
        linkClass: 'pub-page-button pub-page-link',
        linkDataKey: 'pubPageLink',
    });
});

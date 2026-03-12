document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Header & Scroll Progress
    const header = document.getElementById('header');
    const scrollProgressBar = document.getElementById('scroll-progress-bar');
    
    window.addEventListener('scroll', () => {
        // Sticky Header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Scroll Progress Bar
        if (scrollProgressBar) {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
            const clientHeight = document.documentElement.clientHeight || window.innerHeight;
            const scrolled = (scrollTop / (scrollHeight - clientHeight)) * 100;
            scrollProgressBar.style.width = scrolled + '%';
        }
    });

    // 2. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');

    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (nav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        });
    });

    // 3. Scroll Reveal Animations using Intersection Observer
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 4. Parallax Effect for Hero Background Shapes
    const heroSection = document.getElementById('home');
    const bgShape1 = document.querySelector('.hero-bg-shape');
    const bgShape2 = document.querySelector('.hero-bg-shape-2');
    const imageBlob = document.querySelector('.image-blob');

    if (heroSection && bgShape1 && bgShape2 && imageBlob) {
        heroSection.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;

            bgShape1.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
            bgShape2.style.transform = `translate(${x * -40}px, ${y * -40}px)`;
            imageBlob.style.transform = `translate(${x * 20}px, ${y * 20}px) rotate(-3deg)`;
        });

        // Reset on mouse leave
        heroSection.addEventListener('mouseleave', () => {
            bgShape1.style.transform = `translate(0px, 0px)`;
            bgShape2.style.transform = `translate(0px, 0px)`;
            imageBlob.style.transform = `translate(0px, 0px) rotate(-3deg)`;
        });
    }
});

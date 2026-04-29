document.addEventListener('DOMContentLoaded', () => {

  // ── SPLASH SCREEN ──────────────────────────────────────────
  const splash = document.getElementById('splash-screen');
  // Add loader bar to splash
  const loaderDiv = document.createElement('div');
  loaderDiv.className = 'splash-loader';
  loaderDiv.innerHTML = '<div class="splash-loader-bar"></div>';
  splash.querySelector('.splash-content').appendChild(loaderDiv);

  setTimeout(() => {
    splash.classList.add('hide');
    document.body.style.overflow = '';
  }, 2600);
  document.body.style.overflow = 'hidden';

  // ── SCROLL PROGRESS ────────────────────────────────────────
  const progressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = scrolled + '%';
  });

  // ── STICKY HEADER ──────────────────────────────────────────
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  });

  // ── MOBILE MENU ────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (nav.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  // ── ACTIVE NAV LINK ────────────────────────────────────────
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => observer.observe(s));

  // ── SCROLL REVEAL ──────────────────────────────────────────
  const reveals = document.querySelectorAll('[data-reveal]');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.style.getPropertyValue('--delay') || '0ms';
        entry.target.style.transitionDelay = delay;
        entry.target.classList.add('revealed');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => revealObs.observe(el));

  // ── CUSTOM CURSOR ──────────────────────────────────────────
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (dot && ring) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    });
    const animRing = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(animRing);
    };
    animRing();
    document.querySelectorAll('a, button, .service-card, .gallery-item').forEach(el => {
      el.addEventListener('mouseenter', () => { dot.classList.add('hovered'); ring.classList.add('hovered'); });
      el.addEventListener('mouseleave', () => { dot.classList.remove('hovered'); ring.classList.remove('hovered'); });
    });
  }

  // ── SERVICE CARD TILT ──────────────────────────────────────
  document.querySelectorAll('.service-card, .testimonial-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 12;
      const y = ((e.clientY - r.top) / r.height - 0.5) * -12;
      card.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ── SMOOTH COUNT-UP (stats) ────────────────────────────────
  const countUp = (el, target, suffix) => {
    let count = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      count = Math.min(count + step, target);
      el.textContent = count + suffix;
      if (count >= target) clearInterval(timer);
    }, 24);
  };
  const statsObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-item strong').forEach(el => {
          const txt = el.textContent;
          if (txt.includes('500')) countUp(el, 500, '+');
          else if (txt.includes('4.7')) { /* keep rating static */ }
          else if (txt.includes('3')) countUp(el, 3, '+');
        });
        statsObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) statsObs.observe(statsEl);

});

/**
 * MIKARO STUDIO — nav.js
 * Navigation: scroll effects, active links, mobile menu, reveal animations, tabs, FAQ
 */
'use strict';

/* ── NAVIGATION ── */
const Nav = (() => {
  let navEl, mobOverlay, hamburger, sections;
  const THRESHOLD = 60;

  function init() {
    navEl      = document.getElementById('nav');
    mobOverlay = document.getElementById('mobOverlay');
    hamburger  = document.getElementById('hbg');
    sections   = Array.from(document.querySelectorAll('section[id]'));

    if (!navEl) return;

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scroll', updateActiveLink, { passive: true });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobMenu(); });

    if (mobOverlay) {
      mobOverlay.addEventListener('click', e => { if (e.target === mobOverlay) closeMobMenu(); });
    }

    document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', handleAnchorClick));
    onScroll();
    updateActiveLink();
  }

  function onScroll() {
    if (!navEl) return;
    navEl.classList.toggle('scrolled', window.scrollY > THRESHOLD);
  }

  function updateActiveLink() {
    const y = window.scrollY + 140;
    let current = '';
    sections.forEach(s => { if (s.offsetTop <= y) current = s.id; });
    document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  function handleAnchorClick(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const wasOpen = mobOverlay?.classList.contains('open');
    closeMobMenu();
    setTimeout(() => {
      const navH = navEl?.offsetHeight || 72;
      window.scrollTo({ top: target.offsetTop - navH - 16, behavior: 'smooth' });
    }, wasOpen ? 400 : 0);
  }

  function openMobMenu() {
    if (!mobOverlay || !hamburger) return;
    mobOverlay.scrollTop = 0;
    mobOverlay.classList.add('open');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.querySelectorAll('.float-btn, .chat-bubble, .chat-panel').forEach(el => el.style.visibility = 'hidden');
  }

  function closeMobMenu() {
    if (!mobOverlay || !hamburger) return;
    mobOverlay.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
    document.querySelectorAll('.float-btn, .chat-bubble').forEach(el => el.style.visibility = '');
  }

  window.openMobMenu  = openMobMenu;
  window.closeMobMenu = closeMobMenu;

  return { init };
})();

/* ── SCROLL REVEAL ── */
const Reveal = (() => {
  function init() {
    const els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: .1, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => {
      // Stagger children in grid containers
      const grid = el.closest('.pkg-grid, .proof-grid, .design-grid, .testimonials-grid, .journal-grid, .faq-grid');
      if (grid) {
        const idx = Array.from(grid.querySelectorAll('[data-reveal]')).indexOf(el);
        el.style.transitionDelay = (idx % 3) * .1 + 's';
      }
      io.observe(el);
    });
  }
  return { init };
})();

/* ── DESIGN PORTFOLIO TABS ── */
const DesignTabs = (() => {
  function init() {
    document.querySelectorAll('.design-tab').forEach(tab => {
      tab.addEventListener('click', () => activate(tab.dataset.tab, tab));
    });
  }

  function activate(tabName, btn) {
    document.querySelectorAll('.design-tab').forEach(t => t.classList.toggle('active', t === btn));
    document.querySelectorAll('.design-grid-panel').forEach(panel => {
      const show = panel.dataset.panel === tabName;
      panel.style.display = show ? 'grid' : 'none';
      if (show) {
        requestAnimationFrame(() => {
          panel.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('visible'));
        });
      }
    });
  }

  // Legacy onclick fallback
  window.showDesignTab = (tabName, btn) => activate(tabName, btn);
  return { init };
})();

/* ── FAQ ACCORDION ── */
const FAQ = (() => {
  function init() {
    document.querySelectorAll('.faq-item').forEach(item => {
      item.addEventListener('click', () => toggle(item));
    });
  }
  function toggle(item) {
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  }
  window.toggleFaq = toggle;
  return { init };
})();

/* ── COUNTER ANIMATION ── */
const Counter = (() => {
  function init() {
    const els = document.querySelectorAll('[data-count]');
    if (!els.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCount(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: .5 });
    els.forEach(el => io.observe(el));
  }

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const dur    = 1400;
    const start  = performance.now();
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const update = now => {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3); // ease-out-cubic
      el.textContent = prefix + Math.round(ease * target) + suffix;
      if (t < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }
  return { init };
})();

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  Nav.init();
  Reveal.init();
  DesignTabs.init();
  FAQ.init();
  Counter.init();
});

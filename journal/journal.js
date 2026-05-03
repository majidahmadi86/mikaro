/**
 * MIKARO STUDIO — journal.js
 * Static JSON CMS renderer.
 * Loads journal/data.json and renders article cards.
 * Works on: index.html (preview, 3 articles) + journal/index.html (full list + filter).
 * All content is Claude-generated and stored in data.json.
 * No backend. No build step. Pure static.
 */
(function () {
  'use strict';

  /* ─── CONFIG ─── */
  const DATA_URL        = '/journal/data.json';
  const PREVIEW_COUNT   = 3;       // how many to show on homepage
  const CARDS_PER_PAGE  = 9;       // journal index pagination

  /* ─── CATEGORY COLOUR MAP ─── */
  const CATEGORY_COLOURS = {
    'Branding'         : '#C9A84C',
    'AI Marketing'     : '#2563eb',
    'Web Design'       : '#0d9488',
    'Digital Marketing': '#7c3aed',
    'English'          : '#dc2626',
    'Strategy'         : '#1B2A4A',
    'Default'          : '#64748B'
  };

  function categoryColour(cat) {
    return CATEGORY_COLOURS[cat] || CATEGORY_COLOURS['Default'];
  }

  /* ─── DATE FORMATTER ─── */
  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric'
      });
    } catch (e) {
      return iso || '';
    }
  }

  /* ─── READING TIME ESTIMATOR ─── */
  function readingTime(bodyText) {
    if (!bodyText) return '';
    const words = bodyText.trim().split(/\s+/).length;
    const mins  = Math.max(1, Math.round(words / 200));
    return mins + ' min read';
  }

  /* ─── SAFE TEXT (prevent XSS in rendered HTML) ─── */
  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  /* ─── PLACEHOLDER GRADIENT (when no image) ─── */
  const GRADIENTS = [
    'linear-gradient(135deg,#e8f4ff,#c3dcf5)',
    'linear-gradient(135deg,#fff8e8,#f5e0b5)',
    'linear-gradient(135deg,#edfaf5,#b5e8d5)',
    'linear-gradient(135deg,#fdf0f0,#f5c6c6)',
    'linear-gradient(135deg,#f0eeff,#d5c8f5)',
    'linear-gradient(135deg,#e8fff8,#b5e8d5)'
  ];

  function placeholderGradient(index) {
    return GRADIENTS[index % GRADIENTS.length];
  }

  /* ─── BUILD CARD HTML ─── */
  function buildCard(article, index) {
    const colour   = categoryColour(article.category);
    const date     = formatDate(article.date);
    const readTime = readingTime(article.body);
    const href     = '/journal/' + esc(article.slug) + '/';

    /* Image or gradient placeholder */
    let imgHTML;
    if (article.image) {
      imgHTML = '<img class="journal-card-img" src="' + esc(article.image) +
                '" alt="' + esc(article.title) + '" loading="lazy" width="400" height="200"/>';
    } else {
      const icon = '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>';
      imgHTML = '<div class="journal-card-img-placeholder" style="background:' +
                placeholderGradient(index) + '">' + icon + '</div>';
    }

    return '<article class="journal-card" data-reveal data-category="' + esc(article.category) + '">' +
      '<a href="' + href + '" aria-label="Read: ' + esc(article.title) + '">' + imgHTML + '</a>' +
      '<div class="journal-card-body">' +
        '<div class="journal-card-meta">' +
          '<span class="journal-card-category" style="color:' + colour + '">' + esc(article.category) + '</span>' +
          '<span class="journal-card-date">' + esc(date) + '</span>' +
          (readTime ? '<span class="journal-card-date">&middot; ' + esc(readTime) + '</span>' : '') +
        '</div>' +
        '<h3 class="journal-card-title"><a href="' + href + '">' + esc(article.title) + '</a></h3>' +
        '<p class="journal-card-excerpt">' + esc(article.excerpt) + '</p>' +
        '<a href="' + href + '" class="journal-card-link">Read more &#x2192;</a>' +
      '</div>' +
    '</article>';
  }

  /* ─── SKELETON LOADER ─── */
  function buildSkeleton() {
    const style = 'background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);background-size:200px 100%;animation:shimmer 1.4s infinite;border-radius:4px;';
    return '<div class="journal-card">' +
      '<div style="height:200px;background:#f0f0f0;"></div>' +
      '<div class="journal-card-body" style="gap:.75rem;display:flex;flex-direction:column;">' +
        '<div style="height:14px;width:40%;' + style + '"></div>' +
        '<div style="height:20px;width:90%;' + style + '"></div>' +
        '<div style="height:14px;width:80%;' + style + '"></div>' +
        '<div style="height:14px;width:70%;' + style + '"></div>' +
      '</div>' +
    '</div>';
  }

  /* ─── FETCH data.json with timeout + cache ─── */
  async function fetchArticles() {
    const CACHE_KEY = 'mikaro_journal_cache';
    const CACHE_TTL = 5 * 60 * 1000; // 5 min

    /* Check sessionStorage cache first */
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.ts < CACHE_TTL) {
          return parsed.data;
        }
      }
    } catch (_) { /* sessionStorage unavailable */ }

    /* Fetch with 8s timeout */
    const controller = new AbortController();
    const timeout    = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch(DATA_URL, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });
      clearTimeout(timeout);

      if (!res.ok) throw new Error('HTTP ' + res.status);

      const data = await res.json();
      const articles = Array.isArray(data.articles) ? data.articles : [];

      /* Cache result */
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: articles }));
      } catch (_) {}

      return articles;
    } catch (err) {
      clearTimeout(timeout);
      console.warn('[Journal] Could not load articles:', err.message);
      return [];
    }
  }

  /* ─── HOMEPAGE PREVIEW (3 latest) ─── */
  async function initPreview() {
    const container = document.getElementById('journalPreview');
    if (!container) return;

    /* Show skeletons while loading */
    const grid = container.closest('.journal-grid') || container;
    grid.innerHTML = buildSkeleton() + buildSkeleton() + buildSkeleton();

    const articles = await fetchArticles();

    if (!articles.length) {
      /* Keep placeholder cards already in HTML */
      container.closest('.journal-section') &&
        (container.closest('.journal-section').style.display = '');
      return;
    }

    const latest = articles
      .filter(a => a.published !== false)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, PREVIEW_COUNT);

    grid.innerHTML = latest.map((a, i) => buildCard(a, i)).join('');

    /* Trigger reveal on new elements */
    triggerReveal(grid);
  }

  /* ─── JOURNAL INDEX PAGE ─── */
  async function initJournalIndex() {
    const grid        = document.getElementById('journalGrid');
    const filterBtns  = document.querySelectorAll('[data-filter]');
    const countEl     = document.getElementById('articleCount');
    const noResultsEl = document.getElementById('noResults');

    if (!grid) return;

    /* Show skeletons */
    grid.innerHTML = Array(6).fill(buildSkeleton()).join('');

    const articles = await fetchArticles();

    if (!articles.length) {
      grid.innerHTML = '<p style="color:var(--gray-600);grid-column:1/-1;padding:2rem 0">No articles found. Check back soon.</p>';
      return;
    }

    const published = articles
      .filter(a => a.published !== false)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    let currentFilter = 'All';
    let currentPage   = 1;

    function filtered() {
      if (currentFilter === 'All') return published;
      return published.filter(a => a.category === currentFilter);
    }

    function render() {
      const items  = filtered();
      const total  = items.length;
      const start  = (currentPage - 1) * CARDS_PER_PAGE;
      const page   = items.slice(start, start + CARDS_PER_PAGE);

      if (countEl) countEl.textContent = total + ' article' + (total !== 1 ? 's' : '');

      if (!page.length) {
        grid.innerHTML = '';
        if (noResultsEl) noResultsEl.style.display = 'block';
        return;
      }
      if (noResultsEl) noResultsEl.style.display = 'none';

      grid.innerHTML = page.map((a, i) => buildCard(a, start + i)).join('');
      triggerReveal(grid);

      /* Pagination */
      renderPagination(Math.ceil(total / CARDS_PER_PAGE));
    }

    /* ── Pagination ── */
    function renderPagination(totalPages) {
      const pag = document.getElementById('pagination');
      if (!pag) return;
      if (totalPages <= 1) { pag.innerHTML = ''; return; }

      let html = '';
      for (let p = 1; p <= totalPages; p++) {
        html += '<button class="journal-page-btn' + (p === currentPage ? ' active' : '') +
                '" data-page="' + p + '">' + p + '</button>';
      }
      pag.innerHTML = html;

      pag.querySelectorAll('.journal-page-btn').forEach(btn => {
        btn.addEventListener('click', function () {
          currentPage = parseInt(this.dataset.page, 10);
          render();
          grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
    }

    /* ── Category filter ── */
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        currentFilter = this.dataset.filter;
        currentPage   = 1;
        filterBtns.forEach(b => b.classList.toggle('active', b === this));
        render();
      });
    });

    /* ── Search ── */
    const searchInput = document.getElementById('journalSearch');
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        const q = this.value.trim().toLowerCase();
        const searchFiltered = filtered().filter(a =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          (a.category || '').toLowerCase().includes(q)
        );
        if (!searchFiltered.length) {
          grid.innerHTML = '';
          if (noResultsEl) noResultsEl.style.display = 'block';
        } else {
          if (noResultsEl) noResultsEl.style.display = 'none';
          grid.innerHTML = searchFiltered.map((a, i) => buildCard(a, i)).join('');
          triggerReveal(grid);
        }
      });
    }

    render();
  }

  /* ─── TRIGGER REVEAL on newly injected elements ─── */
  function triggerReveal(container) {
    const els = container.querySelectorAll('[data-reveal]');
    if (!els.length) return;

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
        });
      }, { threshold: 0.1 });
      els.forEach(el => io.observe(el));
    } else {
      els.forEach(el => el.classList.add('visible'));
    }
  }

  /* ─── ARTICLE PAGE — table of contents + reading progress ─── */
  function initArticlePage() {
    const article = document.querySelector('.article-body');
    if (!article) return;

    /* Reading progress bar */
    const bar = document.getElementById('readingProgress');
    if (bar) {
      window.addEventListener('scroll', function () {
        const el     = document.documentElement;
        const top    = el.scrollTop || document.body.scrollTop;
        const height = el.scrollHeight - el.clientHeight;
        bar.style.width = (height > 0 ? (top / height) * 100 : 0) + '%';
      }, { passive: true });
    }

    /* Auto table of contents */
    const tocContainer = document.getElementById('articleToc');
    if (tocContainer) {
      const headings = article.querySelectorAll('h2, h3');
      if (headings.length > 2) {
        let html = '<nav aria-label="Table of contents"><ul>';
        headings.forEach((h, i) => {
          if (!h.id) h.id = 'heading-' + i;
          const level = h.tagName === 'H2' ? '' : 'style="padding-left:1rem;font-size:.85rem"';
          html += '<li><a href="#' + h.id + '" ' + level + '>' + esc(h.textContent) + '</a></li>';
        });
        html += '</ul></nav>';
        tocContainer.innerHTML = html;
      } else {
        tocContainer.style.display = 'none';
      }
    }

    /* Estimated read time */
    const readTimeEl = document.getElementById('articleReadTime');
    if (readTimeEl) {
      const words = (article.textContent || '').trim().split(/\s+/).length;
      const mins  = Math.max(1, Math.round(words / 200));
      readTimeEl.textContent = mins + ' min read';
    }
  }

  /* ─── BOOT ─── */
  function init() {
    const page = document.body.dataset.page;

    if (page === 'journal-index') {
      initJournalIndex();
    } else if (page === 'article') {
      initArticlePage();
    } else {
      /* Default: try homepage preview */
      initPreview();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

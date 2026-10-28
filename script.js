/* ═══════════════════════════════════════════════════
   Roll No. 24 — Script
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── INTRO SOUND — plays once per session on page load ─── */
  if (!sessionStorage.getItem('introSoundPlayed')) {
    const introSound = new Audio('assets/sound/intro.mp3');
    introSound.volume = 0.5;
    const playSound = () => {
      introSound.play().then(() => {
        sessionStorage.setItem('introSoundPlayed', '1');
      }).catch(() => {});
      document.removeEventListener('click', playSound);
      document.removeEventListener('keydown', playSound);
    };
    introSound.play().then(() => {
      sessionStorage.setItem('introSoundPlayed', '1');
    }).catch(() => {
      // Browser blocked autoplay — wait for first interaction
      document.addEventListener('click', playSound, { once: true });
      document.addEventListener('keydown', playSound, { once: true });
    });
  }

  /* ─── SHUTTER CLICK SOUND — plays on every click ─── */
  const shutterBase = new Audio('assets/sound/intro.mp3');
  shutterBase.volume = 0.35;

  document.addEventListener('click', () => {
    const shot = shutterBase.cloneNode();
    shot.volume = 0.35;
    shot.play().catch(() => {});
  });

  /* ─── CURSOR INVERSION CIRCLE ─── */
  const cursor = document.getElementById('cursorCircle');
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let isMouseOnPage = false;

  // Smooth cursor follow with lerp
  function lerpCursor() {
    const speed = 0.15;
    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(lerpCursor);
  }
  lerpCursor();

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isMouseOnPage) {
      isMouseOnPage = true;
      cursor.classList.add('active');
      // Snap to position instantly on first move
      cursorX = mouseX;
      cursorY = mouseY;
    }
  });

  document.addEventListener('mouseleave', () => {
    isMouseOnPage = false;
    cursor.classList.remove('active');
  });

  document.addEventListener('mouseenter', () => {
    isMouseOnPage = true;
    cursor.classList.add('active');
  });

  // Grow cursor on hoverable elements
  const hoverTargets = 'a, button, .service-card, .cta-btn, .clients-track span:not(.sep)';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.add('hovering');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.remove('hovering');
    }
  });

  // Shrink on click
  document.addEventListener('mousedown', () => {
    cursor.classList.add('clicking');
  });

  document.addEventListener('mouseup', () => {
    cursor.classList.remove('clicking');
  });


  /* ─── SCROLL PROGRESS BAR ───
     Not every page has the bar (journey.html has no header rail), so bail
     out rather than throwing a TypeError on every scroll event. */
  const progressBar = document.getElementById('scrollProgress');

  function updateProgress() {
    if (!progressBar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      progressBar.style.width = ((scrollTop / docHeight) * 100) + '%';
    }
  }

  if (progressBar) {
    window.addEventListener('scroll', updateProgress, { passive: true });
  }


  /* ─── HERO PARALLAX ─── */
  const heroImg = document.querySelector('.hero-img');
  const heroSection = document.querySelector('.hero');

  function parallax() {
    if (!heroImg || !heroSection) return;
    const scrollY = window.scrollY;
    const heroH = heroSection.offsetHeight;
    if (scrollY < heroH * 1.2) {
      const scale = 1 + scrollY * 0.00015;
      const translateY = scrollY * 0.35;
      heroImg.style.transform = `scale(${scale}) translateY(${translateY}px)`;
    }
  }

  window.addEventListener('scroll', parallax, { passive: true });


  /* ─── SCROLL REVEAL: generic .reveal elements ─── */
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(el => revealObserver.observe(el));


  /* ─── SCROLL REVEAL: service cards with stagger ─── */
  const cards = document.querySelectorAll('.reveal-card');

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => cardObserver.observe(card));


  /* ─── VIEWFINDER CLEANUP ─── */
  const vf = document.getElementById('viewfinder');
  if (vf) {
    setTimeout(() => {
      vf.style.display = 'none';
    }, 4500);
  }


  /* ─── PAGE LOADER CLEANUP ─── */
  const loader = document.getElementById('pageLoader');
  if (loader) {
    setTimeout(() => {
      loader.style.display = 'none';
    }, 2000);
  }


  /* ─── HEADER SCROLL EFFECT ─── */
  const header = document.querySelector('.site-header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 200) {
      header.style.borderBottomColor = 'oklch(0.28 0.02 50 / 0.6)';
    } else {
      header.style.borderBottomColor = '';
    }
    lastScroll = currentScroll;
  }, { passive: true });


  /* ─── SMOOTH ANCHOR LINKS ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});

/* ═══════════════════════════════════════════════════
   IMAGE LOADING — smooth, non-blocking swap-in
   ─────────────────────────────────────────────────
   • Cached images show instantly (no fade, no flash)
   • Pending images fade in once decoded, so the swap
     never lands mid-paint
   • A missing/failed image resolves quietly and never
     blocks animation, layout or interaction
   • Picks up images injected later by page scripts
     (festival carousel, gallery thumbs)
   • Images running their own opacity animation are
     left completely alone
   ═══════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* Images that animate their own opacity elsewhere — never touch these */
  var SKIP = '.fest-gallery-main-img';
  var SAFETY_MS = 8000;   /* last resort if no load/error ever fires */
  var DECODE_MS = 400;    /* max wait on decode() before revealing anyway */

  function settle(img, ok) {
    img.classList.add(ok ? 'img-ready' : 'img-failed');
    if (!ok) img.setAttribute('data-img-failed', 'true');
    var p = img.parentElement;
    if (p) p.classList.remove('is-img-loading');
  }

  /* Decode before revealing so the fade-in can't stutter.
     decode() is raced against a short timer: when many large images
     decode at once the queue backs up for seconds, and waiting on it
     would leave already-loaded images invisible. Pixels beat polish. */
  function reveal(img, ok) {
    if (!ok) { settle(img, false); return; }
    if (typeof img.decode !== 'function') { settle(img, true); return; }

    var resolved = false;
    function go() {
      if (resolved) return;
      resolved = true;
      clearTimeout(timer);
      settle(img, true);
    }
    var timer = setTimeout(go, DECODE_MS);
    img.decode().then(go).catch(go);
  }

  function track(img) {
    var done = false;
    function finish(ok) {
      if (done) return;
      done = true;
      reveal(img, ok);
    }
    img.addEventListener('load',  function () { finish(true);  }, { once: true });
    img.addEventListener('error', function () { finish(false); }, { once: true });
    /* Never leave an image invisible forever if no event ever fires */
    setTimeout(function () {
      if (!done) finish(img.naturalWidth > 0);
    }, SAFETY_MS);
  }

  function manage(img) {
    if (img.dataset.imgManaged) return;
    img.dataset.imgManaged = '1';

    /* Leave custom-animated or inline-opacity images untouched */
    if ((img.matches && img.matches(SKIP)) || img.style.opacity !== '') return;

    img.classList.add('img-fade');

    /* Already in cache — reveal immediately, no transition flash */
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add('img-ready');
      return;
    }
    if (img.complete && img.naturalWidth === 0 && img.currentSrc) {
      settle(img, false);
      return;
    }

    /* Shimmer the container only when the image is its sole child,
       so we never add position:relative to a real layout container */
    var p = img.parentElement;
    if (p && p.children.length === 1) p.classList.add('is-img-loading');

    track(img);
  }

  function scan(root) {
    var imgs = (root || document).querySelectorAll('img');
    Array.prototype.forEach.call(imgs, manage);
  }

  /* Re-fade on src change, for viewers that swap the same element.
     Opt in with data-img-swap so nothing else is affected. */
  function watchSwaps() {
    if (!('MutationObserver' in window)) return;
    new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        var img = m.target;
        if (img.tagName !== 'IMG' || !img.hasAttribute('data-img-swap')) return;
        if (!img.getAttribute('src')) return;
        img.classList.remove('img-ready', 'img-failed');
        img.classList.add('img-fade');
        var p = img.parentElement;
        if (p && p.children.length === 1) p.classList.add('is-img-loading');
        track(img);
      });
    }).observe(document.documentElement, {
      subtree: true, attributes: true, attributeFilter: ['src']
    });
  }

  /* Catch images inserted after load (carousel, gallery, thumbs) */
  function watchInserts() {
    if (!('MutationObserver' in window)) return;
    new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        Array.prototype.forEach.call(m.addedNodes || [], function (n) {
          if (n.nodeType !== 1) return;
          if (n.tagName === 'IMG') manage(n);
          else if (n.querySelectorAll) scan(n);
        });
      });
    }).observe(document.documentElement, { childList: true, subtree: true });
  }

  scan();
  watchInserts();
  watchSwaps();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { scan(); });
  }
})();

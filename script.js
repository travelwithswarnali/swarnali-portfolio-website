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


  /* ─── SCROLL PROGRESS BAR ─── */
  const progressBar = document.getElementById('scrollProgress');

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      progressBar.style.width = ((scrollTop / docHeight) * 100) + '%';
    }
  }

  window.addEventListener('scroll', updateProgress, { passive: true });


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

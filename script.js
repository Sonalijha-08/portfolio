/* ════════════════════════════════════════════════════════
   SONALI JHA — PORTFOLIO SCRIPT
   Features:
   · Particle canvas background
   · Custom diamond cursor
   · Sticky topbar on scroll
   · Scroll-reveal observer
   · Skills tab switcher + bar animation
   · Service card mouse glow (CSS var injection)
   · Contact form handler
   · Footer year
════════════════════════════════════════════════════════ */

/* ── YEAR ──────────────────────────────────────────────── */
document.getElementById('yr').textContent = new Date().getFullYear();

/* ═══════════════════════════════════════════════════════
   PARTICLE CANVAS
═══════════════════════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouse = { x: -999, y: -999 };
  const COUNT = 20;
  const GOLD   = 'rgba(201,168,76,';
  const SILVER = 'rgba(168,184,204,';

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x    = Math.random() * W;
      this.y    = init ? Math.random() * H : H + 10;
      this.vy   = -(Math.random() * 0.15 + 0.05);
      this.vx   = (Math.random() - .5) * 0.08;
      this.size = Math.random() * 1.8 + 0.4;
      this.alpha= Math.random() * 0.5 + 0.1;
      this.gold = Math.random() < 0.3;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -10) this.reset(false);
    }
    draw() {
      const col = this.gold ? GOLD : SILVER;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = col + this.alpha + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  // draw connecting lines
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const op = (1 - dist / 100) * 0.02;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = GOLD + op + ')';
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawLines();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ═══════════════════════════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════════════════════════ */
(function initCursor() {
  const dot     = document.getElementById('cursorDot');
  const outline = document.getElementById('cursorOutline');
  if (!dot || !outline) return;

  let ox = 0, oy = 0; // outline lagged position
  let dotX = 0, dotY = 0;

  document.addEventListener('mousemove', e => {
    dotX = e.clientX;
    dotY = e.clientY;
    dot.style.left = dotX + 'px';
    dot.style.top  = dotY + 'px';
  });

  // smooth outline lag
  (function loop() {
    ox += (dotX - ox) * 0.1;
    oy += (dotY - oy) * 0.1;
    outline.style.left = ox + 'px';
    outline.style.top  = oy + 'px';
    requestAnimationFrame(loop);
  })();

  // hover state → diamond transform (via CSS class)
  document.querySelectorAll('a, button, .sk-card, .srv-card, .proj-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // hide when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0'; outline.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1'; outline.style.opacity = '1';
  });
})();

/* ═══════════════════════════════════════════════════════
   TOPBAR SCROLL BEHAVIOUR
═══════════════════════════════════════════════════════ */
(function initTopbar() {
  const bar = document.getElementById('topbar');
  if (!bar) return;
  const onScroll = () => bar.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ═══════════════════════════════════════════════════════
   SMOOTH NAV SCROLL
═══════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').replace('#', '');
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ═══════════════════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════════════════ */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const io  = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      // animate skill bars inside revealed element
      entry.target.querySelectorAll('.sk-fill').forEach(fill => {
        const card = fill.closest('.sk-card');
        const pct  = card ? parseInt(card.dataset.pct, 10) / 100 : 0;
        setTimeout(() => { fill.style.transform = `scaleX(${pct})`; }, 180);
      });
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();

/* ═══════════════════════════════════════════════════════
   SKILLS TABS
═══════════════════════════════════════════════════════ */
(function initTabs() {
  document.querySelectorAll('.stab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.stab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.spanel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');

      const panel = document.getElementById('spanel-' + btn.dataset.tab);
      if (!panel) return;
      panel.classList.add('active');

      // re-trigger reveal + bar animation for the new panel
      panel.querySelectorAll('.reveal').forEach(el => {
        el.classList.remove('visible');
        requestAnimationFrame(() => el.classList.add('visible'));
      });
      panel.querySelectorAll('.sk-fill').forEach(fill => {
        fill.style.transform = 'scaleX(0)';
        const card = fill.closest('.sk-card');
        const pct  = card ? parseInt(card.dataset.pct, 10) / 100 : 0;
        setTimeout(() => { fill.style.transform = `scaleX(${pct})`; }, 220);
      });
    });
  });

  // animate bars already in the active (default) panel on load
  window.addEventListener('load', () => {
    document.querySelector('.spanel.active')?.querySelectorAll('.sk-fill').forEach(fill => {
      const card = fill.closest('.sk-card');
      const pct  = card ? parseInt(card.dataset.pct, 10) / 100 : 0;
      setTimeout(() => { fill.style.transform = `scaleX(${pct})`; }, 600);
    });
  });
})();

/* ═══════════════════════════════════════════════════════
   SERVICE CARD MOUSE GLOW  (injects --mx / --my CSS vars)
═══════════════════════════════════════════════════════ */
document.querySelectorAll('.srv-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100) + '%');
    card.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100) + '%');
  });
});

/* ═══════════════════════════════════════════════════════
   CONTACT FORM
═══════════════════════════════════════════════════════ */
(function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(form);
    /* Submit to Formspree */
    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        /* Redirect to thank you page after successful submission */
        setTimeout(() => {
          window.location.href = 'thank-you.html';
        }, 500);
      } else {
        alert('There was an issue submitting your message. Please try again.');
      }
    })
    .catch(error => {
      console.error('Form submission error:', error);
      alert('There was an error submitting your message. Please try again.');
    });
  });
})();

/* ═══════════════════════════════════════════════════════
   HERO HEADING PARALLAX  (subtle depth on scroll)
═══════════════════════════════════════════════════════ */
(function initParallax() {
  const bgText = document.querySelector('.hero-bg-text');
  if (!bgText) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY * 0.25;
    bgText.style.transform = `translateY(calc(-50% + ${y}px))`;
  }, { passive: true });
})();

/* ═══════════════════════════════════════════════════════
   ACTIVE NAV LINK  (highlight on scroll position)
═══════════════════════════════════════════════════════ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
        navLinks.forEach(a => {
          a.style.color = '';
          if (a.getAttribute('href') === '#' + sec.id) {
            a.style.color = 'var(--gold-lt)';
          }
        });
      }
    });
  }, { passive: true });
})();
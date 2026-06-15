/* ════════════════════════════════════════════════════════
   SONALI JHA — PORTFOLIO SCRIPT (MODERN)
   Features:
   · Hero canvas background with particle effect
   · About canvas with animated 3D elements
   · Simple pointer cursor
   · Scroll-reveal animations
   · Piano testimonials flow effects
   · Smooth navigation
   · Contact form handling
   · Loader animation
════════════════════════════════════════════════════════ */

/* ── YEAR ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
});

/* ─────────────────────────────────────────────────────
   HERO CANVAS - Particle Background
────────────────────────────────────────────────────── */
(function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let w = canvas.width = canvas.offsetWidth;
  let h = canvas.height = canvas.offsetHeight;
  
  const particles = [];
  const mouse = { x: -999, y: -999 };
  
  class Particle {
    constructor() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 1.2;
      this.vy = (Math.random() - 0.5) * 1.2;
      this.size = Math.random() * 2 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
    }
    
    update() {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 200) {
        const angle = Math.atan2(dy, dx);
        const force = (200 - dist) / 200;
        this.vx += Math.cos(angle) * force * 0.3;
        this.vy += Math.sin(angle) * force * 0.3;
      }
      
      this.vx *= 0.99;
      this.vy *= 0.99;
      this.x += this.vx;
      this.y += this.vy;
      
      if (this.x < 0 || this.x > w) this.vx *= -1;
      if (this.y < 0 || this.y > h) this.vy *= -1;
      
      this.x = Math.max(0, Math.min(w, this.x));
      this.y = Math.max(0, Math.min(h, this.y));
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 245, 196, ${this.alpha})`;
      ctx.fill();
    }
  }
  
  for (let i = 0; i < 30; i++) particles.push(new Particle());
  
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  
  canvas.addEventListener('mouseleave', () => {
    mouse.x = -999;
    mouse.y = -999;
  });
  
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 245, 196, ${0.1 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }
  
  function animate() {
    ctx.clearRect(0, 0, w, h);
    drawConnections();
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  
  window.addEventListener('resize', () => {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  });
  
  animate();
})();

/* ─────────────────────────────────────────────────────
   ABOUT CANVAS - 3D Cube
────────────────────────────────────────────────────── */
(function initAboutCanvas() {
  const canvas = document.getElementById('about-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let w = canvas.width = canvas.offsetWidth;
  let h = canvas.height = canvas.offsetHeight;
  
  let rotation = 0;
  
  function drawCube() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(0, 245, 196, 0.08)';
    ctx.strokeStyle = 'rgba(0, 245, 196, 0.3)';
    ctx.lineWidth = 2;
    
    const size = 100;
    const cx = w / 2;
    const cy = h / 2;
    
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);
    
    for (let i = 0; i < 8; i++) {
      const x = (i & 1) * size - size / 2;
      const y = ((i >> 1) & 1) * size - size / 2;
      const z = ((i >> 2) & 1) * size - size / 2;
      
      const rotX = x * cos - z * sin;
      const rotZ = x * sin + z * cos;
      const scale = (rotZ + 200) / 200;
      
      const px = cx + rotX * scale;
      const py = cy + y * scale;
      
      ctx.fillRect(px - 2, py - 2, 4, 4);
    }
    
    rotation += 0.005;
  }
  
  function animate() {
    drawCube();
    requestAnimationFrame(animate);
  }
  
  window.addEventListener('resize', () => {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  });
  
  animate();
})();

/* ─────────────────────────────────────────────────────
   LOADER CANVAS
────────────────────────────────────────────────────── */
(function initLoaderCanvas() {
  const canvas = document.getElementById('loader-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  
  let rotation = 0;
  
  function draw() {
    ctx.clearRect(0, 0, w, h);
    
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(rotation);
    
    ctx.strokeStyle = 'rgba(0, 245, 196, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 60, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.strokeStyle = 'rgba(0, 245, 196, 1)';
    ctx.beginPath();
    ctx.arc(0, 0, 60, 0, Math.PI);
    ctx.stroke();
    
    ctx.restore();
    
    rotation += 0.03;
  }
  
  function animate() {
    draw();
    requestAnimationFrame(animate);
  }
  
  animate();
})();

/* ─────────────────────────────────────────────────────
   SIMPLE POINTER CURSOR
────────────────────────────────────────────────────── */
// Cursor is now handled by CSS (body { cursor: pointer; })


/* ─────────────────────────────────────────────────────
   SCROLL REVEAL ANIMATION
────────────────────────────────────────────────────── */
(function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });
  
  reveals.forEach(el => observer.observe(el));
})();

/* ─────────────────────────────────────────────────────
   PIANO KEY HOVER EFFECT - Skills
────────────────────────────────────────────────────── */
(function initPianoKeys() {
  document.querySelectorAll('.skill-card').forEach((key, idx) => {
    key.addEventListener('mouseenter', () => {
      document.querySelectorAll('.skill-card').forEach((k, i) => {
        const delay = Math.abs(i - idx) * 30;
        k.style.transition = `all 0.3s cubic-bezier(.16, 1, .3, 1) ${delay}ms`;
        if (i === idx) {
          k.style.transform = 'translateY(-16px) scale(1.08)';
          k.style.filter = 'brightness(1.2)';
        } else {
          k.style.opacity = '0.65';
          k.style.transform = 'scale(0.92)';
          k.style.filter = 'brightness(0.8)';
        }
      });
    });
  });
  
  document.getElementById('skills')?.addEventListener('mouseleave', () => {
    document.querySelectorAll('.skill-card').forEach(k => {
      k.style.transition = 'all 0.3s cubic-bezier(.16, 1, .3, 1)';
      k.style.transform = 'translateY(0) scale(1)';
      k.style.opacity = '1';
      k.style.filter = 'brightness(1)';
    });
  });
})();

/* ─────────────────────────────────────────────────────
   SMOOTH NAVIGATION
────────────────────────────────────────────────────── */
(function initNavigation() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (!target) return;
      
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ─────────────────────────────────────────────────────
   CONTACT FORM
────────────────────────────────────────────────────── */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  form.addEventListener('submit', e => {
    e.preventDefault();
    
    const formData = new FormData(form);
    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
    .then(response => {
      if (response.ok) {
        setTimeout(() => {
          window.location.href = 'thank-you.html';
        }, 300);
      } else {
        alert('There was an issue. Please try again.');
      }
    })
    .catch(err => console.error('Form error:', err));
  });
})();

/* ─────────────────────────────────────────────────────
   NAVBAR SCROLL EFFECT
────────────────────────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.style.background = 'rgba(3, 5, 8, 0.8)';
      navbar.style.backdropFilter = 'blur(10px)';
    } else {
      navbar.style.background = 'transparent';
      navbar.style.backdropFilter = 'none';
    }
  }, { passive: true });
})();

/* ─────────────────────────────────────────────────────
   LOADER
────────────────────────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 30;
    if (progress > 100) progress = 100;
    const bar = document.getElementById('loader-bar');
    const pct = document.getElementById('loader-pct');
    if (bar) bar.style.width = progress + '%';
    if (pct) pct.textContent = Math.round(progress) + '%';
  }, 200);
  
  window.addEventListener('load', () => {
    clearInterval(interval);
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 500);
  });
  
  setTimeout(() => {
    if (!loader.classList.contains('hidden')) {
      loader.classList.add('hidden');
    }
  }, 3000);
})();
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
/* ═══════════════════════════════════════════════════════════════
   LAURIER WEB — script.js  v2.2.0
   · Navbar scroll
   · Burger menu
   · Canvas particules
   · Scroll reveal (IntersectionObserver)
   · Compteurs animés
   · Curseur custom
   · Budget buttons
   · Form validation
   · Smooth scroll
═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────
     1. NAVBAR — scroll effect
  ───────────────────────────────── */
  const navbar = document.getElementById('navbar');

  const handleNavScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();


  /* ─────────────────────────────────
     2. BURGER MENU
  ───────────────────────────────── */
  const burger   = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');

  burger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !burger.contains(e.target)) {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    }
  });


  /* ─────────────────────────────────
     3. CANVAS PARTICULES HERO
  ───────────────────────────────── */
  const canvas = document.getElementById('heroCanvas');

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles, rafId;

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };

    const createParticles = () => {
      const count = Math.min(Math.floor((W * H) / 14000), 80);
      particles = Array.from({ length: count }, () => ({
        x:  Math.random() * W,
        y:  Math.random() * H,
        r:  Math.random() * 1.4 + 0.4,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        a:  Math.random() * 0.35 + 0.07
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(76,175,80,${p.a})`;
        ctx.fill();
      });
      rafId = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      resize();
      createParticles();
    };

    window.addEventListener('resize', handleResize, { passive: true });
    resize();
    createParticles();
    draw();

    // Suspendre quand le canvas n'est plus visible (performance)
    const canvasObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          if (!rafId) draw();
        } else {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      });
    });
    canvasObserver.observe(canvas);
  }


  /* ─────────────────────────────────
     4. SCROLL REVEAL
  ───────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            revealObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(el => revealObs.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }


  /* ─────────────────────────────────
     5. COMPTEURS ANIMÉS (hero stats)
  ───────────────────────────────── */
  const counters = document.querySelectorAll('[data-counter]');

  if (counters.length && 'IntersectionObserver' in window) {
    const counterObs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          const el     = e.target;
          const target = parseInt(el.dataset.counter, 10);
          const dur    = 1800;
          const start  = performance.now();

          const tick = (now) => {
            const progress = Math.min((now - start) / dur, 1);
            const eased    = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
          counterObs.unobserve(el);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(el => counterObs.observe(el));
  }


  /* ─────────────────────────────────
     6. CURSEUR CUSTOM
  ───────────────────────────────── */
  const cursor    = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');

  // Skip sur écrans tactiles
  if (cursor && cursorDot && !window.matchMedia('(pointer: coarse)').matches) {
    let mx = -100, my = -100;
    let cx = -100, cy = -100;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      cursorDot.style.transform = `translate(${mx - 3}px, ${my - 3}px)`;
    });

    const animCursor = () => {
      cx += (mx - cx) * 0.1;
      cy += (my - cy) * 0.1;
      cursor.style.transform = `translate(${cx - 16}px, ${cy - 16}px)`;
      requestAnimationFrame(animCursor);
    };
    animCursor();

    const hoverTargets = 'a, button, .card, .temo-card, .pourquoi-card, .budget-btn, .check-label, .feature-card';
    document.querySelectorAll(hoverTargets).forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });

    // Masquer quand la souris quitte la fenêtre
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity    = '0';
      cursorDot.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity    = '1';
      cursorDot.style.opacity = '1';
    });
  }


  /* ─────────────────────────────────
     7. BUDGET BUTTONS
  ───────────────────────────────── */
  const budgetBtns  = document.querySelectorAll('.budget-btn');
  const budgetValue = document.getElementById('budgetValue');

  if (budgetBtns.length && budgetValue) {
    budgetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        budgetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        budgetValue.value = btn.dataset.value;
      });
    });
  }


  /* ─────────────────────────────────
     8. FORMULAIRE — validation + succès
  ───────────────────────────────── */
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('submitBtn');
  const successMsg = document.getElementById('successMsg');

  if (form) {
    const getEl   = id => document.getElementById(id);
    const showErr = (inputId, errId, msg) => {
      getEl(inputId)?.classList.add('error');
      const err = getEl(errId);
      if (err) err.textContent = msg;
    };
    const clearErr = (inputId, errId) => {
      getEl(inputId)?.classList.remove('error');
      const err = getEl(errId);
      if (err) err.textContent = '';
    };
    const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

    getEl('firstName').addEventListener('input', function () {
      if (this.value.trim().length >= 2) clearErr('firstName', 'firstNameError');
    });
    getEl('email').addEventListener('input', function () {
      if (isValidEmail(this.value)) clearErr('email', 'emailError');
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      clearErr('firstName', 'firstNameError');
      clearErr('email', 'emailError');

      const firstName = getEl('firstName').value.trim();
      if (firstName.length < 2) {
        showErr('firstName', 'firstNameError', 'Veuillez entrer votre prénom.');
        valid = false;
      }

      const email = getEl('email').value.trim();
      if (!email) {
        showErr('email', 'emailError', 'Veuillez entrer votre courriel.');
        valid = false;
      } else if (!isValidEmail(email)) {
        showErr('email', 'emailError', 'Courriel invalide (ex. : nom@domaine.com).');
        valid = false;
      }

      if (!valid) {
        form.querySelector('.error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        form.querySelector('.error')?.focus();
        return;
      }

      // Simulation envoi (remplacer par Formspree)
      submitBtn.disabled    = true;
      submitBtn.textContent = 'Envoi en cours…';

      setTimeout(() => {
        successMsg.hidden = false;
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        form.reset();
        budgetBtns.forEach(b => b.classList.remove('active'));
        if (budgetValue) budgetValue.value = '';
        submitBtn.disabled    = false;
        submitBtn.innerHTML   = 'Envoyer ma demande <span class="arr">→</span>';
        setTimeout(() => { successMsg.hidden = true; }, 8000);
      }, 800);
    });
  }


  /* ─────────────────────────────────
     9. SMOOTH SCROLL liens internes
  ───────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--nav-h')
        ) || 72;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - offset,
          behavior: 'smooth'
        });
      }
    });
  });

}); // end DOMContentLoaded

/* ═══════════════════════════════════════════════════════════════
   LAURIER WEB — script.js  v2.3.0
   · Navbar scroll
   · Burger menu
   · Canvas sparkles hero
   · Feuilles de laurier flottantes
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
     3. CANVAS PARTICULES HERO — sparkles
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
      const count = Math.min(Math.floor((W * H) / 11000), 75);
      particles = Array.from({ length: count }, () => ({
        x:     Math.random() * W,
        y:     Math.random() * H,
        r:     Math.random() * 2.2 + 0.5,
        vx:    (Math.random() - 0.5) * 0.22,
        vy:    (Math.random() - 0.5) * 0.22,
        a:     Math.random() * 0.5 + 0.1,
        freq:  Math.random() * 1.2 + 0.4,
        phase: Math.random() * Math.PI * 2
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const t = performance.now() / 1000;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        const alpha = p.a * (0.45 + 0.55 * Math.abs(Math.sin(t * p.freq + p.phase)));

        if (p.r < 1.2) {
          // Petits points lumineux
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(165,214,167,${alpha})`;
          ctx.fill();
        } else {
          // Sparkle 4 branches
          const s = p.r * 2.8;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = 'rgba(165,214,167,1)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y - s); ctx.lineTo(p.x, p.y + s);
          ctx.moveTo(p.x - s, p.y); ctx.lineTo(p.x + s, p.y);
          ctx.stroke();
          ctx.lineWidth = 0.5;
          const d = s * 0.45;
          ctx.beginPath();
          ctx.moveTo(p.x - d, p.y - d); ctx.lineTo(p.x + d, p.y + d);
          ctx.moveTo(p.x + d, p.y - d); ctx.lineTo(p.x - d, p.y + d);
          ctx.stroke();
          ctx.restore();
        }
      });
      rafId = requestAnimationFrame(draw);
    };

    const handleResize = () => { resize(); createParticles(); };
    window.addEventListener('resize', handleResize, { passive: true });
    resize();
    createParticles();
    draw();

    const canvasObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { if (!rafId) draw(); }
        else { cancelAnimationFrame(rafId); rafId = null; }
      });
    });
    canvasObserver.observe(canvas);
  }


  /* ─────────────────────────────────
     4. LIMELIGHT NAVBAR
  ───────────────────────────────── */
  const limelight   = document.getElementById('navLimelight');
  const navInnerEl  = document.querySelector('.nav-inner');
  const navLinkList = document.querySelector('.nav-links');
  const navAnchors  = document.querySelectorAll('.nav-links a');

  if (limelight && navInnerEl && navAnchors.length) {
    function moveLimelight(anchor) {
      const iRect = navInnerEl.getBoundingClientRect();
      const aRect = anchor.getBoundingClientRect();
      const cx    = aRect.left - iRect.left + aRect.width / 2;
      limelight.style.left = cx + 'px';
      limelight.classList.add('ll-on');
    }

    navAnchors.forEach(a => {
      a.addEventListener('mouseenter', () => {
        navLinkList.classList.add('ll-active');
        navAnchors.forEach(l => l.classList.remove('ll-focus'));
        a.classList.add('ll-focus');
        moveLimelight(a);
      });
    });

    navInnerEl.addEventListener('mouseleave', e => {
      if (!navInnerEl.contains(e.relatedTarget)) {
        limelight.classList.remove('ll-on');
        navLinkList.classList.remove('ll-active');
        navAnchors.forEach(l => l.classList.remove('ll-focus'));
      }
    });
  }


  /* ─────────────────────────────────
     5. SPOTLIGHT CARDS (Modèles)
  ───────────────────────────────── */
  const spotCards = document.querySelectorAll('.cards-grid--3 .card');

  spotCards.forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--sx', `${(e.clientX - r.left).toFixed(1)}px`);
      card.style.setProperty('--sy', `${(e.clientY - r.top).toFixed(1)}px`);
    });
    card.addEventListener('pointerenter', () => card.classList.add('spotlight-on'));
    card.addEventListener('pointerleave', () => {
      card.classList.remove('spotlight-on');
      card.style.setProperty('--sx', '-500px');
      card.style.setProperty('--sy', '-500px');
    });
  });


  /* ─────────────────────────────────
     5. FEUILLES DE LAURIER HERO
  ───────────────────────────────── */
  const leavesContainer = document.getElementById('heroLeaves');
  if (leavesContainer) {
    const NS = 'http://www.w3.org/2000/svg';
    // [left%, top%, size_w, rot_deg, opacity, dur_s, delay_s]
    const leafData = [
      [78,  3,  105, -32, 0.55, 7.5, 0   ],
      [88, 28,   72,  22, 0.42, 8.2, -3  ],
      [63,  6,   52, -58, 0.32, 6.4, -1.5],
      [93, 58,   88,  48, 0.48, 9.0, -4  ],
      [70, 72,   62, -18, 0.28, 7.1, -2  ],
      [ 3,  8,   78,  14, 0.22, 8.6, -5  ],
      [12, 78,   48, -42, 0.18, 6.8, -1  ],
      [52, 82,   58,  32, 0.22, 7.3, -3.5],
      [34,  2,   44, -12, 0.18, 9.2, -2.5],
      [96, 82,   68,  62, 0.32, 8.0, -0.5],
      [46, 50,   40, -70, 0.15, 6.2, -4.5],
    ];

    leafData.forEach(([lx, ly, sw, rot, op, dur, delay], i) => {
      const sh = sw * 1.9;
      const svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('viewBox', '-35 -60 70 120');
      svg.setAttribute('width',  sw);
      svg.setAttribute('height', sh);
      svg.classList.add('hero-leaf');
      svg.style.cssText = `left:${lx}%;top:${ly}%;width:${sw}px;height:${sh}px;opacity:${op};--rot:${rot}deg;--dur:${dur}s;--delay:${delay}s;`;

      // Gradient unique par feuille
      const defs = document.createElementNS(NS, 'defs');
      const gid  = `lg${i}`;
      const grad = document.createElementNS(NS, 'linearGradient');
      grad.setAttribute('id', gid);
      grad.setAttribute('x1', '0%'); grad.setAttribute('y1', '0%');
      grad.setAttribute('x2', '30%'); grad.setAttribute('y2', '100%');
      [['0%','#81C784'], ['55%','#4CAF50'], ['100%','#2E7D32']].forEach(([off, col]) => {
        const stop = document.createElementNS(NS, 'stop');
        stop.setAttribute('offset', off);
        stop.setAttribute('stop-color', col);
        grad.appendChild(stop);
      });
      defs.appendChild(grad);
      svg.appendChild(defs);

      // Forme feuille
      const leaf = document.createElementNS(NS, 'path');
      leaf.setAttribute('d', 'M0,-55 C26,-40 33,-12 28,8 C22,28 12,46 0,55 C-12,46 -22,28 -28,8 C-33,-12 -26,-40 0,-55Z');
      leaf.setAttribute('fill', `url(#${gid})`);
      svg.appendChild(leaf);

      // Nervure centrale
      const vein = document.createElementNS(NS, 'line');
      vein.setAttribute('x1','0'); vein.setAttribute('y1','-52');
      vein.setAttribute('x2','0'); vein.setAttribute('y2','52');
      vein.setAttribute('stroke','rgba(255,255,255,0.22)');
      vein.setAttribute('stroke-width','1');
      svg.appendChild(vein);

      // Nervures latérales
      const veins = document.createElementNS(NS, 'path');
      veins.setAttribute('d',
        'M0,-35 C10,-26 13,-15 9,-8 M0,-15 C11,-6 14,5 10,12 M0,5 C10,14 11,24 7,30 ' +
        'M0,-35 C-10,-26 -13,-15 -9,-8 M0,-15 C-11,-6 -14,5 -10,12 M0,5 C-10,14 -11,24 -7,30'
      );
      veins.setAttribute('fill','none');
      veins.setAttribute('stroke','rgba(255,255,255,0.16)');
      veins.setAttribute('stroke-width','0.8');
      svg.appendChild(veins);

      leavesContainer.appendChild(svg);
    });
  }


  /* ─────────────────────────────────
     6. SCROLL REVEAL
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
     7. COMPTEURS ANIMÉS (hero stats)
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
     8. CURSEUR CUSTOM
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
     9. BUDGET BUTTONS
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
     10. FORMULAIRE — validation + succès
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

      submitBtn.disabled    = true;
      submitBtn.textContent = 'Envoi en cours…';

      const data = new FormData(form);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data
      })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          successMsg.hidden = false;
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          form.reset();
          budgetBtns.forEach(b => b.classList.remove('active'));
          if (budgetValue) budgetValue.value = '';
          setTimeout(() => { successMsg.hidden = true; }, 8000);
        } else {
          alert('Une erreur est survenue. Veuillez réessayer ou nous écrire directement à LaurierWeb@gmail.com');
        }
      })
      .catch(() => {
        alert('Une erreur est survenue. Veuillez réessayer ou nous écrire directement à LaurierWeb@gmail.com');
      })
      .finally(() => {
        submitBtn.disabled  = false;
        submitBtn.innerHTML = 'Envoyer ma demande <span class="arr">→</span>';
      });
    });
  }


  /* ─────────────────────────────────
     11. SMOOTH SCROLL liens internes
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

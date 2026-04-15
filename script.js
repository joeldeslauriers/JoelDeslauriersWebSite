/* ═══════════════════════════════════════════════════════════════
   LAURIER WEB — script.js
   · Navbar scroll effect
   · Burger menu (mobile)
   · Scroll reveal (IntersectionObserver)
   · Budget buttons toggle
   · Form validation + success message
═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────
     1. NAVBAR — effet au scroll
  ───────────────────────────────── */
  const navbar = document.getElementById('navbar');

  const handleNavScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // état initial


  /* ─────────────────────────────────
     2. BURGER MENU (mobile)
  ───────────────────────────────── */
  const burger   = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');

  burger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
    // Empêche le scroll du body quand menu ouvert
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Fermer le menu en cliquant un lien
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Fermer en cliquant en dehors
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
     3. SCROLL REVEAL
  ───────────────────────────────── */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target); // une seule fois
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback : tout afficher directement
    revealElements.forEach(el => el.classList.add('visible'));
  }


  /* ─────────────────────────────────
     4. BUDGET BUTTONS — sélection active
  ───────────────────────────────── */
  const budgetButtons  = document.querySelectorAll('.budget-btn');
  const budgetValue    = document.getElementById('budgetValue');

  budgetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Désactiver les autres
      budgetButtons.forEach(b => b.classList.remove('active'));
      // Activer le bouton cliqué
      btn.classList.add('active');
      // Stocker la valeur dans le champ caché
      budgetValue.value = btn.dataset.value;
    });
  });


  /* ─────────────────────────────────
     5. FORMULAIRE — validation + succès
  ───────────────────────────────── */
  const form        = document.getElementById('contactForm');
  const submitBtn   = document.getElementById('submitBtn');
  const successMsg  = document.getElementById('successMsg');

  // Helpers
  const getEl  = id => document.getElementById(id);
  const showErr = (inputId, errId, msg) => {
    const input = getEl(inputId);
    const err   = getEl(errId);
    if (input && err) {
      input.classList.add('error');
      err.textContent = msg;
    }
  };
  const clearErr = (inputId, errId) => {
    const input = getEl(inputId);
    const err   = getEl(errId);
    if (input && err) {
      input.classList.remove('error');
      err.textContent = '';
    }
  };

  const isValidEmail = email =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

  // Validation live (enlève l'erreur dès que le champ est valide)
  getEl('firstName').addEventListener('input', function () {
    if (this.value.trim().length >= 2) clearErr('firstName', 'firstNameError');
  });
  getEl('email').addEventListener('input', function () {
    if (isValidEmail(this.value)) clearErr('email', 'emailError');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    // Réinitialiser les erreurs
    clearErr('firstName', 'firstNameError');
    clearErr('email', 'emailError');

    // Validation prénom
    const firstName = getEl('firstName').value.trim();
    if (firstName.length < 2) {
      showErr('firstName', 'firstNameError', 'Veuillez entrer votre prénom.');
      valid = false;
    }

    // Validation courriel
    const email = getEl('email').value.trim();
    if (!email) {
      showErr('email', 'emailError', 'Veuillez entrer votre courriel.');
      valid = false;
    } else if (!isValidEmail(email)) {
      showErr('email', 'emailError', 'Courriel invalide (ex. : nom@domaine.com).');
      valid = false;
    }

    if (!valid) {
      // Scroll vers le premier champ en erreur
      const firstError = form.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
      return;
    }

    // ── Simulation envoi (remplacer par Formspree / fetch réel) ──
    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours...';

    setTimeout(() => {
      // Afficher le message de succès
      successMsg.hidden = false;
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Réinitialiser le formulaire
      form.reset();
      budgetButtons.forEach(b => b.classList.remove('active'));
      budgetValue.value = '';

      // Rétablir le bouton
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Envoyer ma demande <span class="arr">→</span>';

      // Masquer le message de succès après 8s
      setTimeout(() => {
        successMsg.hidden = true;
      }, 8000);
    }, 800); // délai simulé 800ms
  });


  /* ─────────────────────────────────
     6. SMOOTH SCROLL pour les liens internes
        (complément à scroll-behavior: smooth)
  ───────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-h')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

}); // end DOMContentLoaded

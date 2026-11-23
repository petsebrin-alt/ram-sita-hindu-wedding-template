/* =========================================================================
   Ram & Sita · Divine Royal Hindu Wedding — interactions & scroll effects
   Requires (optional, progressive): GSAP 3 + ScrollTrigger, Lenis.
   Without them the page renders a complete static invitation.
   ========================================================================= */
(() => {
  'use strict';

  /* ---------------------------------------------------------------------
     CONFIG — edit these values for your own wedding
     --------------------------------------------------------------------- */
  const CONFIG = {
    couple: 'Ram & Sita',
    muhurat: '2027-03-27T19:45:00+05:30',
    calendar: {
      title: 'Wedding of Ram & Sita',
      startUTC: '20270327T113000Z',   // 5:00 PM IST (baraat)
      endUTC: '20270327T183000Z',     // midnight IST
      location: 'Rambagh Palace, Bhawani Singh Road, Jaipur, Rajasthan 302005',
      description: 'Baraat 5:00 PM · Pheras at the shubh muhurat 7:45 PM IST. With the blessings of Sita–Ram.'
    },
    rsvpWhatsApp: '919876543210',     // placeholder — family number that receives RSVPs (country code, no +)
    seedWishes: [
      { name: 'Nani & Nanaji', wish: 'Wishing you the patience of Ram and the grace of Sita — today, and every day after.' },
      { name: 'Meera', wish: 'May every diya lit at your wedding become a lifetime of light in your home.' },
      { name: 'The Kapoor family', wish: 'Jaipur in March, a royal wedding and the two of you. Perfection! See you at the Sangeet.' },
      { name: 'Bharat Mama', wish: 'Like the Saryu meeting the Ganga, may two families flow together as one river.' },
      { name: 'Priya & Arjun', wish: 'Seven steps, seven vows and a lifetime of laughter. Saving our best dance moves for you!' },
      { name: 'Shanta Bua', wish: 'Sada saubhagyavati bhava. May Hanumanji always guard your happiness.' }
    ]
  };

  /* --------------------------------------------------------------------- */
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const ANIM = hasGSAP && !reduced;
  const small = () => innerWidth <= 560;
  if (ANIM) {
    root.classList.add('anim');
    gsap.registerPlugin(ScrollTrigger);
    // pinned scenes must be measured from the top; deep links are honoured after load
    if (ScrollTrigger.clearScrollMemory) ScrollTrigger.clearScrollMemory('manual');
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }
  const toTop = () => { window.scrollTo(0, 0); document.documentElement.scrollTop = 0; };

  /* ---------------------------------------------------------------------
     Curated Sacred & Ceremonial Soundscape (Feel Movement)
     --------------------------------------------------------------------- */
  const Soundscape = (() => {
    const sounds = {
      vilakkuFire: new Audio('assets/audio/vilakku-fire-on.wav'),
    };

    sounds.vilakkuFire.volume = 0.88;
    sounds.vilakkuFire.preload = 'auto';

    let unlocked = false;
    const unlock = () => {
      if (unlocked) return;
      unlocked = true;
      Object.values(sounds).forEach(a => {
        try {
          const p = a.play();
          if (p !== undefined) {
            p.then(() => { a.pause(); a.currentTime = 0; }).catch(() => {});
          }
        } catch (e) {}
      });
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };

    ['pointerdown', 'keydown', 'touchstart'].forEach(ev => {
      window.addEventListener(ev, unlock, { once: true, passive: true });
    });

    const playedOnce = {};

    return {
      play(name, { once = false, volume = null, minInterval = 1000 } = {}) {
        const audioEl = sounds[name];
        if (!audioEl) return;
        if (once && playedOnce[name]) return;

        const now = Date.now();
        if (audioEl._lastPlay && now - audioEl._lastPlay < minInterval) return;
        audioEl._lastPlay = now;

        if (once) playedOnce[name] = true;
        try {
          const clone = audioEl.cloneNode();
          clone.volume = volume !== null ? volume : audioEl.volume;
          const p = clone.play();
          if (p !== undefined) p.catch(() => {});
        } catch (e) {
          try {
            audioEl.currentTime = 0;
            if (volume !== null) audioEl.volume = volume;
            const p = audioEl.play();
            if (p !== undefined) p.catch(() => {});
          } catch (err) {}
        }
      }
    };
  })();

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage blocked */ } }
  };

  /* ---------------------------------------------------------------------
     Preloader + smooth scroll
     --------------------------------------------------------------------- */
  let lenis = null;
  if (ANIM && window.Lenis) {
    lenis = new window.Lenis({ duration: 1.2, smoothWheel: true, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  document.body.classList.add('is-locked');
  let preloaderDone = false;
  function hidePreloader() {
    if (preloaderDone) return; preloaderDone = true;
    const pre = $('#preloader');
    pre?.classList.add('is-done');
    setTimeout(() => pre?.remove(), 1100);
    const deep = location.hash && document.getElementById(location.hash.slice(1));
    const start = () => {
      document.body.classList.remove('is-locked');
      if (ANIM) { toTop(); lenis?.scrollTo(0, { immediate: true, force: true }); }
      lenis?.start();
      heroIntro();
      if (ANIM) ScrollTrigger.refresh();
      if (deep) setTimeout(() => scrollToEl(deep), 300);
    };
    if (ANIM && !deep) playOpening(start); else { $('#intro')?.remove(); start(); }
  }

  /* =========================================================================
     DIVINE RAMA BLESSING OPENING SEQUENCE
     1. Temple at sunset, volumetric sun rays, water reflection & floating petals
     2. Lord Rama appears majestically in the golden sunset sky with divine aura
     3. Bow is drawn, arrowhead charges with concentrated golden light
     4. Divine golden arrow shoots across the sky with glowing energy trail
     5. Arrow hits center foreground, creates magical golden mandala burst
     6. Royal wedding scroll manifests, descends, and unfurls from top to bottom
     7. Guest invitation text & "Open Invitation" CTA with golden glow
     ========================================================================= */
  function playOpening(done) {
    const intro = $('#intro');
    if (!intro) return done();

    const q = s => $(s, intro);

    /* ── DOM Element References ─────────────────────────────────────────── */
    const sceneRama       = q('#sceneRama');
    const bgTemple        = q('#bgTemple');
    const introRays       = q('#introRays');
    const skyAura         = q('#skyAura');
    const bowCharge       = q('#bowCharge');
    const arrowFlight     = q('#arrowFlight');
    const arrowImg        = q('#arrowImg');
    const arrowTrail      = q('#arrowTrail');
    const magicBurst      = q('#magicBurst');
    const scrollContainer = q('#scrollContainer');
    const scrollClosed    = q('#scrollClosed');
    const scrollOpen      = q('#scrollOpen');
    const scrollParchment = q('#scrollParchment');
    const scrollBotRoller = q('#scrollBotRoller');
    const scrollBody      = q('#scrollBody');
    const openBtn         = q('#introOpenBtn');
    const skipBtn         = q('#introSkip');
    const flash           = q('#introFlash');
    const fxCanvas        = q('#introFx');

    /* ── Atmospheric Canvas FX (Floating Marigold Petals & Golden Sparks) ── */
    let fxRunning = true, fxRaf = null;
    let burstSparks = [];
    if (fxCanvas) {
      const ctx = fxCanvas.getContext('2d');
      let w = fxCanvas.width  = window.innerWidth;
      let h = fxCanvas.height = window.innerHeight;
      window.addEventListener('resize', () => {
        if (!fxCanvas) return;
        w = fxCanvas.width  = window.innerWidth;
        h = fxCanvas.height = window.innerHeight;
      });

      const particles = [];
      const petalColors = [
        'rgba(244,143,177,0.72)',
        'rgba(255,183,77,0.78)',
        'rgba(232,99,143,0.68)',
        'rgba(255,213,79,0.75)',
        'rgba(255,160,50,0.65)'
      ];

      /* Ambient falling petals */
      for (let i = 0; i < 28; i++) {
        particles.push({
          type: 'petal',
          x: Math.random() * w, y: Math.random() * h,
          r: 4 + Math.random() * 8,
          vx: -0.4 + Math.random() * 0.8,
          vy: 0.6 + Math.random() * 1.3,
          rot: Math.random() * Math.PI * 2,
          vrot: (Math.random() - 0.5) * 0.045,
          sway: 0.015 + Math.random() * 0.02,
          color: petalColors[i % petalColors.length]
        });
      }

      /* Ambient ascending golden sacred sparks */
      for (let i = 0; i < 24; i++) {
        particles.push({
          type: 'spark',
          x: Math.random() * w, y: Math.random() * h,
          r: 1 + Math.random() * 2.2,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -0.4 - Math.random() * 0.9,
          alpha: 0.25 + Math.random() * 0.7,
          dAlpha: 0.008 + Math.random() * 0.018
        });
      }

      function drawFx() {
        if (!fxRunning) return;
        ctx.clearRect(0, 0, w, h);

        /* Render ambient particles */
        particles.forEach(p => {
          if (p.type === 'petal') {
            p.x += p.vx + Math.sin(p.y * p.sway) * 0.45;
            p.y += p.vy;
            p.rot += p.vrot;
            if (p.y > h + 25) { p.y = -25; p.x = Math.random() * w; }
            if (p.x < -25) p.x = w + 25;
            if (p.x > w + 25) p.x = -25;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.r, p.r * 0.45, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          } else {
            p.x += p.vx; p.y += p.vy;
            p.alpha += p.dAlpha;
            if (p.alpha > 0.95 || p.alpha < 0.15) p.dAlpha = -p.dAlpha;
            if (p.y < -15) { p.y = h + 15; p.x = Math.random() * w; }
            ctx.shadowColor = 'rgba(255, 215, 80, 0.9)';
            ctx.shadowBlur = 8;
            ctx.fillStyle = `rgba(255, 225, 120, ${Math.max(0, p.alpha)})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });

        /* Render explosive burst sparks (when arrow strikes center) */
        if (burstSparks.length > 0) {
          for (let i = burstSparks.length - 1; i >= 0; i--) {
            const b = burstSparks[i];
            b.x += b.vx;
            b.y += b.vy;
            b.vy += 0.08; /* slight gravity */
            b.alpha *= 0.96;
            if (b.alpha < 0.02) {
              burstSparks.splice(i, 1);
              continue;
            }
            ctx.shadowColor = 'rgba(255, 230, 100, 1)';
            ctx.shadowBlur = 10;
            ctx.fillStyle = `rgba(255, 240, 150, ${b.alpha})`;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }

        fxRaf = requestAnimationFrame(drawFx);
      }
      drawFx();
    }

    /* Helper function to trigger golden burst at (x, y) */
    const triggerGoldenBurst = (x, y) => {
      for (let i = 0; i < 55; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2.5 + Math.random() * 9.5;
        burstSparks.push({
          x: x || window.innerWidth / 2,
          y: y || window.innerHeight / 2,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: 1.5 + Math.random() * 3.2,
          alpha: 1.0
        });
      }
    };

    /* ── Finish & Smooth Transition to Website ───────────────────────────── */
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      fxRunning = false;
      if (fxRaf) cancelAnimationFrame(fxRaf);
      done();
      gsap.to(intro, {
        opacity: 0,
        duration: 1.2,
        ease: 'power2.out',
        onComplete: () => intro.remove()
      });
    };

    /* ── Reduced Motion Accessibility ────────────────────────────────────── */
    if (reduced) {
      gsap.set(bgTemple,        { opacity: 1, scale: 1 });
      gsap.set(skyAura,         { opacity: 0.6 });
      gsap.set(scrollClosed,    { display: 'none' });
      gsap.set(scrollOpen,      { opacity: 1 });
      gsap.set(scrollParchment, { clipPath: 'inset(0 0 19.2% 0)' });
      gsap.set(scrollBotRoller, { top: '80.8%' });
      gsap.set(Array.from(scrollBody.children), { opacity: 1, y: 0 });
      if (openBtn) openBtn.addEventListener('click', finish);
      if (skipBtn) skipBtn.addEventListener('click', finish);
      return;
    }

    /* ── Initial Element States ──────────────────────────────────────────── */
    gsap.set(sceneRama,    { opacity: 1, scale: 1 });
    gsap.set(bgTemple,     { scale: 1.0, transformOrigin: '50% 45%' });
    gsap.set(introRays,    { opacity: 0, scale: 0.95 });
    gsap.set(skyAura,      { opacity: 0, scale: 0.85 });
    gsap.set(bowCharge,    { opacity: 0, scale: 0.2 });

    /* Arrow Flight - initial state at Rama's bow in the sky */
    gsap.set(arrowFlight, {
      opacity: 0,
      scale: 0.65,
      rotation: 138,
      left: '86%',
      top: '18%',
      transformOrigin: '15% 50%'
    });
    gsap.set(arrowTrail, { scaleX: 0.1, opacity: 0 });

    /* Magic burst & Royal Scroll */
    gsap.set(magicBurst,      { opacity: 0, scale: 0.2 });
    gsap.set(scrollClosed,    { opacity: 0, scale: 0.85, y: -25, rotation: -1 });
    gsap.set(scrollOpen,      { opacity: 0 });
    gsap.set(scrollParchment, { clipPath: 'inset(0 0 90.3% 0)' });
    gsap.set(scrollBotRoller, { top: '9.7%' });
    gsap.set(Array.from(scrollBody.children), { opacity: 0, y: 14 });

    /* ── Main GSAP Cinematic Timeline ────────────────────────────────────── */
    const tl = gsap.timeline();

    /*
     * SCENE 01 — FRACTION-OF-A-SECOND DIVINE REVEAL (0.0s → 0.85s)
     * Volumetric sun rays & divine sky aura immediately radiate from Lord Rama
     * Holy Ramayana blessing audio initiates without delay
     */
    tl
      /* Slow majestic camera push */
      .to(bgTemple, {
        scale: 1.04,
        duration: 3.5,
        ease: 'sine.inOut'
      }, 0)

      /* Golden sun rays stream down instantly */
      .to(introRays, {
        opacity: 0.9,
        scale: 1.03,
        duration: 1.0,
        ease: 'power2.out'
      }, 0.1)


      /* Sky aura blooms around Lord Rama */
      .to(skyAura, {
        opacity: 0.95,
        scale: 1.2,
        duration: 1.2,
        ease: 'power2.out'
      }, 0.2)

      /* Concentrated celestial golden lightning charges at Rama's drawn bow */
      .to(bowCharge, {
        opacity: 1,
        scale: 1.5,
        duration: 0.45,
        ease: 'back.out(2)'
      }, 0.3)
      .to(bowCharge, {
        scale: 2.2,
        opacity: 1,
        duration: 0.2,
        ease: 'power1.in'
      }, 0.75)

    /*
     * SCENE 02 — DIVINE ARROW RELEASE & DYNAMIC SKY FLIGHT (0.85s → 1.55s)
     * Celestial flash at bow, arrow launches on a parabolic trajectory to center
     */
      /* Bow flash at release */
      .to(bowCharge, {
        scale: 3.2,
        opacity: 1,
        duration: 0.1,
        ease: 'power2.in'
      }, 0.85)
      .to(bowCharge, {
        opacity: 0,
        scale: 0.2,
        duration: 0.25,
        ease: 'power2.out'
      }, 0.95)

      /* Arrow launches dynamically */
      .to(arrowFlight, {
        opacity: 1,
        scale: 1.0,
        duration: 0.1
      }, 0.88)
      .to(arrowTrail, {
        opacity: 1,
        scaleX: 1.0,
        duration: 0.2,
        ease: 'power1.out'
      }, 0.9)

      /* Parabolic trajectory from Rama's bow in the sky directly to center */
      .to(arrowFlight, {
        left: '68%',
        top: '32%',
        rotation: 142,
        scale: 1.2,
        duration: 0.35,
        ease: 'power2.in'
      }, 0.92)
      .to(arrowFlight, {
        left: '50%',
        top: '48%',
        rotation: 146,
        scale: 1.35,
        duration: 0.32,
        ease: 'power1.out'
      }, 1.25)

      /* Arrow strikes center */
      .to(arrowFlight, {
        opacity: 0,
        scale: 1.6,
        duration: 0.15,
        ease: 'power2.in'
      }, 1.55)

    /*
     * SCENE 03 — CELESTIAL LIGHT BURST & GOLDEN ROD REVEAL (1.55s → 1.85s)
     * Golden spark explosion & expanding mandala ring manifest royal golden rod
     */
      /* Canvas spark explosion at center */
      .call(() => {
        triggerGoldenBurst(window.innerWidth * 0.5, window.innerHeight * 0.48);
      }, [], 1.55)

      /* Expanding mandala of sacred golden light */
      .to(magicBurst, {
        opacity: 1,
        scale: 1.9,
        duration: 0.3,
        ease: 'power2.out'
      }, 1.55)
      .to(magicBurst, {
        scale: 3.6,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut'
      }, 1.85)

      /* Closed royal scroll appears at center */
      .to(scrollClosed, {
        opacity: 1,
        scale: 1.0,
        y: 0,
        rotation: 0,
        duration: 0.35,
        ease: 'back.out(1.5)'
      }, 1.6)

    /*
     * SCENE 04 — NATURAL SMOOTH SCROLL UNROLLING (1.85s → 3.10s)
     * Golden rod unrolls top to bottom smoothly like in user's video:
     * Bottom roller physically rolls downwards in lockstep with unfurling ivory parchment
     */
      /* Seamless crossfade into open scroll top golden rod */
      .to(scrollClosed, {
        opacity: 0,
        scale: 0.97,
        duration: 0.25,
        ease: 'power1.in'
      }, 1.85)
      .set(scrollOpen, { opacity: 1 }, 1.85)

      /* Physical unrolling physics: bottom roller glides down smoothly over 1.25s */
      .fromTo(scrollBotRoller, {
        top: '9.7%'
      }, {
        top: '80.8%',
        duration: 1.25,
        ease: 'power2.out'
      }, 1.88)
      .fromTo(scrollParchment, {
        clipPath: 'inset(0 0 90.3% 0)'
      }, {
        clipPath: 'inset(0 0 19.2% 0)',
        duration: 1.25,
        ease: 'power2.out'
      }, 1.88)

      /* Stagger reveal of invitation text lines */
      .to(Array.from(scrollBody.children), {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.55,
        ease: 'power2.out'
      }, 2.35)

      /* Call to action button bounces in with golden glow aura */
      .fromTo(openBtn, {
        scale: 0.88,
        boxShadow: '0 0 0 rgba(212, 175, 90, 0)'
      }, {
        scale: 1.0,
        boxShadow: '0 4px 20px rgba(74, 10, 26, 0.45), 0 0 18px rgba(212, 175, 90, 0.55)',
        duration: 0.5,
        ease: 'back.out(1.6)'
      }, 3.1);

    /* ── Button Event Listeners ──────────────────────────────────────────── */
    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        const p = tl.progress();
        if (p < 0.85) {
          /* Jump straight to fully revealed invitation scroll */
          tl.progress(0.95);
        } else {
          tl.kill();
          /* Flash & finish */
          gsap.to(flash, {
            opacity: 0.8,
            duration: 0.35,
            onComplete: finish
          });
        }
      });
    }

    if (openBtn) {
      openBtn.addEventListener('click', () => {
        tl.kill();
        /* Divine golden flash transition to #welcome */
        gsap.to(flash, {
          opacity: 0.9,
          duration: 0.45,
          ease: 'power2.in',
          onComplete: () => {
            finish();
            scrollToEl($('#welcome'));
          }
        });
      });
    }
  }
  window.addEventListener('load', () => setTimeout(hidePreloader, 120));
  setTimeout(hidePreloader, 6000);

  function scrollToEl(el) {
    if (lenis) lenis.scrollTo(el, { duration: 1.6 });
    else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  }
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (!id || id.length < 2) return;
    const el = document.getElementById(id.slice(1));
    if (!el) return;
    e.preventDefault();
    closeMenu();
    scrollToEl(el);
  }));

  /* ---------------------------------------------------------------------
     Header + menu
     --------------------------------------------------------------------- */
  const header = $('#siteHeader');
  const firstContent = $('#invitation');
  const onScroll = () => header.classList.toggle('is-solid', firstContent.getBoundingClientRect().top < 70);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const menu = $('#menu'), menuBtn = $('#menuBtn');
  function openMenu() {
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add('is-open'));
    menuBtn.setAttribute('aria-expanded', 'true');
    lenis?.stop(); document.body.classList.add('is-locked');
    setTimeout(() => $('#menuClose').focus(), 300);
  }
  function closeMenu() {
    if (!menu.classList.contains('is-open')) return;
    menu.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    lenis?.start(); document.body.classList.remove('is-locked');
    setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, 900);
  }
  menuBtn.addEventListener('click', openMenu);
  $('#menuClose').addEventListener('click', closeMenu);
  addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* ---------------------------------------------------------------------
     Toast + temple-bell chime (Web Audio, user-initiated only)
     --------------------------------------------------------------------- */
  const toastEl = $('#toast'); let toastT;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add('is-show');
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('is-show'), 3600);
  }
  function bell() {
    try {
      const ctx = bell.ctx || (bell.ctx = new (window.AudioContext || window.webkitAudioContext)());
      const t = ctx.currentTime;
      [[523.25, .22], [1046.5 * 1.004, .12], [1567.98, .08], [2637 * 1.01, .04]].forEach(([f, v], i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(v, t + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 3.2 / (1 + i * 0.5));
        o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 3.4);
      });
    } catch (e) { /* audio unavailable */ }
  }

  /* ---------------------------------------------------------------------
     Global gold specks (canvas) + falling lotus petals (DOM)
     --------------------------------------------------------------------- */
  (function specks() {
    const cv = $('#specks'); if (!cv || reduced) return;
    const ctx = cv.getContext('2d');
    const cols = ['212,175,90', '246,227,166', '232,99,143', '181,80,46'];
    let W, H, dpr, parts = [];
    function size() {
      dpr = Math.min(devicePixelRatio || 1, 1.5);
      W = cv.width = innerWidth * dpr; H = cv.height = innerHeight * dpr;
      const n = innerWidth < 600 ? 26 : 46;
      parts = Array.from({ length: n }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: (Math.random() * 1.6 + .5) * dpr, vy: -(Math.random() * .25 + .05) * dpr, vx: (Math.random() - .5) * .15 * dpr,
        c: cols[(Math.random() * cols.length) | 0], a: Math.random() * .5 + .2, p: Math.random() * 6.28
      }));
    }
    size(); addEventListener('resize', size);
    let last = 0;
    (function loop(now) {
      requestAnimationFrame(loop);
      if (document.hidden || now - last < 33) return; last = now;
      ctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        p.x += p.vx; p.y += p.vy; p.p += .03;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        ctx.globalAlpha = p.a * (.6 + .4 * Math.sin(p.p));
        ctx.fillStyle = `rgb(${p.c})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      }
    })(0);
  })();

  // performance: pause each section's looping decorations while it is off screen,
  // and don't let the phone's address bar showing/hiding re-measure the whole page mid-scroll
  if (window.ScrollTrigger) ScrollTrigger.config({ ignoreMobileResize: true });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('is-offscreen', !e.isIntersecting)), { rootMargin: '200px 0px' });
    document.querySelectorAll('main > section').forEach(s => io.observe(s));
  }

  (function petals() {
    const box = $('#petals'); if (!box || reduced) return;
    const n = innerWidth < 600 ? 7 : 12;
    for (let i = 0; i < n; i++) {
      const d = document.createElement('div');
      d.className = 'petal';
      const dur = 16 + Math.random() * 14;
      d.style.cssText = `--x:${Math.random() * 100}vw;--s:${16 + Math.random() * 18}px;--dur:${dur}s;--delay:${-Math.random() * dur}s;--drift:${(Math.random() - .5) * 30}vw`;
      d.innerHTML = `<img src="assets/flowers/petal-pink-0${1 + (i % 5)}.svg" alt="">`;
      box.appendChild(d);
    }
  })();

  function petalBurst(x, y, count = 18) {
    if (!ANIM) return;
    for (let i = 0; i < count; i++) {
      const img = document.createElement('img');
      img.src = `assets/flowers/petal-pink-0${1 + (i % 5)}.svg`; img.alt = '';
      img.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${16 + Math.random() * 16}px;z-index:90;pointer-events:none`;
      document.body.appendChild(img);
      const a = Math.random() * Math.PI * 2, dist = 90 + Math.random() * 180;
      gsap.to(img, {
        x: Math.cos(a) * dist, y: Math.sin(a) * dist - 60, rotation: (Math.random() - .5) * 540, opacity: 0,
        duration: 1.6 + Math.random(), ease: 'power2.out', onComplete: () => img.remove()
      });
    }
  }

  /* ---------------------------------------------------------------------
     01 · HERO — night temple → lights → lotus bloom → couple
     --------------------------------------------------------------------- */
  (function stars() {
    const cv = $('#heroStars'); if (!cv) return;
    const ctx = cv.getContext('2d');
    let W, H, s = [], visible = true;
    function size() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = cv.width = cv.offsetWidth * dpr; H = cv.height = cv.offsetHeight * dpr;
      s = Array.from({ length: 160 }, () => ({ x: Math.random() * W, y: Math.random() * H * .62, r: Math.random() * 1.3 * dpr + .3, p: Math.random() * 6.28, sp: Math.random() * .04 + .01 }));
    }
    size(); addEventListener('resize', size);
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(cv);
    (function loop() {
      requestAnimationFrame(loop);
      if (!visible || document.hidden || getComputedStyle(cv).opacity === '0') return;
      ctx.clearRect(0, 0, W, H);
      for (const st of s) {
        st.p += st.sp;
        ctx.globalAlpha = .35 + .65 * Math.abs(Math.sin(st.p));
        ctx.fillStyle = '#fff8e6';
        ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, 6.283); ctx.fill();
      }
    })();
  })();

  function heroIntro() {
    if (!ANIM) return;
    gsap.from('.hero__shubh', { opacity: 0, y: -14, duration: 1.2, ease: 'power3.out' });
    gsap.from('.hero__name', { opacity: 0, y: 40, scale: .92, duration: 1.6, stagger: .25, ease: 'power3.out', delay: .15 });
    gsap.from('.hero__amp', { opacity: 0, scale: .4, duration: 1.4, ease: 'back.out(2)', delay: .55 });
    gsap.from('.hero__date', { opacity: 0, letterSpacing: '1em', duration: 1.6, ease: 'power3.out', delay: .7 });
    gsap.from('.scroll-cue > *', { opacity: 0, y: 12, duration: 1, delay: 1.3, stagger: .15 });
  }

  function initHero() {
    if (!ANIM) return;
    const lotuses = $$('.plotus');
    gsap.set(lotuses, { y: 120, opacity: 0 });
    gsap.set('.plotus__bud', { opacity: 1, scale: .7 });
    gsap.set('.plotus__bloom', { opacity: 0, scale: .3, rotate: -8 });
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '#welcome',
        start: 'top top',
        end: () => '+=' + innerHeight * 3.2,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        onUpdate: self => {
          if (self.progress > 0.72 && self.progress < 0.92 && self.direction > 0) {
            Soundscape.play('vilakkuFire', { minInterval: 2500 });
          }
        }
      }
    });
    tl.to('.scroll-cue', { opacity: 0, y: 20, duration: .6 }, 0)
      // 1 · the lights of the temple come on
      .to('.hero__img--night', { opacity: 0, duration: 2.6, ease: 'power1.inOut' }, 0.2)
      .to('.hero__sky--dawn', { opacity: 1, duration: 2.6 }, 0.2)
      .to('.hero__stars', { opacity: 0, duration: 2 }, 0.4)
      .to('.hero__shade', { opacity: 1, duration: 2 }, 1.2)
      .to('.hero__glow--sanctum', { opacity: 1, duration: 1.8 }, 1.2)
      .to('.hero__glow--door', { opacity: 1, duration: 1.4 }, 1.6)
      .to('.hero__rays', { opacity: .35, duration: 1.6 }, 2)
      .to('.hero__rays', { opacity: .1, duration: 1.6 }, 4.4)
      // 2 · walk forward into the lotus pond
      .to('.hero__scene--a', { scale: 1.14, opacity: 0, duration: 1.8, ease: 'power1.in' }, 3.6)
      .fromTo('.hero__scene--b', { opacity: 0, scale: 1.12 }, { opacity: 1, scale: 1, duration: 1.9, ease: 'power1.out' }, 3.7)
      .to('.hero__titles', { scale: .86, transformOrigin: '50% 0%', duration: 2.4, ease: 'power1.inOut' }, 3.8)
      // 3 · lotus buds rise from the water and blossom
      .to(lotuses, { y: 0, opacity: 1, duration: 1.4, stagger: { each: .15, from: 'edges' }, ease: 'power2.out' }, 4.3);
    lotuses.forEach((el, i) => {
      const t = 5.3 + (i % 2) * .25;
      tl.to($('.plotus__bud', el), { scale: 1.15, opacity: 0, duration: 1, ease: 'power1.in' }, t)
        .to($('.plotus__bloom', el), { opacity: 1, scale: 1, rotate: 0, duration: 1.8, ease: 'back.out(1.3)' }, t + .2)
        .fromTo($('.plotus__glow', el), { opacity: 0, scale: .4 }, { opacity: 1, scale: 1.1, duration: 1.6, ease: 'power2.out' }, t + .3)
        .to($('.plotus__glow', el), { opacity: .45, duration: 1 }, t + 2);
    });
    // 4 · Ram & Sita rise into place before the temple, then the vilakku at their feet ignite with real fire & sound
    tl.fromTo('.hero__couple', { opacity: 0, y: 70, scale: .92, transformOrigin: '50% 100%' }, { opacity: 1, y: 0, scale: 1, duration: 2, ease: 'power2.out' }, 7.2)
      .fromTo('.vilakku-unit', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .7, stagger: .12, ease: 'power2.out' }, 8.0)
      .call(() => {
        Soundscape.play('vilakkuFire');
      }, [], 8.35)
      .fromTo('.vilakku__fire', {
        scale: 0,
        opacity: 0
      }, {
        scale: 1.5,
        opacity: 1,
        duration: 0.25,
        stagger: 0.08,
        ease: 'power2.out'
      }, 8.35)
      .to('.vilakku__fire', {
        scale: 1.0,
        duration: 0.45,
        stagger: 0.08,
        ease: 'sine.out'
      }, 8.6)
      .fromTo('.hero__ribbon', { opacity: 0, scaleX: .3 }, { opacity: 1, scaleX: 1, duration: 1.2, ease: 'power2.out' }, 9.2)
      .to({}, { duration: .8 });
  }

  /* ---------------------------------------------------------------------
     02 · GATEFOLD invitation
     --------------------------------------------------------------------- */
  function initGatefold() {
    if (!ANIM) return;
    gsap.timeline({
      scrollTrigger: { trigger: '#gatefold', start: 'top top', end: () => '+=' + innerHeight * 1.4, scrub: 1, pin: true, anticipatePin: 1 }
    })
      .to('.gatefold__seal', { scale: 1.25, opacity: 0, duration: .6, ease: 'power2.in' })
      .to('.gatefold__panel--left', { rotateY: -155, duration: 2.2, ease: 'power2.inOut' }, '-=.15')
      .to('.gatefold__panel--right', { rotateY: 155, duration: 2.2, ease: 'power2.inOut' }, '<')
      .fromTo('.gatefold__card', { scale: .93, filter: 'brightness(.85)' }, { scale: 1, filter: 'brightness(1)', duration: 1.8, ease: 'power2.out' }, '<.4')
      .to('.gatefold__panel', { opacity: 0, duration: .6 }, '-=.3')
      // Shri Hanuman rises onto the top of the opened card, blessing the couple
      .fromTo('.gatefold__deity', { opacity: 0, y: 60, scale: .8 }, { opacity: 1, y: 0, scale: 1, duration: 1.3, ease: 'back.out(1.5)' }, '-=1.1')
      .to({}, { duration: .5 });
    gsap.to('.gatefold__deity', { yPercent: '-=3', duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  }

  /* ---------------------------------------------------------------------
     Embroidered lotus: the drawing is stitched in gold zari, path by path,
     with a needle running along the thread; then the petals fill with pink silk
     --------------------------------------------------------------------- */
  function initStitchLotus() {
    const slots = $$('.stitch-lotus');
    if (!slots.length) return;
    const NS = 'http://www.w3.org/2000/svg';
    const el = (tag, attrs, parent) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); if (parent) parent.appendChild(n); return n; };
    fetch('assets/ornaments/lotus-zari-drawing.json').then(r => r.json()).then(data => {
      slots.forEach((slot, si) => {
        const id = 'sl' + si;
        const svg = el('svg', { viewBox: `0 0 ${data.w} ${data.h}`, 'aria-hidden': 'true' }, slot);
        const defs = el('defs', {}, svg);
        const grad = (gid, stops, units) => {
          const g = el('linearGradient', Object.assign({ id: gid, x1: 0, y1: 0, x2: 1, y2: 1 }, units || {}), defs);
          stops.forEach(([o, c]) => el('stop', { offset: o, 'stop-color': c }, g));
        };
        grad(id + 'pink', [[0, '#fcd0de'], [1, '#e8769f']]);
        grad(id + 'deep', [[0, '#f6a6c1'], [1, '#cf4a7f']]);
        grad(id + 'light', [[0, '#fde7ef'], [1, '#f3aac5']]);
        grad(id + 'leaf', [[0, '#b8dc9c'], [.55, '#79b067'], [1, '#3f7a44']]);
        // gold that catches the light along the whole drawing
        grad(id + 'gold', [[0, '#8a5a14'], [.22, '#e9c46f'], [.4, '#fff1c4'], [.58, '#c99a3a'], [.78, '#f2d585'], [1, '#8a5a14']],
          { gradientUnits: 'userSpaceOnUse', x1: 0, y1: 0, x2: data.w, y2: data.h });
        // satin stitch texture on petals and leaves
        const sat = el('pattern', { id: id + 'satin', width: 5, height: 5, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(35)' }, defs);
        el('line', { x1: 0, y1: 0, x2: 0, y2: 5, stroke: 'rgba(255,255,255,.4)', 'stroke-width': 1.2 }, sat);
        // tiny gold beads strung along the thread
        const bead = el('pattern', { id: id + 'beads', width: 5, height: 5, patternUnits: 'userSpaceOnUse' }, defs);
        el('circle', { cx: 2.5, cy: 2.5, r: 1.7, fill: 'rgba(255,248,215,.55)' }, bead);
        el('circle', { cx: 2, cy: 2, r: .7, fill: 'rgba(255,255,255,.85)' }, bead);
        const mask = el('mask', { id: id + 'mask', maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: data.w, height: data.h }, defs);

        const fillG = el('g', {}, svg);
        const fills = data.fills.slice().reverse().map(f => {
          const g = el('g', { opacity: ANIM ? 0 : 1 }, fillG);
          el('path', { d: f.d, fill: `url(#${id}${f.k})` }, g);
          el('path', { d: f.d, fill: `url(#${id}satin)` }, g);
          return g;
        });
        // one seamless gold thread (the drawing's own line shape), beaded, with a fine dark edge
        const thread = el('g', { mask: ANIM ? `url(#${id}mask)` : '' }, svg);
        el('path', { d: data.thread, fill: `url(#${id}gold)`, stroke: '#7a4f10', 'stroke-width': .7, 'stroke-linejoin': 'round', 'fill-rule': 'evenodd' }, thread);
        el('path', { d: data.thread, fill: `url(#${id}beads)`, 'fill-rule': 'evenodd' }, thread);
        if (!ANIM) return;
        const reveals = data.lines.map(l => el('path', { d: l.d, fill: 'none', stroke: '#fff', 'stroke-width': 26, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, mask));
        const needle = el('g', { opacity: 0 }, svg);
        el('line', { x1: 0, y1: -40, x2: 0, y2: 6, stroke: '#8f8f8f', 'stroke-width': 3.4, 'stroke-linecap': 'round' }, needle);
        el('circle', { cx: 0, cy: 6, r: 5, fill: '#f4f4f4', stroke: '#8a8a8a', 'stroke-width': 1.2 }, needle);

        const lens = reveals.map(r => { const L = r.getTotalLength(); r.style.strokeDasharray = L; r.style.strokeDashoffset = L; return L; });
        const tl = gsap.timeline({ paused: true, onComplete: () => thread.removeAttribute('mask') });
        const N = reveals.length, SPAN = 3.8;
        let lead = -1;
        reveals.forEach((r, i) => {
          tl.to(r, {
            strokeDashoffset: 0, duration: .25 + Math.min(lens[i], 400) / 380, ease: 'sine.inOut',
            onUpdate() {
              if (i < lead) return;
              lead = i;
              const pt = r.getPointAtLength(lens[i] * this.progress());
              needle.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
            }
          }, (i / N) * SPAN);
        });
        tl.set(needle, { attr: { opacity: 1 } }, 0)
          .to(needle, { attr: { opacity: 0 }, duration: .5 }, SPAN + .6);
        fills.forEach((g, i) => tl.to(g, { attr: { opacity: 1 }, duration: .6, ease: 'sine.out' }, SPAN * .45 + i * .085));
        ScrollTrigger.create({ trigger: slot, start: 'top 90%', once: true, onEnter: () => tl.play() });
      });
    }).catch(() => {});
  }


  /* ---------------------------------------------------------------------
     06 · FAMILIES — each card's gold outline is drawn stroke by stroke as you
     scroll, then the card fills in, the details appear and lotus flowers bloom
     --------------------------------------------------------------------- */
  function initFamilies() {
    const cards = $$('.family');
    if (!cards.length) return;
    const NS = 'http://www.w3.org/2000/svg';
    const el = (tag, attrs, parent) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); if (parent) parent.appendChild(n); return n; };
    // ONE continuous line: from the bottom-left corner up the left side, over the arch,
    // down the right side and back along the bottom line to where it started (inset by d)
    const loop = (w, h, d) => {
      const R = Math.max(0, Math.min(200, w / 2, h / 2) - d), r = Math.max(0, 18 - d);
      const L = d, T = d, Rt = w - d, B = h - d;
      return `M${L} ${B - r} V${T + R} A${R} ${R} 0 0 1 ${L + R} ${T} H${Rt - R} A${R} ${R} 0 0 1 ${Rt} ${T + R}` +
             ` V${B - r} Q${Rt} ${B} ${Rt - r} ${B} H${L + r} Q${L} ${B} ${L} ${B - r}`;
    };
    cards.forEach((card, ci) => {
      const id = 'fam' + ci;
      const svg = el('svg', { class: 'family__outline', 'aria-hidden': 'true' });
      const defs = el('defs', {}, svg);
      const glow = el('filter', { id: id + 'glow', x: '-30%', y: '-30%', width: '160%', height: '160%' }, defs);
      el('feGaussianBlur', { stdDeviation: 3 }, glow);
      const spk = el('radialGradient', { id: id + 'spark' }, defs);
      [[0, '#ffffff', 1], [.25, '#fff6d0', 1], [.6, '#f5c860', .75], [1, '#e8a83a', 0]].forEach(([o, c, op]) => el('stop', { offset: o, 'stop-color': c, 'stop-opacity': op }, spk));

      const mk = (cls, w, extra) => el('path', Object.assign({ class: cls, pathLength: 1, 'stroke-width': w }, extra || {}), svg);
      const outer = { halo: mk('o1 halo', 6, { stroke: '#f3cf76', opacity: .4, filter: `url(#${id}glow)` }), line: mk('o1', 2.2) };
      const inner = { halo: mk('o2 halo', 3, { stroke: '#f3cf76', opacity: .3, filter: `url(#${id}glow)` }), line: mk('o2', 1.1) };
      // the lightning: a short white-gold streak and a spark at the tip of the moving line
      const bolt = mk('o1 glint', 4, { stroke: '#fffbe8', filter: `url(#${id}glow)`, opacity: 0 });
      const boltCore = mk('o1 glint', 1.6, { stroke: '#ffffff', opacity: 0 });
      const spark = el('circle', { r: 11, fill: `url(#${id}spark)`, opacity: 0 }, svg);
      card.prepend(svg);

      // five lotus flowers resting along the bottom line
      const flowers = [0, 1, 2, 3, 4].map(() => {
        const f = document.createElement('img');
        f.className = 'family__flower'; f.src = 'assets/flowers/lotus-photo-bloom-01.webp'; f.alt = ''; f.setAttribute('aria-hidden', 'true');
        card.appendChild(f); return f;
      });
      const layout = () => {
        const w = card.offsetWidth, h = card.offsetHeight;
        svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
        const o = loop(w, h, 1), n = loop(w, h, 9);
        [outer.halo, outer.line, bolt, boltCore].forEach(p => p.setAttribute('d', o));
        [inner.halo, inner.line].forEach(p => p.setAttribute('d', n));
        [.1, .3, .5, .7, .9].forEach((x, i) => { flowers[i].style.left = (w * x) + 'px'; flowers[i].style.top = (h - 6) + 'px'; });
      };
      layout();
      if ('ResizeObserver' in window) new ResizeObserver(layout).observe(card);
      if (!ANIM) return;

      const content = $$(':scope > :not(.family__outline):not(.family__flower)', card);
      gsap.set(card, { '--fill': 0 });
      gsap.set(content, { opacity: 0, y: 16 });
      gsap.set(flowers, { scale: 0, y: 10, opacity: 0 });
      const TAIL = .045;
      const pen = { a: 0, b: 0 };   // a: outer line drawn so far, b: inner line drawn so far
      const draw = () => {
        const a = pen.a, b = pen.b;
        [outer.halo, outer.line].forEach(p => { p.style.strokeDasharray = '1 2'; p.style.strokeDashoffset = 1 - a; });
        [inner.halo, inner.line].forEach(p => { p.style.strokeDasharray = '1 2'; p.style.strokeDashoffset = 1 - b; });
        const live = a > .001 && a < .999;
        [bolt, boltCore].forEach(p => {
          p.style.strokeDasharray = `${TAIL} 2`; p.style.strokeDashoffset = TAIL - a;
          p.setAttribute('opacity', live ? 1 : 0);
        });
        spark.setAttribute('opacity', live ? 1 : 0);
        if (live) {
          const len = outer.line.getTotalLength(), pt = outer.line.getPointAtLength(len * a);
          spark.setAttribute('cx', pt.x); spark.setAttribute('cy', pt.y);
        }
      };
      draw();
      // drawn slowly as you scroll: up, over the arch, down, and along the bottom to close
      gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 92%', end: 'top 12%', scrub: 1.2 } })
        .to(pen, { a: 1, duration: 3, ease: 'none', onUpdate: draw }, 0)
        .to(pen, { b: 1, duration: 3, ease: 'none', onUpdate: draw }, .4)
        .to(card, { '--fill': 1, duration: .6 }, 3.2)
        .to(content, { opacity: 1, y: 0, duration: .5, stagger: .14 }, 3.3)
        .to(flowers, { scale: 1, y: 0, opacity: 1, duration: .45, stagger: { each: .08, from: 'center' }, ease: 'back.out(1.8)' }, 3.7);
    });
  }




  /* Between Sita and Ram: a gold line writes a heart, leaves unfurl, the lotus blossoms */
  function initHeartDraw() {
    const box = $('#heartdraw'); if (!box) return;
    const lines = $$('.hd-line', box), leaves = $$('.hd-leaf', box), lotus = $('.heartdraw__lotus', box);
    if (!ANIM) return;
    lines.forEach(p => { p.setAttribute('pathLength', 1); p.style.strokeDasharray = 1; p.style.strokeDashoffset = 1; });
    gsap.set(leaves, { scale: 0, opacity: 0 });
    gsap.set(lotus, { scale: .12, opacity: 0, rotate: -10 });
    gsap.timeline({ scrollTrigger: { trigger: box, start: 'top 78%', once: true } })
      .to(lines[0], { strokeDashoffset: 0, duration: 1.4, ease: 'sine.inOut' })
      .to(leaves, { scale: 1, opacity: 1, duration: .7, stagger: .2, ease: 'back.out(1.8)' }, .6)
      .to(lines[1], { strokeDashoffset: 0, duration: 2.2, ease: 'sine.inOut' }, 1.1)
      .to(lotus, { opacity: 1, duration: .5 }, 1.4)
      .to(lotus, { scale: 1, rotate: 0, duration: 1.8, ease: 'back.out(1.4)' }, 1.4)
      .call(() => { const r = lotus.getBoundingClientRect(); petalBurst(r.left + r.width / 2, r.top + r.height / 2, 12); }, null, 2.2);
  }

  /* ---------------------------------------------------------------------
     Generic reveals + parallax
     --------------------------------------------------------------------- */
  function initReveals() {
    if (!ANIM) return;
    const els = $$('[data-reveal]');
    gsap.set(els, { opacity: 0, y: 36 });
    ScrollTrigger.batch(els, {
      start: 'top 90%', once: true,
      onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: .1, overwrite: true })
    });
    $$('[data-speed]').forEach(el => {
      const s = parseFloat(el.dataset.speed) || 0;
      gsap.fromTo(el, { y: () => -s * innerHeight }, { y: () => s * innerHeight, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
    });
    // gentle drifts on decorative pieces
    $$('.corner').forEach(el => gsap.from(el, { opacity: 0, scale: .6, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } }));
    gsap.fromTo('.couple__center img', { rotate: -25, scale: .6 }, { rotate: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: '.couple__center', start: 'top bottom', end: 'center center', scrub: true } });
    gsap.from('.person__portrait', { y: 80, opacity: 0, duration: 1.4, ease: 'power3.out', stagger: .2, scrollTrigger: { trigger: '.couple__grid', start: 'top 80%', once: true } });
    gsap.to('.venue__rangoli', { rotate: 90, ease: 'none', scrollTrigger: { trigger: '#venue', start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  /* ---------------------------------------------------------------------
     04 · STORY — gold thread draws, medallions roll in
     --------------------------------------------------------------------- */
  function initStory() {
    const stage = $('#rbookStage'), book = $('#rbook');
    if (!stage || !book) return;
    const leaves = $$('.rbook__leaf', book), intro = $('#rbookIntro');
    const prevB = $('#rbookPrev'), nextB = $('#rbookNext'), count = $('#rbookCount');
    const SPREADS = leaves.length - 1;               // the cover leaf plus one leaf per spread
    const narrow = () => matchMedia('(max-width: 700px)').matches;
    let spread = -1;                                  // -1 = closed
    let busy = false, auto = null, idleTimer = null;
    // stacking: pages still on the right lie top-down in order; turned pages pile up on the left
    const zRight = i => 60 - i, zLeft = i => 10 + i;
    leaves.forEach((l, i) => gsap.set(l, { zIndex: zRight(i), rotateY: 0 }));
    // a closed book sits centred on its cover
    const closedX = () => narrow() ? 0 : -book.offsetWidth / 4;

    // the lotus blooms first, then the photo is taped in and the words appear
    function reveal(k, instant) {
      const right = leaves[k + 1] && $('.rbook__face--front .rpage', leaves[k + 1]);
      const left = $('.rbook__face--back .rpage', leaves[k]);
      const tl = gsap.timeline();
      if (left) {
        const bloom = $('.rpage__bloom', left), words = left.querySelectorAll('.rpage__om, .rpage__verse, .rpage__sub');
        tl.fromTo(bloom, { opacity: 0, scale: .15, rotate: -40 }, { opacity: 1, scale: 1, rotate: 0, duration: 1.3, ease: 'back.out(1.4)' }, 0)
          .fromTo(words, { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: .15, duration: .6, ease: 'power2.out' }, .7);
      }
      if (right && !right.classList.contains('rpage--end')) {
        const bloom = $('.rpage__bloom', right), pol = $('.polaroid', right), tape = $('.polaroid__tape', right);
        const words = right.querySelectorAll('.rpage__kanda, .rpage__title, .rpage__text, .rpage__num');
        tl.fromTo(bloom, { opacity: 0, scale: .15, rotate: -40 }, { opacity: 1, scale: 1, rotate: 0, duration: 1.1, ease: 'back.out(1.5)' }, 0)
          .to(bloom, { opacity: 0, scale: 1.25, duration: .6, ease: 'power2.in' }, 1.4)
          .fromTo(pol, { opacity: 0, y: -30, scale: .9, rotate: -6 }, { opacity: 1, y: 0, scale: 1, rotate: 0, duration: .9, ease: 'power3.out' }, 1.55)
          .fromTo(tape, { scaleX: 0 }, { scaleX: 1, duration: .45, ease: 'power2.out' }, 2.15)
          .fromTo(words, { opacity: 0, y: 12 }, { opacity: 1, y: 0, stagger: .12, duration: .55, ease: 'power2.out' }, 2.2);
      } else if (right) {
        tl.fromTo(right.children, { opacity: 0, y: 12 }, { opacity: 1, y: 0, stagger: .12, duration: .6, ease: 'power2.out' }, 0);
      }
      if (instant) tl.progress(1);
      return tl;
    }
    // hide what is on a spread so it can bloom again when it is shown
    function prime(k) {
      const right = leaves[k + 1] && $('.rbook__face--front .rpage', leaves[k + 1]);
      const left = $('.rbook__face--back .rpage', leaves[k]);
      if (left) gsap.set([$('.rpage__bloom', left), ...left.querySelectorAll('.rpage__om, .rpage__verse, .rpage__sub')], { opacity: 0 });
      if (right && !right.classList.contains('rpage--end')) gsap.set([$('.rpage__bloom', right), $('.polaroid', right), ...right.querySelectorAll('.rpage__kanda, .rpage__title, .rpage__text, .rpage__num')], { opacity: 0 });
      else if (right) gsap.set(right.children, { opacity: 0 });
    }
    const update = () => {
      count.textContent = spread < 0 ? 'Cover' : (spread + 1) + ' / ' + SPREADS;
      prevB.disabled = spread < 0; nextB.disabled = spread >= SPREADS - 1;
      prevB.setAttribute('aria-label', spread === 0 ? 'Close the book' : 'Previous page');
      nextB.setAttribute('aria-label', spread < 0 ? 'Open the book' : 'Next page');
    };
    const hint = $('#rbookOpen');

    // turn one leaf with a soft shadow sweeping across it
    function turn(i, forward, after) {
      const leaf = leaves[i], faces = $$('.rbook__face', leaf);
      gsap.set(leaf, { zIndex: 100 });
      const d = ANIM ? 1.35 : 0;
      gsap.timeline({ onComplete: () => { gsap.set(leaf, { zIndex: forward ? zLeft(i) : zRight(i) }); busy = false; after && after(); } })
        .to(leaf, { rotateY: forward ? -180 : 0, duration: d, ease: 'power2.inOut' }, 0)
        .fromTo(faces, { '--shade': 0 }, { '--shade': .55, duration: d / 2, ease: 'sine.in', yoyo: true, repeat: 1 }, 0);
    }
    function go(to, user) {
      if (to === -1 && spread === 0) return close();
      if (to >= 0 && spread < 0) return open();
      if (busy || to < 0 || to > SPREADS - 1 || to === spread) return;
      if (user) pause();
      busy = true;
      if (to > spread) { const k = spread + 1; prime(k); turn(k, true); setTimeout(() => reveal(k), ANIM ? 900 : 0); spread = k; }
      else { const k = spread - 1; prime(k); turn(spread, false); setTimeout(() => reveal(k), ANIM ? 900 : 0); spread = k; }
      update();
    }
    // the book opens: cover turns, the first spread blooms
    function open() {
      if (spread >= 0 || busy) return;
      busy = true; spread = 0; update(); prime(0);
      book.classList.add('is-open'); stage.classList.remove('is-closed');
      const tl = gsap.timeline();
      if (hint) tl.to(hint, { autoAlpha: 0, duration: .3 }, 0);
      if (ANIM && intro) tl.to(intro, { opacity: 0, y: -30, scale: 1.06, duration: .9, ease: 'power2.in' }, 0);
      gsap.set(book, { x: closedX() });
      tl.fromTo(book, { opacity: 0, scale: .92 }, { opacity: 1, scale: 1, duration: ANIM ? .9 : 0, ease: 'power2.out' }, ANIM ? .45 : 0)
        .add(() => turn(0, true, startAuto), ANIM ? 1.3 : 0)
        .to(book, { x: () => narrow() ? 0 : 0, duration: ANIM ? 1.35 : 0, ease: 'power2.inOut' }, ANIM ? 1.4 : 0)
        .add(() => reveal(0), ANIM ? 2.1 : 0);
    }
    // close the book again: the cover turns back, then the grand Ramayana book returns
    function close() {
      if (busy || spread !== 0) return;
      busy = true; stopAuto(); clearTimeout(idleTimer);
      spread = -1; update();
      book.classList.remove('is-open');
      const tl = gsap.timeline({ onComplete: () => { busy = false; stage.classList.add('is-closed'); } });
      tl.add(() => turn(0, false), 0);
      busy = true;
      tl.to(book, { x: closedX(), duration: ANIM ? 1.35 : 0, ease: 'power2.inOut' }, 0);
      if (ANIM && intro) {
        tl.to(book, { opacity: 0, scale: .94, duration: .7, ease: 'power2.in' }, 1.5)
          .fromTo(intro, { opacity: 0, y: 24, scale: .96 }, { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out' }, 1.75);
      }
      if (hint) tl.fromTo(hint, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .6, ease: 'power2.out' }, ANIM ? 2.3 : 0);
    }
    if (hint) hint.addEventListener('click', () => open());
    if (intro) intro.addEventListener('click', () => { if (spread < 0) open(); });
    // pages also turn by themselves, slowly; any touch pauses that for a while
    function startAuto() { stopAuto(); auto = setInterval(() => { if (spread >= SPREADS - 1) return stopAuto(); go(spread + 1); }, 7000); }
    function stopAuto() { clearInterval(auto); auto = null; }
    function pause() { stopAuto(); clearTimeout(idleTimer); idleTimer = setTimeout(startAuto, 14000); }

    prevB.addEventListener('click', () => go(spread - 1, true));
    nextB.addEventListener('click', () => go(spread + 1, true));
    // tap the right page to go forward, the left page to go back; swipe on phones
    book.addEventListener('click', e => {
      if (spread < 0) return open();
      const r = book.getBoundingClientRect(), mid = narrow() ? r.left + r.width * .5 : r.left + r.width / 2;
      go(e.clientX > mid ? spread + 1 : spread - 1, true);
    });
    let sx = null;
    stage.addEventListener('pointerdown', e => { sx = e.clientX; });
    stage.addEventListener('pointerup', e => { if (sx == null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 50) go(dx < 0 ? spread + 1 : spread - 1, true); });
    stage.addEventListener('pointercancel', () => { sx = null; });

    update();
    if (!ANIM) { if (intro) intro.remove(); open(); return; }
    gsap.set(book, { opacity: 0, x: closedX() });
    ScrollTrigger.create({ trigger: stage, start: 'top 72%', once: true, onEnter: open });
    // stop turning pages when the book is out of view
    ScrollTrigger.create({ trigger: stage, start: 'top bottom', end: 'bottom top', onToggle: s => { if (!s.isActive) stopAuto(); else if (spread >= 0 && !auto) startAuto(); } });
  }

  /* ---------------------------------------------------------------------
     Shared sound (Web Audio, no files): unlocked on the guest's first tap
     --------------------------------------------------------------------- */
  function audio() {
    try { return audio.ctx || (audio.ctx = new (window.AudioContext || window.webkitAudioContext)()); } catch (e) { return null; }
  }
  ['pointerdown', 'keydown', 'touchend'].forEach(ev => addEventListener(ev, () => { const c = audio(); if (c && c.state === 'suspended') c.resume(); }, { passive: true }));
  function noiseBurst(ctx, t, dur, freq, q, vol, shape = 3.5) {
    const len = Math.floor(ctx.sampleRate * dur), buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, shape);
    const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    src.buffer = buf; f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q; g.gain.value = vol;
    src.connect(f).connect(g).connect(ctx.destination); src.start(t);
    return f;
  }
  // the arrow leaving the string (silenced per user instruction)
  function whoosh() {}
  // the cracker 'pop' (silenced per user instruction)
  function crackerPop() {}

  /* ---------------------------------------------------------------------
     Marigold petals for the crimson sections (falling + bursts)
     --------------------------------------------------------------------- */
  const marigolds = {};
  function marigoldRain(cv) {
    const ctx = cv.getContext('2d');
    const cols = ['#ffb300', '#ff9800', '#f57c00', '#ffca28', '#ef6c00', '#ffd54f'];
    let W = 0, H = 0, dpr = 1, parts = [], visible = false;
    const mk = (burst, x, y, power = 1) => {
      const a = Math.random() * Math.PI * 2, sp = (2 + Math.random() * 7) * power;
      return burst
        ? { x, y, vx: Math.cos(a) * sp * dpr, vy: (Math.sin(a) * sp - 3.2) * dpr, r: (3 + Math.random() * 4.5) * dpr, rot: Math.random() * 6.28, vr: (Math.random() - .5) * .25, c: cols[Math.random() * cols.length | 0], life: 1, burst: true }
        : { x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .3 * dpr, vy: (.5 + Math.random() * 1.1) * dpr, r: (2.6 + Math.random() * 4) * dpr, rot: Math.random() * 6.28, vr: (Math.random() - .5) * .06, c: cols[Math.random() * cols.length | 0], life: 1, burst: false, ph: Math.random() * 6.28 };
    };
    function size() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = cv.width = cv.offsetWidth * dpr; H = cv.height = cv.offsetHeight * dpr;
      const n = reduced ? 0 : (innerWidth < 600 ? 22 : 40);
      parts = parts.filter(p => p.burst).concat(Array.from({ length: n }, () => mk(false)));
    }
    size(); addEventListener('resize', size);
    if ('ResizeObserver' in window) new ResizeObserver(size).observe(cv);
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(cv);
    (function loop() {
      requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      ctx.clearRect(0, 0, W, H);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        if (p.burst) { p.vy += .13 * dpr; p.vx *= .985; p.vy *= .992; p.life -= .0065; if (p.life <= 0) { parts.splice(i, 1); continue; } }
        else { p.ph += .02; p.x += Math.sin(p.ph) * .35 * dpr; if (p.y > H + 20) { p.y = -20; p.x = Math.random() * W; } }
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save(); ctx.globalAlpha = Math.min(1, p.life * 1.4) * .92; ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.c; ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * .58, 0, 0, 6.283); ctx.fill();
        ctx.globalAlpha *= .5; ctx.fillStyle = '#fff3c4'; ctx.beginPath(); ctx.ellipse(-p.r * .25, -p.r * .12, p.r * .35, p.r * .16, 0, 0, 6.283); ctx.fill();
        ctx.restore();
      }
    })();
    return {
      burst(clientX, clientY, n = 90, power = 1) {
        if (reduced) return;
        const r = cv.getBoundingClientRect();
        for (let i = 0; i < n; i++) parts.push(mk(true, (clientX - r.left) * dpr, (clientY - r.top) * dpr, power));
      }
    };
  }
  $$('.crimson__petals').forEach(cv => { marigolds[cv.closest('section').id] = marigoldRain(cv); });

  /* ---------------------------------------------------------------------
     04 · SAVE THE DATE — draw the bow, release, the arrow breaks the seal
     --------------------------------------------------------------------- */
  function initSave() {
    const sec = $('#save-the-date'); if (!sec) return;
    $('#addToCalendar')?.addEventListener('click', () => {
      const c = CONFIG.calendar;
      const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
      const esc = s => s.replace(/[,;\\]/g, m => '\\' + m);
      const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Ram and Sita Wedding//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
        'UID:ram-sita-wedding-20270327@ramwedssita.example', 'DTSTAMP:' + stamp, 'DTSTART:' + c.startUTC, 'DTEND:' + c.endUTC,
        'SUMMARY:' + esc(c.title), 'LOCATION:' + esc(c.location), 'DESCRIPTION:' + esc(c.description), 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
      a.download = 'ram-sita-wedding.ics';
      document.body.appendChild(a); a.click(); a.remove();
      toast('Saved — see you on 27 March 2027!');
    });
    if (!ANIM) { sec.classList.add('is-open'); return; }

    const str = $('#sdString'), arrow = $('#sdArrow'), plaque = $('#sdPlaque'), thread = $('#sdThread'), bow = $('#sdBow'), inner = $('.sd__inner', sec);
    const pull = { v: 0 };
    const setString = () => str.setAttribute('d', `M44 30 L300 ${(30 - 130 * pull.v).toFixed(1)} L556 30`);
    const setPull = () => { setString(); gsap.set(arrow, { yPercent: -39.4 * pull.v }); };
    gsap.set('.sd__pillar', { scaleY: 0, transformOrigin: '50% 100%' });
    let state = 'idle', autoT;

    const draw = () => {
      if (state !== 'idle') return;
      state = 'drawing';
      gsap.to(pull, { v: 1, duration: 1.5, ease: 'power2.inOut', onUpdate: setPull, onComplete: () => { state = 'drawn'; autoT = setTimeout(release, 2400); } });
    };
    ScrollTrigger.create({ trigger: sec, start: 'top 45%', once: true, onEnter: draw });
    bow.addEventListener('click', () => {
      if (state === 'idle' || state === 'drawing') { gsap.killTweensOf(pull); pull.v = 1; setPull(); state = 'drawn'; }
      release();
    });

    function release() {
      if (state !== 'drawn') return;
      clearTimeout(autoT); state = 'flying';
      whoosh();
      // the string snaps forward and settles
      gsap.timeline()
        .to(pull, { v: -.14, duration: .1, ease: 'power4.in', onUpdate: setString })
        .to(pull, { v: 0, duration: 1.1, ease: 'elastic.out(1.1, .28)', onUpdate: setString });
      const ir = inner.getBoundingClientRect(), br = bow.getBoundingClientRect();
      const a = arrow.getBoundingClientRect(), p = plaque.getBoundingClientRect();
      const stringY = br.top + br.height * .533 - ir.top;
      const dy = (p.top + p.height * .5) - a.bottom;
      gsap.set(thread, { top: stringY, height: 0, opacity: 1 });
      gsap.to(arrow, {
        y: '+=' + dy, duration: .6, ease: 'power3.in',
        onUpdate() {
          const r = arrow.getBoundingClientRect(), nock = r.top + r.height * (6 / 330) - ir.top;
          thread.style.height = Math.max(0, nock - stringY) + 'px';
        },
        onComplete: hit
      });
    }

    function hit() {
      state = 'open';
      const p = plaque.getBoundingClientRect(), cx = p.left + p.width / 2, cy = p.top + p.height / 2;
      crackerPop();
      marigolds['save-the-date']?.burst(cx, cy, small() ? 90 : 150, 1.1);
      shatter(p);
      gsap.to(arrow, { opacity: 0, scale: .6, duration: .25, ease: 'power2.in' });
      gsap.to(thread, { opacity: 0, duration: 1, delay: .4 });
      sec.classList.add('is-open');
      gsap.timeline({ delay: .12 })
        .fromTo('.sd__ring', { scale: .2, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.5, ease: 'expo.out' }, 0)
        .fromTo('#sdReveal', { opacity: 0, scale: .7 }, { opacity: 1, scale: 1, duration: 1.2, ease: 'back.out(1.5)' }, .05)
        .from('#sdReveal > *:not(.sd__ring)', { y: 16, opacity: 0, duration: .8, stagger: .1, ease: 'power3.out' }, .3)
        .to('.sd__pillar', { scaleY: 1, duration: 1.4, stagger: .12, ease: 'power3.out' }, .2);
    }

    // the golden seal splits into shards that fly out with the petals
    function shatter(rect) {
      const host = $('#sdTarget'), hr = host.getBoundingClientRect();
      const bg = getComputedStyle(plaque).backgroundImage;
      const n = 9, base = Math.random() * Math.PI;
      plaque.style.visibility = 'hidden';
      for (let i = 0; i < n; i++) {
        const a1 = base + (i / n) * Math.PI * 2, a2 = base + ((i + 1) / n) * Math.PI * 2, am = (a1 + a2) / 2;
        const pt = a => `${(50 + Math.cos(a) * 140).toFixed(1)}% ${(50 + Math.sin(a) * 140).toFixed(1)}%`;
        const s = document.createElement('span');
        s.className = 'sd__shard';
        Object.assign(s.style, { left: rect.left - hr.left + 'px', top: rect.top - hr.top + 'px', width: rect.width + 'px', height: rect.height + 'px', backgroundImage: bg, clipPath: `polygon(${48 + Math.random() * 4}% ${48 + Math.random() * 4}%, ${pt(a1)}, ${pt(am)}, ${pt(a2)})` });
        host.appendChild(s);
        const dist = 140 + Math.random() * 160;
        gsap.timeline({ onComplete: () => s.remove() })
          .to(s, { x: Math.cos(am) * dist, y: Math.sin(am) * dist * .8 + 60, rotate: (Math.random() - .5) * 140, scale: .7, duration: 1.3, ease: 'power2.out' })
          .to(s, { opacity: 0, duration: .5 }, .8);
      }
    }
  }

  /* ---------------------------------------------------------------------
     05 · COUNTDOWN — gold chakra dial + cells
     --------------------------------------------------------------------- */
  function initCountdown() {
    const sec = $('#countdown'); if (!sec) return;
    const svg = $('#cdTicks');
    if (svg) svg.innerHTML = Array.from({ length: 60 }, (_, i) => {
      const big = i % 5 === 0;
      return `<line x1="100" y1="${big ? 1 : 4}" x2="100" y2="${big ? 12 : 9}" stroke="${big ? '#f6e3a6' : 'rgba(246,227,166,.5)'}" stroke-width="${big ? 1.8 : .9}" stroke-linecap="round" transform="rotate(${i * 6} 100 100)"/>`;
    }).join('');
    const target = new Date($('#countdownCells')?.dataset.target || CONFIG.muhurat).getTime();
    const units = ['days', 'hours', 'minutes', 'seconds'].reduce((o, k) => (o[k] = $$(`[data-unit="${k}"]`, sec), o), {});
    const hand = $('#cdHand'); let steps = 0;
    function tick() {
      let d = Math.max(0, target - Date.now());
      const days = Math.floor(d / 864e5); d -= days * 864e5;
      const h = Math.floor(d / 36e5); d -= h * 36e5;
      const m = Math.floor(d / 6e4); d -= m * 6e4;
      const s = Math.floor(d / 1e3);
      const set = (k, v, w) => units[k].forEach(el => { el.textContent = String(v).padStart(w, '0'); });
      set('days', days, 3); set('hours', h, 2); set('minutes', m, 2); set('seconds', s, 2);
      if (hand) hand.style.rotate = (steps++ * 6) + 'deg';
      if (target - Date.now() <= 0) $('#cdMuhurat').textContent = 'The celebrations have begun — shubh vivah!';
    }
    tick(); setInterval(tick, 1000);
    if (!ANIM) return;
    gsap.from('.cd__dial', { scale: .55, rotate: -90, opacity: 0, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: '.cd__dial', start: 'top 82%', once: true } });
    gsap.from('.cd__f', { opacity: 0, scale: .6, duration: .9, stagger: .12, ease: 'back.out(1.8)', delay: .7, scrollTrigger: { trigger: '.cd__dial', start: 'top 82%', once: true } });
    gsap.from('#countdownCells .countdown__cell', { y: 40, opacity: 0, rotateX: -70, duration: 1, stagger: .12, ease: 'back.out(1.8)', scrollTrigger: { trigger: '#countdownCells', start: 'top 90%', once: true } });
    gsap.from('#countdown .crimson__head > *, .cd__muhurat', { y: 30, opacity: 0, duration: 1.1, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: sec, start: 'top 75%', once: true } });
    gsap.fromTo('.cd__chakra', { scale: .92 }, { scale: 1.06, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  /* ---------------------------------------------------------------------
     06 · RAM BHAKT HANUMAN — his heart glows and opens to show Ram & Sita
     --------------------------------------------------------------------- */
  function initHanuman() {
    if (!ANIM || !$('#hanuman')) return;
    gsap.from('#hanuman .crimson__head > *', { y: 30, opacity: 0, duration: 1.1, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '#hanuman', start: 'top 75%', once: true } });
    const tl = gsap.timeline({ scrollTrigger: { trigger: '#hnFigure', start: 'top 72%', once: true } });
    tl.from('.hn__img', { y: 70, opacity: 0, scale: .94, duration: 1.5, ease: 'power3.out' })
      .from('.hn__halo', { opacity: 0, scale: .3, duration: 1.6, ease: 'power2.out' }, .2)
      .to('.hn__glow', { opacity: 1, duration: 1.3, ease: 'sine.inOut' }, 1.1)
      .fromTo('.hn__heart', { opacity: 0, scale: 0 }, {
        opacity: 1, scale: 1, duration: 1.5, ease: 'back.out(1.6)',
        onStart() {
          const r = $('.hn__heart').getBoundingClientRect();
          marigolds.hanuman?.burst(r.left + r.width / 2, r.top + r.height / 2, small() ? 50 : 80, .7);
        }
      }, 2.0)
      .to('.hn__glow', { opacity: .5, duration: 1.4 }, 3.3)
      .from('.hn__verse, .hn__blessing', { opacity: 0, y: 26, duration: 1.1, stagger: .2, ease: 'power3.out' }, 2.8);
    tl.eventCallback('onComplete', () => gsap.to('.hn__heart', { scale: 1.06, duration: .95, repeat: -1, yoyo: true, ease: 'sine.inOut' }));
  }

  /* ---------------------------------------------------------------------
     07 · EVENTS — temple doors open for each celebration
     --------------------------------------------------------------------- */
  function initEvents() {
    if (!ANIM) return;
    const units = $$('.ev-unit');
    const dots = $$('.events__progress li');
    const track = $('.events__track'), vp = $('.events__viewport');
    if (!units.length || !track) return;
    const step = () => units[0].offsetHeight + (parseFloat(getComputedStyle(units[0]).marginBottom) || 0);
    const yAt = i => () => (vp.clientHeight - units[0].offsetHeight) / 2 - i * step();
    gsap.set(track, { y: yAt(0)() });
    units.forEach(u => {
      gsap.set($('.ev-window__light', u), { opacity: .4 });
      gsap.set($('.ev-pop', u), { autoAlpha: 0, y: 40, scale: .92 });
    });
    const labels = [];
    let tl = null;
    const syncDots = self => {
      if (!tl) return;
      const t = self.progress * tl.duration(); let idx = 0;
      labels.forEach((lt, i) => { if (t >= lt - .05) idx = i; });
      dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
    };
    tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      scrollTrigger: {
        trigger: '#events', start: 'top top', end: () => '+=' + innerHeight * (units.length * 1.5 + .4),
        scrub: 1, pin: true, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: syncDots,
        onRefresh: self => requestAnimationFrame(() => syncDots(self))
      }
    });
    tl.fromTo(track, { y: yAt(0) }, { y: yAt(0), duration: .01 })
      .fromTo('.events__head', { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: .5 })
      .to('.events__seam', { opacity: 0, duration: .5 }, '<')
      .to({}, { duration: .2 });
    units.forEach((u, i) => {
      const L = $('.door--left', u), R = $('.door--right', u), light = $('.ev-window__light', u);
      const scene = $('.ev-scene', u), pop = $('.ev-pop', u);
      if (i > 0) {
        // the closed window rises away and the next one comes up into place
        tl.to(track, { y: yAt(i), duration: 1.2 })
          .to(units[i - 1], { opacity: 0, duration: .45, ease: 'power1.in' }, '<');
      }
      const lbl = 'ev' + i;
      tl.addLabel(lbl); labels.push(tl.labels[lbl]);
      // 1. doors open onto the picture of the celebration
      tl.to(L, { rotateY: -108, duration: 1 }, lbl)
        .to(R, { rotateY: 108, duration: 1 }, lbl)
        .to(light, { opacity: 1, duration: 1 }, lbl)
        .fromTo(scene, { scale: 1.12 }, { scale: 1, duration: 1.3, ease: 'power2.out' }, lbl)
        // 2. the details card pops up beneath it
        .to(pop, { autoAlpha: 1, y: 0, scale: 1, duration: .7, ease: 'back.out(1.6)' }, lbl + '+=.75')
        .to({}, { duration: .9 });
      // 3. card tucks away and the doors close before the next window
      if (i < units.length - 1) {
        tl.to(pop, { autoAlpha: 0, y: 24, scale: .96, duration: .45, ease: 'power1.in' })
          .to([L, R], { rotateY: 0, duration: .8 }, '<.15')
          .to(light, { opacity: .4, duration: .8 }, '<');
      }
    });
    tl.to({}, { duration: .4 });
    dots[0]?.classList.add('is-active');
    // Hanuman's blessing: a lotus blooms, he rises from it with his hand raised, petals fall
    const bl = $('.events__blessing');
    if (bl) {
      const lotus = $('.events__lotus', bl), han = $('.events__hanuman', bl), halo = $('.events__halo', bl);
      // place Hanuman so his raised hand sits just above the window; if the title leaves too little room,
      // he takes the space and the title gives way as he rises
      const head = $('.events__head');
      const place = () => {
        const winTop = vp.offsetTop + (vp.clientHeight - units[0].offsetHeight) / 2 - 18; // above the gold frame rings
        const headB = head.offsetTop + head.offsetHeight;
        const top0 = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 64) + 6;
        let hn = (winTop - headB - 2) / .8, hide = false;
        if (hn < 150) { hn = (winTop - top0) / .8; hide = true; }
        hn = Math.max(120, Math.min(270, hn));
        bl.style.setProperty('--hn', hn + 'px');
        bl.style.setProperty('--hn-top', (winTop - hn * .8) + 'px');
        bl.dataset.hide = hide ? '1' : '';
      };
      place(); addEventListener('resize', place); ScrollTrigger.addEventListener('refresh', place);
      gsap.set(lotus, { opacity: 0, scale: .15, rotate: -24 });
      gsap.set(halo, { opacity: 0, scale: .3 });
      gsap.set(han, { opacity: 0, y: 70, scale: .86, transformOrigin: '50% 100%' });
      const btl = gsap.timeline({ paused: true })
        .to(lotus, { opacity: 1, duration: .5, ease: 'sine.out' }, 0)
        .to(lotus, { scale: 1, rotate: 0, duration: 1.6, ease: 'back.out(1.2)' }, 0)
        .to(halo, { opacity: 1, scale: 1, duration: 1.3, ease: 'power2.out' }, .6)
        .to(han, { opacity: 1, duration: .8, ease: 'sine.out' }, .8)
        .to(han, { y: 0, scale: 1, duration: 1.6, ease: 'power3.out' }, .8)
        .to(head.children, { opacity: () => bl.dataset.hide ? 0 : 1, duration: .9, ease: 'sine.inOut' }, .6)
        .call(() => { const r = han.getBoundingClientRect(); petalBurst(r.left + r.width * .42, r.top + r.height * .55, small() ? 12 : 22); }, null, 1.9);
      ScrollTrigger.create({ trigger: '#events', start: 'top 65%', onEnter: () => btl.play(), onLeaveBack: () => btl.reverse() });
      // then petals keep falling from his raised hand, a blessing that never stops
      const stage = $('.events__stage');
      const shower = document.createElement('div'); shower.className = 'events__shower'; stage.appendChild(shower);
      let rain = null;
      const drop = () => {
        if (btl.progress() < .7) return;
        const s = stage.getBoundingClientRect(), r = han.getBoundingClientRect();
        const x = r.left - s.left + r.width * (.4 + Math.random() * .1), y = r.top - s.top + r.height * (.62 + Math.random() * .1);
        const p = document.createElement('img');
        p.src = `assets/flowers/petal-pink-0${1 + Math.floor(Math.random() * 5)}.webp`; p.alt = '';
        const w = 12 + Math.random() * 14; p.style.width = w + 'px';
        shower.appendChild(p);
        const side = Math.random() < .5 ? -1 : 1, fall = s.height - y + 40;
        gsap.timeline({ onComplete: () => p.remove() })
          .fromTo(p, { x, y, opacity: 0, scale: .4, rotation: Math.random() * 360 },
            { opacity: 1, scale: 1, duration: .5, ease: 'sine.out' })
          .to(p, { x: x + side * (40 + Math.random() * (s.width * .32)), duration: 5 + Math.random() * 3, ease: 'sine.inOut' }, 0)
          .to(p, { y: y + fall, duration: 5 + Math.random() * 3, ease: 'power1.in' }, 0)
          .to(p, { rotation: '+=' + (side * (180 + Math.random() * 360)), duration: 6, ease: 'none' }, 0)
          .to(p, { opacity: 0, duration: .8 }, '>-1');
      };
      // runs from the moment the section appears until the last celebration (Reception) has scrolled away
      ScrollTrigger.create({ trigger: '#events', start: 'top bottom', end: () => tl.scrollTrigger.end + innerHeight,
        onToggle: self => { clearInterval(rain); rain = self.isActive ? setInterval(drop, small() ? 520 : 340) : null; } });
    }
  }



  /* ---------------------------------------------------------------------
     08 · WISHING WALL
     --------------------------------------------------------------------- */
  function initWishes() {
    const form = $('#wishForm'), note = $('#wishNote');
    const scroll = $('#wishScroll'), text = $('#wishText'), wWish = $('#wishWish'), wName = $('#wishName'), count = $('#wishCount');
    if (!scroll) return;
    const KEY = 'rs-wishes';
    const mine = store.get(KEY, []);
    const list = [...mine, ...CONFIG.seedWishes];
    let i = 0;
    // "View all wishes": every blessing in a pop-up under Jatayu, each with its own lotus
    const modal = $('#wishModal'), mList = $('#wishModalList'), vCount = $('#wishViewCount');
    const LOTUS = ['assets/flowers/lotus-bloom-01.webp', 'assets/flowers/lotus-bloom-02.webp', 'assets/flowers/lotus-photo-bloom-01.webp'];
    const countAll = () => { if (vCount) vCount.textContent = '(' + list.length + ')'; };
    let lastFocus = null;
    function openAll() {
      mList.textContent = '';
      list.forEach((w, k) => {
        const li = document.createElement('li'); li.className = 'wish-modal__item';
        const img = document.createElement('img'); img.src = LOTUS[k % LOTUS.length]; img.alt = ''; img.loading = 'lazy';
        const body = document.createElement('div');
        const p = document.createElement('p'); p.className = 'wish-modal__wish'; p.textContent = '\u201c' + w.wish + '\u201d';
        const n = document.createElement('p'); n.className = 'wish-modal__name'; n.textContent = '\u2014 ' + w.name;
        body.append(p, n); li.append(img, body); mList.appendChild(li);
      });
      $('#wishModalSub').textContent = list.length + (list.length === 1 ? ' blessing' : ' blessings') + ' for Ram & Sita';
      lastFocus = document.activeElement;
      modal.hidden = false; if (lenis) lenis.stop();
      $('.wish-modal__close', modal).focus({ preventScroll: true });
      if (!ANIM) return;
      const stage = $('#wscrollStage'), bird = $('.wscroll__jatayu', modal), paper = $('#wscrollPaper'), rod = $('#wscrollBottom');
      const travel = () => -paper.offsetHeight;
      if (openTl) openTl.kill();
      openTl = gsap.timeline()
        .fromTo('.wish-modal__backdrop', { opacity: 0 }, { opacity: 1, duration: .45 })
        // Jatayu flies down from the sky holding the rolled-up scroll
        .fromTo(stage, { y: -innerHeight * .95, rotate: -4, opacity: 0 }, { y: 0, rotate: 0, opacity: 1, duration: 1.5, ease: 'power3.out' }, 0)
        .fromTo(bird, { scaleY: 1 }, { scaleY: .86, duration: .2, yoyo: true, repeat: 7, ease: 'sine.inOut' }, 0)
        .set(paper, { clipPath: 'inset(0 0 100% 0)' }, 0)
        .set(rod, { y: travel }, 0)
        .set(mList.children, { opacity: 0, y: 10 }, 0)
        // then the scroll unrolls from top to bottom
        .to(paper, { clipPath: 'inset(0 0 0% 0)', duration: 1.3, ease: 'power2.inOut' }, 1.45)
        .to(rod, { y: 0, duration: 1.3, ease: 'power2.inOut' }, 1.45)
        .to(mList.children, { opacity: 1, y: 0, stagger: .06, duration: .45, ease: 'power2.out' }, 2.45);
    }
    let openTl = null;
    function closeAll() {
      const end = () => { modal.hidden = true; if (lenis) lenis.start(); if (lastFocus) lastFocus.focus({ preventScroll: true }); };
      if (!ANIM) return end();
      const stage = $('#wscrollStage'), paper = $('#wscrollPaper'), rod = $('#wscrollBottom');
      if (openTl) openTl.kill();
      // roll the scroll back up, then Jatayu flies away
      gsap.timeline({ onComplete: end })
        .to(paper, { clipPath: 'inset(0 0 100% 0)', duration: .7, ease: 'power2.in' })
        .to(rod, { y: -paper.offsetHeight, duration: .7, ease: 'power2.in' }, 0)
        .to(stage, { y: -innerHeight, opacity: 0, duration: .8, ease: 'power2.in' }, .6)
        .to('.wish-modal__backdrop', { opacity: 0, duration: .45 }, .9);
    }
    if (modal) {
      document.body.appendChild(modal);  // outside the section so nothing clips it
      countAll();
      $('#wishViewAll').addEventListener('click', openAll);
      modal.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', closeAll));
      addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeAll(); });
    }
    // shrink the writing until it fits the scroll
    const fit = () => {
      let fs = 18;
      text.style.setProperty('--fs', fs + 'px');
      while (fs > 11 && text.scrollHeight > scroll.clientHeight - 6) { fs -= 1; text.style.setProperty('--fs', fs + 'px'); }
    };
    const fill = () => {
      const w = list[i];
      wWish.textContent = '“' + w.wish + '”';
      wName.textContent = '— ' + w.name;
      count.textContent = (i + 1) + ' / ' + list.length;
      fit();
    };
    const show = (next, dir = 1) => {
      i = (next + list.length) % list.length;
      if (!ANIM) return fill();
      gsap.timeline()
        .to(text, { opacity: 0, y: -14 * dir, duration: .35, ease: 'power1.in' })
        .add(fill)
        .fromTo(text, { opacity: 0, y: 14 * dir }, { opacity: 1, y: 0, duration: .55, ease: 'power2.out' });
    };
    fill();
    $('#wishPrev').addEventListener('click', () => show(i - 1, -1));
    $('#wishNext').addEventListener('click', () => show(i + 1, 1));
    addEventListener('resize', fit);
    // a slow, gentle turn through the blessings while nobody is touching the arrows
    let auto = setInterval(() => show(i + 1, 1), 7000);
    ['#wishPrev', '#wishNext'].forEach(s => $(s).addEventListener('click', () => { clearInterval(auto); auto = setInterval(() => show(i + 1, 1), 9000); }));

    form.addEventListener('submit', e => {
      e.preventDefault();
      const fd = new FormData(form);
      const w = { name: String(fd.get('name')).trim().slice(0, 60), wish: String(fd.get('wish')).trim().slice(0, 280) };
      if (!w.name || !w.wish) { note.textContent = 'Please add your name and a blessing.'; return; }
      mine.unshift(w); store.set(KEY, mine.slice(0, 30));
      list.unshift(w);
      countAll();
      form.reset();
      note.textContent = 'Your blessing is on its way to the scroll…';
      const lotus = $('.wish-form__lotus', form);
      const land = () => {
        const s = scroll.getBoundingClientRect();
        petalBurst(s.left + s.width / 2, s.top + s.height / 2, 22);
        show(0, 1);
        note.textContent = 'Your blessing now hangs on Jatayu’s scroll. Dhanyavaad!';
      };
      if (!ANIM || !lotus) { land(); return; }
      // the lotus lifts off the form and carries the wish up to the scroll (it follows the scroll even while the page moves)
      const a = lotus.getBoundingClientRect();
      const fly = lotus.cloneNode(); fly.className = 'wish-flyer'; fly.style.opacity = 0;
      Object.assign(fly.style, { left: '0px', top: '0px', width: a.width + 'px' });
      document.body.appendChild(fly);
      const sx = a.left, sy = a.top, st = { t: 0 };
      gsap.fromTo(fly, { opacity: 0 }, { opacity: 1, duration: .35 });
      const place = () => {
        const s = scroll.getBoundingClientRect(), t = st.t;
        const tx = s.left + s.width / 2 - a.width / 2, ty = s.top + s.height / 2 - a.height / 2;
        const x = sx + (tx - sx) * t, y = sy + (ty - sy) * t - Math.sin(Math.PI * t) * 120;
        fly.style.transform = `translate(${x}px, ${y}px) rotate(${-8 + 20 * t}deg) scale(${1 - .5 * t})`;
      };
      place();
      if (lenis) lenis.scrollTo('#wishBoard', { offset: -70, duration: 1.6 });
      else $('#wishBoard').scrollIntoView({ behavior: 'smooth', block: 'start' });
      gsap.timeline({ onComplete: () => { fly.remove(); land(); } })
        .to(st, { t: 1, duration: 2, ease: 'sine.inOut', onUpdate: place })
        .to(fly, { opacity: 0, duration: .35, ease: 'power2.in' }, 1.75);
    });
  }


  /* ---------------------------------------------------------------------
     09 · RSVP — envelope opens, card slides out
     --------------------------------------------------------------------- */
  function initRSVP() {
    const stage = $('#rsvpStage'), scene = $('#rsvpScene'), done = $('#rsvpDone');
    if (!stage) return;
    const fly = $('#rsvpFly'), env = $('#rsvpEnv'), seal = $('#envelopeSeal'), card = $('#rsvpCard');
    const flap = $('.rsvp-env__flap', env), letter = $('.rsvp-env__letter', env);
    const KEY = 'rs-rsvp';
    let opened = false;

    // 1. Hanuman flies down from the sky and settles in the middle, holding the hill
    if (ANIM) {
      const start = () => gsap.set(fly, { autoAlpha: 0, x: '-14vw', y: '-75vh', rotate: -12, scale: .7 });
      start();
      let flyIn = null;
      ScrollTrigger.create({
        trigger: stage, start: 'top 85%',
        onEnter: () => {
          flyIn = gsap.timeline()
            .to(fly, { autoAlpha: 1, duration: .8, ease: 'sine.out' }, 0)
            .to(fly, { x: 0, duration: 3.4, ease: 'sine.out' }, 0)
            .to(fly, { y: 0, duration: 3.4, ease: 'power3.out' }, 0)
            .to(fly, { rotate: 0, scale: 1, duration: 3.6, ease: 'power2.out' }, 0)
            .add(() => { const r = env.getBoundingClientRect(); petalBurst(r.left + r.width / 2, r.top + r.height / 2, small() ? 12 : 20); }, 3.1);
        },
        onLeaveBack: () => { if (flyIn) flyIn.kill(); resetAll(); start(); }
      });
    }

    // 2. tap the wax seal: it breaks, the flap opens, the letter rises and the invitation comes out
    function openEnvelope() {
      if (opened) return; opened = true;
      stage.classList.add('is-open');
      if (!ANIM) { gsap.set(card, { autoAlpha: 1 }); return; }
      const s = seal.getBoundingClientRect();
      petalBurst(s.left + s.width / 2, s.top + s.height / 2, small() ? 12 : 18);
      gsap.set(card, { autoAlpha: 0 });
      const e = env.getBoundingClientRect(), c = card.getBoundingClientRect();
      const dx = e.left + e.width / 2 - (c.left + c.width / 2), dy = e.top + e.height / 2 - (c.top + c.height / 2);
      gsap.timeline()
        .to(seal, { autoAlpha: 0, duration: .35, ease: 'power2.in' })
        .to(flap, { rotateX: 180, duration: .8, ease: 'power2.inOut' }, .2)
        .to(letter, { yPercent: -75, duration: .7, ease: 'power2.out' }, .85)
        .fromTo(card, { autoAlpha: 0, x: dx, y: dy, scale: .12, rotate: -4 },
          { autoAlpha: 1, x: 0, y: 0, scale: 1, rotate: 0, duration: 1.2, ease: 'power3.out' }, 1.35)
        .to(letter, { autoAlpha: 0, duration: .4 }, 1.4)
        .from('#rsvpForm > *', { y: 12, opacity: 0, stagger: .08, duration: .5, ease: 'power2.out' }, 2.0)
        .add(() => { if (card.getBoundingClientRect().bottom > innerHeight - 60) card.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 2.6);
    }
    seal.addEventListener('click', openEnvelope);

    // 3. accept: Hanuman, the hill, the envelope and the card fade away;
    //    Ram walks in from the left, Sita from the right, and they meet in the middle to thank the guest
    const ram = $('.rsvp-walker--ram'), sita = $('.rsvp-walker--sita');
    const bodies = [$('.rsvp-walker__body', ram), $('.rsvp-walker__body', sita)];
    let walkTl = null;
    function walkIn() {
      const off = Math.max(innerWidth * .62, 320);
      gsap.set(ram, { x: -off, autoAlpha: 0 }); gsap.set(sita, { x: off, autoAlpha: 0 });
      gsap.set('.rsvp-thanks__halo', { opacity: 0, scale: .4 });
      gsap.set('#rsvpThanksTitle, #rsvpThanksText, #rsvpReplay', { opacity: 0, y: 16 });
      const T = small() ? 3.4 : 3.8, step = .46, steps = Math.round(T / step) - 1;
      walkTl = gsap.timeline()
        .to([ram, sita], { autoAlpha: 1, duration: .9, ease: 'sine.out' }, 0)
        // an unhurried, even pace that slows gently as they come close
        .to([ram, sita], { x: 0, duration: T, ease: 'power1.out' }, 0)
        // the soft rise and fall of each step, and a slight sway of the body
        .fromTo(bodies, { y: 0 }, { y: -4, duration: step / 2, ease: 'sine.inOut', yoyo: true, repeat: steps * 2 - 1, stagger: .12 }, 0)
        .fromTo(bodies, { rotate: -.6 }, { rotate: .6, duration: step, ease: 'sine.inOut', yoyo: true, repeat: steps - 1, stagger: .12 }, 0)
        .to(bodies, { y: 0, rotate: 0, duration: .5, ease: 'sine.out' }, T - .3)
        // they meet: a warm glow, the thank you, and petals
        .to('.rsvp-thanks__halo', { opacity: 1, scale: 1, duration: 1.4, ease: 'power2.out' }, T - .5)
        .to('#rsvpThanksTitle, #rsvpThanksText, #rsvpReplay', { y: 0, opacity: 1, stagger: .14, duration: .7, ease: 'power3.out' }, T - .1)
        .add(() => {
          const b = $('.rsvp-thanks__couple').getBoundingClientRect();
          [0, 350, 700].forEach(d => setTimeout(() => petalBurst(b.left + b.width * (.3 + Math.random() * .4), b.top + b.height * .25, small() ? 16 : 24), d));
        }, T - .2);
    }
    function showDone(celebrate) {
      const swap = () => { gsap.set(scene, { autoAlpha: 0 }); done.hidden = false; };
      if (!ANIM || !celebrate) { swap(); return; }
      const a = $('#rsvpAccept').getBoundingClientRect();
      petalBurst(a.left + a.width / 2, a.top + a.height / 2, small() ? 16 : 26);
      gsap.timeline()
        .to(scene, { autoAlpha: 0, scale: .94, duration: .8, ease: 'power2.in' }, .15)
        .add(swap)
        .add(() => { const c = $('.rsvp-thanks__couple'); if (c.getBoundingClientRect().top < 70 || done.getBoundingClientRect().bottom > innerHeight + 40) done.scrollIntoView({ behavior: 'smooth', block: 'center' }); })
        .add(walkIn, '+=.25');
    }
    // back to the very beginning: Hanuman with the closed envelope
    function resetAll() {
      if (walkTl) walkTl.kill();
      done.hidden = true; opened = false; stage.classList.remove('is-open');
      gsap.set(done, { autoAlpha: 1 });
      gsap.set(scene, { autoAlpha: 1, scale: 1 });
      gsap.set(card, { autoAlpha: 0, x: 0, y: 0 }); gsap.set(flap, { rotateX: 0 }); gsap.set(letter, { yPercent: 0, autoAlpha: 1 }); gsap.set(seal, { autoAlpha: 1 });
    }
    $('#rsvpAccept').addEventListener('click', () => {
      store.set(KEY, { status: 'accept', at: new Date().toISOString() });
      showDone(true);
    });

    // Replay: back to Hanuman with the closed envelope
    $('#rsvpReplay').addEventListener('click', () => {
      if (!ANIM) { resetAll(); return; }
      gsap.timeline()
        .to(done, { autoAlpha: 0, duration: .45, ease: 'power1.in' })
        .add(resetAll)
        .fromTo(scene, { autoAlpha: 0, scale: .94 }, { autoAlpha: 1, scale: 1, duration: .9, ease: 'power2.out' });
    });
    // the answer is remembered, but every visit starts again with Hanuman flying in
  }


  /* ---------------------------------------------------------------------
     13 · THANK YOU — pink & gold fireworks over the temple
     --------------------------------------------------------------------- */
  function initFireworks() {
    const cv = $('#fireworks'); if (!cv) return;
    // petals drifting down over the sky, endlessly
    const pbox = $('#thanksPetals');
    if (pbox && !reduced) {
      const n = small() ? 14 : 26;
      for (let i = 0; i < n; i++) {
        const p = document.createElement('img');
        p.src = `assets/flowers/petal-pink-0${1 + (i % 5)}.svg`; p.alt = '';
        const t = 9 + Math.random() * 9;
        p.style.cssText = `--x:${Math.random() * 100}%;--w:${14 + Math.random() * 18}px;--t:${t}s;--d:${-Math.random() * t}s;--sway:${(20 + Math.random() * 50) * (Math.random() < .5 ? -1 : 1)}px`;
        pbox.appendChild(p);
      }
    }
    if (reduced) return;
    const ctx = cv.getContext('2d');
    // rich colours that show up against the light sunrise sky
    const palettes = [['#C2185B', '#E8638F', '#F48FB1', '#D4AF5A'], ['#B8862B', '#E0A526', '#FF8F00', '#D4AF5A'], ['#9C1B3A', '#C2185B', '#D4AF5A', '#F06292'], ['#E65100', '#FFB300', '#C2185B', '#B8862B']];
    let W, H, dpr, rockets = [], sparks = [], running = false, lastLaunch = 0;
    function size() { dpr = Math.min(devicePixelRatio || 1, 2); W = cv.width = cv.offsetWidth * dpr; H = cv.height = cv.offsetHeight * dpr; }
    size(); addEventListener('resize', size);
    function launch() {
      const x = W * (.15 + Math.random() * .7);
      rockets.push({ x, y: H, vx: (Math.random() - .5) * 1.2 * dpr, vy: -(9 + Math.random() * 3.5) * dpr, ty: H * (.12 + Math.random() * .28), pal: palettes[(Math.random() * palettes.length) | 0] });
    }
    function explode(r) {
      const n = 70 + (Math.random() * 50) | 0;
      const ring = Math.random() < .35;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + Math.random() * .1;
        const sp = (ring ? 4.2 : Math.random() * 4.6 + 1) * dpr;
        sparks.push({ x: r.x, y: r.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, decay: .010 + Math.random() * .012, c: r.pal[(Math.random() * r.pal.length) | 0], s: (Math.random() * 1.8 + 1.4) * dpr });
      }
    }
    function frame(now) {
      if (!running) return;
      requestAnimationFrame(frame);
      if (now - lastLaunch > 650 + Math.random() * 700) { launch(); lastLaunch = now; }
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';
      rockets = rockets.filter(r => {
        r.x += r.vx; r.y += r.vy; r.vy += .12 * dpr;
        ctx.fillStyle = '#E0A526'; ctx.beginPath(); ctx.arc(r.x, r.y, 2 * dpr, 0, 6.283); ctx.fill();
        if (r.y <= r.ty || r.vy >= 0) { explode(r); return false; }
        return true;
      });
      sparks = sparks.filter(p => {
        p.vx *= .985; p.vy = p.vy * .985 + .045 * dpr; p.x += p.vx; p.y += p.vy; p.life -= p.decay;
        if (p.life <= 0) return false;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.s * (.5 + p.life * .5), 0, 6.283); ctx.fill();
        return true;
      });
      ctx.globalAlpha = 1;
    }
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) { running = true; size(); requestAnimationFrame(frame); }
      else if (!e.isIntersecting) { running = false; }
    }, { threshold: .15 }).observe(cv);
  }

  /* ---------------------------------------------------------------------
     Boot
     --------------------------------------------------------------------- */
  // pinned sections are created top-to-bottom so later triggers account for their spacing
  // each section boots independently so one failure never blanks the rest of the invitation
  [initHero, initGatefold, initSave, initCountdown, initHanuman, initStory, initStitchLotus, initHeartDraw, initFamilies, initEvents, initReveals, initWishes, initRSVP, initFireworks].forEach(fn => {
    try { fn(); } catch (e) { console.error('[wedding] ' + fn.name + ' failed:', e && e.stack || e); }
  });
  if (ANIM) {
    addEventListener('load', () => ScrollTrigger.refresh());
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }
})();

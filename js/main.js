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

  /* Opening: the scene fades in, Sita's hand comes down to the lotus bud, at her touch it
     blossoms with a golden glow and petals, the view drifts into the lotus and a burst of
     sunlight opens onto the Ram Mandir (the first page). Tap Skip to go straight in. */
  function playOpening(done) {
    const intro = $('#intro');
    if (!intro) return done();
    const q = s => $(s, intro);
    const stage = q('#introStage'), bg = q('.intro__bg'), ram = q('.intro__ram'), sita = q('.intro__sita');
    const blossom = q('.intro__blossom'), fin = q('.intro__final'), glow = q('#introGlow'), flash = q('#introFlash');
    // a point of the picture (fractions of its width/height) on screen, for the cover-fitted layers
    const toScreen = (fx, fy) => {
      const iw = bg.naturalWidth || 764, ih = bg.naturalHeight || 1024, vw = innerWidth, vh = innerHeight;
      const s = Math.max(vw / iw, vh / ih), rw = iw * s, rh = ih * s;
      return { x: (vw - rw) * .5 + rw * fx, y: (vh - rh) * .62 + rh * fy };
    };
    let heart, base;
    const place = () => {
      heart = toScreen(.53, .625); base = toScreen(.55, .74);
      stage.style.transformOrigin = `${heart.x}px ${heart.y}px`;
      blossom.style.transformOrigin = `${base.x}px ${base.y}px`;
      glow.style.left = heart.x + 'px'; glow.style.top = heart.y + 'px';
      flash.style.setProperty('--fx', heart.x + 'px'); flash.style.setProperty('--fy', heart.y + 'px');
    };
    place(); addEventListener('resize', place);
    let finished = false;
    const finish = () => {
      if (finished) return; finished = true;
      done();
      gsap.to(intro, { opacity: 0, duration: 1.2, ease: 'power2.out', onComplete: () => intro.remove() });
    };
    gsap.set([bg, ram, sita], { opacity: 0 });
    gsap.set(sita, { xPercent: -34, yPercent: -30 });
    gsap.set(ram, { xPercent: 6, yPercent: 20 });
    gsap.set(blossom, { scale: .2, rotate: -6 });
    const tl = gsap.timeline({ onComplete: finish });
    tl.to(bg, { opacity: 1, duration: 1.2, ease: 'sine.out' }, 0)
      .fromTo(stage, { scale: 1.08 }, { scale: 1, duration: 5.6, ease: 'sine.inOut' }, 0)
      // Sita's hand glides in from the top corner, Ram's hand rises from below holding the bud
      .to(sita, { opacity: 1, duration: .9, ease: 'sine.out' }, .3)
      .to(sita, { xPercent: 0, yPercent: 0, duration: 3.4, ease: 'power2.out' }, .3)
      .to(ram, { opacity: 1, duration: .9, ease: 'sine.out' }, .6)
      .to(ram, { xPercent: 0, yPercent: 0, duration: 3.1, ease: 'power2.out' }, .6)
      // her fingertip comes down to touch the bud
      .to(sita, { yPercent: 5, xPercent: .6, duration: .9, ease: 'sine.inOut' }, 3.7)
      // at the touch the bud blossoms, petal by petal opening outward
      .fromTo(glow, { opacity: 0, scale: .25 }, { opacity: .95, scale: 1, duration: 1.2, ease: 'power2.out' }, 4.3)
      .to(blossom, { opacity: 1, duration: .7, ease: 'sine.out' }, 4.45)
      .to(blossom, { scale: 1, rotate: 0, duration: 2.1, ease: 'power3.out' }, 4.45)
      .call(() => petalBurst(heart.x, heart.y, small() ? 16 : 26), null, 4.9)
      // the finished picture settles in (her fingers resting on the open lotus)
      .to(fin, { opacity: 1, duration: 1.1, ease: 'sine.inOut' }, 6.0)
      .to(glow, { opacity: .6, scale: 1.3, duration: 1 }, 6.0)
      // drift into the heart of the lotus, then sunlight opens the temple
      .to(stage, { scale: 3.3, duration: 2.2, ease: 'power2.in' }, 6.9)
      .to(glow, { opacity: 1, scale: 2.8, duration: 1.7, ease: 'power2.in' }, 7.3)
      .to(flash, { opacity: 1, duration: .9, ease: 'power2.in' }, 8.2)
      .to({}, { duration: .25 });
    q('#introSkip').addEventListener('click', () => { tl.kill(); finish(); });
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
      scrollTrigger: { trigger: '#welcome', start: 'top top', end: () => '+=' + innerHeight * 3.2, scrub: 1, pin: true, anticipatePin: 1 }
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
    // 4 · Ram & Sita rise into place before the temple, then the vilakku at their feet light up
    tl.fromTo('.hero__couple', { opacity: 0, y: 70, scale: .92, transformOrigin: '50% 100%' }, { opacity: 1, y: 0, scale: 1, duration: 2, ease: 'power2.out' }, 7.2)
      .fromTo('.hero__couple-diyas img', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .8, stagger: .18, ease: 'power2.out' }, 8.3)
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
    // tap a badge to turn it (lotus <-> Ram & Sita)
    $$('.chapter .badge').forEach(btn => {
      const inner = $('.badge__inner', btn);
      let turn = ANIM ? 0 : 180;
      if (!ANIM) inner.style.transform = 'rotateY(180deg)';
      btn.addEventListener('click', () => {
        turn += 180;
        if (ANIM) gsap.to(inner, { rotateY: turn, duration: 1.1, ease: 'power2.inOut', overwrite: true });
        else inner.style.transform = 'rotateY(' + turn + 'deg)';
      });
      btn._turn = v => { turn = v; };
    });
    const path = $('.timeline__line path');
    if (!ANIM || !path) return;
    path.setAttribute('pathLength', '1');
    gsap.fromTo(path, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 70%', scrub: true } });
    $$('.chapter').forEach((ch, i) => {
      const badge = $('.badge', ch), inner = $('.badge__inner', ch), body = $('.chapter__body', ch);
      const fromLeft = small() ? false : i % 2 === 0;
      gsap.timeline({ scrollTrigger: { trigger: ch, start: 'top 78%', once: true } })
        .from(badge, { scale: .6, opacity: 0, rotate: fromLeft ? 14 : -14, duration: 1.1, ease: 'back.out(1.5)' })
        .from(body, { x: small() ? 0 : (fromLeft ? -50 : 50), y: small() ? 24 : 0, opacity: 0, duration: 1.1, ease: 'power3.out' }, '-=.75')
        // hold on the lotus for a breath, then turn to Ram & Sita
        .to(inner, { rotateY: 180, duration: 1.5, ease: 'power2.inOut', onComplete: () => badge._turn && badge._turn(180) }, '+=.35');
    });
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
  // the arrow leaving the string
  function whoosh() {
    const ctx = audio(); if (!ctx) return; if (ctx.state === 'suspended') ctx.resume();
    const t = ctx.currentTime, f = noiseBurst(ctx, t, .5, 500, 1.2, .35, 1.6);
    f.frequency.setValueAtTime(400, t); f.frequency.exponentialRampToValueAtTime(2600, t + .45);
  }
  // the cracker 'pop' as the seal breaks: a crack, a low thump and a few sparkling crackles
  function crackerPop() {
    const ctx = audio(); if (!ctx) return; if (ctx.state === 'suspended') ctx.resume();
    const t = ctx.currentTime;
    noiseBurst(ctx, t, .32, 1900, .8, 1.1);
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(170, t); o.frequency.exponentialRampToValueAtTime(42, t + .28);
    g.gain.setValueAtTime(.8, t); g.gain.exponentialRampToValueAtTime(.001, t + .38);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + .4);
    for (let i = 0; i < 7; i++) noiseBurst(ctx, t + .12 + Math.random() * .55, .05, 3500 + Math.random() * 3000, 2, .18 + Math.random() * .15, 2);
  }

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
          bell();
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
  }



  /* ---------------------------------------------------------------------
     08 · WISHING WALL
     --------------------------------------------------------------------- */
  function initWishes() {
    const wall = $('#wishWall'), form = $('#wishForm'), note = $('#wishNote');
    const KEY = 'rs-wishes';
    const mine = store.get(KEY, []);
    function card(w, isNew) {
      const el = document.createElement('article');
      el.className = 'wish' + (isNew ? ' wish--new' : '');
      el.style.setProperty('--r', ((Math.random() - .5) * 2.4).toFixed(2) + 'deg');
      const p = document.createElement('p'); p.textContent = '“' + w.wish + '”';
      const f = document.createElement('footer'); f.textContent = '— ' + w.name;
      el.append(p, f);
      return el;
    }
    [...mine, ...CONFIG.seedWishes].forEach(w => wall.appendChild(card(w)));
    if (ANIM) gsap.from('.wish', { y: 40, opacity: 0, stagger: .08, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: wall, start: 'top 85%', once: true } });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const fd = new FormData(form);
      const w = { name: String(fd.get('name')).trim().slice(0, 60), wish: String(fd.get('wish')).trim().slice(0, 280) };
      if (!w.name || !w.wish) { note.textContent = 'Please add your name and a blessing.'; return; }
      mine.unshift(w); store.set(KEY, mine.slice(0, 30));
      const el = card(w, true);
      wall.prepend(el); wall.scrollTo({ top: 0, behavior: 'smooth' });
      if (ANIM) gsap.from(el, { scale: .7, opacity: 0, y: -30, duration: 1, ease: 'back.out(1.7)' });
      const r = form.querySelector('button').getBoundingClientRect();
      petalBurst(r.left + r.width / 2, r.top + r.height / 2, 16);
      form.reset();
      note.textContent = 'Your wish is floating on the wall. Dhanyavaad!';
    });
  }

  /* ---------------------------------------------------------------------
     09 · RSVP — envelope opens, card slides out
     --------------------------------------------------------------------- */
  function initRSVP() {
    const env = $('#envelope'), seal = $('#envelopeSeal'), flap = $('.envelope__flap'), card = $('#rsvpCard');
    const form = $('#rsvpForm'), done = $('#rsvpDone'), nameIn = $('#rsvpName'), guestsOut = $('#rsvpGuests');
    const KEY = 'rs-rsvp';
    let guests = 2;
    let opened = false;

    $$('.stepper').forEach(b => b.addEventListener('click', () => {
      guests = Math.min(8, Math.max(1, guests + parseInt(b.dataset.step, 10)));
      guestsOut.textContent = guests;
    }));

    function openEnvelope() {
      if (opened) return; opened = true;
      env.classList.add('is-open'); bell();
      if (!ANIM) { flap.style.transform = 'rotateX(180deg)'; flap.style.zIndex = 0; card.style.zIndex = 6; card.style.height = 'auto'; card.style.transform = 'translateY(-14%)'; return; }
      gsap.timeline()
        .to(seal, { scale: 1.35, autoAlpha: 0, duration: .45, ease: 'back.in(2)' })
        .to(flap, { rotateX: 180, duration: .8, ease: 'power2.inOut' }, '-=.1')
        .set(flap, { zIndex: 0 })
        .to(card, { yPercent: -66, duration: .9, ease: 'power2.out' })
        .set(card, { zIndex: 6 })
        .to(card, { yPercent: -14, scale: 1.03, height: 'auto', duration: .9, ease: 'power3.inOut' })
        .add(() => { ScrollTrigger.refresh(); nameIn.focus({ preventScroll: true }); });
    }
    seal.addEventListener('click', openEnvelope);
    // also open automatically once the envelope is well in view
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTimeout(openEnvelope, 700); io.disconnect(); } }, { threshold: .6 });
      io.observe(env);
    }

    function showDone(r) {
      form.hidden = true; done.hidden = false;
      const accepted = r.status === 'accept';
      $('.stamp span', done).textContent = accepted ? 'Accepted' : 'With love';
      $('#rsvpThanksTitle').textContent = accepted ? `Thank you, ${r.name}!` : `We’ll miss you, ${r.name}`;
      $('#rsvpThanksText').textContent = accepted
        ? `Your ${r.guests > 1 ? r.guests + ' seats are' : 'seat is'} reserved with love. We can’t wait to welcome you in Jaipur.`
        : 'Thank you for your blessings — you will be in our hearts at the mandap.';
      const msg = accepted
        ? `Namaste! ${r.name} joyfully accepts the invitation to ${CONFIG.couple}'s wedding on 27 March 2027 in Jaipur — ${r.guests} guest${r.guests > 1 ? 's' : ''}.`
        : `Namaste! ${r.name} regretfully cannot attend ${CONFIG.couple}'s wedding, but sends heartfelt blessings.`;
      $('#rsvpWhatsApp').href = `https://wa.me/${CONFIG.rsvpWhatsApp}?text=${encodeURIComponent(msg)}`;
      if (ANIM) gsap.from(done.children, { y: 20, opacity: 0, stagger: .08, duration: .7, ease: 'power3.out' });
      if (ANIM) gsap.from('.stamp', { scale: 2.4, opacity: 0, rotate: -40, duration: .6, ease: 'back.out(2)', delay: .2 });
    }
    function respond(status) {
      const name = nameIn.value.trim();
      if (!name) {
        nameIn.placeholder = 'Please write your name';
        nameIn.focus();
        if (ANIM) gsap.fromTo(nameIn, { x: -8 }, { x: 0, duration: .5, ease: 'elastic.out(1, .3)' });
        return;
      }
      const r = { name: name.slice(0, 60), guests: status === 'accept' ? guests : 0, status, at: new Date().toISOString() };
      store.set(KEY, r);
      showDone(r);
      if (status === 'accept') {
        bell();
        const b = card.getBoundingClientRect();
        petalBurst(b.left + b.width / 2, b.top + b.height * .4, 26);
      }
    }
    $('#rsvpAccept').addEventListener('click', () => respond('accept'));
    $('#rsvpDecline').addEventListener('click', () => respond('decline'));
    $('#rsvpEdit').addEventListener('click', () => { done.hidden = true; form.hidden = false; nameIn.focus(); });

    const saved = store.get(KEY, null);
    if (saved && saved.name) { nameIn.value = saved.name; if (saved.guests) { guests = saved.guests; guestsOut.textContent = guests; } showDone(saved); }
  }

  /* ---------------------------------------------------------------------
     13 · THANK YOU — pink & gold fireworks over the temple
     --------------------------------------------------------------------- */
  function initFireworks() {
    const cv = $('#fireworks'); if (!cv) return;
    if (ANIM) gsap.to('.thanks__bg--lit', { opacity: 1, ease: 'none', scrollTrigger: { trigger: '#thank-you', start: 'top 60%', end: 'center center', scrub: true } });
    if (reduced) return;
    const ctx = cv.getContext('2d');
    const palettes = [['#FFD1DF', '#F48FB1', '#E8638F', '#F6E3A6'], ['#F6E3A6', '#D4AF5A', '#FFB020', '#FFF3C4'], ['#FFF0F5', '#F48FB1', '#D4AF5A', '#C2185B']];
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
      ctx.globalCompositeOperation = 'lighter';
      rockets = rockets.filter(r => {
        r.x += r.vx; r.y += r.vy; r.vy += .12 * dpr;
        ctx.fillStyle = '#FFE9B0'; ctx.beginPath(); ctx.arc(r.x, r.y, 1.8 * dpr, 0, 6.283); ctx.fill();
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
  [initHero, initGatefold, initSave, initCountdown, initHanuman, initStory, initStitchLotus, initFamilies, initEvents, initReveals, initWishes, initRSVP, initFireworks].forEach(fn => {
    try { fn(); } catch (e) { console.error('[wedding] ' + fn.name + ' failed:', e && e.stack || e); }
  });
  if (ANIM) {
    addEventListener('load', () => ScrollTrigger.refresh());
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }
})();

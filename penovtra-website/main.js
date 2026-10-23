/* PE-NOVTRA — interactions */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- nav ---------- */
  const nav = $('#nav');
  const hero = $('#hero');
  const burger = $('.nav__burger');
  const onScrollNav = () => nav.classList.toggle('is-light', hero.getBoundingClientRect().bottom < 80);
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open);
  });
  $$('.nav__links a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }));

  /* ---------- hero: planting field ----------
     A grid of net-pot holes. Sprouts grow where the cursor passes
     and slowly settle back, so visitors "plant" the hero. */
  const cv = $('#field');
  const ctx = cv.getContext('2d');
  const GAP = 34;
  let pts = [], W = 0, H = 0, dpr = 1, mouse = { x: -999, y: -999 }, running = false, t0 = performance.now();

  function layout() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = hero.clientWidth; H = hero.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    pts = [];
    const ox = (W % GAP) / 2 + GAP / 2, oy = (H % GAP) / 2 + GAP / 2;
    for (let y = oy; y < H; y += GAP)
      for (let x = ox; x < W; x += GAP)
        pts.push({ x, y, g: 0, tg: 0, rot: (Math.random() - .5) * .5, seed: Math.random() });
    // an opening wave of sprouts rising from the bottom-left corner
    if (!reduced) pts.forEach(p => {
      const d = Math.hypot(p.x, H - p.y) / Math.hypot(W, H);
      if (p.seed < .16) p.delay = 300 + d * 1800;
    });
    kick();
  }

  function sprout(p, g) {
    const s = g * 9;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.strokeStyle = `rgba(154,205,43,${.35 + g * .55})`;
    ctx.fillStyle = `rgba(154,205,43,${.25 + g * .6})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -s); ctx.stroke();
    // two leaves
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.quadraticCurveTo(s * .9, -s * 1.5, s * 1.1, -s * .7);
    ctx.quadraticCurveTo(s * .45, -s * .55, 0, -s);
    ctx.moveTo(0, -s * .8);
    ctx.quadraticCurveTo(-s * .8, -s * 1.25, -s * .95, -s * .5);
    ctx.quadraticCurveTo(-s * .4, -s * .4, 0, -s * .8);
    ctx.fill();
    ctx.restore();
  }

  function frame(now) {
    ctx.clearRect(0, 0, W, H);
    let active = false;
    const R = 130;
    for (const p of pts) {
      if (p.delay !== undefined && now - t0 > p.delay) { p.tg = Math.max(p.tg, .55 + p.seed * 2); delete p.delay; }
      const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if (d < R) p.tg = Math.max(p.tg, 1 - d / R);
      p.g += (p.tg - p.g) * .08;
      p.tg *= .996;                       // slowly wilt back
      if (p.tg < .002) p.tg = 0;
      if (p.delay !== undefined || p.g > .002 || p.tg > .002) active = true;

      if (p.g < .06) {
        ctx.fillStyle = 'rgba(255,255,255,.10)';
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, 6.283); ctx.fill();
      } else {
        ctx.strokeStyle = 'rgba(255,255,255,.12)';
        ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, 6.283); ctx.stroke();
        sprout(p, Math.min(p.g, 1));
      }
    }
    if (active) requestAnimationFrame(frame); else running = false;
  }
  function kick() { if (!running) { running = true; requestAnimationFrame(frame); } }

  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    kick();
  });
  hero.addEventListener('pointerleave', () => { mouse.x = mouse.y = -999; });
  let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(layout, 120); });
  layout();

  /* hero device parallax */
  const hd = $('#heroDevice');
  if (!reduced) hero.addEventListener('pointermove', e => {
    const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
    hd.style.translate = `${nx * -14}px ${ny * -8}px`;
  });

  /* live telemetry */
  const tele = {
    temp: { v: 28.4, min: 27.6, max: 29.4, step: .3, dec: 1 },
    hum:  { v: 67, min: 63, max: 71, step: 1.5, dec: 0 },
    lux:  { v: 865, min: 820, max: 910, step: 14, dec: 0 }
  };
  setInterval(() => {
    for (const k in tele) {
      const s = tele[k];
      s.v = Math.min(s.max, Math.max(s.min, s.v + (Math.random() - .5) * 2 * s.step));
      $$(`[data-tele="${k}"]`).forEach(el => el.textContent = s.v.toFixed(s.dec));
    }
  }, 2200);

  /* ---------- reveal + counters ---------- */
  const fmt = (v, dec) => v.toFixed(dec).replace('.', ',');
  function count(el) {
    const end = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0);
    if (reduced) { el.textContent = fmt(end, dec); return; }
    const dur = 1600, t = performance.now();
    const tick = now => {
      const k = Math.min(1, (now - t) / dur), e = 1 - Math.pow(1 - k, 4);
      el.textContent = fmt(end * e, dec);
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add('is-in');
    $$('[data-count]', en.target).forEach(count);
    io.unobserve(en.target);
  }), { threshold: .2, rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- statement: words fill as you read ---------- */
  const st = $('#statement');
  (function split(node) {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(w => {
          if (!w) return;
          if (/^\s+$/.test(w)) frag.append(w);
          else { const s = document.createElement('span'); s.className = 'w'; s.textContent = w; frag.append(s); }
        });
        n.replaceWith(frag);
      } else split(n);
    });
  })(st);
  const words = $$('.w', st);
  const hl = ['media', 'tanam', 'hidroponik', 'satu', 'desain.'];
  words.forEach(w => { if (hl.includes(w.textContent)) w.classList.add('hl'); });
  function fillWords() {
    const r = st.getBoundingClientRect();
    const k = Math.min(1, Math.max(0, (innerHeight * .82 - r.top) / (r.height + innerHeight * .35)));
    const n = Math.round(k * words.length);
    words.forEach((w, i) => w.classList.toggle('on', i < n || reduced));
  }

  /* ---------- explorer ---------- */
  const PARTS = [
    { t: 'Naungan Insect Net', s: 'Proteksi hama', x: 35, y: 17, z: 1.9,
      d: 'Jaring halus menutup seluruh bak. Hama seperti kutu daun dan ulat tertahan di luar, sementara cahaya dan udara tetap masuk.' },
    { t: 'Kipas Sirkulasi', s: 'Smart environment', x: 73.6, y: 13.8, z: 2.6,
      d: 'Menjaga udara di dalam naungan tetap bergerak sehingga panas dan kelembapan berlebih terbuang. Bisa menyala otomatis sesuai pembacaan sensor.' },
    { t: 'Kanopi Buka-Tutup', s: 'Akses mudah', x: 12.5, y: 40, z: 2.1,
      d: 'Rangka lengkung berengsel dengan tali penyangga. Dibuka saat menanam dan memanen, ditutup rapat saat hujan lebat atau terik.' },
    { t: 'Zona Media Tanam', s: '2-in-1 · sisi kiri', x: 24, y: 58, z: 2,
      d: 'Bak berisi tanah atau media tanam NovGrow, cocok untuk sayuran daun, herbal, dan tanaman yang butuh media padat.' },
    { t: 'Zona Hidroponik', s: '2-in-1 · sisi kanan', x: 76, y: 53, z: 2,
      d: 'Panel net pot hidroponik untuk selada dan sayuran daun yang tumbuh cepat dan bersih, tanpa tanah.' },
    { t: 'Rangka Modular', s: 'Modular estetik', x: 41, y: 70, z: 1.7,
      d: 'Bak modular berkaki setinggi pinggang, jadi tak perlu membungkuk saat merawat. Mudah dipasang dan rapi untuk teras, balkon, atau halaman.' }
  ];
  const ex = $('#explorer'), list = $('#parts'), hsWrap = $('#hotspots'), zoom = $('#zoom'), tilt = $('#tilt'), stage = $('#stage');
  const card = $('#card'), cTag = $('#cardTag'), cTitle = $('#cardTitle'), cDesc = $('#cardDesc'), zLabel = $('#stageZoom'), coord = $('#stageCoord');
  let cur = -1;

  PARTS.forEach((p, i) => {
    const n = String(i + 1).padStart(2, '0');
    const li = document.createElement('li');
    li.innerHTML = `<button type="button" aria-pressed="false"><span class="n">${n}</span><span class="t">${p.t}</span><span class="s">${p.s}</span></button>`;
    li.firstChild.addEventListener('click', () => select(cur === i ? -1 : i));
    list.append(li);

    const b = document.createElement('button');
    b.type = 'button'; b.className = 'hs'; b.textContent = i + 1;
    b.style.setProperty('--x', p.x + '%'); b.style.setProperty('--y', p.y + '%'); b.style.setProperty('--dl', (i * .35) + 's');
    b.setAttribute('aria-label', p.t);
    b.addEventListener('click', e => { e.stopPropagation(); select(cur === i ? -1 : i); });
    hsWrap.append(b);
  });
  const listBtns = $$('button', list), hsBtns = $$('.hs', hsWrap);

  function select(i) {
    cur = i;
    ex.classList.toggle('has-active', i >= 0);
    listBtns.forEach((b, k) => b.setAttribute('aria-pressed', k === i));
    hsBtns.forEach((b, k) => b.classList.toggle('is-active', k === i));
    let z = 1;
    if (i < 0) {
      zoom.style.transform = '';
      cTag.textContent = '6 bagian utama';
      cTitle.textContent = 'Satu unit, dua cara tanam';
      cDesc.textContent = 'Klik titik bernomor pada alat atau pilih dari daftar untuk melihat setiap bagian dari dekat.';
    } else {
      const p = PARTS[i];
      z = innerWidth < 860 ? Math.min(p.z, 1.8) : p.z;
      zoom.style.transform = `scale(${z}) translate(${50 - p.x}%, ${42 - p.y}%)`;
      cTag.textContent = `${String(i + 1).padStart(2, '0')} / 06 · ${p.s}`;
      cTitle.textContent = p.t;
      cDesc.textContent = p.d;
    }
    zoom.style.setProperty('--z', z);
    zLabel.textContent = z.toFixed(1) + '×';
    card.classList.remove('swap'); void card.offsetWidth; card.classList.add('swap');
  }
  $('#prevPart').addEventListener('click', () => select(cur <= 0 ? PARTS.length - 1 : cur - 1));
  $('#nextPart').addEventListener('click', () => select((cur + 1) % PARTS.length));
  $('#resetPart').addEventListener('click', () => select(-1));
  stage.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') $('#nextPart').click();
    if (e.key === 'ArrowLeft') $('#prevPart').click();
    if (e.key === 'Escape') select(-1);
  });
  select(-1);

  // gentle 3D tilt + coordinate readout
  stage.addEventListener('pointermove', e => {
    const r = stage.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width, ny = (e.clientY - r.top) / r.height;
    coord.textContent = `X ${(nx * 100).toFixed(1).padStart(4, '0')} · Y ${(ny * 100).toFixed(1).padStart(4, '0')}`;
    if (!reduced && ex.dataset.mode === 'device') tilt.style.transform = `rotateY(${(nx - .5) * 10}deg) rotateX(${(.5 - ny) * 6}deg)`;
  });
  stage.addEventListener('pointerleave', () => { tilt.style.transform = ''; });

  // tabs
  const tabs = $$('.tabs [role="tab"]'), ind = $('.tabs__ind');
  function placeInd() {
    const a = tabs.find(t => t.getAttribute('aria-selected') === 'true');
    ind.style.width = a.offsetWidth + 'px';
    ind.style.transform = `translateX(${a.offsetLeft - 5}px)`;
  }
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(o => o.setAttribute('aria-selected', o === t));
    ex.dataset.mode = t.dataset.mode;
    $('.stage__app').setAttribute('aria-hidden', t.dataset.mode !== 'app');
    placeInd();
  }));
  addEventListener('resize', placeInd);
  document.fonts && document.fonts.ready.then(placeInd);
  placeInd();

  /* ---------- how it works: line + steps light up ---------- */
  const steps = $('#steps'), stepEls = $$('.step', steps);
  function stepProgress() {
    const r = steps.getBoundingClientRect();
    const k = Math.min(1, Math.max(0, (innerHeight * .75 - r.top) / (innerHeight * .5)));
    steps.style.setProperty('--prog', k);
    stepEls.forEach((s, i) => s.classList.toggle('is-on', k >= i / stepEls.length + .02 || reduced));
  }

  /* ---------- timeline drag-to-scroll ---------- */
  const tl = $('#timeline');
  let drag = null;
  tl.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse') return;
    drag = { x: e.clientX, s: tl.scrollLeft, moved: false };
    tl.classList.add('dragging');
  });
  addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (Math.abs(dx) > 3) drag.moved = true;
    tl.scrollLeft = drag.s - dx;
  });
  addEventListener('pointerup', () => { if (drag) { drag = null; tl.classList.remove('dragging'); } });

  /* ---------- scroll loop ---------- */
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { onScrollNav(); fillWords(); stepProgress(); ticking = false; });
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

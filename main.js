/* ==========================================================
   MEGHA PORTÕES — comportamento geral do site
   ========================================================== */
(function () {
  const M = window.MEGHA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const brl = n => Number(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const wa = (msg, num) => `https://wa.me/${num || M.whatsPrincipal}?text=${encodeURIComponent(msg)}`;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  };

  /* ---------- ícones (sprite SVG) ---------- */
  const icons = {
    saw: '<circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="1.8"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>',
    gate: '<path d="M3 20V5M21 20V5M3 8h18M3 16h18M8 8v8M12 8v8M16 8v8"/>',
    window: '<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M12 4v16M3 12h18"/>',
    door: '<path d="M6 21V4h12v17M4 21h16"/><circle cx="15" cy="13" r=".7"/>',
    panel: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 12h18M12 5v14M7 5l-4 5M21 14l-5 5"/>',
    slats: '<path d="M4 4v16M8 4v16M12 4v16M16 4v16M20 4v16"/>',
    cabinet: '<path d="M3 6h18v13H3zM12 6v13M7 10v2M17 10v2M3 9h18"/>',
    rail: '<path d="M3 7h18M5 7v13M10 7v13M15 7v13M20 7v13M3 14h18"/>',
    handrail: '<path d="M3 17L21 7M7 15v5M12 12v8M17 9v11"/>',
    whatsapp: '<path d="M3 21l1.6-4.6A8.5 8.5 0 1 1 8 19.6L3 21z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .7a4 4 0 0 1-1.7-1.7l.7-1-1-2L9 9.5z"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8"/>',
    pin: '<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/>',
    moon: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/>',
    check: '<path d="M4 12.5l5 5L20 6.5"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/>',
    print: '<path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
    play: '<path d="M7 4l13 8-13 8z"/>',
    ruler: '<path d="M3 17L17 3l4 4L7 21z"/><path d="M7 13l2 2M10 10l2 2M13 7l2 2"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5L16 9.5"/>',
    bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    wrench: '<path d="M14.5 6.5a4 4 0 0 0 5 5L11 20a2.1 2.1 0 0 1-3-3l8.5-8.5z"/><path d="M14.5 6.5l3-3 3 3-3 3"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
    box: '<path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    download: '<path d="M12 4v11M7 11l5 5 5-5M4 20h16"/>'
  };
  const ic = (n, c = '') => `<svg class="ic ${c}" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  const sprite = document.createElement('div');
  sprite.style.display = 'none';
  sprite.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg"><defs>' +
    Object.entries(icons).map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${v}</symbol>`).join('') +
    '</defs></svg>';
  document.body.prepend(sprite);

  /* ---------- tema ---------- */
  const savedTheme = store.get('megha_tema', null);
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;

  /* ---------- cabeçalho / rodapé ---------- */
  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const links = [
    ['index.html', 'Início'], ['servicos.html', 'Serviços'], ['orcamento.html', 'Orçamento'],
    ['sobre.html', 'Sobre'], ['contato.html', 'Contato']
  ];
  const nPedidos = (store.get(M.storageKey, []) || []).length;
  const header = $('#site-header');
  if (header) {
    header.className = 'site-header';
    header.innerHTML = `
      <div class="wrap nav">
        <a class="brand" href="index.html" aria-label="Megha Portões — início">
          <span class="brand-saw">${ic('saw')}</span>
          <span class="brand-txt"><b>MEGHA</b><em>PORTÕES</em></span>
        </a>
        <nav class="menu" id="menu" aria-label="Principal">
          ${links.map(([h, t]) => `<a href="${h}" class="${here === h ? 'on' : ''}">${t}</a>`).join('')}
          <a href="minha-area.html" class="area-link ${here === 'minha-area.html' ? 'on' : ''}"><span class="av">${ic('user')}</span> Minha área${nPedidos ? `<span class="badge">${nPedidos}</span>` : ''}</a>
        </nav>
        <div class="nav-actions">
          <button class="icon-btn" id="themeBtn" aria-label="Alternar tema claro/escuro">${ic('sun', 'only-dark')}${ic('moon', 'only-light')}</button>
          <button class="icon-btn burger" id="burger" aria-label="Abrir menu" aria-expanded="false">${ic('menu')}</button>
        </div>
      </div>
      <div class="progress" id="progress"></div>`;
    $('#burger').addEventListener('click', e => {
      const open = $('#menu').classList.toggle('open');
      e.currentTarget.setAttribute('aria-expanded', open);
    });
    $('#themeBtn').addEventListener('click', () => {
      const cur = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
      document.documentElement.dataset.theme = cur; store.set('megha_tema', cur);
    });
    const prog = $('#progress');
    const onScroll = () => {
      const h = document.documentElement;
      prog.style.transform = `scaleX(${(h.scrollTop / ((h.scrollHeight - h.clientHeight) || 1)).toFixed(4)})`;
      header.classList.toggle('scrolled', h.scrollTop > 20);
    };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  const footer = $('#site-footer');
  if (footer) {
    footer.className = 'site-footer';
    footer.innerHTML = `
      <div class="wrap foot-grid">
        <div>
          <a class="brand" href="index.html"><span class="brand-saw">${ic('saw')}</span><span class="brand-txt"><b>MEGHA</b><em>PORTÕES</em></span></a>
          <p class="muted">${M.slogan}.</p>
          <div class="socials">
            <a class="chip-btn" href="${M.instagram}" target="_blank" rel="noopener">${ic('instagram')} Instagram</a>
            <a class="chip-btn wa" href="${wa('Olá! Vim pelo site da Megha Portões.')}" target="_blank" rel="noopener">${ic('whatsapp')} WhatsApp</a>
          </div>
        </div>
        <div>
          <h4>Navegue</h4>
          ${links.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}
          <a href="minha-area.html">Minha área</a>
        </div>
        <div>
          <h4>Serviços</h4>
          <a href="servicos.html#portoes">Portões</a><a href="servicos.html#esquadrias">Esquadrias em alumínio</a>
          <a href="servicos.html#temperado">Vidro temperado</a><a href="servicos.html#acm">ACM</a>
          <a href="servicos.html#ripado">Ripado</a><a href="servicos.html#gabinetes">Gabinetes</a>
          <a href="servicos.html#guardacorpo">Guarda-corpo e corrimãos</a>
        </div>
        <div>
          <h4>Fale com a gente</h4>
          ${M.telefones.map(t => `<a href="tel:+${t.num}">${ic('phone')} ${t.label}</a>`).join('')}
          <span class="addr">${ic('pin')} ${M.endereco}</span>
        </div>
      </div>
      <div class="wrap foot-bottom"><span>© ${new Date().getFullYear()} Megha Portões · ${M.dono}</span><span>Camaçari · Bahia</span></div>`;
  }

  /* botão flutuante do WhatsApp + toast */
  const fab = document.createElement('a');
  fab.className = 'wa-fab'; fab.target = '_blank'; fab.rel = 'noopener';
  fab.href = wa('Olá! Vim pelo site da Megha Portões e gostaria de um orçamento.');
  fab.setAttribute('aria-label', 'Chamar no WhatsApp');
  fab.innerHTML = ic('whatsapp') + '<span>Orçamento rápido</span>';
  document.body.appendChild(fab);
  const toastEl = document.createElement('div');
  toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl);
  let tt;
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove('show'), 2800); }

  /* brilho que segue o cursor */
  if (!reduce && matchMedia('(pointer:fine)').matches) {
    const g = document.createElement('div'); g.className = 'cursor-glow'; document.body.appendChild(g);
    addEventListener('pointermove', e => { g.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; }, { passive: true });
  }

  /* reduz foto para caber no armazenamento do navegador */
  function loadImg(file) {
    return new Promise(res => {
      const r = new FileReader();
      r.onload = () => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = r.result; };
      r.onerror = () => res(null); r.readAsDataURL(file);
    });
  }
  async function shrink(file, max = 900, q = .72) {
    const im = await loadImg(file); if (!im) return null;
    const k = Math.min(1, max / Math.max(im.width, im.height)), c = document.createElement('canvas');
    c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
    c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); return c.toDataURL('image/jpeg', q);
  }
  async function square(file, size = 240, q = .8) {
    const im = await loadImg(file); if (!im) return null;
    const s = Math.min(im.width, im.height), c = document.createElement('canvas'); c.width = c.height = size;
    c.getContext('2d').drawImage(im, (im.width - s) / 2, (im.height - s) / 2, s, s, 0, 0, size, size); return c.toDataURL('image/jpeg', q);
  }
  function refreshAvatar() {
    const av = document.querySelector('.area-link .av'); if (!av) return;
    const p = store.get(M.perfilKey, {}) || {};
    av.innerHTML = p.foto ? `<img src="${p.foto}" alt="Foto de perfil">` : ic('user');
    av.classList.toggle('has', !!p.foto);
  }
  window.MeghaUI = { $, $$, ic, icons, brl, wa, store, toast, reduce, shrink, square, refreshAvatar };
  refreshAvatar();

  /* ---------- revelar ao rolar ---------- */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12, rootMargin: '0px 0px -40px 0px' }) : null;
  $$('.reveal').forEach(el => io ? io.observe(el) : el.classList.add('in'));

  /* ---------- contadores ---------- */
  const co = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; co.unobserve(e.target);
    const el = e.target, to = +el.dataset.count, suf = el.dataset.suffix || '', t0 = performance.now(), d = 1400;
    const step = t => { const p = Math.min(1, (t - t0) / d); el.textContent = (el.dataset.prefix || '') + Math.round(to * (1 - Math.pow(1 - p, 3))).toLocaleString('pt-BR') + suf; if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: .5 }) : null;
  $$('[data-count]').forEach(el => co ? co.observe(el) : el.textContent = (el.dataset.prefix || '') + Number(el.dataset.count).toLocaleString('pt-BR') + (el.dataset.suffix || ''));

  /* ---------- tilt 3D ---------- */
  if (!reduce) {
    $$('[data-tilt]').forEach(el => {
      const max = +el.dataset.tilt || 10;
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `perspective(900px) rotateY(${x * max}deg) rotateX(${-y * max}deg) translateZ(6px)`;
        el.style.setProperty('--mx', (x + .5) * 100 + '%'); el.style.setProperty('--my', (y + .5) * 100 + '%');
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
    /* parallax do hero com o mouse */
    const hp = $('[data-parallax]');
    if (hp) hp.addEventListener('pointermove', e => {
      const r = hp.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      $$('[data-depth]', hp).forEach(l => { const d = +l.dataset.depth; l.style.transform = `translate3d(${x * d * -30}px,${y * d * -30}px,0)`; });
    });
  }

  /* ---------- faíscas (canvas) ---------- */
  const cv = $('#sparks');
  if (cv && !reduce) {
    const c = cv.getContext('2d'); let W, H, P = [];
    const size = () => { W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight; };
    size(); addEventListener('resize', size);
    const mk = () => ({ x: Math.random() * W, y: H + 10, r: Math.random() * 2 + .6, v: Math.random() * .7 + .25, a: Math.random() * .6 + .2, w: Math.random() * Math.PI * 2 });
    for (let i = 0; i < 50; i++) { const p = mk(); p.y = Math.random() * H; P.push(p); }
    (function loop() {
      c.clearRect(0, 0, W, H);
      P.forEach((p, i) => {
        p.y -= p.v; p.w += .02; p.x += Math.sin(p.w) * .35;
        if (p.y < -10) P[i] = mk();
        c.beginPath(); c.fillStyle = `rgba(255,210,31,${p.a})`; c.shadowColor = '#ffc400'; c.shadowBlur = 8;
        c.arc(p.x, p.y, p.r, 0, 6.283); c.fill();
      });
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- confete ---------- */
  window.MeghaUI.confetti = function () {
    if (reduce) return;
    const cvs = document.createElement('canvas'); cvs.className = 'confetti'; document.body.appendChild(cvs);
    const c = cvs.getContext('2d'); cvs.width = innerWidth; cvs.height = innerHeight;
    const cols = ['#ffc400', '#ffd21f', '#2563eb', '#ffffff', '#60a5fa'];
    const ps = Array.from({ length: 150 }, () => ({ x: innerWidth / 2, y: innerHeight * .45, vx: (Math.random() - .5) * 16, vy: -Math.random() * 15 - 4, s: Math.random() * 8 + 4, r: Math.random() * 6, vr: (Math.random() - .5) * .4, c: cols[(Math.random() * cols.length) | 0] }));
    let f = 0;
    (function loop() {
      c.clearRect(0, 0, cvs.width, cvs.height);
      ps.forEach(p => { p.vy += .35; p.x += p.vx; p.y += p.vy; p.r += p.vr; c.save(); c.translate(p.x, p.y); c.rotate(p.r); c.fillStyle = p.c; c.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); c.restore(); });
      if (++f < 220) requestAnimationFrame(loop); else cvs.remove();
    })();
  };

  /* ---------- demo do portão (home) ---------- */
  const demo = $('#gateDemo');
  if (demo && window.Pieces) {
    const state = { key: 'portao', tipo: 'correr', material: 'aluminio', cor: '#1a1c21', w: 3.5, h: 2.2 };
    const ctrl = Pieces.stage($('#gateDemoStage'), state, { ranges: { w: 6, h: 3 } });
    const mats = M.servicos.portao.materiais;
    const colorsFor = m => m === 'ripado' ? M.cores.madeira : m === 'vidro' ? M.cores.vidro : M.cores.metal;
    const swWrap = $('#demoColors');
    const drawColors = () => {
      swWrap.innerHTML = colorsFor(state.material).slice(0, 7).map(([n, h]) => `<button class="swatch ${h === state.cor ? 'on' : ''}" style="--sw:${h}" title="${n}" data-c="${h}" aria-label="${n}"></button>`).join('');
    };
    $('#demoTipo').innerHTML = M.servicos.portao.tipos.map(([k, n], i) => `<button class="seg ${i ? '' : 'on'}" data-v="${k}">${n}</button>`).join('');
    $('#demoMat').innerHTML = mats.map((k, i) => `<button class="seg ${i ? '' : 'on'}" data-v="${k}">${M.materiais[k].nome}</button>`).join('');
    drawColors();
    $('#demoTipo').addEventListener('click', e => { const b = e.target.closest('.seg'); if (!b) return; $$('.seg', b.parentNode).forEach(x => x.classList.toggle('on', x === b)); state.tipo = b.dataset.v; ctrl.set({ tipo: b.dataset.v, open: false }); });
    $('#demoMat').addEventListener('click', e => {
      const b = e.target.closest('.seg'); if (!b) return; $$('.seg', b.parentNode).forEach(x => x.classList.toggle('on', x === b));
      state.material = b.dataset.v; state.cor = colorsFor(b.dataset.v)[0][1]; drawColors(); ctrl.set({ material: state.material, cor: state.cor });
    });
    swWrap.addEventListener('click', e => { const b = e.target.closest('.swatch'); if (!b) return; state.cor = b.dataset.c; drawColors(); ctrl.set({ cor: state.cor }); });
    $('#demoW').addEventListener('input', e => { state.w = +e.target.value; $('#demoWv').textContent = state.w.toFixed(1).replace('.', ',') + ' m'; ctrl.set({ w: state.w }); });
    $('#demoH').addEventListener('input', e => { state.h = +e.target.value; $('#demoHv').textContent = state.h.toFixed(1).replace('.', ',') + ' m'; ctrl.set({ h: state.h }); });
    $('#demoOpen').addEventListener('click', () => ctrl.toggle());
  }

  /* ---------- ferramentas (home) ---------- */
  $$('.tool').forEach(t => {
    t.addEventListener('click', () => {
      t.classList.toggle('on');
      if (t.dataset.tool === 'level') t.style.setProperty('--bx', (Math.random() * 70 - 35).toFixed(0) + '%');
      if (t.dataset.tool === 'saw' && t.classList.contains('on')) toast('Zzzzzziiiin! 🔥 Corte de precisão.');
      if (t.dataset.tool === 'tape' && t.classList.contains('on')) toast('Medir duas vezes, cortar uma. 📏');
      if (t.dataset.tool === 'drill' && t.classList.contains('on')) toast('Brrrrrrrr! Furo certeiro. 🔩');
    });
  });

  /* ---------- peças da página de serviços ---------- */
  $$('[data-piece-mini]').forEach(h => {
    const cfg = JSON.parse(h.dataset.pieceMini);
    const mFn = (el, key) => Math.max(14, Math.min(el.clientWidth / (cfg.w + 1.8), (el.clientHeight - 56) / (cfg.h + (Pieces.LIFT[key] || 0) + (key === 'corrimao' ? 2.3 : 0) + .3)));
    const ctrl = Pieces.stage(h, Object.assign({ cor: '#1a1c21', open: false }, cfg), { ranges: { w: cfg.w, h: cfg.h }, fixedHeight: true, mFn });
    h.style.setProperty('--g', '26px');
    h.querySelector('.person').style.display = 'none'; h.querySelector('.person-tag').style.display = 'none';
    const card = h.closest('.svc-card');
    if (card) card.querySelectorAll('[data-variant]').forEach(b => b.addEventListener('click', () => {
      const v = JSON.parse(b.dataset.variant);
      card.querySelectorAll('[data-variant]').forEach(x => x.classList.toggle('on', x === b));
      ctrl.set(Object.assign({ open: false }, v));
    }));
  });

  /* ---------- galeria: filtro + lightbox + vídeo ---------- */
  const chips = $$('.filter [data-f]');
  chips.forEach(c => c.addEventListener('click', () => {
    chips.forEach(x => x.classList.toggle('on', x === c));
    $$('.g-item').forEach(i => { i.hidden = c.dataset.f !== 'all' && !i.dataset.cat.split(' ').includes(c.dataset.f); });
  }));
  const lb = $('#lightbox');
  if (lb) {
    $$('.g-item[data-full]').forEach(i => i.addEventListener('click', () => {
      lb.querySelector('img').src = i.dataset.full; lb.querySelector('p').textContent = i.dataset.title || ''; lb.classList.add('open');
    }));
    lb.addEventListener('click', () => lb.classList.remove('open'));
    addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('open'); });
  }
  $$('.video-card').forEach(v => {
    const vid = $('video', v), btn = $('.play', v);
    if (!vid || !btn) return;
    btn.addEventListener('click', () => { vid.controls = true; vid.play(); v.classList.add('playing'); });
    vid.addEventListener('pause', () => v.classList.remove('playing'));
    vid.addEventListener('play', () => v.classList.add('playing'));
  });

  /* ---------- lâminas de serra (SVG gerado) ---------- */
  $$('[data-saw]').forEach(p => {
    const [cx, cy, R, r, n] = p.dataset.saw.split(' ').map(Number), st = Math.PI * 2 / n;
    const pt = (rad, a) => `${(cx + rad * Math.cos(a)).toFixed(2)} ${(cy + rad * Math.sin(a)).toFixed(2)}`;
    let d = `M${pt(r, 0)}`;
    for (let i = 0; i < n; i++) { const a = i * st; d += ` L${pt(R, a + st * .22)} L${pt(r, a + st * .62)} L${pt(r, a + st)}`; }
    p.setAttribute('d', d + 'Z');
  });

  /* ---------- botões magnéticos ---------- */
  if (!reduce) $$('.btn').forEach(b => {
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.setProperty('--bx', (e.clientX - r.left) + 'px'); b.style.setProperty('--by', (e.clientY - r.top) + 'px'); });
  });
})();

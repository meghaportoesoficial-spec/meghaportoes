/* ==========================================================
   PEÇAS INTERATIVAS (portão, esquadria, vidro, ACM, ripado,
   gabinete, guarda-corpo, corrimão). Usadas na página de
   serviços e no orçamento. Estilos em css/pieces.css
   ========================================================== */
(function () {
  const fmt = n => Number(n).toFixed(2).replace('.', ',');
  const LIFT = { portao: 0, esquadria: .9, temperado: 0, acm: .5, ripado: .35, gabinete: 0, guardacorpo: 0, corrimao: 0 };
  const EXTRA = { corrimao: 2.3 };           // altura extra necessária no palco
  const NEEDS_WALL = { portao: true };

  const slatsCount = w => Math.max(8, Math.min(44, Math.round(w * 9)));
  const postCount = w => Math.max(2, Math.min(11, Math.round(w) + 1));
  const acmGrid = (w, h) => [Math.max(2, Math.min(10, Math.round(w / 1.1))), Math.max(2, Math.min(5, Math.round(h / 1.1)))];

  function corrimaoSvg(w, h) {
    const rise = Math.min(w * 0.36, 2.2), H = h + rise, n = Math.max(3, Math.round(w * 2.4));
    let pts = `0,${H}`;
    for (let i = 0; i < n; i++) {
      const y1 = H - rise * (i + 1) / n, x0 = w * i / n, x1 = w * (i + 1) / n;
      pts += ` ${x0},${y1} ${x1},${y1}`;
    }
    pts += ` ${w},${H}`;
    const yS = x => H - rise * x / w;
    let posts = '';
    const np = Math.max(2, Math.round(w * 0.9) + 1);
    for (let i = 0; i < np; i++) {
      const x = w * i / (np - 1), xx = Math.min(w - .03, Math.max(.03, x));
      posts += `<line x1="${xx}" y1="${yS(xx)}" x2="${xx}" y2="${yS(xx) - h}"/>`;
    }
    return `<svg viewBox="0 0 ${w} ${H}" preserveAspectRatio="none" class="cs">
      <polygon class="steps" points="${pts}"/>
      <g class="posts" style="stroke-width:.045">${posts}</g>
      <line class="rail" x1="0" y1="${yS(0) - h}" x2="${w}" y2="${yS(w) - h}" style="stroke-width:.075"/>
      <line class="rail2" x1="0" y1="${yS(0) - h * .45}" x2="${w}" y2="${yS(w) - h * .45}" style="stroke-width:.03"/>
      <line class="glint" x1="0" y1="${yS(0) - h}" x2="${w}" y2="${yS(w) - h}" style="stroke-width:.075"/>
    </svg>`;
  }

  function inner(s) {
    const k = s.key, t = s.tipo;
    switch (k) {
      case 'portao':
        return `<div class="leaf"><i class="shine"></i><i class="clamp c1"></i><i class="clamp c2"></i></div>`;
      case 'esquadria':
        return t === 'correr' ? `<div class="pane a"></div><div class="pane b"></div>` : `<div class="pane a"></div>`;
      case 'temperado':
        return t === 'porta' ? `<div class="leaf"><b class="handle"></b><i class="shine"></i></div>`
          : t === 'box' ? `<div class="fixedp"><i class="shine"></i></div><div class="leaf"><b class="handle"></b></div>`
            : `<div class="fixedp"><i class="shine"></i></div><div class="leaf slide"><i class="shine"></i></div>`;
      case 'acm': {
        const [c, r] = acmGrid(s.w, s.h);
        let tiles = '';
        for (let y = 0; y < r; y++) for (let x = 0; x < c; x++) tiles += `<i class="tile" style="--i:${x + y}"></i>`;
        return `<div class="grid" style="--cols:${c};--rows:${r}">${tiles}</div>`;
      }
      case 'ripado': {
        let sl = '';
        const n = slatsCount(s.w);
        for (let i = 0; i < n; i++) sl += `<i class="slat" style="--i:${i}"></i>`;
        return `<div class="slats">${sl}</div><i class="led"></i>`;
      }
      case 'gabinete':
        return `<div class="top"></div><div class="body"><div class="door l"></div><div class="door r"></div><div class="drawers"><i></i><i></i><i></i></div></div><div class="base"></div>`;
      case 'guardacorpo': {
        const n = postCount(s.w);
        let o = '';
        for (let i = 0; i < n; i++) { o += `<i class="post"></i>`; if (i < n - 1) o += `<i class="span"><i class="shine"></i></i>`; }
        return `<div class="row">${o}</div><i class="hand"></i>`;
      }
      case 'corrimao':
        return corrimaoSvg(s.w, s.h);
    }
    return '';
  }

  function mount(host, state) {
    const s = Object.assign({ key: 'portao', tipo: 'correr', material: 'aluminio', cor: '#1a1c21', w: 3.5, h: 2.2, open: false }, state);
    host.innerHTML = '<div class="piece" tabindex="0" role="button" aria-label="Toque para abrir ou animar a peça"></div>';
    const el = host.firstChild;
    let sig = '';
    function set(ns) {
      Object.assign(s, ns);
      const k = s.key;
      const rise = k === 'corrimao' ? Math.min(s.w * 0.36, 2.2) : 0;
      el.style.setProperty('--w', s.w);
      el.style.setProperty('--h', s.h + rise);
      el.style.setProperty('--ph', s.h);
      el.style.setProperty('--c', s.cor);
      el.style.setProperty('--lift', LIFT[k] || 0);
      const extra = k === 'ripado' ? slatsCount(s.w) : k === 'guardacorpo' ? postCount(s.w) : k === 'acm' ? acmGrid(s.w, s.h).join('x') : k === 'corrimao' ? s.w.toFixed(1) + s.h.toFixed(2) : '';
      const sg = [k, s.tipo, s.material, extra].join('|');
      if (sg !== sig) {
        const first = sig === '';
        sig = sg;
        el.className = `piece ${k} t-${s.tipo} m-${s.material}${s.open ? ' open' : ''}`;
        el.innerHTML = inner(s) + `<span class="dim dw">${fmt(s.w)} m</span><span class="dim dh">${fmt(s.h)} m</span>`;
        if (!first) { el.classList.add('swap'); setTimeout(() => el.classList.remove('swap'), 650); }
      }
      el.classList.toggle('open', !!s.open);
      const dw = el.querySelector('.dw'), dh = el.querySelector('.dh');
      if (dw) dw.textContent = fmt(s.w) + ' m';
      if (dh) dh.textContent = fmt(s.h) + ' m';
    }
    function toggle(force) {
      s.open = typeof force === 'boolean' ? force : !s.open;
      el.classList.toggle('open', s.open);
      host.dispatchEvent(new CustomEvent('piece-toggle', { detail: s.open }));
    }
    el.addEventListener('click', () => toggle());
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
    set({});
    return { el, set, toggle, state: s };
  }

  /* palco completo: fundo + chão + paredes (portão) + pessoa de referência */
  function stage(host, state, opts = {}) {
    host.classList.add('stage');
    host.dataset.svc = state.key;
    host.innerHTML = `
      <div class="stage-bg"></div><div class="stage-glow"></div>
      <div class="stage-row">
        ${NEEDS_WALL[state.key] ? '<div class="wall wl"><i class="cap"></i></div>' : ''}
        <div class="piece-host"></div>
        ${NEEDS_WALL[state.key] ? '<div class="wall wr"><i class="cap"></i></div>' : ''}
      </div>
      <div class="ground"></div>
      <svg class="person" viewBox="0 0 40 120" aria-hidden="true"><circle cx="20" cy="12" r="9"/><path d="M8 28h24l4 40h-8l-2 50h-8V80h-4v38h-8L12 68H4z"/></svg>
      <span class="person-tag">1,75 m</span>
      <span class="hint">👆 toque na peça</span>`;
    const ph = host.querySelector('.piece-host');
    const ctrl = mount(ph, state);
    ph.addEventListener('piece-toggle', () => host.classList.add('touched'));
    const fit = () => {
      const W = host.clientWidth || 500;
      const key = ctrl.state.key;
      const ranges = opts.ranges || { w: 6, h: 3 };
      const need = ranges.h + (LIFT[key] || 0) + (EXTRA[key] || 0) + .9;
      const cap = opts.maxH ? opts.maxH() : 0;
      let m = Math.max(14, W / (ranges.w + 2.6));
      if (cap) m = Math.max(12, Math.min(m, (cap - 46) / need));
      if (opts.mFn) m = opts.mFn(host, key);
      host.style.setProperty('--m', m + 'px');
      if (!opts.fixedHeight) host.style.height = (cap ? Math.min(cap, need * m + 46) : Math.max(210, need * m + 6)) + 'px';
    };
    fit();
    if (window.ResizeObserver) new ResizeObserver(fit).observe(host);
    ctrl.refit = (r) => { if (r) opts.ranges = r; host.dataset.svc = ctrl.state.key; host.querySelectorAll('.wall').forEach(w => w.style.display = NEEDS_WALL[ctrl.state.key] ? '' : 'none'); fit(); };
    return ctrl;
  }

  window.Pieces = { mount, stage, LIFT, NEEDS_WALL, fmt };
})();

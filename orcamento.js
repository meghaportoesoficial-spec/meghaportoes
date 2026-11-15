/* ==========================================================
   ORÇAMENTO — passo a passo animado
   ========================================================== */
(function () {
  const M = window.MEGHA, UI = window.MeghaUI;
  const { $, $$, ic, brl, wa, store, toast } = UI;
  const SV = M.servicos;
  const TIPO_MULT = { pivotante: 1.1, basculante: 1.15, box: .9, divisoria: .85, forro: 1.1, cobertura: 1.15, rampa: 1.05, cabos: 1.1, tubular: .9 };
  const STEPS = ['Serviço', 'Modelo', 'Medidas e cor', 'Extras', 'Seus dados', 'Revisar'];
  const fmt = n => Number(n).toFixed(2).replace('.', ',');
  const colorsFor = m => m === 'ripado' ? M.cores.madeira : m === 'vidro' ? M.cores.vidro : m === 'mdf' ? M.cores.mdf : M.cores.metal;
  const corNome = (m, hex) => ((colorsFor(m).find(c => c[1] === hex) || [])[0]) || 'Personalizada';
  const perfil = store.get(M.perfilKey, {}) || {};

  const s = { servico: 'portao', tipo: '', material: '', cor: '', w: 0, h: 0, qtd: 1, instalacao: true, extras: [], fotos: [], step: 0, max: 0,
    cliente: { nome: perfil.nome || '', whats: perfil.whats || '', email: perfil.email || '', cidade: perfil.cidade || '', endereco: perfil.endereco || '', loc: '', obs: '', data: '' } };

  let ctrl = null;
  const host = $('#quoteStage');

  /* ---------- preço ---------- */
  function calc() {
    const sv = SV[s.servico], mat = M.materiais[s.material];
    const unit = sv.unid === 'm' ? s.w : s.w * s.h;
    let base;
    if (sv.porMetro) base = s.w * sv.porMetro * (mat.preco / M.materiais[sv.materiais[0]].preco);
    else base = s.w * s.h * mat.preco;
    base *= TIPO_MULT[s.tipo] || 1;
    const extras = sv.extras.filter(e => s.extras.includes(e[0])).reduce((a, e) => a + e[2], 0);
    const inst = s.instalacao ? sv.instalacao[0] + sv.instalacao[1] * unit : 0;
    const total = (base + extras + inst) * s.qtd;
    return { unit, base: base * s.qtd, extras: extras * s.qtd, inst: inst * s.qtd, total };
  }

  /* ---------- estado → preview ---------- */
  function applyService(key, keepStep) {
    const sv = SV[key];
    s.servico = key; s.tipo = sv.tipos[0][0]; s.material = sv.materiais[0]; s.cor = colorsFor(s.material)[0][1];
    s.w = sv.w[2]; s.h = sv.h[2]; s.extras = []; s.qtd = 1;
    mountStage();
    update();
  }
  function mountStage() {
    const sv = SV[s.servico], el = document.createElement('div');
    host.replaceChildren(el);
    ctrl = Pieces.stage(el, { key: s.servico, tipo: s.tipo, material: s.material, cor: s.cor, w: s.w, h: s.h }, { ranges: { w: sv.w[1], h: sv.h[1] }, maxH: () => innerWidth <= 960 ? 230 : 0 });
  }
  function update(opts) {
    ctrl.set({ tipo: s.tipo, material: s.material, cor: s.cor, w: s.w, h: s.h });
    const sv = SV[s.servico], t = calc();
    const tipoN = (sv.tipos.find(x => x[0] === s.tipo) || [])[1];
    $('#chips').innerHTML = [
      `<span class="pill"><b>${sv.nome}</b></span>`, `<span class="pill">${tipoN}</span>`, `<span class="pill">${M.materiais[s.material].nome}</span>`,
      `<span class="pill"><span class="dot" style="background:${s.cor}"></span>${corNome(s.material, s.cor)}</span>`,
      `<span class="pill">${fmt(s.w)} × ${fmt(s.h)} m${s.qtd > 1 ? ' · ' + s.qtd + ' un.' : ''}</span>`,
      `<span class="pill">${s.instalacao ? '🔧 Com instalação' : 'Sem instalação'}</span>`].join('');
    const p = $('#price'), old = p.textContent, nw = brl(t.total);
    if (old !== nw) { p.textContent = nw; const c = $('#priceCard'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); }
  }

  /* ---------- stepper ---------- */
  function drawStepper() {
    $('#stepper').innerHTML = STEPS.map((n, i) => `<button type="button" role="tab" class="${i === s.step ? 'on' : i < s.step ? 'done' : ''}" data-i="${i}" ${i > s.max ? 'disabled style="opacity:.5;cursor:not-allowed"' : ''}><i>${i < s.step ? '✓' : i + 1}</i>${n}</button>`).join('');
  }
  $('#stepper').addEventListener('click', e => { const b = e.target.closest('button'); if (b && +b.dataset.i <= s.max) go(+b.dataset.i, true); });

  const nav = (back, nextLabel = 'Continuar', nextId = 'next') => `<div class="nav-btns">${back ? `<button class="btn ghost" type="button" id="back">← Voltar</button>` : '<span></span>'}<button class="btn" type="button" id="${nextId}"><span>${nextLabel}</span>${ic('arrow')}</button></div>`;

  /* ---------- painéis ---------- */
  const panels = [
    // 0 — serviço
    () => `<h3>O que você quer orçar?</h3><p class="muted">Toque em um serviço — a peça ao lado muda na hora.</p>
      <div class="choices">${Object.entries(SV).map(([k, v]) => `<button type="button" class="choice ${k === s.servico ? 'on' : ''}" data-k="${k}">${ic(v.icone)}${v.nome}</button>`).join('')}</div>${nav(false)}`,
    // 1 — modelo + material
    () => { const sv = SV[s.servico]; return `<h3>Modelo e material</h3>
      <div class="lbl" style="margin-top:14px">Modelo</div>
      <div class="choices" id="tipos">${sv.tipos.map(([k, n]) => `<button type="button" class="choice ${k === s.tipo ? 'on' : ''}" data-k="${k}">${ic(sv.icone)}${n}</button>`).join('')}</div>
      <div class="lbl" style="margin-top:20px">Material</div>
      <div class="choices" id="mats">${sv.materiais.map(k => `<button type="button" class="choice ${k === s.material ? 'on' : ''}" data-k="${k}">${ic('box')}${M.materiais[k].nome}<small>${M.materiais[k].desc}</small></button>`).join('')}</div>${nav(true)}`; },
    // 2 — medidas + cor
    () => { const sv = SV[s.servico]; return `<h3>Medidas e cor</h3><p class="muted">Arraste e veja a peça crescer ou encolher.</p>
      <div class="ctrl-group"><div class="range-row"><label style="margin:0">${sv.unid === 'm' ? 'Comprimento' : 'Largura'}</label><b id="wv">${fmt(s.w)} m</b></div><input id="w" type="range" min="${sv.w[0]}" max="${sv.w[1]}" step=".05" value="${s.w}" aria-label="Largura"></div>
      ${sv.unid === 'm' && s.servico === 'gabinete' ? '' : ''}
      <div class="ctrl-group"><div class="range-row"><label style="margin:0">Altura</label><b id="hv">${fmt(s.h)} m</b></div><input id="h" type="range" min="${sv.h[0]}" max="${sv.h[1]}" step=".05" value="${s.h}" aria-label="Altura"></div>
      <div class="ctrl-group"><label>Quantidade</label><div class="segs"><button class="seg" type="button" id="qm" aria-label="Diminuir">−</button><span class="seg on" id="qv" style="min-width:56px;text-align:center">${s.qtd}</span><button class="seg" type="button" id="qp" aria-label="Aumentar">+</button></div></div>
      <div class="ctrl-group"><label>Cor — <span id="cn" style="color:var(--yellow-ink)">${corNome(s.material, s.cor)}</span></label><div class="swatches" id="sw">${colorsFor(s.material).map(([n, h]) => `<button type="button" class="swatch ${h === s.cor ? 'on' : ''}" style="--sw:${h}" data-c="${h}" title="${n}" aria-label="${n}"></button>`).join('')}</div></div>${nav(true)}`; },
    // 3 — extras + instalação
    () => { const sv = SV[s.servico], i = sv.instalacao; return `<h3>Extras e instalação</h3>
      <label class="toggle-row install-big"><span><b>🔧 Quero instalação pela Megha</b><small>Nossa equipe leva, instala e deixa tudo funcionando. Estimativa: ${brl(i[0] + i[1] * calc().unit)}</small></span><span class="switch"><input type="checkbox" id="inst" ${s.instalacao ? 'checked' : ''}><i></i></span></label>
      <div class="lbl" style="margin:20px 0 10px">Adicionais</div>
      ${sv.extras.map(e => `<label class="toggle-row"><span><b>${e[1]}</b><small>+ ${brl(e[2])}</small></span><span class="switch"><input type="checkbox" data-x="${e[0]}" ${s.extras.includes(e[0]) ? 'checked' : ''}><i></i></span></label>`).join('')}${nav(true)}`; },
    // 4 — dados
    () => { const c = s.cliente; return `<h3>Seus dados</h3><p class="muted">Quase lá! Preencha para o Carlito retornar o orçamento.</p>
      <form id="dados" novalidate>
        <div class="row2"><div class="field"><label for="f-nome">Nome completo</label><input id="f-nome" autocomplete="name" value="${esc(c.nome)}" placeholder="Seu nome"><span class="err"></span></div>
        <div class="field"><label for="f-whats">WhatsApp</label><input id="f-whats" inputmode="tel" autocomplete="tel" value="${esc(c.whats)}" placeholder="(71) 9 0000-0000"><span class="err"></span></div></div>
        <div class="field"><label for="f-email">E-mail / Gmail (opcional)</label><input id="f-email" type="email" autocomplete="email" value="${esc(c.email)}" placeholder="voce@gmail.com"><span class="err"></span></div>
        <div class="row2"><div class="field"><label for="f-cidade">Cidade / Bairro</label><input id="f-cidade" value="${esc(c.cidade)}" placeholder="Ex.: Camaçari — Monte Negro"><span class="err"></span></div>
        <div class="field"><label for="f-data">Data desejada (opcional)</label><input id="f-data" type="date" value="${esc(c.data)}"></div></div>
        <div class="field"><label for="f-end">Endereço da obra</label><input id="f-end" autocomplete="street-address" value="${esc(c.endereco)}" placeholder="Rua, número, referência"></div>
        <div class="field"><button class="chip-btn" type="button" id="geo">${ic('pin')} Usar minha localização atual</button><span class="muted" id="geoTxt" style="font-size:.85rem">${c.loc ? '📍 Localização anexada.' : ''}</span></div>
        <div class="field"><label for="f-obs">Observações</label><textarea id="f-obs" rows="3" placeholder="Algo que devemos saber? (medidas exatas, prazo, referências…)">${esc(c.obs)}</textarea></div>
        <div class="field"><label>Foto de referência (opcional)</label>
          <div class="upload"><input type="file" id="f-foto" accept="image/*" multiple hidden><button class="chip-btn" type="button" id="addFoto">${ic('plus')} Adicionar foto</button><span class="muted" style="font-size:.85rem">Até 3 fotos: o local, a medida ou um modelo que você gostou.</span></div>
          <div class="thumbs" id="thumbs"></div></div>
      </form>${nav(true, 'Revisar pedido')}`; },
    // 5 — revisar
    () => { const sv = SV[s.servico], t = calc(), c = s.cliente, tipoN = sv.tipos.find(x => x[0] === s.tipo)[1];
      const ex = sv.extras.filter(e => s.extras.includes(e[0])).map(e => e[1]).join(', ') || '—';
      return `<h3>Confira e finalize</h3>
      <div class="summary">
        <div><span>Serviço</span><b>${sv.nome} — ${tipoN}</b></div>
        <div><span>Material</span><b>${M.materiais[s.material].nome}</b></div>
        <div><span>Cor</span><b><span class="dot" style="background:${s.cor}"></span>${corNome(s.material, s.cor)}</b></div>
        <div><span>Medidas</span><b>${fmt(s.w)} × ${fmt(s.h)} m · ${s.qtd} un.</b></div>
        <div><span>Extras</span><b>${ex}</b></div>
        <div><span>Instalação</span><b>${s.instalacao ? 'Sim, pela Megha' : 'Não'}</b></div>
        <div><span>Cliente</span><b>${esc(c.nome)}<br>${esc(c.whats)}${c.email ? '<br>' + esc(c.email) : ''}</b></div>
        <div><span>Local</span><b>${esc(c.cidade)}${c.endereco ? '<br>' + esc(c.endereco) : ''}</b></div>
        ${s.fotos.length ? `<div><span>Fotos</span><b>${s.fotos.length} foto(s) de referência</b></div>` : ''}
        <div><span>Estimativa</span><b style="color:var(--yellow-ink)">${brl(t.total)}</b></div>
      </div>
      <p class="muted" style="font-size:.88rem">Valor de referência: o preço final depende da medição no local e é confirmado pelo Carlito.</p>${nav(true, 'Finalizar orçamento', 'send')}`; }
  ];
  const esc = v => String(v || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function go(n, scroll) {
    s.step = n; s.max = Math.max(s.max, n);
    drawStepper();
    const box = $('#panels'); box.innerHTML = `<div class="panel on">${panels[n]()}</div>`;
    bind(n);
    if (scroll) $('.quote-main').scrollIntoView({ behavior: UI.reduce ? 'auto' : 'smooth', block: 'start' });
  }

  function bind(n) {
    const P = $('#panels');
    const next = $('#next'), back = $('#back');
    if (back) back.onclick = () => go(n - 1, true);
    if (next) next.onclick = () => { if (n === 4 && !readForm(true)) return; go(n + 1, true); };

    if (n === 0) P.querySelectorAll('.choice').forEach(b => b.onclick = () => {
      applyService(b.dataset.k); P.querySelectorAll('.choice').forEach(x => x.classList.toggle('on', x === b));
      setTimeout(() => go(1, true), 380);
    });
    if (n === 1) {
      $('#tipos').onclick = e => { const b = e.target.closest('.choice'); if (!b) return; s.tipo = b.dataset.k; $$('#tipos .choice').forEach(x => x.classList.toggle('on', x === b)); update(); ctrl.toggle(false); };
      $('#mats').onclick = e => {
        const b = e.target.closest('.choice'); if (!b) return; s.material = b.dataset.k;
        const cs = colorsFor(s.material); if (!cs.some(c => c[1] === s.cor)) s.cor = cs[0][1];
        $$('#mats .choice').forEach(x => x.classList.toggle('on', x === b)); update();
      };
    }
    if (n === 2) {
      $('#w').oninput = e => { s.w = +e.target.value; $('#wv').textContent = fmt(s.w) + ' m'; update(); };
      $('#h').oninput = e => { s.h = +e.target.value; $('#hv').textContent = fmt(s.h) + ' m'; update(); };
      $('#qm').onclick = () => { s.qtd = Math.max(1, s.qtd - 1); $('#qv').textContent = s.qtd; update(); };
      $('#qp').onclick = () => { s.qtd = Math.min(20, s.qtd + 1); $('#qv').textContent = s.qtd; update(); };
      $('#sw').onclick = e => { const b = e.target.closest('.swatch'); if (!b) return; s.cor = b.dataset.c; $$('#sw .swatch').forEach(x => x.classList.toggle('on', x === b)); $('#cn').textContent = corNome(s.material, s.cor); update(); };
    }
    if (n === 3) {
      $('#inst').onchange = e => { s.instalacao = e.target.checked; update(); toast(s.instalacao ? '🔧 Instalação incluída' : 'Sem instalação — retirada/entrega a combinar'); };
      $$('[data-x]').forEach(i => i.onchange = () => { s.extras = $$('[data-x]').filter(x => x.checked).map(x => x.dataset.x); update(); });
    }
    if (n === 4) {
      drawThumbs();
      $('#addFoto').onclick = () => $('#f-foto').click();
      $('#f-foto').onchange = async e => {
        const files = Array.from(e.target.files).slice(0, 3 - s.fotos.length);
        if (!files.length) return toast('Máximo de 3 fotos.');
        toast('Processando foto…');
        for (const f of files) { const d = await UI.shrink(f, 900, .72); if (d) s.fotos.push(d); }
        e.target.value = ''; drawThumbs();
      };
      const w = $('#f-whats'); w.addEventListener('input', () => { w.value = maskPhone(w.value); });
      $('#geo').onclick = () => {
        if (!navigator.geolocation) return toast('Seu navegador não permite localização.');
        $('#geoTxt').textContent = 'Buscando…';
        navigator.geolocation.getCurrentPosition(p => {
          s.cliente.loc = `https://maps.google.com/?q=${p.coords.latitude.toFixed(6)},${p.coords.longitude.toFixed(6)}`;
          $('#geoTxt').textContent = '📍 Localização anexada!'; toast('Localização anexada ao pedido');
        }, () => { $('#geoTxt').textContent = ''; toast('Não foi possível obter a localização.'); }, { timeout: 8000 });
      };
    }
    if (n === 5) $('#send').onclick = submit;
  }

  function drawThumbs() {
    const t = $('#thumbs'); if (!t) return;
    t.innerHTML = s.fotos.map((d, i) => `<div class="th"><img src="${d}" alt="Foto de referência ${i + 1}"><button type="button" data-i="${i}" aria-label="Remover foto">✕</button></div>`).join('');
    t.onclick = e => { const b = e.target.closest('button'); if (b) { s.fotos.splice(+b.dataset.i, 1); drawThumbs(); } };
    const add = $('#addFoto'); if (add) add.disabled = s.fotos.length >= 3;
  }
  const maskPhone = v => { const d = v.replace(/\D/g, '').slice(0, 11); if (d.length > 6) return `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`; if (d.length > 2) return `(${d.slice(0, 2)}) ${d.slice(2)}`; return d; };

  function readForm(validate) {
    const c = s.cliente, g = id => $('#' + id);
    c.nome = g('f-nome').value.trim(); c.whats = g('f-whats').value.trim(); c.email = g('f-email').value.trim();
    c.cidade = g('f-cidade').value.trim(); c.endereco = g('f-end').value.trim(); c.obs = g('f-obs').value.trim(); c.data = g('f-data').value;
    if (!validate) return true;
    let ok = true;
    const bad = (id, msg) => { const el = g(id); el.classList.add('bad'); el.nextElementSibling.textContent = msg; ok = false; setTimeout(() => el.classList.remove('bad'), 600); };
    $$('.err').forEach(e => e.textContent = '');
    if (c.nome.length < 3) bad('f-nome', 'Informe seu nome.');
    if (c.whats.replace(/\D/g, '').length < 10) bad('f-whats', 'Informe um WhatsApp válido com DDD.');
    if (c.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.email)) bad('f-email', 'E-mail inválido.');
    if (c.cidade.length < 2) bad('f-cidade', 'Informe a cidade/bairro.');
    if (!ok) { toast('Confira os campos destacados'); const f = document.querySelector('.bad'); if (f) f.focus(); }
    return ok;
  }

  /* ---------- finalizar ---------- */
  function codigo() {
    const d = new Date(), p = n => String(n).padStart(2, '0'), a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let r = ''; for (let i = 0; i < 4; i++) r += a[Math.floor(Math.random() * a.length)];
    return `MP-${String(d.getFullYear()).slice(2)}${p(d.getMonth() + 1)}${p(d.getDate())}-${r}`;
  }
  function buildMsg(o) {
    const c = o.cliente;
    return [`*Novo orçamento — Megha Portões*`, `Código: ${o.codigo}`, '',
      `*Serviço:* ${o.servicoNome} · ${o.tipoNome}`, `*Material:* ${o.materialNome} · ${o.corNome}`,
      `*Medidas:* ${fmt(o.w)} × ${fmt(o.h)} m (${o.qtd} un.)`, `*Instalação:* ${o.instalacao ? 'Sim' : 'Não'}`,
      `*Extras:* ${o.extras.length ? o.extras.map(e => e.nome).join(', ') : '—'}`, `*Estimativa:* ${brl(o.total)}`, '',
      `*Cliente:* ${c.nome}`, `*WhatsApp:* ${c.whats}`, c.email ? `*E-mail:* ${c.email}` : '', `*Local:* ${c.cidade}${c.endereco ? ' — ' + c.endereco : ''}`,
      c.loc ? `*Mapa:* ${c.loc}` : '', c.data ? `*Data desejada:* ${c.data.split('-').reverse().join('/')}` : '', c.obs ? `*Obs.:* ${c.obs}` : '', o.fotos && o.fotos.length ? `*Fotos de referência:* ${o.fotos.length} (vou enviar aqui na conversa)` : ''].filter((x, i, a) => x !== '' || a[i - 1] !== '').join('\n');
  }
  function submit() {
    const cc = s.cliente; if (!cc.nome || !cc.whats || !cc.cidade) return go(4, true);
    const sv = SV[s.servico], t = calc();
    const o = {
      codigo: codigo(), criadoEm: new Date().toISOString(), servico: s.servico, servicoNome: sv.nome, icone: sv.icone,
      tipo: s.tipo, tipoNome: sv.tipos.find(x => x[0] === s.tipo)[1], material: s.material, materialNome: M.materiais[s.material].nome,
      cor: s.cor, corNome: corNome(s.material, s.cor), w: s.w, h: s.h, qtd: s.qtd, instalacao: s.instalacao,
      extras: sv.extras.filter(e => s.extras.includes(e[0])).map(e => ({ k: e[0], nome: e[1], preco: e[2] })),
      total: Math.round(t.total), cliente: Object.assign({}, s.cliente), fotos: s.fotos.slice(), etapa: 0
    };
    const list = store.get(M.storageKey, []) || [];
    list.unshift(o);
    if (!store.set(M.storageKey, list)) { o.fotos = []; store.set(M.storageKey, list); toast('Pedido salvo, mas as fotos não couberam no armazenamento — envie-as pelo WhatsApp.'); }
    store.set(M.perfilKey, Object.assign({}, store.get(M.perfilKey, {}) || {}, { nome: o.cliente.nome, whats: o.cliente.whats, email: o.cliente.email, cidade: o.cliente.cidade, endereco: o.cliente.endereco }));
    $('#doneCode').textContent = o.codigo;
    $('#doneMsg').textContent = `Obrigado, ${o.cliente.nome.split(' ')[0]}! Seu orçamento de ${o.servicoNome.toLowerCase()} (${brl(o.total)}) foi registrado.`;
    $('#doneWa').href = wa(buildMsg(o));
    const sh = $('#doneShare'); sh.hidden = !(o.fotos && o.fotos.length);
    sh.onclick = async () => {
      try {
        const files = await Promise.all(o.fotos.map(async (d, i) => new File([await (await fetch(d)).blob()], `referencia-${i + 1}.jpg`, { type: 'image/jpeg' })));
        if (navigator.canShare && navigator.canShare({ files })) await navigator.share({ files, text: `Fotos de referência — pedido ${o.codigo}` });
        else toast('Abra a conversa do WhatsApp e anexe as fotos pelo clipe 📎');
      } catch (e) { }
    };
    const m = $('#doneModal'); m.classList.add('open'); UI.confetti(); ctrl.toggle(true);
    const badge = $('.area-link'); if (badge) { let b = badge.querySelector('.badge'); if (!b) { b = document.createElement('span'); b.className = 'badge'; badge.appendChild(b); } b.textContent = list.length; }
  }
  $('#newQuote').onclick = () => { $('#doneModal').classList.remove('open'); s.fotos = []; applyService('portao'); s.max = 0; go(0, true); };
  $('#openBtn').onclick = () => ctrl.toggle();

  /* ---------- início ---------- */
  const q = new URLSearchParams(location.search).get('s');
  const draft = store.get(M.rascunhoKey, null);
  applyService('portao');
  if (draft && SV[draft.servico]) {
    applyService(draft.servico);
    Object.assign(s, { tipo: draft.tipo, material: draft.material, cor: draft.cor, w: draft.w, h: draft.h, qtd: draft.qtd || 1, instalacao: !!draft.instalacao, extras: (draft.extras || []).map(e => e.k), fotos: draft.fotos || [] });
    mountStage(); update(); s.max = 4;
    try { localStorage.removeItem(M.rascunhoKey); } catch (e) { }
    go(3); setTimeout(() => toast('Pedido carregado — ajuste o que quiser e finalize.'), 600);
  } else if (q && SV[q]) {
    applyService(q);
    const sp = new URLSearchParams(location.search), sv = SV[q];
    const t = sp.get('tipo'), mt = sp.get('m'), c = sp.get('c'), w = parseFloat(sp.get('w')), h = parseFloat(sp.get('h'));
    if (t && sv.tipos.some(x => x[0] === t)) s.tipo = t;
    if (mt && sv.materiais.includes(mt)) s.material = mt;
    if (c && /^[0-9a-f]{6}$/i.test(c)) s.cor = '#' + c; else s.cor = colorsFor(s.material)[0][1];
    if (w >= sv.w[0] && w <= sv.w[1]) s.w = w;
    if (h >= sv.h[0] && h <= sv.h[1]) s.h = h;
    update(); s.max = 2; go(sp.get('tipo') ? 2 : 1);
    if (sp.get('tipo')) setTimeout(() => toast('Modelo carregado — ajuste medidas e cor se quiser.'), 700);
  }
  else go(0);
})();

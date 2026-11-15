/* ==========================================================
   MINHA ÁREA — pedidos do cliente (salvos no navegador)
   O andamento pode ser atualizado pelo dono em status.json
   ========================================================== */
(function () {
  const M = window.MEGHA, UI = window.MeghaUI;
  const { $, $$, ic, brl, wa, store, toast } = UI;
  const root = $('#area');
  const fmt = n => Number(n).toFixed(2).replace('.', ',');
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const dt = iso => new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  let orders = store.get(M.storageKey, []) || [];
  let status = {};
  let tab = 'pedidos';

  const save = () => store.set(M.storageKey, orders);
  fetch('status.json?t=' + Date.now()).then(r => r.ok ? r.json() : {}).then(j => { status = j || {}; render(); }).catch(() => { });

  const etapaDe = o => { const st = status[o.codigo]; return st && Number.isInteger(st.etapa) ? st.etapa : (o.etapa || 0); };

  function timeline(e) {
    return `<div class="timeline">${M.etapas.map((n, i) => `<div class="t ${i < e ? 'done' : ''} ${i === e ? 'now done' : ''}"><i>${i <= e ? '✓' : i + 1}</i><span>${n}</span></div>`).join('')}</div>`;
  }

  function msg(o) {
    const c = o.cliente;
    return `*Pedido ${o.codigo} — Megha Portões*\n*Serviço:* ${o.servicoNome} · ${o.tipoNome}\n*Material:* ${o.materialNome} · ${o.corNome}\n*Medidas:* ${fmt(o.w)} × ${fmt(o.h)} m (${o.qtd} un.)\n*Instalação:* ${o.instalacao ? 'Sim' : 'Não'}\n*Estimativa:* ${brl(o.total)}\n*Cliente:* ${c.nome} — ${c.whats}\n*Local:* ${c.cidade}${c.endereco ? ' — ' + c.endereco : ''}${c.loc ? '\n*Mapa:* ' + c.loc : ''}${c.obs ? '\n*Obs.:* ' + c.obs : ''}`;
  }

  function card(o, i) {
    const e = etapaDe(o), st = status[o.codigo] || {}, done = e >= M.etapas.length - 1;
    return `<article class="order" style="animation-delay:${i * .07}s" data-c="${esc(o.codigo)}">
      <div class="order-top">
        <div><span class="code-sm">${esc(o.codigo)}</span><h3>${ic(o.icone || 'gate')} ${esc(o.servicoNome)} · ${esc(o.tipoNome)}</h3></div>
        <span class="status-pill ${done ? 'done' : ''}">${M.etapas[e]}</span>
      </div>
      ${timeline(e)}
      ${st.nota ? `<div class="note">💬 ${esc(st.nota)}</div>` : ''}
      ${(o.fotos || []).length ? `<div class="thumbs">${o.fotos.map((d, i) => `<div class="th"><img src="${d}" alt="Foto de referência ${i + 1}"></div>`).join('')}</div>` : ''}
      <div class="kv">
        <div><span>Material</span><b>${esc(o.materialNome)}</b></div>
        <div><span>Cor</span><b><span class="dot" style="background:${esc(o.cor)}"></span>${esc(o.corNome)}</b></div>
        <div><span>Medidas</span><b>${fmt(o.w)} × ${fmt(o.h)} m · ${o.qtd} un.</b></div>
        <div><span>Instalação</span><b>${o.instalacao ? 'Sim' : 'Não'}</b></div>
        <div><span>Estimativa</span><b>${brl(o.total)}</b></div>
        ${st.valorFinal ? `<div><span>Valor final</span><b style="color:var(--yellow-ink)">${brl(st.valorFinal)}</b></div>` : ''}
        ${st.previsao ? `<div><span>Previsão</span><b>${esc(st.previsao.split('-').reverse().join('/'))}</b></div>` : ''}
        <div><span>Criado em</span><b>${dt(o.criadoEm)}</b></div>
      </div>
      <div class="order-actions">
        <a class="btn wa sm" target="_blank" rel="noopener" href="${wa(msg(o))}">${ic('whatsapp')}<span>Enviar / reenviar ao Carlito</span></a>
        <a class="btn ghost sm" target="_blank" rel="noopener" href="${wa('Olá! Gostaria de saber o andamento do pedido ' + o.codigo + '.')}"><span>Perguntar andamento</span></a>
        <button class="btn ghost sm" data-act="dup" type="button">${ic('copy')}<span>Duplicar</span></button>
        <button class="btn ghost sm" data-act="print" type="button">${ic('print')}<span>Imprimir</span></button>
        <button class="btn ghost sm" data-act="del" type="button">${ic('trash')}<span>Excluir</span></button>
      </div>
    </article>`;
  }

  function render() {
    const perfil = store.get(M.perfilKey, {}) || {};
    const nome = perfil.nome || (orders[0] && orders[0].cliente.nome) || '';
    const total = orders.reduce((a, o) => a + (o.total || 0), 0);
    const concl = orders.filter(o => etapaDe(o) >= 5).length;
    root.innerHTML = `
      <div class="area-head reveal in">
        <div class="who"><div class="avatar">${perfil.foto ? `<img src="${perfil.foto}" alt="Sua foto de perfil">` : esc((nome[0] || 'M').toUpperCase())}</div><div><h2>${nome ? 'Olá, ' + esc(nome.split(' ')[0]) + '!' : 'Bem-vindo!'}</h2><span class="muted">${orders.length ? orders.length + ' pedido(s) neste aparelho' : 'Nenhum pedido ainda'}</span>
          <div class="avatar-edit"><label class="chip-btn" style="cursor:pointer">${ic('edit')} ${perfil.foto ? 'Trocar foto' : 'Adicionar foto de perfil'}<input type="file" id="avIn" accept="image/*" hidden></label>${perfil.foto ? `<button class="chip-btn" id="avDel" type="button">${ic('trash')} Remover</button>` : ''}</div></div></div>
        <div class="stats" style="grid-template-columns:repeat(3,auto);gap:10px"><div class="stat"><b>${orders.length}</b><span>Pedidos</span></div><div class="stat"><b>${concl}</b><span>Concluídos</span></div><div class="stat" style="min-width:140px"><b style="font-size:1.4rem">${brl(total)}</b><span>Total estimado</span></div></div>
      </div>
      <div class="tabs">
        <button class="seg ${tab === 'pedidos' ? 'on' : ''}" data-t="pedidos">${ic('box')} Meus pedidos</button>
        <button class="seg ${tab === 'codigo' ? 'on' : ''}" data-t="codigo">${ic('ruler')} Acompanhar por código</button>
        <button class="seg ${tab === 'dados' ? 'on' : ''}" data-t="dados">${ic('user')} Meus dados</button>
      </div>
      <div id="tabBody"></div>`;
    $('#avIn').onchange = async e => {
      const f = e.target.files[0]; if (!f) return;
      const d = await UI.square(f, 240, .82); if (!d) return toast('Não consegui ler essa imagem.');
      store.set(M.perfilKey, Object.assign({}, store.get(M.perfilKey, {}) || {}, { foto: d })); UI.refreshAvatar(); toast('Foto de perfil atualizada ✓'); render();
    };
    const del = $('#avDel'); if (del) del.onclick = () => { const p = store.get(M.perfilKey, {}) || {}; delete p.foto; store.set(M.perfilKey, p); UI.refreshAvatar(); toast('Foto removida'); render(); };
    $$('.tabs .seg', root).forEach(b => b.onclick = () => { tab = b.dataset.t; render(); });
    ({ pedidos: tabPedidos, codigo: tabCodigo, dados: tabDados })[tab]();
  }

  function tabPedidos() {
    const b = $('#tabBody');
    if (!orders.length) {
      b.innerHTML = `<div class="empty">${ic('box')}<h3>Você ainda não fez nenhum orçamento</h3><p class="muted">Monte seu primeiro projeto: leva só alguns minutos e você vê o resultado ao vivo.</p><a class="btn" href="orcamento.html"><span>Fazer orçamento</span>${ic('arrow')}</a></div>`;
      return;
    }
    b.innerHTML = `<div class="orders">${orders.map(card).join('')}</div>
      <p class="muted" style="margin-top:22px;font-size:.88rem">ℹ️ Seus pedidos ficam salvos neste navegador. O Carlito atualiza o andamento pelo código do pedido — se a etapa mudar, ela aparece aqui automaticamente.</p>`;
    b.onclick = e => {
      const btn = e.target.closest('[data-act]'); if (!btn) return;
      const code = btn.closest('.order').dataset.c, o = orders.find(x => x.codigo === code);
      if (btn.dataset.act === 'del') { if (confirm('Excluir este pedido apenas deste aparelho?')) { orders = orders.filter(x => x.codigo !== code); save(); render(); toast('Pedido removido'); } }
      if (btn.dataset.act === 'dup') { store.set(M.rascunhoKey, o); location.href = 'orcamento.html'; }
      if (btn.dataset.act === 'print') printOrder(o);
    };
  }

  function printOrder(o) {
    const w = window.open('', '_blank'); if (!w) return toast('Permita pop-ups para imprimir.');
    const c = o.cliente;
    w.document.write(`<!doctype html><meta charset="utf-8"><title>Pedido ${esc(o.codigo)}</title><body style="font:16px/1.6 system-ui;max-width:640px;margin:30px auto;padding:0 20px;color:#111">
      <h1 style="margin:0">Megha Portões</h1><p style="margin:0 0 20px;color:#555">${esc(M.slogan)} · ${esc(M.endereco)}</p>
      <h2>Pedido ${esc(o.codigo)}</h2><p>${dt(o.criadoEm)}</p>
      <table style="width:100%;border-collapse:collapse">${[['Serviço', o.servicoNome + ' — ' + o.tipoNome], ['Material', o.materialNome], ['Cor', o.corNome], ['Medidas', fmt(o.w) + ' × ' + fmt(o.h) + ' m · ' + o.qtd + ' un.'], ['Instalação', o.instalacao ? 'Sim' : 'Não'], ['Extras', o.extras.map(e => e.nome).join(', ') || '—'], ['Estimativa', brl(o.total)], ['Cliente', c.nome + ' · ' + c.whats + (c.email ? ' · ' + c.email : '')], ['Local', c.cidade + (c.endereco ? ' — ' + c.endereco : '')]].map(r => `<tr><td style="padding:8px;border-bottom:1px solid #ddd;color:#555">${esc(r[0])}</td><td style="padding:8px;border-bottom:1px solid #ddd"><b>${esc(r[1])}</b></td></tr>`).join('')}</table>
      <p style="color:#777;font-size:13px;margin-top:24px">Valor de referência. O preço final é confirmado após a medição.</p><script>setTimeout(()=>print(),300)<\/script>`);
    w.document.close();
  }

  function tabCodigo() {
    const b = $('#tabBody');
    b.innerHTML = `<div class="card login-box"><h3>Acompanhar um pedido</h3><p class="muted">Digite o código que você recebeu (ex.: <b>MP-261114-AB12</b>) para ver em que etapa está — mesmo em outro aparelho.</p>
      <div class="lookup"><input id="cod" placeholder="MP-000000-XXXX" maxlength="20" aria-label="Código do pedido"><button class="btn" id="buscar" type="button"><span>Buscar</span></button></div><div id="res" style="margin-top:20px"></div></div>`;
    const go = () => {
      const code = $('#cod').value.trim().toUpperCase(), res = $('#res');
      if (!code) return;
      const local = orders.find(o => o.codigo === code), st = status[code];
      if (local) { res.innerHTML = card(local, 0); return; }
      if (st) {
        const e = Number.isInteger(st.etapa) ? st.etapa : 0;
        res.innerHTML = `<div class="order"><div class="order-top"><div><span class="code-sm">${esc(code)}</span></div><span class="status-pill ${e >= 5 ? 'done' : ''}">${M.etapas[e]}</span></div>${timeline(e)}${st.nota ? `<div class="note">💬 ${esc(st.nota)}</div>` : ''}${st.previsao ? `<p class="muted">Previsão: <b>${esc(st.previsao.split('-').reverse().join('/'))}</b></p>` : ''}</div>`;
      } else res.innerHTML = `<div class="note">Não encontramos esse código ainda. O Carlito pode demorar um pouco para registrar o andamento — confirme o código ou <a href="${wa('Olá! Gostaria de saber o andamento do pedido ' + code + '.')}" target="_blank" rel="noopener" style="text-decoration:underline">pergunte pelo WhatsApp</a>.</div>`;
    };
    $('#buscar').onclick = go; $('#cod').onkeydown = e => { if (e.key === 'Enter') go(); };
  }

  function tabDados() {
    const p = store.get(M.perfilKey, {}) || {}, b = $('#tabBody');
    b.innerHTML = `<div class="contact-grid"><form class="card" id="pf" novalidate><h3>Meus dados</h3><p class="muted">Usados para preencher seus próximos orçamentos mais rápido.</p>
      <div class="field"><label for="p-nome">Nome</label><input id="p-nome" value="${esc(p.nome)}"></div>
      <div class="row2"><div class="field"><label for="p-whats">WhatsApp</label><input id="p-whats" value="${esc(p.whats)}"></div><div class="field"><label for="p-email">E-mail</label><input id="p-email" type="email" value="${esc(p.email)}"></div></div>
      <div class="field"><label for="p-cid">Cidade / Bairro</label><input id="p-cid" value="${esc(p.cidade)}"></div>
      <div class="field"><label for="p-end">Endereço</label><input id="p-end" value="${esc(p.endereco)}"></div>
      <button class="btn" type="submit"><span>Salvar dados</span></button></form>
      <div class="card"><h3>Backup e privacidade</h3><p class="muted">Tudo fica guardado só neste navegador. Faça um backup para levar seus pedidos para outro aparelho.</p>
        <div class="cta-row"><button class="btn ghost sm" id="exp" type="button">${ic('download')}<span>Baixar backup</span></button><label class="btn ghost sm" style="cursor:pointer">${ic('plus')}<span>Importar backup</span><input type="file" id="imp" accept="application/json" hidden></label><button class="btn ghost sm" id="wipe" type="button">${ic('trash')}<span>Apagar tudo</span></button></div></div></div>`;
    $('#pf').onsubmit = e => { e.preventDefault(); store.set(M.perfilKey, Object.assign({}, store.get(M.perfilKey, {}) || {}, { nome: $('#p-nome').value.trim(), whats: $('#p-whats').value.trim(), email: $('#p-email').value.trim(), cidade: $('#p-cid').value.trim(), endereco: $('#p-end').value.trim() })); toast('Dados salvos ✓'); };
    $('#exp').onclick = () => {
      const blob = new Blob([JSON.stringify({ pedidos: orders, perfil: store.get(M.perfilKey, {}) }, null, 2)], { type: 'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'megha-meus-pedidos.json'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    };
    $('#imp').onchange = e => {
      const f = e.target.files[0]; if (!f) return; const r = new FileReader();
      r.onload = () => { try { const j = JSON.parse(r.result); if (Array.isArray(j.pedidos)) { const known = new Set(orders.map(o => o.codigo)); orders = orders.concat(j.pedidos.filter(o => o && o.codigo && !known.has(o.codigo))); save(); } if (j.perfil) store.set(M.perfilKey, j.perfil); toast('Backup importado ✓'); tab = 'pedidos'; render(); } catch (err) { toast('Arquivo inválido.'); } };
      r.readAsText(f);
    };
    $('#wipe').onclick = () => { if (confirm('Apagar todos os pedidos e dados deste navegador?')) { orders = []; save(); store.set(M.perfilKey, {}); UI.refreshAvatar(); toast('Dados apagados'); render(); } };
  }

  render();
})();

/* Partes comuns do site: topo com menu, rodapé, fotos e páginas montadas a partir de conteudo.js */
(function () {
  const CFG = window.CONFIG || {};
  const C = window.CONTEUDO || {};
  const pagina = document.body.dataset.pagina || '';

  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };

  /* ---------- Topo ---------- */
  const LINKS = [
    ['inicio', 'index.html', 'Início'],
    ['sobre', 'sobre.html', 'Sobre nós'],
    ['esportes', 'esportes.html', 'Esportes'],
    ['eventos', 'eventos.html', 'Eventos'],
    ['contato', 'contato.html', 'Contato']
  ];
  const topo = document.getElementById('topo');
  if (topo) {
    topo.className = 'topo-wrap gutter';
    topo.innerHTML =
      '<header class="topo">' +
      '  <a class="marca" href="index.html"><img class="logo" data-logo alt="Logo" hidden><span class="selo" data-sigla></span>' +
      '    <span class="txt"><b data-org></b><small data-org-completo></small></span></a>' +
      '  <button class="btn-menu" type="button" aria-expanded="false" aria-controls="menu">☰ Menu</button>' +
      '  <nav class="menu" id="menu" aria-label="Principal"></nav>' +
      '</header>';
    const nav = topo.querySelector('nav');
    LINKS.forEach(([id, href, rot]) => {
      const a = el('a', '', rot); a.href = href;
      if (id === pagina) a.setAttribute('aria-current', 'page');
      nav.appendChild(a);
    });
    const membro = el('a', 'btn-membro'); membro.href = 'membros.html';
    membro.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>';
    membro.appendChild(document.createTextNode('Área do membro'));
    if (pagina === 'membros') membro.setAttribute('aria-current', 'page');
    nav.appendChild(membro);
    const bt = topo.querySelector('.btn-menu');
    bt.addEventListener('click', () => { const ab = nav.classList.toggle('aberto'); bt.setAttribute('aria-expanded', String(ab)); });
    const sub = topo.querySelector('[data-org-completo]'); sub.textContent = CFG.NOME_COMPLETO || '';
  }

  /* ---------- Rodapé ---------- */
  const rod = document.getElementById('rodape');
  if (rod) {
    rod.className = 'rodape gutter';
    const inn = el('div', 'rodape-in');
    const esq = el('div'); esq.style.display = 'grid'; esq.style.gap = '4px';
    esq.append(el('b', '', CFG.NOME_ORGANIZACAO || ''), el('small', '', '© ' + new Date().getFullYear() + ' ' + (CFG.NOME_COMPLETO || CFG.NOME_ORGANIZACAO || '')));
    const redes = el('div', 'redes');
    (C.redes || []).forEach(r => { if (!r.link) return; const a = el('a', '', r.nome); a.href = r.link; if (/^https?:/.test(r.link)) { a.target = '_blank'; a.rel = 'noopener'; } redes.appendChild(a); });
    const m = el('a', '', 'Área do membro'); m.href = 'membros.html'; redes.appendChild(m);
    inn.append(esq, redes); rod.appendChild(inn);
  }

  if (window.API) API.aplicarMarca();

  /* ---------- Utilidades ---------- */
  function foto(src, alt, cls) {
    const f = el('div', 'foto' + (cls ? ' ' + cls : ''));
    f.appendChild(el('span', 'vazio-foto', 'Sua foto aqui'));
    if (src) {
      const img = el('img'); img.alt = alt || ''; img.loading = 'lazy';
      img.onload = () => f.classList.add('com-img'); img.onerror = () => img.remove();
      img.src = src; f.appendChild(img);
    }
    return f;
  }
  const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  function dataBonita(s) {
    const m = String(s || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
    return m ? Number(m[3]) + ' ' + MESES[Number(m[2]) - 1] + ' ' + m[1] : String(s || '');
  }
  function card(item, opts) {
    const c = el(item.link ? 'a' : 'article', 'card');
    if (item.link) { c.href = item.link; if (/^https?:/.test(item.link)) { c.target = '_blank'; c.rel = 'noopener'; } }
    c.appendChild(foto(item.imagem, item.titulo || item.nome));
    const corpo = el('div', 'card-corpo');
    if (opts && opts.chip) corpo.appendChild(el('span', 'data-chip', opts.chip));
    corpo.appendChild(el('h3', '', item.titulo || item.nome || ''));
    if (opts && opts.sub) corpo.appendChild(el('span', 'eyebrow', opts.sub));
    const txt = item.resumo || item.descricao;
    if (txt) corpo.appendChild(el('p', '', txt));
    if (item.link) corpo.appendChild(el('span', 'mais', 'Saiba mais →'));
    c.appendChild(corpo);
    return c;
  }
  function emBreve(alvo, titulo, texto) {
    const b = el('div', 'em-breve');
    const ic = el('div', 'icone');
    ic.innerHTML = '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/></svg>';
    b.append(ic, el('h2', '', titulo), el('p', '', texto));
    alvo.appendChild(b);
  }
  const $ = id => document.getElementById(id);
  const set = (id, t) => { const e = $(id); if (e) e.textContent = t || ''; };

  /* ---------- Páginas ---------- */
  if (pagina === 'inicio' && C.inicio) {
    const I = C.inicio;
    set('h-chamada', I.chamada); set('h-titulo', I.titulo); set('h-texto', I.texto);
    const b = $('h-botao'); if (I.botao && I.botao.texto) { b.textContent = I.botao.texto; b.href = I.botao.link || '#'; } else b.hidden = true;
    $('h-foto').appendChild(foto(I.imagem, 'Foto de capa'));
    const nums = $('numeros');
    if (I.numeros && I.numeros.length) I.numeros.forEach(n => { const d = el('div', 'numero'); d.append(el('b', '', n.valor), el('span', '', n.rotulo)); nums.appendChild(d); });
    else nums.hidden = true;
    const lista = $('noticias');
    const ns = (I.noticias || []).slice().sort((a, c) => String(c.data).localeCompare(String(a.data)));
    if (ns.length) ns.forEach(n => lista.appendChild(card(n, { chip: dataBonita(n.data) })));
    else emBreve(lista, 'Nenhuma novidade por enquanto', 'Volte em breve para ver as notícias.');
  }

  if (pagina === 'sobre' && C.sobre) {
    const S = C.sobre;
    set('s-titulo', S.titulo); set('s-texto', S.texto);
    const arts = $('artigos');
    (S.artigos || []).forEach(a => {
      const art = el('article', 'artigo');
      const fig = el('figure', 'artigo-foto'); fig.appendChild(foto(a.imagem, a.legenda || a.titulo));
      if (a.legenda) fig.appendChild(el('figcaption', '', a.legenda));
      const t = el('div', 'artigo-txt'); t.appendChild(el('h2', '', a.titulo));
      (a.paragrafos || []).forEach(p => t.appendChild(el('p', '', p)));
      art.append(fig, t); arts.appendChild(art);
    });
    const gal = $('galeria');
    if ((S.galeria || []).length) S.galeria.forEach(g => {
      const f = el('figure');
      const ft = foto(g.imagem, g.legenda);
      if (g.imagem) { const a = el('a'); a.href = g.imagem; a.target = '_blank'; a.rel = 'noopener'; a.appendChild(ft); f.appendChild(a); } else f.appendChild(ft);
      if (g.legenda) f.appendChild(el('figcaption', '', g.legenda));
      gal.appendChild(f);
    });
    else $('sec-galeria').hidden = true;
  }

  if (pagina === 'esportes' && C.esportes) {
    const E = C.esportes;
    set('p-titulo', E.titulo); set('p-texto', E.texto);
    const l = $('lista');
    if ((E.modalidades || []).length) E.modalidades.forEach(m => l.appendChild(card(m)));
    else { l.className = ''; emBreve(l, 'Em breve', 'Estamos preparando esta página. Enquanto isso, fale com a gente pelo Contato.'); }
  }

  if (pagina === 'eventos' && C.eventos) {
    const E = C.eventos;
    set('p-titulo', E.titulo); set('p-texto', E.texto);
    const l = $('lista');
    const ev = (E.lista || []).slice().sort((a, c) => String(a.data).localeCompare(String(c.data)));
    if (ev.length) ev.forEach(e => l.appendChild(card(e, { chip: dataBonita(e.data), sub: e.local })));
    else { l.className = ''; emBreve(l, 'Em breve', 'A agenda de eventos vai aparecer aqui. Siga a gente nas redes para não perder nada.'); }
  }

  if (pagina === 'contato' && C.contato) {
    const K = C.contato;
    set('c-titulo', K.titulo); set('c-texto', K.texto);
    const sel = $('assunto');
    (K.assuntos || []).forEach(a => { const o = el('option', '', a); o.value = a; sel.appendChild(o); });
    const info = $('info');
    [['E-mail', K.email, K.email ? 'mailto:' + K.email : ''], ['Instagram', K.instagram, K.instagram ? 'https://instagram.com/' + String(K.instagram).replace(/^@/, '') : ''], ['Onde estamos', K.endereco, '']]
      .forEach(([rot, val, link]) => {
        if (!val) return;
        const d = el('div', 'info-item'); d.appendChild(el('b', '', rot));
        if (link) { const a = el('a', '', val); a.href = link; if (/^https?:/.test(link)) { a.target = '_blank'; a.rel = 'noopener'; } d.appendChild(a); }
        else d.appendChild(el('span', '', val));
        info.appendChild(d);
      });

    $('f-contato').addEventListener('submit', async e => {
      e.preventDefault();
      const f = e.target, box = $('c-aviso'), btn = $('c-enviar');
      box.hidden = true;
      if (!f.nome.value.trim() || !f.mensagem.value.trim()) { box.className = 'aviso erro'; box.textContent = 'Preencha seu nome e a mensagem.'; box.hidden = false; return; }
      if (!f.email.checkValidity() || !f.email.value) { box.className = 'aviso erro'; box.textContent = 'Confira o e-mail: ele parece incompleto.'; box.hidden = false; return; }
      btn.disabled = true; btn.textContent = 'Enviando…';
      try {
        await API.post({ action: 'contato', nome: f.nome.value, email: f.email.value, assunto: f.assunto.value, mensagem: f.mensagem.value, site: f.site.value });
        f.reset();
        box.className = 'aviso info'; box.textContent = 'Mensagem enviada! Vamos responder no seu e-mail assim que possível.'; box.hidden = false;
      } catch (err) {
        box.className = 'aviso erro'; box.textContent = 'A mensagem não foi enviada: ' + err.message; box.hidden = false;
      } finally { btn.disabled = false; btn.textContent = 'Enviar mensagem'; }
    });
  }

  window.SITE = { foto, el, dataBonita };
})();

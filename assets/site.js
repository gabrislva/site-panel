/* Partes comuns do site: topo com menu, rodapé, fotos e páginas montadas a partir de conteudo.js */
(function () {
  const CFG = window.CONFIG || {};
  const C0 = window.CONTEUDO || {};
  const pagina = document.body.dataset.pagina || '';

  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };

  /* ---------- Topo ---------- */
  const LINKS = [
    ['inicio', 'index.html', 'Início'],
    ['sobre', 'sobre.html', 'Sobre nós'],
    ['esportes', 'esportes.html', 'Esportes'],
    ['eventos', 'eventos.html', 'Eventos'],
    ['parcerias', 'parcerias.html', 'Parcerias'],
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
    (C0.redes || []).forEach(r => { if (!r.link) return; const a = el('a', '', r.nome); a.href = r.link; if (/^https?:/.test(r.link)) { a.target = '_blank'; a.rel = 'noopener'; } redes.appendChild(a); });
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

  /* ---------- Conteúdo editado pelo painel (planilha) ----------
     O site mostra primeiro o que está guardado no navegador e depois
     atualiza com a planilha. Sem API ou se a planilha falhar, usa conteudo.js. */
  function mesclar(base, P) {
    const C = JSON.parse(JSON.stringify(base || {}));
    const T = (P && P.textos) || {}, L = (P && P.colecoes) || {};
    const ativo = n => L[n] && L[n].ativo, itens = n => (L[n] && L[n].itens) || [];
    const pg = n => (C[n] = C[n] || {});
    const txt = (n, campo, chave) => { if (T[chave]) pg(n)[campo] = T[chave]; };
    ['chamada', 'titulo', 'texto', 'imagem'].forEach(k => txt('inicio', k, 'inicio.' + k));
    if (T['inicio.botaoTexto']) pg('inicio').botao = { texto: T['inicio.botaoTexto'], link: T['inicio.botaoLink'] || (C.inicio.botao && C.inicio.botao.link) || 'sobre.html' };
    ['sobre', 'eventos', 'esportes', 'parcerias'].forEach(n => { txt(n, 'titulo', n + '.titulo'); txt(n, 'texto', n + '.texto'); });
    if (ativo('noticias')) pg('inicio').noticias = itens('noticias');
    if (ativo('sobre')) {
      pg('sobre').artigos = itens('sobre').filter(i => i.tipo !== 'Foto').map(i => ({ titulo: i.titulo, paragrafos: String(i.texto || '').split(/\n\s*\n|\n/).filter(x => x.trim()), imagem: i.imagem, legenda: i.legenda }));
      C.sobre.galeria = itens('sobre').filter(i => i.tipo === 'Foto').map(i => ({ imagem: i.imagem, legenda: i.legenda }));
    }
    if (ativo('agenda')) pg('eventos').lista = itens('agenda');
    if (ativo('treinos')) pg('esportes').modalidades = itens('treinos').map(i => ({ nome: i.modalidade, descricao: i.descricao, imagem: i.imagem, link: i.link, horario: i.horario, local: i.local }));
    if (ativo('resultados')) pg('esportes').resultados = itens('resultados');
    if (ativo('parcerias')) pg('parcerias').lista = itens('parcerias');
    return C;
  }

  function render(C) {
    if (pagina === 'inicio' && C.inicio) {
      const I = C.inicio;
      set('h-chamada', I.chamada); set('h-titulo', I.titulo); set('h-texto', I.texto);
      const b = $('h-botao'); if (I.botao && I.botao.texto) { b.hidden = false; b.textContent = I.botao.texto; b.href = I.botao.link || '#'; } else b.hidden = true;
      const hf = $('h-foto'); hf.innerHTML = ''; hf.appendChild(foto(I.imagem, 'Foto de capa'));
      const nums = $('numeros'); nums.innerHTML = '';
      if (I.numeros && I.numeros.length) { nums.hidden = false; I.numeros.forEach(n => { const d = el('div', 'numero'); d.append(el('b', '', n.valor), el('span', '', n.rotulo)); nums.appendChild(d); }); }
      else nums.hidden = true;
      const lista = $('noticias'); lista.innerHTML = '';
      const ns = (I.noticias || []).slice().sort((a, c) => String(c.data).localeCompare(String(a.data)));
      if (ns.length) ns.forEach(n => lista.appendChild(card(n, { chip: dataBonita(n.data) })));
      else emBreve(lista, 'Nenhuma novidade por enquanto', 'Volte em breve para ver as notícias.');
    }

    if (pagina === 'sobre' && C.sobre) {
      const S = C.sobre;
      set('s-titulo', S.titulo); set('s-texto', S.texto);
      const arts = $('artigos'); arts.innerHTML = '';
      (S.artigos || []).forEach(a => {
        const art = el('article', 'artigo');
        const fig = el('figure', 'artigo-foto'); fig.appendChild(foto(a.imagem, a.legenda || a.titulo));
        if (a.legenda) fig.appendChild(el('figcaption', '', a.legenda));
        const t = el('div', 'artigo-txt'); t.appendChild(el('h2', '', a.titulo || ''));
        (a.paragrafos || []).forEach(p => t.appendChild(el('p', '', p)));
        art.append(fig, t); arts.appendChild(art);
      });
      const gal = $('galeria'); gal.innerHTML = '';
      $('sec-galeria').hidden = !(S.galeria || []).length;
      (S.galeria || []).forEach(g => {
        const f = el('figure');
        const ft = foto(g.imagem, g.legenda);
        if (g.imagem) { const a = el('a'); a.href = g.imagem; a.target = '_blank'; a.rel = 'noopener'; a.appendChild(ft); f.appendChild(a); } else f.appendChild(ft);
        if (g.legenda) f.appendChild(el('figcaption', '', g.legenda));
        gal.appendChild(f);
      });
    }

    if (pagina === 'esportes' && C.esportes) {
      const E = C.esportes;
      set('p-titulo', E.titulo); set('p-texto', E.texto);
      const l = $('lista'); l.innerHTML = ''; l.className = 'cards';
      if ((E.modalidades || []).length) E.modalidades.forEach(m => l.appendChild(card(m, { chip: m.horario, sub: m.local })));
      else { l.className = ''; emBreve(l, 'Em breve', 'Estamos preparando esta página. Enquanto isso, fale com a gente pelo Contato.'); }
      const rs = E.resultados || [], box = $('resultados'); box.innerHTML = '';
      $('sec-resultados').hidden = !rs.length;
      rs.slice().sort((a, c) => String(c.data).localeCompare(String(a.data))).forEach(r => {
        const it = el('article', 'resultado');
        const med = el('div', 'res-medalha' + (/campe|1º|1o|ouro/i.test(r.resultado || '') ? ' ouro' : /2º|2o|vice|prata/i.test(r.resultado || '') ? ' prata' : /3º|3o|bronze/i.test(r.resultado || '') ? ' bronze' : ''));
        med.textContent = r.resultado || '—';
        const tx = el('div', 'res-txt');
        tx.append(el('span', 'data-chip', [dataBonita(r.data), r.modalidade].filter(Boolean).join(' · ')), el('h3', '', r.campeonato));
        if (r.descricao) tx.appendChild(el('p', '', r.descricao));
        it.append(med, tx);
        if (r.imagem) it.appendChild(foto(r.imagem, r.campeonato, 'res-foto'));
        box.appendChild(it);
      });
    }

    if (pagina === 'eventos' && C.eventos) {
      const E = C.eventos;
      set('p-titulo', E.titulo); set('p-texto', E.texto);
      const hoje = new Date().toISOString().slice(0, 10);
      const todos = (E.lista || []).slice().sort((a, c) => String(a.data).localeCompare(String(c.data)));
      const prox = todos.filter(e => !e.data || String(e.data) >= hoje), pass = todos.filter(e => e.data && String(e.data) < hoje).reverse();
      const l = $('lista'); l.innerHTML = ''; l.className = 'cards';
      if (prox.length) prox.forEach(e => l.appendChild(card(e, { chip: dataBonita(e.data), sub: e.local })));
      else { l.className = ''; emBreve(l, 'Em breve', 'A agenda de eventos vai aparecer aqui. Siga a gente nas redes para não perder nada.'); }
      const p = $('passados'); p.innerHTML = ''; $('sec-passados').hidden = !pass.length;
      pass.forEach(e => p.appendChild(card(e, { chip: dataBonita(e.data), sub: e.local })));
    }

    if (pagina === 'parcerias') {
      const P = C.parcerias || {};
      set('p-titulo', P.titulo || 'Parcerias');
      set('p-texto', P.texto || 'Empresas e marcas que apoiam a gente e oferecem vantagens para os nossos membros.');
      const l = $('lista'); l.innerHTML = ''; l.className = 'parcerias';
      const ps = P.lista || [];
      if (!ps.length) { l.className = ''; emBreve(l, 'Em breve', 'Nossas parcerias vão aparecer aqui. Quer ser parceiro? Fale com a gente pelo Contato.'); }
      ps.forEach(x => {
        const c = el(x.link ? 'a' : 'article', 'parceiro');
        if (x.link) { c.href = x.link; if (/^https?:/.test(x.link)) { c.target = '_blank'; c.rel = 'noopener'; } }
        const logo = el('div', 'parceiro-logo');
        if (x.imagem) { const im = el('img'); im.src = x.imagem; im.alt = x.nome; im.loading = 'lazy'; logo.appendChild(im); }
        else logo.appendChild(el('span', '', String(x.nome || '?').trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase()));
        const corpo = el('div', 'parceiro-corpo');
        corpo.appendChild(el('h3', '', x.nome));
        if (x.beneficios) { const bf = el('div', 'beneficio'); bf.append(el('span', 'eyebrow', 'Benefício'), el('p', '', x.beneficios)); corpo.appendChild(bf); }
        if (x.link) corpo.appendChild(el('span', 'mais', 'Conhecer →'));
        c.append(logo, corpo); l.appendChild(c);
      });
    }
  }

  const DINAMICAS = ['inicio', 'sobre', 'esportes', 'eventos', 'parcerias'];
  if (DINAMICAS.indexOf(pagina) >= 0) {
    const CHAVE = 'site-publico-v1';
    let guardado = null;
    try { guardado = JSON.parse(localStorage.getItem(CHAVE) || 'null'); } catch (e) { }
    const usaApi = window.API && API.configurado();
    if (!usaApi) render(C0);
    else {
      if (guardado) render(mesclar(C0, guardado));
      else document.body.classList.add('carregando');
      API.post({ action: 'publico' }).then(P => {
        const novo = { textos: P.textos, colecoes: P.colecoes };
        try { localStorage.setItem(CHAVE, JSON.stringify(novo)); } catch (e) { }
        if (!guardado || JSON.stringify(novo) !== JSON.stringify(guardado)) render(mesclar(C0, novo));
      }).catch(() => { if (!guardado) render(C0); })
        .finally(() => document.body.classList.remove('carregando'));
    }
  }

  if (pagina === 'contato' && C0.contato) {
    const K = C0.contato;
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

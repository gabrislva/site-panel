// Comunicação com o Apps Script + utilidades compartilhadas
(function () {
  const cfg = window.CONFIG || {};

  function configurado() {
    return cfg.API_URL && /^https:\/\/script\.google\.com\//.test(cfg.API_URL);
  }

  async function lerResposta(res) {
    let dados;
    try { dados = await res.json(); } catch (e) { throw new Error('Resposta inesperada do servidor. Confira a URL em config.js.'); }
    if (!dados.ok) { const e = new Error(dados.erro || 'Erro desconhecido.'); e.sessao = dados.sessao; throw e; }
    return dados;
  }

  async function get(params) {
    if (!configurado()) throw new Error('Sistema ainda não configurado: preencha API_URL em config.js.');
    const url = cfg.API_URL + '?' + new URLSearchParams(params).toString();
    return lerResposta(await fetch(url, { method: 'GET' }));
  }

  // text/plain evita a pré-requisição CORS, que o Apps Script não responde
  async function post(body) {
    if (!configurado()) throw new Error('Sistema ainda não configurado: preencha API_URL em config.js.');
    return lerResposta(await fetch(cfg.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body)
    }));
  }

  const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  function dinheiro(v) { return brl.format(Number(v) || 0); }
  function dataBR(s) {
    if (!s) return '—';
    const m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?/);
    if (!m) return s;
    return m[3] + '/' + m[2] + '/' + m[1] + (m[4] ? ' ' + m[4] + ':' + m[5] : '');
  }

  function arquivoParaBase64(file) {
    return new Promise((ok, erro) => {
      const r = new FileReader();
      r.onload = () => ok(String(r.result).split(',')[1]);
      r.onerror = () => erro(new Error('Não foi possível ler o arquivo.'));
      r.readAsDataURL(file);
    });
  }

  function aplicarMarca() {
    document.querySelectorAll('[data-org]').forEach(el => { el.textContent = cfg.NOME_ORGANIZACAO || ''; });
    const ini = (cfg.NOME_ORGANIZACAO || 'R').trim().split(/\s+/).map(p => p[0]).slice(0, 2).join('').toUpperCase();
    document.querySelectorAll('[data-sigla]').forEach(el => { el.textContent = ini; });
    // Logo: usa o arquivo de config.js; se não existir, fica a sigla
    document.querySelectorAll('img[data-logo]').forEach(img => {
      const sigla = img.parentElement.querySelector('[data-sigla]');
      if (!cfg.LOGO) { img.hidden = true; return; }
      img.onload = () => { img.hidden = false; if (sigla) sigla.hidden = true; };
      img.onerror = () => { img.hidden = true; if (sigla) sigla.hidden = false; };
      img.src = cfg.LOGO;
    });
  }

  window.API = { get, post, configurado, dinheiro, dataBR, arquivoParaBase64, aplicarMarca };
})();

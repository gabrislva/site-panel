/* ============================================================
   CONTEÚDO DO SITE — edite os textos aqui
   ------------------------------------------------------------
   • Troque os textos entre aspas. Mantenha as vírgulas no fim das linhas.
   • Fotos: suba os arquivos na pasta img/ e escreva o caminho, ex.: 'img/time.jpg'.
     Deixe '' (vazio) para mostrar um espaço reservado "Sua foto aqui".
   • Para adicionar uma notícia, evento etc., copie um bloco { ... },
     cole logo abaixo (separado por vírgula) e troque o texto.
   • Listas vazias [] mostram o aviso "Em breve" automaticamente.
   ============================================================ */

window.CONTEUDO = {

  /* ---------------- INÍCIO ---------------- */
  inicio: {
    chamada: 'Bem-vindo à nossa casa',
    titulo: 'Mais que uma atlética, uma família.',
    texto: 'Exemplo de texto de abertura. Conte em duas frases quem vocês são, o que fazem e por que vale a pena participar. Troque este texto em conteudo.js.',
    botao: { texto: 'Conheça a gente', link: 'sobre.html' },
    imagem: '',   // foto grande do topo, ex.: 'img/capa.jpg'

    // Novidades e notícias (a mais recente primeiro)
    noticias: [
      {
        data: '2026-11-10',
        titulo: 'Exemplo: novo site no ar!',
        resumo: 'Exemplo de notícia. Escreva um resumo curto, de duas ou três linhas, sobre a novidade.',
        imagem: '',
        link: ''        // opcional: link para saber mais (Instagram, formulário etc.)
      },
      {
        data: '2026-11-01',
        titulo: 'Exemplo: inscrições abertas',
        resumo: 'Outra notícia de exemplo. Para adicionar mais, copie este bloco inteiro e cole embaixo.',
        imagem: '',
        link: ''
      }
    ]
  },

  /* ---------------- SOBRE NÓS ---------------- */
  sobre: {
    titulo: 'Sobre nós',
    texto: 'Exemplo: um parágrafo curto apresentando a instituição. Os artigos abaixo contam a história com mais detalhes.',

    // Artigos: cada um com título, parágrafos, foto e legenda
    artigos: [
      {
        titulo: 'Exemplo: nossa história',
        paragrafos: [
          'Primeiro parágrafo de exemplo. Conte como tudo começou.',
          'Segundo parágrafo de exemplo. Para mais parágrafos, adicione mais linhas entre aspas, separadas por vírgula.'
        ],
        imagem: '',
        legenda: 'Exemplo de legenda da foto'
      },
      {
        titulo: 'Exemplo: missão e valores',
        paragrafos: [
          'Parágrafo de exemplo sobre o que move a instituição.'
        ],
        imagem: '',
        legenda: ''
      }
    ],

    // Galeria de fotos
    galeria: [
      { imagem: '', legenda: 'Exemplo: evento de integração' },
      { imagem: '', legenda: 'Exemplo: time reunido' },
      { imagem: '', legenda: 'Exemplo: bastidores' },
      { imagem: '', legenda: 'Exemplo: confraternização' }
    ]
  },

  /* ---------------- ESPORTES ---------------- */
  esportes: {
    titulo: 'Esportes',
    texto: 'Em breve você vai encontrar aqui as modalidades, treinos e como participar.',
    // Exemplo de item: { nome: 'Futsal', descricao: 'Treinos às terças, 19h', imagem: '', link: '' }
    modalidades: []
  },

  /* ---------------- EVENTOS ---------------- */
  eventos: {
    titulo: 'Eventos',
    texto: 'Em breve você vai encontrar aqui a agenda de eventos.',
    // Exemplo de item: { data: '2026-12-05', nome: 'Festa de fim de ano', local: 'Centro de Eventos', descricao: '', imagem: '', link: '' }
    lista: []
  },

  /* ---------------- CONTATO ---------------- */
  contato: {
    titulo: 'Fale com a gente',
    texto: 'Mande sua dúvida, sugestão ou proposta de parceria. A mensagem chega direto no nosso e-mail.',
    email: 'contatoateco@gmail.com',
    instagram: '@atecoufsc',
    endereco: 'Campus Universitário UFSC Tindade, Centro Sócioeconômico, Bloco B — Florianópolis/SC',
    assuntos: ['Dúvida', 'Quero participar', 'Parceria e patrocínio', 'Outro']
  },

  /* ---------------- REDES (rodapé) ---------------- */
  redes: [
    { nome: 'Instagram', link: 'https://instagram.com/atecoufsc' },
    { nome: 'E-mail', link: 'mailto:contatoateco@gmail.com' }
  ]
};

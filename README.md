# Site da instituição + Área do membro

Mesmo modelo dos outros sistemas:

| Parte | Onde fica | Quem edita |
|---|---|---|
| Páginas públicas (Início, Sobre nós, Esportes, Eventos, Contato) | GitHub, arquivo `conteudo.js` | Você, editando o texto |
| Área do membro (login, avisos, reembolso) | GitHub + Apps Script + Planilha do Portal | Planilha |
| Reembolsos | A mesma planilha de reembolsos que você já usa | Planilha |

Custo: R$ 0.

```
(raiz do repositório)
├── index.html        ← Início
├── sobre.html        ← Sobre nós
├── esportes.html     ← Esportes
├── eventos.html      ← Eventos
├── contato.html      ← Contato (formulário que manda e-mail)
├── membros.html      ← Área do membro
├── config.js         ← URL da API, nome e logo
├── conteudo.js       ← TODOS os textos e fotos das páginas públicas
├── assets/           ← visual e código (não precisa mexer)
├── img/              ← logo.png e fotos
└── apps-script/      ← Code.gs (vai para o Apps Script, não precisa subir no GitHub)
```

---

## Passo 1 · Planilha do Portal + Apps Script

1. Crie uma planilha nova (**sheets.new**), por exemplo *Portal ATECO*.
2. Abra **Extensões → Apps Script**, cole todo o `apps-script/Code.gs` e salve.
3. Rode a função **configurar** e autorize quando pedir. São criadas as abas:

   | Aba | O que é |
   |---|---|
   | **Config** | Nome da instituição e **e-mail que recebe o formulário de contato** (preencha!) |
   | **Membros** | `Nome · E-mail · Senha · Papel · Ativo · Último acesso`. Já vem com você como Admin, com a senha `trocar123` |
   | **Avisos** | Mural da Área do membro. Só aparecem os avisos com *Publicado = Sim* |
   | **Contatos** | Cópia de todas as mensagens do formulário de contato |

4. **Ligue o reembolso:** abra a sua planilha de reembolsos e copie o ID dela, que é a parte da URL entre `/d/` e `/edit`:
   `https://docs.google.com/spreadsheets/d/`**`1AbC...xyz`**`/edit`
   Volte ao Apps Script do Portal, vá em **⚙ Configurações do projeto → Propriedades do script** e cole o ID em `REEMBOLSOS_PLANILHA_ID`.
5. Vá em **Implantar → Nova implantação → App da Web**, com *Executar como: **Eu*** e *Quem pode acessar: **Qualquer pessoa***. Copie a URL que termina em `/exec`.

> Depois de atualizar o `Code.gs`, rode **configurar** de novo. Ele não apaga nada, só cria o que faltar. Em seguida, vá em **Implantar → Gerenciar implantações → Editar → Nova versão**.

### Papéis dos membros

| Papel | Pode |
|---|---|
| **Membro** | Pedir reembolso e acompanhar os próprios pedidos |
| **Aprovador** | + aprovar ou recusar pedidos de todos |
| **Financeiro** | + marcar pedidos como pagos |
| **Admin** | Tudo |

- **Bloquear alguém:** mude *Ativo* para `Não`. A pessoa sai na próxima ação que fizer.
- **Senha:** fica visível na planilha, sem criptografia. Para resetar, é só escrever outra. O membro pode trocar a própria senha em *Minha conta*.

## Passo 2 · Site no GitHub

1. Em `config.js`, cole a URL em `API_URL` e ajuste o nome.
2. Suba a logo em `img/logo.png`.
3. No repositório `ateco-ufsc`, coloque os arquivos deste pacote **na raiz** (Add file → Upload files). Assim o site principal fica em `https://gabrislva.github.io/ateco-ufsc/`.
4. A pasta `votacao/` continua onde está e funciona normalmente.

### E o sistema de reembolso antigo?

Os arquivos antigos (`index.html`, `painel.html`, `config.js` e `assets/` do reembolso) estavam na raiz e vão ser **substituídos** pelos do site. Isso é esperado: os pedidos agora são feitos pela Área do membro, e a aprovação também. A planilha de reembolsos e os pedidos antigos continuam iguais e aparecem no portal.

Se quiser manter o formulário público antigo funcionando por um tempo, mova os arquivos dele para uma pasta `reembolsos/` **antes** de subir o site.

## Editando o conteúdo das páginas

Tudo fica em **`conteudo.js`**. Abra o arquivo no GitHub, clique no lápis (✏️), edite e clique em **Commit changes**. O site atualiza em 1 ou 2 minutos.

- **Textos:** troque o que está entre aspas `'...'`. Se o texto tiver apóstrofo, escreva `\'`, por exemplo `'D\'Ávila'`.
- **Fotos:** suba a imagem em `img/` e escreva o caminho, por exemplo `imagem: 'img/time.jpg'`. Deixe `''` para mostrar o espaço "Sua foto aqui".
- **Adicionar uma notícia, artigo ou evento:** copie um bloco `{ ... },` inteiro, cole logo abaixo e troque os textos.
- **Esportes e Eventos:** enquanto a lista estiver vazia `[]`, aparece "Em breve". O próprio arquivo tem um exemplo de item, em comentário, logo acima de cada lista.
- **Datas:** use sempre o formato `'2026-12-05'` (ano-mês-dia).

> Se a página ficar em branco depois de uma edição, quase sempre é uma vírgula ou aspas faltando. Compare com o bloco de exemplo.

## Formulário de contato

As mensagens chegam no e-mail definido na aba **Config** e ficam registradas na aba **Contatos**. Para responder, basta clicar em *Responder* no e-mail: a resposta vai direto para quem escreveu. Há proteção simples contra robôs e contra envios repetidos, com uma mensagem a cada 3 minutos por e-mail.

## Área do membro

- **Início:** saudação, atalhos e o mural de avisos (aba *Avisos*).
- **Pedir reembolso:** o nome e o e-mail vão automaticamente; as categorias e os projetos vêm da aba *Config* da planilha de reembolsos.
- **Meus pedidos:** status e comentários de cada pedido.
- **Aprovar reembolsos:** só para Aprovador, Financeiro e Admin. Tem filtros, detalhes, histórico e exportação em CSV.
- **Minha conta:** trocar a senha.

A sessão dura 6 horas sem uso. Depois disso, é preciso entrar de novo.

## Próximas funções

O portal foi montado para crescer. Cada nova função vira mais um item no menu lateral (como *Pedir reembolso*) e mais uma ação no `Code.gs`. Exemplos que encaixam bem: lista de presença em reuniões, controle de caixa, cadastro de patrocinadores.

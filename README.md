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
   | **Membros** | `Nome · E-mail · Senha · Papel · Ativo · Último acesso`. Já vem com você na Presidência, com a senha `trocar123` |
   | **Avisos** | Mural da Área do membro. Só aparecem os avisos com *Publicado = Sim* |
   | **Contatos** | Cópia de todas as mensagens do formulário de contato |

4. **Ligue o reembolso:** abra a sua planilha de reembolsos e copie o ID dela, que é a parte da URL entre `/d/` e `/edit`:
   `https://docs.google.com/spreadsheets/d/`**`1AbC...xyz`**`/edit`
   Volte ao Apps Script do Portal, vá em **⚙ Configurações do projeto → Propriedades do script** e cole o ID em `REEMBOLSOS_PLANILHA_ID`.
5. Vá em **Implantar → Nova implantação → App da Web**, com *Executar como: **Eu*** e *Quem pode acessar: **Qualquer pessoa***. Copie a URL que termina em `/exec`.

> Depois de atualizar o `Code.gs`, rode **configurar** de novo. Ele não apaga nada, só cria o que faltar. Em seguida, vá em **Implantar → Gerenciar implantações → Editar → Nova versão**.

### Cargos dos membros

| Cargo | Pode |
|---|---|
| **Membro**, **Marketing**, **Comercial**, **Esportes**, **Conselho**, **Eventos** | Pedir reembolso, acompanhar e corrigir os próprios pedidos |
| **Financeiro** | + aprovar os pedidos pendentes |
| **Gestão de Pessoas** | + adicionar, editar e excluir membros (menos quem é da Presidência) |
| **Presidência** | Tudo: pagar, recusar, pedir revisão e gerenciar todos os membros |

Ao rodar *configurar*, os nomes antigos são convertidos sozinhos: **Admin → Presidência** e **Aprovador → Financeiro**.

### Fluxo do reembolso

```
Pendente ──(Financeiro aprova)──► Aprovado ──(Presidência)──► Pago
                                     ├──(Presidência)──► Recusado
                                     └──(Presidência)──► Em revisão ──(membro corrige e reenvia)──► Pendente
```

- **Recusar** e **pedir revisão** exigem um comentário, que vai por e-mail para o membro.
- Em **revisão**, o membro vê o pedido destacado em *Meus pedidos*, clica em **Corrigir e reenviar**, ajusta os dados (pode trocar o comprovante) e o pedido volta para o Financeiro.
- **E-mails automáticos:** pedido novo ou corrigido avisa o Financeiro; pedido aprovado avisa a Presidência; toda mudança de status avisa o membro.
- A Presidência também pode recusar ou pedir revisão direto de um pedido pendente, e reabrir pedidos recusados.

### Gerenciar membros (Presidência e Gestão de Pessoas)

No menu **Membros** da Área do membro:

- **+ Adicionar membro:** foto (opcional), nome, e-mail, cargo e senha. *Gerar senha* cria uma senha aleatória. Deixe marcado "Enviar e-mail" para a pessoa receber o login.
- **Foto:** clique em *Escolher foto*. O site recorta no centro e reduz a imagem sozinho, e ela aparece redondinha ao lado do nome. As fotos ficam na pasta **Portal — Fotos dos membros** do Drive. Cada membro também pode trocar a própria foto em *Minha conta*.
- **Editar:** clique na pessoa. Para trocar a senha, digite a nova; deixe em branco para manter a atual.
- **Bloquear:** em *Acesso*, escolha *Bloqueado*. A pessoa não entra mais, mas o histórico dela fica.
- **Excluir:** clique em *Excluir* na linha, ou dentro do cadastro, e confirme com um segundo clique. A linha sai da planilha e a foto vai para a lixeira do Drive; os pedidos de reembolso da pessoa continuam na planilha de reembolsos.
- **Regras de segurança:**
  - A Gestão de Pessoas não vê o cargo *Presidência* na lista e não consegue editar nem excluir quem é da Presidência.
  - Ninguém consegue excluir a si mesmo, nem mudar o próprio cargo.
  - Sempre precisa sobrar pelo menos uma pessoa ativa na Presidência.

> As fotos são compartilhadas no Drive como "qualquer pessoa com o link pode ver", para aparecerem no site. Se a sua conta Google não permitir isso, o sistema guarda a foto, já reduzida, direto na planilha.

O link que vai no e-mail de boas-vindas fica na aba **Config** (*Link da Área do membro*).

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
- **Gerenciar reembolsos:** só para Financeiro e Presidência. Tem filtros, detalhes, histórico e exportação em CSV.
- **Membros:** só para Presidência e Gestão de Pessoas. Serve para adicionar, editar, bloquear e excluir membros, com foto.
- **Minha conta:** trocar a foto e a senha.

A sessão dura 6 horas sem uso. Depois disso, é preciso entrar de novo.

## Próximas funções

O portal foi montado para crescer. Cada nova função vira mais um item no menu lateral (como *Pedir reembolso*) e mais uma ação no `Code.gs`. Exemplos que encaixam bem: lista de presença em reuniões, controle de caixa, cadastro de patrocinadores.

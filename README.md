# Site da instituição + Área do membro

Mesmo modelo dos outros sistemas:

| Parte | Onde fica | Quem edita |
|---|---|---|
| Páginas públicas (Início, Sobre nós, Esportes, Eventos, Contato) | GitHub, arquivo `conteudo.js` | Você, editando o texto |
| Área do membro (login, avisos, reembolsos, vendas, eventos…) | GitHub + Apps Script + **uma planilha só** | Planilha |

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
   | **Membros** | `Nome · E-mail · Senha · Papel · Ativo · Último acesso · Foto`. Já vem com você na Presidência, com a senha `trocar123` |
   | **Avisos** | Mural da Área do membro. Só aparecem os avisos com *Publicado = Sim* |
   | **Contatos** | Cópia de todas as mensagens do formulário de contato |
   | **Reembolsos** | Todos os pedidos de reembolso |
   | **Categorias e projetos** | Listas do formulário de reembolso: categorias na coluna A, projetos/setores na coluna B |
   | **Itens · Vendas · Compras** | Estoque e vendas |
   | **Eventos · Presenças** | Eventos internos e lista de presença |

4. Vá em **Implantar → Nova implantação → App da Web**, com *Executar como: **Eu*** e *Quem pode acessar: **Qualquer pessoa***. Copie a URL que termina em `/exec`.

### Trazer os reembolsos da planilha antiga (opcional)

1. Copie o ID da planilha de reembolsos antiga, que é a parte da URL entre `/d/` e `/edit`.
2. No topo do `Code.gs`, cole o ID entre as aspas: `const PLANILHA_REEMBOLSOS_ANTIGA = '1AbC...xyz';` e salve.
3. Rode a função **importarReembolsosAntigos**. Ela copia os pedidos (pulando os que já existem) e as categorias e projetos.

A propriedade `REEMBOLSOS_PLANILHA_ID` não é mais usada e pode ser apagada.

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
- **Excluir:** clique em *Excluir* na linha, ou dentro do cadastro, e confirme com um segundo clique. A linha sai da planilha e a foto vai para a lixeira do Drive; os pedidos de reembolso da pessoa continuam na aba Reembolsos.
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

Os arquivos antigos (`index.html`, `painel.html`, `config.js` e `assets/` do reembolso) estavam na raiz e vão ser **substituídos** pelos do site. Isso é esperado: os pedidos agora são feitos pela Área do membro, e a aprovação também. Os pedidos antigos podem ser trazidos para a planilha do portal com *importarReembolsosAntigos* (veja o Passo 1).

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

- **Início:** mural de avisos no topo (os 3 mais recentes, com *Ver todos*), sua contagem de presenças e faltas, panorama financeiro, ranking e atalhos.
- **Pedir reembolso:** o nome e o e-mail vão automaticamente; as categorias e os projetos vêm da aba *Categorias e projetos*.
- **Meus pedidos:** status e comentários de cada pedido.
- **Gerenciar reembolsos:** só para Financeiro e Presidência. Tem filtros, detalhes, histórico e exportação em CSV.
- **Eventos internos:** só para Presidência e Gestão de Pessoas. Cria eventos e registra a presença.
- **Membros:** só para Presidência e Gestão de Pessoas. Serve para adicionar, editar, bloquear e excluir membros, com foto.
- **Minha conta:** trocar a foto e a senha.

A sessão dura 6 horas sem uso. Depois disso, é preciso entrar de novo.

## Vendas, estoque, compras e panorama financeiro

Ficam na planilha do Portal, nas abas **Itens**, **Vendas** e **Compras**, criadas ao rodar *configurar*.

| Tela | Quem usa | O que faz |
|---|---|---|
| **Panorama financeiro** (no Início) | Todos | Lucro previsto, previsão de despesas, saldo previsto e gráfico de 6 meses |
| **Vendas** | Todos | Registrar venda; o estoque baixa sozinho. Cada um vê as próprias vendas |
| **Estoque** | Financeiro e Presidência | Cadastrar e editar itens: preço, custo, quantidade e estoque mínimo |
| **Compras** | Financeiro e Presidência | Registrar compra prevista ou recebida e marcar quando chegou |

**Como as contas são feitas:**

- **Lucro previsto com vendas** = lucro das vendas do mês (preço − custo) + o que o estoque atual renderia se fosse todo vendido.
- **Previsão de despesas** = reembolsos ainda não pagos (Pendente, Aprovado ou Em revisão) + compras *previstas*.
- **Saldo previsto** = lucro previsto − previsão de despesas.

**Regras:**

- Uma venda só é registrada se houver estoque. Itens zerados aparecem desabilitados na lista.
- **Compra recebida** soma no estoque e recalcula o **custo médio**. Exemplo: 7 camisetas a R$ 20 + 7 a R$ 26 = custo de R$ 23.
- **Compra prevista** não mexe no estoque. Quando chegar, clique em **Chegou**.
- Financeiro e Presidência veem todas as vendas, com o lucro, e podem **cancelar** uma venda errada. O item volta para o estoque.
- Itens não são apagados: use *Desativado* para tirá-los da lista de venda sem perder o histórico.
- Para corrigir uma contagem de estoque, edite o item e preencha **Corrigir estoque**.

### Ranking (gamificação)

No Início, um cartão compacto com duas abas:

- **Vendas:** quem mais vendeu no mês (em valor; desconsidera canceladas), com a barra da **meta da equipe**. A meta fica em *Meta de vendas do mês (R$)*, na aba **Config**. Com 0, a barra some.
- **Presença:** quem mais esteve presente nos eventos internos, com a taxa de presença.
- Mostra o top 5 e a sua posição (se você estiver fora do top 5, sua linha aparece no fim). Os e-mails não aparecem.

## Eventos internos e presença (Presidência e Gestão de Pessoas)

Ficam nas abas **Eventos** e **Presenças** da planilha do Portal, criadas ao rodar *configurar*.

1. Em **Eventos internos**, clique em **+ Novo evento**: nome, data, local e descrição (opcionais).
2. Clique em **Lista de presença**. Aparecem todos os membros ativos. Marque cada um como **Presente**, **Faltou** ou **Justificou**. Clicar de novo na mesma opção limpa a marcação.
3. **Marcar todos sem registro como presentes** agiliza: marque só as faltas e as justificativas e depois use o botão.
4. Clique em **Salvar presenças**. Dá para reabrir e corrigir quando quiser.
5. **Apagar** (com confirmação) remove o evento e as presenças dele, que deixam de contar no ranking.

Cada membro vê no Início a própria contagem: presenças, faltas e justificadas. A partir de 3 faltas, o quadro fica em destaque. **Justificou** não conta como falta, mas também não conta como presença no ranking.

## Próximas funções

O portal foi montado para crescer. Cada nova função vira mais um item no menu lateral (como *Pedir reembolso*) e mais uma ação no `Code.gs`. Exemplos que encaixam bem: controle de caixa, cadastro de patrocinadores.

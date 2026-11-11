---
name: landing-page
description: Cria uma landing page (LP) estática completa, do zero, a partir do briefing de um cliente, e prepara a entrega via GitHub para o cliente apenas hospedar. Use esta skill sempre que o usuário pedir para "criar uma landing page", "fazer uma LP", "página de captura", "página de vendas", "página para campanha/tráfego pago", colar um briefing de cliente preenchido, pedir o roteiro/briefing para enviar ao cliente antes de uma LP, ou pedir para publicar/entregar uma LP no GitHub — mesmo que não use a palavra "skill".
---

# Landing Page do zero (briefing → LP → GitHub → cliente hospeda)

Gera uma LP estática (HTML + CSS + JS puro, sem build) focada em conversão de
tráfego pago, a partir do briefing do cliente. O resultado é uma pasta que
funciona em qualquer hospedagem: GitHub Pages, Vercel, Netlify, Cloudflare
Pages, Hostinger, cPanel.

Por que estático e sem framework: o cliente só vai hospedar. Não pode depender
de `npm install`, servidor ou alguém técnico do lado dele.

## Fluxo

1. **Briefing** — se o usuário ainda não tem as respostas do cliente, entregue
   `references/briefing-cliente.md` (é o roteiro que ele envia ao cliente) e pare.
2. **Validação** — com o briefing em mãos, confira os itens obrigatórios (abaixo).
   Liste de uma vez tudo o que falta; não pergunte item por item.
3. **Copy** — escreva a copy completa seguindo `references/estrutura-copy.md`.
   Mostre ao usuário para aprovação antes de montar a página quando o briefing
   for vago; se estiver completo, siga direto.
4. **Montagem** — copie `assets/template/` para a pasta do projeto e substitua
   todos os `{{PLACEHOLDERS}}`. Adapte seções: remova as que não têm conteúdo
   real (ex.: sem depoimentos → apague a seção, nunca invente).
5. **Verificação** — rode `scripts/verificar-lp.sh <pasta-da-lp>` e abra a página
   no navegador (desktop e 390px de largura) antes de dizer que está pronta.
6. **Entrega** — siga `references/publicacao.md` (repositório por cliente +
   instruções de hospedagem para o cliente).

## Itens obrigatórios do briefing

Sem estes, não monte a página — peça ao usuário:

- Nome do negócio e o que vende (produto/serviço da página)
- Objetivo único da página (ex.: lead por WhatsApp, formulário, compra)
- Público-alvo e principal dor/desejo
- Oferta e chamada para ação (o que a pessoa ganha ao clicar)
- Canal de conversão: número de WhatsApp com DDD **ou** destino do formulário
- Logo e cores da marca (ou autorização para definir)

Opcionais com padrão seguro: depoimentos (omitir seção), FAQ (escrever a partir
das objeções), imagens (usar o fundo em gradiente do template e avisar o usuário),
rastreamento (deixar bloco comentado).

## Regras de conteúdo

- **Nunca invente** depoimentos, números, selos, prêmios, CNPJ, preços ou
  resultados. Sem o dado, a seção sai ou vira texto qualitativo.
- Um único objetivo por página: todos os botões levam à mesma ação.
- Sem menu com links externos — LP de tráfego pago não dá rota de fuga.
- A promessa do título precisa bater com o anúncio que leva à página
  (pergunte qual é o anúncio/campanha quando não estiver no briefing).
- Nichos regulados (saúde, estética, finanças, jurídico): não prometer
  resultado garantido, não usar antes/depois sem o usuário confirmar que é
  permitido pelo conselho da categoria e pelas políticas do Meta/Google.
- Rodapé sempre com razão social/CNPJ (quando fornecido) e link para a política
  de privacidade; formulário sempre com aviso de consentimento (LGPD).

## Regras técnicas

- Arquivos: `index.html`, `styles.css`, `script.js`, `assets/img/`. Caminhos
  sempre relativos (`./assets/...`) para funcionar em subpasta do GitHub Pages.
- Cores e fonte da marca ficam nas variáveis CSS no topo de `styles.css`.
  Confira contraste do texto sobre a cor primária (mínimo 4.5:1).
- Imagens: WebP, hero até ~200 KB, demais até ~100 KB, com `width`/`height` e
  `alt`. `loading="lazy"` em tudo que está abaixo da primeira dobra.
- Mobile primeiro: a maior parte do tráfego pago chega pelo celular. CTA
  visível na primeira dobra em 390px.
- Preencha `<title>`, meta description, Open Graph e favicon.
- Configuração de conversão fica no objeto `CONFIG` no topo de `script.js`
  (WhatsApp, endpoint do formulário, mensagem padrão).

## Rastreamento

O template já dispara eventos no `dataLayer` (`cta_click`, `whatsapp_click`,
`generate_lead`) e repassa UTMs/`gclid`/`fbclid` para o formulário e para a
mensagem do WhatsApp.

- Com ID do GTM: preencha `{{GTM_ID}}` nos dois blocos do `index.html`. Pixel
  Meta, GA4 e Google Ads entram **dentro do GTM**, não no código.
- Sem GTM: apague os dois blocos do GTM e avise o usuário que a página está
  sem mensuração.
- Nunca coloque tokens secretos (ex.: token da API de Conversões) no código —
  o repositório vai para o cliente.

## Formulário (página estática não tem backend)

Escolha conforme o briefing e configure em `CONFIG`:

| Situação | Solução |
|---|---|
| Cliente atende por WhatsApp | Sem endpoint: o formulário abre o WhatsApp com os dados preenchidos |
| Cliente tem CRM/automação | `formEndpoint` = webhook (n8n, Make, RD Station, etc.) |
| Só quer receber por e-mail | `formEndpoint` = serviço de formulário (Formspree, Web3Forms) |

## Arquivos desta skill

- `references/briefing-cliente.md` — roteiro para enviar ao cliente
- `references/estrutura-copy.md` — estrutura de seções e como escrever cada uma
- `references/publicacao.md` — GitHub + passo a passo de hospedagem para o cliente
- `assets/template/` — modelo base da LP
- `scripts/verificar-lp.sh` — checagem antes da entrega

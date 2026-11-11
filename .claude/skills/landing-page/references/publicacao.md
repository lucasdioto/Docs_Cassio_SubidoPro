# Publicação e entrega ao cliente

## Princípio

Um repositório por cliente (`lp-nome-do-cliente`), contendo **somente** os
arquivos da LP. Nunca entregue o repositório onde ficam as skills ou materiais
internos da agência.

```
lp-nome-do-cliente/
├── index.html
├── styles.css
├── script.js
├── assets/img/
└── README.md        ← instruções de hospedagem para o cliente
```

## 1. Subir para o GitHub

Na pasta da LP:

```bash
git init -b main
git add .
git commit -m "Landing page inicial"
git remote add origin https://github.com/SEU-USUARIO/lp-nome-do-cliente.git
git push -u origin main
```

Crie o repositório antes em github.com/new (privado por padrão).
Confirme com o usuário antes de criar repositório ou fazer push.

## 2. Link de aprovação (antes de entregar)

Para o cliente aprovar vendo a página no ar, use um destes:

- **GitHub Pages** — Settings → Pages → Branch `main` / `/ (root)`. No plano
  gratuito do GitHub exige repositório público.
- **Vercel / Netlify / Cloudflare Pages** — "Import from Git", sem comando de
  build, pasta de saída = raiz. Funciona com repositório privado.

## 3. Entregar ao cliente

Escolha conforme o perfil do cliente:

| Perfil do cliente | Como entregar |
|---|---|
| Tem conta no GitHub ou alguém técnico | Settings → Transfer ownership para a conta dele (ou adicionar como colaborador) |
| Não é técnico, tem hospedagem (Hostinger, cPanel, Locaweb) | Baixar o ZIP do repositório (Code → Download ZIP) e enviar com o README |
| Não tem hospedagem | Indicar Vercel/Netlify/Cloudflare Pages (gratuitos para site estático) |

## 4. README para o cliente

Inclua no repositório da LP um `README.md` com este conteúdo, adaptado:

```markdown
# Landing Page — NOME DO CLIENTE

Site estático: não precisa de banco de dados, PHP ou instalação.
Basta colocar estes arquivos na hospedagem.

## Opção A — Hospedagem tradicional (Hostinger, cPanel, Locaweb)
1. Baixe os arquivos (botão verde "Code" → "Download ZIP") e extraia.
2. Abra o Gerenciador de Arquivos da hospedagem.
3. Envie todo o conteúdo para a pasta `public_html`
   (ou `public_html/oferta` para ficar em seudominio.com.br/oferta).
4. Acesse o endereço para conferir.

## Opção B — Vercel, Netlify ou Cloudflare Pages (gratuito)
1. Crie uma conta e escolha "Importar projeto do GitHub".
2. Selecione este repositório. Não há comando de build.
3. Em "Domínios", adicione o seu domínio e crie no seu provedor de DNS
   o registro que a plataforma indicar.

## Depois de publicar
- Ative o HTTPS (certificado SSL) na hospedagem.
- Avise a agência do endereço final para ativarmos o rastreamento e os anúncios.

## Como alterar textos
Os textos ficam em `index.html`. Número do WhatsApp e destino do
formulário ficam no início de `script.js`.
```

## 5. Checklist pós-publicação (no domínio final)

- [ ] Página abre com HTTPS, no celular e no desktop
- [ ] Botão do WhatsApp abre a conversa no número certo
- [ ] Formulário chega no destino (envie um teste real)
- [ ] GTM em modo Preview mostra `cta_click`, `whatsapp_click`, `generate_lead`
- [ ] Pixel/GA4/Google Ads recebendo os eventos
- [ ] Prévia do link (Open Graph) correta ao colar no WhatsApp
- [ ] PageSpeed Insights mobile sem imagem pesada
- [ ] URL final atualizada nos anúncios

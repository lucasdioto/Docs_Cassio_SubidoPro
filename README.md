# Skills — fonte única (VS Code + app do Claude)

Este repositório é a pasta única das skills. Tudo fica em `.claude/skills/`,
uma pasta por skill, cada uma com o seu `SKILL.md`.

```
.claude/skills/
└── landing-page/        ← cria LP do zero a partir do briefing do cliente
    ├── SKILL.md
    ├── references/      ← briefing-cliente.md, estrutura-copy.md, publicacao.md
    ├── assets/template/ ← modelo base da LP (HTML + CSS + JS)
    └── scripts/         ← verificar-lp.sh
```

## Como as duas pontas enxergam a mesma pasta

O VS Code (Claude Code) e o app do Claude guardam skills em lugares diferentes
e não se sincronizam sozinhos. A solução é este repositório ser a fonte e cada
ponta ler daqui.

### 1. VS Code / Claude Code

Abrindo este repositório no VS Code, as skills de `.claude/skills/` já carregam
sozinhas. Para tê-las em **qualquer** projeto, aponte a pasta pessoal de skills
para o clone:

macOS / Linux:

```bash
ln -s ~/caminho/do/repositorio/.claude/skills ~/.claude/skills
```

Windows (Prompt de Comando):

```bat
mklink /J "%USERPROFILE%\.claude\skills" "C:\caminho\do\repositorio\.claude\skills"
```

Se `~/.claude/skills` já existir com skills dentro, mova essas pastas para
`.claude/skills/` deste repositório antes de criar o link.

### 2. App do Claude (claude.ai / desktop)

O app recebe skills por upload de `.zip`:

```bash
scripts/empacotar-skill.sh landing-page
```

Depois, no app: Configurações → Capacidades → Skills → enviar `dist/landing-page.zip`.
No Windows sem bash: clique direito na pasta da skill → Enviar para → Pasta compactada.

Ao editar uma skill, repita o upload — o app não acompanha o Git.

### 3. Trazer para cá as skills que hoje só existem no app

`gbp-audit` e `prospeccao-dioto` foram enviadas direto ao app. Para tê-las
também no VS Code, copie as pastas originais para `.claude/skills/` e faça commit.

## Fluxo da landing page

1. Enviar ao cliente `.claude/skills/landing-page/references/briefing-cliente.md`
2. Colar as respostas + imagens no Claude e pedir: "crie a LP deste briefing"
3. Aprovar copy e página
4. Publicar em um repositório próprio do cliente (`lp-nome-do-cliente`) e
   entregar com o README de hospedagem — ver `references/publicacao.md`

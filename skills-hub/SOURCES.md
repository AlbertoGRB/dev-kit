# Skills incluídas e fontes

## Incluídas neste kit (método + curadoria, todas MIT/Apache/CC0)
- `skills/_maestro/` — orquestrador (roteia pedidos + monta o time de agentes).
- `superpowers-main/` — metodologia: brainstorming, writing-plans, TDD, git-worktrees, agentes paralelos, review, verification.
- `skills/ponytail*` — anti-over-engineering (DietrichGebert/ponytail, MIT). Always-on em quem escreve código.
- `skills/design-system-md/` — design system via DESIGN.md (formato google-labs-code/design.md, Apache-2.0).
- `skills/gstack-picks/` — papéis selecionados (garrytan/gstack, MIT): design-review, qa, ship, autoplan, review, investigate, spec, devex-review, careful, retro.

## Referências / opcionais (NÃO empacotados — baixe da fonte)
- ui-ux-pro-max — design intelligence (github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- claude-seo, Anthropic-Cybersecurity-Skills, playwright, taste-skill, awesome-claude-code, adversarial-review — buscar pelo nome no GitHub.
- ecc (affaan-m/ecc) — harness OS; usar como referência de padrões, não instalar inteiro.
- ruvnet/ruflo — swarm/RAG; opcional como MCP/plugin à la carte.
- ripienaar/free-for-dev — lista de serviços com camada gratuita (referência).

## MCPs recomendados (configurar com chave via env)
- Perplexity (busca/pesquisa web): `claude mcp add perplexity --env PERPLEXITY_API_KEY="..." -- npx -y @perplexity-ai/mcp-server`
- Context7 (docs de bibliotecas atualizadas).

Cada repo tem sua licença — verifique antes de redistribuir.

## Design & animação (referências)
- gsap/* — skills oficiais do GSAP (greensock/gsap-skills, MIT) — INCLUÍDAS.
- anime.js — lib de animação (juliangarnier/anime, MIT) — usar via npm no projeto.
- 21st.dev — registry de componentes React/Tailwind (copy-paste).
- alexpate/awesome-design-systems — design systems consolidados (referência).
- design-uplift — skill que orquestra a melhoria de design (INCLUÍDA).

## Pacote extra (referência, não incluído)
- alirezarezvani/claude-skills (MIT) — ~262 skills de engenharia, marketing, saúde (ISO 13485/MDR/FDA), segurança (ISO 27001/SOC2/GDPR) e apoio a projetos. Instalar sob demanda com `npx skills add`.

## Ferramentas e referências (não embutidas)
- claude-code-setup (Anthropic, oficial) — analisa a codebase e recomenda automações. Instalar via `/plugin` no marketplace oficial.
- thedotmack/claude-mem (Apache-2.0) — memória persistente entre sessões. Instalar: `npx claude-mem install`.
- Panniantong/Agent-Reach (MIT) — acesso web/social ao agente. CAUTELA: usa cookies/login (risco de ban); rodar em --safe com contas dedicadas.
- MODSetter/SurfSense (Apache-2.0) — app RAG self-hosted (inspiração para o JorgIA).
- three.js — 3D web; exemplos em threejs.org/examples (o stack já está no ui-ux-pro-max).

- github/spec-kit (MIT) — Spec-Driven Development oficial do GitHub (CLI `specify` + comandos `/speckit.*`). Instalar por projeto: `specify init <proj> --integration claude`. Mapeado ao nosso fluxo em PLANO-ORGANIZACAO-FLUXO-AGENTES.

- MadsLorentzen/ai-job-search (MIT) — framework de busca de emprego no Claude Code (avaliar vaga, adaptar CV, cover letter, entrevista, upskill). Instalado só o pack genérico em `skills-hub/skills/job-search/` no dev; para o fluxo completo, forke o repo.

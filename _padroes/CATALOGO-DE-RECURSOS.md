# Catálogo de Recursos Disponíveis

Índice único de tudo que o dev-kit tem à disposição — **skills instaladas**, **ferramentas/plugins**, **produtos/apps**, **bibliotecas** e **referências**. Objetivo: descobrir e usar o recurso certo quando precisar, sem integrar nada por padrão. Atualize aqui sempre que incluir algo novo.

---

## 1. Skills instaladas (no `skills-hub/skills/`, acionadas pelo `_maestro`)

| Skill | Para que | Licença |
|-------|----------|:------:|
| `_maestro` | Orquestrador: roteia intenção → skill e monta o time | — |
| `superpowers-main/*` | Método: brainstorming, writing-plans, TDD, worktrees, agentes paralelos, review | MIT |
| `ponytail` (+ `-review/-audit/-debt`) | Anti-over-engineering (always-on) | MIT |
| `gstack-picks/*` | Papéis: design-review, qa, ship, autoplan, review, investigate, spec, devex-review, careful, retro | MIT |
| `design-system-md` | Design system via DESIGN.md (tokens) | Apache-2.0 |
| `design-uplift` | Melhorar design (orquestra ui-ux-pro-max + taste + animação) | — |
| `taste/*` (inclui `image-to-code`) | Estética premium, anti-slop, image-first | MIT |
| `gsap/*` (8 skills) | Animação web (core, timeline, scrolltrigger, react, performance…) | MIT |
| `bi-charts` | BI + gráficos (escolha de visual, Python/HTML, Power BI/DAX) | — |
| `clickhouse-best-practices` | 31 regras p/ schemas/queries/config ClickHouse | Apache-2.0 |
| `task-observer` | Observa sessões e sugere melhorias/novas skills | CC BY 4.0 |
| `arz/*` (~262) | Pacote curado: engenharia, marketing, saúde (ISO 13485/MDR/FDA), segurança (ISO 27001/SOC2/GDPR), pesquisa, produto | MIT |
| `security`, `backend/*`, `performance`, `monitor`, `deploy`, `testing`, `review`, `seo`… | Domínios do hub original (ui-ux-pro-max + terceiros) | vários |

> Em caso de sobreposição, **prefira as skills núcleo** (superpowers/ponytail/nossas) às do `arz`.

## 2. Ferramentas / plugins (instalar sob demanda, na máquina)

| Recurso | O que é | Licença | Como |
|---------|---------|:------:|------|
| **github/spec-kit** | Spec-Driven Development **oficial (GitHub)**: CLI `specify` + comandos `/speckit.*` (constitution, specify, plan, tasks, implement, clarify, analyze, checklist, taskstoissues) | MIT | `uv tool install specify-cli` → `specify init <proj> --integration claude`. **Mapeia no nosso fluxo** (ver `PLANO-ORGANIZACAO-FLUXO-AGENTES.md`). Presets de compliance úteis p/ LGPD. |
| claude-code-setup (Anthropic) | Analisa a codebase e recomenda automações (hooks/skills/MCP) | Oficial | `/plugin` marketplace |
| claude-mem | Memória automática entre sessões | Apache-2.0 | `npx claude-mem install` — **redundante com o Obsidian; cuidado LGPD** |
| Agent-Reach | Acesso web/social ao agente (Twitter/Reddit/YouTube/GitHub/RSS) | MIT | `pip install agent-reach` — **CAUTELA: cookies/login, risco de ban; usar `--safe`** |
| no-mistakes | Valida numa worktree antes do push e abre PR limpo | MIT | CLI Go — gate de PR (Fase 7) |
| ruflo | Swarm/RAG/memória (meta-harness) | MIT | plugin/MCP à la carte |

## 3. Produtos / apps (referência ou self-host)

| Recurso | O que é | Licença | Uso |
|---------|---------|:------:|-----|
| SurfSense | RAG self-hosted (NotebookLM/Perplexity privado sobre seus docs) | Apache-2.0 | **Não integrar ao JorgIA.** Referência de padrões (conectores, chunking, busca híbrida, reranking) OU base de conhecimento interna turnkey se precisar. Self-host = dado interno (LGPD ok). |

## 4. Bibliotecas (dependências de projeto, via npm)

| Lib | Uso | Licença |
|-----|-----|:------:|
| GSAP | Animação web complexa (timeline/scroll) — ver skills `gsap/*` | MIT (padrão) |
| anime.js | Animação web leve (DOM/SVG) | MIT |
| Framer Motion | Animação declarativa no React (padrão web do kit) | MIT |
| three.js | 3D web — exemplos em threejs.org/examples (stack já no ui-ux-pro-max) | MIT |
| react-native-reanimated | Animação mobile (já no template Expo) | MIT |

## 5. Componentes / Design (referência)

| Recurso | O que é |
|---------|---------|
| 21st.dev | Registry de componentes React/Tailwind (copy-paste) |
| shadcn/ui | Componentes base (usados no padrão web) |
| alexpate/awesome-design-systems | Design systems consolidados (aprender/inspirar) |
| ui-ux-pro-max | Design intelligence (67 estilos, 161 paletas, 57 fontes, 25 charts) — instalado |

## 6. Listas / referências

| Recurso | O que é |
|---------|---------|
| ripienaar/free-for-dev | Serviços com camada gratuita (escolher infra) |
| crossaitools.com | Marketplace/diretório de skills e MCPs do Claude Code |
| affaan-m/ecc | Harness OS (minerar padrões de skills) |
| Conduktor docs (MCP) | Governança de Kafka (ver `PADRAO-DE-ENGENHARIA.md` §6) |

## 7. MCPs recomendados (configurar com chave via env)

| MCP | Uso |
|-----|-----|
| Perplexity | Busca/pesquisa web em tempo real (`PERPLEXITY_API_KEY`) |
| Context7 | Docs atualizadas de bibliotecas |
| Conduktor-docs | Documentação do Conduktor/Kafka |

---

*Este catálogo é o índice "onde encontrar cada coisa". Detalhes de skills de terceiros também em `skills-hub/SOURCES.md`. Nada aqui é integrado por padrão — é ativado por intenção/necessidade.*

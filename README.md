<p align="center">
  <img src="assets/banner.gif" alt="dev-kit — AI agent dev framework for web & mobile" width="100%">
</p>

# dev-kit

**Kit de desenvolvimento para Claude Code — padrões de engenharia, time de agentes em paralelo, skills curadas e template mobile pronto para a Play Store.**

![License](https://img.shields.io/badge/license-MIT-green) ![Claude Code](https://img.shields.io/badge/Claude%20Code-ready-5A67D8) ![Stack](https://img.shields.io/badge/web%20%2B%20mobile-React%20%7C%20Expo-purple) ![Backend](https://img.shields.io/badge/backend-Supabase-3ECF8E) ![Idioma](https://img.shields.io/badge/docs-pt--BR-yellow)

> Um método de trabalho repetível para criar aplicações **web e mobile** com qualidade de produção: o agente quebra o trabalho em features, escreve a spec de cada uma para você aprovar, roda vários agentes em paralelo (cópias isoladas por `git worktree`, sem conflito), testa e revisa sempre seguindo uma baseline de segurança, LGPD, performance e infraestrutura. **Sem projetos reais, sem segredos.**

---

## Índice
- [O que é](#o-que-é)
- [Princípios](#princípios)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Fluxo de trabalho (7 fases, 3 portões)](#fluxo-de-trabalho-7-fases-3-portões)
- [Time de agentes](#time-de-agentes)
- [Baseline de engenharia](#baseline-de-engenharia)
- [Skills e MCPs](#skills-e-mcps)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Como iniciar um projeto](#como-iniciar-um-projeto)
- [Web e Mobile](#web-e-mobile)
- [Documentação](#documentação)
- [Créditos e licença](#créditos-e-licença)

---

## O que é

`dev-kit` é um **framework de operação para o Claude Code** (também compatível com outros agentes que leem `CLAUDE.md`/`AGENTS.md`). Ele transforma "pedir código para a IA" num processo de engenharia: regras claras, um time de agentes especializados e skills que o orquestrador seleciona automaticamente conforme a tarefa.

A ideia central:

> **Um projeto = vários worktrees. Um worktree = uma feature = um agente = uma branch.** Os agentes não se enxergam, trabalham em cópias isoladas e só se reencontram no merge. O que impede conflito é a fronteira de arquivos definida na spec + branch isolada por worktree.

Você atua em **três portões de decisão** (aprovar spec → aprovar plano → aprovar merge). O resto — explorar a base, planejar, escrever testes, implementar, verificar — é o agente.

## Princípios

- **Spec antes de código.** Nada é implementado sem uma spec aprovada (escopo, não-escopo/limites, tier, segurança, testes, fronteira de arquivos).
- **Padrão uniforme, dimensionado por tier.** O checklist é sempre o mesmo; a resposta escala com o porte do projeto (uma landing não carrega Kafka, mas justifica por quê).
- **Segurança e LGPD como portão, não como sugestão.** Segredos nunca em commit; PII com base legal, retenção e criptografia.
- **Qualidade por padrão (ponytail).** Escrever só o necessário, sem nunca cortar segurança, validação, tratamento de erro ou acessibilidade.
- **Pesquisar o atual, não chutar.** Tecnologias e versões conferidas via MCP (Perplexity/Context7) em vez de memória.

## Estrutura do repositório

```
dev-kit/
├── CLAUDE.md            # Manual de operação — lido por todo projeto dentro do kit
├── LICENSE              # MIT
├── CREDITOS.md          # Atribuição dos componentes de terceiros
├── _padroes/            # Documentos-fonte (a "constituição" do kit)
│   ├── PADRAO-DE-ENGENHARIA.md         # Baseline: segurança, LGPD, arquitetura, testes,
│   │                                   # performance, mensageria, infra + Definition of Done
│   ├── PLANO-ORGANIZACAO-FLUXO-AGENTES.md  # O fluxo de 7 fases com worktrees e agentes paralelos
│   ├── REFERENCIA-MOBILE.md            # Golden path mobile (Expo + Supabase, offline-first)
│   ├── PUBLICACAO-PLAY-STORE.md        # Regras e checklist de publicação Android
│   ├── REVISAO-PROJETO-PLAYBOOK.md     # Auditoria ponta a ponta (read-only) de um projeto
│   └── PLANO-INCLUSAO-SKILLS.md        # Como o kit incorpora skills/MCPs de terceiros
├── _init/               # Gerador de projetos + templates
│   └── templates/expo-mobile-supabase/ # App Expo pronto (SecureStore, AAB, autoIncrement)
├── skills-hub/          # Skills + orquestrador
│   ├── skills/_maestro/                # Roteador: detecta intenção e monta o time
│   ├── skills/ponytail*                # Qualidade / anti-over-engineering (always-on)
│   ├── skills/design-system-md/        # Design system via DESIGN.md
│   ├── skills/gstack-picks/            # Papéis: design-review, qa, ship, autoplan, review...
│   ├── superpowers-main/               # Metodologia: TDD, planos, worktrees, agentes paralelos
│   └── SOURCES.md                      # Componentes de terceiros (baixar da fonte)
├── projects/            # (vazia) coloque seus projetos aqui — cada um com seu git
└── worktrees/           # (vazia) cópias isoladas por feature
```

## Fluxo de trabalho (7 fases, 3 portões)

| # | Fase | O que acontece | Portão |
|---|------|----------------|:------:|
| 0 | **Kickoff** | Explora a base, faz perguntas/provocações, sugere tech atual, levanta segurança/LGPD | — |
| 1 | **Spec por feature** | Quebra em features independentes; cada uma ganha spec com escopo, limites, tier, segurança, testes, fronteira de arquivos | ✅ aprovar specs |
| 2 | **Exploração** | Cada agente lê a codebase antes de planejar | — |
| 3 | **Plano + testes (TDD)** | Testes primeiro definem "feito = verde" | ✅ aprovar plano |
| 4 | **Worktrees** | 1 worktree + branch por feature (cópia isolada) | — |
| 5 | **Execução paralela** | Vários agentes rodam ao mesmo tempo, sem conflito | — |
| 6 | **Verificação + review** | Testes verdes + review (inclui adversarial em mudança crítica) | — |
| 7 | **Merge** | Merge ordenado, branch/worktree limpas | ✅ aprovar merge |

## Time de agentes

No kickoff, o `_maestro` monta o time conforme o tier do projeto e dispara em paralelo:

| Papel | Responsabilidade | Skills/MCP |
|-------|------------------|-----------|
| Pesquisador | Contexto, tech atual, free tiers | Perplexity MCP, Context7 |
| Arquiteto/Planejador | Quebra em features, specs | brainstorming, writing-plans, autoplan |
| Designer/UI | Design system e telas | design-system-md, ui-ux-pro-max, design-review |
| Implementador(es) | Código da feature (paralelo) | subagent-driven-development + **ponytail** |
| QA/Testes | TDD + E2E | test-driven-development, qa |
| Segurança/Compliance | OWASP, LGPD, RLS | security, review (adversarial) |
| Release/Deploy | Build, deploy, loja | deploy, ship, PUBLICACAO-PLAY-STORE |
| Guardião de qualidade | Anti-over-engineering + gate de PR | ponytail-review, ponytail-audit |

## Baseline de engenharia

Toda feature herda a baseline (detalhe em `_padroes/PADRAO-DE-ENGENHARIA.md`), dimensionada por **tier**:

| Tier | Tipo de app |
|:----:|-------------|
| T0 | Estático / landing |
| T1 | Web/mobile CRUD (1 serviço + banco) |
| T2 | Multi-serviço, tempo real, offline, integrações |
| T3 | Alta escala / eventos / IA-RAG / streaming |

Pilares: **Segurança** (segredos fora do código, authz, OWASP), **LGPD** (base legal, retenção, criptografia para dado sensível), **Arquitetura** (12-factor, contratos, idempotência), **Testes** (TDD + gate de CI), **Performance** (Web Vitals / mobile, sem N+1), **Escala/Mensageria** (RabbitMQ para tarefas, Kafka só com streaming real), **Infra** (Docker mínimo, Swarm→K8s quando justificar, backup com restore testado). Nenhuma feature fecha sem a **Definition of Done**.

## Skills e MCPs

**Incluídas:** `_maestro` (orquestrador), `superpowers` (TDD, planos, worktrees, agentes paralelos, review), `ponytail` (+ review/audit/debt), `design-system-md`, `gstack-picks` (design-review, qa, ship, autoplan, review, investigate, spec, devex-review, careful, retro).

**MCPs recomendados** (configurar com chave via env — nunca literal):

```jsonc
// .mcp.json (na raiz do projeto; mantenha no .gitignore)
{
  "mcpServers": {
    "perplexity": {
      "command": "npx",
      "args": ["-y", "@perplexity-ai/mcp-server"],
      "env": { "PERPLEXITY_API_KEY": "${PERPLEXITY_API_KEY}" }
    }
  }
}
```

**Referenciados (baixar da fonte):** ui-ux-pro-max, free-for-dev, ecc, ruflo, no-mistakes — ver `skills-hub/SOURCES.md`.

## Pré-requisitos

- [Claude Code](https://claude.com/claude-code) (ou agente compatível com `CLAUDE.md`).
- Node.js (para skills/hooks e CLIs como Expo/EAS).
- Git.
- Bun (recomendado para os apps mobile do template).

## Instalação

1. Clone o repositório onde preferir manter seus projetos.
2. Exponha as skills globalmente para o Claude Code (Windows; em macOS/Linux use symlink):
   ```powershell
   mklink /J "%USERPROFILE%\.claude\skills\dev-kit" "<caminho>\dev-kit\skills-hub\skills"
   mklink /J "%USERPROFILE%\.claude\skills\superpowers" "<caminho>\dev-kit\skills-hub\superpowers-main\skills"
   ```
3. (Opcional) Configure o MCP Perplexity:
   ```bash
   claude mcp add perplexity -s user --env PERPLEXITY_API_KEY="sua-chave" -- npx -y @perplexity-ai/mcp-server
   ```
4. (Opcional) Baixe as skills de terceiros listadas em `skills-hub/SOURCES.md`.

## Como iniciar um projeto

1. Crie a pasta do projeto em `projects/<seu-app>/` (inicialize um git próprio).
2. Abra o Claude Code nessa pasta e mande o **comando de kickoff** (no fim do `CLAUDE.md`):

```
Leia os _padroes (PADRAO-DE-ENGENHARIA, PLANO-ORGANIZACAO-FLUXO-AGENTES e, se mobile,
REFERENCIA-MOBILE) e use a skill brainstorming do superpowers.

Antes de codar: explore a base, me faça perguntas/provocações, sugira tech atual e
levante segurança/LGPD. Depois quebre em features e escreva a spec de cada uma para eu
aprovar. Não crie worktrees nem implemente até eu aprovar as specs.

Objetivo: <descreva aqui>
```

O agente para no portão das specs e espera seu OK antes de paralelizar.

## Web e Mobile

- **Web** — React + Vite + TypeScript strict + Tailwind + shadcn/ui + Supabase + TanStack Query + Zustand. Páginas lazy, `ProtectedRoute` por papel, regras de negócio puras e testáveis, RLS em todas as tabelas. Detalhe no §4 do `CLAUDE.md`.
- **Mobile** — parta de `_init/templates/expo-mobile-supabase/` (Expo + Expo Router + NativeWind + Supabase). Offline-first (outbox), guard de auth, **tokens em `expo-secure-store`**, logger estruturado. Para loja: `_padroes/PUBLICACAO-PLAY-STORE.md` (AAB, versionCode, Data Safety, exclusão de conta, crash reporting).

## Documentação

Toda a "fonte da verdade" está em [`_padroes/`](_padroes). O [`CLAUDE.md`](CLAUDE.md) é o resumo operacional lido automaticamente por cada projeto. Para auditar um projeto existente, use [`_padroes/REVISAO-PROJETO-PLAYBOOK.md`](_padroes/REVISAO-PROJETO-PLAYBOOK.md).

## Créditos e licença

Licenciado sob **MIT** — ver [`LICENSE`](LICENSE). Componentes de terceiros incluídos mantêm suas próprias licenças; atribuição em [`CREDITOS.md`](CREDITOS.md) e [`skills-hub/SOURCES.md`](skills-hub/SOURCES.md).

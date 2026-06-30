<p align="center">
  <img src="assets/banner.gif" alt="dev-kit — AI agent dev framework for web & mobile" width="100%">
</p>

<p align="center"><b>🇺🇸 English</b> · <a href="README.pt-BR.md">🇧🇷 Português</a></p>

# dev-kit

**A development kit for Claude Code — engineering standards, a team of agents running in parallel, curated skills, and a mobile template ready for the Play Store.**

![License](https://img.shields.io/badge/license-MIT-green) ![Claude Code](https://img.shields.io/badge/Claude%20Code-ready-5A67D8) ![Stack](https://img.shields.io/badge/web%20%2B%20mobile-React%20%7C%20Expo-purple) ![Backend](https://img.shields.io/badge/backend-Supabase-3ECF8E) ![Docs](https://img.shields.io/badge/docs-EN%20%7C%20pt--BR-yellow)

> A repeatable workflow to build production-grade **web and mobile** apps: the agent breaks work into features, writes a spec for each one for you to approve, runs several agents in parallel (isolated copies via `git worktree`, no conflicts), tests and reviews — always following a baseline of security, privacy (LGPD/GDPR), performance and infrastructure. **No real projects, no secrets.**

---

## Table of contents
- [What it is](#what-it-is)
- [Principles](#principles)
- [Repository structure](#repository-structure)
- [Workflow (7 phases, 3 gates)](#workflow-7-phases-3-gates)
- [Agent team](#agent-team)
- [Engineering baseline](#engineering-baseline)
- [Skills and MCPs](#skills-and-mcps)
- [Requirements](#requirements)
- [Installation](#installation)
- [Starting a project](#starting-a-project)
- [Web and Mobile](#web-and-mobile)
- [Documentation](#documentation)
- [Credits and license](#credits-and-license)

---

## What it is

`dev-kit` is an **operating framework for Claude Code** (also compatible with other agents that read `CLAUDE.md`/`AGENTS.md`). It turns "asking an AI for code" into an engineering process: clear rules, a team of specialized agents, and skills that the orchestrator selects automatically per task.

The core idea:

> **One project = many worktrees. One worktree = one feature = one agent = one branch.** Agents don't see each other, work on isolated copies, and only meet again at merge time. What prevents conflicts is the file boundary defined in the spec + an isolated branch per worktree.

You act at **three decision gates** (approve spec → approve plan → approve merge). The rest — exploring the codebase, planning, writing tests, implementing, verifying — is the agent.

## Principles

- **Spec before code.** Nothing is implemented without an approved spec (scope, non-scope/limits, tier, security, tests, file boundary).
- **Uniform standard, scaled by tier.** The checklist is always the same; the answer scales with the project size (a landing page doesn't carry Kafka — but it justifies why not).
- **Security & privacy as a gate, not a suggestion.** Secrets never in commits; PII with legal basis, retention and encryption.
- **Quality by default (ponytail).** Write only what's needed, never cutting security, validation, error handling or accessibility.
- **Research the current, don't guess.** Technologies and versions verified via MCP (Perplexity/Context7) instead of memory.

## Repository structure

```
dev-kit/
├── CLAUDE.md            # Operating manual — read by every project inside the kit
├── LICENSE              # MIT
├── CREDITOS.md          # Third-party component attribution
├── _padroes/            # Source-of-truth docs (the kit's "constitution") — kept in pt-BR
│   ├── PADRAO-DE-ENGENHARIA.md         # Baseline: security, privacy, architecture, tests,
│   │                                   # performance, messaging, infra + Definition of Done
│   ├── PLANO-ORGANIZACAO-FLUXO-AGENTES.md  # The 7-phase flow with worktrees and parallel agents
│   ├── REFERENCIA-MOBILE.md            # Mobile golden path (Expo + Supabase, offline-first)
│   ├── PUBLICACAO-PLAY-STORE.md        # Android publishing rules and checklist
│   ├── REVISAO-PROJETO-PLAYBOOK.md     # End-to-end (read-only) project audit
│   └── PLANO-INCLUSAO-SKILLS.md        # How the kit incorporates third-party skills/MCPs
├── _init/               # Project generator + templates
│   └── templates/expo-mobile-supabase/ # Ready Expo app (SecureStore, AAB, autoIncrement)
├── skills-hub/          # Skills + orchestrator
│   ├── skills/_maestro/                # Router: detects intent and assembles the team
│   ├── skills/ponytail*                # Quality / anti-over-engineering (always-on)
│   ├── skills/design-system-md/        # Design system via DESIGN.md
│   ├── skills/gstack-picks/            # Roles: design-review, qa, ship, autoplan, review...
│   ├── superpowers-main/               # Methodology: TDD, plans, worktrees, parallel agents
│   └── SOURCES.md                      # Third-party components (download from source)
├── projects/            # (empty) put your projects here — each with its own git
└── worktrees/           # (empty) isolated copies per feature
```

## Workflow (7 phases, 3 gates)

| # | Phase | What happens | Gate |
|---|-------|--------------|:----:|
| 0 | **Kickoff** | Explores the codebase, asks questions/challenges, suggests current tech, raises security/privacy | — |
| 1 | **Spec per feature** | Splits into independent features; each gets a spec with scope, limits, tier, security, tests, file boundary | ✅ approve specs |
| 2 | **Exploration** | Each agent reads the codebase before planning | — |
| 3 | **Plan + tests (TDD)** | Tests first define "done = green" | ✅ approve plan |
| 4 | **Worktrees** | 1 worktree + branch per feature (isolated copy) | — |
| 5 | **Parallel execution** | Several agents run at once, no conflicts | — |
| 6 | **Verification + review** | Green tests + review (adversarial for critical changes) | — |
| 7 | **Merge** | Ordered merge, clean branches/worktrees | ✅ approve merge |

## Agent team

At kickoff, `_maestro` assembles the team based on the project tier and runs them in parallel:

| Role | Responsibility | Skills/MCP |
|------|----------------|-----------|
| Researcher | Context, current tech, free tiers | Perplexity MCP, Context7 |
| Architect/Planner | Splits into features, specs | brainstorming, writing-plans, autoplan |
| Designer/UI | Design system and screens | design-system-md, ui-ux-pro-max, design-review |
| Implementer(s) | Feature code (parallel) | subagent-driven-development + **ponytail** |
| QA/Tests | TDD + E2E | test-driven-development, qa |
| Security/Compliance | OWASP, privacy, RLS | security, review (adversarial) |
| Release/Deploy | Build, deploy, store | deploy, ship, PUBLICACAO-PLAY-STORE |
| Quality guardian | Anti-over-engineering + PR gate | ponytail-review, ponytail-audit |

## Engineering baseline

Every feature inherits the baseline (detail in `_padroes/PADRAO-DE-ENGENHARIA.md`), scaled by **tier**:

| Tier | App type |
|:----:|----------|
| T0 | Static / landing |
| T1 | Web/mobile CRUD (1 service + database) |
| T2 | Multi-service, real-time, offline, integrations |
| T3 | High scale / events / AI-RAG / streaming |

Pillars: **Security** (secrets out of code, authz, OWASP), **Privacy** (legal basis, retention, encryption for sensitive data), **Architecture** (12-factor, contracts, idempotency), **Tests** (TDD + CI gate), **Performance** (Web Vitals / mobile, no N+1), **Scale/Messaging** (RabbitMQ for tasks, Kafka only for real streaming), **Infra** (minimal Docker, Swarm→K8s when justified, backups with tested restore). No feature ships without the **Definition of Done**.

## Skills and MCPs

**Included:** `_maestro` (orchestrator), `superpowers` (TDD, plans, worktrees, parallel agents, review), `ponytail` (+ review/audit/debt), `design-system-md`, `gstack-picks` (design-review, qa, ship, autoplan, review, investigate, spec, devex-review, careful, retro).

**Recommended MCPs** (configure the key via env — never literal):

```jsonc
// .mcp.json (at the project root; keep it in .gitignore)
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

**Referenced (download from source):** ui-ux-pro-max, free-for-dev, ecc, ruflo, no-mistakes — see `skills-hub/SOURCES.md`.

## Requirements

- [Claude Code](https://claude.com/claude-code) (or an agent compatible with `CLAUDE.md`).
- Node.js (for skills/hooks and CLIs like Expo/EAS).
- Git.
- Bun (recommended for the template's mobile apps).

## Installation

1. Clone the repository wherever you keep your projects.
2. Expose the skills globally to Claude Code (Windows; use a symlink on macOS/Linux):
   ```powershell
   mklink /J "%USERPROFILE%\.claude\skills\dev-kit" "<path>\dev-kit\skills-hub\skills"
   mklink /J "%USERPROFILE%\.claude\skills\superpowers" "<path>\dev-kit\skills-hub\superpowers-main\skills"
   ```
3. (Optional) Configure the Perplexity MCP:
   ```bash
   claude mcp add perplexity -s user --env PERPLEXITY_API_KEY="your-key" -- npx -y @perplexity-ai/mcp-server
   ```
4. (Optional) Download the third-party skills listed in `skills-hub/SOURCES.md`.

## Starting a project

1. Create the project folder in `projects/<your-app>/` (initialize its own git).
2. Open Claude Code in that folder and send the **kickoff command** (at the end of `CLAUDE.md`):

```
Read the _padroes (PADRAO-DE-ENGENHARIA, PLANO-ORGANIZACAO-FLUXO-AGENTES and, if mobile,
REFERENCIA-MOBILE) and use the superpowers brainstorming skill.

Before coding: explore the codebase, ask me questions/challenges, suggest current tech and
raise security/privacy concerns. Then split into features and write the spec for each one
for me to approve. Don't create worktrees or implement until I approve the specs.

Goal: <describe here>
```

The agent stops at the spec gate and waits for your OK before parallelizing.

> The operating docs are written in pt-BR (the agent's working language); the kickoff prompt works in any language.

## Web and Mobile

- **Web** — React + Vite + TypeScript strict + Tailwind + shadcn/ui + Supabase + TanStack Query + Zustand. Lazy pages, role-based `ProtectedRoute`, pure and testable business logic, RLS on every table. Details in §4 of `CLAUDE.md`.
- **Mobile** — start from `_init/templates/expo-mobile-supabase/` (Expo + Expo Router + NativeWind + Supabase). Offline-first (outbox), auth guard, **tokens in `expo-secure-store`**, structured logger. For the store: `_padroes/PUBLICACAO-PLAY-STORE.md` (AAB, versionCode, Data Safety, account deletion, crash reporting).

## Documentation

The full "source of truth" lives in [`_padroes/`](_padroes) (in pt-BR). [`CLAUDE.md`](CLAUDE.md) is the operating summary read automatically by each project. To audit an existing project, use [`_padroes/REVISAO-PROJETO-PLAYBOOK.md`](_padroes/REVISAO-PROJETO-PLAYBOOK.md).

## Credits and license

Licensed under **MIT** — see [`LICENSE`](LICENSE). Bundled third-party components keep their own licenses; attribution in [`CREDITOS.md`](CREDITOS.md) and [`skills-hub/SOURCES.md`](skills-hub/SOURCES.md).

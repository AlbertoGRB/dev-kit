# Governança de Skills (precedência anti-sobreposição)

**Companheiro de** `CLAUDE.md` e `CATALOGO-DE-RECURSOS.md`. Vale para o `_maestro` e para qualquer agente. Objetivo: com **muitas skills** disponíveis (várias com funções parecidas), garantir que **nunca haja orientação conflitante** e que **nada danifique o projeto**. Mais skills ≠ melhor — o que vale é precedência clara.

## Regra de ouro
Em qualquer sobreposição: **Tier A > Tier B > Tier C**. Se duas skills discordam, vence a de tier mais alto; persistindo dúvida, vale o que está nos **`_padroes/`** (fonte da verdade). Nunca misturar orientações conflitantes de skills diferentes na mesma tarefa.

---

## Tiers

### Tier A — Núcleo (autoridade; sempre preferir)
Método e qualidade. São a espinha dorsal:
- `_maestro` (roteador) · `superpowers/*` (brainstorming, writing-plans, subagent-driven-development, dispatching-parallel-agents, executing-plans, test-driven-development, systematic-debugging, using-git-worktrees, finishing-a-development-branch, requesting/receiving-code-review, verification-before-completion)
- `ponytail` (+ `-review/-audit`) — qualidade always-on
- `review` (adversarial) — revisão crítica
- Os documentos `_padroes/*` (baseline, fluxo, convenção, referência mobile, publicação).

### Tier B — Complementar (usar quando o Tier A não cobre a capacidade específica)
- Design: `ui-ux-pro-max`, `design-system-md`, `taste/*` (inclui `image-to-code`), `design-uplift`, `gsap/*`
- Dados/BI: `bi-charts`, `clickhouse-best-practices`
- Papéis: `gstack-picks/*` (design-review, qa, ship, autoplan, devex-review, retro, careful, investigate, spec)
- Domínios do hub: `backend/*`, `security`, `seo`, `deploy`, `monitor`, `performance`, `testing`
- SDD formal: **spec-kit** (ferramenta oficial; formaliza spec/plan/tasks — mapeada ao nosso fluxo)

### Tier C — Sob demanda / referência (só quando explicitamente útil; nunca por padrão)
- `arz/*` (~262 skills de terceiros) — engenharia, marketing, saúde, segurança, produto
- `task-observer` (auto-melhoria; roda em background, não decide arquitetura)
- Ferramentas/apps do `CATALOGO-DE-RECURSOS.md` (claude-mem, SurfSense, Agent-Reach, no-mistakes…)

---

## Mapa de sobreposição → skill canônica
Para cada capacidade, **use a canônica**; as "sobrepostas" só entram se a canônica não existir/servir.

| Capacidade | Canônica (usar) | Sobrepostas (evitar/fallback) |
|-----------|-----------------|-------------------------------|
| Planejar / escrever spec | `superpowers/writing-plans` (+ **spec-kit** p/ formalizar) | `gstack-picks/spec`, `arz/spec-driven-workflow`, `arz/code-to-prd` |
| TDD / testes | `superpowers/test-driven-development` | `arz/tdd-guide`, `arz/tdd` |
| E2E / QA | `testing` (Playwright) + `gstack-picks/qa` | `arz/senior-qa`, `arz/playwright-pro/*` |
| Code review | `superpowers/requesting-code-review` + `review` (adversarial) | `gstack-picks/review`, `arz/pr-review-expert`, `arz/code-reviewer`, `arz/adversarial-reviewer` |
| Worktrees / paralelo | `superpowers/using-git-worktrees` + `dispatching-parallel-agents` | `arz/git-worktree-manager`, `arz/agenthub`, `arz/agent-harness` |
| Debug | `superpowers/systematic-debugging` | `arz/focused-fix`, `arz/zero-hallucination-coder` |
| Qualidade / YAGNI | `ponytail` | `arz/minimalist`, `arz/caveman` |
| Design / UI | `design-uplift` → `ui-ux-pro-max` + `design-system-md` + `taste/*` | `arz/ui-design-system`, `arz/design-system` |
| Acessibilidade | `design-review` (a11y) | `arz/a11y-audit` |
| BI / gráficos | `bi-charts` | — |
| SEO | `seo` (hub) | `arz/*` (seo-audit, programmatic-seo…) |
| Segurança (revisão) | `security` (hub) + `PADRAO §1` | `arz/security-guidance`, `arz/senior-security`, `arz/red-team` |

### Capacidades onde o **canônico vem do Tier B/C** (não temos núcleo dedicado)
Aqui a skill de terceiros **é** a canônica:
- Docker/K8s/Helm → `arz/docker-development`, `arz/kubernetes-operator`, `arz/helm-chart-builder`
- Schema de banco / ERD → `arz/database-schema-designer` (ignore o duplicado `arz/database-designer`)
- Observabilidade (SLI/SLO) → `arz/observability-designer`
- CI/CD gerado → `arz/ci-cd-pipeline-builder`
- Segredos/Vault → `arz/secrets-vault-manager`
- Stripe / Terraform / Snowflake / RAG → `arz/stripe-integration-expert`, `arz/terraform-patterns`, `arz/snowflake-development`, `arz/rag-architect`
- ClickHouse → `clickhouse-best-practices`

---

## Regra de segurança (o "não danificar o projeto")
1. **Nenhuma skill altera o projeto fora do fluxo com portões** (kickoff → spec aprovada → worktree → PR). Skills que "aconselham" não escrevem código nem movem arquivos por conta própria.
2. **Operações destrutivas ou de risco** (mover/apagar em massa, migrations, deploy, mudança de infra, reescrita estrutural) **exigem aprovação explícita** — nunca automáticas.
3. **Tier C nunca roda por padrão** — só quando a intenção for clara e a canônica não cobrir.
4. **Convenção de estrutura e nomes** (`CONVENCAO-ESTRUTURA-E-NOMES.md`) prevalece sobre qualquer scaffolder de skill (ex.: `saas-scaffolder`, `init`).
5. Em conflito de guidance, **pare e pergunte** em vez de escolher no escuro.

---

## Como o `_maestro` aplica
Ao rotear: detecta a capacidade → escolhe a **canônica** do mapa acima (respeitando os tiers) → só cai para a sobreposta se a canônica não existir. Na montagem do time de agentes, os papéis vêm do Tier A/B; o `arz` entra apenas como especialista pontual quando pedido.

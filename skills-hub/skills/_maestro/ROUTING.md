# Routing Reference

> **PRECEDÊNCIA (ver `_padroes/GOVERNANCA-DE-SKILLS.md`):** em sobreposição, **Tier A** (superpowers, ponytail, review + `_padroes`) > **Tier B** (ui-ux-pro-max, design-system-md, taste, gsap, bi-charts, clickhouse, gstack-picks, domínios do hub, spec-kit) > **Tier C** (`arz/*`, task-observer, ferramentas do catálogo). Use a skill **canônica** de cada capacidade; terceiros só quando a canônica não cobre. **Nenhuma skill altera o projeto fora do fluxo com portões** (spec→worktree→PR); operação destrutiva exige aprovação.

## Domain Keywords (for auto-detection)

### design
style, color, palette, font, typography, chart, graph, landing, product type,
glassmorphism, minimalism, brutalism, neumorphism, dark mode, design system,
tokens, components, spacing, layout, brand, logo, icon, banner, slides,
presentation, shadcn, tailwind, UI, UX, accessibility, WCAG,
card news, instagram card, landing page, frontend design, canvas design,
hero section, CTA, conversion, above-fold

### taste
premium, anti-slop, high-end, agency, editorial, soft, calm, luxury,
brutalist, industrial, redesign, upgrade, image-to-code, mockup,
force output, no placeholders, complete code, brandkit, brand kit,
stitch, combine screens, multi-screen, design handoff

### workflow
plan, brainstorm, TDD, test-driven, debug, fix bug, investigate,
subagent, parallel, worktree, branch, merge, PR, code review,
execute, implement, verify, ship

### review
review code, adversarial, debate, cross-validate, multi-agent review,
quality assurance, code quality

### seo
SEO, search engine, meta tags, schema, sitemap, robots.txt, backlinks,
PageSpeed, Core Web Vitals, E-E-A-T, hreflang, local SEO, GBP,
Google Search Console, AI search, GEO, semantic clustering

### scaffold
init, scaffold, create project, new project, boilerplate,
Next.js, Flutter, starter, template

### testing
test, E2E, end-to-end, Playwright, QA, browser test, integration test,
regression, smoke test, visual test

### docs
document, Word, Excel, PDF, PowerPoint, spreadsheet, report,
DOCX, XLSX, PPTX

### tools
search web, web search, DuckDuckGo, convert to markdown,
workthrough, document progress, codex loop, remove logo,
logo remover, MCP server, build MCP, create skill, skill creator

### deploy
deploy, ship, publish, host, Vercel, Netlify, Fly.io, Railway,
Cloudflare Pages, Docker, CI/CD, pipeline, GitHub Actions,
rollback, preview deployment, domain, DNS, SSL, HTTPS,
blue-green, canary deployment, zero-downtime

### performance
performance, slow, Core Web Vitals, LCP, INP, CLS, Lighthouse,
bundle size, page speed, load time, TTFB, lazy load, code splitting,
image optimization, font loading, caching, CDN, WebP, AVIF,
tree shaking, minification, compression

### monitor
monitor, uptime, health check, alert, error tracking, logging,
Sentry, Grafana, Prometheus, Datadog, PagerDuty, UptimeRobot,
observability, APM, metrics, tracing, SLA, incident detection,
post-deploy, canary, synthetic monitoring

### backend
supabase, database, auth, edge functions, realtime, storage, vectors,
API design, REST, GraphQL, tRPC, endpoint, HTTP methods, status codes,
pagination, rate limiting, JWT, OAuth, OpenAPI, swagger,
cron, queues, supabase-js, @supabase/ssr, RLS, row level security,
migration, schema change, pg_vector, pg_cron, pg_graphql,
postgres, query optimization, connection pooling, index, slow query,
EXPLAIN, schema design, PgBouncer, Supavisor, JWT, getSession, getUser

### security
security, vulnerability, CVE, OWASP, XSS, SQL injection, CSRF, SSRF,
pentest, penetration test, exploit, privilege escalation, lateral movement,
malware, reverse engineering, YARA, sandbox, forensics, disk image, memory dump,
threat hunting, IOC, anomaly, SIEM, SOC, alert triage, detection,
cloud security, AWS, Azure, GCP, misconfiguration, IAM,
Active Directory, Kerberos, OAuth, MFA,
incident response, breach, containment, eradication,
red team, blue team, C2, evasion,
MITRE ATT&CK, NIST CSF, ATLAS, D3FEND,
container, Docker, Kubernetes, pod security,
API security, rate limiting, broken access control,
phishing, email security, spoofing,
ransomware, encryption attack,
SCADA, ICS, OT, industrial control,
network security, packet analysis, Wireshark, IDS, IPS, firewall,
CTI, STIX, TAXII, APT, threat feed

### quality (ponytail)
over-engineering, over-engineered, YAGNI, simplify, simplificar, less code,
menos código, minimal, mínimo, remove code, deletar, technical debt, dívida técnica,
refactor to less, code review for bloat, ponytail, lazy senior, escrever o mínimo

### design-system (design.md)
DESIGN.md, design tokens, design system file, fonte única de design,
identidade visual, tokens cross-platform, tailwind tokens, DTCG, designmd,
consistência visual web e mobile

### roles (gstack-picks)
design-review, qa, qa-only, ship, autoplan, devex-review, careful mode,
retro, retrospective, investigate, spec, code review por papel, time de papéis,
revisão de design, garantir qualidade antes de ship

### research (Perplexity MCP)
pesquisa web, busca em tempo real, perplexity, deep research, pesquisa profunda,
informação atual, última versão, estado da arte, comparar ferramentas no mercado

---

## Time de Agentes (montar no kickoff, rodar em paralelo)

O Maestro seleciona os papéis conforme o tier do projeto e dispara em worktrees (1 por feature):

| Papel | Skills/MCP |
|-------|-----------|
| Pesquisador | Perplexity MCP, Context7, free-for-dev (ref) |
| Arquiteto/Planejador | brainstorming, writing-plans, autoplan |
| Designer/UI | design-system-md, ui-ux-pro-max, taste, design-review |
| Implementador (paralelo) | subagent-driven-development + **ponytail** (always-on) + skills do stack |
| QA/Testes | test-driven-development, playwright, qa |
| Segurança/Compliance | security, review (adversarial) |
| Release/Deploy | deploy, monitor, ship, PUBLICACAO-PLAY-STORE (mobile) |
| Guardião de qualidade | ponytail-review, ponytail-audit, devex-review |

Regra: **ponytail é always-on** em todo agente que escreve código (escrever só o necessário, sem cortar segurança/validação/a11y). Detalhe do plano: `_padroes/PLANO-INCLUSAO-SKILLS.md`.

### design-uplift + animacao (gsap/anime)
melhorar design, deixar bonito, premium, moderno, modernizar UI, cara melhor, profissional,
animacao, animation, microinteração, transição, scroll animation, scrolltrigger, GSAP, gsap,
anime.js, animejs, motion, parallax, hover effect, design uplift, redesenho visual

### clickhouse (clickhouse-best-practices)
ClickHouse, columnar, colunar, OLAP, MergeTree, ReplacingMergeTree, materialized view,
analytics database, banco analítico, query lenta clickhouse, particionamento, ORDER BY key,
sharding, TTL, compressão de coluna, clickstack, chdb

### task-observer (auto-melhoria)
observar sessão, detectar padrão, melhorar skills, auto-melhoria, task observer,
skill improvement, aprender com correções, capturar padrões de trabalho
(skill de rebelytics/one-skill-to-rule-them-all, CC BY 4.0)

### spec-kit (Spec-Driven Development oficial)
spec-driven, SDD, especificacao antes do codigo, spec-kit, specify, /speckit, constitution,
speckit specify/plan/tasks/implement, clarify, checklist de spec, artefatos de spec,
rastreabilidade de requisitos, converter tasks em issues

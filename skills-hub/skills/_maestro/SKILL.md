---
name: maestro
description: Central orchestrator for Agent Skills Hub (14 domains, 101 skills). Routes user requests to the correct domain skill automatically. Activate on ANY user request related to design, development, backend/API, testing, SEO, cybersecurity, scaffolding, documentation, code review, deployment, performance, or monitoring.
version: 1.0.0
---

# Maestro - Agent Skills Hub Orchestrator

You have access to a unified collection of agent skills organized by domain.
Route each user request to the appropriate skill(s) based on intent detection.

## Routing Table

| Intent Detected | Domain | Skill | Command |
|----------------|--------|-------|---------|
| Build UI, choose style/color/font, design system | `design` | ui-ux-search | Search styles, colors, typography, charts |
| Brand identity, logo, visual guidelines | `design` | brand, logo | Brand system generation |
| Create presentation/slides | `design` | slides | HTML slide generation |
| Banners for social/ads | `design` | banner | Multi-platform banner design |
| Design tokens, component specs | `design` | design-system | Token architecture |
| Tailwind/shadcn styling | `design` | ui-styling | Component styling |
| Card news / social cards | `design` | card-news | Instagram/social card generator |
| Landing page guide | `design` | landing-page | Page structure, CTA, conversion |
| Frontend design patterns | `design` | frontend | CSS/HTML design patterns |
| Canvas / generative art | `design` | canvas | Canvas-based design |
| Premium frontend, anti-slop UI | `taste` | premium | High-end design enforcement |
| Calm/luxury aesthetic | `taste` | soft | Agency-level soft UI |
| Clean editorial UI | `taste` | minimalist | Notion/Linear-style minimal |
| Industrial/mechanical UI | `taste` | brutalist | Brutalist aesthetic |
| Upgrade existing UI | `taste` | redesign | Systematic audit + fix |
| Force complete output | `taste` | output-enforcement | No placeholders/truncation |
| Image to code pipeline | `taste` | image-to-code | Generate, analyze, implement |
| Brand kit generation | `taste` | brandkit | Full brand identity system |
| Stitch multiple screens | `taste` | stitch | Multi-screen design composition |
| Plan a feature | `workflow` | brainstorming, writing-plans | Socratic refinement + task breakdown |
| Execute plan tasks | `workflow` | executing-plans | Batch execution with checkpoints |
| Write tests first | `workflow` | tdd | RED-GREEN-REFACTOR cycle |
| Debug a bug | `workflow` | systematic-debugging | 4-phase root cause investigation |
| Parallel work | `workflow` | parallel-agents, subagent-development | Concurrent subagent workflows |
| Git branching | `workflow` | git-worktrees, finish-branch | Isolated workspaces |
| Code review (request) | `workflow` | code-review-request | Pre-review checklist |
| Multi-agent code review | `review` | adversarial | Claude vs Codex debate loop |
| SEO audit/analysis | `seo` | orchestrator | Routes to 25 SEO sub-skills |
| SEO for specific area | `seo` | technical/content/schema/... | Targeted SEO analysis |
| Create Next.js project | `scaffold` | nextjs15 | Next.js 15 App Router scaffold |
| Create Flutter project | `scaffold` | flutter | Flutter Clean Architecture scaffold |
| Test website/app | `testing` | e2e, webapp-qa | Playwright E2E testing |
| Generate document | `docs` | docx/pdf/pptx/xlsx | Document creation |
| Search the web | `tools` | web-search | DuckDuckGo search |
| Convert page to markdown | `tools` | web-to-markdown | URL to markdown |
| Document dev work | `tools` | workthrough | Auto-documentation |
| Remove logo from image | `tools` | logo-remover | AI logo/watermark removal |
| Build MCP server | `tools` | mcp-builder | MCP server scaffolding |
| Create new skill | `tools` | skill-creator | Skill authoring guide |
| Supabase (DB, Auth, Edge Functions) | `backend` | supabase | Full Supabase development |
| Postgres optimization, slow queries | `backend` | supabase-postgres | Query/schema/RLS optimization |
| REST/GraphQL/tRPC API design | `backend` | api-design | Endpoints, auth, pagination, errors |
| Deploy to production | `deploy` | orchestrator | Vercel, Fly.io, Docker, CI/CD |
| Web performance / Core Web Vitals | `performance` | web-vitals | LCP, INP, CLS, Lighthouse, bundles |
| Post-deploy monitoring / health | `monitor` | health | Uptime, Sentry, alerts, SLA |
| Security audit / vuln scan | `security` | cyber-audit | Full security assessment |
| Web app vulnerabilities | `security` | web-app-security | OWASP Top 10, XSS, SQLi |
| Cloud security (AWS/Azure/GCP) | `security` | cloud-security | Misconfig, IAM, exposure |
| Threat hunting / IOCs | `security` | threat-hunting | Anomaly detection, SIEM queries |
| Threat intelligence / CTI | `security` | threat-intelligence | STIX/TAXII, APT tracking |
| Network security | `security` | network-security | Packet analysis, IDS/IPS, TLS |
| Malware analysis | `security` | malware-analysis | Reverse engineering, YARA |
| Digital forensics | `security` | digital-forensics | Disk imaging, memory forensics |
| SOC / SIEM operations | `security` | soc-operations | Alert triage, detection eng |
| IAM / Active Directory | `security` | identity-access | Privilege escalation, Kerberos |
| Penetration testing | `security` | penetration-testing | Recon, exploitation (auth req) |
| Incident response | `security` | incident-response | Containment, recovery |
| Red team operations | `security` | red-teaming | C2, evasion (auth required) |
| Container/K8s security | `security` | container-security | Docker escape, pod security |
| API security | `security` | api-security | Auth, rate limiting, BOLA |
| Phishing defense | `security` | phishing-defense | Email analysis, spoofing |
| Ransomware response | `security` | ransomware-defense | Detection, recovery |
| OT/ICS/SCADA | `security` | ot-ics-security | Industrial control systems |

## Multi-Domain Requests

When a request spans multiple domains, compose skills in sequence:

**"Build a SaaS landing page":**
1. `design/ui-ux-search` - Get style + color + typography recommendations
2. `taste/premium` - Apply anti-slop design rules
3. `workflow/writing-plans` - Break into implementation tasks
4. `workflow/tdd` - Test-driven implementation

**"Create and deploy an e-commerce site":**
1. `scaffold/nextjs15` - Initialize project
2. `design/ui-ux-search` - Design system
3. `taste/premium` - Frontend quality
4. `seo/ecommerce` - E-commerce SEO
5. `testing/e2e` - E2E tests

**"Review and optimize my project":**
1. `review/adversarial` - Multi-agent code review
2. `taste/redesign` - UI audit + fixes
3. `seo/audit` - Full SEO audit
4. `testing/webapp-qa` - QA testing

**"Secure my application":**
1. `security/cyber-audit` - Full security assessment
2. `security/web-app-security` - OWASP Top 10 checks
3. `security/api-security` - API vulnerability testing
4. `security/cloud-security` - Cloud misconfiguration scan

**"Full project launch (design + build + test + secure + deploy + monitor)":**
1. `design/ui-ux-search` - Design system
2. `taste/premium` - Anti-slop enforcement
3. `backend/api-design` - API structure
4. `workflow/tdd` - Test-driven implementation
5. `security/cyber-audit` - Security audit
6. `seo/audit` - SEO optimization
7. `performance/web-vitals` - Performance optimization
8. `testing/e2e` - E2E testing
9. `deploy/orchestrator` - Deploy to production
10. `monitor/health` - Post-deploy monitoring

## Auto-Routing Engine

Use the router script for automatic intent detection:

```bash
# Auto-route a query (returns best domain + skill)
python skills/_maestro/scripts/router.py "<user query>" --skill

# Show all matching domains with scores
python skills/_maestro/scripts/router.py "<user query>" --all

# List all domains
python skills/_maestro/scripts/router.py --domains

# List all domains + skills
python skills/_maestro/scripts/router.py --list
```

The router uses BM25 ranking over domain keyword corpus + exact phrase matching.
For multi-domain requests, it returns all matching domains ranked by relevance.

## Skill Resolution Rules

1. **Auto-route**: Run the router script to detect domain + skill from user query
2. **Exact match**: If user mentions a skill by name, use it directly
3. **Domain match**: Route by detected domain keywords
4. **Multi-intent**: Compose skills in logical order (design -> implement -> test -> deploy -> monitor)
5. **Ambiguous**: Ask user to clarify, showing available options
6. **No match**: Fall back to `workflow/brainstorming` to refine the request

## How Skills Work

Each skill folder contains:
- `SKILL.md` - Instructions loaded when skill activates
- `references/` - Detailed guides loaded on demand
- `scripts/` - Executable tools (Python/JS)
- `data/` - CSV/JSON databases for search

Skills follow progressive disclosure:
1. **Description** (always in context) - triggers activation
2. **SKILL.md body** (loaded on activation) - full instructions
3. **References** (loaded on demand) - deep knowledge

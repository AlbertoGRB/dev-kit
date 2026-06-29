# CLAUDE.md — Manual de Operação (dev/)

Este arquivo vale para **todos os projetos** dentro de `dev/`. O Claude Code lê os `CLAUDE.md` subindo a árvore, então qualquer projeto em `dev/projects/<x>/` herda estas regras automaticamente. O `CLAUDE.md` específico de cada projeto complementa (não substitui) este.

Idioma: **pt-BR** em código, comentários e conversa. Respostas diretas e técnicas.

---

## 0. Leitura obrigatória no início da sessão

Antes de planejar qualquer coisa, leia (caminhos relativos a `dev/`):

1. `_padroes/PADRAO-DE-ENGENHARIA.md` — baseline inegociável (segurança, LGPD, arquitetura, testes, performance, escala/mensageria, infra). Define a *Definition of Done*.
2. `_padroes/PLANO-ORGANIZACAO-FLUXO-AGENTES.md` — o fluxo de agentes (kickoff → spec → worktrees → execução paralela → review → merge).
3. `_padroes/REFERENCIA-MOBILE.md` — golden path para apps mobile (ler só em projeto mobile).
4. `_padroes/PUBLICACAO-PLAY-STORE.md` — regras + checklist de loja (ler em app mobile que vai para a Play Store).

Esses documentos são a **fonte da verdade**. Este CLAUDE.md é o resumo operacional; em caso de dúvida, vale o que está nos `_padroes`.

---

## 1. Estrutura

```
dev/
  skills-hub/     # skills (_maestro, superpowers, ui-ux-pro-max...) — não é projeto
  projects/<x>/   # cada app/projeto, um git próprio
  worktrees/<x>/  # cópias isoladas por feature (efêmeras)
  _init/          # gerador + templates (expo-mobile-supabase)
  _padroes/       # documentos-fonte
  _archive/       # backups pesados (fora do git)
```

---

## 2. Fluxo obrigatório (nunca pule os portões)

Toda criação/reorganização de projeto segue 7 fases. **3 são portões do você** — pare e espere aprovação:

| Fase | Ação | Skill (skills-hub) | Portão |
|---|---|---|:--:|
| 0 | Kickoff: explorar a base, **fazer perguntas/provocações**, sugerir tech atual, levantar segurança/LGPD | `superpowers-main/skills/brainstorming` | — |
| 1 | Quebrar em features; escrever **spec por feature** (escopo, não-escopo/limites, tier, segurança, testes, fronteira de arquivos) | `superpowers-main/skills/writing-plans` | ✅ aprovar specs |
| 2 | Cada agente explora a codebase | `subagent-driven-development` | — |
| 3 | Plano + **testes primeiro (TDD)** | `test-driven-development` | ✅ aprovar plano |
| 4 | 1 worktree + branch por feature (`worktrees/<proj>/feat-x`) | `using-git-worktrees` | — |
| 5 | Agentes paralelos executam (não se enxergam, sem conflito) | `dispatching-parallel-agents` + `executing-plans` | — |
| 6 | Verificação (testes verdes) + review | `verification-before-completion` + `review` | — |
| 7 | Merge ordenado, branch/worktree limpas | `finishing-a-development-branch` | ✅ aprovar merge |

**Anti-conflito:** paralelize só features que não escrevem nos mesmos arquivos; o resto é sequência com dependência declarada na spec. Contratos (assinaturas/schemas) entre features são congelados na spec antes de paralelizar.

**Regras de conduta no kickoff:** mínimo 3–5 perguntas para reduzir ambiguidade; apresentar ≥2 abordagens com trade-offs; sugerir tecnologias atuais (checar versões via Context7 MCP); apontar riscos; confirmar o que está fora de escopo. **Você nunca programa sem spec aprovada.**

---

## 3. Baseline inegociável (resumo — detalhe em _padroes)

- **Tier por projeto:** T0 estático/landing · T1 CRUD 1 serviço · T2 multi-serviço/offline/integrações · T3 alta escala/eventos/RAG. O agente sugere, o você confirma.
- **Segurança:** segredos só em env/cofre (nunca em commit/log); authz em todo endpoint; input validado; OWASP; dependências escaneadas. **Tokens de auth em HTTP-only cookies — NUNCA em localStorage/sessionStorage.** Autenticação via endpoint server-side (Edge Function / SSR middleware) que retorna `Set-Cookie: HttpOnly, Secure, SameSite=Lax`. Para Supabase+SPA, usar Edge Functions de auth proxy; para SSR, `@supabase/ssr`; para mobile, `expo-secure-store`.
- **LGPD (crítico — organização com dado sensível):** dado de saúde é sensível. Toda feature que toca PII declara base legal, retenção, criptografia, trilha de auditoria. Cuidado ao enviar PII a LLM.
- **Testes:** TDD, gate de CI (PR não passa com teste vermelho).
- **Performance:** Web Vitals (web) / perf mobile; sem N+1; cache.
- **Escala/mensageria:** stateless + assíncrono quando pesado. RabbitMQ para tarefas; Kafka só com streaming real (Conduktor docs via MCP).
- **Infra:** Docker mínimo/não-root; Swarm hoje, K8s/Helm só quando justificar; backup com restore testado; IaC versionada.
- **Definition of Done:** ver §9 do `PADRAO-DE-ENGENHARIA.md`. Nenhuma feature fecha sem ela.

---

## 4. Playbook — criar APP WEB

**Stack de referência (do AppExemplo web):** React 18 + Vite + TypeScript strict + Tailwind + shadcn/ui + Supabase + TanStack Query + Zustand + React Hook Form + Zod. Deploy Vercel.

Padrões obrigatórios:
- Alias `@/*` → `./src/*`; páginas lazy (`React.lazy`).
- `authStore` (Zustand) com `initialized`; `ProtectedRoute` com `requiredRole` (ADMIN>MANAGER>SELLER).
- Hooks de dados via TanStack Query; **toda** query depende de auth inicializada (RLS bloqueia em silêncio sem token).
- Regras de negócio em funções **puras** isoladas (`src/lib/`), consumindo config do banco — testáveis.
- RLS em todas as tabelas; só anon-key no front; `service_role` só em Edge Functions.
- Estrutura: `src/{pages,components/ui,components/layout,hooks,stores,lib,types,routes}`.

Tier típico: T1–T2. Exemplo vivo: `projects/AppExemplo/` (raiz web).

---

## 5. Playbook — criar APP MOBILE

**Sempre partir do template** `_init/templates/expo-mobile-supabase/` — não começar do zero. Stack: Expo ~54 + Expo Router + NativeWind + Supabase + TanStack Query (persist) + Zustand. Detalhes: `_padroes/REFERENCIA-MOBILE.md`.

Os 6 padrões que tornam o app funcional:
1. Ordem de boot em `app/_layout.tsx`: `setupNetworkManager()` → QueryClient → Persist → AuthGate.
2. **Guard de auth:** toda query com `enabled: initialized && !!session` (senão RLS volta vazio em silêncio — bug nº 1).
3. Leitura offline: cache persistido 7 dias (`offlineFirst`).
4. Escrita offline: **outbox** serial (`stores/outboxStore` + `lib/sync`), `replaceTempId`, flush no login/30s/manual, rate-limit 5s.
5. Logger estruturado (`lib/logger`): DEBUG/INFO só em `__DEV__`.
6. Segurança: só anon-key + RLS por papel; `service_role` jamais no app. **Tokens/sessão em `expo-secure-store`** (não AsyncStorage puro); AsyncStorage só para cache não sensível.

Gotchas: Hermes não tem `AbortSignal.timeout()` (use `AbortController+setTimeout`); `react-native-reanimated/plugin` é o último no Babel; conferir `expo-updates` vs `bundledNativeModules.json`.

Já incluir na 1ª feature o que o projeto-base não tinha: **testes** (Vitest/Jest) e **CI mobile** (typecheck + EAS). **Segredos via `eas env:create`, nunca literais no `eas.json`.**

**Prontidão Play Store (se for publicar — ver `_padroes/PUBLICACAO-PLAY-STORE.md`):** AAB assinado (Play App Signing); `versionCode` que sobe a cada upload; `targetSdkVersion` no nível exigido pela Play; permissões mínimas justificadas; política de privacidade + Data Safety + content rating; **exclusão de conta/dados** (in-app + URL); crash reporting (Sentry); OTA só para JS/assets (mudança nativa = novo build); faixas internal → closed → open → production.

Tier típico: T2 (app publicado em loja é T2+).

---

## 6. Regras sempre

- Nunca commitar segredo: `.env`, `.env*.local`, `.mcp.json` no `.gitignore`.
- Nunca push direto na `main`: branch → PR.
- Worktrees em `worktrees/`, removidas após merge; nunca versionar a pasta.
- pt-BR, moeda `R$ 1.234,56`, data `dd/MM/yyyy`.
- Skills disponíveis globalmente via `~/.claude/skills/` (hub + superpowers).
- **ponytail é always-on** em todo agente que escreve código: escada YAGNI (escrever só o necessário) **sem nunca cortar** segurança, validação, tratamento de erro ou acessibilidade. Comandos: `/ponytail-review`, `/ponytail-audit`, `/ponytail-debt`.
- **Pesquisa atual** via MCP **Perplexity** (busca/pesquisa web em tempo real) + Context7 (docs de libs). Chave via env `PERPLEXITY_API_KEY` (nunca em commit). Instalar: `claude mcp add perplexity --env PERPLEXITY_API_KEY="..." -- npx -y @perplexity-
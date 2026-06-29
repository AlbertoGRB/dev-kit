# Playbook — Revisão de Projeto Ponta a Ponta

**Autor:** Equipe · **Data:** 2026-06-08 · Companheiro de `PADRAO-DE-ENGENHARIA.md` e `CLAUDE.md`

Como pedir ao Claude Code uma **auditoria completa** de um projeto, alinhada ao padrão de engenharia. A revisão é **somente leitura**: o agente analisa, pontua e propõe melhorias — **não altera código**. As correções viram specs no fluxo normal (com seus portões) só depois que você aprovar.

---

## Como rodar

```powershell
cd "$env:USERPROFILE\Desktop\dev\projects\<projeto>"
claude
```
Cole o prompt da seção final. O resultado é um **relatório priorizado** salvo em `docs/REVISAO-<data>.md` dentro do projeto (único arquivo que ele cria — não toca no código).

---

## Rubrica de auditoria (o que ele avalia)

Cada eixo recebe nota (🟢 ok / 🟡 atenção / 🔴 crítico) + evidência (arquivo:linha) + recomendação.

1. **Visão geral & Tier** — o que o projeto é, stack real, e em que tier do padrão se encaixa (T0–T3).
2. **Arquitetura** — estrutura de pastas, separação de camadas, contratos de API, idempotência, acoplamento, regra de negócio fora do lugar.
3. **Qualidade de código** — duplicação, dead code, tipos (any), tamanho de arquivos/funções, consistência de padrões, lint/format/type-check.
4. **Segurança** — segredos no código/commit, authz por endpoint, validação de input, OWASP (SQLi/XSS/IDOR/SSRF), CORS, rate-limit, RLS no Supabase.
5. **Compliance / LGPD** — que PII trafega, base legal, retenção/expurgo, criptografia, trilha de auditoria, PII indo para LLM/terceiros.
6. **Performance** — Web Vitals (web) / cold start e listas (mobile), N+1, índices, bundle, cache, lazy-loading.
7. **Testes & CI** — existência e tipo de testes, cobertura das regras críticas, gate de CI (PR bloqueia com teste vermelho).
8. **Infra / DevOps** — Docker (imagem mínima/não-root/segredos), env/secret management, deploy, backup com restore testado, rollback, IaC.
9. **UX / UI** (se aplicável) — consistência visual, acessibilidade básica, estados de erro/vazio/offline, responsividade.
10. **Dependências** — desatualizadas, vulneráveis, abandonadas, duplicadas.

---

## Formato do relatório

```
# Revisão — <projeto> (<data>)
## 1. Sumário executivo  (3–5 linhas + tier + nota geral)
## 2. Achados por eixo    (rubrica acima, com 🟢🟡🔴 + evidência + recomendação)
## 3. Achados priorizados
   - P0 (crítico/segurança/LGPD)  | esforço S/M/L
   - P1 (importante)              | esforço S/M/L
   - P2 (melhoria)                | esforço S/M/L
## 4. Plano de melhorias  (P0/P1 convertidos em features prontas para virar spec)
## 5. Pontos fortes       (o que manter)
```

Prioridade = impacto × risco. **Segurança e LGPD sobem para P0** mesmo se o esforço for grande.

---

## Regras da revisão

- **Read-only**: não editar código, não rodar migration, não fazer commit. Só criar o relatório em `docs/`.
- **Evidência sempre**: todo achado aponta `arquivo:linha`. Sem achismo.
- **Sem PII no relatório**: descrever o problema sem copiar dado sensível real.
- **Alinhar ao padrão**: comparar contra `PADRAO-DE-ENGENHARIA.md` e, se mobile, `REFERENCIA-MOBILE.md`.
- **Para mudança crítica**, acionar review adversarial (`skills-hub/skills/review`).
- Próximo passo após o relatório: você escolhe o que vira spec → entra no fluxo de agentes com worktrees (nada é implementado sem sua aprovação).

---

## Prompt pronto (cole no Claude Code, dentro do projeto)

```
Faça uma REVISÃO COMPLETA E PONTA A PONTA deste projeto, em modo SOMENTE LEITURA (não altere código, não rode migrations, não faça commit).

1. Leia dev/_padroes/PADRAO-DE-ENGENHARIA.md (e REFERENCIA-MOBILE.md se for mobile) e use as skills security e review do hub quando útil.
2. Explore o projeto inteiro: arquitetura, código, segurança, LGPD, performance, testes, CI, infra, dependências e UX.
3. Avalie cada eixo da rubrica de dev/_padroes/REVISAO-PROJETO-PLAYBOOK.md com 🟢/🟡/🔴, sempre com evidência (arquivo:linha) e recomendação.
4. Priorize os achados em P0/P1/P2 com esforço (S/M/L). Segurança e LGPD são P0.
5. Salve o relatório em docs/REVISAO-<AAAA-MM-DD>.md (único arquivo a criar) e me apresente o sumário.
6. NÃO implemente nada. Ao final, liste quais achados você sugere transformar em specs para eu aprovar antes de qualquer mudança.

Foco extra (opcional): <ex.: segurança e LGPD / performance / arquitetura — ou deixe em branco para tudo>
```

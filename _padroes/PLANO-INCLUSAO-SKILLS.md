# Plano de Inclusão de Skills + Time de Agentes no DEV

**Data:** 2026-06-29 · Companheiro de `CLAUDE.md` e `PLANO-ORGANIZACAO-FLUXO-AGENTES.md`

Objetivo: incluir as fontes pesquisadas no framework `dev/` para usar **com força total** — o `_maestro` seleciona automaticamente as skills certas e monta um **time completo de agentes** que trabalha em paralelo. Este documento é o **plano**; a execução vem após sua aprovação.

---

## 1. Classificação e decisão (8 repositórios)

| Repo | O que é | Licença | Decisão | Como entra |
|------|---------|:------:|---------|-----------|
| **DietrichGebert/ponytail** | Plugin/skills "dev sênior preguiçoso" — escreve só o necessário, sem cortar segurança/validação/a11y | MIT | **Incluir como skill** | Plugin do Claude Code (always-on `lite/full`) + comandos `/ponytail-review`, `-audit`, `-debt` |
| **garrytan/gstack** | Setup com skills/commands por **papéis** (plan, design-review, qa, ship, release) | MIT | **Cherry-pick** | Selecionar comandos úteis → base do time de papéis (§3) |
| **affaan-m/ecc** | Harness OS gigante (261 skills, 66 agents) | MIT (Pro pago) | **Referência** | Não instalar inteiro (conflita/duplica); minerar padrões de skills/hooks |
| **perplexityai/modelcontextprotocol** | Servidor MCP oficial da Perplexity (busca/pesquisa web em tempo real) | MIT | **Incluir como MCP** | `claude mcp add perplexity` (precisa `PERPLEXITY_API_KEY`) |
| **ruvnet/ruflo** | Meta-harness de swarm + MCP (memória/RAG/federação) | MIT | **Opcional (MCP à la carte)** | Plugin lite ou MCP sob demanda; **não** adotar o CLI completo |
| **ripienaar/free-for-dev** | Lista de serviços com free tier | CC0 | **Referência** | Link de consulta (não é skill nem código) |
| **google-labs-code/design.md** | Spec `DESIGN.md` + CLI de design system | Apache-2.0 | **Envolver como skill** | Skill que ensina ler/gerar DESIGN.md e rodar o CLI (lint/export Tailwind) |
| **kunchenguid/no-mistakes** | CLI Go: valida num worktree descartável antes do push e abre PR limpo | MIT | **Tool opcional** | Integrar ao fluxo de PR (Fase 7), não como skill |

**Princípio:** não engolir harness inteiro (ecc, ruflo full) — eles brigam com o nosso `_maestro`/superpowers e injetam infra demais. Pegamos **skills isoladas + MCPs + referências**, mantendo o hub enxuto.

---

## 2. Como cada categoria é instalada

### 2.1 Skills (vão para `skills-hub/`, versionadas)
Processo seguro (respeita as limitações do mount):
1. Clonar o repo numa área rápida (`/tmp`), não no Desktop.
2. **Remover `.git` e qualquer segredo** (`.env`, `.mcp.json`, tokens).
3. Conferir a **licença** (todas MIT/Apache/CC0 — ok para uso interno; manter o arquivo LICENSE).
4. Copiar limpo para `skills-hub/<nome>/`.
5. Criar **junction global** (`~/.claude/skills/<nome>`) para todo projeto enxergar.
6. **Registrar no `_maestro/ROUTING.md`** (linha de intenção → skill).

Entram aqui: **ponytail** (qualidade/anti-over-engineering), **design.md** (design system), e os comandos **cherry-pick do gstack** (design-review, qa, ship, plan).

### 2.2 MCPs (conectores — registrados no padrão, não versionados como código)
Adicionar ao MCP do Claude Code (`.claude/mcp.json` do projeto ou global), com chave via variável de ambiente (nunca literal):
- **Perplexity** (busca/pesquisa web) — conector padrão recomendado.
- **ruflo** (opcional) — só quando precisar de swarm/RAG/memória num projeto específico.

### 2.3 Referências (link nos docs, sem código)
- **free-for-dev** → citar em `PADRAO-DE-ENGENHARIA.md` (escolha de infra com free tier).
- **ecc** → fonte de padrões para a skill-creator (não instalar).

### 2.4 Tool opcional
- **no-mistakes** → gate de validação antes do push, encaixa na Fase 7 (alternativa/complemento ao nosso review + worktrees).

---

## 3. Time completo de agentes (o "selecione um time" em paralelo)

Junta os papéis do gstack com o nosso fluxo (superpowers) e as novas skills. No kickoff, o `_maestro` **monta o time conforme o tipo de projeto** e dispara em paralelo (1 worktree por feature, sem conflito).

| Papel | Responsabilidade | Skills/MCP que usa | Fase |
|-------|------------------|--------------------|:----:|
| **Pesquisador** | Levanta contexto, tech atual, free tiers | Perplexity MCP, Context7, free-for-dev | 0 |
| **Arquiteto/Planejador** | Quebra em features, escreve specs | brainstorming, writing-plans | 0–1 |
| **Designer/UI** | Design system e telas | design.md, ui-ux-pro-max, taste | 1, 5 |
| **Implementador(es)** | Código da feature (paralelo) | subagent-driven-development + **ponytail** (always-on) + skills do stack | 5 |
| **QA/Testes** | TDD + E2E | test-driven-development, playwright, qa (gstack) | 3, 6 |
| **Segurança/Compliance** | OWASP, LGPD, RLS | security, review (adversarial) | 6 |
| **Release/Deploy** | Build, deploy, loja | deploy, monitor, PUBLICACAO-PLAY-STORE, ship (gstack) | 7 |
| **Guardião de qualidade** | Anti-over-engineering + gate de PR | ponytail-review/-audit, no-mistakes | 6–7 |

**Paralelismo:** implementadores rodam em features independentes (worktrees separadas); designer/QA/segurança atuam por feature. O `_maestro` ativa só os papéis necessários ao tier do projeto (T0 não chama Release/Deploy pesado; T2/T3 chama o time todo).

---

## 4. Mudanças nos arquivos do DEV (na execução)

1. **`skills-hub/`** — novas pastas: `ponytail/`, `design-md/`, `gstack-picks/` (comandos selecionados).
2. **`skills-hub/skills/_maestro/ROUTING.md`** — novas linhas de roteamento (qualidade→ponytail; design system→design.md; pesquisa web→Perplexity; papéis→time).
3. **`CLAUDE.md`** — §5/§6: ponytail como regra de qualidade always-on; Perplexity como MCP padrão; seção "Time de agentes".
4. **`PADRAO-DE-ENGENHARIA.md`** — referência ao free-for-dev na escolha de infra.
5. **MCP** — instruções de instalação do Perplexity (e ruflo opcional) com chave via env.
6. **`dev-modelo`** (kit de repasse) — regenerar depois, já com as skills novas.

---

## 5. Riscos e cuidados

- **Licenças:** todas permissivas (MIT/Apache/CC0); manter os arquivos LICENSE ao copiar. ecc tem tier "Pro" pago — usamos só o núcleo OSS como referência.
- **Não duplicar harness:** ecc e ruflo (full) têm seus próprios `_maestro`/rules — instalar inteiros causaria conflito. Só skills isoladas / MCP.
- **Segredos:** Perplexity e ruflo exigem API key → sempre via `eas env`/`.env`/cofre, nunca em commit (regra já vigente).
- **Peso:** clonar em `/tmp`, podar `.git`/`node_modules`, copiar limpo — evita inflar o `skills-hub`.
- **Estrelas dos repos:** alguns READMEs trazem números possivelmente inflados; a decisão acima é por **utilidade e fit**, não por popularidade.

---

## 6. Próximos passos (após sua aprovação)

1. Você aprova **o que entra** (sugiro: ponytail + design.md + gstack-picks como skills; Perplexity como MCP; free-for-dev/ecc como referência; ruflo e no-mistakes opcionais).
2. Eu executo a §2 (clonar→limpar→copiar→junction→registrar no `_maestro`), repo a repo.
3. Atualizo `CLAUDE.md`/`PADRAO` e documento o **time de agentes** (§3) como regra.
4. Regenero o `dev-modelo` com as novidades.

> Quer aprovar o conjunto sugerido no item 1, ou ajustar o que entra (ex.: incluir ruflo, deixar gstack de fora, etc.)?

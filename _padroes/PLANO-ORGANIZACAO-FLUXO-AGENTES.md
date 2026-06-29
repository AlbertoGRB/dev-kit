# Plano de Organização + Fluxo de Agentes por Feature

**Autor:** Equipe · **Data:** 2026-06-08 · **Ambiente:** VS Code + Claude Code (Windows)

Este documento define (1) como separar **projetos** de **skills** no seu PC e (2) um **fluxo repetível** para que, ao iniciar ou reorganizar qualquer projeto, o sistema se quebre em features isoladas, cada uma tocada por um agente próprio, em git worktree separada, com spec aprovada por você antes de começar, testes garantindo o resultado, e zero conflito entre agentes.

A boa notícia: **você já tem 100% das peças instaladas**. Este plano só as encadeia. Nada precisa ser comprado ou criado do zero — as skills do `superpowers` + o orquestrador `_maestro` fazem exatamente o que você descreveu.

---

## 1. Princípio central

> **Um projeto = vários worktrees. Um worktree = uma feature = um agente = uma branch.**
> Os agentes **não se enxergam**, trabalham em cópias isoladas do mesmo repositório e só se reencontram no merge. O que impede conflito não é sorte: é **fronteira de arquivos definida na spec** + **branch isolada por worktree**.

Você nunca programa. Você atua em **três portões de decisão** (spec, plano, merge). O resto é o agente que explora, planeja, escreve testes, implementa e verifica.

---

## 2. Nova estrutura de pastas (hub separado de projetos)

Hoje está tudo dentro de `ui-ux-pro-max-skill-main\` — inclusive seus projetos (`PROJETOS\`) e ~228 MB de ZIPs de backup. Vamos separar em três irmãos:

```
C:\Users\usuario\Desktop\dev\
│
├── skills-hub\                      ← o repo de skills, LIMPO (sem PROJETOS, sem ZIPs)
│   ├── skills\                      ← 101 skills (_maestro, design, taste, workflow...)
│   ├── superpowers-main\            ← worktrees, agentes paralelos, TDD, planos
│   ├── src\ui-ux-pro-max\           ← motor de busca de UI/UX (search.py)
│   └── ... (claude-seo, cybersecurity, playwright, etc.)
│
├── projects\                        ← SEUS projetos, um por subpasta, cada um seu próprio git
│   ├── projeto-bi\
│   ├── vertex-landing\
│   ├── painel-exemplo\
│   ├── inovapatri\
│   ├── kvs-services\
│   ├── pixel-perfect\
│   └── well-being-analytica\
│
├── worktrees\                       ← cópias isoladas geradas pelo fluxo (efêmeras)
│   └── projeto-bi\
│       ├── feat-auth\               ← agente A, branch feat/auth
│       ├── feat-dashboard\          ← agente B, branch feat/dashboard
│       └── feat-export-csv\         ← agente C, branch feat/export-csv
│
└── _archive\                        ← ZIPs pesados de backup, FORA de qualquer git
    ├── Projeto-BI_BACKUP_2026-06-07.zip
    └── Projeto-BI_BACKUP_CONSOLIDACAO.zip
```

**Por que assim:**

- `skills-hub\` separado evita commitar dados internos da SuaEmpresa num repo de skill público e deixa a varredura rápida (hoje os ZIPs + `node_modules` travam a indexação).
- `projects\` dá a cada projeto seu próprio histórico git — pré-requisito para worktrees.
- `worktrees\` fica fora de `projects\` para o VS Code não indexar as cópias como se fossem projetos distintos.
- `_archive\` tira 228 MB do caminho quente.

### 2.1 Tornar as skills visíveis a TODOS os projetos no VS Code

Para que qualquer projeto enxergue as skills sem copiá-las, instale o hub no diretório global do Claude Code (`%USERPROFILE%\.claude\skills`) usando uma *junction* do Windows (não precisa de admin para junctions de pasta):

```powershell
# uma única vez
mklink /J "%USERPROFILE%\.claude\skills\hub" "C:\Users\usuario\Desktop\dev\skills-hub\skills"
mklink /J "%USERPROFILE%\.claude\skills\superpowers" "C:\Users\usuario\Desktop\dev\skills-hub\superpowers-main\skills"
```

Assim, em qualquer projeto dentro de `projects\`, o `_maestro` e o `superpowers` já estão disponíveis. Cada projeto ainda terá seu próprio `CLAUDE.md` apontando regras locais.

> Esta seção é só a recomendação. Você pediu **apenas o documento** agora — quando quiser, eu executo o move + as junctions num passo separado.

---

## 3. O fluxo repetível (pipeline de 7 fases)

Cada fase abaixo já é uma skill que você tem. A coluna "Skill" usa os caminhos reais em `skills-hub\`.

| # | Fase | O que acontece | Skill (caminho real) | Portão seu? |
|---|------|----------------|----------------------|:-----------:|
| 0 | **Kickoff / Descoberta** | O agente faz perguntas, provocações, sugere tecnologias em evidência e levanta segurança de dados antes de qualquer código. | `superpowers-main/skills/brainstorming` + `skills/_maestro` (roteamento) | — |
| 1 | **Spec por feature** | Quebra o trabalho em features independentes. Cada feature ganha uma spec: escopo, **não-escopo (limites)**, padrões, testes esperados, fronteira de arquivos. | `superpowers-main/skills/writing-plans` | ✅ **aprovar specs** |
| 2 | **Exploração da codebase** | Cada agente lê o projeto antes de planejar — arquitetura, padrões existentes, dependências. | `superpowers-main/skills/subagent-driven-development` | — |
| 3 | **Plano + testes (TDD)** | O agente escreve o plano de implementação e os **testes primeiro** (RED), definindo o "feito = verde". | `superpowers-main/skills/test-driven-development` | ✅ **aprovar plano** |
| 4 | **Worktrees isoladas** | Uma worktree + branch por feature. Cópias isoladas, agentes que não se enxergam. | `superpowers-main/skills/using-git-worktrees` | — |
| 5 | **Execução paralela** | Vários agentes rodam em paralelo, cada um na sua worktree/terminal, sem conflito. | `superpowers-main/skills/dispatching-parallel-agents` + `executing-plans` | — |
| 6 | **Verificação + review** | Cada feature passa por verificação objetiva (testes verdes) e review adversarial antes de fechar. | `superpowers-main/skills/verification-before-completion` + `requesting-code-review` + `skills/review` (adversarial) | — |
| 7 | **Fechamento de branch** | Merge ordenado para a main, branch limpa, worktree removida. | `superpowers-main/skills/finishing-a-development-branch` | ✅ **aprovar merge** |

### Como isso atende exatamente o que você pediu

- *"quebrar em diferentes funções e fazer em sequência"* → Fases 1 + 5 (features + execução orquestrada).
- *"git worktrees, cada terminal uma cópia isolada em branch separada"* → Fase 4.
- *"cada agente é uma feature, não se enxergam, sem conflito"* → Fase 4 + 5 + fronteira de arquivos na spec (§5).
- *"cada um tem a spec antes de começar"* → Fase 1 é um portão obrigatório.
- *"eu devo saber o que cada feature faz; se tiver dúvida o agente pergunta/provoca/sugere"* → Fase 0 (brainstorming socrático) + portões de aprovação.
- *"sempre sugerir tecnologias em evidência"* → item fixo no checklist da Fase 0/1 (§6).
- *"sempre se preocupar com segurança de dados"* → portão de segurança obrigatório em toda spec (§4).
- *"o que vai e não vai fazer, limites, testes esperados"* → seções obrigatórias do template de spec (§7).
- *"cada agente explora a codebase, monta plano, monta testes, sabe implementar e como testar"* → Fases 2 + 3.
- *"iterar e fazer sem ter que programar"* → Fases 5 + 6 são autônomas; você só abre os portões.

---

## 4. Portão de segurança de dados (obrigatório em toda spec)

Nenhuma feature passa da Fase 1 sem responder:

1. **Que dados ela toca?** (PII de pacientes, credenciais, tokens, dados de leads?)
2. **Onde os segredos ficam?** Variáveis de ambiente / cofre — **nunca** hardcoded nem em commit.
3. **Quem pode ler/escrever?** RLS no Supabase, escopos de API, princípio do menor privilégio.
4. **Logs vazam algo?** Sem PII/token em log.
5. **Entrada validada?** Sanitização e validação de input antes de persistir.
6. **Superfície externa?** CORS, rate-limit, autenticação em todo endpoint novo.

Para features com banco/API, o agente deve acionar `skills/backend/supabase` (RLS) e `skills/security` (revisão de superfície). Esse portão é um **bloqueador**, não uma sugestão.

---

## 5. Como o conflito é evitado de verdade

Três camadas, todas combinadas:

1. **Isolamento físico (worktree):** cada agente trabalha numa pasta diferente em `worktrees\<projeto>\<feature>`, em branch própria. Eles literalmente não veem os arquivos um do outro durante o trabalho.
2. **Fronteira de arquivos na spec:** toda spec declara `arquivos_permitidos:` e `arquivos_proibidos:`. Duas features que precisariam do mesmo arquivo central são **sequenciadas** (uma bloqueia a outra), não paralelizadas. Isso é decidido no portão da Fase 1.
3. **Contratos antes de paralelizar:** se a feature B depende de uma interface da feature A (ex.: um endpoint, um tipo), o **contrato** (assinatura/schema) é definido na spec e congelado. B programa contra o contrato, não contra a implementação de A.

Regra prática: **paralelize features que não compartilham arquivos de escrita.** O resto vira sequência com dependências explícitas.

---

## 6. Provocações e tecnologia em evidência (Fase 0)

Em todo kickoff o agente é obrigado a, no mínimo:

- Fazer **3 a 5 perguntas** que reduzam ambiguidade antes de escrever spec.
- Apresentar **pelo menos 2 abordagens** com trade-offs (não entregar uma só).
- Sugerir **tecnologias atuais** pertinentes ao seu stack (Next.js, Supabase, n8n, etc.), checando documentação atualizada via Context7 (MCP) quando a versão importar — em vez de confiar só na memória.
- Apontar **riscos e o que pode dar errado** (provocação), não só o caminho feliz.
- Confirmar **o que está fora de escopo** explicitamente.

Você responde, o agente refina, e só então vira spec. Se você tiver dúvida, o agente explica — esse vai-e-vem é a Fase 0, não uma exceção.

---

## 7. Template de spec por feature

Salve como `spec.md` na raiz de cada worktree. É o contrato que o agente segue e que você aprova.

```markdown
# Feature: <nome>      (branch: feat/<nome>)

## Objetivo (1 frase)
O que esta feature entrega, em linguagem de negócio.

## Escopo — o que VAI fazer
- ...

## Não-escopo — o que NÃO vai fazer (limites)
- ...

## Fronteira de arquivos
arquivos_permitidos: [src/..., tests/...]
arquivos_proibidos:  [src/core/db.ts, ...]
depende_de: [feat/<outra>]        # ou "nenhuma"

## Padrões a seguir
- Convenções de código do projeto (lint, estilo, naming).
- Tecnologia/lib escolhida + por quê (com versão).

## Segurança de dados  (portão obrigatório — ver §4)
- Dados tocados: ...
- Segredos: ...   | Permissões/RLS: ...   | Validação de input: ...

## Testes esperados (definição de "feito")
- [ ] Teste 1: dado X, quando Y, então Z
- [ ] Teste 2: ...
- Como rodar: `npm test ...` (ou comando do projeto)

## Critério de aceite
A feature está pronta quando: todos os testes acima passam + review aprovado.
```

---

## 8. Convenções

| Item | Padrão |
|------|--------|
| Branch | `feat/<slug>`, `fix/<slug>`, `chore/<slug>` |
| Worktree | `worktrees\<projeto>\<branch-slug>\` |
| Commit | Conventional Commits (`feat:`, `fix:`, `test:`, `refactor:`) |
| Spec | `spec.md` na raiz da worktree, aprovada antes da Fase 2 |
| Nunca | push direto na `main`; sempre branch → PR (regra já no seu `CLAUDE.md`) |
| Limpeza | worktree removida após merge (`git worktree remove`) |

---

## 9. Setup no VS Code (passo a passo, quando você decidir executar)

1. Criar `C:\Users\usuario\Desktop\dev\` com `skills-hub\`, `projects\`, `worktrees\`, `_archive\`.
2. Mover o repo de skills para `skills-hub\`; mover `PROJETOS\*` para `projects\`; mover os ZIPs para `_archive\`.
3. `git init` em cada projeto que ainda não for repositório.
4. Rodar as duas *junctions* da §2.1 para expor as skills globalmente.
5. No VS Code, abrir a pasta do **projeto** (não a do hub) para trabalhar.
6. Para rodar features em paralelo: abrir **um terminal integrado por worktree** (VS Code permite vários terminais; cada um navega para `worktrees\<projeto>\<feature>` e roda um agente).
7. Adicionar `worktrees/` ao `.gitignore` de cada projeto.

> O multi-root do VS Code também funciona: adicione cada worktree ativa como pasta do workspace para ver tudo lado a lado sem misturar.

---

## 10. Exemplo de ponta a ponta (Projeto-BI)

1. **Kickoff:** você diz "quero adicionar exportação de relatórios e um painel de leads". O agente pergunta formato (CSV/PDF?), volume, quem acessa, e sugere a stack. *(Fase 0)*
2. **Specs:** ele propõe 2 features independentes — `export-relatorios` e `painel-exemplo` — cada uma com escopo, limites, segurança e testes. Você aprova. *(Fase 1, seu portão)*
3. **Worktrees:** `worktrees\projeto-bi\feat-export-relatorios` e `...\feat-painel-exemplo`, branches separadas. *(Fase 4)*
4. **Dois agentes em dois terminais** rodam em paralelo; não compartilham arquivos de escrita, logo não conflitam. Cada um explorou a base, escreveu testes (RED) e implementa até o verde. *(Fases 2, 3, 5)*
5. **Verificação + review** em cada branch; você aprova o merge. *(Fases 6, 7)*

Você programou zero linha. Atuou em 3 portões.

---

## 11. Próximos passos

- [ ] Você revisa este plano e ajusta o que quiser.
- [ ] Quando aprovar, eu executo a §9 (criar pastas, mover, junctions) — é um pedido separado.
- [ ] Opcional: eu transformo as Fases 0→7 num **comando único `/kickoff`** (skill orquestradora reutilizável) para você não precisar lembrar a sequência.

---

*Todas as skills citadas existem hoje em `ui-ux-pro-max-skill-main\` (a ser renomeado `skills-hub\`): `superpowers-main\skills\` e `skills\_maestro`, `skills\backend`, `skills\security`, `skills\review`, `src\ui-ux-pro-max\`.*

# Convenção de Estrutura e Nomes (obrigatória)

**Companheiro de** `PADRAO-DE-ENGENHARIA.md` e `CLAUDE.md`. Vale para **todo projeto**. Objetivo: que qualquer pessoa (ou agente) saiba, sem perguntar, **onde está cada coisa, o que ela faz e como atualizá-la**.

## Princípios
1. **Separação de responsabilidades.** Backend e frontend nunca no mesmo diretório. Lógica de negócio separada de UI e de acesso a dados.
2. **Nome = função.** Todo arquivo e pasta tem nome que descreve sua atribuição. **Proibido** nome vago/sem sentido (`utils`, `helpers`, `misc`, `stuff`, `novo`, `teste2`, `final`, `data1`). Se você não sabe nomear, a responsabilidade ainda não está clara — separe.
3. **Local previsível.** Cada tipo de coisa tem um lugar só. Nada de "depende".
4. **Conformidade sem big-bang.** Projeto fora do padrão é migrado **progressivamente** (ver §5), com testes e PR.

---

## 1. Arquitetura por tipo de projeto (dimensionar, não exagerar)

### A) App único (só web, ou só backend, ou só mobile)
Não force monorepo. Use camadas dentro de `src/`.

```
<projeto>/
├── src/
│   ├── app/ (ou routes/, pages/)   # entrada / rotas
│   ├── modules/<dominio>/          # feature por domínio (ex.: agendamento, usuarios)
│   ├── components/  (frontend)     # UI reutilizável
│   ├── hooks/ · stores/ (frontend) # estado
│   ├── services/  (backend)        # regra de aplicação/casos de uso
│   ├── domain/                     # regra de negócio pura (sem I/O)
│   ├── data/ (ou repositories/)    # acesso a banco/APIs externas
│   ├── lib/                        # utilitários NOMEADOS por função (date-format, currency)
│   ├── config/                     # configuração central (env, constantes)
│   └── types/                      # tipos TS (ex.: database.ts)
├── tests/ (ou *.test.ts co-locados)
├── database/  (migrations/ + seed/)   # se houver banco
├── deploy/    (Dockerfile, compose, stack, CI)
├── docs/
├── .env.example   ·   README.md   ·   CLAUDE.md
```

### B) Multi-app (web + mobile + backend + compartilhado) → monorepo com workspaces
```
<projeto>/
├── apps/
│   ├── web/       # frontend web (React/Vite)
│   ├── mobile/    # app mobile (Expo)
│   └── api/       # backend (Hono/Node)   ← "api" ou "backend", escolha um e mantenha
├── packages/
│   ├── core/      # regra de negócio pura e determinística (compartilhada, testável)
│   ├── ui/        # componentes compartilhados (se aplicável)
│   ├── types/     # tipos/contratos compartilhados (schema do banco)
│   └── config/    # tsconfig/eslint compartilhados
├── database/      # migrations + seed
├── deploy/        # Docker, compose, stack Portainer/K8s, CI
├── docs/
├── package.json (workspaces)  ·  README.md  ·  CLAUDE.md  ·  .env.example
```
Regra de ouro (herdada): **cálculo/regra de negócio fica em `core`/`domain` puro**, nunca misturado com rota ou componente.

---

## 2. Camadas (o que vai em cada lugar)
| Camada | Papel | Não pode |
|--------|-------|----------|
| `app`/`routes`/`pages` | entrada, roteamento, orquestração fina | conter regra de negócio |
| `domain`/`core` | regra de negócio pura (funções puras, testáveis) | fazer I/O (banco, rede) |
| `services` | casos de uso (orquestra domain + data) | renderizar UI |
| `data`/`repositories` | acesso a banco/APIs externas | conter regra de negócio |
| `components`/`hooks`/`stores` | UI e estado (frontend) | acessar banco direto |
| `lib` | utilitários **nomeados por função** | virar depósito genérico |
| `config` | env, constantes, clientes configurados | espalhar segredos no código |

---

## 3. Convenção de nomes
- **Pastas:** `kebab-case`, nome pela responsabilidade (`user-management`, `pdf-report`, não `stuff`).
- **Componentes React:** `PascalCase.tsx` (`UserCard.tsx`).
- **Hooks:** `useAlgo.ts` (`useCompanies.ts`).
- **Stores (Zustand):** `algoStore.ts` (`authStore.ts`).
- **Backend por papel (sufixo explícito):** `*.route.ts`, `*.controller.ts`/`*.handler.ts`, `*.service.ts`, `*.repository.ts`, `*.schema.ts` (validação zod/joi), `*.types.ts`.
- **Testes:** `*.test.ts` co-locado ou em `__tests__/`.
- **Utilitários:** nome pela função (`date-format.ts`, `currency.ts`, `slugify.ts`) — **nunca** `utils.ts` genérico como depósito.
- **`index.ts`:** só como *barrel* (reexport), nunca com lógica.
- **Constantes/config:** `nome-em-kebab` de arquivo; constantes `SCREAMING_SNAKE_CASE`.
- **Migrations:** prefixo ordenável (timestamp ou `001_`, `002_`) + descrição (`0007_add_recurrence_to_events.sql`).
- **Idioma:** nomes de código em inglês técnico ou pt-BR, mas **consistente no projeto** (não misturar).

---

## 4. Descoberta e manutenção
- Todo projeto tem, no `README.md`, um **mapa de estrutura** (o que é cada pasta) e **como atualizar cada área** (ex.: "nova rota → `apps/api/src/modules/<dominio>/*.route.ts`", "nova migration → `database/migrations/`").
- Contratos entre camadas/apps ficam em `packages/types` (ou `types/`) — fonte única.
- Segredos só em `.env`/cofre (nunca versionados) — ver `PADRAO-DE-ENGENHARIA.md`.

---

## 5. Projeto fora do padrão → reorganização progressiva (sem quebrar)
Quando um projeto **não** segue esta convenção:
1. **Não faça big-bang.** Gere um **plano de migração** (spec) listando o alvo (§1) e o mapeamento origem→destino.
2. **Regra do escoteiro:** ao tocar numa área, traga-a para conformidade (mover para a pasta certa, renomear, separar camadas) — em **PR próprio, com testes verdes**.
3. **Código novo já nasce no padrão** (mesmo antes da migração completa).
4. Migração grande vira sequência de **features independentes** (por área), cada uma em worktree/PR, com build e testes verificados a cada passo.
5. Priorize separar **backend × frontend** e tirar regra de negócio de dentro de rota/componente primeiro (maior ganho, menor risco).

> Aplicação: no kickoff de qualquer projeto, o agente compara a estrutura atual com esta convenção; se divergir, propõe o plano de migração (§5) antes de implementar features — respeitando os portões de aprovação.

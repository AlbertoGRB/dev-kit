# Referência Mobile — Golden Path (base: AppExemplo Mobile)

**Autor:** Equipe · **Data:** 2026-06-08 · Companheiro de `PADRAO-DE-ENGENHARIA.md`

Este documento destila os padrões do **AppExemplo Mobile** (`dev\projects\AppExemplo\calculadoraSuaEmpresa`) como **referência canônica** para todo app mobile futuro. O projeto real é o exemplo vivo; o template limpo está em `dev\_init\templates\expo-mobile-supabase\`. Quando um agente for criar ou reorganizar um app mobile, ele deve seguir este golden path.

---

## 1. Stack de referência

| Camada | Tecnologia | Por quê |
|--------|-----------|---------|
| Framework | Expo ~54 + Expo Router ~6 | Roteamento por arquivos, OTA updates, EAS Build |
| Runtime | React Native 0.81 + New Architecture | Padrão atual |
| Estilo | NativeWind v4 (+ tema em `src/theme/`) | Tailwind no RN, consistência com o web |
| Auth + DB | Supabase JS v2 (sessão em AsyncStorage) | Backend único web+mobile, RLS |
| Estado servidor | TanStack Query v5 + persist (7 dias) | Cache offline-first |
| Estado local | Zustand v5 | Simples, sem boilerplate |
| Formulários | React Hook Form + Zod | Validação tipada |
| Build/Deploy | EAS Build | APK interno sem loja |

---

## 2. Estrutura de pastas (obrigatória)

```
app/                  # rotas (Expo Router)
  _layout.tsx         # boot: network → QueryClient → Persist → AuthGate
  (auth)/             # telas sem sessão (login, forgot-password)
  (app)/              # telas com sessão (guarda por session)
src/
  components/{ui,layout}/   # UI reutilizável e shell
  hooks/                    # hooks de dados (TanStack Query)
  lib/                      # supabase, queryClient, network, logger, sync, format
  stores/                   # Zustand (authStore, outboxStore, ...)
  theme/                    # colors, spacing, typography
  types/database.ts         # tipos espelhando o schema Postgres
```

Alias `@/*` → `./src/*` (em `tsconfig.json`). UI e comentários em **pt-BR**; moeda/data em formato brasileiro.

---

## 3. Os 6 padrões que tornam o app "funcional"

### 3.1 Ordem de inicialização (em `app/_layout.tsx`)
É sensível à ordem:
1. `setupNetworkManager()` — liga AppState ao `onlineManager` do TanStack.
2. `QueryClient` com `networkMode: 'offlineFirst'`, `gcTime` 7 dias.
3. `PersistQueryClientProvider` persiste o cache no AsyncStorage.
4. `AuthGate.initialize()` restaura a sessão → seta `initialized = true`.
5. Hooks de dados só disparam depois disso.

### 3.2 Guard de timing de auth (a regra mais importante)
**Toda** query de dados precisa de:
```ts
enabled: initialized && !!session
```
Sem isso, a query dispara sem token → o **RLS do Supabase devolve vazio em silêncio** → telas aparecem vazias sem erro. É a causa nº 1 de bug "sumiu meu dado" em apps Supabase.

### 3.3 Leitura offline (cache)
`PersistQueryClientProvider` + `offlineFirst` servem dados do cache (TTL 7 dias) quando sem rede — sem spinner, sem erro. Dado pode estar desatualizado, e tudo bem.

### 3.4 Escrita offline (outbox pattern)
Mutações passam pelo `outboxStore` (Zustand + persist):
- **online** → insert direto no Supabase → `invalidateQueries`.
- **offline/erro de rede** → enfileira op com `tempId` → aparece já na UI → `flushOutbox()` envia quando a rede volta.

`flushOutbox()` (em `src/lib/sync.ts`):
- roda no login, a cada 30s, e manual via NetworkBanner;
- **serial** (preserva dependência: pai antes do filho);
- erro de **rede** → volta a `pending` e para; erro de **servidor** → marca `error` e segue;
- `replaceTempId` propaga o ID real para ops dependentes;
- rate limit de 5s entre flushes.

### 3.5 Logger estruturado
`src/lib/logger.ts`: níveis DEBUG/INFO/WARN/ERROR, buffer de 300 em memória (tela de diagnóstico). Em produção só WARN/ERROR vão ao console. Use tags: `logger.info('authStore', 'msg')`.

### 3.6 Modelo de segurança
- Só **ANON_KEY** no app — segura por design; o acesso real é via **RLS**. `service_role` **jamais** no mobile (só Edge Functions).
- **Sessão/tokens em `expo-secure-store`** (Keystore/Keychain do SO), não em AsyncStorage puro. Use o SecureStore como `storage` adapter do cliente Supabase. AsyncStorage só para cache não sensível (ex.: cache de queries). `autoRefreshToken` ligado.
- RLS por papel: `ADMIN > MANAGER > SELLER`; cada tabela com política (ex.: SELLER vê só o que criou).

---

## 4. Mapeamento ao Padrão de Engenharia (tiers)

Um app mobile assim é **Tier 2** (offline + multi-estado). Itens da Definition of Done que ele já cobre nativamente: segurança (RLS/anon-key), offline/idempotência (outbox serial), observabilidade (logger), performance (cache, lazy). O que ainda exige atenção por feature: LGPD (dado de paciente/colaborador), testes (o projeto base **não tem testes** — ver §6), e CI mobile (typecheck + EAS).

---

## 5. Gotchas (aprendidos no projeto real)

- **Hermes**: `AbortSignal.timeout()` não existe → use `AbortController + setTimeout`.
- **Babel**: `react-native-reanimated/plugin` tem que ser o **último**.
- **Expo updates**: a versão casa com a do Expo — confira `node_modules/expo/bundledNativeModules.json` antes de mexer.
- **Wizard/draft em memória**: rascunhos de fluxo multi-step ficam fora da persistência de propósito, para não gerar estado inconsistente se o app fechar no meio.
- **SVG como componente**: via `react-native-svg-transformer` (config no `metro.config.js` + `svg.d.ts`).

---

## 5.5 Produção & Play Store (maturidade obrigatória)

Todo app destinado à loja segue `PUBLICACAO-PLAY-STORE.md`. Em resumo, antes de produção:
- **Build AAB** assinado (Play App Signing) no profile `production`; keystore fora do git.
- **`versionCode` que sobe a cada upload** (`autoIncrement` no EAS ou bump manual) + `version` atualizada.
- **`targetSdkVersion`** no nível exigido pela Play (confirmar no Console).
- **Permissões mínimas** declaradas e justificadas.
- **Política de privacidade** publicada + **Data Safety** + **content rating**.
- **Exclusão de conta/dados** in-app + URL (exigência Play e direito LGPD).
- **`expo-secure-store`** para tokens (§3.6) e **crash reporting** (Sentry) em produção.
- **OTA** (expo-updates) só para JS/assets; mudança nativa = novo build. Faixas: internal → closed → open → production.

Checklist completo e Definition of Done de loja: `PUBLICACAO-PLAY-STORE.md`.

---

## 6. Onde o projeto-base diverge do padrão (corrigir nos próximos)

1. **Segredos no `eas.json`**: o AppExemplo tem a `ANON_KEY` escrita literal nos 3 profiles e o `eas.json` não está no `.gitignore`. O **template já corrige**: variáveis via `eas env:create`, sem chave literal. Recomendo migrar o AppExemplo para o mesmo padrão.
2. **Sem framework de testes**: validação hoje é só `tsc --noEmit`. O padrão pede pirâmide de testes — nos próximos apps, adicionar testes (ex.: Vitest/Jest + Testing Library) já no template, e cobrir as regras de negócio puras (cálculo) com unitários.
3. **CI mobile**: garantir um workflow que rode `typecheck` + build EAS em PR.

---

## 7. Como o agente usa esta referência

No kickoff de um app mobile (ver `PLANO-ORGANIZACAO-FLUXO-AGENTES.md`), o agente deve:
1. Ler este documento e o `PADRAO-DE-ENGENHARIA.md`.
2. Partir do template `dev\_init\templates\expo-mobile-supabase\` em vez de começar do zero.
3. Aplicar os 6 padrões da §3 e respeitar os gotchas da §5.
4. Já incluir o que o projeto-base não tinha (testes + CI mobile — §6) na spec da primeira feature.

---

*Exemplo vivo (não copiar segredos): `dev\projects\AppExemplo\calculadoraSuaEmpresa\` — ver `MOBILE_ARCHITECTURE.md` e `CLAUDE.md` dele. Template limpo: `dev\_init\templates\expo-mobile-supabase\`.*

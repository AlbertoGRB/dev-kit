# Template — App Mobile (Expo + Supabase, offline-first)

Esqueleto reutilizável extraído do projeto de referência **AppExemplo Mobile**. Já vem com os padrões aprovados: auth com guard de timing, cache offline (7 dias), escrita offline via **outbox**, logger estruturado e tema NativeWind. **Sem segredos nem lógica de domínio** — é só a base.

## O que já está pronto

| Área | Arquivo | Padrão |
|------|---------|--------|
| Boot | `app/_layout.tsx` | Ordem crítica: `setupNetworkManager()` → QueryClient → Persist → AuthGate |
| Auth | `src/stores/authStore.ts` | `initialize()` lê sessão do AsyncStorage; `initialized` libera as queries |
| Supabase | `src/lib/supabase.ts` | Só `ANON_KEY` (RLS controla acesso); nunca service_role no app |
| Cache offline | `src/lib/queryClient.ts` | `networkMode: offlineFirst`, gcTime 7 dias |
| Escrita offline | `src/stores/outboxStore.ts` + `src/lib/sync.ts` | Fila persistida; flush serial; rede→pending, servidor→error |
| Rede | `src/lib/network.ts` | onlineManager via AppState (sem dep nativa extra) |
| Logs | `src/lib/logger.ts` | DEBUG/INFO só em `__DEV__`; buffer de 300 |
| UI base | `src/components/ui/` | Button, NetworkBanner |

## Como iniciar um projeto a partir daqui

1. Copie a pasta para `dev\projects\<seu-app>\` (ou a subpasta mobile).
2. Substitua os marcadores em `app.json`: `__APP_NAME__`, `__app-slug__`, `__appscheme__`, `com.example.__appslug__`.
3. `bun install` (ou `npm install`).
4. Crie o `.env` a partir do `.env.example` com a URL e a **anon key** do seu Supabase.
5. Gere os tipos do banco: `supabase gen types typescript --project-id <id> > src/types/database.ts`.
6. Adapte o `switch` em `src/lib/sync.ts` e os tipos de `outboxStore.ts` ao seu domínio (troque `record.*`).
7. `bun expo start` para rodar.

## Regras de ouro (do padrão de engenharia)

- **Toda query de dados** precisa de `enabled: initialized && !!session` — senão o RLS retorna vazio em silêncio.
- **Segredos**: `.env`, `.env*.local` e `.mcp.json` estão no `.gitignore`. Variáveis de build vão no EAS via `eas env:create` (NUNCA literais no `eas.json`).
- **Hermes**: nunca use `AbortSignal.timeout()`; use `AbortController + setTimeout`.
- **Expo**: ao mexer em `expo-updates`, confira `node_modules/expo/bundledNativeModules.json`.
- `react-native-reanimated/plugin` é sempre o **último** plugin do Babel.

## Build (APK interno)

```bash
eas init                       # define o projectId
eas env:create --name EXPO_PUBLIC_SUPABASE_URL --value "https://..."
eas env:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "eyJ..."
eas build --profile preview --platform android
```

## Produção / Play Store

Já vem preparado: `production` gera **AAB** com `autoIncrement` do `versionCode`, e a sessão fica em **expo-secure-store** (não AsyncStorage). Antes de publicar, siga o checklist completo em `dev\_padroes\PUBLICACAO-PLAY-STORE.md`:

- AAB assinado com **Play App Signing**; keystore fora do git.
- `targetSdkVersion` no nível exigido pela Play (confirmar no Console).
- Permissões mínimas justificadas; **política de privacidade** + **Data Safety** + content rating.
- **Exclusão de conta/dados** (in-app + URL) — exigência Play e LGPD.
- **Crash reporting** (Sentry) em produção; faixas internal → closed → open → production.
- OTA (expo-updates) só para JS/assets; mudança nativa = novo build.

```bash
eas init                       # define o projectId
eas env:create --name EXPO_PUBLIC_SUPABASE_URL --value "https://..."
eas env:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "eyJ..."
eas build --profile production --platform android   # AAB para a Play
```

> Referência completa dos padrões: `dev\_padroes\REFERENCIA-MOBILE.md` e `dev\_padroes\PUBLICACAO-PLAY-STORE.md`.

# Publicação Mobile — Play Store (regras + checklist)

**Companheiro de** `REFERENCIA-MOBILE.md` e `PADRAO-DE-ENGENHARIA.md`. Vale para todo app Android (Expo/EAS) destinado à **Google Play**. Nenhum app sobe para produção sem cumprir a §8 (Definition of Done de loja).

Tier: app publicado em loja é **T2+** e herda a Definition of Done geral **mais** as regras abaixo.

---

## 1. Identidade e versionamento (obrigatório)

- `android.package` e `ios.bundleIdentifier` em **DNS reverso estável** (ex.: `com.empresa.app`) — nunca muda depois de publicado.
- **`version`** (versionName, ex.: `1.2.0`) visível ao usuário.
- **`versionCode`** (inteiro Android) **deve subir a cada upload**. Use uma das duas:
  - `eas.json` → `"appVersionSource": "remote"` + `"autoIncrement": true` no profile `production` (EAS gerencia), **ou**
  - `appVersionSource: "local"` + subir o `versionCode` manualmente no `app.json` a cada build.
- **`runtimeVersion`** definido (ex.: policy `appVersion`) — base das OTA (ver §6).

## 2. Build de produção

- **Formato: AAB** (`buildType: "app-bundle"`) no profile `production` — a Play exige Android App Bundle, não APK. (APK fica só para testes internos.)
- **Minificação/R8** habilitada no release; sem código morto/sourcemaps expostos.
- **64-bit** garantido (RN/Expo já entrega arm64) e **New Architecture** ligada.
- Comando: `eas build --profile production --platform android`.

## 3. Assinatura (signing)

- Use **Play App Signing** (Google guarda a chave de assinatura do app) + **upload key** gerenciada pelo EAS (`eas credentials`).
- A **upload key/keystore NUNCA** vai para o git (`.gitignore`: `*.jks`, `*.keystore`, `*.p8`, `*.p12`). Guardar backup em cofre.
- Perder a upload key não é fatal (Play permite reset); perder controle dela **é** risco — trate como segredo.

## 4. Target API level e permissões

- **`targetSdkVersion`/`compileSdk`** no nível exigido pela Play no momento. Em 2025 o piso para novos envios é **API 35 (Android 15)**; a Play sobe a exigência ~1 ano após cada release do Android — **confirme a exigência vigente no Play Console** antes de publicar e mantenha o Expo atualizado para acompanhar.
- **Permissões mínimas**: declare só o que usa. O Expo injeta algumas por padrão — remova as não usadas via `android.permissions` (lista explícita) ou `android.blockedPermissions`.
- Toda permissão precisa de **justificativa** no Play Console; permissões sensíveis (localização em background, etc.) exigem formulário de declaração.
- Strings de permissão (câmera, galeria, notificações) claras e em pt-BR no `app.json`.

## 5. Privacidade, Data Safety e LGPD (bloqueador)

- **Política de privacidade** hospedada (URL pública) — obrigatória para apps com conta/PII. Linkar no Play Console e dentro do app.
- **Data Safety form** (Play Console) preenchido com honestidade: que dados coleta, se compartilha, se criptografa em trânsito (sim — Supabase TLS), e se permite exclusão.
- **Exclusão de conta/dados**: a Play exige um caminho para o usuário **solicitar exclusão de conta e dados** (in-app + uma URL web). Implementar e documentar — alinha com direito do titular na LGPD.
- **Dado sensível de saúde/SST**: declarar base legal, retenção e criptografia (ver `PADRAO-DE-ENGENHARIA.md` §2). Não enviar PII a LLM sem base legal.
- **Content rating** (questionário IARC) respondido.

## 6. Atualizações OTA (expo-updates)

- Canais por ambiente: `preview` e `production` (já no `eas.json`).
- **OTA serve só JS/assets.** Mudança nativa (nova lib nativa, permissão, targetSdk, `app.json` nativo) **exige novo build** na loja — não tente OTA.
- `runtimeVersion` separa quem pode receber qual OTA; suba o runtime quando houver mudança nativa.

## 7. Observabilidade e qualidade em produção

- **Crash reporting** (ex.: Sentry/`sentry-expo`) ligado em produção — sem isso você fica cego a quebras dos usuários.
- Logger em produção só `WARN`/`ERROR` (já é o padrão); nada de PII em log.
- **Pre-launch report** da Play e teste em faixas: **internal → closed → open → production**. Não vá direto para produção.
- Testar em dispositivos reais (gama Android antiga inclusa) antes de promover.

## 8. Definition of Done — "pronto para Play Store"

Um app só sobe para produção quando:

- [ ] AAB de produção assinado (Play App Signing) builda no EAS.
- [ ] `versionCode` sobe automaticamente (ou processo manual documentado); `version` atualizada.
- [ ] `targetSdkVersion` no nível exigido pela Play (verificado no Console).
- [ ] Permissões mínimas declaradas e justificadas; nenhuma não usada.
- [ ] Política de privacidade publicada + linkada (app e Console).
- [ ] Data Safety preenchido; content rating respondido.
- [ ] Fluxo de **exclusão de conta/dados** implementado (in-app + URL).
- [ ] Segredos via `eas env:create` (nada literal no `eas.json`); keystore fora do git.
- [ ] Tokens de auth em `expo-secure-store` (não AsyncStorage puro) — ver referência mobile.
- [ ] Crash reporting ativo; testado em faixa interna/fechada antes de produção.
- [ ] Testes + typecheck verdes no CI; Definition of Done geral cumprida.

---

## 9. Onde o AppExemplo está hoje (gap atual)

Já tem: AAB no profile `production`, `expo-updates` + `runtimeVersion`, canais preview/production, strings de permissão em pt-BR.

Falta (vira spec): `versionCode`/autoIncrement, `targetSdk` confirmado, **SecureStore** para a sessão, **política de privacidade + Data Safety**, **exclusão de conta/dados**, **crash reporting**, e revisão de permissões mínimas.

*Cada item acima pode virar uma spec no fluxo de agentes (com seus portões). Nada é implementado sem aprovação.*

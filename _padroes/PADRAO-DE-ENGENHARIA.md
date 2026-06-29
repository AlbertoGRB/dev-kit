# Padrão de Engenharia (Baseline Inegociável)

**Autor:** Equipe · **Data:** 2026-06-08 · Companheiro de `PLANO-ORGANIZACAO-FLUXO-AGENTES.md`

Toda aplicação — **web ou mobile** — herda este padrão automaticamente. Ele não é opcional: vira um **portão obrigatório** na Fase 1 (spec) e na Fase 6 (verificação) do pipeline de agentes. Nenhuma feature fecha sem passar pela *Definition of Done* do §9.

---

## 0. Princípio: processo uniforme, dimensionamento por tier

Você pediu "sempre o mesmo padrão". O padrão **é o mesmo para todos**: todo projeto responde ao mesmo checklist. O que muda é a **resposta**, dimensionada pelo tipo de projeto. Assim, uma landing do Instagram não carrega Kafka, mas é obrigada a *justificar* por que não precisa — a pergunta é sempre feita.

| Tier | Tipo de app | Pilares que ativam pesado | Infra típica |
|:----:|-------------|---------------------------|--------------|
| **T0** | Estático / landing / card-news | Segurança básica, LGPD (cookies/forms), performance web. **Sem** mensageria/escala. | Deploy estático em CDN/Vercel. Sem container. |
| **T1** | Web/mobile app CRUD (1 serviço + banco) | + Arquitetura, testes, RLS, observabilidade. | 1 container Docker, VPS Linux. CI/CD básico. |
| **T2** | Multi-serviço, tempo real, integrações (n8n, webhooks) | + Mensageria (fila), idempotência, escala horizontal stateless. | Docker Compose / **Swarm** + Traefik (seu setup atual), backup automatizado. |
| **T3** | Alta escala / eventos / IA-RAG / streaming | + Kafka/event-driven, particionamento, similaridade vetorial, SLA/observabilidade plena. | **Kubernetes + Helm** quando a escala/HA exigir. IaC. |

> Exemplos seus: *Landing Pages Instagram* = T0 · *painel-exemplo* = T1 · *Bot-Atendimento/Chatwoot + n8n + Evolution* = T2 · *Projeto-RAG (RAG multi-agente)* e *Projeto-BI* = T2/T3.

Cada feature declara seu tier na spec. O agente sugere o tier; você confirma.

---

## 1. Segurança (cybersecurity) — todos os tiers

Regras inegociáveis:

- **Segredos** só em variáveis de ambiente / cofre. Nunca em código, log ou commit. Scan de segredos no pré-commit.
- **AuthN/AuthZ** em todo endpoint que não seja público explícito. Menor privilégio sempre.
- **Validação e sanitização** de toda entrada (server-side, não só no front).
- **OWASP Top 10 / ASVS** como referência mínima; sem SQLi, XSS, SSRF, IDOR.
- **Dependências** escaneadas (audit) e atualizadas; nada de lib abandonada em produção.
- **Transporte** sempre TLS; cookies `HttpOnly`/`Secure`/`SameSite`.
- **Tokens de autenticação em HTTP-only cookies — NUNCA em localStorage/sessionStorage.** localStorage é acessível por qualquer script (XSS rouba a sessão inteira). A autenticação DEVE passar por endpoint server-side (Edge Function, middleware SSR, ou BFF) que retorna `Set-Cookie` com flags `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/`. O frontend nunca toca no token diretamente. Para projetos Supabase com SPA pura (Vite/React), usar Edge Functions de auth proxy (`auth-login`, `auth-refresh`, `auth-logout`) que fazem a autenticação server-side e setam o cookie. Para frameworks SSR (Next.js/Remix), usar `@supabase/ssr` que já faz isso nativamente. Para apps mobile (Expo/React Native), usar `expo-secure-store` (não AsyncStorage) com as mesmas Edge Functions.
- **Rate limit + CORS restrito** em APIs.
- **Logs sem PII/segredo.**

Skill do hub: `skills/security` (754 skills, MITRE ATT&CK / NIST CSF), revisão de superfície de ataque por feature.

---

## 2. Compliance — LGPD + dado sensível de saúde (crítico p/ SuaEmpresa)

Como a SuaEmpresa é organização com dado sensível, vocês tratam **dado pessoal sensível de saúde** (LGPD Art. 11), que tem regras mais rígidas que dado comum. Isso é portão duro em qualquer feature que toque paciente.

- **Base legal explícita** para cada coleta (consentimento, tutela da saúde, obrigação legal). Documentar qual.
- **Minimização**: coletar só o necessário; não logar dado sensível.
- **Consentimento e finalidade** registrados; forms com aviso de privacidade.
- **Retenção e descarte**: prazo definido + rotina de expurgo. Sem "guardar para sempre".
- **Direitos do titular**: acesso, correção, exclusão, portabilidade — previsto no design.
- **Trilha de auditoria** de quem acessou/alterou dado sensível.
- **Criptografia** em repouso e em trânsito para dado sensível.
- **Sub-processadores** (Supabase, OpenAI, Evolution, etc.): garantir que o dado enviado é compatível com a base legal e o contrato. Atenção a enviar PII para LLM.

Para outros contextos: se houver cartão, PCI-DSS; se houver usuário na UE, GDPR. O checklist é o mesmo, muda a régua.

---

## 3. Arquitetura — T1+

- **12-Factor**: config no ambiente, processos *stateless*, paridade dev/prod.
- **Camadas claras**: apresentação ↔ domínio/serviço ↔ dados. Sem regra de negócio no controller.
- **Contratos de API versionados** (REST/GraphQL/tRPC) — definidos antes da implementação (é o que destrava paralelismo entre agentes).
- **Idempotência** em operações sensíveis (pagamento, criação) — chave de idempotência.
- **Erros padronizados** (formato único, sem vazar stack para o cliente).
- **Migrações versionadas** de banco; nada de alterar schema manualmente em produção.
- **Observabilidade desde o dia 1**: logs estruturados, métricas, trace.

Skills: `skills/backend/api-design`, `skills/backend/supabase`, `skills/backend/supabase-postgres`.

---

## 4. Qualidade & Testes — T1+

- **TDD** (já no pipeline): teste primeiro, define "feito = verde".
- **Pirâmide**: muitos unitários, alguns de integração, poucos E2E.
- **Cobertura** mínima acordada por projeto; *gate* no CI — PR não passa com teste vermelho.
- **E2E** das jornadas críticas com Playwright (`skills/testing`).
- **Lint + format + type-check** obrigatórios no pré-commit.

---

## 5. Performance — todos os tiers (régua por plataforma)

- **Web**: Core Web Vitals (LCP < 2,5s, INP < 200ms, CLS < 0,1), orçamento de bundle, lazy-load, imagens otimizadas, cache/CDN.
- **Mobile**: tempo de cold start, uso de memória/bateria, listas virtualizadas, trabalho pesado fora da main thread.
- **Backend**: sem N+1, índices nas colunas de filtro/join, paginação sempre, cache (Redis) para leitura quente.
- **Medir antes de otimizar**: Lighthouse / profiler, não achismo.

Skills: `skills/performance` (Core Web Vitals, Lighthouse, bundle), `skills/monitor` (uptime, Sentry, SLA).

---

## 6. Escala & Mensageria — T2 (fila) / T3 (eventos)

Pergunta sempre feita: *"esse fluxo precisa ser síncrono?"* Se a resposta envolve trabalho demorado, integração externa ou pico de carga → desacopla com mensageria.

### Escala horizontal (pré-requisito)
- Serviços **stateless** (sessão em Redis/JWT, não em memória do processo) → permite rodar N réplicas atrás de um balanceador.
- Banco com *read replicas* / pooling quando a leitura aperta.
- Trabalho pesado **assíncrono** via fila, não no request HTTP.

### RabbitMQ × Kafka — qual usar

| Critério | **RabbitMQ** (broker de mensagens) | **Kafka** (log de eventos distribuído) |
|----------|-----------------------------------|----------------------------------------|
| Modelo | Fila com roteamento; broker "inteligente", consumidor "burro" | Log append-only particionado; broker "burro", consumidor "inteligente" |
| Forte em | Filas de tarefa, RPC, roteamento complexo, baixa latência | Alta vazão, streaming de eventos, event sourcing, replay/retenção |
| Mensagem | Consumida e removida (ack) | Persistida; vários consumidores leem o mesmo histórico |
| Reprocessar | Difícil depois de consumida | Nativo (reler offset) |
| Escala | Boa, mas menos que Kafka em throughput | Escala horizontal por partições |
| Use quando | Disparar e-mail/notificação, processar tarefa em background, integrar n8n/Chatwoot, comandos | Pipeline de analytics, auditoria de eventos, alimentar IA/BI, milhares de msg/s, múltiplos consumidores do mesmo fluxo |
| Evite quando | Precisa replay/streaming massivo | Só precisa de uma fila de tarefas simples (overkill) |

**Regra prática para vocês:** comece com **RabbitMQ** para desacoplar tarefas (Bot-Atendimento, notificações, sync). Migre/adicione **Kafka** só quando aparecer streaming de eventos de verdade (ex.: ingestão contínua para Projeto-BI ou eventos do RAG em escala). Não introduza Kafka por status — introduza por necessidade medida.

### Idempotência (vale para os dois)
Consumidor deve ser idempotente: a mesma mensagem pode chegar 2x. Use chave de deduplicação + *outbox pattern* para não perder/duplicar eventos.

### Governança de Kafka — Conduktor (MCP de docs conectado)
Quando entrar Kafka (T3), o **Conduktor** dá a camada de governança/observabilidade em cima dele (visualizar tópicos, lag de consumidores, schemas, políticas, RBAC). Você já forneceu o MCP de documentação dele — adicione na config de MCP do **VS Code / Claude Code** (não na do app Cowork) para o agente consultar a doc atualizada do Conduktor durante o design de tópicos/consumidores:

```json
{
  "mcpServers": {
    "conduktor-docs": {
      "type": "url",
      "url": "https://docs.conduktor.io/mcp"
    }
  }
}
```

Onde colar: settings de MCP do seu cliente (ex.: `.claude/mcp.json` do projeto ou config global do Claude Code). Depois disso, ao planejar mensageria, o agente cita a doc do Conduktor + a do Kafka (via Context7) em vez de adivinhar versões. **Importante:** este MCP é só de *documentação* — não conecta no seu cluster. Para o Conduktor agir no cluster real, seria outra integração, com credenciais sob as regras de segredo do §1.

---

## 7. Dados & Similaridade — T2/T3

Dois sentidos de "similaridade", ambos relevantes para você:

**a) Similaridade semântica (busca vetorial / RAG — ex.: Projeto-RAG)**
- Embeddings + **pgvector** no Supabase (você já usa).
- Métrica: cosseno para texto normalizado; índice **HNSW** ou IVFFlat para escala.
- *Chunking* coerente, metadados para filtro, e *reranking* quando precisão importa.
- Cuidado LGPD: não embedar PII sensível sem base legal.

**b) Similaridade de registros (dedup / record linkage — ex.: scraping CNPJ / leads)**
- Normalização + *fuzzy matching* (Levenshtein, trigram `pg_trgm`) para achar duplicatas.
- Chave determinística quando existir (CNPJ); fuzzy só como complemento.

Skills: `skills/backend/supabase` (pgvector/RLS), `src/ui-ux-pro-max` não se aplica aqui — usar Context7 (MCP) para docs atualizadas de pgvector/Kafka quando a versão importar.

---

## 8. Infraestrutura, Deploy & Linux/VPS — T1+

Tudo que roda fora da máquina do dev entra aqui. O princípio é o mesmo: **por necessidade medida, não por status**. Você hoje roda **Docker Swarm + Traefik + Portainer numa VPS** — isso atende T1/T2 muito bem; não troque por Kubernetes só por moda.

### Containerização (Docker) — T1+
- **Imagem mínima e multi-stage** (build separado do runtime); base *slim*/*alpine* quando possível.
- **Usuário não-root** dentro do container; *read-only filesystem* quando der.
- **`.dockerignore`** para não vazar segredo/`.env`/`node_modules` na imagem.
- **Tag versionada** (não só `latest`); imagem escaneada (Trivy/Scout) por vulnerabilidade.
- **Healthcheck** definido; container *stateless* (estado em volume/serviço externo).
- Variáveis por ambiente (Docker secrets no Swarm), nunca embutidas na imagem.

### Orquestração — Swarm hoje, K8s/Helm quando justificar
- **Docker Swarm (atual):** bom para poucos nós, serviços declarados em stack, rolling update, Traefik como ingress. Continue aqui para T1/T2.
- **Kubernetes + Helm (T3):** adote quando precisar de autoscaling real, multi-tenant, HA entre zonas, ou o nº de serviços ficar difícil de gerir no Swarm.
  - **Helm** = empacota o app em *charts* versionados com `values.yaml` por ambiente — evita YAML duplicado e dá rollback (`helm rollback`).
  - Recursos por pod com *requests/limits*; *liveness/readiness probes*; *HorizontalPodAutoscaler*; secrets via Sealed Secrets/Vault (não em ConfigMap puro).
- **Gatilho de migração Swarm→K8s:** documente o motivo na spec. Sem motivo medido, fica no Swarm.

### Linux / VPS hardening — T1+
- SSH só por chave (sem senha), porta/`fail2ban`, *firewall* (ufw/nftables) com mínimo aberto.
- Usuário sem privilégio para a app; `sudo` auditável; updates de segurança automáticos.
- Traefik/Nginx terminando TLS (Let's Encrypt) com renovação automática.
- Disco/CPU/memória monitorados; *logrotate*; relógio sincronizado (NTP).
- Acesso ao Portainer/painéis atrás de auth forte + IP restrito.

### IaC, CI/CD e Backup/DR — T1+
- **Infra como código**: `docker-compose.yml`/stack files (ou Terraform p/ provisionar a VPS) versionados no git. Nada de configurar servidor "na mão" sem registrar.
- **CI/CD**: pipeline que builda imagem → escaneia → testa → publica → faz deploy (rolling). PR não vai pra produção com teste vermelho.
- **Backup automatizado** do banco e volumes, com **restore testado** (backup que nunca foi restaurado não é backup). Política de retenção + verificação periódica.
- **Rollback** sempre possível (imagem anterior / `helm rollback` / migração reversível).

Skills do hub: `skills/deploy` (Vercel, Fly.io, Docker, CI/CD, rollback), `skills/monitor` (uptime, alertas, SLA), `skills/performance`. Docker/K8s/Helm/Linux não têm skill dedicada — são guiados por esta seção + docs atualizadas via Context7 (MCP) e pesquisa via MCP Perplexity. Para escolher serviços/infra com camada gratuita, consultar **free-for.dev** (ripienaar/free-for-dev) como referência.

---

## 9. Como isso entra no fluxo (plug nos portões)

1. **Fase 1 (spec):** ao escrever a spec, o agente preenche o **bloco de baseline** (abaixo) e marca o tier. Você aprova junto com a spec.
2. **Fase 6 (verificação):** a feature só é "feita" se a *Definition of Done* (§9) estiver toda verde.
3. **Herança global:** este padrão é referenciado no `CLAUDE.md` global, então todo projeto em `projects\` já nasce com ele.

Bloco a adicionar no template de spec (§7 do plano):

```markdown
## Baseline de Engenharia
tier: T0 | T1 | T2 | T3
segurança: <riscos + controles>
compliance/LGPD: <dado tocado + base legal + retenção>     # obrigatório se toca PII
arquitetura: <camadas, contratos, idempotência>
performance: <orçamento/metas>
escala/mensageria: <síncrono? fila? qual? ou "N/A justificado">
dados/similaridade: <vetorial/dedup? ou "N/A">
infra/deploy: <container? onde roda (Swarm/K8s)? backup? rollback?>
```

---

## 10. Definition of Done unificada (checklist de fechamento)

Toda feature, em todo projeto, só fecha com:

- [ ] Testes (unit + integração + E2E das jornadas críticas) **verdes**.
- [ ] Lint, format e type-check **sem erro**.
- [ ] Segurança: segredos fora do código, input validado, authz no endpoint, sem dado sensível em log. Tokens de auth em HTTP-only cookie (nunca localStorage).
- [ ] Compliance: se toca PII → base legal documentada, retenção definida, criptografia.
- [ ] Performance: dentro do orçamento do tier (Web Vitals / perf mobile / sem N+1).
- [ ] Escala: fluxo pesado é assíncrono; serviço stateless (T2+).
- [ ] Infra: imagem Docker mínima/não-root, sem segredo na imagem, healthcheck; deploy declarado em IaC (T1+).
- [ ] Backup do banco/volumes com **restore testado**; rollback possível (T1+).
- [ ] Observabilidade: logs estruturados + erro rastreável.
- [ ] Migrações versionadas; rollback possível.
- [ ] Review aprovado (adversarial em mudança crítica).
- [ ] `spec.md` reflete o que foi entregue (sem escopo oculto).

---

## 11. Próximos passos

- [ ] Você valida tiers e a régua de cada pilar.
- [ ] Quando aprovar, eu: (a) adiciono o **bloco de baseline** ao template de spec do plano, e (b) escrevo a versão enxuta deste padrão dentro do `CLAUDE.md` global para herança automática.
- [ ] Opcional: criar uma skill `engineering-baseline` no hub que o `_maestro` aciona sempre, gerando o bloco já preenchido por tipo de projeto.

---

*Skills referenciadas existem hoje no hub: `skills/security`, `skills/backend/{api-design,supabase,supabase-postgres}`, `skills/performance`, `skills/monitor`, `skills/testing`, `skills/review`. Mensageria (RabbitMQ/Kafka) e escala não têm skill dedicada — são guiadas por esta baseline + docs atualizadas via Context7 (MCP).*

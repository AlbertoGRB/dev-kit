---
name: bi-charts
description: Tudo de BI e visualização de dados que precise de gráficos. Use quando for analisar dados, escolher o tipo de gráfico certo, gerar gráficos (Python/HTML), montar dashboards ou trabalhar com Power BI (DAX, modelo, relatórios). Garante o gráfico correto para a pergunta, dados calculados de forma determinística (nunca "no olho" nem delegados ao LLM) e boas práticas de visualização.
version: 1.0.0
---

# bi-charts — BI e visualização com gráficos

Skill para qualquer tarefa de **Business Intelligence que envolva gráficos**: escolher o visual certo, gerá-lo, montar dashboards e apoiar Power BI. Conteúdo original; para Power BI avançado, aponta para um plugin externo (ver §6).

## Regra de ouro
**O cálculo é determinístico.** Métricas, agregações, variações e séries são computadas em **SQL/Python** (ou medidas DAX), nunca estimadas pelo LLM nem "lidas no olho" de um print. O LLM ajuda a escolher o visual e a escrever o código; o número vem do dado.

## Quando usar
- "Qual gráfico uso para X?", "monte um dashboard", "gere um gráfico de…", "analise esses dados".
- Power BI: modelagem (star schema), medidas DAX, relatórios, visuais customizados.

## 1. Fluxo
1. **Pergunta primeiro:** o que se quer responder? (comparar, tendência, composição, distribuição, relação, KPI). O tipo de gráfico segue a pergunta, não o contrário.
2. **Prepare o dado** (SQL/Python): limpe, agregue, calcule. Valide totais.
3. **Escolha o visual** (§2).
4. **Gere** no formato certo (§3).
5. **Revise** (§4) antes de entregar.

## 2. Escolha do gráfico (pergunta → visual)
| Objetivo | Visual recomendado | Evite |
|----------|--------------------|-------|
| Comparar categorias | barra (horizontal se rótulos longos) | pizza com muitas fatias |
| Tendência no tempo | linha; área se acumulado | barra para muitos pontos |
| Composição / parte-do-todo | barra empilhada, 100% empilhada; treemap | pizza com >5 fatias |
| Distribuição | histograma, box plot, violino | — |
| Relação entre 2 variáveis | dispersão (scatter); bolha p/ 3ª dim | — |
| Ranking | barra ordenada | — |
| KPI único / meta | número grande (card) + variação | medidor exagerado |
| Variação vs meta/ano anterior | gráfico de variação (estilo IBCS) | — |
| Geográfico | mapa coroplético | — |

Tipos e bibliotecas por stack: consulte a skill **ui-ux-pro-max** (`charts.csv`, 25 tipos) para recomendação de lib por framework.

## 3. Como gerar (3 caminhos)
- **Python (análise/relatório):** `matplotlib`/`seaborn` (estático), `plotly` (interativo com hover/zoom). Bom para EDA e exportar PNG/HTML. (Se disponíveis no ambiente: as skills `data:create-viz` e `data:data-visualization` já trazem padrões prontos.)
- **Dashboard HTML autossuficiente:** página única com KPI cards + gráficos (Chart.js/Plotly via CDN), filtros e abas. Padrão ótimo para relatório recorrente e compartilhável. (Ver skill `data:build-dashboard` se disponível.)
- **Web app:** dentro de um projeto React, use `recharts`/`Chart.js` seguindo o `design-system-md` (tokens) e o padrão web do `CLAUDE.md`.

## 4. Boas práticas (revisar antes de entregar)
- Título diz a **conclusão** ("Vendas caíram 12% em maio"), não só o eixo.
- Paleta **acessível** (color-blind safe); cor com significado, não decoração.
- Sem chartjunk: sem 3D, sem eixos truncados enganosos (barra começa em 0).
- Rótulos diretos quando ajudam; ordene categorias por valor.
- Formato pt-BR: `R$ 1.234,56`, `dd/MM/yyyy`, milhar com ponto.
- Acessibilidade: contraste, texto alternativo/descrição do insight.

## 5. Power BI
- **Modelo:** star schema (fato + dimensões), uma data table marcada; medidas em vez de colunas calculadas quando possível.
- **DAX:** comece simples (`SUM`, `CALCULATE`, `DIVIDE` para evitar div/0); time intelligence com a data table (`TOTALYTD`, `SAMEPERIODLASTYEAR`).
- **Visuais de variação** no estilo IBCS (real vs meta vs ano anterior) comunicam melhor que pizza.
- **Programático (PBIP/PBIR):** dá para gerar páginas e visuais escrevendo PBIR JSON em projetos PBIP — útil para padronizar relatórios.
- **Visual customizado:** Deneb (Vega/Vega-Lite) para gráficos que o Power BI nativo não faz.

## 6. Para Power BI avançado — instale o plugin (não embutido por licença)
O melhor material de Power BI agentic (DAX, TMDL, Power Query, Deneb, auditoria de modelo, geração de relatórios) é o **data-goblin/power-bi-agentic-development** — porém é **GPL-3.0 com restrição de cópia**, então **não** está embutido aqui. Quando precisar de Power BI a fundo, instale-o como está (com atribuição) e use lado a lado:
```
claude plugin marketplace add data-goblin/power-bi-agentic-development
/plugin install reports@power-bi-agentic-development   # e outros (semantic-models, pbip) conforme a necessidade
```

## Fontes / créditos
Skill autoral. Referências (não copiadas): data-goblin/power-bi-agentic-development (GPL-3.0 — instalar à parte), lukasreese/powerbi-claude-skills (padrão PBIR/PBIP), ThePowerOfAnalytics (KPI trees, MIT), anthropics/claude-cookbooks (leitura de gráficos, MIT). Geração programática de gráficos é melhor coberta pelas skills `data:*` quando disponíveis no ambiente.

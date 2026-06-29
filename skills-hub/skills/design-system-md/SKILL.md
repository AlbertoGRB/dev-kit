---
name: design-system-md
description: Define e aplica o design system de um projeto via formato DESIGN.md (google-labs-code/design.md, Apache-2.0). Use quando for criar/atualizar identidade visual, tokens de design, ou garantir consistência visual entre web e mobile. Gera/lê um DESIGN.md (Markdown + YAML) e usa o CLI @google/design.md para validar e exportar tokens (Tailwind/DTCG).
version: 1.0.0
---

# design-system-md — Design System como código (DESIGN.md)

Padroniza a identidade visual de um projeto num arquivo **`DESIGN.md`** (Markdown + YAML) que serve de fonte única de verdade para os agentes que constroem UI (web e mobile). Baseado no formato aberto `google-labs-code/design.md` (Apache-2.0).

## Quando usar
- Início de um projeto com UI (define cores, tipografia, espaçamento, raios, sombras, tom).
- Garantir **consistência visual entre web e mobile** (mesmo DESIGN.md alimenta Tailwind do web e o tema NativeWind do mobile).
- Antes de gerar telas: o Designer do time lê o DESIGN.md e segue os tokens.

## Como funciona
1. **Criar/editar `DESIGN.md`** na raiz do projeto com as seções de design (princípios, paleta, tipografia, espaçamento, componentes-chave, tom de voz). Use YAML nos blocos de tokens.
2. **Validar** com o CLI:
   ```bash
   npx @google/design.md lint        # (Windows: use o alias designmd)
   ```
3. **Exportar tokens** para o stack:
   ```bash
   npx @google/design.md export --format tailwind   # gera config Tailwind
   npx @google/design.md export --format dtcg        # tokens DTCG (cross-platform)
   ```
4. **Diff** entre versões do design para revisar mudanças:
   ```bash
   npx @google/design.md diff
   ```

## Integração com o nosso padrão
- O DESIGN.md é consumido junto com `ui-ux-pro-max` (estilos/cores/fontes) e as skills `taste` (estética premium). Ordem: definir DESIGN.md → exportar tokens → construir componentes seguindo os tokens.
- **Web**: aplicar os tokens no `tailwind.config`. **Mobile**: refletir no `src/theme/` (NativeWind) — mesmos valores, uma fonte só.
- Versionar o `DESIGN.md` no git; mudanças de design passam por `diff` e review.

## Boas práticas
- Um único `DESIGN.md` por produto; web e mobile herdam dele.
- Tokens semânticos (ex.: `color.primary`, `space.md`) em vez de valores soltos espalhados.
- Sem segredos no arquivo (é só design).

> Fonte do formato/CLI: github.com/google-labs-code/design.md (Apache-2.0). O CLI roda local via `npx` — não requer MCP.

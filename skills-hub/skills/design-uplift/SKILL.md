---
name: design-uplift
description: Máquina de melhorar o design de um projeto — de "funciona mas é feio" para premium. Use quando o usuário pedir para deixar mais bonito, moderno, premium, profissional, "com uma cara melhor", adicionar animações/microinterações, ou modernizar a UI. Orquestra as skills de design (ui-ux-pro-max, taste, design-system-md), componentes prontos e animação (gsap, anime.js) com contenção, acessibilidade e performance.
version: 1.0.0
---

# design-uplift — melhorar o design de um projeto (com método)

Não é "jogar gradiente e sombra". É um processo para elevar a qualidade visual de forma **consistente, acessível e performática**, sem virar enfeite. Combina as skills que já temos.

## Quando usar
"deixe mais bonito/premium/moderno", "melhore a UI", "adicione animações", "modernize essa tela", "está com cara de template".

## Fluxo (auditar → propor → aplicar pelo fluxo de PR)
1. **Auditar** o estado atual (read-only): hierarquia, espaçamento, tipografia, cor, consistência, estados (hover/erro/vazio), acessibilidade. Use `design-review` (gstack) + `taste`.
2. **Fundação — design system:** defina/alinhe tokens com `design-system-md` (DESIGN.md) + `ui-ux-pro-max` (estilos, paletas, pares de fonte). Sem token, o resto não gruda.
3. **Estética:** aplique a skill `taste` certa (`premium`, `minimalist`, `soft`, `brutalist`) e `output-enforcement` (sem placeholder). Anti-slop: nada de card-dentro-de-card, texto minúsculo, hero genérico.
4. **Componentes:** reaproveite bons componentes (shadcn/ui, **21st.dev**) e inspire-se em design systems consolidados (**awesome-design-systems**). Não reinvente botão/modal.
5. **Movimento (com propósito):** microinterações e transições que guiam o olho — ver §Animação. Skills `gsap/*`; `anime.js` como alternativa leve.
6. **Verificar:** contraste/`prefers-reduced-motion`, 60fps (sem jank), consistência em telas e estados, antes/depois.

> Mudança visual entra pelo fluxo normal: **spec → worktree → PR**, com `design-review` + screenshots no PR. Nada de refazer tudo de uma vez.

## Animação — o que usar e quando
| Necessidade | Ferramenta | Por quê |
|-------------|-----------|---------|
| Hover, foco, transição simples de estado | **CSS** (transition/keyframes) | Mais leve, zero dependência |
| React declarativo (entrada/saída, layout) | **Framer Motion** | Ergonômico no React |
| Timeline complexa, sequência, scroll-driven | **GSAP** (skills `gsap/*`) | ScrollTrigger, timeline, robusto, framework-agnóstico |
| Animação leve de DOM/SVG/objetos | **anime.js** (MIT, `import { animate } from 'animejs'`) | Pequena, boa para SVG e microanimações |

## Princípios de movimento (inegociáveis)
- **Propósito, não enfeite.** Anima para dar feedback, hierarquia ou continuidade — não "porque fica legal".
- **Respeite `prefers-reduced-motion`** (GSAP: `gsap.matchMedia()`; CSS: media query). Sempre ofereça a versão sem movimento.
- **60fps:** anime `transform`/`opacity` (compostos na GPU); evite animar `width/height/top/left`. `will-change` com parcimônia.
- **Contenção (ponytail):** poucas animações bem feitas > muitas. Duração curta (150–400ms para microinterações), easing natural.
- **Acessibilidade:** foco visível, sem depender só de cor, sem flashes.

## Como o agente conduz
- Priorize **fundação (tokens) antes de enfeite**. Um design premium vem de espaçamento/tipografia/hierarquia corretos, não de efeito.
- Meça: aponte 3–5 problemas concretos e o ganho de cada correção.
- Para web/mobile, siga o §4/§5 do `CLAUDE.md` e a `CONVENCAO-ESTRUTURA-E-NOMES` (componentes no lugar certo, nomes por função).

## Skills e fontes usadas
Internas: `ui-ux-pro-max`, `design-system-md`, `taste/*` (premium/minimalist/soft/brutalist/redesign/output-enforcement), `image-to-code`, `design-review` (gstack), `gsap/*`.
Referências: 21st.dev (componentes), github.com/alexpate/awesome-design-systems (design systems), anime.js (lib de animação). GSAP skills: greensock/gsap-skills (MIT, incluídas).

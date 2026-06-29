# dev-kit

**Kit de desenvolvimento para Claude Code — Padrões + Time de Agentes + Skills + Template Mobile.**

Modelo de trabalho para criar aplicações **web e mobile** com Claude Code: padrões de engenharia,
fluxo de agentes (specs → worktrees → execução paralela → review), **time de agentes por papéis**,
skills curadas e um template mobile pronto para Play Store. **Sem projetos reais nem segredos/env.**

## Estrutura
```
CLAUDE.md            # manual de operação (lido por todo projeto abaixo)
_padroes/            # padrão de engenharia, fluxo, referência mobile, publicação Play Store,
                     # playbook de revisão, plano de inclusão de skills
_init/               # gerador + template expo-mobile-supabase (SecureStore, AAB, autoIncrement)
skills-hub/          # _maestro + superpowers + ponytail + design-system-md + gstack-picks (+ SOURCES.md)
worktrees/           # cópias isoladas por feature (vazia)
projects/            # (vazia — coloque seus projetos aqui)
```

## Como começar
1. Leia `CLAUDE.md` e os docs em `_padroes/`.
2. Exponha as skills: junctions/symlink de `skills-hub/skills` e `skills-hub/superpowers-main/skills` para `~/.claude/skills/`.
3. Configure os MCPs (Perplexity etc.) com suas chaves via env (ver `skills-hub/SOURCES.md`).
4. Baixe as skills de terceiros opcionais listadas em `skills-hub/SOURCES.md`.
5. Crie um projeto em `projects/<seu-app>/` e mande o "comando de kickoff" (fim do `CLAUDE.md`).
6. Mobile: parta de `_init/templates/expo-mobile-supabase/`.

## Destaques
- **Time de agentes** que roda em paralelo (Pesquisador, Arquiteto, Designer, Implementadores, QA, Segurança, Release, Guardião de qualidade) — ver `skills-hub/skills/_maestro/ROUTING.md`.
- **ponytail always-on**: escreve só o necessário, sem cortar segurança/validação/a11y.
- **Pronto para Play Store**: ver `_padroes/PUBLICACAO-PLAY-STORE.md`.

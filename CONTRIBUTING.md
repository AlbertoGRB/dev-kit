# Como contribuir

A branch `main` é **protegida**: não aceita push direto. **Toda mudança entra por Pull Request.**

## Fluxo
1. Crie uma branch a partir da `main`:
   - `feat/<slug>` (nova capacidade), `fix/<slug>` (correção), `chore/<slug>` (manutenção), `docs/<slug>` (documentação).
2. Faça os commits na sua branch (Conventional Commits: `feat:`, `fix:`, `docs:`, `chore:`).
3. Abra um **Pull Request** para a `main` e preencha o template.
4. Após aprovação/checagens, faça o merge. A branch é removida depois.

## Regras inegociáveis
- **Nunca** comitar segredos: `.env`, `.env*.local`, `.mcp.json`, chaves/tokens. (Já estão no `.gitignore`.)
- Sem dados confidenciais (nomes de clientes/empresas, PII) — este repositório é genérico.
- Seguir a baseline em [`_padroes/PADRAO-DE-ENGENHARIA.md`](_padroes/PADRAO-DE-ENGENHARIA.md) e a *Definition of Done*.
- Componentes de terceiros mantêm suas licenças — ver [`CREDITOS.md`](CREDITOS.md).

## Padrão de qualidade
Escreva só o necessário, sem cortar segurança, validação, tratamento de erro ou acessibilidade (ver skill `ponytail`). Documentação em pt-BR.

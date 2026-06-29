#!/usr/bin/env python3
"""
Project Initializer - Creates a new project inside PROJETOS/ with
auto-selected skills, agent architecture, and workflow.

Usage:
    python init_project.py "<project-name>" --type <type>
    python init_project.py "<project-name>" --type <type> --all-skills
    python init_project.py --types                          # List available types
    python init_project.py --detect "<description>"         # Auto-detect type

Types: landing-page, saas, ecommerce, mobile-app, portfolio, blog, api-service, fullstack

Examples:
    python init_project.py "minha-clinica" --type landing-page
    python init_project.py "saas-crm" --type saas
    python init_project.py "loja-virtual" --type ecommerce
    python init_project.py --detect "quero criar um app de delivery com Flutter"
"""

import sys
import os
import json
import re
from pathlib import Path
from datetime import datetime

SCRIPT_DIR = Path(__file__).parent
PROJETOS_DIR = SCRIPT_DIR.parent
SKILLS_DIR = PROJETOS_DIR.parent / "skills"
TYPES_PATH = SCRIPT_DIR / "project_types.json"
ROUTER_PATH = SKILLS_DIR / "_maestro" / "scripts" / "router.py"


def load_types():
    return json.loads(TYPES_PATH.read_text(encoding="utf-8"))["types"]


def load_all_skills():
    """Get all skill IDs from registry."""
    registry_path = SKILLS_DIR / "_registry.json"
    registry = json.loads(registry_path.read_text(encoding="utf-8"))
    all_skills = []
    for domain_info in registry.get("domains", {}).values():
        all_skills.extend(domain_info.get("skills", []))
    return all_skills


def detect_type(description):
    """Auto-detect project type from description."""
    desc = description.lower()

    type_signals = {
        "landing-page": ["landing", "institucional", "one-page", "pagina unica", "apresentacao", "one page", "single page"],
        "ecommerce": ["loja", "ecommerce", "e-commerce", "produtos", "carrinho", "checkout", "vendas", "shop", "store"],
        "mobile-app": ["mobile", "app", "flutter", "react native", "ios", "android", "celular", "aplicativo"],
        "saas": ["saas", "dashboard", "painel", "plataforma", "sistema", "crm", "erp", "gestao", "subscription", "billing"],
        "portfolio": ["portfolio", "pessoal", "curriculo", "cv", "freelancer", "meus projetos", "showcase"],
        "blog": ["blog", "artigos", "conteudo", "posts", "magazine", "noticias", "news", "editorial"],
        "api-service": ["api", "microservico", "backend", "servico", "endpoint", "webhook", "serverless"],
    }

    scores = {}
    for ptype, signals in type_signals.items():
        score = sum(1 for s in signals if s in desc)
        if score > 0:
            scores[ptype] = score

    if not scores:
        return "fullstack"

    return max(scores, key=scores.get)


def generate_claude_md(project_name, project_type, type_config, all_skills_mode=False):
    """Generate CLAUDE.md for the project."""
    now = datetime.now().strftime("%Y-%m-%d")

    if all_skills_mode or type_config["skills"]["required"] == "ALL":
        required = load_all_skills()
        optional = []
    else:
        required = type_config["skills"]["required"]
        optional = type_config["skills"]["optional"]

    agents = type_config["agents"]
    workflow = type_config["workflow"]

    skills_section = ""
    for s in required:
        skills_section += f"- `{s}` (required)\n"
    for s in optional:
        skills_section += f"- `{s}` (optional)\n"

    agents_section = f"**Agente Principal:** {agents['principal']}\n\n**Subagentes:**\n"
    for a in agents["subagentes"]:
        agents_section += f"- {a}\n"

    workflow_section = ""
    for step in workflow:
        workflow_section += f"{step}\n"

    return f"""# {project_name}

> Tipo: **{project_type}** | Complexidade: **{type_config['complexity']}** | Criado: {now}

## Skills Ativas

{skills_section}

## Arquitetura de Agentes

{agents_section}

## Workflow

{workflow_section}

## Regras do Projeto

1. **Anti-slop**: Nunca usar design generico. Sempre aplicar taste/premium.
2. **TDD**: Testes antes do codigo (quando aplicavel).
3. **Security-first**: RLS, validacao, OWASP desde o inicio.
4. **Progressive disclosure**: Carregar skills sob demanda, nao tudo de uma vez.
5. **Git workflow**: Branch por feature, PR com review, nunca push direto em main.

## Como Usar

Para iniciar o trabalho neste projeto, o Maestro deve:

1. Ler este CLAUDE.md para entender o contexto
2. Carregar as skills required listadas acima
3. Seguir o workflow na ordem definida
4. Usar subagentes em paralelo quando possivel
5. Verificar cada etapa antes de avancar

## Roteamento Automatico

```bash
# Detectar skill para uma tarefa especifica
python ../../skills/_maestro/scripts/router.py "<sua tarefa>" --skill
```

## Estrutura do Projeto

```
{project_name}/
├── CLAUDE.md          # Este arquivo (configuracao do projeto)
├── src/               # Codigo-fonte
├── tests/             # Testes
├── docs/              # Documentacao
└── .env.local         # Variaveis de ambiente (nunca commitar)
```
"""


def generate_agents_md(project_name, type_config):
    """Generate AGENTS.md with detailed agent architecture."""
    agents = type_config["agents"]

    content = f"# Agentes - {project_name}\n\n"
    content += f"## Agente Principal\n\n"
    content += f"**{agents['principal']}**\n\n"
    content += "Responsabilidades:\n"
    content += "- Receber requests do usuario\n"
    content += "- Detectar intent e rotear para subagente correto\n"
    content += "- Coordenar dependencias entre subagentes\n"
    content += "- Garantir qualidade final antes de entregar\n"
    content += "- Compor resultados de multiplos subagentes\n\n"

    content += "## Subagentes\n\n"
    for i, agent in enumerate(agents["subagentes"], 1):
        parts = agent.split(" → ")
        name = parts[0].strip()
        skills = parts[1].strip() if len(parts) > 1 else ""
        content += f"### {i}. {name}\n"
        content += f"- **Skills:** `{skills}`\n"
        content += f"- **Ativacao:** Automatica pelo Maestro quando o contexto exigir\n"
        content += f"- **Output:** Resultado parcial retornado ao Maestro para composicao\n\n"

    content += "## Fluxo de Execucao\n\n"
    content += "```\n"
    content += "Usuario → Maestro (detecta intent)\n"
    content += "              ├── Subagente 1 (paralelo)\n"
    content += "              ├── Subagente 2 (paralelo)\n"
    content += "              └── Subagente N (paralelo)\n"
    content += "                      ↓\n"
    content += "              Maestro (compoe resultado)\n"
    content += "                      ↓\n"
    content += "              Verificacao final\n"
    content += "                      ↓\n"
    content += "              Entrega ao usuario\n"
    content += "```\n\n"

    content += "## Regras de Subagentes\n\n"
    content += "1. Subagentes sao independentes - nao se comunicam diretamente entre si\n"
    content += "2. Toda comunicacao passa pelo Maestro (hub-and-spoke)\n"
    content += "3. Subagentes podem ser executados em paralelo quando nao ha dependencia\n"
    content += "4. Se um subagente falha, o Maestro reporta e continua com os demais\n"
    content += "5. O Maestro decide a ordem de execucao baseado no workflow do projeto\n"

    return content


def create_project(name, project_type, all_skills=False):
    """Create a new project directory with all config files."""
    types = load_types()

    if project_type not in types:
        print(f"Tipo '{project_type}' nao encontrado.")
        print(f"Tipos disponiveis: {', '.join(types.keys())}")
        return False

    type_config = types[project_type]
    project_dir = PROJETOS_DIR / name

    if project_dir.exists():
        print(f"Projeto '{name}' ja existe em PROJETOS/")
        return False

    # Create directories
    project_dir.mkdir(parents=True)
    (project_dir / "src").mkdir()
    (project_dir / "tests").mkdir()
    (project_dir / "docs").mkdir()

    # Generate CLAUDE.md
    claude_md = generate_claude_md(name, project_type, type_config, all_skills)
    (project_dir / "CLAUDE.md").write_text(claude_md, encoding="utf-8")

    # Generate AGENTS.md
    agents_md = generate_agents_md(name, type_config)
    (project_dir / "AGENTS.md").write_text(agents_md, encoding="utf-8")

    # Generate .env.local template
    env_content = "# Variaveis de ambiente do projeto\n"
    env_content += "# NUNCA commitar este arquivo\n\n"
    if project_type in ["saas", "ecommerce", "blog", "api-service", "mobile-app", "fullstack"]:
        env_content += "NEXT_PUBLIC_SUPABASE_URL=\n"
        env_content += "NEXT_PUBLIC_SUPABASE_ANON_KEY=\n"
        env_content += "SUPABASE_SERVICE_ROLE_KEY=\n\n"
    if project_type in ["saas", "ecommerce", "fullstack"]:
        env_content += "STRIPE_SECRET_KEY=\n"
        env_content += "STRIPE_WEBHOOK_SECRET=\n\n"
    env_content += "# Sentry (monitoring)\n"
    env_content += "NEXT_PUBLIC_SENTRY_DSN=\n"
    (project_dir / ".env.local").write_text(env_content, encoding="utf-8")

    # Generate .gitignore
    gitignore = "node_modules/\n.next/\n.env.local\n.env*.local\n*.log\ndist/\nbuild/\n.turbo/\n"
    (project_dir / ".gitignore").write_text(gitignore, encoding="utf-8")

    # Summary
    if all_skills or type_config["skills"]["required"] == "ALL":
        n_skills = len(load_all_skills())
    else:
        n_skills = len(type_config["skills"]["required"]) + len(type_config["skills"]["optional"])
    n_agents = len(type_config["agents"]["subagentes"]) + 1

    print(f"")
    print(f"  Projeto criado: PROJETOS/{name}/")
    print(f"  Tipo:           {project_type} ({type_config['complexity']} complexity)")
    print(f"  Skills:         {n_skills}")
    print(f"  Agentes:        {n_agents} ({len(type_config['agents']['subagentes'])} subagentes)")
    print(f"")
    print(f"  Arquivos gerados:")
    print(f"    CLAUDE.md     - Configuracao + skills + workflow")
    print(f"    AGENTS.md     - Arquitetura de agentes detalhada")
    print(f"    .env.local    - Template de variaveis de ambiente")
    print(f"    .gitignore    - Git ignore padrao")
    print(f"    src/          - Codigo-fonte")
    print(f"    tests/        - Testes")
    print(f"    docs/         - Documentacao")
    print(f"")
    print(f"  Proximo passo: cd PROJETOS/{name} e comece a trabalhar!")

    return True


def list_types():
    """List all available project types."""
    types = load_types()
    print("Tipos de projeto disponiveis:\n")
    for name, config in types.items():
        n_required = len(config["skills"]["required"]) if config["skills"]["required"] != "ALL" else "ALL"
        n_agents = len(config["agents"]["subagentes"]) + 1
        print(f"  {name:<16} {config['complexity']:<8} {str(n_required):>4} skills  {n_agents:>2} agentes  {config['description']}")
    print(f"\nUso: python init_project.py \"nome-do-projeto\" --type <tipo>")


def main():
    args = sys.argv[1:]

    if not args:
        print(__doc__)
        return

    if args[0] == "--types":
        list_types()
        return

    if args[0] == "--detect" and len(args) > 1:
        description = " ".join(args[1:])
        detected = detect_type(description)
        types = load_types()
        config = types[detected]
        print(f"Tipo detectado: {detected}")
        print(f"Descricao: {config['description']}")
        print(f"Complexidade: {config['complexity']}")
        print(f"\nUso: python init_project.py \"nome-do-projeto\" --type {detected}")
        return

    project_name = args[0]
    project_type = "fullstack"
    all_skills = False

    i = 1
    while i < len(args):
        if args[i] == "--type" and i + 1 < len(args):
            project_type = args[i + 1]
            i += 2
        elif args[i] == "--all-skills":
            all_skills = True
            i += 1
        else:
            i += 1

    create_project(project_name, project_type, all_skills)


if __name__ == "__main__":
    main()

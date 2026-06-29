#!/usr/bin/env python3
"""
Maestro Router - BM25 + keyword auto-routing for Agent Skills Hub.

Routes user queries to the best matching domain(s) and skill(s).
Uses BM25 ranking over domain keyword corpus + exact phrase matching.

Usage:
    python router.py "<query>"                    # Auto-route (top match)
    python router.py "<query>" --top 3            # Top 3 matches
    python router.py "<query>" --all              # All scored domains
    python router.py "<query>" --skill            # Resolve to specific skill
    python router.py --list                       # List all domains/skills
    python router.py --domains                    # List domains only
"""

import sys
import re
import json
from math import log
from pathlib import Path
from collections import defaultdict

SCRIPT_DIR = Path(__file__).parent
SKILLS_DIR = SCRIPT_DIR.parent.parent
REGISTRY_PATH = SKILLS_DIR / "_registry.json"
ROUTING_PATH = SCRIPT_DIR.parent / "ROUTING.md"

# BM25 parameters
K1 = 1.5
B = 0.75

# Bonus weights
EXACT_PHRASE_BONUS = 5.0
MULTI_WORD_BONUS = 2.0


def load_routing_keywords():
    """Parse ROUTING.md into domain -> keywords mapping."""
    domains = {}
    current_domain = None
    current_keywords = []

    text = ROUTING_PATH.read_text(encoding="utf-8")
    for line in text.splitlines():
        line = line.strip()
        if line.startswith("### "):
            if current_domain and current_keywords:
                domains[current_domain] = current_keywords
            current_domain = line[4:].strip()
            current_keywords = []
        elif current_domain and line:
            keywords = [k.strip().lower() for k in line.split(",") if k.strip()]
            current_keywords.extend(keywords)

    if current_domain and current_keywords:
        domains[current_domain] = current_keywords

    return domains


def load_registry():
    """Load _registry.json for skill listings."""
    if not REGISTRY_PATH.exists():
        return {}
    return json.loads(REGISTRY_PATH.read_text(encoding="utf-8"))


def load_skill_descriptions():
    """Load SKILL.md frontmatter descriptions for sub-skill routing."""
    skill_map = {}
    for skill_md in SKILLS_DIR.rglob("SKILL.md"):
        rel = skill_md.relative_to(SKILLS_DIR)
        parts = rel.parts
        if parts[0].startswith("_"):
            continue
        if len(parts) >= 2:
            skill_id = f"{parts[0]}/{parts[1]}"
        else:
            continue

        try:
            content = skill_md.read_text(encoding="utf-8")
        except Exception:
            continue

        desc = ""
        triggers = []
        in_frontmatter = False
        in_triggers = False
        for line in content.splitlines():
            if line.strip() == "---":
                if not in_frontmatter:
                    in_frontmatter = True
                    continue
                else:
                    break
            if in_frontmatter:
                if line.startswith("description:"):
                    desc = line.split(":", 1)[1].strip().strip('"').strip("'")
                elif line.strip() == "triggers:":
                    in_triggers = True
                elif in_triggers and line.strip().startswith("- "):
                    triggers.append(line.strip()[2:].strip().lower())
                elif in_triggers and not line.strip().startswith("- "):
                    in_triggers = False

        skill_map[skill_id] = {
            "description": desc,
            "triggers": triggers,
            "path": str(rel),
        }

    return skill_map


def tokenize(text):
    """Simple tokenizer: lowercase, split on non-alphanumeric."""
    return re.findall(r"[a-z0-9]+(?:[-_.][a-z0-9]+)*", text.lower())


def build_bm25_index(domain_keywords):
    """Build BM25 index from domain keyword corpus."""
    doc_freqs = defaultdict(int)
    doc_lengths = {}
    doc_tokens = {}
    total_length = 0
    n_docs = len(domain_keywords)

    for domain, keywords in domain_keywords.items():
        tokens = []
        for kw in keywords:
            tokens.extend(tokenize(kw))
        doc_tokens[domain] = tokens
        doc_lengths[domain] = len(tokens)
        total_length += len(tokens)
        for token in set(tokens):
            doc_freqs[token] += 1

    avg_dl = total_length / n_docs if n_docs > 0 else 1

    return {
        "doc_freqs": dict(doc_freqs),
        "doc_lengths": doc_lengths,
        "doc_tokens": doc_tokens,
        "avg_dl": avg_dl,
        "n_docs": n_docs,
    }


def bm25_score(query_tokens, domain, index):
    """Calculate BM25 score for a query against a domain."""
    score = 0.0
    dl = index["doc_lengths"].get(domain, 0)
    avg_dl = index["avg_dl"]
    n_docs = index["n_docs"]
    doc_tokens = index["doc_tokens"].get(domain, [])

    tf_map = defaultdict(int)
    for t in doc_tokens:
        tf_map[t] += 1

    for qt in query_tokens:
        tf = tf_map.get(qt, 0)
        if tf == 0:
            continue
        df = index["doc_freqs"].get(qt, 0)
        idf = log((n_docs - df + 0.5) / (df + 0.5) + 1)
        numerator = tf * (K1 + 1)
        denominator = tf + K1 * (1 - B + B * dl / avg_dl)
        score += idf * (numerator / denominator)

    return score


def exact_phrase_score(query_lower, keywords):
    """Bonus for exact phrase matches in keyword list."""
    score = 0.0
    for kw in keywords:
        if kw in query_lower:
            word_count = len(kw.split())
            if word_count >= 2:
                score += EXACT_PHRASE_BONUS * word_count
            else:
                score += EXACT_PHRASE_BONUS * 0.5
        elif query_lower in kw:
            score += EXACT_PHRASE_BONUS * 0.3
    return score


def route_query(query, domain_keywords, top_n=3):
    """Route a query to the best matching domain(s)."""
    query_lower = query.lower().strip()
    query_tokens = tokenize(query)

    if not query_tokens:
        return []

    index = build_bm25_index(domain_keywords)
    results = []

    for domain, keywords in domain_keywords.items():
        score = bm25_score(query_tokens, domain, index)
        score += exact_phrase_score(query_lower, keywords)

        if score > 0:
            results.append({"domain": domain, "score": round(score, 3)})

    results.sort(key=lambda x: x["score"], reverse=True)
    return results[:top_n]


def route_to_skill(query, domain, skill_map):
    """Within a domain, find the best matching skill."""
    query_lower = query.lower().strip()
    query_tokens = tokenize(query)
    candidates = []

    for skill_id, info in skill_map.items():
        if not skill_id.startswith(f"{domain}/"):
            continue

        score = 0.0

        for trigger in info["triggers"]:
            if trigger in query_lower:
                score += EXACT_PHRASE_BONUS * 2
            elif any(t in trigger for t in query_tokens):
                score += 1.0

        desc_tokens = tokenize(info["description"])
        for qt in query_tokens:
            if qt in desc_tokens:
                score += 0.5

        if score > 0:
            candidates.append({
                "skill": skill_id,
                "score": round(score, 3),
                "description": info["description"][:120],
            })

    candidates.sort(key=lambda x: x["score"], reverse=True)
    return candidates[:3]


def format_route_result(routes, skill_routes=None):
    """Format routing results for output."""
    if not routes:
        print("No matching domain found. Try being more specific.")
        print("Run: python router.py --list")
        return

    print(f"Query routed to {len(routes)} domain(s):\n")

    for i, r in enumerate(routes):
        marker = ">>" if i == 0 else "  "
        bar_len = int(r["score"] * 2)
        bar = "#" * min(bar_len, 40)
        print(f"  {marker} {r['domain']:<16} score={r['score']:<8} {bar}")

    if skill_routes:
        print(f"\nBest skill match(es) in '{routes[0]['domain']}':\n")
        for i, s in enumerate(skill_routes):
            marker = ">>" if i == 0 else "  "
            print(f"  {marker} {s['skill']}")
            if s["description"]:
                print(f"     {s['description']}")
            print()


def list_all():
    """Print all domains and their skills."""
    registry = load_registry()
    domains = registry.get("domains", {})

    total = 0
    print("Agent Skills Hub - All Domains & Skills\n")
    for domain, info in domains.items():
        skills = info.get("skills", [])
        total += len(skills)
        print(f"  [{domain}] ({len(skills)} skills)")
        print(f"    {info.get('description', '')[:80]}")
        for s in skills:
            print(f"      - {s}")
        print()

    print(f"Total: {len(domains)} domains, {total} skills")


def list_domains():
    """Print domain summary."""
    domain_keywords = load_routing_keywords()
    registry = load_registry()
    domains = registry.get("domains", {})

    print("Domains:\n")
    for domain in sorted(domain_keywords.keys()):
        n_keywords = len(domain_keywords[domain])
        n_skills = len(domains.get(domain, {}).get("skills", []))
        desc = domains.get(domain, {}).get("description", "")[:60]
        print(f"  {domain:<16} {n_skills:>3} skills  {n_keywords:>3} keywords  {desc}")


def main():
    args = sys.argv[1:]

    if not args:
        print(__doc__)
        return

    if args[0] == "--list":
        list_all()
        return

    if args[0] == "--domains":
        list_domains()
        return

    query = args[0]
    top_n = 3
    resolve_skill = False
    show_all = False

    i = 1
    while i < len(args):
        if args[i] == "--top" and i + 1 < len(args):
            top_n = int(args[i + 1])
            i += 2
        elif args[i] == "--skill":
            resolve_skill = True
            i += 1
        elif args[i] == "--all":
            show_all = True
            i += 1
        else:
            i += 1

    domain_keywords = load_routing_keywords()

    if show_all:
        top_n = len(domain_keywords)

    routes = route_query(query, domain_keywords, top_n=top_n)

    skill_routes = None
    if resolve_skill and routes:
        skill_map = load_skill_descriptions()
        skill_routes = route_to_skill(query, routes[0]["domain"], skill_map)

    format_route_result(routes, skill_routes)

    if routes:
        print(f"\n---")
        print(f"Primary: {routes[0]['domain']}")
        if skill_routes:
            print(f"Skill:   {skill_routes[0]['skill']}")


if __name__ == "__main__":
    main()

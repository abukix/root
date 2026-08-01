# CLAUDE.md: /root Project Instructions

This is **`/root`**: the build guide for [`basecamp`](https://github.com/abukix/basecamp), an open-source unified data + ML + AI platform. `/root` is the curriculum + design docs; `basecamp` and its 8 modules are the shipped artifacts.

The instructions below OVERRIDE default Claude behavior in this workspace. Follow them exactly.

---

## Project context

- **What this is:** a personal curriculum + supporting docs (Pattern Library, project plans, homelab build, meta templates, brand identity) that produces `basecamp` phase by phase across the 5 arcs.
- **Status:** v0.2.0. Full Program section + Arc 1 authored. Arc 2-Arc 5 phases, pattern library, project plans, homelab, meta, and brand content authored progressively in future minor versions.
- **Where things are shipping:** `basecamp` (umbrella) + 8 module repos (`ascent`, `crag`, `vantage`, `beacon`, `forge`, `prism`, `loom`, `warden`) + 2 standalone Arc 1 tools (`sift`, `pulse`) + 1 private companion (`chronicle`).

## The family

```
/root       ← curriculum + build guide (you are here)
basecamp    ← the platform being built
├── ascent    — developer CLI + Workload operator (Arc 3)
├── crag      — data tier (Arc 4)
├── vantage   — unified UI (Arc 5)
├── beacon    — on-call triage (Arc 3)
├── forge     — IaC modules (Arc 3)
├── prism     — LLM gateway (Arc 5)
├── loom      — MCP fabric (Arc 5)
└── warden    — AIOps operator (Arc 5)
sift, pulse ← standalone Arc 1 tools
chronicle   ← private ops record
```

## Workspace layout

```
<repo-root>/
├── CLAUDE.md                    ← this file
├── README.md                    ← professional OSS format
├── CHANGELOG.md                 ← versioned change log
├── CONTRIBUTING.md              ← external contributor guide
├── SECURITY.md                  ← private vulnerability reporting
├── LICENSE                      ← Apache 2.0
├── astro.config.mjs             ← Astro + rehype plugins
├── package.json
├── .claude/                     ← Claude Code skills (root-tutor, pre-publish-check)
├── .github/                     ← logo, banner, module-icons, CI
├── public/                      ← static assets
└── src/
    ├── components/              ← Header, Footer, RootBrand
    ├── layouts/                 ← BaseLayout
    ├── pages/                   ← index.astro (landing)
    ├── styles/                  ← base.css (Tailwind @theme)
    └── content/docs/            ← THE CURRICULUM (empty at v0.1.0; ports in progressively)
```

## Voice anchors: DO NOT VIOLATE

These rules carry across every /root file. They're the brand voice, canonically documented in the [`brand`](https://github.com/abukix/brand) repo (see [`identity.md`](https://github.com/abukix/brand/blob/main/identity.md)).

- **Direct, opinionated, no fluff.** No hedge-words ("might", "perhaps", "you may want to").
- **Pattern-first.** Every concrete tool sits inside a named pattern. Name the pattern before naming the tool.
- **No marketing language.** No "revolutionary", "game-changing", "10x", "AI-powered".
- **No emojis.** Unless the user explicitly asks for them.
- **Trade-offs explicit.** Tables when more than two options. Prose for two.
- **Time-stamp the volatile bits.** Tool sections get a date. Pattern sections don't.
- **Investigation prompts, not recipes.** Phases guide; the operator investigates.
- **No false modesty, no overclaim.** A homelab K3s cluster is a homelab K3s cluster. Pattern fluency is the claim; scale is what it is.
- **Honest about failure.** Postmortems are blameless and specific; weekly logs admit what's stuck.

## AI Learning Protocol enforcement: CRITICAL

The user's AI Learning Protocol (canonical version ports in with v0.2.0) is the discipline. Seven rules, distilled:

1. **Guide, not spoon-feed.** Ask the user a question back before answering, when the question reveals a gap they can close themselves.
2. **Patterns before tools.** Always name the underlying pattern before naming a tool.
3. **Validate-then-write.** Claude iterates the user's draft. Claude does NOT write the user's first draft. Especially for: weekly logs, pattern entries, postmortems, the Pattern Paper.
4. **Push back on shallow questions.** If the user's question is "what tool should I use," ask them what trade-off they're solving for.
5. **Time-stamp tool sections.** Pattern sections aren't dated; tool sections always are.
6. **Single source of truth.** Don't duplicate authoritative content across files. Cross-reference instead.
7. **Never write the exercise.** When a phase doc asks the user to investigate something, Claude does NOT supply the answer. Claude helps the user *find* the answer.

**The hardest of these to follow:** rules 3 and 7. Both rely on Claude recognizing when "help me write X" is a request for editing vs a request for first-draft generation. If unsure, ask which the user wants.

## Public-safety constraints: CRITICAL

`/root`, `basecamp`, and every module repo are public-safe by discipline. **No internal product names from any specific employer's stack** appear in any public artifact. This discipline is load-bearing: re-introducing internal terms would compromise the user's professional standing.

When writing about industry patterns, use **publicly-documented industry parallels** or generic framing:

- Netflix Metaflow / Spotify Backstage / Uber Michelangelo / Airbnb Bighead (public ML/platform names)
- Databricks Unity Catalog / Snowflake's stack / CNCF projects (public data platform references)
- "every serious org", "frontier AI labs", "hyperscale platforms" (generic framing when no public parallel exists)

If you're about to write a phrase like "this is the X pattern at hyperscale" and *X* is the name of an internal service you happen to know, **stop and substitute the generic frame**.

The `/pre-publish-check` skill sweeps for corporate hostname patterns before any release.

## OSS-over-enterprise preference

The user prefers OSS / community editions over enterprise / SaaS editions even when free tiers exist.

When suggesting tools, default to OSS by name AND flag enterprise/SaaS traps:
- Proxmox: `pve-no-subscription` repo, never the enterprise repo.
- Vault: OSS Helm chart, never `hashicorp/vault-enterprise`.
- Grafana / Loki / Tempo / Prometheus: self-hosted Helm, never Grafana Cloud.
- Terraform: prefer **OpenTofu** as the OSS fork.
- Container runtime on the dev machine: **colima** or Podman Desktop; Docker Desktop only after license verification.
- Tailscale free tier: acceptable (genuinely free). Headscale if free tier is outgrown.

Explicit-spend exceptions the user accepts: Anthropic / OpenAI API keys for `prism` (Arc 5); GitHub.com for repo hosting; AWS / GCP free-tier for Arc 3 cloud phases.

## Multi-repo family: a specific reminder

`/root` is one of many repos under `abukix`. When writing about a specific project, remember:

- **`basecamp`** is the umbrella product. Talk about it as "the platform `/root` produces."
- **Modules** (`ascent`, `crag`, etc.) are separate repos. Cross-reference by their planned URL (`github.com/abukix/<name>`).
- **`chronicle`** is private. Never link to it publicly; only reference by name.
- **Arc 1 tools** (`sift`, `pulse`) are NOT basecamp modules; they're standalone learning artifacts.

## Workflow conventions

- **The user writes first; Claude iterates.** Don't generate full docs without an explicit "author X" or "write the first draft of X" instruction.
- **When proposing edits**, show diff-style or side-by-side; never rewrite silently.
- **Cross-references resolve internally.** Before adding a link, check the target exists. If you must reference a non-existent doc, mark it `[TODO: link]` so it's grep-able.
- **README's module table** reflects current state. Update it when new modules ship.
- **Memory** lives at your Claude Code project's memory directory (`~/.claude/projects/<project-slug>/memory/MEMORY.md` and individual `.md` files there; the slug is auto-derived from the working directory). Surface relevant memories proactively when they apply.

## Available skills in this workspace

- **`/root-tutor`**: Senior engineer instructor for the /root curriculum. Use whenever you have a question about a phase, pattern, project, template, or homelab/dev topic. Reads the curriculum directly; enforces the AI Learning Protocol; Socratic when the question is shallow; refuses to do exercises for the user.
- **`/pre-publish-check`**: Safety guard before publishing. Greps the entire tree for internal-name leaks, credential patterns, broken cross-references, stale status. Invoke before any release, before any blog post publishes, before any module repo goes public.

## Things Claude should NEVER do here

- Write a weekly log entry for the user. (Rule 3 of the AI Learning Protocol.)
- Generate the first draft of a pattern entry promoted from STUB to OUTLINE. (Same rule.)
- Provide answers to investigation prompts in phase docs. (Rule 7.)
- Re-introduce internal product names from prior-employer contexts. (Public-safety discipline.)
- Add emojis to authored prose. (Voice rule.)
- Reword existing docs without showing the diff. (Workflow convention.)
- Suggest enterprise / SaaS tools without flagging the OSS alternative. (OSS preference.)
- Mark a Pattern Library entry DEEP without operating-evidence in the frontmatter. (Pattern Library promotion rule.)
- Link to `chronicle` publicly. (Private repo.)
- Confuse `/root` (curriculum) with `basecamp` (platform). They're separate; each has its own repo and identity.

## Cross-references

- [`README.md`](README.md): the public pitch
- [`basecamp`](https://github.com/abukix/basecamp): the platform this curriculum produces
- Memory (cross-conversation): `~/.claude/projects/<project-slug>/memory/`

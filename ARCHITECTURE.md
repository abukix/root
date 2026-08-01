# Architecture

How `/root` is structured: the curriculum shape, the artifact ladder, the site that renders it. Written for maintainers and adopters who want to understand how the pieces fit before contributing or forking.

---

## What `/root` is, structurally

`/root` is two things at once:

1. **A curriculum**: 5 arcs, 50 phases, ~100 patterns at maturity, 12 shipping artifacts.
2. **A site**: an Astro 7 + Tailwind 4 static site that renders the curriculum for daily use.

The curriculum is the primary artifact. The site is operational tooling that makes the curriculum navigable. Content and site ship in one repo because splitting them would require cross-repo coordination for every content edit.

---

## The curriculum shape

### 5 arcs

Each arc maps to a role transition and produces specific shipping artifacts:

| Arc | Theme | Role transition | Ships |
|---|---|---|---|
| Arc 1 | Software Engineering Foundations | Junior SWE | `sift`, `pulse` |
| Arc 2 | Backend Engineering | Mid Backend | *(services private; basecamp doesn't ship code until Arc 3)* |
| Arc 3 | Infrastructure & Platform Engineering | Senior DevOps / Platform | `forge`, `ascent`, `beacon`, `basecamp v0.2.0-v0.5.0` |
| Arc 4 | Data Engineering & ML Foundations | Senior Data / ML | `crag`, `basecamp v0.6.0-v0.7.0` |
| Arc 5 | AI Infrastructure | ML Platform / AI Infrastructure | `prism`, `loom`, `warden`, `vantage`, `basecamp v0.8.0-v1.0.0` |

Arcs are pace-flexible. Progress is measured by *pattern promotion* and *shipped artifacts*, not weeks elapsed. The order is fixed. The calendar is not.

### 50 phases

Each arc contains 8-14 phases (Arc 3 is the widest at 14; Arc 1/Arc 2/Arc 4 are 8; Arc 5 is 12). Each phase is self-contained and produces:

- **A named theme**: what the phase covers (e.g., "Phase 22: Infrastructure as Code")
- **Investigation prompts**: questions the operator must answer, not answers the phase supplies
- **A ship deliverable**: something concrete added to the repo family (a phase doc, a project entry, a pattern promotion, or a `basecamp` module version bump)
- **A final exam**: end-of-arc integration checkpoint (Arc 1-Arc 5 each have one)

Phase docs live at `src/content/docs/program/arc-N/phase-XX.md`.

### ~100 patterns across 10 categories

The pattern library survives the curriculum. Tools change every 5 years; patterns don't change in 30. Patterns are the durable knowledge artifact.

**Categories** *(load-bearing framing: every pattern belongs to exactly one)*:

1. `foundations`: control loops, declarative state, idempotence, backpressure
2. `architecture`: decoupling, event-driven, hexagonal, CQRS
3. `storage-and-data`: table formats, catalogs, WAL, CAP trade-offs
4. `distributed-systems`: consensus, quorums, gossip, sharding
5. `networking`: service mesh, load balancing, CDN, DNS
6. `security-and-policy`: RBAC, capability tokens, secret rotation, network policy
7. `infrastructure-and-platform`: IaC, GitOps, operators, workload abstraction
8. `observability-and-ops`: SLO/SLI, tracing, logging, alerting
9. `data-engineering`: Lakehouse, streaming, feature stores, catalogs
10. `ml-systems`: model serving, gateways, RAG, agents

### Depth ladder: STUB → OUTLINE → DEEP

Every pattern entry is at one of three depths. Promotion up the ladder requires evidence.

| Depth | What's in it | Promotion criterion |
|---|---|---|
| **STUB** | Pattern named, shape sketched (1-2 paragraphs), 2-4 concrete real-world instances listed, 2-3 canonical references cited | The pattern is *identified* as load-bearing |
| **OUTLINE** | PROBLEM / PRINCIPLES / TRADE-OFFS / TOOLS sections. Time-stamped tool section. | The relevant phase teaches it (the operator has *worked with* it) |
| **DEEP** | Adds MASTERY / COMPARE / OPERATE / CONTRIBUTE sections. Frontmatter has `deep_since:` date + `operating_evidence:` list. | 6+ months of operating it on `basecamp` (the operator has *lived with* it) |

Promotion is one-directional. DEEP entries can add sections but never demote back to OUTLINE.

### The 12 shipping artifacts

`/root` produces:

- **`basecamp` umbrella**: the composition repo (Arc 3+)
- **8 basecamp modules**: `ascent`, `crag`, `vantage`, `beacon`, `forge`, `prism`, `loom`, `warden` (Arc 3-Arc 5)
- **2 standalone Arc 1 tools**: `sift` (regex CLI, Python), `pulse` (network probe, Go)
- **`/root` itself**: the curriculum + site (this repo)

Each shipping artifact has its own GitHub repo. `/root` is the design + build guide; the other 11 are what gets built by following it.

---

## Content layout

```
src/content/docs/
├── program/                    ← the curriculum spine
│   ├── overview.md             ← Master Plan (the structure)          [v0.1.0]
│   ├── capstone.md             ← integrated arc                     [v0.1.0]
│   ├── story.md                ← narrative + the run-pray-build rhythm       [v0.1.0]
│   ├── ai-learning-protocol.md ← the 7 rules of AI-assisted learning         [v0.1.0]
│   ├── platform-patterns.md    ← industry-parallel framing                   [v0.1.0]
│   ├── glossary.md             ← term definitions                            [v0.1.0]
│   ├── reading-list.md         ← canonical references                        [v0.1.0]
│   └── arc-N/                 ← 5 dirs × 8-14 phase docs each
│       ├── index.md            ← year overview
│       ├── phase-XX.md         ← individual phase
│       └── final-exam.md       ← year-end integration                        [all Arcs: v0.1.0]
├── projects/                   ← 12 project plans (one per shipping artifact) [v0.6.0+]
├── patterns/                   ← ~100 pattern entries across 10 category dirs   [v0.4.0]
│   └── <category>/<name>.md
└── meta/                       ← 8 templates: weekly-log, runbook, postmortem, [v0.6.0+]
                                  ADR, pattern, blog, README, pattern-paper
```

Two adjacent Abukix repos referenced by-name from `/root` but sourced independently:
- **[`homelab`](https://github.com/abukix/homelab)**: hardware (server + dev-machine) + operating notes
- **[`brand`](https://github.com/abukix/brand)**: voice anchors + typography + colors + wordmark

At v0.1.0 (the initial public release): full Program section (7 docs) + Arc 1 (8 phases + index + final exam) are authored. Everything else (Arc 2-Arc 5 phases, patterns, projects, meta) ports in progressively per [ROADMAP.md](./ROADMAP.md). `homelab` and `brand` ship on their own cadence.

---

## Site architecture

### Framework stack

| Layer | Choice | Why |
|---|---|---|
| **Framework** | Astro 7 | Content-first, minimal JS, MDX + Markdown support, faster than Next.js for docs |
| **Styling** | Tailwind CSS 4 (via `@tailwindcss/vite`) | Config-in-CSS via `@theme` block, no separate JS config file |
| **Typography** | Inter Variable (body/display), JetBrains Mono Variable (code + brand wordmark) | Free, variable weight, matches the terminal-and-editor aesthetic |
| **Content** | Astro content collections (`glob` loader) | Type-safe frontmatter, incremental builds |
| **Rendering** | Custom Astro pages (no Starlight) | Full visual control; Starlight fights the desired dark-gradient aesthetic |
| **Hosting** | Cloudflare Pages | Preview per PR, free tier, fast CDN |
| **Search** | Pagefind (planned; not yet wired) | Static-generated search index |

Framework choice is ratified in [ADR-0002](./adrs/0002-curriculum-site-v0-framework-and-stack.md).

### Component structure

```
src/
├── components/
│   ├── Header.astro           ← fixed top nav
│   ├── Footer.astro           ← 3-column footer
│   └── RootBrand.astro        ← inline gradient rendering of "/root" in prose
├── layouts/
│   └── BaseLayout.astro       ← shell: head + Header + <slot/> + Footer + theme script
├── pages/
│   ├── index.astro            ← landing
│   └── program/               ← docs rendering (v0.2.0)
│       ├── index.astro        ← Program section index
│       └── [...slug].astro    ← dynamic route: renders any program/*.md
├── styles/
│   └── base.css               ← Tailwind @theme block + global styles
├── content/
│   ├── docs/                  ← the curriculum (see Content layout above)
│   └── config.ts              ← content collection schema
└── astro.config.mjs           ← Astro + rehype config
```

### The `rehypeRootBrand` plugin

Custom rehype plugin at `astro.config.mjs`. Wraps every `/root` occurrence in prose with `<span class="root-brand">` (gradient-painted). Skips `<code>`, `<pre>`, `<a>`, `<script>`, `<style>` so URLs / identifiers stay untouched. Regex: `/\/root(?![\w/-])/g`.


### Theme

Dark by default. Toggle via `data-theme="light"` on `<html>`. Preference persists in `localStorage`. Handled by inline script in Header + BaseLayout.

---

## The `/root` family

`/root` is one of several repos under `abukix`:

| Repo | Kind | Status | Purpose |
|---|---|---|---|
| [`abukix/root`](https://github.com/abukix/root) | Public | Active (v0.1.0) | This repo: curriculum + site |
| [`abukix/basecamp`](https://github.com/abukix/basecamp) | Public | Active (v0.1.0 design; v0.2.0 code lands Arc 3) | The platform this curriculum produces |
| `abukix/forge`, `ascent`, `beacon` | Public | Planned (Arc 3) | Infrastructure tier basecamp modules |
| `abukix/crag` | Public | Planned (Arc 4) | Data tier basecamp module |
| `abukix/prism`, `loom`, `warden`, `vantage` | Public | Planned (Arc 5) | AI + UI tier basecamp modules |
| [`abukix/sift`](https://github.com/abukix/sift), [`abukix/pulse`](https://github.com/abukix/pulse) | Public | Planned (Arc 1) | Standalone Arc 1 tools |
| Private ops corpus | Private | Active (Arc 1 onward) | Personal weekly logs, runbooks, postmortems; RAG source for `warden` |

Cross-repo references use full URLs (`github.com/abukix/<name>`). Multi-repo means separate release cadences per module. `/root` doesn't dictate release timing for anything downstream.

---

## Voice anchors: architectural, not decorative

The curriculum's voice is load-bearing, not stylistic:

- **Pattern-first framing**: every tool sits inside a named pattern
- **Direct, opinionated, no fluff**: no hedge-words, no marketing language
- **Trade-offs explicit**: tables when > 2 options, prose for two
- **Time-stamp the volatile bits**: tool sections get a date, patterns don't
- **Investigation prompts, not recipes**: phases guide; the operator investigates
- **No emojis** in authored prose
- **Honest about failure**: postmortems blameless and specific

Full voice rules live in the external [`brand`](https://github.com/abukix/brand) repo (see [`identity.md`](https://github.com/abukix/brand/blob/main/identity.md)). Enforcement is manual: reviewers check every PR against those anchors.

---

## Public-safety discipline

`/root` is public-safe by discipline. **No internal product names from any specific employer's stack appear in any public artifact.** Industry parallels use publicly-documented references (Netflix Metaflow, Spotify Backstage, Uber Michelangelo, Airbnb Bighead, Databricks Unity Catalog, LiteLLM, vLLM, etc.) or generic "frontier-lab" framing.

Enforcement: the `pre-publish-check` Claude Code skill sweeps the tree before every release; CI runs yaml-lint + gitleaks; reviewers check for internal-name leakage at PR time.

---

## What `/root` is NOT

- **Not a bootcamp.** No cohorts, no deadlines, no certificates. It's a curriculum you can follow, adapt, or fork.
- **Not a certification.** No exam that a third party grades. The final exams are self-administered honesty checks.
- **Not university replacement.** It's a role-transition guide (SWE → Platform → ML Platform), not a CS degree.
- **Not vendor-neutral.** It's opinionated about tools within named patterns. When the tool ages, the pattern stays; the tool section gets a new date.
- **Not community-designed.** It's one operator's authored plan. Contributions accepted at the edges (typos, factual corrections, industry parallels); structural changes flow through the maintainer.
- **Not a marketing project.** No newsletter, no analytics, no growth metric. The site exists because the operator needs the curriculum daily-usable.

---

## The `basecamp` co-evolution

`/root` and `basecamp` co-evolve:

- `/root` defines *what to learn* and *what to ship* in each phase.
- `basecamp` is *the thing shipped*: the concrete platform composed of 8 modules.
- Every phase in `/root` (Arc 3+) maps to a specific `basecamp` version bump.
- Breaking changes in `/root`'s phase design require rethinking `basecamp` sequencing. See [`basecamp/ROADMAP.md`](https://github.com/abukix/basecamp/blob/main/ROADMAP.md).

Neither can ship in isolation. `/root` without `basecamp` is theory; `basecamp` without `/root` is just another platform stack.

---

## Cross-references

- [`README.md`](./README.md): what `/root` is, at a glance
- [`ROADMAP.md`](./ROADMAP.md): what ports when
- [`CHANGELOG.md`](./CHANGELOG.md): what's shipped
- [`CONTRIBUTING.md`](./CONTRIBUTING.md): how to submit changes
- [`adrs/`](./adrs/): ratified architectural decisions
- [`basecamp/ARCHITECTURE.md`](https://github.com/abukix/basecamp/blob/main/ARCHITECTURE.md): the platform this curriculum produces

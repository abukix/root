<p align="center">
  <img src="./.github/logo.svg" alt="/root slash mark" width="120">
</p>

<h1 align="center"><code>/root</code></h1>

<p align="center">
  <strong>The build guide for basecamp.</strong>
  <br>
  A curriculum from Software Engineering Foundations to ML Platform / AI Infrastructure, pattern-first, platform-driven, producing an open-source unified data + ML + AI platform.
</p>

<p align="center">
  <a href="https://root.abukix.dev">Website</a>
  ·
  <a href="https://github.com/abukix/basecamp">basecamp</a>
  ·
  <a href="./CHANGELOG.md">Changelog</a>
  ·
  <a href="./LICENSE">License</a>
</p>

<p align="center">
  <img alt="Version"    src="https://img.shields.io/github/package-json/v/abukix/root?color=a855f7&label=version">
  <img alt="License"    src="https://img.shields.io/badge/license-Apache_2.0-blue">
  <img alt="Built with" src="https://img.shields.io/badge/built_with-Astro_7-orange">
  <img alt="Status"     src="https://img.shields.io/badge/status-in_active_operation-a855f7">
</p>

---

## What `/root` is

`/root` is a self-authored curriculum, published as a public docs site, that walks from Software Engineering Foundations through Backend Engineering, Infrastructure & Platform Engineering, Data Engineering & ML Foundations, and lands at ML Platform / AI Infrastructure Engineer.

**Every phase produces a real thing that ships publicly.** The curriculum's output is [`basecamp`](https://github.com/abukix/basecamp), an open-source unified data + ML + AI platform composed of 8 modules. `/root` is the design and build guide that produces basecamp module by module.

The bet: **great engineers reason in patterns, not tools.** Tools change every few years; patterns don't. `/root` builds the pattern reflex from the first phase, pattern first, tool second, so when the tool changes the reflex still fires.

## The program

- **5 progression stages**: Software Engineering Foundations → Backend Engineering → Infrastructure & Platform Engineering → Data Engineering & ML Foundations → AI Infrastructure. Each stage maps to a role transition.
- **50 phases**: self-contained learning units, each with an 8-step pattern-first scaffold (PROBLEM → PRINCIPLES → TRADE-OFFS → TOOLS → MASTERY → COMPARE → OPERATE → CONTRIBUTE).
- **~100 patterns across 10 categories**: the durable knowledge artifact that survives the specific tools you learn.
- **12 public artifacts**: 8 `basecamp` modules, 2 standalone Arc 1 tools (`sift`, `pulse`), the `basecamp` umbrella, and `/root` itself.
- **Pace-flexible.** Progress is measured by *pattern promotion* and *shipped artifacts*, not weeks elapsed. Your pace is yours.

| Stage | Theme | Role transition | Ships |
|---|---|---|---|
| 1 | Software Engineering Foundations | Junior SWE | `sift`, `pulse` |
| 2 | Backend Engineering | Mid Backend | *(services private practice; basecamp doesn't ship until stage 3)* |
| 3 | Infrastructure & Platform Engineering | Senior DevOps / Platform | `forge`, `ascent`, `beacon` |
| 4 | Data Engineering & ML Foundations | Senior Data / ML | `crag` |
| 5 | AI Infrastructure | ML Platform / AI Infrastructure | `prism`, `loom`, `warden`, `vantage` |

## What gets shipped

`/root` produces **basecamp**, the unified platform, plus standalone Arc 1 tools and companion repos.

<table>
  <tr>
    <th width="80">&nbsp;</th>
    <th>Repo</th>
    <th>What it is</th>
    <th>Ships in</th>
  </tr>
  <tr>
    <td align="center"><img src="./.github/module-icons/basecamp.svg" width="48" alt="basecamp"></td>
    <td><a href="https://github.com/abukix/basecamp"><code>basecamp</code></a></td>
    <td>The platform. Umbrella repo composing the 8 modules below.</td>
    <td>Arc 3 → Arc 5</td>
  </tr>
  <tr>
    <td align="center"><img src="./.github/module-icons/ascent.svg" width="48" alt="ascent"></td>
    <td><a href="https://github.com/abukix/ascent"><code>ascent</code></a></td>
    <td>Developer CLI + Workload operator.</td>
    <td>Arc 3 Phase 26</td>
  </tr>
  <tr>
    <td align="center"><img src="./.github/module-icons/crag.svg" width="48" alt="crag"></td>
    <td><a href="https://github.com/abukix/crag"><code>crag</code></a></td>
    <td>Data tier: Iceberg + Trino + MinIO + Spark/Flink.</td>
    <td>Arc 4 Phase 31</td>
  </tr>
  <tr>
    <td align="center"><img src="./.github/module-icons/vantage.svg" width="48" alt="vantage"></td>
    <td><a href="https://github.com/abukix/vantage"><code>vantage</code></a></td>
    <td>The unified UI dashboard.</td>
    <td>Arc 5 Capstone</td>
  </tr>
  <tr>
    <td align="center"><img src="./.github/module-icons/beacon.svg" width="48" alt="beacon"></td>
    <td><a href="https://github.com/abukix/beacon"><code>beacon</code></a></td>
    <td>On-call triage dashboard.</td>
    <td>Arc 3 Phase 30</td>
  </tr>
  <tr>
    <td align="center"><img src="./.github/module-icons/forge.svg" width="48" alt="forge"></td>
    <td><a href="https://github.com/abukix/forge"><code>forge</code></a></td>
    <td>Terraform + Crossplane infrastructure modules.</td>
    <td>Arc 3 Phase 22</td>
  </tr>
  <tr>
    <td align="center"><img src="./.github/module-icons/prism.svg" width="48" alt="prism"></td>
    <td><a href="https://github.com/abukix/prism"><code>prism</code></a></td>
    <td>LLM gateway: routing, caching, observability.</td>
    <td>Arc 5 Phase 43-46</td>
  </tr>
  <tr>
    <td align="center"><img src="./.github/module-icons/loom.svg" width="48" alt="loom"></td>
    <td><a href="https://github.com/abukix/loom"><code>loom</code></a></td>
    <td>MCP server fabric: tools for AI agents.</td>
    <td>Arc 5 Phase 48</td>
  </tr>
  <tr>
    <td align="center"><img src="./.github/module-icons/warden.svg" width="48" alt="warden"></td>
    <td><a href="https://github.com/abukix/warden"><code>warden</code></a></td>
    <td>AIOps operator: agents that operate basecamp.</td>
    <td>Arc 5 Phase 50</td>
  </tr>
  <tr>
    <td align="center"><img src="./.github/module-icons/sift.svg" width="48" alt="sift"></td>
    <td><a href="https://github.com/abukix/sift"><code>sift</code></a></td>
    <td>Pattern-first regex CLI in Python.</td>
    <td>Arc 1 Phase 2</td>
  </tr>
  <tr>
    <td align="center"><img src="./.github/module-icons/pulse.svg" width="48" alt="pulse"></td>
    <td><a href="https://github.com/abukix/pulse"><code>pulse</code></a></td>
    <td>Network probe scanner in Go.</td>
    <td>Arc 1 Phase 4</td>
  </tr>
</table>

### How you interact with basecamp

Once basecamp is deployed, only 2 of its 8 modules are the user-facing surfaces:

- **`vantage`**: the unified web UI. Open it in your browser; see every workload, deploy, alert, agent activity, data query, model, and metric in one dashboard.
- **`ascent-cli`**: the developer CLI. From your terminal you deploy workloads, run one-off ops commands, and script things you don't need to click through the UI.

The other 6 modules (`crag`, `beacon`, `forge`, `prism`, `loom`, `warden`) are **internal architecture**. basecamp uses them behind the scenes. You call `https://prism.homelab.local/v1/chat/completions` and get an OpenAI-compat LLM response; you don't need to know that `prism` is doing the routing. You query data through `vantage`'s data explorer; `crag` handles the Trino/Iceberg mechanics underneath.

Rough analogy: if basecamp is AWS, `vantage` is the AWS Console, `ascent-cli` is the `aws` CLI, and the other 6 modules are the services that Console and CLI talk to.

## Pattern library

The library survives the program. Kubernetes gets replaced by whatever comes next; the entries on control loops, declarative state, and reconciliation stay valid. Only the Tools section of each entry ages.

Every pattern lives on a depth ladder:

- **STUB**: the pattern is named, its shape sketched, concrete real-world instances listed, canonical references cited.
- **OUTLINE**: PROBLEM / PRINCIPLES / TRADE-OFFS / TOOLS. Promoted when the relevant phase teaches it.
- **DEEP**: MASTERY / COMPARE / OPERATE / CONTRIBUTE. Promoted after 6+ months of operating it on `basecamp`.

**Categories** *(~100 patterns total across the 5 arcs)*: `foundations`, `architecture`, `storage-and-data`, `distributed-systems`, `networking`, `security-and-policy`, `infrastructure-and-platform`, `observability-and-ops`, `data-engineering`, `ml-systems`.

## Current state: v0.1.0

`/root` ships with the **full curriculum authored**:

- **7 Program docs**: Master Plan, Capstone, Story, AI Learning Protocol, Platform Patterns, Glossary, Reading List
- **50 phase docs across 5 arcs**: Software Engineering Foundations, Backend Engineering, Infrastructure & Platform Engineering, Data Engineering & ML Foundations, AI Infrastructure
- **5 arc indexes + 5 arc final exams**: orientation per arc plus integration checkpoints

**Ships in future minor versions:**
- **v0.2.0**: Pattern library shell (index + 10 category indexes + first STUB entries covering patterns Arc 1-Arc 2 reference)
- **v0.3.0**: 8 meta templates + 12 project plans
- **v0.4.0+**: Progressive pattern deepening, STUB to OUTLINE to DEEP promotions tied to real operating evidence

**Adjacent Abukix repos** (referenced by name; shipped on their own cadence):
- [`homelab`](https://github.com/abukix/homelab): hardware and dev-machine setup
- [`brand`](https://github.com/abukix/brand): voice anchors, typography, colors, wordmark

Everything above is authored progressively in `/root`. There's no external source. `/root` is the single source of truth for the curriculum and for `basecamp`'s design.

## Run locally

```bash
git clone https://github.com/abukix/root.git
cd root
npm install
npm run dev
```

Then open [`http://localhost:4321`](http://localhost:4321).

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run check` | TypeScript + Astro diagnostics |

Requires Node.js ≥ 24.

## The family

`/root` is one of several repos under the `abukix` umbrella:

- [**`/root`**](https://github.com/abukix/root) *(you are here)*: the build guide and single source of truth for `basecamp`'s design
- [**`abukix/basecamp`**](https://github.com/abukix/basecamp): the platform `/root` produces
- **Module repos**: `ascent`, `crag`, `vantage`, `beacon`, `forge`, `prism`, `loom`, `warden` (created as their phase activates)
- **Standalone tools**: [`sift`](https://github.com/abukix/sift), [`pulse`](https://github.com/abukix/pulse) (Arc 1 learning tools)

## Voice and authoring

Direct, opinionated, no fluff. Pattern-first framing. Trade-offs named explicitly. Investigation prompts, not recipes: phase docs guide, the operator investigates. Time-stamped tool sections; pattern sections aren't dated. Substance over polish; visual identity v1 is deferred to Arc 5 Capstone.

## Public safety

All prior-employer-internal product names are scrubbed from `src/content/docs/`. The corpus references only publicly-documented industry parallels (Netflix Metaflow, Spotify Backstage, Uber Michelangelo, Airbnb Bighead, Databricks Unity Catalog, etc.) or generic "frontier-lab" framing.

A `pre-publish-check` Claude Code skill runs public-safety sweeps before any release.

## Contributing

Typo fixes, broken-link repairs, and fact corrections are welcome. Curriculum scope changes are intentionally out of scope; this is one operator's authored plan, not a community-designed program. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Where to ask

- **Question or discussion**: [GitHub Discussions](https://github.com/abukix/root/discussions)
- **Bug or broken link**: [GitHub Issues](https://github.com/abukix/root/issues)
- **Security-relevant**: [SECURITY.md](SECURITY.md) (private path; do NOT open a public issue)
- **Direct**: `me@abukix.dev`

## License

[Apache License 2.0](LICENSE). Covers prose, code, templates, and skills, everything in the repo.

---

<p align="center">
  <sub>
    Built in public by <a href="https://github.com/abukix">@abukix</a> · <a href="https://root.abukix.dev">root.abukix.dev</a>
  </sub>
</p>

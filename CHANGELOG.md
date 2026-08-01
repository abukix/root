# Changelog

All notable changes to `/root` are documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project loosely adheres to semantic versioning. Major versions correspond to multi-phase additions or structural reorganizations; minor versions correspond to new sections or significant content additions; patches correspond to fixes, typos, and small expansions.

## [Unreleased]

_No changes staged yet._

---

## [0.1.0] - 2026-07-09

Initial public release of `/root`, **the build guide for [`basecamp`](https://github.com/abukix/basecamp)**, an open-source unified data + ML + AI platform. Ships the site framework, the curriculum-appropriate discipline layer, the docs rendering system, and the **full authored curriculum**: 7 Program docs + 50 phase docs across 5 arcs + 5 arc indexes + 5 arc final exams. 67 markdown files.

### Added

#### Site framework

- **Astro 7 + Tailwind 4 site**: pure Astro (no Starlight), Tailwind 4 via `@tailwindcss/vite`, CSS-native `@theme` config.
- **BaseLayout**: top-level shell with Header + Footer + main slot; dark/light theme toggle via `data-theme` attribute.
- **Header**: nav with `/root` wordmark, `Program` link, `basecamp` link, `Changelog` link.
- **Footer**: 3-column layout: brand + family repos (basecamp, sift, pulse, GitHub) + external links.
- **RootBrand component**: inline gradient rendering of `/root` in prose (matches the family visual identity).
- **`rehypeRootBrand` plugin** in `astro.config.mjs`: auto-wraps `/root` in markdown body prose with the family gradient.
- **Landing page** (`src/pages/index.astro`): hero + "the bet" + basecamp module cards + current state + links to family.
- **Docs rendering system**: dynamic `[...slug]` route at `/program/*` renders every content-collection entry with Tailwind-Typography-style prose CSS + breadcrumbs + back-navigation.
- **Program section index** at `/program/`: lists the 7 Program docs + all 5 arcs (all clickable at v0.1.0).

#### Content: the Program section

Authored in this release (7 docs, ~2000 lines):

- [`program/overview.md`](src/content/docs/program/overview.md): **Master Plan.** The structural overview: what /root is, the bet, the 5 arcs at a glance, the pattern-first scaffold, what you build (basecamp), the shipping portfolio, hardware and cloud requirements, reading order.
- [`program/capstone.md`](src/content/docs/program/capstone.md): **The Capstone: `basecamp v1.0.0`.** The integrated build. 12 shipping artifacts + 8 modules compose into one platform.
- [`program/story.md`](src/content/docs/program/story.md): **The Story.** Narrative arc, run-pray-build rhythm, arc-by-arc texture.
- [`program/ai-learning-protocol.md`](src/content/docs/program/ai-learning-protocol.md): **AI Learning Protocol.** The 7 rules for using AI in the curriculum without becoming a crutch.
- [`program/platform-patterns.md`](src/content/docs/program/platform-patterns.md): **Platform Patterns in the Industry.** How Netflix, Spotify, Uber, Airbnb, and frontier AI labs implement the same patterns /root teaches.
- [`program/glossary.md`](src/content/docs/program/glossary.md): **Glossary.** Canonical definitions of /root terminology.
- [`program/reading-list.md`](src/content/docs/program/reading-list.md): **Reading List.** Canonical references for terms and concepts across the program.

#### Content: all 5 Arcs (50 phase docs)

Authored in this release (60 docs across the 5 arcs):

- **Arc 1: Software Engineering Foundations** (10 files): Linux, Python (`sift` v0.1), DSA, Go (`pulse` v0.1), architecture patterns (DDD/clean/hexagonal/repository), performance & profiling, testing patterns, Git + CI/CD + release engineering. Exit ramp: Junior SWE.
- **Arc 2: Backend Engineering** (10 files): SQL & Postgres at depth, Redis & caching, HTTP/REST/gRPC & API design, auth patterns, Docker fluency, message queues + event-driven patterns, service observability, backend-at-scale patterns. Exit ramp: Mid Backend.
- **Arc 3: Infrastructure & Platform Engineering** (16 files): OS internals, networking deep, containers from scratch, Kubernetes + GitOps (Phase 20), distributed systems theory, IaC ships `forge` (Phase 22), one cloud deep, multi-cloud (basecamp goes public), service mesh + zero-trust, platform engineering ships `ascent` (Phase 26), secrets lifecycle, observability at platform depth, FinOps, reliability engineering ships `beacon` (Phase 30). Exit ramp: Senior DevOps / SRE / Cloud / Platform.
- **Arc 4: Data Engineering & ML Foundations** (10 files): data lakehouse ships `crag` v0 (Phase 31), stream processing (Phase 32), batch + orchestration (Phase 33), Python ML stack, classical ML, deep learning fundamentals, distributed training (Phase 37), model serving infrastructure (Phase 38). Exit ramp: Senior Data / ML.
- **Arc 5: AI Infrastructure** (14 files): ML lifecycle (Phase 39), feature stores (Phase 40), ML eval + monitoring (Phase 41), vector stores + embeddings + RAG (Phase 42), LLM serving deep (Phase 43-44), inference optimization (Phase 44), fine-tuning + PEFT (Phase 45), LLM gateway ships `prism` (Phase 46), prompt engineering (Phase 47), agent runtime + MCP ships `loom` (Phase 48), AI security + observability (Phase 49), AIOps ships `warden` (Phase 50), Capstone ships `vantage` = `basecamp v1.0.0`. Exit ramp: ML Platform / AI Infrastructure.

#### Public-facing identity

- **Visual identity v0**: `basecamp` family gradient (purple → pink → orange). Applied to:
  - `public/favicon.svg`: `/root` slash mark, gradient-painted
  - `.github/logo.svg`: same as favicon, for repo display
  - `.github/banner.svg`: README banner (1280×384) with slash mark + wordmark + tagline
  - `.github/module-icons/`: 11 SVG icons (basecamp + 8 modules + sift + pulse)
- **README.md**: professional OSS format with banner, badges, module table, "current state" section, family cross-references. Positioned around "the build guide for basecamp."
- **CLAUDE.md**: Claude Code project instructions for the new `/root` shape (basecamp-oriented framing, 8-module naming, multi-repo family, public-safety discipline).

#### CNCF-graduated discipline layer

#### Discipline layer (curriculum-appropriate subset)

- **CONTRIBUTING.md**: how to contribute, voice anchors, public-safety constraint, AI-assisted contribution policy.
- **SECURITY.md**: private vulnerability reporting (GitHub Private Vulnerability Reporting + email).
- **CODE_OF_CONDUCT.md**: adopts [Contributor Covenant 2.1](https://www.contributor-covenant.org/version/2/1/code_of_conduct/); enforcement contact + ladder.
- **ARCHITECTURE.md**: curriculum shape + site architecture (parity with `basecamp/ARCHITECTURE.md`).
- **ROADMAP.md**: version milestones through v1.0.0 with dependency graph.
- **NOTICE**: Apache 2.0 attribution.
- **`.github/ISSUE_TEMPLATE/`**: bug report + feature request + config (routes to Discussions).
- **LICENSE**: Apache 2.0.

*Deliberately NOT included:* `GOVERNANCE.md`, `MAINTAINERS.md`, `ADOPTERS.md`, `RELEASING.md`, `SUPPORT.md`. Those are basecamp's discipline (real code, real composition contract, real adopters). `/root` is a curriculum + docs site; those files would be ceremonial not useful here. Support paths and maintainer contact live in the README's "Where to ask" section.

#### ADRs

- **ADR-0001**: Solo operator with disciplined review (no fake-team multi-account). Encodes the branch → PR → CI → overnight-review → merge workflow.
- **ADR-0002**: Curriculum site v0, framework, deployment, domain, and identity stack. Astro 7 + Tailwind 4 + Cloudflare Pages + `root.abukix.dev`.

#### Claude Code project skills

- **`root-tutor`**: Senior engineer instructor for the curriculum. Enforces the AI Learning Protocol; Socratic when the question is shallow; refuses to do exercises for the user.
- **`pre-publish-check`**: Safety guard before publishing. Greps for internal-name leaks, credential patterns, broken cross-references, stale status. Invoke before any release, before any blog post publishes, before any module repo goes public.

#### Repo hygiene

- **`.npmrc`** pins `registry=https://registry.npmjs.org/`. Protects against `~/.npmrc` bleed from other machines.
- **`.gitignore`**: standard; `public/` explicitly tracked (Astro convention).
- **`.github/workflows/ci-check.yml`**: yaml-lint + gitleaks on every PR.
- **`.github/pull_request_template.md`**: prompts author for summary, why, validation, risk, public-safety check.

### Notes

- **The full curriculum is authored at v0.1.0.** All 50 phase docs across all 5 arcs are written. Future minor versions add supporting content (pattern library, meta templates, homelab guide, project plans) and progressively promote patterns from STUB → OUTLINE → DEEP as the author operates each phase and generates evidence.
- **Content is authored in `/root`.** `/root` is the single source of truth. There's no external source. See [ROADMAP.md](./ROADMAP.md) for the full version milestone table.
- **`basecamp` as coherent product target.** Every phase in Arc 3-Arc 5 maps to a specific `basecamp` module version bump; every shipping artifact has a defined role in the 8-module composition.

---

## Versioning convention

- **PATCH (`0.x.y`)**: typo fixes, broken-link repairs, small clarifications, time-stamp bumps on tool sections.
- **MINOR (`0.x.0`)**: new pattern entries (STUB → OUTLINE → DEEP promotions), new templates, new ADRs, single-section additions, year-phase slices.
- **MAJOR (`x.0.0`)**: structural reorganization, new top-level section, or curriculum-scope changes ratified by an ADR.

Current state is **0.1.0**, the initial public release. **1.0.0** ships when the author has operated at least Arc 1 of the program (first 5-10 phases completed, weekly logs landing reliably, `basecamp v1.0.0` running end-to-end on the homelab). See [ROADMAP.md](./ROADMAP.md) for the v0.x → v1.0 path.

## How to read this changelog

- **Latest at top.** The "Unreleased" section accumulates work until the next release.
- **Date format**: `YYYY-MM-DD`.
- **Categories** within each release: `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`.
- **Cross-references**: when a change references an ADR, the ADR number is named (e.g., "per ADR-0001").


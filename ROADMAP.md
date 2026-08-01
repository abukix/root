# Roadmap

`/root` ships content in **minor version increments** aligned with the curriculum's structural shape. Every minor version delivers a specific slice of authored content; patches deliver typo fixes, cross-reference repairs, and small clarifications.

**Nothing here is aspirational fiction.** Each milestone below has a defined content scope. The absolute dates are targets, not commitments; pace flexes with real life.

---

## Version milestones

| `/root` | What ships | Rough target |
|---|---|---|
| **v0.1.0** | Initial public release. Site framework (Astro 7 + Tailwind 4), CNCF-graduated discipline layer (GOVERNANCE, MAINTAINERS, ADOPTERS, RELEASING, SUPPORT, CODE_OF_CONDUCT, ARCHITECTURE, ROADMAP, ISSUE_TEMPLATE, NOTICE), docs rendering (`/program/*`), and authored content: 7 Program docs (overview, capstone, story, ai-learning-protocol, platform-patterns, glossary, reading-list) + full Arc 1 (8 phase docs + Arc 1 index + Arc 1 final exam). Adjacent [`homelab`](https://github.com/abukix/homelab) and [`brand`](https://github.com/abukix/brand) repos also ship v0.1.0 concurrent. | **Shipped** (2026-07-09) |
| **v0.2.0** | Arc 2 (8 phase docs + Arc 2 index + Arc 2 final exam). Backend Engineering theme. | ~2026 Q4 |
| **v0.3.0** | Pattern library shell: `patterns/index.md` + 10 category indexes + first ~15 STUB pattern entries covering the patterns Arc 1-Arc 2 phases reference. | ~2027 Q1 |
| **v0.4.0** | Arc 3 phases 17-26 (10 docs) + `basecamp v0.2.0-v0.4.0` alignment (Kubernetes + GitOps substrate). First basecamp modules land in this window: `forge` (Arc 3 P22), `ascent` (Arc 3 P26). | ~2027 Q3 |
| **v0.5.0** | Arc 3 phases 27-30 + Arc 3 final exam + `beacon` (Arc 3 P30) alignment + `basecamp v0.5.0` alignment. Meta templates (8) + project plans (12) port in. | ~2028 Q1 |
| **v0.6.0** | Arc 4 (8 phase docs + Arc 4 final exam) + `crag` (Arc 4 P31) alignment + `basecamp v0.7.0` alignment. Data Engineering + ML Foundations theme. Pattern library grows to ~35 STUB. | ~2028 Q4 |
| **v0.7.0** | Arc 5 phases 39-46 (LLM serving + fine-tuning + `prism` v0-v1) + `basecamp v0.9.0` alignment. Pattern library ~55 STUB. | ~2029 Q3 |
| **v0.8.0** | Arc 5 phases 47-50 (agents + `loom` + `warden`) + `basecamp v0.11.0` alignment. Pattern library ~70 STUB with first OUTLINE promotions. | ~2029 Q4 |
| **v1.0.0** | Arc 5 Capstone (final exam + Pattern Paper) + `vantage` (Arc 5 Capstone) alignment + `basecamp v1.0.0` alignment. **Full curriculum operating end-to-end. Pattern library ~70 entries with ~50 at DEEP.** | ~2030 Q3 |

Timelines are aspirational; `/root` is designed to be pace-flexible (3-7 years). The relative order is fixed; absolute dates shift.

---

## What each version means

### PATCH — `0.x.y`
- Typo fixes, broken-link repairs
- Small clarifications, formatting cleanup
- Time-stamp bumps on tool sections
- No new phase docs, no new pattern entries

### MINOR — `0.x.0`
- New phase doc set (year slice)
- Pattern library additions or promotions (STUB → OUTLINE, OUTLINE → DEEP)
- New project plans, templates, ADRs
- New section additions (homelab, meta, brand)

### MAJOR — `x.0.0`
- Structural reorganization of the curriculum
- New top-level section
- Curriculum-scope changes ratified by an ADR
- Breaking changes to URL structure

**When 1.0.0 ships:** the maintainer has operated at least Arc 1 of the curriculum on their own homelab, `basecamp v1.0.0` has shipped with all 8 modules integration-tested, and the Arc 5 Pattern Paper is published. Before v1.0.0, `/root` is a build-in-public project; breaking URL changes can happen with a MAJOR bump if warranted.

---

## Dependency graph

`/root` content ports in dependency order. Later minor versions depend on content from earlier ones:

```
v0.1.0 (initial public release: scaffold + discipline + Program + Arc 1)
   │
   ▼
v0.2.0 (Arc 2 phase docs)
   │
   ▼
v0.3.0 (Pattern library shell)
   │
   ▼
v0.4.0 (Arc 3 phases 17-26 +
        basecamp v0.2.0-v0.4.0)
   │
   ▼
v0.5.0 (Arc 3 phases 27-30 + Arc 3 final +
        homelab + meta + projects + brand)
   │
   ▼
v0.6.0 (Arc 4 + basecamp v0.6.0-v0.7.0)
   │
   ▼
v0.7.0 (Arc 5 first-half + prism)
   │
   ▼
v0.8.0 (Arc 5 second-half + loom + warden)
   │
   ▼
v1.0.0 (Arc 5 Capstone + vantage + basecamp v1.0.0)
```

Content from a later version can't reference content that hasn't ported yet without marking cross-references as *(ports in vX.Y.0)*.

---

## Content invariants

Every version, no matter how small, upholds:

1. **Public-safety**: no internal product names from any specific employer's stack appear in any public artifact.
2. **Voice anchors**: direct, opinionated, no fluff; pattern-first; no hedge-words; no marketing language; no emojis in authored prose; trade-offs explicit.
3. **Pattern-first framing**: every tool sits inside a named pattern.
4. **Cross-reference honesty**: internal links resolve; unresolved references marked `[TODO: link]` or clearly annotated with the version they land in.
5. **Time-stamped tool sections**: every phase doc's TOOLS section has a date comment.
6. **CHANGELOG discipline**: every release lands in `CHANGELOG.md` before the tag; no silent revisions to accepted ADRs.

Breaking any invariant is a release blocker.

---

## What's NOT on the roadmap

The following are deliberately out of scope for `/root`:

- **New curriculum years beyond Arc 5.** The shape is the design. Post-Arc 5 continuing-education happens outside `/root` (in `basecamp` maintenance, blog posts, conference talks).
- **Video content.** `/root` is written. Video that summarizes chapters may happen post-v1.0 but isn't a shipping artifact.
- **Live cohorts.** `/root` is single-operator by design. Cohort-based delivery (bootcamp shape) requires a different structure and different maintainer discipline.
- **Certifications / credentials.** The `basecamp` you ship is the credential. `/root` doesn't grant anything.
- **Translations.** Not currently in scope. If demand emerges post-v1.0, translations happen in separate repos.
- **Adaptation for shorter timelines.** `/root` is calibrated for 3-7 year adult self-study. Compressing into a 6-month curriculum requires a different structure.

Post-v1.0 direction depends on adoption + operator needs. Any post-v1.0 major change (v2.0) requires an ADR.

---

## How to influence the roadmap

Roadmap changes come from:

1. **Real operational experience.** The maintainer operating basecamp on their homelab surfaces gaps or misalignments that shift priorities.
2. **Contributor input.** Once `/root` has external adopters running phases, their operating experience shapes the roadmap.
3. **Upstream shifts.** If Kubernetes / Iceberg / MLflow / etc. releases something that changes basecamp's substrate assumptions, phase docs adjust.

Roadmap changes get documented as amendments to this file with a date stamp. No silent revisions.

To suggest a roadmap change, open a [GitHub Discussion](https://github.com/abukix/root/discussions) tagged `roadmap`.

---

## Post-1.0 possibilities

Speculative. None of these are committed:

- **v1.x**: content maturation. Pattern library reaches ~70 DEEP entries. Arc 2-Arc 5 phase docs get additional operating-evidence updates. `basecamp` v1.x releases get corresponding `/root` refreshes.
- **v2.0**: potentially adapting `/root` for teams (small orgs adopting the curriculum), or new AI-tier chapters if the AI infrastructure landscape shifts significantly post-2030.

Everything speculative gets an ADR before it lands.

---

## Cross-references

- [`README.md`](./README.md): what `/root` is
- [`CHANGELOG.md`](./CHANGELOG.md): what's shipped
- [`ARCHITECTURE.md`](./ARCHITECTURE.md): how `/root` is structured
- [`CONTRIBUTING.md`](./CONTRIBUTING.md): how to submit changes
- [`basecamp/ROADMAP.md`](https://github.com/abukix/basecamp/blob/main/ROADMAP.md): the corresponding platform roadmap

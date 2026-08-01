---
title: "Software Engineering Foundations"
description: "Arc 1 of /root: ~8 phases that build the engineer who will later operate the platform. Linux as a developer, Python and Go fluency, data structures and algorithms, software architecture patterns, performance, testing, Git and CI/CD. Ships sift and pulse as fluency artifacts. Exit ramp: Junior Software Engineer."
tags: [program, arc-1, foundations, software-engineering]
arc: 1
---

> Arc 1 of /root. The foundations every later year rests on.
> ~8 phases that turn "someone who wants to ship software" into "someone who can ship software with confidence."
> Exit ramp: **Junior Software Engineer**

Arc 1 is the ground floor of /root. There's no basecamp tier alive yet, no Kubernetes, no cloud, just you, your dev environment, two languages, and the engineering judgment that lets you ship working code. Everything in Years 2-5 (backend services, the platform, the data tier, the ML stack, AI infrastructure) assumes you can read code, write code, test code, and reason about *why* code does what it does without freezing.

The shape of the year is deliberate. Phase 1 makes the developer's machine itself legible: Linux as your daily substrate, not a mystery. Phases 2-4 install programming fluency: Python first (the lingua franca of glue + ML), data structures and algorithms in the middle (the practical subset, not competitive programming), Go after (the lingua franca of cloud-native infra). Phase 5 is where code stops being syntax and starts being *decisions*: DDD, clean architecture, hexagonal, repository. Phases 6-7 add the engineering hygiene that separates mid from senior: profiling, memory, testing patterns. Phase 8 closes Arc 1 with Git, CI/CD, and the release-engineering muscle that makes your code shippable.

By end of Arc 1 you've shipped **two small CLIs publicly**: [`sift`](/projects/sift/plan/) (Phase 2 Python) and [`pulse`](/projects/pulse/plan/) (Phase 4 Go), both with tests, CI, releases, and the kind of README another engineer can pick up. You've internalized at least one of the canonical architecture patterns. You can profile a slow function and explain *why* it's slow. You write tests before they hurt. Your Git workflow is something a senior engineer would recognize as professional. The exit is **Junior Software Engineer**, and the engineer who will operate Arc 3's platform is already being built.

:::tip[Why "fluency, not mastery" for Python and Go]
Arc 1 is not where you become a senior Python or Go engineer. It is where you ship enough small, reviewed, released code in both languages that you can read any tool's source, write a useful CLI in an afternoon, and stop fearing the language layer. Mastery comes later, in Years 2-5, when you operate complex systems written in these languages: backend services, `ascent`, `prism`, `warden`. Arc 1 buys the right to learn those without language friction.
:::

---

## What you'll know at the end of Arc 1

Concrete, internalized, not "I read about it." If someone wakes you at 3am, these answers come without notes:

- **Linux as a daily substrate**: shell fluency, processes, file system, permissions, package management. You can navigate any Linux box without notes and explain what each layer does.
- **Python fluency**: basics through OOP through async through packaging. You've shipped a real CLI ([`sift`](/projects/sift/plan/)) with tests, CI, and a public release.
- **Go fluency + concurrency**: basics through goroutines + channels + context. You've shipped a real CLI ([`pulse`](/projects/pulse/plan/)) with cross-platform binaries.
- **Data structures & algorithms** at practical depth: arrays, hashmaps, trees, graphs, BFS/DFS, sorting, big-O reasoning applied to real code. Not competitive programming; the subset a backend engineer actually uses.
- **Software architecture patterns**: DDD, clean architecture, hexagonal, repository. You can argue trade-offs across them and recognize them in any codebase you read.
- **Performance, profiling & memory**: you can profile a hot path, identify the actual bottleneck, and articulate the fix. You know the difference between heap, stack, and arena allocators.
- **Testing patterns**: unit, integration, property-based. You've written tests that caught real bugs.
- **Git + CI/CD + release engineering**: feature-branch workflows, conventional commits, semantic versioning, CI pipelines that gate merges, releases that produce versioned artifacts.

You'll be able to read any backend codebase, write a useful tool in either language in an afternoon, and ship it with the hygiene of a professional engineering team.

---

## Phase map

| Phase | Title | Weeks | Hours | What ships | Pattern depth focus |
|---|---|---|---|---|---|
| [1](/program/arc-1/phase-1/) | Linux as a Developer | 5-7 | 50-70 | Hardened dev environment | shell-fluency, file-system-as-namespace, processes-and-permissions |
| [2](/program/arc-1/phase-2/) | Programming Foundations I: Python | 8-12 | 100-140 | **[`sift`](/projects/sift/plan/) v0.1 public** | interpreted-runtime, packaging, type-hints, async-vs-parallel |
| [3](/program/arc-1/phase-3/) | Data Structures & Algorithms | 5-7 | 50-70 | DSA practice repo | algorithmic-complexity, hash-tables, tree-traversals, graph-search |
| [4](/program/arc-1/phase-4/) | Programming Foundations II: Go | 7-9 | 80-100 | **[`pulse`](/projects/pulse/plan/) v0.1 public** | csp-concurrency, errors-as-values, structural-typing |
| [5](/program/arc-1/phase-5/) | Software Architecture Patterns | 6-8 | 60-80 | sift + pulse refactored to clean architecture | domain-driven-design, clean-architecture, hexagonal-and-ports-and-adapters, repository-pattern |
| [6](/program/arc-1/phase-6/) | Performance, Profiling & Memory | 5-7 | 50-70 | sift + pulse profile reports | profiling-as-practice, memory-allocation, hot-paths-cold-paths |
| [7](/program/arc-1/phase-7/) | Testing Patterns | 5-7 | 50-70 | sift + pulse with >80% test coverage | test-pyramid, property-based-testing, fakes-vs-mocks |
| [8](/program/arc-1/phase-8/) | Git, CI/CD Fundamentals & Release Engineering | 5-7 | 50-70 | sift + pulse with CI pipelines + semantic versioning + auto-release | trunk-based-development, release-engineering, semantic-versioning |
|   | **[Arc 1 Final Exam](/program/arc-1/final-exam/)** | 2-3 | 20-30 | — | — |
| **Total** | | **~48-65 weeks** | **~510-700 hrs** | sift + pulse public, dev environment + chronicle seeded | ~8-10 patterns OUTLINE; foundations for everything later |

The total content is the 8 phases. Pace is yours; some phases move quickly, others deepen with operating time.

---

## What ships publicly during Arc 1

Arc 1 ships **two OSS CLIs**, the fluency artifacts. The discipline is *quiet ship*: push to GitHub, get a PR review if you can, cut a release, move on. Launch energy is reserved for later years.

| Project | Phase | Role | Launch energy |
|---|---|---|---|
| [`sift`](/projects/sift/plan/) | 2 | Regex CLI in Python, fluency artifact, later reused as a log-pattern utility inside `warden` (Arc 5) | Quiet ship: push to GitHub + PyPI; no blog post |
| [`pulse`](/projects/pulse/plan/) | 4 | Probe scanner in Go, fluency artifact, will emit Prometheus metrics scraped by basecamp from Arc 3 onward | Quiet ship: push + GoReleaser binaries |
| `chronicle` | 1 onward | Runbooks, ADRs, weekly logs (private) | **Private**. Arc 1 stays private. |

The two CLIs each get a real integration role inside basecamp's tooling later (sift feeds `warden` log analysis, pulse emits metrics into Prometheus), so they're not orphaned demos. They earn their keep over the program's full arc.

---

## Patterns deepened in Arc 1

By Arc 1 end, these [Pattern Library](/patterns/) entries should be **OUTLINE**:

**Foundations**

- `shell-fluency`: Phase 1
- `file-system-as-namespace`: Phase 1
- `processes-and-permissions`: Phase 1

**Programming**

- `interpreted-runtime`: Phase 2
- `packaging-and-dependency-management`: Phase 2
- `csp-concurrency`: Phase 4 (goroutines + channels)
- `errors-as-values`: Phase 4 (Go's approach)
- `structural-typing`: Phase 4

**Algorithms and complexity**

- `algorithmic-complexity`: Phase 3
- `hash-tables-as-pattern`: Phase 3
- `tree-traversals`: Phase 3
- `graph-search`: Phase 3

**Architecture**

- `domain-driven-design`: Phase 5
- `clean-architecture`: Phase 5
- `hexagonal-and-ports-and-adapters`: Phase 5
- `repository-pattern`: Phase 5

**Engineering hygiene**

- `profiling-as-practice`: Phase 6
- `test-pyramid`: Phase 7
- `property-based-testing`: Phase 7
- `release-engineering`: Phase 8

That's ~18-20 patterns first-touched in Arc 1. Read each entry when its phase first hits it; promote STUB to OUTLINE while the phase context is live.

---

## Hardware requirements

Arc 1 needs a development machine. Your laptop is fine; a small mini-PC (16GB DDR5 + 256GB NVMe) works too. The homelab proper doesn't get exercised hard until Arc 3 (Kubernetes), so Arc 1's hardware budget is minimal: anything that runs a modern Python and Go toolchain comfortably is sufficient.

Full breakdown including hardware roadmap across all 5 years: [homelab/hardware](https://github.com/abukix/homelab/blob/main/hardware.md).

---

## Arc 1 Final Exam

**Scenario-based final exam.**

Three parts:

1. **Build (120 min)**: ship a new small CLI from scratch: takes JSON-Lines on stdin, filters by a CEL-like expression, emits to stdout. Tests, type checking, README, semantic versioning, CI workflow.
2. **Debug (180 min)**: three parallel scenarios from the phase exam catalogs (one each from Phase 2 / 4 / 6).
3. **Articulate (90 min)**: ~1500 words: *"Walk through what happens when a Python HTTP request executes from `requests.get(url)` to the bytes on the wire. Cover the TCP socket, the SSL handshake, the HTTP framing, the response parsing. Cite the patterns at each layer."*

See the [full Arc 1 Final Exam spec](/program/arc-1/final-exam/) for the scoring rubric and exact pass bar.

---

## Reading order

1. This index: you are here. Skim once.
2. [The Master Plan](/program/overview/): re-read the *5 years at a glance* section so Arc 1's role in the arc is in your head.
3. [The Capstone](/program/capstone/): re-read so you know what Arc 1 is feeding into.
4. [Phase 1: Linux as a Developer](/program/arc-1/phase-1/): start here.
5. Phases 2 to 8 in order: [Python](/program/arc-1/phase-2/), [DSA](/program/arc-1/phase-3/), [Go](/program/arc-1/phase-4/), [Architecture](/program/arc-1/phase-5/), [Performance](/program/arc-1/phase-6/), [Testing](/program/arc-1/phase-7/), [Git/CI/CD](/program/arc-1/phase-8/).
6. **Patterns**: as a phase references one, read its entry under [`patterns/`](/patterns/) and promote STUB to OUTLINE while the context is live.
7. **Project plans**: [`sift`](/projects/sift/plan/) when Phase 2 activates; [`pulse`](/projects/pulse/plan/) when Phase 4 activates.
8. [Arc 1 Final Exam](/program/arc-1/final-exam/): open ~2 weeks before end of Phase 8. Earlier creates anxiety; on time creates focus.

For people who already write production code daily in Python or Go: skim Phases 2 and 4 quickly; spend your time on Phase 5 (Architecture) and Phase 6 (Performance) where the senior delta lives.

---

## Arc 1 graduation

```
You can:
- Operate Linux as your daily substrate without notes
- Read and write Python idiomatically
- Read and write Go idiomatically, including concurrency
- Reason about algorithmic complexity in real code
- Apply software architecture patterns (DDD, clean, hexagonal) deliberately
- Profile a slow function and articulate the fix
- Write tests that catch real bugs (unit, integration, property-based)
- Ship code with proper Git workflows, CI, semantic versioning, releases

Exit ramp: Junior Software Engineer
Confidence: real, with two shipped CLIs and ~18-20 OUTLINE patterns
```

→ Continue to [Arc 2: Backend Engineering](/program/arc-2/).

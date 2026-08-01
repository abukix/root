---
title: "The Story"
description: "The month-by-month narrative arc of /root: why each year exists, what changes about you across it, and the day/week/month/year rhythm that makes 5 years survivable. The honest journal next to the curriculum."
tags: [program, narrative]
status: STUB
---

> The month-by-month narrative arc of /root. Not a curriculum: a story. Why each year exists, what changes about you across it, what the journey feels like from the inside. Plus: the **rhythm** the journey runs at, the day/week/month/year cadences that make 5 years survivable.
>
> Status: **STUB** at start. Per-year sections deepen as you live them: each phase adds 1-2 paragraphs about what surprised you, what was harder than expected, what felt easier. By Arc 5 graduation this is a 30+ page document that's the most honest record of the journey.

If the [Master Plan](/program/overview/) is the map, this page is the diary. The Master Plan tells you what the 5 arcs *contain*; this page tells you what they *feel like* from the inside. The two are meant to be read together: structure on one tab, narrative on the other.

This doc starts as a stub and grows by accretion. There's no clever way to skip ahead to a finished version. Arc 1 fills itself in across the months you spend there; Arc 5 is blank until you're at the end. The whole point is that future-you writes the body of this document, not present-you. What you can write today is the rhythm, the pre-flight, and the themes: the scaffolding the entries hang on.

:::tip[Why a separate "Story" doc at all]
The Master Plan is what you show a hiring manager. The Story is what you'd hand a 23-year-old version of yourself the night before they sign up. Different audiences, different jobs. Keep them separate so neither has to perform double duty: the plan stays clean and structural; the story stays raw and honest.
:::

## The Rhythm

/root lives inside three nested cadences. The curriculum tells you WHAT to build; the rhythm tells you WHEN + HOW the life around the work is shaped. The rhythm is what makes 5 years survivable.

The discipline is **run-pray-build**: a triad that anchors every day. Run for the body. Pray for the spirit. Build for the craft. None of the three carries the program alone. Drop any one and the other two compensate for a few weeks, then collapse. All three is the only stable configuration over 5 years.

### The day

```
Morning:    prayer + run (or gym) + breakfast + a short reading
            (Bible / DDIA / a current phase's textbook — rotating)
Midday:     day job
Evening:    1-2 hrs /root work — phase reading, exercises,
            code, chronicle entries
Close:      short reflection; commit + push
```

The morning beat is non-negotiable. Body first, spirit second, mind third: by the time the laptop opens, the rest of you is already centered. The 1-2 evening hours are protected; family + day-job pressure is real, but the cadence holds.

The "commit + push" close matters more than it looks. Even a 1-line ADR, a runbook stub, or a typo fix counts. The graph contribution isn't the point; the point is that the day didn't end inside your head. Something left it. The discipline of *externalizing* every day is what makes the rhythm cumulative instead of just busy.

### The week

```
Mon-Fri:    ~5-7 weeknight hrs /root (1-2 hrs × 3-5 nights)
Saturday:   3-4 hr deep-work session (the longest sustained block of the week)
Sunday:     weekly log + church + reflection.
            The non-negotiable beat of the program.
```

Saturday is for the work that doesn't fit in 1-hour weeknight chunks (long Spark jobs, kubectl debugging, deep reading, finishing a long exercise). Sunday is the **Sabbath beat**: log the week, gather, reflect, pre-shape next week. The Sunday weekly log is the single most-load-bearing habit of /root (template: [meta/weekly-log-template](/meta/weekly-log-template/)).

:::caution[Skipping Sunday is the failure mode]
Skipping a weeknight is a missed hour. Skipping Saturday is a missed deep block, recoverable. Skipping Sunday means the week didn't externalize, didn't compound, didn't feed `notes-rag` (Arc 5) or `warden` (Arc 5). Two skipped Sundays in a row is the canary that something larger is wrong with the rhythm. Stop and triage before adding more weeks.
:::

### The month

```
~48-50 hrs /root work (a month of focused time)
1 blog post (Arc 3+) or screencast piece
1 phase milestone shipped (validation criterion or two)
Monthly retrospective in this story.md (the per-month paragraph)
```

The monthly retrospective is the cumulative narrative: by Arc 5 graduation it's ~60 entries of honest "what changed this month." That's the dataset this whole document becomes.

### The year

```
a year of focused /root work
6-14 phases shipped + 1 final exam (per year, varies by year length)
~5-10 cinematic content pieces (day-rhythm / week-rhythm / launch videos)
1-2 loud launches (Arc 3: forge; Arc 5: prism + vantage)
End-of-year retrospective written here
```

The year-end retrospective is the longest entry of the year. It's where the per-month paragraphs get a frame put around them: the theme that quietly emerged, the unexpected pivot, the project that grew bigger than its phase, the pattern that didn't transfer the way you expected.

| Cadence | Beat | Output | What breaks if you skip |
|---|---|---|---|
| Day | run-pray-build + commit | externalized work | the day stays in your head |
| Week | Sunday weekly log | written reflection | the week doesn't compound |
| Month | retrospective entry here | narrative paragraph | the year has no through-line |
| Year | end-of-year retrospective | thematic frame | the program is just 50 phases |

---

## Pre-flight (before Phase 1 starts)

```
You set up the homelab. Proxmox runs. The bastion is hardened.
The home network is reliable. You can SSH into the homelab from your dev machine
without thinking. You commit to ~12 hours a week.

You have not yet started Phase 1. You're at the trailhead.

The vertigo is real: 5 years feels like forever; you've never sustained
anything this long; you're worried that you're "behind"; you're worried your
day-job will pivot in a way that makes /root impossible. None of that matters today.

Today you start Phase 1.

The rhythm starts before the curriculum does — the run, the prayer, the morning
reading, the Sunday log. Build the cadence first; the curriculum drops into the
cadence on Month 1 Week 1.
```

Concretely, pre-flight finishes when four things are true: the homelab is wired and reachable per [homelab/hardware](https://github.com/abukix/homelab/blob/main/hardware.md); the [AI Learning Protocol](/program/ai-learning-protocol/) has been read end-to-end; the [Master Plan](/program/overview/) + [Capstone doc](/program/capstone/) have been skimmed at least once so you know what exists; and the rhythm has held for two consecutive weeks of run-pray-build *before* Phase 1 opens. The two-week dry run is the proof that the cadence is real, not aspirational.

The Arc 1 entry point is [Arc 1 overview](/program/arc-1/) → [Phase 1: Linux as a Developer](/program/arc-1/phase-1/). Don't open Phase 1 until pre-flight is done.

---

## Arc 1: Software Engineering Foundations

> **Theme: "the year you learn that code is just structured thinking, and the rules survive the language."**

```
Phase 1: Linux as a Developer
Phase 2: Programming Foundations I — Python (fluency)
Phase 3: Data Structures & Algorithms
Phase 4: Programming Foundations II — Go (fluency + concurrency)
Phase 5: Software Architecture Patterns
Phase 6: Performance, Profiling & Memory
Phase 7: Testing Patterns
Phase 8: Git, CI/CD Fundamentals & Release Engineering
Arc 1 Capstone + Final Exam

Arc 1 feeling: ___ (filled in at end of Arc 1)
```

Arc 1 is the year nothing is abstract about code. You read tutorials, type exercises, ship small CLIs, and the muscle memory of writing real Python and Go becomes yours. By Phase 5 (Software Architecture Patterns) you start seeing structure: DDD, clean architecture, hexagonal, repository, and code stops being a wall of syntax and starts looking like *decisions*. By Phase 8, you've shipped two small CLIs (`sift` and `pulse`), you can write a test that catches a real bug, and your Git workflow is something a senior engineer would recognize. The platform doesn't exist yet (that comes in Arc 3), but the *engineer who will operate it* is being built here.

→ Per-phase paragraphs added as Arc 1 unfolds. The end-of-year reflection is written at the [Arc 1 Final Exam](/program/arc-1/final-exam/).

---

## Arc 2: Backend Engineering

> **Theme: "the year you learn that services are systems, and systems have lifecycles."**

```
Phase 9:  SQL & Relational Databases
Phase 10: Redis & Caching Patterns
Phase 11: HTTP, REST, gRPC & API Design
Phase 12: Authentication & Authorization
Phase 13: Containers as a User
Phase 14: Message Queues + Event-Driven Patterns
Phase 15: Service Observability
Phase 16: Backend at Scale (rate limiting, idempotency, retry)
Arc 2 Capstone + Final Exam
```

Arc 2 is where code becomes *services*. You go deep on Postgres + Redis (state), HTTP + gRPC (interfaces), auth (identity), and the patterns that let services survive real load (rate limiting, idempotency, retries with backoff). By Phase 15 (Service Observability) you can instrument your own service from inside (logs, metrics, traces) and read what it tells you in production-like conditions. By Phase 16 you understand why "the service works locally but fails at 1000 RPS" has predictable causes. You've shipped 2-3 real backend services in Docker, with proper CI/CD, real testing, and observability hooks. The exit is a credible **Mid-level Backend Engineer**.

```
Arc 2 feeling: ___
```

→ Filled in as the year unfolds.

---

## Arc 3: Infrastructure & Platform Engineering

> **Theme: "the year you learn that the substrate is the product, and operating it is half the job."**

```
Phase 17: OS Internals (Linux + FreeBSD compare)
Phase 18: Networking Deep
Phase 19: Containers from Scratch
Phase 20: Kubernetes + GitOps
Phase 21: Distributed Systems Theory (DDIA + Raft)
Phase 22: Infrastructure as Code (forge ships)
Phase 23: Cloud Foundation (one cloud deep)
Phase 24: Multi-cloud Synthesis
Phase 25: Service Mesh + Zero-Trust Networking
Phase 26: Platform Engineering — ascent ships
Phase 27: Secrets Lifecycle + Defense in Depth
Phase 28: Observability at Platform Depth
Phase 29: FinOps + Cost Engineering
Phase 30: Reliability Engineering
Arc 3 Capstone + Final Exam
```

Arc 3 is the longest year of the program, 14 phases, the inflection where the platform finally comes alive. [Phase 17](/program/arc-3/phase-17/) takes the kernel seriously. [Phase 19](/program/arc-3/phase-19/) builds containers from `unshare` and cgroups so Docker stops being magic. [Phase 20](/program/arc-3/phase-20/) is where the Kubernetes substrate + observability stack comes online (K3s + Flux + Postgres + Redis + Prometheus + Grafana + Loki + Tempo); `basecamp v0.2.0` shipped. [Phase 21](/program/arc-3/phase-21/) is where DDIA Ch 5-9 breaks the single-machine intuition and rebuilds it as distributed-systems thinking. [Phase 22](/program/arc-3/phase-22/) ships `forge` (`basecamp v0.3.0`), the first loud public launch of the program. By [Phase 26](/program/arc-3/phase-26/) you've built `ascent` (`basecamp v0.4.0`) and basecamp is a platform other engineers could ship services to. By [Phase 30](/program/arc-3/phase-30/) `beacon` has shipped (`basecamp v0.5.0`) with FinOps and reliability discipline baked in. The exit is **Senior DevOps / SRE / Cloud / Platform Engineer**.

The Arc 3 → Arc 4 transition is the third identity-changing inflection: platform-builder → data/ML-builder. The substrate you've operated for two years now hosts the data + ML compute layers above it.

```
Arc 3 feeling: ___
```

→ Filled in.

---

## Arc 4: Data Engineering & ML Foundations

> **Theme: "the year you learn that data is the product, and models are functions of data + decisions."**

```
Phase 31: Data Lakehouse (Iceberg)
Phase 32: Stream Processing (Kafka + Flink)
Phase 33: Batch + Orchestration (Spark + Airflow)
Phase 34: Python ML Stack
Phase 35: Classical ML Engineering (XGBoost, recommendations)
Phase 36: Deep Learning Fundamentals (PyTorch)
Phase 37: Distributed Training (Ray Train)
Phase 38: Model Serving Infrastructure (KServe, vLLM, GPU)
Arc 4 Capstone + Final Exam
```

Arc 4 is when the platform gets its data brain. [Phases 31-33](/program/arc-4/phase-31/) stand the data tier: Iceberg on MinIO, Kafka + Flink for streaming, Spark + Airflow for batch. By Phase 33 basecamp can ingest events at high rate, store them durably with table semantics, run analytical queries, and orchestrate batch + streaming pipelines. Then [Phases 34-38](/program/arc-4/phase-34/) put ML on top: numpy + pandas + sklearn fundamentals, classical ML at depth (XGBoost, recommendations), then PyTorch for deep learning, Ray Train for distributed training, and KServe + vLLM + GPU scheduling for serving. By end of Arc 4 you've trained a small model on Ray, registered it, deployed it to KServe, and observed it from first principles. The data tier underneath it is the substrate every Arc 5 workload will need.

```
Arc 4 feeling: ___
```

→ Filled in.

---

## Arc 5: AI Infrastructure

> **Theme: "the year you ship the artifacts that prove the journey."**

```
Phase 39: ML Lifecycle (Registry + Experiment Tracking)
Phase 40: Feature Stores
Phase 41: ML Evaluation + Monitoring
Phase 42: Vector Stores + Embeddings + RAG
Phase 43: LLM Serving Deep (vLLM, PagedAttention)
Phase 44: Inference Optimization
Phase 45: Fine-tuning + PEFT
Phase 46: LLM Gateway — prism ships
Phase 47: Prompt Engineering + Structured Outputs as Infrastructure
Phase 48: Agent Runtime + Model Context Protocol
Phase 49: AI Security + AI Observability
Phase 50: AIOps — warden ships
Arc 5 Capstone: vantage MVP + Pattern Paper + Final Exam
```

Arc 5 is the operator to architect transition the [overview](/program/overview/#the-5-arcs-at-a-glance) flags as the fourth identity-changing inflection. You stop building services and start building the agents that operate services. [Phases 39-41](/program/arc-5/phase-39/) close out the MLOps lifecycle (registry, feature store, evaluation). [Phases 42-45](/program/arc-5/phase-42/) cover the LLM serving stack: vector stores + RAG + vLLM + inference optimization + fine-tuning. [Phase 46](/program/arc-5/phase-46/) ships `prism`, an OpenAI-compat API with model routing, RAG, semantic caching, observability, mirroring the production-grade LLM-gateway pattern at small scale. [Phase 48](/program/arc-5/phase-48/) ships `loom`, the MCP server fabric exposing tools (data reads via `crag`, telemetry queries, `ascent` deploy calls, and a private RAG source from your ops corpus) to agents under scoped auth. [Phase 50](/program/arc-5/phase-50/) is `warden`, the AIOps operator that triages alerts, proposes runbooks, and executes through `ascent` under approval gates. The Arc 5 Capstone ships `vantage` and completes `basecamp v1.0.0`, plus the Pattern Paper, Staff/Principal-grade synthesis writing reviewed by 2+ external readers. By graduation the artifact set is no longer aspirational. It's a thing on disk. It runs.

```
Arc 5 feeling: ___
```

→ Filled in.

---

## Graduation

```
[Written at end of Arc 5.]

What's true now that wasn't true 5 years ago:
- ___
- ___
- ___

The rhythm held: 5 years of the day → week → month → year cadence.
The curriculum stacked on top of it.

What I will do next, I will decide with the data of these 5 years —
not with the speculation of pre-flight day. Future-me knows things
current-me can't. I trust future-me to pick.

/root is over. The platform continues. The career begins.
The rhythm stays.
```

The graduation paragraph is the only one in this document that's allowed to be aspirational at the moment of writing; every other entry is retrospective. It's the closing bracket on the 60-entry monthly retrospective and the 5-entry year-end retrospective, and it's the natural place to link to the [Arc 5 Final Exam](/program/arc-5/final-exam/) result, the published Pattern Paper, and the launched [vantage](https://github.com/abukix/basecamp/blob/main/modules/vantage.md).

---

## How to write entries

Each month's addition: 1-2 paragraphs. Honest, specific, future-self-readable.

Four prompts that produce useful entries:
1. **What surprised me**: the "wait, that's not how I thought it worked" moments
2. **What was harder than expected**: where the friction lived
3. **What felt easier**: where prior phases compounded
4. **What's true now that wasn't last month**: the smallest provable change

Plus one rhythm prompt:
5. **How did the rhythm hold?**: did the day/week/month cadence stay intact, or did something pull it off?

Keep entries short. The cumulative narrative emerges from the discipline, not from any single month's polish.

:::note[The "honest" filter]
The single test for whether an entry belongs in this doc: would you be embarrassed if a recruiter read it? If yes, it goes in. The [Master Plan](/program/overview/), [project plans](/projects/), and [pattern entries](/patterns/) are the polished surface; they're allowed to be edited for an audience. This document is the unedited substrate underneath. The two have to coexist for the brand to be load-bearing instead of performative.
:::

---

## Cross-references

- [Master Plan](/program/overview/): the structural map this story sits next to
- [The Capstone](/program/capstone/): the integrated arc, the spine the per-month entries hang on
- [AI Learning Protocol](/program/ai-learning-protocol/): the rules for working with Claude/ChatGPT alongside this rhythm
- [meta/weekly-log-template](/meta/weekly-log-template/): weekly logs are the raw material that feeds this monthly arc
- [brand/identity](https://github.com/abukix/brand/blob/main/identity.md): the brand frames the rhythm publicly
- [homelab/hardware](https://github.com/abukix/homelab/blob/main/hardware.md): the pre-flight setup that has to land before Phase 1
- [Arc 1](/program/arc-1/) · [Arc 2](/program/arc-2/) · [Arc 3](/program/arc-3/) · [Arc 4](/program/arc-4/) · [Arc 5](/program/arc-5/): the per-year overviews
- Year-end retrospective posts on the public blog: the public version of the same story

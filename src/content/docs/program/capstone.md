---
title: "The Capstone: basecamp v1.0.0"
description: "The integrated build. 12 shipping artifacts compose into one platform, basecamp, an 8-module K8s-native unified data + ML + AI platform. Five progression arcs; one coherent artifact at the end."
tags: [program, capstone, basecamp]
---

> 5 years. 12 shipping artifacts. 8 basecamp modules. One platform.
> The capstone is not something you build at the end. It's the single coherent system you've been building all along, one module at a time.

The bet of the program is that *most engineers ship disconnected tools because that's how programs are scoped, and most portfolios suffer for it.* A senior engineer's portfolio sells because it shows judgment across a system, not skill across a list. The capstone is the structural answer to that: every phase ships a piece, every piece plugs into the same growing platform, and by end of Arc 5 the platform stands on its own as `basecamp v1.0.0`, a single end-to-end artifact.

This document is the spine that holds it together. Each phase doc tells you what to ship *from* that phase. This doc tells you what the *whole* is becoming, and where each piece sits in it.

---

## Why end-to-end beats per-tool

A typical learning portfolio after five years of self-study looks like this:

```
github.com/you/regex-cli         (Python tutorial output)
github.com/you/k8s-todo-app      (followed a K8s course)
github.com/you/llm-chatbot       (LLM demo)
github.com/you/feature-store     (some Medium article)
github.com/you/ml-pipeline-demo  (a capstone)
... 12 more repos ...
```

Each repo is a credible tutorial-shaped artifact. None of them compose. An interviewer scrolling that profile sees motion, not direction.

The capstone fixes this by making every project a *load-bearing component of one larger system.* The repos don't replace each other; they *connect.* By end of Arc 5 a senior engineer reviewing your work doesn't see fifteen tutorials; they see one platform built by an engineer who understands how the modules fit.

| Disconnected portfolio | Integrated capstone |
|---|---|
| 15 repos, each scoped to a tutorial | 12 repos, each a shipping artifact of one platform |
| "Built X with Y" demos | "Composed X with Y to solve Z" systems |
| Reviewer's question: *can they go deep?* | Reviewer's question: *they already went deep, where?* |
| Sells effort | Sells judgment |
| Junior-coded ceiling | Senior-coded ceiling |

The cost is real: a capstone requires upfront architectural coherence and stricter shipping discipline ("does this artifact earn its keep in the platform, or am I just adding clutter?"). The payoff is that the whole becomes more than the sum of the parts, which is the only portfolio shape that actually distinguishes a senior IC from a credential-collector.

---

## What the capstone is

**`basecamp`** is the platform. The Arc 5 Capstone is `basecamp v1.0.0`: all 8 modules integration-tested and running end-to-end on the operator's homelab (and also verified to run on laptop `kind` and small cloud K8s, per the "same shape everywhere" promise).

basecamp is **K8s-native end to end**. Every module is composed of CRD-driven controllers running on the same shared substrate. Pattern-first is /root's bet; among tools-that-implement-the-pattern, K8s-native equivalents earn priority because they compose. See [K8s-native ecosystem as meta-pattern](/program/platform-patterns/#the-k8s-native-ecosystem-as-a-meta-pattern) for the philosophical anchor.

basecamp runs on **your laptop, your homelab, or a small cloud**, same manifests everywhere. Both are versioned in Git. Both are operated through GitOps (Flux) from Arc 3 onward. Both mirror, at homelab-and-small-team scale, the patterns frontier-lab platforms operate at planetary scale.

**The bet:** if the patterns are right, scale is just a number. A homelab K3s cluster running `crag` (data tier) + `prism` (LLM gateway) + `loom` (MCP fabric) + `warden` (AIOps) + `vantage` (UI), *using the same control-loop / declarative / GitOps / data-fabric patterns* as a hyperscale platform, is a real demonstration of pattern fluency. Scaling it up is staffing and budget. Pattern fluency is the thing that's hard to fake.

---

## The 8 basecamp modules

Read bottom-up. Each layer stands on the one below it:

```
                          vantage (unified UI)
                                ▲
   prism · loom · warden · beacon         ← AI + ops tier
                                ▲
                              crag                        ← data tier
                                ▲
                            ascent                        ← workload plane
                                ▲
                             forge                        ← infra plane (IaC)
                                ▲
   K8s + Flux + Cilium + Postgres/Redis + Prom/Grafana/Loki/Tempo + Vault + ESO
                                                         ← the substrate
```

| Module | What it is | Repo | Year | Industry parallel |
|---|---|---|---|---|
| `forge` | Terraform + Crossplane IaC modules: provisions the substrate | [`abukix/forge`](https://github.com/abukix/forge) | Arc 3 P22 | Cloud IaC platforms (Terraform Cloud, Crossplane-based platforms) |
| `ascent` | Developer CLI + Workload operator: the deploy path onto basecamp | [`abukix/ascent`](https://github.com/abukix/ascent) | Arc 3 P26 | Internal paved-road platforms (Netflix Titus, Uber Odin, Airbnb OneCard) |
| `beacon` | On-call triage dashboard | [`abukix/beacon`](https://github.com/abukix/beacon) | Arc 3 P30 | Incident management surfaces (PagerDuty, Grafana OnCall, VictorOps) |
| `crag` | Data tier: Iceberg + Trino + MinIO + Spark + Flink | [`abukix/crag`](https://github.com/abukix/crag) | Arc 4 P31 | Databricks lakehouse, Snowflake, Netflix's Iceberg-based data tier |
| `prism` | LLM gateway: routing, caching, observability | [`abukix/prism`](https://github.com/abukix/prism) | Arc 5 P43-46 | LiteLLM, Portkey, OpenAI's internal gateway |
| `loom` | MCP server fabric: tools for AI agents | [`abukix/loom`](https://github.com/abukix/loom) | Arc 5 P48 | Anthropic's MCP ecosystem, agent tool fabrics at frontier labs |
| `warden` | AIOps operator: agents that operate basecamp | [`abukix/warden`](https://github.com/abukix/warden) | Arc 5 P50 | Frontier-lab AIOps (self-driving infrastructure at Google, Meta, Uber) |
| `vantage` | Unified UI dashboard | [`abukix/vantage`](https://github.com/abukix/vantage) | Arc 5 Capstone | Internal platform product UIs (Backstage, Netflix's internal portal) |

Plus the umbrella:

- **`abukix/basecamp`**: GitOps repo composing the 8 modules; ships pinned versions.

Plus 2 Arc 1 standalone tools (not part of basecamp itself but part of the program's shipping portfolio):

- **`abukix/sift`** (Arc 1 P2, Python): pattern-first regex CLI. Fluency artifact.
- **`abukix/pulse`** (Arc 1 P4, Go): network probe scanner emitting Prometheus metrics. Fluency artifact.

Plus one longitudinal artifact that runs alongside all 5 years and stays private:

- **Private operational corpus**: runbooks, postmortems, ADRs, weekly logs. Built from Arc 1 Phase 1 onward. By end of Arc 5: ~250 weekly logs, ~25 postmortems, ~140 runbooks, ~15+ ADRs. **Always private.** Arc 5 `warden` indexes it as its RAG source, so the same corpus that captures operational memory becomes the intelligence layer of the AIOps operator.

The composition contract, module boundaries, upgrade contract, and design principles all live in [`basecamp/ARCHITECTURE.md`](https://github.com/abukix/basecamp/blob/main/ARCHITECTURE.md). That doc is the canonical source; this doc tells you *when* things get built and *why*.

---

## How the modules compose

Modules ship in **dependency order**. A module cannot ship until the layer below it is operational. You don't get to ship `prism` (Arc 5 LLM gateway) before `crag` (Arc 4 data tier) is running, and you don't get to ship `crag` before `ascent` (Arc 3 workload plane) exists. That's not bureaucracy; it's how the platform stays debuggable. When `prism` misbehaves in Arc 5, you can trust that `ascent` and the substrate are solid because you've been operating them for two years.

The dependency graph:

```
forge  ─────────► ascent  ─────────► crag
                    │                  │
                    │                  ▼
                    │              (needs data tier)
                    │                  │
                    ▼                  ▼
                 beacon              prism
                    │                  │
                    │                  ▼
                    │                loom
                    │                  │
                    ▼                  ▼
                    └──────►  warden ◄─┘
                                │
                                ▼
                             vantage
                             (needs all of the above)
```

- **`forge`** is first: you can't operate a platform without the substrate.
- **`ascent`** is second: once the substrate exists, you need the deployment path onto it.
- **`crag`** is third: the data tier is what most modules eventually depend on.
- **AI modules** (`prism`, `loom`, `warden`) come after the data tier because they consume it.
- **`beacon`** can develop in parallel with the AI modules (it only depends on `forge`/`ascent`).
- **`vantage`** is last: it wraps everything above into one UI. Building the UI before the modules is theatrical; building it after is honest.

---

## Year-by-year build progression

### Arc 1 (Software Engineering Foundations): no basecamp modules yet

No basecamp module this year: just the foundations every later module rests on. You ship two Arc 1 fluency CLIs (`sift`, `pulse`) and start the private ops-corpus discipline. basecamp doesn't come alive until Arc 3, but the *engineer who will build it* gets built here.

### Arc 2 (Backend Engineering): still no basecamp modules

Arc 2 ships backend services running locally in Docker. You can ship a real API end-to-end with auth, databases, tests, CI/CD. Services are private practice, not public shipping artifacts. The discipline (runbook-per-service, service-observability from the inside, idempotency-by-default) carries forward to Arc 3, where the same discipline shows up as basecamp module design.

### Arc 3 (Infrastructure & Platform Engineering): `forge` + `ascent` + `beacon` ship

By end of Arc 3, `basecamp v0.5.0` shipped. Milestones:

- **Phase 20**: Kubernetes + GitOps. K3s on the mini-PC (or `kind` on laptop); Flux bootstrapped. `basecamp v0.2.0` shipped (GitOps skeleton + Cilium mesh + deployment recipes for laptop / homelab / cloud).
- **Phase 22**: Infrastructure as Code. `forge v0` ships (Terraform + Crossplane modules). `basecamp v0.3.0` shipped.
- **Phase 26**: Platform Engineering. `ascent v0` ships (dev CLI + `Workload` operator, custom kubebuilder operator). `basecamp v0.4.0` shipped.
- **Phase 30**: Reliability Engineering. `beacon v0` ships (on-call triage dashboard). `basecamp v0.5.0` shipped.

What basecamp *can do* at end-of-Arc 3: run workloads declaratively via `ascent`, provision cloud + K8s infra via `forge`, surface incidents via `beacon`, observe everything with the substrate's Prometheus + Grafana + Loki + Tempo stack. It is *a recognizable mini-platform*, the kind a small team would actually run.

### Arc 4 (Data Engineering & ML Foundations): `crag` ships

By end of Arc 4, `basecamp v0.7.0` shipped. Milestones:

- **Phase 31**: Data Lakehouse. `crag v0` ships (Iceberg + Trino + MinIO + Spark Operator). `basecamp v0.6.0` shipped.
- **Phase 32-33**: Stream Processing + Batch. `crag` matures (Kafka via Strimzi + Flink integration; MLflow model registry alongside). `basecamp v0.7.0` shipped.
- **Phase 34-38**: ML foundations. First model trained-registered-served end-to-end via MLflow + KServe on top of `crag`. No new basecamp module ships this year past `crag`; Arc 4 is about proving `crag` can host ML workloads.

What basecamp *can do* at end-of-Arc 4: ingest events at high rate via Kafka, store them durably in Iceberg on MinIO, run analytical queries via Trino, run batch and streaming pipelines via Spark + Flink, train models on the substrate, serve inference via KServe. It is now a *recognizable mini-data-platform with ML capability*.

### Arc 5 (AI Infrastructure): `prism` + `loom` + `warden` + `vantage` ship

By end of Arc 5, `basecamp v1.0.0` shipped. Milestones:

- **Phase 43-44**: LLM Serving. `prism v0` ships (LLM gateway with local vLLM serving, basic routing). `basecamp v0.8.0` shipped.
- **Phase 46**: LLM Gateway matures. `prism` gains semantic caching (pgvector), multi-model routing, OpenLLMetry observability. `basecamp v0.9.0` shipped.
- **Phase 48**: Agent Runtime + MCP. `loom v0` ships (MCP server fabric). First three MCP servers land: `chronicle` (RAG over private ops corpus), telemetry, `ascent`. `basecamp v0.10.0` shipped.
- **Phase 50**: AIOps. `warden v0` ships (`IncidentReport` CRD + triage controller + approval gates). `basecamp v0.11.0` shipped.
- **Arc 5 Capstone**: `vantage v0` ships. All 8 modules navigable through one dashboard. Integration test suite green on kind + K3s + one cloud target. **`basecamp v1.0.0`: graduation.**

What basecamp *can do* at end-of-Arc 5: the full unified data + ML + AI platform. Trains models on `crag`, serves them via `prism`, exposes tools to agents via `loom`, runs agents that operate the platform via `warden`, and presents all of it through `vantage`. *Smaller scale than frontier labs, same patterns.*

---

## The graduation moment: `basecamp v1.0.0`

v1.0.0 is the milestone where basecamp is:

- **Real**: a laptop, homelab, or small-team cloud operator can deploy it and use it daily.
- **Integrated**: all 8 modules work together, tested end-to-end (kind + K3s + one cloud target).
- **Documented**: each module has a real README + reference docs.
- **Operating**: the author has run basecamp for 6+ months on their own homelab.
- **Public**: the repos have been public long enough that external users have started operating them too.

Before v1.0.0, basecamp is a build-in-public project. After v1.0.0, it commits to backwards-compatibility and a real release cadence per [`basecamp/RELEASING.md`](https://github.com/abukix/basecamp/blob/main/RELEASING.md).

Arc 5 Capstone is paired with the **Pattern Paper**, the synthesis writing artifact. 3,500-5,000 words. Due 4 weeks after the Arc 5 Final Exam. Audience: Staff/Principal-level hiring managers. Reviewed by 2+ external readers before publishing.

---

## What each shipping artifact is, briefly

Short blurbs. Each links to its planned repo.

- **[`sift`](https://github.com/abukix/sift)** (Arc 1 P2, Python): pattern-first regex CLI. Fluency artifact. Not part of basecamp.
- **[`pulse`](https://github.com/abukix/pulse)** (Arc 1 P4, Go): network probe scanner emitting Prometheus metrics. Fluency artifact. Not part of basecamp, but scraped by basecamp's Prometheus from Arc 3 onward.
- **[`forge`](https://github.com/abukix/forge)** (Arc 3 P22): Terraform + Crossplane modules provisioning basecamp's substrate. Multi-cloud (laptop + homelab + AWS + GCP).
- **[`ascent`](https://github.com/abukix/ascent)** (Arc 3 P26): Developer CLI + Workload operator. `ascent-cli` for developers ("ship this thing to basecamp"); `Workload` CRD reconciled by a custom kubebuilder controller into Deployment + Service + Ingress + NetworkPolicy + SLO.
- **[`beacon`](https://github.com/abukix/beacon)** (Arc 3 P30): on-call triage dashboard. Aggregates alerts + `warden` incident output + `crag` data-quality signals.
- **[`crag`](https://github.com/abukix/crag)** (Arc 4 P31): data tier. Iceberg on MinIO, Trino for queries, Spark + Flink for processing, Nessie for catalog.
- **[`prism`](https://github.com/abukix/prism)** (Arc 5 P43-46): LLM gateway. Routes model calls, caches (Redis exact + pgvector semantic), rate limits, observes via OpenLLMetry.
- **[`loom`](https://github.com/abukix/loom)** (Arc 5 P48): MCP server fabric. Exposes tools to AI agents under scoped auth.
- **[`warden`](https://github.com/abukix/warden)** (Arc 5 P50): AIOps operator. Triages incidents via RAG over the private ops corpus; proposes runbooks; executes safe actions through `ascent` under approval gates.
- **[`vantage`](https://github.com/abukix/vantage)** (Arc 5 Capstone): unified UI. Wraps every module's API into one navigable dashboard.
- **[`basecamp`](https://github.com/abukix/basecamp)**: umbrella repo. Composes the 8 modules; ships pinned versions; defines the composition contract.
- **[`/root`](https://github.com/abukix/root)**: the curriculum + build guide. This site.

Each one earns its keep: it's not a portfolio tile, it's a load-bearing component that the next module above relies on.

---

## What the public site looks like at end of Arc 5

The single artifact a reviewer opens. Layout:

```
public-site/
├── /                        ← landing: "The build guide for basecamp"
├── /program/                ← the curriculum (this site's program section)
├── /basecamp/               ← LIVE: the platform itself, embedded via vantage
│     ├── Module status     ← (live K8s state, rendered by vantage)
│     ├── Service map       ← what's running, what depends on what
│     ├── Agent activity    ← warden + loom traces
│     └── Recent activity   ← last 30 days of deploys, alerts, incidents
├── /patterns/               ← Pattern Library: ~70 patterns, ~50+ DEEP
├── /projects/               ← 12 shipping artifact plans, READMEs, repo links
├── /blog/                   ← ~250 posts (Sunday weekly logs distilled)
│     └── /pattern-paper/    ← the synthesis essay (Arc 5 capstone writing)
├── /talks/                  ← conference talks recorded (1-2 per year, 5+ total)
└── /capstone/               ← THIS DOC: the integrated arc, where reviewers start
```

The interview pitch becomes one sentence:

> *"I built an open-source unified data + ML + AI platform from the kernel up: 8 modules composed on a K8s substrate, running on my homelab, verified to run on laptop and cloud. Same patterns as the platforms I'd be operating at scale. Here's the URL. The blog explains the arc that got me here."*

That sentence is the difference between a credential-collector and a senior IC. The capstone is what makes it true.

---

## Pattern depth across the capstone

By end of Arc 5, ~50 of ~70 Pattern Library entries should be **DEEP**, meaning you've operated something dependent on the pattern for 6+ months. The capstone is the operating ground that *forces* the patterns to deepen.

| Pattern category | Module(s) that operate it | DEEP target |
|---|---|---|
| Foundations (control-loops, declarative-state, idempotence, backpressure) | `ascent`, `crag`, `warden` (all operator-shaped) | All 5 DEEP by Arc 3 end |
| Software architecture (DDD, clean, hexagonal, repository) | Arc 1-Arc 2 services + all module internals | DEEP by Arc 2 end |
| Storage and data (WAL, LSM-vs-Btree, OLTP-vs-OLAP, replication) | Substrate Postgres + `crag` Iceberg | All DEEP by Arc 4 end |
| Distributed systems (consensus, quorums, gossip, sharding) | Substrate etcd + `crag` Kafka | Most DEEP by Arc 3 end |
| Networking (routing, load-balancing, service-discovery, network-policy, mesh) | Substrate Cilium + `ascent` Ingress + basecamp mTLS | All DEEP by Arc 3 end |
| Security-and-policy (RBAC, capability-tokens, secret-rotation, network-policy) | Substrate Vault + `ascent` RBAC | All DEEP by Arc 3 end |
| Infrastructure-and-platform (declarative, GitOps, paved-road, service-catalog, IaC) | `forge`, `ascent`, `basecamp` GitOps | All DEEP by Arc 3 end |
| Observability-and-ops (SLO/SLI, tracing, logging, alerting) | Substrate Prom/Grafana/Loki/Tempo + `beacon` | DEEP by Arc 3 end |
| Data engineering (Lakehouse, schema-evolution, streaming-vs-batch, CDC) | `crag` | DEEP by Arc 4 end |
| ML systems (feature-store, model-serving, gateways, RAG, agents, MCP, AIOps) | `crag`, `prism`, `loom`, `warden` | Most DEEP by Arc 5 end |

The Pattern Library by end of Arc 5 has ~70 entries with ~50 at DEEP: the program's structural target.

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Perfecting `forge` before moving to `ascent` | `forge` will keep evolving as `crag` and the AI modules stress the substrate. Stop polishing; start composing. |
| Adding a 9th basecamp module "for the portfolio" mid-program | Every new module dilutes the composition contract. The 8 listed here are the 8. Feature requests get evaluated against basecamp's scope boundaries. |
| Skipping the private ops corpus "until things stabilize" | The corpus *is* the stabilization. Skip a month and the dataset for `warden` (Arc 5 AIOps) degrades forever. |
| Treating basecamp as separate from the 8 module repos | The modules ARE basecamp. `basecamp` is the umbrella that composes them; you don't get a working basecamp without shipping the modules. |
| Building `vantage` early "for the screenshots" | `vantage` is Arc 5 Capstone for a reason: it needs the underlying modules to render anything meaningful. Premature UI is a fake demo. |
| Cargo-culting hyperscale specifics | Mirror the *patterns*, not the org-specific implementation details. Your `prism` doesn't need any specific hyperscale gateway's API surface; it needs the same caching + routing + observability shape. |
| Building basecamp for hyperscale | basecamp explicitly targets individual operators and small teams. If you're designing for petabyte multi-region workloads, you're outside basecamp's scope. Use Snowflake / Databricks / Google Cloud for that. |

---

## What to do next

If you're starting Arc 1: bookmark this doc and re-read it at the start of every phase. Each phase doc tells you what to ship; this doc tells you why and where it fits.

If you're mid-program: read your current phase's "What ships from this phase" section against the module table above. The two should agree. If they drift, the phase doc is wrong (flag it) or your scope is creeping (cut it).

If you're approaching Arc 5: start writing the elevator pitch above as a 60-second video on the public site's `/talks/` page. The pitch is real prep, not vanity.

---

→ Back to: [The Master Plan](/program/overview/) · [Arc 1](/program/arc-1/) · [basecamp/ARCHITECTURE.md](https://github.com/abukix/basecamp/blob/main/ARCHITECTURE.md)

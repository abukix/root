---
title: "Master Plan"
description: "/root is a curriculum from Software Engineering Foundations to ML Platform / AI Infrastructure. Pattern-first, platform-driven, resource-neutral. Built around 50 phases across 5 arcs that produce basecamp, an 8-module open-source unified data + ML + AI platform."
tags: [program, master-plan, root]
---

> A curriculum from Software Engineering Foundations to ML Platform / AI Infrastructure. Built on **patterns, not tools**. The platform you build is the artifact. The depth you accumulate is the goal. The journey is the content.

This page is the master plan: the high-level map of the entire program. If you read only one document in /root, read this one. Everything else is a deeper view of something here.

Treat it as a reference, not a story. Skim to orient, come back to any section directly. The goal: six months into Arc 3, when you're deep in Kubernetes and forget why you're re-implementing something in Crossplane, you re-read one section here and remember. It's the map you can unfold at any point in the program without losing your place.

## What /root is

/root is a self-authored program built around three commitments:

1. **Pattern-first learning.** Every phase asks you to find the underlying pattern before the tool. Kubernetes is one implementation of "declarative reconciliation," not the only one, not the last one. Terraform, ArgoCD, systemd, thermostats, and PID controllers all implement the same pattern. Being fluent in the *pattern* means you pick up the next tool in a week because you already know what problem it's solving and which trade-offs it must be making. Being fluent in the *tool* means you re-learn everything when the tool changes.

2. **Platform-driven practice.** Theory is verified by operating real software in production-like conditions. You build [`basecamp`](https://github.com/abukix/basecamp), an 8-module K8s-native platform that runs on your laptop, your homelab, or your cloud. Every phase adds something to it or forces you to operate it under a new kind of load. When Phase 20 says "you understand Kubernetes," it means basecamp's K3s cluster (or `kind` on your laptop) has woken you up at 2am with a real incident and you fixed it. Not that you finished a book chapter.

3. **Public documentation.** Weekly logs, runbooks, ADRs, postmortems, pattern entries. Not because someone is watching, but because compounding requires written external memory. The engineer who writes down what they learned last month can compose it with what they learn this month. The engineer who doesn't repeats the same reasoning every time. Over five years, that gap is the entire program.

The brand pillar is **The build guide for basecamp**. /root is how the platform gets built. The 50 phases are how it's earned.

/root is also **resource-neutral**. Each phase tells you *what to learn at pattern depth*. You pick *how*: canonical books, paid courses, papers, mentorship, OSS source code. The pattern survives the resource; don't tie the curriculum to any single course platform. If any specific course provider disappears tomorrow, the Arc 1 phases don't change. If DDIA goes out of print, the Arc 3 phases don't change. You substitute the resource; the pattern requirement stays.

:::note[New here? Start with one of these instead]
- [The Capstone](/program/capstone/): the integrated arc: how the 8 basecamp modules and 2 Arc 1 tools compose into one shipping portfolio.
- [The Story](/program/story/): the *why* behind the program: what problem /root solves and who it's for.
- [AI Learning Protocol](/program/ai-learning-protocol/): how Claude/ChatGPT fit into the practice without becoming a crutch.
- [Platform Patterns in the Industry](/program/platform-patterns/): the reference for how Netflix/Spotify/Uber/Airbnb implement the same patterns /root teaches.

Master Plan is the structural overview. The other docs are the lived experience.
:::

## What /root is NOT

Every commitment above implies a counter-commitment. Reading the negative space is often clearer than reading the goal:

- **Not a bootcamp.** No compressed timeline, no external instructor, no cohort. The progression is a feature, not a bug. It's the amount of time genuine pattern fluency requires in adult brains with day jobs. Compressing defeats the point.
- **Not a certification track.** No exam grants /root credit. The 5 final exams inside the program are self-graded scenarios. The credential is [`basecamp`](https://github.com/abukix/basecamp) that runs and the [pattern library](/patterns/) that survives. Nothing external validates you. Your production platform does.
- **Not a shortcut to senior IC.** Five years is the honest minimum. If you can hit senior-IC comp after two years of directed practice, /root is over-scoped for you. Pick a shorter program. /root is calibrated for engineers whose day job doesn't already exercise these patterns.
- **Not tied to any specific job or employer.** Everything you build under /root is yours, on your hardware, in your repos. The curriculum survives job changes, unemployment, and relocation. That's the design.
- **Not a substitute for real ops experience.** It uses homelab operations *as* ops experience. When basecamp pages you at 3am because Postgres ran out of connections, that's an incident. The runbook and postmortem that follow are indistinguishable from a work incident's: same discipline, same artifact quality, same value in a Senior IC interview.
- **Not opinionated about your language of choice past Arc 1.** Python and Go in Arc 1 are because they dominate the platform and ML space in 2026. After that, use whatever fits the phase.

## The bet

> Tools change every 5 years. Patterns don't change in 30.

If you spend five years learning **Kubernetes**, you're fluent in 2026 tools that may not be canonical in 2031. If you spend five years learning **the control-loop pattern that Kubernetes implements**, you carry that pattern to whatever replaces it: Terraform's reconcile, ArgoCD, future cloud orchestrators, anything declarative.

Senior engineers at frontier labs reason in patterns and treat tools as interchangeable implementations. They pick up new tools in a week because they already understand the *category of problem* the tool solves and the *trade-offs* every implementation makes. /root trains that habit from Arc 1, Phase 1.

The historical evidence is on the pattern side. One 15-year arc in infrastructure:

- **2010**: Chef or Puppet dominated. Configuration management as imperative recipes.
- **2015**: Terraform and Ansible took over. Declarative infrastructure, agentless config.
- **2020**: Kubernetes, Helm, and ArgoCD became the platform. Declarative everything, reconciled continuously.
- **2025**: Kubernetes plus Flux plus Crossplane plus Kubebuilder operators. Declarative *everything else*, still reconciled continuously.

The engineer whose identity was *"Chef expert"* rebuilt their identity three times in fifteen years. The engineer whose identity was *"someone who understands declarative reconciliation"* absorbed every transition as a syntactic update. Same pattern, new syntax. The pattern person compounds. The tool person restarts.

The name is the contract: every phase asks you to find the **root** principle, not memorize a recipe.

:::tip[Why "patterns, not tools" matters in 2026]
The half-life of a "must-know" infrastructure tool is now 3-4 years. If your career identity is *Kubernetes engineer*, you redo your career every five years. If your identity is *engineer who reasons about distributed reconciliation patterns*, you don't. /root bets on the second.
:::

## The 5 arcs at a glance

The curriculum spans 5 thematically distinct years. **Each year is self-contained** and ends at a credible role: life can interrupt at any year boundary without wasting prior years.

| Year | Theme | Phases | Exit-ramp role | Ships |
|---|---|---|---|---|
| 1 | Software Engineering Foundations | 8 | Junior Software Engineer | `sift`, `pulse` |
| 2 | Backend Engineering | 8 | Mid-level Backend / Software Engineer | services (private practice; basecamp doesn't ship code until Arc 3) |
| 3 | Infrastructure & Platform Engineering | 14 | Senior DevOps / SRE / Cloud / Platform Engineer | `forge`, `ascent`, `beacon`, `basecamp v0.2.0-v0.5.0` |
| 4 | Data Engineering & ML Foundations | 8 | Senior Data / ML Engineer | `crag`, `basecamp v0.6.0-v0.7.0` |
| 5 | AI Infrastructure | 12 | ML Platform / AI Infrastructure | `prism`, `loom`, `warden`, `vantage`, `basecamp v0.8.0-v1.0.0` |

"Exit ramp" is the practical claim: at the end of Year N, if you had to stop /root and re-enter the job market at that role level, you could. Your portfolio has receipts. The 6-hour final exam at year end is calibrated to a real interview take-home. Fail it and you're not ready to exit. Pass it and you can. The exit ramps exist because life shouldn't waste four years of prior work if it interrupts once.

The arcs are **thematic grouping**. Pace is yours; progress is measured by *pattern promotion* and *shipped artifacts*, not weeks elapsed.

The program is the **50 phases**. The arcs are *thematic*. Your timeline is *yours*. Finishing early is fine; finishing late is fine. Skipping is not. If a phase feels too easy, that's a signal to go deeper into COMPARE and OPERATE (the last two steps of every phase), not to skip.

### Arc-by-arc structure

Each year has its own texture. The short paragraphs below describe the mental shift each year requires. The code block that follows lists the concrete deliverables.

Arc 1 is about becoming un-stuck in code. If you can't confidently sit down and write a small program from scratch in Python and Go, Arc 1 fixes that. It's the least glamorous year and the most load-bearing. Everything above it (services, infrastructure, ML) assumes you can code. If Arc 1 feels boring, do it anyway. Skipping it is the single most common failure mode for career-changers who over-index on infrastructure and under-index on programming fluency.

```
ARC 1: Software Engineering Foundations          ~8 phases
─────────────────────────────────────────────────────────────────
Exit ramp: Junior Software Engineer

  Linux as a developer, programming fluency in Python and Go,
  data structures and algorithms, software architecture patterns
  (DDD, clean, hexagonal, repository), performance and profiling,
  testing patterns, Git + CI/CD + release engineering.

  Platform milestone: a development environment you understand to
                      the bottom; OSS hygiene; first two CLIs shipped
                      (sift, pulse) as fluency artifacts.
  Arc 1 Final Exam:  6-hour scenario across Phase 1-8.
  OSS shipped:        sift, pulse (both small CLIs).
  Patterns deepened:  ~8 (foundations + architecture).
```

Arc 2 is about shipping services people would use. Arc 1 makes you a programmer; Arc 2 makes you a backend engineer. The gap is bigger than it sounds. Writing a program that runs on your laptop is one thing. Writing a service that handles concurrent requests, respects idempotency, has retry policies that don't cascade, observes itself, and can be deployed by someone other than you is another. Arc 2 is where the operating mindset first shows up: every service you ship, you also write a runbook for.

```
ARC 2: Backend Engineering                       ~8 phases
─────────────────────────────────────────────────────────────────
Exit ramp: Mid-level Backend / Software Engineer

  SQL and Postgres at depth, Redis and caching patterns,
  HTTP/REST/gRPC and API design, authentication and authorization,
  containers as a user (Docker fluency), message queues and event-
  driven patterns, service observability (logs/metrics/traces from
  inside the application), and backend-at-scale patterns (rate
  limiting, idempotency, retry policies, queues).

  Platform milestone: 2-3 production-grade services running locally
                      in Docker, with proper testing, CI/CD, and
                      observability hooks. Private practice — these
                      aren't public shipping artifacts; the discipline
                      is what carries forward to Arc 3.
  Arc 2 Final Exam:  6-hour scenario across Phase 9-16.
  OSS shipped:        none publicly (services are private practice).
                      Private ops corpus starts capturing runbooks.
  Patterns deepened:  ~10 (backend + APIs + service observability).
```

Arc 3 is the longest and hardest. It's where /root stops being "a programmer who understands infrastructure" and becomes "a platform engineer." Fourteen phases (17-30) because platform engineering is genuinely bigger than any single-year container; it's where basecamp shifts from design-only (v0.1.0) to shipping code (v0.2.0 → v0.5.0). You're operating a cluster, reasoning about distributed systems, provisioning cloud, running IaC, running a mesh, running observability at platform depth, running FinOps, running reliability engineering. If you're going to burn out anywhere, it's here. The mitigation is the weekly log. Pace, don't sprint.

```
ARC 3: Infrastructure & Platform Engineering     ~14 phases
─────────────────────────────────────────────────────────────────
Exit ramp: Senior DevOps / SRE / Cloud / Platform Engineer

  OS internals (kernel, syscalls, /proc — Linux + FreeBSD compare),
  networking deep, containers from scratch with unshare and cgroups,
  Kubernetes + GitOps (Phase 20), distributed systems theory (DDIA,
  Raft, CAP/PACELC), Infrastructure as Code with Terraform + Crossplane
  (Phase 22 ships `forge`), one cloud deep, service mesh + zero-trust,
  platform engineering — paved-road CLI + Workload operator (Phase 26
  ships `ascent`), secrets lifecycle + defense in depth, observability
  at platform depth (eBPF, OTel, SLO discipline), and reliability
  engineering (Phase 30 ships `beacon`; DR, backup, chaos).

  Platform milestone: basecamp v0.5.0 shipped. Substrate provisioned
                      by `forge`, workloads deployed by `ascent`,
                      on-call surfaced by `beacon`. basecamp is now
                      a running platform, not just a design doc.
  Arc 3 Final Exam:  6-hour end-to-end platform scenario.
  OSS shipped:        forge (Phase 22), ascent (Phase 26),
                      beacon (Phase 30). basecamp umbrella
                      composes them.
  Patterns deepened:  ~20 (distributed systems + infra + platform).
```

Arc 4 is the pivot. The substrate you spent Arc 3 building now hosts data and ML compute. Nothing you learned before goes away. The K8s cluster you operate still holds the Postgres you provisioned. The workloads change. Instead of running services, you're running Spark jobs and Ray clusters. Instead of shipping APIs, you're shipping data pipelines and model registries. Arc 3 taught you to run *the platform*. Arc 4 teaches you to run *what runs on the platform*.

```
ARC 4: Data Engineering & ML Foundations         ~8 phases
─────────────────────────────────────────────────────────────────
Exit ramp: Senior Data / ML Engineer

  Data Lakehouse — Iceberg + object storage (Phase 31 ships `crag` v0),
  stream processing (Kafka + Kafka Streams + Flink; Phase 32 adds
  streaming to `crag`), batch and orchestration (Spark + Airflow/
  Dagster; Phase 33 adds batch to `crag`), Python ML stack (numpy,
  pandas, sklearn), classical ML engineering (regression, classification,
  ensembles, XGBoost, recommendations), deep learning fundamentals
  (PyTorch), distributed training (Ray Train), model serving
  infrastructure (KServe, BentoML, GPU scheduling).

  Platform milestone: basecamp v0.7.0 shipped. `crag` data tier
                      operating. First model trained-registered-served
                      end-to-end via MLflow + KServe on top of `crag`.
  Arc 4 Final Exam:  6-hour ML pipeline scenario.
  OSS shipped:        crag v0 (Phase 31) → matures through Phase 33.
  Patterns deepened:  ~8 (data + classical ML + DL + serving).
```

Arc 5 is where the program earns its name. Everything through Arc 4 was preparation. Arc 5 is the actual AI Platform work. It has 12 phases (the most of any year) and it's where the OSS portfolio finalizes: `prism`, `loom`, `warden`, `vantage` all ship in Arc 5, completing basecamp v1.0.0. The Pattern Paper (3,500-5,000 words synthesizing everything you learned) is due 4 weeks after the final exam. That's the graduation artifact.

```
ARC 5: AI Infrastructure                         ~12 phases
─────────────────────────────────────────────────────────────────
Exit ramp: ML Platform / AI Infrastructure

  ML lifecycle (MLflow registry + experiment tracking), feature
  stores (Feast, train/serve parity), ML evaluation + monitoring
  (drift, offline + online evals), vector stores + embeddings +
  RAG, LLM serving deep — vLLM, PagedAttention, batching (Phase 43
  ships `prism` v0), inference optimization (quantization,
  distillation, speculative decoding), fine-tuning + PEFT (LoRA,
  QLoRA), LLM gateway matures (Phase 46: routing + semantic caching
  + observability), agent runtime + Model Context Protocol (Phase 48
  ships `loom`), AI security + AI observability, AIOps (Phase 50
  ships `warden`), and finally the unifying Capstone (Arc 5 Capstone
  ships `vantage` v0 = basecamp v1.0.0).

  Platform milestone: basecamp v1.0.0 shipped. All 8 modules
                      integration-tested and running end-to-end on
                      the operator's homelab. Public capstone ship.
  Arc 5 Final Exam:  6-hour AI platform scenario + Pattern Paper
                      (3,500-5,000 words, due 4 weeks after the exam).
                      Graduation.
  OSS shipped:        prism (Phases 43-46), loom (Phase 48),
                      warden (Phase 50), vantage (Arc 5 Capstone).
                      basecamp v1.0.0 = the composed platform.
  Patterns deepened:  ~15 (ML systems + LLM/AI systems + agents).
```

Four transitions matter most. They mark where the role identity changes:

- **Arc 1 → Arc 2** (Phase 8 → 9): foundations to working backend engineer. You stop being someone-who-can-code and start being someone-who-ships-services. The mental shift moves from *"the program runs"* to *"the program handles concurrent users without falling over."*
- **Arc 2 → Arc 3** (Phase 16 → 17): service-builder to systems-builder. Single-machine intuition retrained for the kernel, the cluster, the network. This is the hardest transition because the "system" you're now reasoning about lives three abstraction layers deeper. It's also where basecamp shifts from design doc to shipping platform.
- **Arc 3 → Arc 4** (Phase 30 → 31): platform-builder to data/ML-builder. The substrate you operated for two years now hosts the data and ML compute layers above it. You keep operating basecamp; the workloads shift from services to Spark/Ray/model-serving.
- **Arc 4 → Arc 5** (Phase 38 → 39): ML engineer to AI infrastructure engineer. You stop training models and start building the platforms the models run on. Model authors are your users now, not you.

## The pattern-first scaffold

Every phase doc inside /root, all 50 of them, follows this 8-step structure:

```
PROBLEM       What category of human need exists?
PRINCIPLES    The timeless patterns any solution must implement
TRADE-OFFS    The decisions every implementation makes (and why)
TOOLS         Current implementations (time-stamped — they age)
MASTERY       Pick one tool, go to operational depth
COMPARE       Re-implement the same problem in a second tool
              (this is the proof that the pattern transferred)
OPERATE       Run it in your homelab, take real incidents
CONTRIBUTE    Ship one fix upstream
```

If a phase doc reads like a copy-paste tutorial, the doc is wrong: flag it. Phases give you the framing; *you* do the investigation. Tools point you in the right direction via `Starter hints:` lines; you write the actual commands and pick the actual resources.

Phase 20 (Kubernetes) as a worked mini-example:

- **PROBLEM.** Applications need to run somewhere. That somewhere must survive machine failure, scale with load, and be reproducible. The problem predates containers and will outlive them.
- **PRINCIPLES.** Declarative state (you say what you want, not how). Continuous reconciliation (something drives actual toward desired, forever). Immutable identity (workloads have stable names even as their pods die). Separation of scheduling from execution.
- **TRADE-OFFS.** Push vs pull deployment. Server- vs client-side apply. Levels vs edges of reconciliation. Static vs dynamic resource allocation. Every K8s design decision maps to one of these axes.
- **TOOLS.** As of 2026-06: `kind`/`k3d` for laptop, K3s for homelab, EKS/GKE for cloud, Flux + Kustomize for GitOps, Cilium for CNI, Operator SDK / Kubebuilder for CRDs. Time-stamped because half of these change on 3-year cycles.
- **MASTERY.** Pick K3s on your homelab. Install it. Deploy basecamp's substrate onto it. Take incidents from it. Write runbooks for anything you'd want to explain to your future self.
- **COMPARE.** Re-run the same workload shape on `kind` (laptop) and EKS (cloud). What changes? The manifests? The etcd behavior? The IAM story? What stays constant? That is what the pattern is. This is also basecamp's core value proposition: "same shape everywhere," verified by your own hands.
- **OPERATE.** Run it for weeks. See a real out-of-memory kill. See a CrashLoopBackOff you didn't cause. See a node go NotReady. Fix each one. Document what you learned in the runbook and ADR.
- **CONTRIBUTE.** Find something wrong in K3s, Kubebuilder, Cilium, or Flux docs and PR the fix. Reading upstream code you'd otherwise have skipped is where real Kubernetes fluency finalizes.

Every one of the 50 phases follows that shape. Not every phase has a big open-source project to contribute to (CONTRIBUTE can be a documentation fix or a well-formed Stack Overflow answer), but every phase has all 8 steps.

:::caution[The COMPARE step is non-negotiable]
The MASTERY step proves you can drive *one* tool. The COMPARE step proves you understand the *pattern*. Skipping COMPARE leaves you a tool operator instead of a pattern-fluent engineer, exactly the opposite of what /root is for.
:::

## What you build (the platform)

By end of Arc 5 you've built **basecamp**, an 8-module K8s-native platform that runs on your laptop, your homelab, or a small cloud. The architecture mirrors what frontier-lab ML platforms, Netflix, Spotify, and Uber operate, but at homelab-and-small-team scale. The pattern is identical; the scale is different.

basecamp is **K8s-native end to end**: every module is composed of CRD-driven controllers running on the same shared substrate. See the [K8s-native ecosystem meta-pattern](/program/platform-patterns/#the-k8s-native-ecosystem-as-a-meta-pattern) for why this is the convergent answer at platform scale.

The 8 modules, read bottom-up (each layer stands on the one below):

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

Module boundaries (why each module lives where it does):

- **`forge`**: Provisions the substrate. Terraform for cloud-provisioned components (VPCs, EKS clusters, IAM roles); Crossplane for K8s-native provisioning of managed services (RDS, S3, GKE clusters). Ships in Arc 3 Phase 22.
- **`ascent`**: Developer CLI + Workload operator. Sits above `forge`. Once the substrate exists, `ascent` is how developers ship workloads onto it. Custom `Workload` CRD; controller reconciles a Workload into Deployment + Service + Ingress + NetworkPolicy + SLO. Ships in Arc 3 Phase 26.
- **`beacon`**: On-call triage dashboard. Aggregates alerts from Prometheus Alertmanager, `warden`'s incident triage output, `crag`'s data quality signals. The "what needs my attention right now" surface. Ships in Arc 3 Phase 30.
- **`crag`**: Data tier. Iceberg tables on MinIO, queried by Trino, processed by Spark and Flink, cataloged by Nessie. Every module that stores durable structured data writes to Iceberg via `crag`. Ships in Arc 4 Phase 31.
- **`prism`**: LLM gateway. Every LLM call in basecamp routes through prism. Handles model routing, caching (Redis for exact match, pgvector for semantic), rate limiting, and observability via OpenLLMetry. Ships in Arc 5 Phase 43-46.
- **`loom`**: MCP server fabric. Every tool an AI agent needs (read a database, query metrics, call `ascent` to deploy something) is exposed as an MCP server managed by `loom`. Ships in Arc 5 Phase 48.
- **`warden`**: AIOps operator. Watches `IncidentReport` CRDs; triages incidents by retrieving similar past incidents via RAG over the private ops corpus; proposes runbooks; executes safe actions through `ascent` under human approval gates. Ships in Arc 5 Phase 50.
- **`vantage`**: The unified UI. What operators look at daily. Wraps every module's API into one navigable interface. Not tied to any single module; consumes each module's public API and renders the composed view. Ships in the Arc 5 Capstone = basecamp v1.0.0.

Every module is a K8s workload composed of CRD-driven controllers. Stateful workloads (Postgres, Redis, later Kafka) run under operators (CloudNativePG, Strimzi) rather than as manually-managed StatefulSets. Cloud resources are Crossplane XRDs. GitOps is Flux Source/Kustomization/HelmRelease. Secrets are External Secrets Operator + Vault. The pattern is consistent across every layer.

Modules ship in **dependency order**. The order is not arbitrary; it reflects how production data platforms actually evolve. `forge` (the substrate) must be solid before `ascent` (the workload plane) is meaningful. `crag` (data tier) must be operating before the AI tier (`prism`/`loom`/`warden`) has anything to consume. `vantage` (UI) is last because building a UI for modules that don't exist yet is theatrical; building it after they exist is honest.

Operating basecamp week-to-week, once it's alive, looks like this:

- You push a change to a GitOps repo. Flux picks it up. Within two minutes the change is either reconciled or the diff is visible in Flux status. If it fails, you get an alert via `beacon` with a link to the failing reconciliation.
- You take an incident. A workload's Pod goes CrashLoopBackOff. `beacon` surfaces it; you `kubectl` from your laptop, diagnose, patch, and write a runbook so future-you doesn't re-diagnose. The runbook lands in your private ops corpus with a date stamp. `warden` will later index it as RAG for its incident triage.
- Once a week you write the weekly log. What you touched, what broke, what you learned, what you were stuck on. Non-negotiable. See [Time budget](#cadence-consistency-over-intensity).
- Once a phase you write a pattern entry or promote an existing one (STUB → OUTLINE → DEEP). The [pattern library](/patterns/) grows one honest entry at a time.

Where basecamp runs (the "same shape everywhere" promise):

| Target | K8s flavor | Use case |
|---|---|---|
| **Laptop / local** | `kind`, `k3d`, `minikube`, colima | Try it out, learn, develop basecamp itself |
| **Homelab** | K3s on a mini-PC, K3s in Proxmox VMs | Long-running personal platform |
| **Small cloud** | Managed K8s (EKS / GKE / AKS) with modest resources | 2-10 person team wanting basecamp shape without homelab hardware |

**basecamp does NOT try to be**: a hyperscale platform for petabyte multi-region workloads. Netflix / Uber / Snowflake occupy that space; basecamp deliberately doesn't compete.

See [`basecamp/ARCHITECTURE.md`](https://github.com/abukix/basecamp/blob/main/ARCHITECTURE.md) for the canonical composition contract, module boundaries, and design principles. See the [capstone doc](/program/capstone/) for how each phase's shipping artifact plugs into a specific basecamp module.

## The shipping portfolio

/root produces **12 public shipping artifacts** across the 5 arcs, plus a private longitudinal ops corpus. The [capstone doc](/program/capstone/) has the full picture; here's the short version:

| Artifact | Repo | First touched | Role |
|---|---|---|---|
| `sift` | `abukix/sift` | Arc 1 Phase 2 (Python) | Pattern-first regex CLI; fluency artifact |
| `pulse` | `abukix/pulse` | Arc 1 Phase 4 (Go) | Network probe scanner emitting Prometheus metrics |
| `forge` | `abukix/forge` | Arc 3 Phase 22 (IaC) | Terraform + Crossplane modules; provisions the substrate |
| `ascent` | `abukix/ascent` | Arc 3 Phase 26 (Platform Eng) | Dev CLI + Workload operator; the deploy path onto basecamp |
| `beacon` | `abukix/beacon` | Arc 3 Phase 30 (Reliability) | On-call triage dashboard |
| `crag` | `abukix/crag` | Arc 4 Phase 31 (Data) | Data tier: Iceberg + Trino + MinIO + Spark + Flink |
| `prism` | `abukix/prism` | Arc 5 Phase 43 (LLM Serving) | LLM gateway: routing, caching, observability |
| `loom` | `abukix/loom` | Arc 5 Phase 48 (Agents + MCP) | MCP server fabric: tools for AI agents |
| `warden` | `abukix/warden` | Arc 5 Phase 50 (AIOps) | AIOps operator: agents that operate basecamp |
| `vantage` | `abukix/vantage` | Arc 5 Capstone | Unified UI dashboard |
| `basecamp` | `abukix/basecamp` | Arc 3 onward | Umbrella repo: composes the 8 modules; ships pinned versions |
| `/root` | `abukix/root` | Arc 1 Day 1 | The curriculum + build guide (this repo) |

Twelve artifacts, not fewer, not more. Each has a specific purpose in the platform architecture and a specific job in the portfolio. Adding a thirteenth would dilute either the architecture (nothing to plug into) or the portfolio narrative (nothing new to show). Fewer, deeper artifacts beat more, shallower ones. The lesson applies to nearly everything in engineering, and especially to what a senior-IC interviewer wants to see.

They compose deliberately. `sift` and `pulse` are Arc 1 fluency artifacts: small CLIs that prove you can code. `forge`, `ascent`, and `beacon` are Arc 3 platform infrastructure: one provisions the cluster, one deploys to it, one surfaces incidents from it. `crag` is Arc 4, the data workload layer that runs on the Arc 3 substrate. `prism`, `loom`, `warden`, `vantage` are Arc 5, the AI + agent + UI tier that consumes everything below.

Alongside these 12 public artifacts, a **private longitudinal ops corpus** runs the whole 5 years: weekly logs, runbooks, postmortems, personal ADRs. It's the *journal*, proof you can write production-grade docs over years. Arc 5 `warden` indexes it as its RAG source, so the same corpus that captures operational memory becomes the intelligence layer of the AIOps operator. **Always private**; never linked from any public artifact.

## Personal services (the dogfood)

basecamp also runs **your stuff**, not just demos. This is what makes the platform real instead of a portfolio piece:

```
Deployed on your basecamp instance from Arc 3 onward:
├── personal-blog/      Arc 3  — your blog deployed via ascent instead of an external host
├── personal-api/       Arc 3  — life-data API (fitness, learning hours, GitHub activity)
├── notes-rag/          Arc 5  — RAG over your own /root writing + weekly logs (dogfoods prism + loom)
└── home-dash/          Arc 5  — internal dashboard pulling from all the above (dogfoods vantage)
```

These prove the platform serves you, not just GitHub stars. They're also the cinematic moments: *watch me self-host my own RAG over five years of weekly logs*. Hard to fake, easy to film, impossible to ignore.

The dogfooding rule: if you'd otherwise pay for it, and basecamp can host it, host it on basecamp. Analytics, blog, personal API, all of it. Every managed SaaS you replace with basecamp is one more reason the platform survives you not touching it for a month.

## How the platform is shared with the world

Three tiers, ordered by cost-to-you:

1. **OSS, self-host (free for everyone, free for you)**: `github.com/abukix/basecamp` + the 8 module repos. Clone, run on your laptop / homelab / cloud, follow the README, get an equivalent platform. This is the moat. **99% of users land here.**
2. **Hosted demo (free for visitors)**: a public read-only surface with vantage UI + small RAG demo powered by prism + loom + warden. Rate-limited; 10-min session timeout. The cinematic surface: visitors see the platform live without authentication. Hosting platform + cost are deferred decisions.
3. **Managed offering (deferred, paid)**: only if post-Year-5 launch shows demand. Most successful open-core companies don't launch managed for years.

The order matters. OSS first establishes credibility. "You can run this yourself" is the strongest claim any platform can make. Hosted demo amplifies reach: visitors who wouldn't set up their own homelab still see the surface. Managed is monetization, deferred until both prior tiers prove demand. Reverse the order and you look like every rushed startup that shipped a paywall before the product was defensible.

## Cadence: consistency over intensity

The non-negotiable is **consistency over intensity**: a sustainable weekly rhythm, not a calendar target.

```
Sunday          weekly log entry — what you learned, broke, were stuck on
Weeknights      current phase work — read, investigate, take notes
Weekend         operate basecamp — incidents, runbooks, deeper investigation
Continuous      every commit lands runbooks/ADRs/patterns in the private ops corpus
```

The **Sunday weekly log** is the discipline that compounds. Everything else can flex around real life.

Progress is measured by *pattern promotion* and *shipped artifacts*, not weeks elapsed. The program doesn't care how many weeks you spend; it cares that phases land at pattern-fluency depth, not tutorial depth. If a phase takes twice as long as you expected because you went deep on COMPARE, that's the program working. If a phase takes half as long because you skipped MASTERY, that's the program failing.

A slow stretch happens. Pick one phase deliverable to force through, and use the momentum to reset the cadence. Never skip the Sunday log, even in a slow stretch. The log is what proves to future-you that you kept the thread.

A strong stretch is where the compounding shows up. Deep operate work (a real incident, a new module bring-up) plus pattern promotion, plus ADR-writing. Strong stretches compound; you can't sustain them permanently, but you don't need to.

:::tip[Why the weekly log is the load-bearing habit]
The weekly log is the *only* thing that compounds across all 50 phases. Phase docs go stale, tools get replaced, projects get archived. The log persists. It's the single artifact that proves you actually did the program, and the dataset that fuels Arc 5's `notes-rag` and `warden`.
:::

## Hardware requirements

```
ARCS 1-2 (Foundations + Backend)
  RAM:     16GB DDR5 (your dev laptop or a small mini-PC)
  Storage: 256GB NVMe + 1TB external SSD before starting Arc 3

ARC 3 (Infrastructure & Platform)
  RAM:     32GB DDR5 (upgrade before Phase 20 Kubernetes)
  Storage: same; consider second NVMe by end of year

ARC 4 (Data + ML Foundations)
  RAM:     64GB DDR5 (upgrade for Spark + Iceberg intermediate storage)
  Storage: second 1TB NVMe

ARC 5 (AI Infrastructure)
  RAM:     64GB DDR5
  GPU:     consumer NVIDIA (RTX 4060 / 4070 or used 3090) for local LLM + small training
  Optional: cloud GPU bursts (Lambda Cloud, RunPod, AWS spot)

CUMULATIVE COST
  Arc 2 end:   $0-100  (small mini-PC if not using your laptop)
  Arc 3 start: +$120-140  (32GB + 1TB SSD)
  Arc 4 start: +$150-200  (64GB + second NVMe)
  Arc 5 start: +$300-700  (GPU)
  TOTAL: ~$570-1140 hardware over 5 years
```

You can also run basecamp entirely on your laptop for Arc 1-Arc 2 (via `kind` / `k3d`) and only upgrade to homelab hardware when Arc 3 activates. See [homelab/hardware](https://github.com/abukix/homelab/blob/main/hardware.md) for specific SKUs and sourcing tips.

## Cloud requirements

```
Arc 3: AWS Deep (Phase 23)
  └── AWS Free Tier; budget ~$50

Arc 3: Multi-cloud capstone (Phase 24)
  └── GCP $300 credits; budget $0

Arc 5: GPU bursts (Phases 43, 47, 49)
  └── Lambda Cloud / RunPod / AWS spot; budget $100-300

TOTAL CLOUD SPEND: ~$150-350 over 5 years
```

Cloud is **exploration, not production**. Default deployment target is homelab (or laptop for Arc 1-Arc 2). Cloud is the lab where you verify your basecamp deploys the same way as it does on homelab: the "same shape everywhere" promise, verified by your own hands. Destroy at end of session.

## The pattern depth ladder

Patterns aren't a separate concept from phases. They're the *durable knowledge artifact* phases produce. Every entry in the [Pattern Library](/patterns/) progresses through three depths:

- **STUB**: frontmatter + 1-paragraph summary + concrete real-world instances + canonical references. Default state. Created when first referenced.
- **OUTLINE**: promoted when a phase first touches the pattern. Adds PROBLEM · PRINCIPLES · TRADE-OFFS · TOOLS sections.
- **DEEP**: promoted after 6+ months of operating something that depends on the pattern. Adds MASTERY · COMPARE · OPERATE · CONTRIBUTE sections: the proof you understand it. Frontmatter has `deep_since:` date + `operating_evidence:` list.

By end of Arc 5 the target is ~60-70 patterns at OUTLINE or DEEP. Tools change. Patterns don't. The Pattern Library is what survives the 5 arcs and outlives the specific implementations you'll have learned.

The *"control loops"* pattern illustrates the journey. It's a foundational pattern touched in nearly every year:

- **STUB (Arc 1).** You name it during Phase 4 because a text mentions Kubernetes reconciliation. You write a one-paragraph entry. Depth-honest: you don't operate one yet.
- **OUTLINE (Arc 3 Phase 20).** You're running basecamp's K3s cluster. You now know *why* the pattern exists: the reconciler survives operator sleep, network partitions, and controller crashes. You add the PROBLEM · PRINCIPLES · TRADE-OFFS · TOOLS sections.
- **DEEP (Arc 3 late / Arc 4).** You've now written a Crossplane XRD in `forge` (a control loop) and a Kubebuilder operator in `ascent` (another control loop) and you've compared how Terraform's state model differs from continuous reconciliation. You've taken incidents from each. You add MASTERY · COMPARE · OPERATE · CONTRIBUTE. This is DEEP, verified by operational hours, not by prose polish.

Promotion happens because you did the time, not because the entry looks good. If AI writes the DEEP section for you, you have a lie in your pattern library. See the [AI Learning Protocol](/program/ai-learning-protocol/#anti-patterns-ai-should-not-do) for why that specifically corrupts the whole knowledge artifact.

## Reading order

You're reading this in roughly the right place. Here's the full path:

1. **This Master Plan**: you are here. Skim the rest of this page so you know what exists.
2. **[The Capstone](/program/capstone/)**: the integrated arc. Read once; revisit at the start of every phase.
3. **[The Story](/program/story/)**: the *why*. Read it before Arc 1 starts.
4. **[AI Learning Protocol](/program/ai-learning-protocol/)**: the rules for working with Claude/ChatGPT throughout the program. Critical to read before Phase 1.
5. **[Arc 1 overview](/program/arc-1/)** → **[Phase 1: Linux as a Developer](/program/arc-1/phase-1/)**: the actual program begins.
6. **As you hit a pattern referenced in a phase**: read its entry in [Patterns](/patterns/); promote it from STUB to OUTLINE *(patterns port in v0.4.0)*.
7. **As each project becomes active**: read its plan in [Projects](/projects/) *(project plans port in v0.6.0+)*.
8. **As you write your first runbook, postmortem, ADR, weekly log**: copy from the [Writing Templates](/meta/) *(templates port in v0.6.0+)*.

For people who already work in infrastructure: jump to the year that matches your current depth. If you can pass [Arc 2 Final Exam](/program/arc-2/final-exam/) cold, start at Arc 3. If you can pass Arc 3's, start at Arc 4.

### First 30 days

The first month of /root is disproportionately important. It's where the habit of the program either takes root or doesn't. A rough shape for the first 30 days:

- **Week 1.** Read this Master Plan, the Capstone, the Story, and the AI Learning Protocol. Set up your hardware for Years 1-2 (laptop is fine; mini-PC not required until Arc 3). Configure the [dev machine](https://github.com/abukix/homelab/blob/main/dev-machine.md): shell, editor, Git, dotfiles.
- **Week 2.** Start [Arc 1 Phase 1](/program/arc-1/phase-1/) (Linux as a Developer). Write your first weekly log on Sunday. Set up a private repo for the ops corpus (runbooks, logs, postmortems).
- **Week 3.** Continue Phase 1. Begin the runbook practice. Every non-trivial thing you learn goes into a runbook. Ship your first commit to the private ops corpus.
- **Week 4.** Finish Phase 1 or roll into Phase 2. Write your fourth weekly log. You've now got a month of receipts. If the four logs look identical, the pace is wrong; adjust before Phase 2.

The mistake to avoid in the first 30 days is over-planning. It's tempting to spend the whole first month building your dotfiles, refactoring your neovim config, deciding which mini-PC to buy. Buy the cheapest hardware that meets the spec, use a boring dotfile setup, and start Phase 1. Optimization is the enemy of progress this early.

## How you'll know it's working

The program is designed to produce specific, observable changes in how you reason. Some signals to watch for as the years accumulate.

**Positive signals** (the program is working):

- Pattern names surface unbidden. You reach for a new tool and think *"this is going to be a reconciler"* before you read the docs.
- Tools feel interchangeable. Someone asks you to pick between three infrastructure-provisioning tools; you produce a trade-off matrix in five minutes because you already know the trade-off axes.
- You can predict where an unfamiliar system will break. New database engine? You know it'll have consistency-availability trade-offs; you know which ones matter for the workload.
- The weekly log gets shorter, not because you're doing less but because the vocabulary tightens. Fewer words to describe the same amount of thinking.
- You use pattern names in conversation without over-explaining. Your peers pick up on it too.

**Warning signals** (recalibrate):

- You know the flags for a tool but can't explain what problem the tool solves. Tool-fluency without pattern-fluency is the exact failure mode /root is designed against.
- You skip a weekly log. One is a bad week; two is a habit forming. Three is a program at risk.
- Your private ops corpus has no new entries for a month. You're either not operating basecamp or you're operating it without documenting. Both are bad.
- You reach for AI to write the runbook, the postmortem, the ADR. See the [AI Learning Protocol's caution about the "I'm just busy this week" trap](/program/ai-learning-protocol/#3-validate-then-write).
- A pattern entry sits at DEEP but you can't articulate the trade-offs of the specific tool you operated. The entry lied to future-you. Demote it.

## How to use this doc

Return here at three specific moments during the program:

1. **Every year boundary.** After the Year N Final Exam, before starting Year N+1. Confirm the exit ramp is real. Decide whether to continue or pause. Re-orient on the next year's theme.
2. **When stuck.** If Phase M has taken more than 4 weeks and you don't know why, re-read [The bet](#the-bet) and [The pattern-first scaffold](#the-pattern-first-scaffold). Usually you're stuck because you skipped a step; the master plan makes the skipped step visible.
3. **When demotivated.** Read [The single sentence to remember](#the-single-sentence-to-remember) at the very bottom. If the sentence still moves you, the program continues. If it doesn't, the program should end. That's also fine.

Do not return here to plan your week. Weekly planning happens in the current phase doc. This is the map, not the route.

## Status

```
Created:                  2025-10-21
Revised:                  2026-07-09 (basecamp = 8 modules; deployment targets = laptop/homelab/cloud)
Started:                  not yet — Phase 1 begins when Arc 1 docs are reviewed
                                    + homelab (or laptop k8s) cleared
                                    (set the date in this line then)
Target graduation:        end of Arc 5
Target role:              ML Platform / AI Infrastructure at a frontier lab
```

This page updates as the program progresses. The phase you're currently in shows on every doc page in the kicker line (`5-YEAR PROGRAM · YEAR N · PHASE M`).

## The single sentence to remember

> **/root is a process to make me the engineer past-me wanted to learn from, by building the platform that future-me would want to operate, while documenting the journey publicly so other engineers can follow.**

The 50 phases, the 8 basecamp modules, the 12 shipping artifacts, the patterns, the docs, the cinematic content, the brand: all of it serves that one sentence.

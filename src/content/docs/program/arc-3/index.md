---
title: "Infrastructure & Platform Engineering"
description: "Arc 3 of /root: ~14 phases that build the substrate. OS internals, networking deep, containers from scratch, Kubernetes + GitOps, distributed systems theory, IaC, one cloud deep, multi-cloud, service mesh, platform engineering, secrets, observability at depth, FinOps, reliability engineering. Basecamp modules `forge`, `ascent`, `beacon` ship. Ships beacon, forge, ascent publicly. Exit ramp: Senior DevOps / SRE / Cloud / Platform Engineer."
tags: [program, arc-3, infrastructure, devops, platform-engineering]
arc: 3
---

> Arc 3 of /root. The substrate comes alive.
> ~14 phases: the longest year of the program. Earns its length.
> Exit ramp: **Senior DevOps / SRE / Cloud / Platform Engineer**

Years 1-2 built the engineer who can write and ship services. Arc 3 builds the substrate those services run on, and the platform discipline that turns "K8s + scripts" into "a platform another engineer can ship to." This is the inflection year. By end of Arc 3 `basecamp` is alive, public on GitHub, running multi-cloud, with the paved-road CLI + service catalog + mesh + secrets + observability + FinOps + reliability discipline of a small startup's actual platform team.

Arc 3 has 14 phases, more than any other year, because the surface area is real. OS internals (kernel-level), networking at depth, containers from scratch (with `unshare` and cgroups), Kubernetes + GitOps, distributed systems theory (DDIA + Raft), Infrastructure as Code, AWS at depth, multi-cloud synthesis, service mesh + zero-trust, platform-as-product, secrets lifecycle, observability deep, FinOps, reliability engineering. Skipping any of these leaves a gap that bites in Years 4-5 or at the next employer.

---

## What you'll know at the end of Arc 3

- **OS internals**: kernel architecture, syscalls, virtual memory, schedulers. Linux at depth + FreeBSD for compare.
- **Networking deep**: TCP/IP packets up, TLS handshake mechanics, DNS resolver internals, L4/L7 load balancing, eBPF basics.
- **Containers from scratch**: built a "container" in <100 lines of bash using `unshare`, cgroups v2, overlayfs. Docker stops being magic.
- **Kubernetes + GitOps**: control-loop pattern at DEEP depth. ArgoCD reconciles your declared state continuously.
- **Distributed systems**: DDIA Ch 5-9 internalized. You implemented Raft in Go. CAP/PACELC trade-offs are reflex.
- **Infrastructure as Code**: Terraform + Crossplane side-by-side. Declared the homelab + AWS + GCP from one repo.
- **Cloud at depth**: one cloud (AWS or GCP) deeply enough to operate production-shape topologies.
- **Multi-cloud**: basecamp runs on K3s + EKS + GKE from one GitOps repo.
- **Service mesh + zero-trust**: Cilium mesh, mTLS between every pod, NetworkPolicy enforced.
- **Platform engineering**: `ascent` paved-road CLI; service catalog; new services scaffolded in one command.
- **Secrets lifecycle**: rotation, revocation, audit, encrypted-at-rest + in-transit.
- **Observability at platform depth**: OTel Collector, Prometheus + Grafana + Tempo + Loki, SLO discipline.
- **FinOps**: cost attribution per-tenant; reserved capacity vs spot trade-offs; egress cost awareness.
- **Reliability engineering**: DR drills, chaos experiments, backup verification on a schedule.

You'll be operating a multi-cloud platform that mirrors at small scale what frontier-lab platforms, Spotify, Netflix, and Uber operate at hyperscale. The exit ramp is **Senior DevOps / SRE / Cloud / Platform Engineer**; the actual hiring titles are interchangeable in 2026.

---

## Phase map

| Phase | Title | Weeks | Hours | Capstone output | Pattern depth focus |
|---|---|---|---|---|---|
| [17](/program/arc-3/phase-17/) | OS Internals | 6-8 | 70-90 | Foundation for everything; chronicle seeded with kernel-level runbooks | virtualization, privilege-separation DEEP, mediation, layering |
| [18](/program/arc-3/phase-18/) | Networking Deep | 6-8 | 70-90 | Networking utils; pulse gets meaningful upgrades | routing-and-addressing, layering-and-abstraction, defense-in-depth |
| [19](/program/arc-3/phase-19/) | Containers from Scratch | 5-7 | 60-80 | Container abstraction dissolved into Linux primitives | privilege-separation reinforced, immutable-infrastructure |
| [20](/program/arc-3/phase-20/) | Kubernetes + GitOps (K8s-native ecosystem) | 10-12 | 120-160 | **Substrate alive**: K3s + Flux + CloudNativePG + Redis Operator + Karpenter + Keda + Prometheus + Grafana; `beacon` deployed | control-loops DEEP, declarative-vs-imperative, gitops, mediation reinforced, service-discovery, load-balancing, network-policy, operator-pattern |
| [21](/program/arc-3/phase-21/) | Distributed Systems Theory | 7-9 | 80-100 | Raft-in-Go lab public | replication DEEP, consensus, partitioning, cap-and-pacelc, eventual-consistency, crdts, distributed-time, idempotency revisited |
| [22](/program/arc-3/phase-22/) | Infrastructure as Code | 8-10 | 90-110 | **`forge` shipped publicly (first loud launch)** | declarative-vs-imperative-infrastructure DEEP, control-loops reinforced, gitops reinforced, immutable-infrastructure |
| [23](/program/arc-3/phase-23/) | Cloud Foundation (AWS deep) | 6-8 | 70-90 | AWS side of basecamp: VPC + IAM + RDS + EKS small | least-privilege DEEP, defense-in-depth, threat-modeling |
| [24](/program/arc-3/phase-24/) | Multi-cloud Synthesis | 5-7 | 60-80 | basecamp on K3s + EKS + GKE; **basecamp repo goes public** | multi-tenancy, all prior Arc 3 patterns reinforced |
| [25](/program/arc-3/phase-25/) | Service Mesh + Zero-Trust | 6-8 | 70-90 | Cilium mesh deployed; mTLS between every pod | service-mesh, zero-trust-networking, mediation DEEP |
| [26](/program/arc-3/phase-26/) | Platform Engineering (+ custom kubebuilder operator) | 10-12 | 120-160 | **`ascent` + custom operator shipped publicly; `Workload` CRD as platform API** | platform-as-product DEEP, operator-pattern, scaffolder-pattern |
| [27](/program/arc-3/phase-27/) | Secrets Lifecycle + Defense in Depth + Kyverno | 5-7 | 60-80 | Vault + ESO + sealed-secrets + Kyverno policies operational | secrets-lifecycle, defense-in-depth DEEP, zero-trust-security, policy-as-code |
| [28](/program/arc-3/phase-28/) | Observability at Platform Depth | 6-8 | 70-90 | OTel Collector + Prometheus + Grafana + Tempo + Loki on basecamp; SLO discipline live | sli-slo-error-budget DEEP, three-pillars DEEP, distributed-tracing DEEP |
| [29](/program/arc-3/phase-29/) | FinOps + Cost Engineering | 4-6 | 40-60 | Cost dashboards across AWS + GCP; reserved + spot strategy | finops |
| [30](/program/arc-3/phase-30/) | Reliability Engineering | 5-7 | 60-80 | DR drills + chaos experiments scheduled on basecamp | reliability-engineering, disaster-recovery |
|   | **[Arc 3 Final Exam](/program/arc-3/final-exam/)** | 2-3 | 24-30 | — | — |
| **Total** | | **~91-119 weeks** | **~1,000-1,290 hrs** | basecamp modules `forge`, `ascent`, `beacon` operational; multi-cloud; public | ~30 patterns reach DEEP |

Arc 3 is the longest arc (14 phases). Pace is yours; the content is what it is.

:::caution[Arc 3 is the longest year, and earns it]
The substrate is real surface area. OS internals to kernel-level networking to containers-from-scratch to K8s to distributed-systems theory to IaC to cloud to multi-cloud to mesh to platform to secrets to observability to FinOps to reliability is 14 phases. Compressing it produces gaps. Treat Arc 3 as the heart of the program; the years on either side are framing.
:::

---

## What ships publicly during Arc 3

| Project | Phase | Role | Launch energy |
|---|---|---|---|
| [`beacon`](/projects/beacon/plan/) | 20 | On-call dashboard, first real service on basecamp | Quiet ship: public on GitHub + Helm chart |
| Raft-in-Go lab | 21 | Educational implementation; not production-grade | Quiet ship: public as learning artifact |
| [`forge`](/projects/forge/plan/) | 22 | Terraform + Crossplane modules side-by-side, multi-cloud | **First loud launch**: README + examples + CI + blog post + Hacker News attempt |
| `basecamp` repo | 24 | The GitOps source of truth for the whole platform | **Goes public mid-Arc 3**: strongest portfolio signal of the year |
| [`ascent`](/projects/ascent/plan/) | 26 | Paved-road CLI + service catalog | Quiet ship: public; goes loud with vantage at end of Arc 5 |

`forge` is the year's main loud launch. `basecamp` going public is the year's main *strategic* artifact. By end of Arc 3 a reviewer sees a coherent multi-cloud GitOps platform with mesh, paved-road, secrets, observability, FinOps, and reliability discipline: visible, runnable, and clearly maintained.

---

## Patterns deepened in Arc 3

Arc 3 is where the **substrate patterns** move from theory to operating evidence. By end of Arc 3, these reach **OUTLINE+**, with several reaching **DEEP** through sustained homelab operation:

**Foundations (reinforced through the substrate)**

- `virtualization`: Phase 17 (Linux namespaces + cgroups from first principles)
- `privilege-separation` to DEEP: Phase 17 + Phase 19 + Phase 27
- `mediation` to DEEP: Phase 20 (K8s API server as mediator) + Phase 25 (mesh)
- `layering-and-abstraction`: Phase 18 (network stack)
- `control-loops` to DEEP: Phase 20 (K8s reconcilers + Phase 22 Crossplane + Phase 26 custom operator)

**Networking**

- `routing-and-addressing`: Phase 18
- `service-mesh` to DEEP: Phase 25 (Cilium)
- `zero-trust-networking` to DEEP: Phase 25 (mTLS everywhere)
- `service-discovery`: Phase 20
- `load-balancing`: Phase 20
- `network-policy`: Phase 20 + Phase 25

**Distributed systems (Phase 21 DDIA-anchored)**

- `replication` to DEEP: Phase 21
- `consensus`: Phase 21 (Raft-in-Go lab)
- `partitioning`: Phase 21
- `cap-and-pacelc`: Phase 21
- `eventual-consistency`: Phase 21
- `crdts`: Phase 21 (taste)
- `distributed-time`: Phase 21
- `idempotency`: Phase 21 (reinforced from Arc 2)

**Infrastructure-and-platform**

- `declarative-vs-imperative-infrastructure` to DEEP: Phase 22
- `gitops` to DEEP: Phase 20 + Phase 22 sustained through Arc 3
- `immutable-infrastructure`: Phase 19 + Phase 22
- `operator-pattern`: Phase 20 (using) + Phase 26 (building the custom one)
- `platform-as-product` to DEEP: Phase 26 (`ascent` shipped)
- `scaffolder-pattern`: Phase 26

**Security-and-policy**

- `least-privilege` to DEEP: Phase 23 + Phase 25 + Phase 27
- `defense-in-depth` to DEEP: Phase 23 + Phase 27
- `threat-modeling`: Phase 23
- `secrets-lifecycle` to DEEP: Phase 27 (Vault + ESO operational)
- `policy-as-code`: Phase 27 (Kyverno)

**Observability-and-ops**

- `sli-slo-error-budget` to DEEP: Phase 28
- `three-pillars` to DEEP: Phase 28 (metrics + logs + traces on basecamp)
- `distributed-tracing` to DEEP: Phase 28

**FinOps + Reliability**

- `finops`: Phase 29
- `reliability-engineering`: Phase 30
- `disaster-recovery`: Phase 30
- `chaos-engineering`: Phase 30

**Reinforced from prior arcs**

- `idempotency` from Arc 2 gets deeper operating evidence
- `test-pyramid` from Arc 1 reinforced via CI/CD across the multi-cloud platform

~30 patterns first-deepened in Arc 3, with heavy DEEP promotions through the substrate operating evidence. This is the arc where the pattern library shifts from "read about" to "operate daily."

---

## Hardware requirements

Arc 3 needs more RAM than Arc 1-Arc 2. Before starting [Phase 20](/program/arc-3/phase-20/) (Kubernetes), upgrade to **32GB RAM + 1TB external SSD**. By [Phase 28](/program/arc-3/phase-28/) (observability stack), 64GB is recommended for the Prometheus + Tempo + Loki stack to breathe. Cumulative hardware cost: ~$300-500 across Arc 3.

Full breakdown: [homelab/hardware](https://github.com/abukix/homelab/blob/main/hardware.md).

---

## Cloud requirements

```
Arc 3: AWS Deep (Phase 23)          — AWS Free Tier; budget ~$50
Arc 3: Multi-cloud (Phase 24)       — GCP $300 credits; budget $0

TOTAL Arc 3 cloud spend: ~$50-100
```

Cloud is exploration; basecamp's home is the homelab. Free-tier discipline (destroy-on-exit) is itself a [Phase 23](/program/arc-3/phase-23/) lesson.

---

## Arc 3 Final Exam

**Scenario-based final exam.** Three parts:

1. **Build (180 min)**: deploy a new service via ascent across all three clouds (K3s + EKS + GKE) with full hygiene (mesh, secrets, SLO, observability, IaC for any new resources)
2. **Debug (180 min)**: three parallel scenarios from Phases 20, 21, 28 catalogs
3. **Articulate (90 min)**: ~1500 words: walk a request from external Ingress through the full Arc 3 stack down to the kernel and back

See the [full Arc 3 Final Exam spec](/program/arc-3/final-exam/).

---

## Arc 3 graduation

```
You can:
- Operate Linux at the kernel level when debugging requires it
- Read packet captures and reason about TCP/TLS/DNS layer by layer
- Build a container from Linux primitives (and explain Docker as a thin layer over them)
- Operate Kubernetes from first principles with GitOps reconciliation
- Reason about distributed-systems trade-offs from theory + implementation
- Declare infrastructure across clouds with Terraform + Crossplane
- Operate a multi-cloud platform with mesh, secrets, observability, FinOps
- Run DR drills and chaos experiments on a schedule
- Ship OSS that other engineers find useful (forge public, basecamp public)

Exit ramp: Senior DevOps / SRE / Cloud / Platform Engineer
Confidence: real, with multi-cloud basecamp public and ~50 patterns at DEEP
```

→ Continue to [Arc 4: Data Engineering & ML Foundations](/program/arc-4/).

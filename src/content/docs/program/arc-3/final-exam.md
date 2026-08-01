---
title: "Arc 3 Final Exam"
description: "The graduation gate for Arc 3 of /root. Scenario-based. Three parts: Build, Debug, Articulate. Tests substrate competence — OS, networking, containers, K8s, distributed systems, IaC, cloud, mesh, platform, secrets, observability, FinOps, reliability. Prove you can ship as a senior DevOps/SRE/Cloud/Platform engineer."
tags: [arc-3, final-exam, graduation]
arc: 3
---

> The graduation gate for Arc 3, the longest year of /root.
> Scenario-based. Three parts.
> Take it ~2 weeks after Phase 30 ends. Not before.

By the time you sit Arc 3's exam, you've built basecamp through: OS internals through reliability engineering. Multi-cloud GitOps platform with mesh, paved-road CLI, secrets infrastructure, observability stack, FinOps, DR drills. Public on GitHub. The exam asks whether you can use all of it under pressure on a scenario you haven't seen.

The bar for passing is the **Senior DevOps / SRE / Cloud / Platform Engineer** exit ramp: ship a new service end-to-end across the multi-cloud platform via ascent, debug across any layer of the stack, articulate the full request flow with pattern citations.

---

## Ship gates (verify before sitting)

```
[ ] basecamp repo public on GitHub with full README + architecture diagram
[ ] Substrate + `forge` + `ascent` + `beacon` alive: K3s + Flux + Postgres + Redis + Prometheus + Grafana + observability + mesh + IaC + ascent
[ ] Multi-cloud: K3s + EKS + GKE; at least 2 services running on all three
[ ] forge v0.1 + ascent v0.1 shipped publicly
[ ] beacon deployed via ArgoCD across all 3 clouds
[ ] Cilium Mesh with mTLS + identity-aware NetworkPolicy
[ ] Vault + ESO + Sealed Secrets operational
[ ] OTel Collector + Prom + Grafana + Tempo + Loki + Cilium Hubble
[ ] SLO contracts for 3+ services
[ ] DR drill executed; chaos experiments scheduled
[ ] DDIA Ch 5-9 reflections in chronicle/distributed-systems/
[ ] Raft-in-Go lab public
[ ] At least 2 upstream PRs merged in Arc 3
[ ] chronicle: ~50+ Arc 3-specific runbooks, 15+ ADRs
[ ] All 14 phase Exit Tests passed
[ ] ~30 patterns at DEEP; ~50 total at OUTLINE+
[ ] AWS spend < $50; GCP within $300 credits
```

If any ship gate is missing, finish it first.

---

## Exam shape

**Total time:** 6 hours.
**Workspace:** your homelab + AWS + GCP credentials. basecamp running.
**Allowed:** chronicle, project READMEs + ADRs, weekly logs, man pages. **Not allowed:** web search beyond official docs, AI coding for Build, asking another engineer.

| Part | Time | Focus |
|---|---|---|
| **Build** | 180 min | Multi-cloud new-service deployment via ascent with full Arc 3 hygiene |
| **Debug** | 180 min | Three scenarios from Phases 20, 21, 28 catalogs |
| **Articulate** | 90 min | ~1500 words: walk a request from external Ingress down to kernel and back |

Take a 30-minute break between parts.

---

## Part 1: Build (180 min)

**The task:** deploy a new service called `audit-log` across the multi-cloud platform via ascent with full Arc 3 hygiene.

Requirements:
- Service scaffolded via `ascent new service audit-log`
- Deployed to K3s + EKS + GKE via ArgoCD
- mTLS via Cilium Mesh; NetworkPolicy enforced (only allowed callers reach it)
- Secrets pulled from Vault via ESO; one rotated mid-test
- Database backed by Cloud SQL (GCP) and RDS (AWS) via forge modules
- SLO defined (99.5% success over 30 days); burn-rate alerts wired
- OTel-instrumented: structured logs + RED metrics + traces; visible in Grafana
- Backup of any persistent state configured + verified

**Pass bar:**
- After 180 minutes, service Synced and Healthy across all 3 clouds
- mTLS verified
- SLO alert tested
- Backup restore verified
- Total AWS + GCP cost during test < $2

**Anti-pattern checks (auto-fail):**
- `kubectl create` instead of declarative GitOps
- Secrets in plain text
- NetworkPolicy default-allow
- No SLO

---

## Part 2: Debug (180 min)

Three scenarios across Phases 20, 21, 28.

### Catalog seeds (illustrative)

**Phase 20 (K8s + GitOps):**
- *"ArgoCD shows Application OutOfSync; manual sync also fails."* (Possible: immutable field change requires delete+recreate; CRD schema drift; hook failure.)
- *"All 3 replicas of a service are CrashLoopBackOff; logs show OOM."* (Possible: pod resource limit too tight; new code allocates more memory; old PV with stale state.)
- *"Service has 0 endpoints despite pods being Ready."* (Possible: Service selector mismatch; readiness probe wrong; endpoint slices not propagated.)

**Phase 21 (Distributed Systems):**
- *"Postgres replica is 60s behind primary; network is fine."* (Possible: WAL flood from autovacuum; replica I/O saturation; replica single-threaded replay.)
- *"Our Raft cluster has been re-electing every 90s for the past hour."* (Possible: heartbeat misconfig; partition between two of three nodes; clock drift.)
- *"Distributed lock held by a crashed worker; system stuck."* (Possible: lock TTL too long; no lock renewal; no auto-release on crash.)

**Phase 28 (Observability):**
- *"Tempo query for traces from 2 hours ago returns nothing."* (Possible: retention too short; sampling dropped them; storage backend OOM; ingest broken.)
- *"SLO burn-rate alert firing every 5 minutes for one service that looks healthy."* (Possible: SLI definition wrong; ratio denominator stale; multi-burn-rate misconfigured.)
- *"Metrics cardinality exploded; Prometheus OOM after deploy."* (Possible: new high-cardinality label; user ID in metric name; tenant ID in label.)

**Pass bar per scenario:**
- Correct root cause identified
- Runbook entry written + committed
- Patterns cited

---

## Part 3: Articulate (90 min)

**Prompt:** *"Walk a single authenticated request through basecamp from the moment the HTTPS connection opens at the external Ingress to the moment the response bytes leave the same Ingress. Cover: TCP handshake at kernel level, TLS handshake, Ingress controller routing, Cilium NetworkPolicy enforcement, Service-to-Pod resolution, mesh mTLS, application processing (cache check, DB query, queue enqueue, downstream HTTP call), telemetry emission (OTel trace span hierarchy + RED metrics + structured log), and return path. Cite at least 12 patterns and connect each to a specific step. ~1500 words."*

**What a strong answer covers (in any order, with pattern citations):**

- TCP three-way handshake (Phase 18 patterns)
- TLS handshake (Phase 18)
- Ingress controller's routing decision (Phase 20: mediation, load-balancing)
- Cilium NetworkPolicy enforcement at eBPF level (Phase 25: zero-trust-networking)
- Service-to-Pod mediation (Phase 20: service-discovery, mediation DEEP)
- mTLS via mesh (Phase 25: service-mesh, zero-trust)
- Application receiving via `accept(2)` (Phase 17: syscalls, privilege boundary)
- Auth verification (Arc 2 Phase 12: token-vs-session)
- Cache check (Arc 2 Phase 10: cache-aside)
- DB query with EXPLAIN-able path (Arc 2 Phase 9: indexes, MVCC)
- Queue enqueue (Arc 2 Phase 14: message-queue, idempotent-consumer)
- Downstream HTTP with retry + circuit breaker (Arc 2 Phase 16: retry-with-jitter, circuit-breaker)
- OTel trace span hierarchy (Phase 28: distributed-tracing DEEP)
- SLI-SLO contract evaluated against this request (Phase 28: sli-slo-error-budget DEEP)
- Response return path

**Pass bar:**
- ~1500 words; prose
- 12+ patterns cited correctly and connected to steps
- No factual errors at protocol/syscall/system level
- Reads as a real engineer's explanation

---

## Scoring

| Outcome | Meaning |
|---|---|
| **3 Pass** | Full graduation. Move to Arc 4. |
| **2 Pass + 1 Pass-with-notes** | Graduation with action item; address during first 4 weeks of Arc 4. |
| **2 Pass + 1 Fail** | Conditional; re-take within 4 weeks. |
| **≤ 1 Pass** | Not yet. 6-8 weeks of focused investigation; retake. |

---

## After passing

```
You can:
- Operate Linux at kernel level when debugging requires it
- Read packet captures and reason about TCP/TLS/DNS by layer
- Build containers from Linux primitives
- Operate Kubernetes from first principles with GitOps reconciliation
- Reason about distributed-systems trade-offs from DDIA + Raft impl
- Declare infrastructure across clouds with Terraform + Crossplane
- Operate a multi-cloud platform with mesh, secrets, observability, FinOps
- Run DR drills and chaos experiments on schedule
- Ship OSS that other engineers find useful

Exit ramp: Senior DevOps / SRE / Cloud / Platform Engineer
Confidence: real, with multi-cloud basecamp public and ~50 patterns at OUTLINE+
```

→ Continue to [Arc 4: Data Engineering & ML Foundations](/program/arc-4/).

---

## Anti-patterns when sitting the exam

| Anti-pattern | Why |
|---|---|
| Treating the exam as memory test | Competence test. Use your chronicle. |
| Compressing breaks | Fatigue produces wrong answers |
| AI coding for Build | Auto-fail |
| Articulate as bullet lists | Prose is the test |
| Re-taking immediately on Fail | 6-8 weeks. Arc 4 isn't a race. |

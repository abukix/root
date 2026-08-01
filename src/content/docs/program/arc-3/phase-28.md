---
title: "Observability at Platform Depth"
description: "Phase 28 of /root Arc 3: eBPF observability, OpenTelemetry Collector, Prometheus + Grafana + Tempo + Loki on basecamp, SLO discipline as platform contract. Arc 2's service observability becomes Arc 3's platform observability.."
tags: [arc-3, infrastructure, observability, otel, ebpf, slo]
arc: 3
phase: 28
---

> Twelfth phase of Arc 3. Platform-depth observability.

[Arc 2 Phase 15](/program/arc-2/phase-15/) instrumented services from inside. This phase consumes that telemetry at platform scale: OpenTelemetry Collector, Prometheus, Grafana, Tempo (traces), Loki (logs), and eBPF-based observability via Cilium Hubble (free from [Phase 25](/program/arc-3/phase-25/) mesh). By phase end basecamp has the full observability stack alive, every service emits standard signals, every team has SLO contracts, alerts are tied to user-visible outcomes.

This phase reaches **DEEP** on three major patterns: SLI-SLO-error-budget, three-pillars, distributed-tracing. The discipline pays interest for Years 4-5 when ML platforms emit very different telemetry.

---

## Prerequisites

> - [Phase 27](/program/arc-3/phase-27/) complete; secrets infrastructure operational

---

## Why this phase exists

A platform without observability is a black box. Senior engineers don't operate black boxes: they operate systems where every layer's behavior is visible, measurable, and tied to user-visible outcomes. This phase installs that visibility at platform scale.

---

## The pattern-first frame

Same eight steps.

---

## 1. PROBLEM

basecamp runs services across multiple clouds. Each service emits logs, metrics, traces. You need to: collect them centrally, query them efficiently, correlate them across services, define SLOs that map to user experience, alert when SLOs erode.

That's the platform observability problem. The OSS stack (Prometheus + Grafana + Loki + Tempo + OTel Collector) is one solution. Datadog, Honeycomb, New Relic are managed alternatives.

---

## 2. PRINCIPLES

### 2.1 The three pillars at platform scale

Logs (high cardinality, debuggable), metrics (low cardinality, aggregable), traces (cross-service causal). Each pillar answers different questions.

→ Pattern: `three-pillars`, DEEP target

**Investigate:**
- For a production incident, which pillar do you reach for first?
- Why are metrics good for SLOs but bad for individual debugging?
- What's the cardinality problem at platform scale?

### 2.2 SLI / SLO / error budget as platform contract

Service Level Indicator: what you measure. Service Level Objective: the target. Error budget: what's left between target and 100%.

→ Pattern: `sli-slo-error-budget`, **DEEP target**

**Investigate:**
- Pick an SLI for beacon. Defend it. Pick the SLO.
- What's spending the error budget operationally?
- Why are SLOs more useful than SLAs as internal contract?

### 2.3 OpenTelemetry as the standard

OTel SDKs emit; OTel Collector receives, processes, routes to backends. The Collector is the buffer between services and storage.

**Investigate:**
- What does OTel Collector receivers / processors / exporters do?
- Why is the Collector a multi-tenant concern?
- Semantic conventions: why do they matter?

### 2.4 eBPF for zero-code observability

eBPF programs see kernel + syscall events. Cilium Hubble (Phase 25) gives you L7 observability without code changes. Parca, Pyroscope for continuous profiling.

**Investigate:**
- What does Hubble see that OTel doesn't?
- When does eBPF observability replace SDK-based vs augment it?
- What's continuous profiling, and when does it earn its weight?

### 2.5 Distributed tracing at platform depth

Traces follow requests across services. Tail-based sampling captures interesting (slow, error) traces. Head-based sampling drops fast ones.

→ Pattern: `distributed-tracing`, **DEEP target**

**Investigate:**
- Head-based vs tail-based sampling: when each?
- What's the trace ID propagation strategy across the mesh?
- When does distributed tracing reveal what metrics + logs can't?

### 2.6 Alert design (SLO-driven, not metric-driven)

Bad alerts: "CPU above 80%." Good alerts: "Error budget burning faster than X." Alert on the outcome, not the cause.

**Investigate:**
- Why is "CPU above 80%" almost never the right alert?
- What's "alert fatigue," and how does SLO-driven alerting prevent it?
- Multi-window multi-burn-rate alerts: what + when?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Backend | OSS stack (Prom + Grafana + Loki + Tempo); managed (Datadog, Honeycomb); cloud-native | OSS: ops cost, max control. Managed: convenience, vendor cost. Cloud: integrated, lock-in. |
| Sampling | None (100%); fixed %; tail-based | None: storage explosion. Fixed: blind to outliers. Tail: complex, best signal. |
| SLO tooling | Pyrra; Sloth; OpenSLO; manual | Pyrra/Sloth: declarative. Manual: drift. |

---

## 4. TOOLS (as of 2026-06)

- **OpenTelemetry Collector** (K8s-native; deployed via Helm + Flux)
- **Prometheus** (and `kube-prometheus-stack`)
- **Grafana**
- **Loki**: logs
- **Tempo**: traces (or **Jaeger** as alternative; both speak OTel)
- **Cilium Hubble**: eBPF observability (from Phase 25)
- **Pyrra** or **Sloth**: SLO definitions as CRDs (K8s-native; YAML in Git, reconciled by their operators)
- **Pyroscope / Parca**: continuous profiling

The whole observability stack is K8s-native: every component is a CRD-driven controller or a HelmRelease reconciled by Flux. The OTel Collector itself runs as a DaemonSet + Deployment; its configuration is a Kubernetes ConfigMap reconciled like any other resource. The "pillars" are emitted by services, collected uniformly, stored in components that all speak the K8s API.

### Reading
- "Observability Engineering" (Charity Majors et al.)
- "Implementing Service Level Objectives" (Hidalgo)
- OTel docs: semantic conventions
- Google SRE Book: SLO chapters

---

## 5. MASTERY: Full observability on basecamp

```
[ ] OTel Collector deployed on basecamp; receives from all services
[ ] kube-prometheus-stack collecting metrics
[ ] Loki collecting logs
[ ] Tempo collecting traces
[ ] Grafana dashboards: per-service RED + per-cluster USE + platform-wide SLO overview
[ ] At least 3 services with proper SLO definitions in Pyrra/Sloth
[ ] Multi-burn-rate alerts wired; trigger one deliberately and recover
[ ] Cilium Hubble L7 service map operational
[ ] Continuous profiling for at least one service (Pyroscope)
[ ] Tail-based sampling configured for distributed traces
```

---

## 6. COMPARE: Honeycomb or Datadog

Free tier; route OTel data there. Compare query model + insight latency vs OSS local.

400-word reflection.

---

## 7. OPERATE

- 4-5 runbooks: high-cardinality metric explosion, SLO burn alert firing, trace gap diagnosis, OTel Collector OOM, Grafana datasource lag
- 2-3 ADRs (OSS stack over managed, sampling strategy, SLO ownership model)
- Weekly log

---

## 8. CONTRIBUTE

- OTel semantic conventions
- Pyrra / Sloth rule definitions
- A blog post on a real observability debugging story

---

## What ships from this phase

- **Substrate observability layer deepened**: full observability stack
- **SLO contracts** for 3+ services
- **Observability runbooks**

---

## Validation criteria

```
[ ] OTel + Prom + Grafana + Loki + Tempo all running on basecamp
[ ] 3+ services with SLO definitions
[ ] Multi-burn-rate alerts wired
[ ] Continuous profiling for one service
[ ] All 10 operational depth checks
[ ] Compare reflection (400 words)
[ ] 4-5 runbooks
[ ] 2-3 ADRs
[ ] Pattern entries:
    - sli-slo-error-budget → DEEP
    - three-pillars → DEEP
    - distributed-tracing → DEEP
[ ] Exit Test passed
```

---

## Exit Test

**Time: 3 hours.**

### Part 1: Build (90 min)
Add SLO + dashboards + alerts for a new service in basecamp. Verify the SLO burn-rate alert fires when you deliberately degrade the service.

### Part 2: Diagnose (60 min)
A latency scenario: p99 for one service jumped 10× starting an hour ago. Use traces + logs + metrics together to identify root cause.

### Part 3: Articulate (30 min)
~800 words: *"Walk the design of basecamp's observability pipeline. Where each pillar is collected, processed, stored, queried. Where SLOs sit. Where alerts originate. Cite the patterns."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Alerting on CPU > 80% | Resource symptom, not user outcome |
| Free-form logs in production | Unqueryable; grep-by-archaeology |
| Logging every request body | Drowns signal; PII risk |
| Uniform sampling at low % | Loses outliers (exactly what you want) |
| Dashboards as "real observability" | Dashboards show known unknowns. Observability is unknown unknowns. |

---

## Patterns touched this phase

- `sli-slo-error-budget`: **DEEP**
- `three-pillars`: **DEEP**
- `distributed-tracing`: **DEEP**
- `structured-logging` reinforced

---

→ Next: [Phase 29: FinOps + Cost Engineering](/program/arc-3/phase-29/)

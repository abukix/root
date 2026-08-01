---
title: "Service Observability"
description: "Phase 15 of /root Arc 2: instrumentation from inside the service. Three pillars (logs, metrics, traces), structured logging, OpenTelemetry, RED + USE methods. Instrument your Arc 2 service end-to-end. Platform-depth observability (eBPF, full OTel collector, dashboards) is Arc 3 Phase 28.."
tags: [arc-2, backend, observability, opentelemetry]
arc: 2
phase: 15
---

> Seventh phase of Arc 2. Make your service legible to you.

This phase is observability *from inside the service*: the instrumentation a backend engineer adds to their own code so that production failures become diagnosable. Structured logs that tell you who did what when, metrics that tell you what's happening per second, traces that let you follow one request across components. By phase end your Arc 2 service emits all three pillars properly, and you've practiced *using* the telemetry to investigate scenarios you'll see in production.

This is *not* platform-depth observability; that's Arc 3 Phase 28, where eBPF, the OpenTelemetry Collector, Grafana dashboards, and SLO engineering land. Arc 2 is the service-author's side: emit good telemetry. Arc 3 is the platform engineer's side: consume, store, query, alert.

---

## Prerequisites

> - [Phase 14](/program/arc-2/phase-14/) complete; async work operational
> - You accept: **observability is engineering. Logs that are noise teach you to ignore logs. Metrics that aren't tied to outcomes are decoration.**

---

## Why this phase exists

Most production services emit telemetry by accident: some `print` statements, a few metrics on stdout, no traces. When the inevitable production incident happens, debugging is archaeology. Senior engineers instrument *deliberately*, emitting the data they'd want at 3am: structured logs with request IDs, metrics aligned to user-visible outcomes, traces that span service boundaries. This phase installs that discipline.

---

## The pattern-first frame

Same eight steps as every phase.

---

## 1. PROBLEM

Your service runs. Sometimes things go wrong. Sometimes things are slow. Sometimes things are silently broken in ways you only discover when a user complains. Without telemetry, you reach for guesses. With good telemetry, you reach for evidence.

That's the observability problem. The "three pillars" (logs, metrics, traces) cover most production scenarios. OpenTelemetry (OTel) is the vendor-neutral standard for emitting all three. Each pillar answers different questions; using them together is what makes a service truly observable.

---

## 2. PRINCIPLES

### 2.1 The three pillars (logs, metrics, traces)

- **Logs**: discrete events with context ("user 42 logged in," "DB query took 800ms"). High cardinality, hard to aggregate.
- **Metrics**: numerical time-series ("requests per second," "queue depth"). Low cardinality, easy to aggregate, hard to debug individual events.
- **Traces**: causal chains of operations across components ("request X went through auth → DB → cache → response in 250ms total").

→ Pattern: `three-pillars`

**Investigate:**
- For your service, list 5 questions you'd want answered in production. Which pillar(s) answer each?
- Why are metrics good for SLOs but bad for debugging individual issues?
- What's the cardinality problem in metrics? (Hint: high-cardinality labels explode storage.)

### 2.2 Structured logging

Logs as JSON (or another structured format) instead of free-form text. Each log entry has fields you can query, filter, aggregate. Free-form logs are searchable; structured logs are *queryable*.

→ Pattern: `structured-logging`

**Investigate:**
- Why is `logger.info("user logged in: %s", user_id)` worse than `logger.info("user_logged_in", user_id=user_id)`?
- What's a request ID, and why is it the single highest-leverage log field?
- What's a context-aware logger (Python `structlog`, Go `slog`), and why is propagation the hard part?

### 2.3 Metrics and the RED method

RED for request-driven services: **Rate** (requests per second), **Errors** (error rate), **Duration** (latency distribution). Three metrics per endpoint, applied uniformly, give you 80% of operational visibility.

→ Pattern: `red-method`

**Investigate:**
- For your service, define RED metrics for the top 5 endpoints.
- Why is latency p99 (99th percentile) more useful than average latency?
- What's the difference between counter, gauge, histogram in Prometheus? When is each right?

### 2.4 Distributed tracing

A trace follows a single request as it touches multiple components (auth to DB to cache to queue to external API). Each operation is a *span*; spans nest. The trace shows you exactly where the request spent its time.

→ Pattern: `distributed-tracing`

**Investigate:**
- What's a trace ID, a span ID, and how do they propagate across HTTP boundaries (W3C Trace Context header)?
- Why is sampling necessary at scale? What's head-based vs tail-based sampling?
- When do traces beat metrics + logs combined? (Hint: cross-component latency issues.)

### 2.5 OpenTelemetry as the standard

OTel is the vendor-neutral SDK + protocol for all three pillars. Instrument once with OTel; route to any backend (Prometheus, Tempo, Jaeger, Honeycomb, Datadog, Grafana Cloud, etc.). The Arc 3 platform will deploy a full OTel Collector; this phase emits OTel from the service side.

**Investigate:**
- What's the OTel Collector, and why is it the buffer between your service and the backend?
- What's a Resource (in OTel terms), and what should it contain?
- Why is OTel "auto-instrumentation" good for some languages and weaker for others?

### 2.6 The USE method (for system resources)

USE for resources: **Utilization** (% busy), **Saturation** (queue length), **Errors** (error count). Applied to CPU, memory, disk, network. The right framing for resource-bound issues that RED doesn't catch.

**Investigate:**
- When does a service look "fine" on RED but bad on USE? (Hint: backpressure not yet visible at request level.)
- What's the difference between utilization at 80% (healthy) vs 99% (saturated)?
- How does USE compose with RED for full coverage?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Logging library | `structlog` (Python); `slog` stdlib (Go); language defaults | structlog: rich, mature. slog: built-in, fast. Defaults: often unstructured. |
| Metrics library | Prometheus client (`prometheus_client` Python, `prometheus/client_golang` Go); OTel metrics | Prometheus client: simple. OTel: standard, more abstraction. |
| Tracing | OTel SDK; vendor-specific SDK (Datadog, New Relic) | OTel: portable. Vendor: tighter integration with their backend. |
| Sampling | Always (100%); fixed % (1-10%); tail-based (by trace) | Always: ground truth, expensive. Fixed %: cheap, blind to outliers. Tail: best signal, complex. |
| Backend (Arc 3 territory) | Prometheus + Tempo + Loki + Grafana; OTel Collector + cloud (Honeycomb, Datadog); self-hosted ELK | OSS stack: ops cost, max control. Cloud: convenience, lock-in. ELK: legacy, heavy. |

---

## 4. TOOLS (as of 2026-06)

### Service-side instrumentation
- **OpenTelemetry SDKs**: Python, Go, JavaScript, Java, .NET, more
- **`structlog` (Python)** or **`slog` (Go stdlib)**: structured logging
- **Prometheus client libraries**: `prometheus_client` (Python), `prometheus/client_golang` (Go)

### Local backends for development
- **Jaeger**: local trace UI for development
- **Grafana Tempo**: production-quality trace backend (Arc 3)
- **Prometheus + Grafana**: metrics (Arc 3)
- **Loki**: log aggregation (Arc 3)

### Reading
- "Observability Engineering" (Charity Majors et al.), the canonical practitioner book
- OpenTelemetry docs (especially the semantic conventions)
- "Distributed Tracing in Practice" (O'Reilly, Parker et al.)
- Brendan Gregg's USE method writeup

---

## 5. MASTERY: Instrument your Arc 2 service with OTel

### 5.1 The deliverable

Your Arc 2 service emits all three pillars via OpenTelemetry:

- **Structured logs** with request ID propagated across HTTP, DB, cache, queue boundaries
- **RED metrics** per endpoint + per background job + per webhook
- **USE metrics** for the underlying resources (CPU, memory, queue depth, DB connection pool)
- **Distributed traces** showing request flow through HTTP → auth → DB → cache → queue → response
- **Service name + version + environment** propagated as OTel Resource attributes

Plus: one **runnable debugging exercise**, given a simulated incident, you use the telemetry to identify root cause.

### 5.2 Operational depth checklist

```
[ ] Add structured logging to your service; verify request ID propagates across all components
[ ] Add OTel metrics: RED per endpoint + queue depth + DB pool stats
[ ] Add OTel traces: spans for HTTP requests, DB queries, cache lookups, queue ops
[ ] Run Jaeger (or Tempo) locally; view your traces
[ ] Trigger a synthetic incident (e.g., slow DB query, queue stuck); use telemetry to investigate
[ ] Identify a high-cardinality label in your metrics; understand the cost
[ ] Configure tail-based sampling for at least one trace
[ ] Add at least 2 ADR-worthy alerts: "error rate above 5% sustained 5 min" and one custom for your domain
[ ] Read OTel semantic conventions for HTTP, DB; align your instrumentation
[ ] Read Charity Majors' "Observability is a Practice, Not a Tool"
```

---

## 6. COMPARE: Honeycomb or Datadog (free tier)

Pick one:

- **Honeycomb**: sign up for the free tier; route your OTel data there. Compare the query model to local Jaeger.
- **Grafana Cloud (free tier)**: same exercise.

400-word reflection on what the managed backend buys vs the OSS local stack.

---

## 7. OPERATE

- 3-4 runbooks: "Service slow, investigate with traces," "Error rate spiked, investigate with logs + metrics," "Memory leak, investigate with USE"
- 1-2 ADRs (e.g., "Why OTel-native vs Prometheus-native instrumentation")
- Weekly log

---

## 8. CONTRIBUTE

- OpenTelemetry semantic conventions: clarify a section
- `structlog` or `slog` examples
- A blog post (when blog is live) on a real debugging story your telemetry made possible

---

## What ships from this phase

- **Arc 2 service emitting OTel logs + metrics + traces**
- **Observability runbooks** in `chronicle`
- **Pattern OUTLINEs**: three-pillars, structured-logging, distributed-tracing, RED method

---

## Learning loop cadence

```
Week 1     PROBLEM + PRINCIPLES 2.1-2.2 (three pillars, structured logs)
           Add structlog/slog; request ID propagation

Week 2     PRINCIPLES 2.3 (RED method)
           Add Prometheus or OTel metrics; RED per endpoint

Week 3     PRINCIPLES 2.4-2.5 (tracing, OTel)
           Add OTel traces; run Jaeger locally

Week 4     PRINCIPLES 2.6 (USE method)
           Resource metrics; alert thresholds

Week 5     COMPARE: managed backend
           Synthetic-incident exercises

Week 6-7   OPERATE + CONTRIBUTE
           Exit Test
```

---

## Validation criteria

```
[ ] Arc 2 service emits all three OTel pillars properly
[ ] Request ID propagates across all components
[ ] RED metrics for top 5 endpoints
[ ] Synthetic incident debugged using telemetry
[ ] All 10 operational depth checks
[ ] Compare reflection (400 words)
[ ] 3-4 observability runbooks
[ ] 1-2 ADRs
[ ] Pattern entries deepened STUB → OUTLINE:
    - three-pillars
    - structured-logging
    - distributed-tracing
    - red-method
[ ] Exit Test passed
```

---

## Exit Test

**Time: 2.5 hours.**

### Part 1: Build (60 min)
Add OTel instrumentation to a new endpoint (provided spec). Logs, metrics (RED), and a trace span hierarchy. Verify in Jaeger and the metrics endpoint.

### Part 2: Diagnose (75 min)
A telemetry scenario (provided): given logs + metrics + traces of a 10-minute window with an anomaly, identify what went wrong. Possible: cache stampede; slow DB query; downstream timeout; lock contention.

### Part 3: Articulate (15 min)
~400 words: *"When would you reach for traces vs logs vs metrics for the same investigation? Use one real example from your debug session."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Free-form `print` "logs" in production | Unqueryable. Future-you can't grep what they didn't structure. |
| High-cardinality labels in metrics | Storage explosion; alerts become noisy |
| Logging every request body | Drowns the signal; expensive; potential PII leak |
| Sampling traces uniformly at 1% | Loses outliers (which are exactly what you want to investigate) |
| Treating dashboards as "real observability" | Dashboards show known unknowns. Observability is finding unknown unknowns. |

---

## Patterns touched this phase

- `three-pillars`: first OUTLINE
- `structured-logging`: first OUTLINE
- `distributed-tracing`: first OUTLINE
- `red-method`: first OUTLINE

---

→ Next: [Phase 16: Backend at Scale](/program/arc-2/phase-16/)

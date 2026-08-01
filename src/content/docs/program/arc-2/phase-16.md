---
title: "Backend at Scale"
description: "Phase 16 of /root Arc 2: rate limiting, idempotency keys, retries with backoff and jitter, circuit breakers, bulkheads. The resilience patterns that turn 'my service works' into 'my service survives.' Final Arc 2 phase.."
tags: [arc-2, backend, resilience, rate-limiting]
arc: 2
phase: 16
---

> Eighth and final phase of Arc 2. Resilience as a design discipline.

This phase closes Arc 2 by installing the patterns that turn a working service into a service that survives production. Rate limiting (so one bad actor doesn't take you down). Idempotency keys (so retries are safe). Retries with backoff + jitter (so failures don't cascade). Circuit breakers (so downstream outages don't propagate). Bulkheads (so one slow consumer doesn't starve the others). These are the patterns every production service eventually needs; learning them deliberately is the difference between calm engineering and post-incident scrambling.

By phase end your Arc 2 service has each of these patterns applied where they earn their weight, documented in ADRs, and verified via failure-injection exercises. The service is *production-shaped*. Arc 3 will move it to K8s; Years 4-5 will add data and AI on top. This phase is the resilience handoff.

---

## Prerequisites

> - [Phase 15](/program/arc-2/phase-15/) complete; observability working (you need telemetry to verify resilience patterns)
> - You accept: **failure is the default. Resilience is what you add deliberately to delay or contain it.**

---

## Why this phase exists

Most production outages have predictable shapes: traffic spike → upstream overload → cascading failures, downstream timeout → retries → retry storm → DDoS-on-yourself, partial outage → consumers stuck waiting → resource exhaustion → full outage. Each shape has a known mitigation pattern. Senior engineers apply these patterns *before* the outage, not in the postmortem.

This phase installs the playbook. You won't avoid all outages (nobody does), but you'll avoid the predictable ones, and the ones that do happen will be smaller and shorter.

---

## The pattern-first frame

Same eight steps as every phase.

---

## 1. PROBLEM

Your service works. But the world it lives in is hostile: traffic spikes, malicious clients, slow downstreams, network blips, bugs in dependencies, resource exhaustion. Without resilience patterns, any of these can cascade into a full outage. With them, the service degrades gracefully and recovers automatically.

That's the resilience problem. The patterns are well-known (rate limiting, retries with backoff + jitter, circuit breakers, bulkheads, timeouts, graceful degradation) but underapplied. Most services skip them until after the first outage.

---

## 2. PRINCIPLES

### 2.1 Rate limiting

Limit how often a client (or all clients combined) can hit an endpoint. Protects against malicious traffic, runaway clients, and accidental DDoS. Token bucket is the workhorse algorithm; sliding window is the alternative.

→ Pattern: `token-bucket-rate-limiting`

**Investigate:**
- Walk a token bucket: tokens refill at rate R, max capacity C, each request consumes 1 token. What happens at burst? At steady state?
- What's the trade-off between token bucket and sliding window?
- Where do you enforce rate limits: application, reverse proxy (nginx, HAProxy), API gateway, network?

### 2.2 Idempotency keys

A client-supplied key (typically a UUID) that lets the server detect duplicate requests. The first request with key K processes; subsequent requests with the same key return the cached result. Critical for safe retries.

→ Pattern: `idempotency-keys`

**Investigate:**
- Why is client-supplied idempotency key better than server-generated?
- How long do you cache idempotency results? (Hint: depends on retry window.)
- Walk Stripe's idempotency-key implementation (their docs are excellent and public).

### 2.3 Retries with backoff + jitter

When a request fails (timeout, 5xx, transient error), retry, but with delays between attempts that grow exponentially and include randomness. Without backoff, retries become DDoS-on-yourself. Without jitter, retries synchronize and create thundering herds.

→ Pattern: `retry-with-jitter`

**Investigate:**
- Walk the timeline: initial request fails → wait `base × 2^attempt + random(0, jitter)` → retry.
- Why does jitter matter? (Hint: imagine 10,000 clients retrying at exactly the same time.)
- When do you *not* retry? (Hint: 4xx responses, idempotency violations.)

### 2.4 Circuit breakers

When a downstream is failing, stop calling it. The circuit "opens" after N failures; for the open duration, requests fail fast without trying the downstream; periodically the circuit goes "half-open" to test recovery.

→ Pattern: `circuit-breaker`

**Investigate:**
- Walk the three states: closed (normal), open (fail fast), half-open (testing).
- Why is "fail fast" sometimes better than "keep trying"? (Hint: bounded resource usage.)
- What's the trade-off vs unbounded retries with backoff?

### 2.5 Bulkheads

Isolate resources so failure in one area doesn't drain resources from another. Separate thread pools for different downstreams; separate connection pools; separate queues. A bulkhead is what prevents one slow consumer from starving the rest.

→ Pattern: `bulkhead`

**Investigate:**
- For your service: which downstreams should share a thread pool vs separate? Which should share a DB connection pool vs separate?
- What's the cost of bulkheads? (Hint: under-utilized capacity in each compartment.)
- When do bulkheads + circuit breakers together earn their weight?

### 2.6 Timeouts and graceful degradation

Every outbound call has a timeout. Never block forever. When a downstream is unavailable, degrade gracefully: return a stale cache, return an empty result, return a 503, but never hang.

**Investigate:**
- For your service: what's the timeout on every outbound call? Are they explicit or default?
- What's graceful degradation for your service? What's the user-visible behavior when X is down?
- Why is "default to fail-open vs fail-closed" a real architecture question?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Rate limit algorithm | Token bucket; sliding window; fixed window | Token bucket: burst-friendly. Sliding window: precise. Fixed: simple, edge artifacts. |
| Rate limit storage | In-memory; Redis; database | In-memory: per-instance only. Redis: distributed. DB: durable, slower. |
| Retry policy | Exponential + jitter; linear; none | Exp + jitter: standard. Linear: predictable but synchronized. None: brittle. |
| Circuit breaker library | Hand-rolled; `pybreaker` (Python); `gobreaker` (Go); Hystrix-style | Hand-rolled: fits exactly, more code. Libraries: faster, slightly opinionated. |
| Bulkheading | Separate pools per downstream; shared with limits; no bulkheading | Separate: best isolation, complex. Shared: simple, cascading risk. None: production hazard. |

---

## 4. TOOLS (as of 2026-06)

### Libraries
- **Python**: `pybreaker` (circuit breaker), `tenacity` (retries), `slowapi` (rate limiting for FastAPI)
- **Go**: `gobreaker`, `cenkalti/backoff` (retries), `ulule/limiter` or `juju/ratelimit` (rate limiting), `sony/gobreaker`

### Cross-cutting infrastructure
- **Reverse proxies** with rate limiting: nginx, HAProxy, Envoy
- **API gateways**: Kong, Tyk (mention; full deploy in Arc 3)

### Reading
- "Release It!" (Michael Nygard, 2nd ed.), the canonical resilience-patterns book
- AWS Architecture Blog: "Exponential backoff and jitter" (Marc Brooker)
- Stripe's idempotency docs
- "The Tail at Scale" (Dean + Barroso, Google paper)

---

## 5. MASTERY: Apply resilience to your Arc 2 service

### 5.1 The deliverable

Your Arc 2 service now has:

- **Rate limiting** on at least 3 endpoints (e.g., login, signup, expensive-query endpoint); per-IP + per-authenticated-user limits
- **Idempotency keys** supported on at least one POST endpoint (a mutation that you'd want to retry safely)
- **Retries with exponential backoff + jitter** on all outbound calls (downstream HTTP, DB queries with retry-safe operations)
- **Circuit breakers** on every external dependency (Postgres, Redis, downstream HTTP, webhook delivery)
- **Bulkheads**: separate connection/thread pools for the critical path vs background work
- **Timeouts** on every outbound call, explicit, documented
- **A graceful-degradation plan** documented for at least one critical dependency

### 5.2 Operational depth checklist

```
[ ] Add token-bucket rate limiting; verify with a small load script
[ ] Implement idempotency-key support on one POST endpoint; verify with duplicate requests
[ ] Wrap every outbound call with retry + jitter; verify with chaos test
[ ] Add circuit breakers to every external dependency
[ ] Trip a circuit breaker deliberately (kill the downstream); observe fast-fail behavior; recover
[ ] Separate connection pools for background jobs vs request path
[ ] Audit every outbound call; ensure each has an explicit timeout
[ ] Write a graceful-degradation runbook: what happens when Redis is down? Postgres? webhook target?
[ ] Run a chaos test: kill Redis for 30 seconds during traffic; observe + recover
[ ] Read "Release It!" Ch. 4-6 (Stability Patterns)
```

---

## 6. COMPARE: API gateway rate limiting

Set up nginx or HAProxy in front of your service (or Envoy). Move rate limiting from the application to the gateway. Compare:
- What's easier to manage at each layer?
- What's the cost of crossing the gateway?
- When does in-app rate limiting matter? (Hint: business-logic rate limits like "max 10 emails per user per hour.")

400-word reflection.

---

## 7. OPERATE

- 4-5 runbooks: "Rate limit triggered legitimately, investigate," "Circuit breaker stuck open," "Retry storm, diagnose and mitigate," "Idempotency-key collision," "Bulkhead exhausted"
- 2 ADRs: rate-limit storage; bulkhead strategy
- Weekly log

---

## 8. CONTRIBUTE

- A resilience library: docs or examples
- A blog post (when blog is live) on a specific resilience pattern you applied
- Your first attempt at a real merged PR if you haven't yet: this is a good year to land

---

## What ships from this phase

- **Arc 2 service production-shaped**: rate limited, idempotent, retry-safe, circuit-broken, bulkheaded
- **Resilience runbooks** in `chronicle`
- **Pattern OUTLINEs**: token-bucket-rate-limiting, idempotency-keys, retry-with-jitter, circuit-breaker, bulkhead
- **Arc 2 portfolio complete**: ready for the Arc 2 Final Exam

---

## Learning loop cadence

```
Week 1     PROBLEM + PRINCIPLES 2.1 (rate limiting)
           Token-bucket rate limiting on 3 endpoints

Week 2     PRINCIPLES 2.2 (idempotency keys)
           Idempotency on one POST endpoint

Week 3     PRINCIPLES 2.3-2.4 (retries, circuit breakers)
           Retries + breakers on all outbound calls

Week 4     PRINCIPLES 2.5-2.6 (bulkheads, timeouts)
           Connection pool separation; timeout audit

Week 5     Chaos tests; graceful-degradation runbook
           COMPARE: gateway-level rate limiting

Week 6     chronicle runbooks; OPERATE + CONTRIBUTE

Week 7     Exit Test + Arc 2 Final Exam prep
```

---

## Validation criteria

```
[ ] Arc 2 service has rate limiting + idempotency + retries + circuit breakers + bulkheads
[ ] Chaos tests verify each pattern works
[ ] All 10 operational depth checks
[ ] Compare reflection (400 words)
[ ] 4-5 resilience runbooks
[ ] 2 ADRs
[ ] Pattern entries deepened STUB → OUTLINE:
    - token-bucket-rate-limiting
    - idempotency-keys
    - retry-with-jitter
    - circuit-breaker
    - bulkhead
[ ] Exit Test passed
[ ] Arc 2 Final Exam prep can begin
```

---

## Exit Test

**Time: 3 hours.**

### Part 1: Build (90 min)
Apply rate limiting + idempotency + retry + circuit breaker + bulkhead to a new feature (spec provided). Each pattern justified and verified.

### Part 2: Chaos (60 min)
Run three chaos scenarios (provided: e.g., kill Redis, slow Postgres, simulate downstream HTTP 503). Service degrades gracefully and recovers. Document observations.

### Part 3: Articulate (30 min)
~600 words: *"Walk a request through your service that hits the worst-case path: rate-limited, retried, circuit-breaker tripped, bulkhead saturated. Cite each pattern and what it prevents."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Retries without backoff | Linear retries = DDoS-on-yourself |
| Retries without jitter | Synchronized retries = thundering herd |
| Circuit breakers without metrics | You can't tune what you can't see |
| Rate limits only at the edge | Internal services can take each other down too |
| Hand-coded resilience per call site | Inconsistent, easy to skip. Centralize via library or middleware. |

---

## Patterns touched this phase

- `token-bucket-rate-limiting`: first OUTLINE
- `idempotency-keys`: first OUTLINE
- `retry-with-jitter`: first OUTLINE
- `circuit-breaker`: first OUTLINE
- `bulkhead`: first OUTLINE

---

→ Next: [Arc 2 Final Exam](/program/arc-2/final-exam/)

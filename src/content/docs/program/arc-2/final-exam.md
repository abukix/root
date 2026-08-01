---
title: "Arc 2 Final Exam"
description: "The graduation gate for Arc 2 of /root. Scenario-based. Three parts: Build, Debug, Articulate. Tests backend engineering competence — SQL, caching, APIs, auth, containers, queues, observability, resilience. Prove you can ship as a mid-level backend engineer."
tags: [arc-2, final-exam, graduation]
arc: 2
---

> The graduation gate for Arc 2.
> Scenario-based. Three parts.
> Take it ~2 weeks after Phase 16 ends. Not before.

The Arc 2 Final Exam is not a memory test. It's a competence test. By the time you sit it, you've spent ~12 months building one real backend service end-to-end, adding Postgres, Redis caching, REST + gRPC APIs, OAuth auth, containerization, async queues, OpenTelemetry observability, and the full set of resilience patterns. The exam asks whether you can *use* all of that under pressure on a scenario you haven't seen.

The bar for passing is the bar for the **Mid-level Backend Engineer** exit ramp: ship a real backend feature end-to-end with production hygiene, debug any layer of your service from first principles, and articulate the design decisions in clear technical prose.

---

## Ship gates (verify before sitting the exam)

You don't sit the exam until all ship gates are met.

```
[ ] Your Arc 2 service is publicly on GitHub
[ ] Postgres-backed with deliberate schema + migrations + indexes
[ ] Redis caching applied to at least one path with documented strategy
[ ] REST + gRPC APIs with OpenAPI/Protobuf contracts
[ ] Real auth (OAuth/JWT/session) + RBAC
[ ] Containerized via multi-stage Dockerfile + docker-compose for local dev
[ ] Async background jobs + outbound webhooks with idempotent consumers
[ ] OTel instrumentation: structured logs + RED metrics + traces
[ ] Resilience patterns: rate limiting, idempotency keys, retries + jitter, circuit breakers, bulkheads
[ ] CI green; coverage badge; semantic versioning; v1.0.0+ released
[ ] All 8 phase Exit Tests passed
[ ] ~25 Pattern Library entries at OUTLINE
[ ] chronicle: ~25+ Arc 2-specific runbooks
```

If any ship gate is missing, finish it before sitting the exam.

---

## Exam shape

**Total time:** 6 hours, taken in one sitting.
**Mode:** self-administered or AI-administered.
**Workspace:** your dev environment. Service running locally via docker-compose. Telemetry visible.
**Resources allowed:** man pages, official docs, your chronicle, your project READMEs and ADRs, your weekly logs. Not allowed: web search beyond official docs, AI coding assistance for Build, asking another engineer.

Three parts:

| Part | Time | Focus |
|---|---|---|
| **Build** | 180 min | Ship a new feature end-to-end with all Arc 2 hygiene |
| **Debug** | 180 min | Three parallel scenarios from Phases 9, 14, 16 catalogs |
| **Articulate** | 60 min | ~1500 words: trace a request through your service |

Take a 30-minute break between parts.

---

## Part 1: Build (180 min)

**The task:** add a new feature to your Arc 2 service end-to-end, applying every Arc 2 capability.

**The spec** (adapt to your service's domain):

> Add an endpoint that returns "personalized recommendations" for an authenticated user, where:
> - Authentication is required (Phase 12)
> - The recommendation list is cached in Redis with appropriate TTL (Phase 10)
> - The list is derived from a moderately complex SQL query (Phase 9: JOIN, aggregation)
> - Both REST and gRPC versions exist (Phase 11)
> - The endpoint is rate-limited per user (Phase 16)
> - The endpoint is observable: structured log per request, RED metrics, trace span (Phase 15)
> - A background job recomputes the recommendation cache every 5 minutes (Phase 14)
> - The cache miss path has stampede protection (Phase 10)
> - The endpoint has explicit timeouts + retry policy for any downstream calls (Phase 16)
> - It's all containerized in your existing docker-compose setup (Phase 13)

**Pass bar:**
- After 180 minutes, the feature works end-to-end
- All Arc 2 patterns are visibly applied
- Tests cover the new code (>70%)
- OpenAPI spec updated; Protobuf updated for gRPC

**Anti-pattern checks (auto-fail):**
- No tests for the new code
- AI-generated code without your review/edit
- Skipping the OpenAPI/Protobuf updates
- Hardcoded secrets (auth tokens, signing keys)

---

## Part 2: Debug (180 min)

Three scenarios run in parallel.

### Catalog seeds (illustrative)

**Phase 9 (Database) examples:**
- *"The `/users/me` endpoint went from p99 < 50ms to p99 > 2s overnight, with no deploy."* (Possible: missing index after autovacuum; bloated tables; stats stale; cache hit rate dropped.)
- *"This Postgres query is using a sequential scan despite an index on the column."* (Possible: planner stats stale; selectivity wrong; function on the column blocks index use.)
- *"Connection-pool exhaustion every Monday at 9am."* (Possible: weekly job opens connections it doesn't close; weekly traffic spike + slow query holding connections.)

**Phase 14 (Queues + Events) examples:**
- *"The DLQ went from 0 to 10,000 messages in an hour."* (Possible: schema change broke deserialization; new consumer crashes on a specific input; downstream API auth expired.)
- *"Webhooks are being delivered but consumers report duplicates."* (Possible: at-least-once retries without idempotency; webhook target acks slow + retry fires.)
- *"Background job throughput dropped 80% after a deploy."* (Possible: new code holds DB connection for the entire job; serialization slowdown; queue partition rebalance.)

**Phase 16 (Resilience) examples:**
- *"A circuit breaker is stuck open even though the downstream is healthy."* (Possible: half-open test ratio too low; spurious failures in half-open state; configuration drift.)
- *"Legitimate users are being rate-limited."* (Possible: rate limit too tight after traffic growth; per-IP limit catching NAT users; clock drift on rate-limiter storage.)
- *"Retries are amplifying load on a degraded downstream."* (Possible: jitter missing; retry budget unbounded; circuit breaker not catching.)

**Pass bar per scenario:**
- Correct root cause identified
- Runbook entry written
- Patterns cited

---

## Part 3: Articulate (60 min)

**Prompt:** *"Walk a single authenticated POST request through your service from the moment the HTTPS connection opens to the moment the response bytes are written back. Cover: TLS handshake, auth verification, rate-limit check, idempotency-key check, business logic, DB read + write, cache update, background job enqueue, webhook fanout, observability instrumentation (log + metric + trace span hierarchy), timeout + retry behavior of any downstream calls. ~1500 words."*

**Pass bar:**
- ~1500 words; prose; not bullet lists
- Cites at least 10 patterns correctly and connects them to specific steps
- No factual errors at the protocol or system level
- Reads as a real engineer's explanation, not a textbook

---

## Scoring

Each part is graded Pass / Pass-with-notes / Fail.

| Outcome | Meaning |
|---|---|
| **3 Pass** | Full graduation. Move to Arc 3. |
| **2 Pass + 1 Pass-with-notes** | Graduation with action item. Address notes during the first 4 weeks of Arc 3. |
| **2 Pass + 1 Fail** | Conditional graduation. Re-take the failed part within 4 weeks. Arc 3 can begin in parallel. |
| **≤ 1 Pass** | Not yet. Identify the gap, work through the relevant phase exit-test catalog, retake the full exam after 4-6 weeks. |

---

## After passing

```
You can:
- Design a Postgres schema + indexes + queries that don't degrade at scale
- Apply caching deliberately with stampede protection
- Design REST + gRPC APIs that survive versioning
- Add real auth + RBAC + secret rotation
- Containerize and run via docker-compose
- Add async work + webhooks with idempotent consumers
- Instrument a service end-to-end with OpenTelemetry
- Apply backend-at-scale resilience patterns (rate limit, idempotency, retry, circuit breaker, bulkhead)
- Defend technical decisions in clear technical prose

Exit ramp: Mid-level Backend Engineer
Confidence: real, with a shipped service exercising every Arc 2 capability
```

→ Continue to [Arc 3: Infrastructure & Platform Engineering](/program/arc-3/).

---

## Anti-patterns when sitting the exam

| Anti-pattern | Why |
|---|---|
| Treating the exam as a memory test | It's a competence test. Use your chronicle. |
| Compressing breaks | Cognitive fatigue produces wrong answers |
| Asking AI to write the Build code | Auto-fail |
| Writing Articulate as bullet lists | Prose is the test |
| Re-taking immediately on a Fail | Give yourself 4-6 weeks. Arc 3 isn't a race. |

---
title: "Backend Engineering"
description: "Arc 2 of /root: ~8 phases that turn the engineer who can ship code into the engineer who can ship services. SQL + Redis + HTTP/gRPC + auth + containers + queues + observability + backend-at-scale patterns. Build and ship a real backend service. Exit ramp: Mid-level Backend Engineer."
tags: [program, arc-2, backend, software-engineering]
arc: 2
---

> Arc 2 of /root. Code becomes *services*.
> ~8 phases that install everything a working backend engineer needs to ship.
> Exit ramp: **Mid-level Backend Engineer**

Arc 1 built the engineer. Arc 2 builds the *backend engineer*. The difference: Arc 1 made you fluent in two languages and gave you the engineering hygiene to ship CLIs. Arc 2 makes you competent at the actual job most software engineers do: designing and operating *services* that talk to databases, expose APIs, authenticate users, do work asynchronously, observe themselves under load, and survive being called by other services.

There's no platform tier alive yet; Kubernetes lands in Arc 3. Arc 2 ships your service running locally in Docker, with the discipline of a real production team but the deployment footprint of a developer's laptop. By Arc 3 you'll move that service to K3s + ArgoCD on the homelab; by Arc 4 the data tier hosts its persistent state; by Arc 5 ML and AI capabilities sit on top. The substrate is still ahead. Arc 2 builds *what runs on the substrate*.

---

## What you'll know at the end of Arc 2

- **SQL + relational databases** at depth: Postgres internals enough to debug from first principles, schema design, query optimization, transactions, MVCC.
- **Redis + caching patterns**: cache-aside, write-through, TTL strategy, stampede protection, eviction policies.
- **HTTP, REST, gRPC, API design**: Richardson maturity, versioning, OpenAPI contracts, when REST wins vs when gRPC wins.
- **Authentication & authorization**: OAuth 2.0, OIDC, JWT, session vs token trade-offs, RBAC and beyond.
- **Containers as a user**: Dockerfiles, multi-stage builds, image hygiene, docker-compose for local dev. (Containers-from-scratch is Arc 3 P19.)
- **Message queues + event-driven patterns**: queue vs pub/sub, delivery semantics, idempotent consumers, dead-letter handling.
- **Service observability**: three pillars (logs/metrics/traces), structured logging, OpenTelemetry, RED + USE methods.
- **Backend-at-scale patterns**: rate limiting, idempotency keys, retries with backoff + jitter, circuit breakers, bulkheads.

You'll have built and shipped **one real backend service** end-to-end, exercising every capability above. The service is yours: domain of your choice (RSS aggregator, URL shortener, link aggregator, paste service, todo API, whatever interests you). The phases supply the capabilities; you supply the product.

---

## Phase map

| Phase | Title | Weeks | Hours | Capability added | Pattern depth focus |
|---|---|---|---|---|---|
| [9](/program/arc-2/phase-9/) | SQL & Relational Databases | 6-8 | 60-80 | Postgres backing your service | write-ahead-logging, mvcc, indexes-as-pattern, query-planning |
| [10](/program/arc-2/phase-10/) | Redis & Caching Patterns | 4-6 | 40-60 | Cache layer on top of Postgres | cache-aside, write-through, cache-stampede |
| [11](/program/arc-2/phase-11/) | HTTP, REST, gRPC & API Design | 5-7 | 50-70 | REST + gRPC APIs with OpenAPI contracts | rest-as-pattern, grpc-as-pattern, api-versioning |
| [12](/program/arc-2/phase-12/) | Authentication & Authorization | 5-7 | 50-70 | OAuth/JWT/session-based auth + RBAC | token-vs-session, oauth-flow, rbac |
| [13](/program/arc-2/phase-13/) | Containers as a User | 4-6 | 40-60 | Dockerized service + docker-compose | containerization-as-user, image-layers, multi-stage-builds |
| [14](/program/arc-2/phase-14/) | Message Queues + Event-Driven Patterns | 5-7 | 50-70 | Background work + webhooks | message-queue, pub-sub, delivery-semantics, idempotent-consumer |
| [15](/program/arc-2/phase-15/) | Service Observability | 5-7 | 50-70 | OTel instrumentation + dashboards | three-pillars, structured-logging, distributed-tracing, red-method |
| [16](/program/arc-2/phase-16/) | Backend at Scale | 5-7 | 50-70 | Rate limiting + idempotency + retries + circuit breakers | token-bucket-rate-limiting, idempotency-keys, retry-with-jitter, circuit-breaker |
|   | **[Arc 2 Final Exam](/program/arc-2/final-exam/)** | 2-3 | 20-30 | — | — |
| **Total** | | **~41-58 weeks** | **~410-580 hrs** | One real backend service shipped | ~15 backend patterns OUTLINE |

Pace is yours; progress measured by pattern promotion + shipped artifacts.

---

## What ships publicly during Arc 2

| Project | Phase | Role | Launch energy |
|---|---|---|---|
| Your backend service | 9-16 | Real service of your choice (RSS aggregator, URL shortener, paste service, todo API, etc.), exercises every Arc 2 capability | Quiet ship: public on GitHub by Phase 13 (when it's containerized); README + docker-compose; no loud launch (that's for forge in Arc 3) |
| `chronicle` continues | 9 onward | Service runbooks, ADRs, incident notes (private) | Private |
| `sift` + `pulse` | (maintained) | Arc 1 artifacts; minor patches as needed | Quiet maintenance |

Your service is the Arc 2 portfolio artifact. By end-of-Arc 2 a reviewer who opens its README sees: a real product, clean architecture (per Arc 1 Phase 5), proper tests (per Arc 1 Phase 7), CI/CD (per Arc 1 Phase 8), database + caching + auth + APIs + observability + scale patterns. That's a *recognizable backend engineer's portfolio*.

---

## Patterns deepened in Arc 2

By end of Arc 2, these reach **OUTLINE** (DEEP requires 3+ months of operating something dependent on the pattern; some Arc 2 patterns will be OUTLINE this year and reach DEEP in Arc 3+ as basecamp operates them):

**Storage and data**

- `write-ahead-logging`: Phase 9
- `mvcc`: Phase 9
- `indexes-as-pattern`: Phase 9
- `query-planning`: Phase 9
- `oltp-vs-olap`: Phase 9 (touch; deepens Arc 4)

**Caching**

- `cache-aside`: Phase 10
- `write-through-write-behind`: Phase 10
- `cache-stampede`: Phase 10

**Networking + APIs**

- `rest-as-pattern`: Phase 11
- `grpc-as-pattern`: Phase 11
- `api-versioning`: Phase 11

**Security**

- `token-vs-session`: Phase 12
- `oauth-flow`: Phase 12
- `rbac`: Phase 12

**Infrastructure**

- `containerization-as-user`: Phase 13
- `image-layers`: Phase 13
- `multi-stage-builds`: Phase 13

**Distributed systems (first touch)**

- `message-queue`: Phase 14
- `pub-sub`: Phase 14
- `delivery-semantics`: Phase 14
- `idempotent-consumer`: Phase 14

**Observability**

- `three-pillars`: Phase 15
- `structured-logging`: Phase 15
- `distributed-tracing`: Phase 15
- `red-method`: Phase 15

**Resilience**

- `token-bucket-rate-limiting`: Phase 16
- `idempotency-keys`: Phase 16
- `retry-with-jitter`: Phase 16
- `circuit-breaker`: Phase 16
- `bulkhead`: Phase 16

That's ~25 patterns first-touched in Arc 2.

---

## Hardware requirements

Arc 2 runs Postgres, Redis, your service, plus orchestration via docker-compose. **32GB RAM is recommended by Phase 13** (8GB minimum). If your Arc 1 laptop has 16GB, plan a small mini-PC upgrade or accept slow tests.

Full breakdown: [homelab/hardware](https://github.com/abukix/homelab/blob/main/hardware.md).

---

## Arc 2 Final Exam

**Scenario-based final exam.** Three parts:

1. **Build (180 min)**: extend your service with a new feature end-to-end: new DB table, new API endpoint, async webhook, OTel-instrumented, rate-limited, with auth scope check
2. **Debug (180 min)**: three parallel scenarios from Phases 9, 14, 16 catalogs
3. **Articulate (90 min)**: ~1500 words: walk a request through your service from HTTP receive to response, citing every layer (auth, cache, DB, queue, retry, observability)

See the [full Arc 2 Final Exam spec](/program/arc-2/final-exam/) for the scoring rubric.

---

## Reading order

1. This index: you are here
2. [Phase 9: SQL & Relational Databases](/program/arc-2/phase-9/): start here
3. Phases 10 to 16 in order
4. **Patterns**: as a phase references one, read it under [`patterns/`](/patterns/) and promote STUB to OUTLINE
5. [Arc 2 Final Exam](/program/arc-2/final-exam/): open ~2 weeks before end of Phase 16

For people who already build backend services daily: skim Phases 9, 11, 12; spend the time on Phase 15 (Observability) and Phase 16 (Backend at Scale) where the senior delta lives.

---

## Arc 2 graduation

```
You can:
- Design a Postgres schema + write queries that don't degrade at scale
- Apply caching deliberately, with awareness of stampede + invalidation
- Design REST and gRPC APIs that survive versioning
- Add auth (OAuth/JWT/session) with the right trade-offs
- Containerize a service and run it via docker-compose
- Add async event-driven work with the right delivery semantics
- Instrument a service end-to-end with OpenTelemetry
- Apply backend-at-scale patterns (rate limiting, idempotency, retries, breakers)

Exit ramp: Mid-level Backend Engineer
Confidence: real, with one shipped service exercising every Arc 2 capability
```

→ Continue to [Arc 3: Infrastructure & Platform Engineering](/program/arc-3/).

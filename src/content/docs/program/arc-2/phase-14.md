---
title: "Message Queues + Event-Driven Patterns"
description: "Phase 14 of /root Arc 2: queues vs pub/sub, delivery semantics, idempotent consumers, dead-letter handling. Add async background work and webhooks to your Arc 2 service.."
tags: [arc-2, backend, queues, events, async]
arc: 2
phase: 14
---

> Sixth phase of Arc 2. Asynchrony as a design choice.

Most backend services need to do work asynchronously: send an email, process an upload, recompute a leaderboard, notify external systems. Doing this work synchronously (in the request path) creates slow endpoints, fragile systems, and customer-visible failures when downstream services hiccup. This phase teaches asynchrony as a deliberate pattern: *queues*, *pub/sub*, *delivery semantics*, *idempotent consumers*, *dead-letter queues*, applied to your Arc 2 service.

By phase end your service has at least one async-processed background job and at least one outbound webhook. Both are designed with explicit delivery semantics (at-least-once + idempotent consumer is almost always the right answer in 2026). You've recovered a stuck queue. You can defend the decision to use a queue vs pub/sub for a specific use case.

---

## Prerequisites

> - [Phase 13](/program/arc-2/phase-13/) complete; service containerized
> - You accept: **distributed systems primitives leak. You'll meet failure modes that don't exist in synchronous code. The phase exists to make those failures legible.**

---

## Why this phase exists

Queues and events are the entry to distributed-systems thinking. They introduce concepts that synchronous backend work never surfaces: messages lost, messages duplicated, messages out-of-order, workers that crash mid-processing, queues that grow without bound, schemas that evolve. These failure modes are unavoidable in any production system at scale. Arc 3's distributed systems theory (Phase 21) takes the full course; this phase makes you fluent enough to design around the most common ones.

---

## The pattern-first frame

Same eight steps as every phase.

---

## 1. PROBLEM

Some work your service needs to do is *expensive* (long-running), *deferred* (don't need to do it now), or *fan-out* (one event → many consumers). Doing this work in the request path makes endpoints slow and tightly couples your service to downstream availability. Putting the work in a queue and processing it asynchronously is the standard solution.

That's the messaging problem. Queues (one producer, many workers consuming each message once) vs pub/sub (one event, many subscribers, each seeing every event) are the two flavors. The implementations, Redis queues, RabbitMQ, NATS, Kafka, SQS, Pub/Sub, fit different points on a complexity / durability / scale curve.

---

## 2. PRINCIPLES

### 2.1 Queue vs pub/sub

Queue: one message, one consumer. Workers pull; the queue is empty after. Pub/sub: one event, many subscribers; each subscriber sees the event independently.

→ Pattern: `message-queue` and `pub-sub`

**Investigate:**
- When does queue fit (background work)? When does pub/sub fit (event broadcasting, fan-out)?
- What's "fan-out" and what's "fan-in"?
- Why do some systems blur the line (Kafka consumer groups are queue-like over a pub/sub log)?

### 2.2 Delivery semantics

Three flavors: at-most-once (might lose, won't duplicate), at-least-once (might duplicate, won't lose), exactly-once (claimed by some systems, usually means "effectively-once with caveats"). At-least-once is the standard default; you make it effectively-once by making consumers idempotent.

→ Pattern: `delivery-semantics`

**Investigate:**
- Why is true exactly-once delivery impossible without coordination on both ends?
- What does Kafka's "exactly-once semantics" actually guarantee, and at what cost?
- When is at-most-once acceptable? (Hint: when duplicates are worse than losses, like metrics.)

### 2.3 Idempotent consumers

A consumer is idempotent if processing the same message twice produces the same effect as processing it once. Idempotency is the practical defense against at-least-once delivery's duplicates.

→ Pattern: `idempotent-consumer`

**Investigate:**
- Walk a concrete example: "send email on signup." What makes the consumer idempotent?
- What's an idempotency key, and where does it live (database, cache, message header)?
- When is full idempotency impossible? (Hint: non-deterministic side effects like "post tweet.")

### 2.4 Dead-letter queues (DLQs)

Some messages fail repeatedly: bad input, downstream outage, bug in the consumer. Without a DLQ, they retry forever and block the queue. With one, after N retries they move to the DLQ for human inspection.

**Investigate:**
- What goes in a DLQ, and how do you process it back into the main queue?
- What's the right retry count + backoff before DLQ'ing?
- Why is "alerts on DLQ growth" usually the right signal?

### 2.5 Webhooks (outbound events)

Your service emits events to other systems via webhooks (HTTP POSTs to consumer URLs). The same delivery-semantics and idempotency concerns apply, but with HTTP failures on top.

**Investigate:**
- Why do webhooks need retries with backoff?
- Why is a signature header (HMAC) the standard way to authenticate webhooks?
- What's an event-replay endpoint, and when does it earn its weight?

### 2.6 Event-driven architecture (the broader pattern)

Beyond background work, "event-driven architecture" is a system design where services communicate primarily by emitting events rather than calling each other directly. Looser coupling, harder debugging.

**Investigate:**
- Walk a synchronous flow vs event-driven flow for the same business logic. Where does each win?
- What's CQRS (Command Query Responsibility Segregation), and when does it fit?
- Why is event sourcing (storing every event, deriving state) usually overkill?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Queue backend | Redis (`RPUSH`/`BLPOP`); RQ/Celery (Python); Asynq (Go); RabbitMQ; NATS; SQS; Kafka | Redis: simple, no durability guarantees. Specialized: durable, more ops. Cloud: managed. Kafka: scale, complex. |
| Pub/sub backend | Redis pub/sub; NATS; Kafka; cloud Pub/Sub | Redis: simple, lossy. NATS: lightweight, durable optional. Kafka: log, full replay. Cloud: managed. |
| Delivery guarantee | At-least-once + idempotent (default); at-most-once (metrics, telemetry); claimed exactly-once | At-least-once: standard, requires idempotency. At-most-once: simple, lossy. Exactly-once: complex, expensive. |
| Schema | None (JSON blob); JSON Schema; Protobuf; Avro | None: brittle. JSON Schema: validation. Protobuf: typed + compact. Avro: schema registry-friendly. |
| Webhook auth | HMAC signature; mTLS; OAuth; nothing | HMAC: standard. mTLS: stronger, harder setup. OAuth: heavy. None: don't ship to real consumers. |

---

## 4. TOOLS (as of 2026-06)

### Queue libraries
- **Python**: Celery (full-featured, heavy), RQ (Redis-backed, simple), Dramatiq, Arq (async)
- **Go**: Asynq (Redis-backed), River (Postgres-backed), or roll your own with Redis BLPOP

### Brokers
- **Redis 7+**: simple, ubiquitous
- **NATS**: lightweight, JetStream for durability
- **RabbitMQ**: durable, AMQP, more ops
- **Kafka**: Arc 4 territory; mention but don't deploy this phase

### Reading
- "Designing Data-Intensive Applications" Ch. 11 (Stream Processing)
- "Enterprise Integration Patterns" (Hohpe + Woolf), the canonical messaging patterns book
- Kafka docs (background reading; we deploy in Arc 4)
- "Web Hooks Best Practices," various engineering blog posts (Stripe's are particularly good)

---

## 5. MASTERY: Async + webhooks in your Arc 2 service

### 5.1 The deliverable

Your Arc 2 service now has:

- **At least one background job**: a real one for your service (e.g., "send welcome email after signup," "regenerate thumbnails after upload," "recompute counts every 5 minutes")
- **At least one outbound webhook**: your service POSTs to subscriber URLs on relevant events
- **Idempotent consumers** with documented idempotency keys
- **Dead-letter handling**: failed messages after N retries land somewhere inspectable
- **Webhook signature** (HMAC) for authenticating outbound POSTs
- **Metrics**: queue depth, processing rate, DLQ count

### 5.2 Operational depth checklist

```
[ ] Pick a queue backend (Redis + RQ/Asynq is recommended for /root Arc 2 scale)
[ ] Implement at least one background job; verify it runs end-to-end
[ ] Make the consumer idempotent; verify by sending the same message twice
[ ] Implement retry + backoff + DLQ for failed messages
[ ] Implement outbound webhooks with HMAC signature
[ ] Add an HTTP endpoint to verify webhook delivery (the "consumer-acks-by-200" pattern)
[ ] Trigger a downstream failure (kill the webhook consumer); observe + recover via retry
[ ] Add metrics: queue depth, jobs-per-second, retry count, DLQ depth
[ ] Add a runbook for "queue stuck, investigate"
[ ] Read at least one Stripe-engineering or similar post on idempotency in payments (real-world stakes)
```

---

## 6. COMPARE: NATS or RabbitMQ

Pick one:

- **NATS**: install NATS locally; replicate one of your queues onto NATS. Observe the differences.
- **RabbitMQ**: install RabbitMQ; same replication exercise.

400-word reflection on when each fits vs Redis-based simplicity.

---

## 7. OPERATE

- 3-4 runbooks: "Queue stuck," "DLQ growing," "Webhook delivery failing," "Idempotency-key collision"
- 1-2 ADRs (e.g., "Why Redis-based queue vs RabbitMQ for /root Arc 2")
- Weekly log

---

## 8. CONTRIBUTE

- A messaging library: docs, edge cases
- A webhook-tooling project (Hookdeck, Svix; public docs welcome contributions)
- A blog post (when blog is live) on a non-obvious idempotency pattern

---

## What ships from this phase

- **Arc 2 service with async jobs + outbound webhooks**
- **Queue runbooks** in `chronicle`
- **Pattern OUTLINEs**: message-queue, pub-sub, delivery-semantics, idempotent-consumer

---

## Learning loop cadence

```
Week 1     PROBLEM + PRINCIPLES 2.1-2.2 (queue vs pub/sub, delivery)
           Pick queue backend; first background job

Week 2     PRINCIPLES 2.3 (idempotent consumers)
           Idempotency keys; duplicate-message test

Week 3     PRINCIPLES 2.4 (DLQs)
           Retry + backoff + DLQ implementation

Week 4     PRINCIPLES 2.5 (webhooks)
           Outbound webhooks with HMAC

Week 5     PRINCIPLES 2.6 (event-driven architecture)
           Metrics + runbooks
           COMPARE: NATS or RabbitMQ

Week 6-7   OPERATE + CONTRIBUTE
           Exit Test
```

---

## Validation criteria

```
[ ] Arc 2 service has at least one background job + one outbound webhook
[ ] Consumers idempotent; DLQ working; webhook signatures verified
[ ] All 10 operational depth checks
[ ] Compare reflection (400 words)
[ ] 3-4 queue runbooks
[ ] 1-2 ADRs
[ ] Pattern entries deepened STUB → OUTLINE:
    - message-queue
    - pub-sub
    - delivery-semantics
    - idempotent-consumer
[ ] Exit Test passed
```

---

## Exit Test

**Time: 2.5 hours.**

### Part 1: Build (90 min)
Add a new background job to your service (spec provided): on event X, process Y, emit webhook Z. Must be idempotent, have proper retry/DLQ, and signed webhook output.

### Part 2: Diagnose (45 min)
A messaging scenario (provided: e.g., "DLQ grew from 0 to 50,000 messages in the last hour"). Possible causes: downstream API outage; serialization bug; new consumer code panic'ing; quota exhaustion.

### Part 3: Articulate (15 min)
~400 words: *"Walk through the design of one of your idempotent consumers. What's the idempotency key? Where is it stored? What happens on duplicate?"*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Synchronous work in request paths "because it's simple" | Coupling tightens; one downstream slowdown makes your API slow |
| Webhook without HMAC | Anyone who guesses your URL can spoof events |
| Retries without backoff | Retries become DDoS-on-yourself |
| Queue without DLQ | Bad messages retry forever, blocking real work |
| Claiming exactly-once delivery | It's almost always a lie. Be at-least-once + idempotent and own the truth. |

---

## Patterns touched this phase

- `message-queue`: first OUTLINE
- `pub-sub`: first OUTLINE
- `delivery-semantics`: first OUTLINE
- `idempotent-consumer`: first OUTLINE

---

→ Next: [Phase 15: Service Observability](/program/arc-2/phase-15/)

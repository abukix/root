---
title: "Distributed Systems Theory"
description: "Phase 21 of /root Arc 3: DDIA Chapters 5-9 as the spine. CAP/PACELC, replication, consensus, partitioning, eventual consistency, CRDTs, distributed time. Implement Raft in Go. The inflection where single-machine intuition breaks.."
tags: [arc-3, infrastructure, distributed-systems, ddia, consensus]
arc: 3
phase: 21
---

> Fifth phase of Arc 3. Where single-machine intuition breaks.

Most of what felt obvious about systems in Years 1-2 stops being obvious the moment there's more than one machine. The clock is not synchronized. The message may arrive twice or not at all. The "leader" may be deposed by a partition you didn't observe. The database may have *two* correct answers because two replicas haven't reconciled yet.

This phase is the deep confrontation with these realities. DDIA Chapters 5-9 are the spine. By the end you can argue CAP and PACELC trade-offs from first principles, you've implemented Raft well enough to internalize *why* it's hard, and you have the vocabulary the rest of the program assumes from this point onward.

---

## Prerequisites

> - [Phase 20](/program/arc-3/phase-20/) complete; the basecamp substrate alive
> - "Designing Data-Intensive Applications" (Kleppmann) on hand
> - Go fluency from Arc 1 + Postgres + Redis fluency from Arc 2
> - You accept: **most of what you think you know about state, time, and consistency is wrong at scale. The discomfort is the learning.**

---

## Why this phase exists

You can build distributed systems without this phase. People do, every day. Their systems are also the ones that lose data in unusual partition scenarios, have "intermittent bugs" nobody can root-cause, quietly corrupt state under concurrency, and fail their first real outage at 3am with engineers staring at logs they can't interpret.

Distributed systems theory is the vocabulary + mental model that lets you predict where these failures come from *before* they happen. Years 4-5 (data tier, ML platforms) and Arc 3's later phases (multi-cloud) assume this vocabulary.

---

## The pattern-first frame

Same eight steps.

---

## 1. PROBLEM

You have machines. They fail independently. The network drops, reorders, delays. Their clocks drift. You want to give the application above the illusion of a single, consistent, available system, or, when consistency is too expensive, make the trade-offs explicit and bounded.

CAP says you can't have all of Consistency, Availability, Partition-tolerance: pick two when a partition happens. PACELC extends it: even without a partition, you trade Latency vs Consistency. Every distributed system is some position on these axes.

---

## 2. PRINCIPLES

### 2.1 Replication

State copied across machines. The fundamental durability + availability mechanism. Three families: single-leader, multi-leader, leaderless.

→ Pattern: `replication`: **DEEP target this phase**

**Investigate:**
- Exact failure mode of async single-leader when leader dies mid-write?
- Why is multi-leader mostly avoided? When is it right?
- What does quorum (W + R > N) buy you in leaderless?

### 2.2 Consensus

Multiple machines agreeing on a value. Raft and Paxos are the classic algorithms. etcd uses Raft; ZooKeeper uses Zab.

→ Pattern: `consensus`

**Investigate:**
- Walk one Raft term: leader election, log replication, commitment.
- Why does Raft need majority? What does losing it cost?
- How does Raft handle a partition isolating the leader?

### 2.3 Partitioning (sharding)

When data doesn't fit on one machine, split it. The split function matters: range, hash, consistent-hashing, dynamic.

→ Pattern: `partitioning`

**Investigate:**
- What's a hot partition? Why isn't consistent-hashing a complete solution?
- How does Kafka pick a partition? What happens when you change partition count?
- Why is rebalancing expensive?

### 2.4 CAP and PACELC

Brewer's CAP: under partition, choose C or A. PACELC adds: else (no partition), choose L or C.

→ Pattern: `cap-and-pacelc`

**Investigate:**
- Why is CAP often misquoted?
- Place Postgres, DynamoDB, Cassandra, etcd, MongoDB on the CAP grid. Defend each.
- When does PACELC's L-vs-C trade dominate over CAP?

### 2.5 Eventual consistency and CRDTs

When you give up linearizability, replicas can diverge briefly. CRDTs let some data structures merge cleanly.

→ Patterns: `eventual-consistency`, `crdts`

**Investigate:**
- Difference between eventual consistency and strong eventual consistency?
- How does a G-counter CRDT work? Why does merge() commute?
- Where are CRDTs the wrong choice? (Counterexample: bank balance.)

### 2.6 Distributed time

No global clock. Lamport orders events causally. Vector clocks track concurrency. Hybrid logical clocks combine wall + logical.

→ Pattern: `distributed-time`

**Investigate:**
- Why isn't wall-clock time safe for ordering across machines?
- Walk Lamport-ordered conversation between three processes.
- What does Spanner's TrueTime do?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Consistency | Linearizable; Sequential; Causal; Eventual | Stronger = more coordination = less availability + more latency |
| Replication | Sync; Async; Quorum | Sync: safety. Async: speed. Quorum: tunable |
| Delivery | At-most-once; At-least-once + idempotency; Exactly-once | Standard is at-least-once + idempotency |
| Partition | Range; Hash; Consistent-hashing; Dynamic | Range: hot spots. Hash: no ranges. Consistent-hash: rebalance-friendly |

---

## 4. TOOLS (as of 2026-06)

- **DDIA** Chapters 5-9 (Kleppmann): this phase's spine
- **TLA+ Toolbox** + Learn TLA+ (Wayne)
- Raft visualization at https://raft.github.io
- `etcd-io/raft`: production Go Raft; read its source

### Reading
- DDIA Ch. 5-9 (mandatory)
- "Database Internals" (Petrov) Ch. 8-13
- "Distributed Systems for Fun and Profit" (Takada, free, gentler intro)

---

## 5. MASTERY: Implement Raft

### 5.1 The Raft implementation

In Go, implement Raft well enough that:
- Three nodes elect a leader
- Leader replicates `Set(key, value)` log
- Followers acknowledge; leader commits after majority
- Partitions force re-elections
- New leader correctly resumes the log

Don't use existing Raft libraries. Feel where it's hard. Compare your impl against `etcd-io/raft` afterward.

### 5.2 DDIA reading + reflection

For each chapter 5-9, write a 600-800 word reflection in `chronicle/distributed-systems/`.

### 5.3 Operational depth checklist

```
[ ] Raft: three nodes, election, replication, partition recovery
[ ] Postgres streaming replication on three nodes; trigger leader failure; recover
[ ] Three-broker Kafka cluster (Arc 4 territory; taste this phase); force partition reassignment under broker failure
[ ] CAP-positioning exercise: 10 systems on the CAP grid with written justification
[ ] Chaos: 200ms latency + 5% drop on basecamp's network; observe failure modes
[ ] Lamport clock in Go (~100 lines); demonstrate causal ordering
[ ] Idempotency-key pattern in a small HTTP API; verify safe retries
```

---

## 6. COMPARE: TLA+

After Raft in Go, write a small TLA+ spec of leader election. Reflect on what TLA+ caught vs Go.

400-word reflection.

---

## 7. OPERATE

- 3-5 runbooks: replication-lag emergency, partition recovery, idempotency-key collision
- 2-3 ADRs (single-leader Postgres, exactly-once-myths)
- Weekly log

---

## 8. CONTRIBUTE

- `etcd-io/raft`: docs
- DDIA errata (Kleppmann's open list)
- TLA+ examples

---

## What ships from this phase

- **Raft-in-Go lab public on GitHub** as a learning artifact
- **DDIA reflections** in `chronicle/distributed-systems/` (5 essays, 600-800 words each)
- **ADRs for basecamp's distributed-systems posture**

---

## Validation criteria

```
[ ] Raft-in-Go working (3 nodes, election, replication, partition recovery)
[ ] DDIA Ch 5-9 reflections written
[ ] All 7 operational checks
[ ] TLA+ compare (400 words)
[ ] 3-5 runbooks
[ ] 2-3 ADRs
[ ] Pattern entries:
    - replication → DEEP target
    - consensus → OUTLINE
    - partitioning → OUTLINE
    - cap-and-pacelc → OUTLINE
    - eventual-consistency → OUTLINE
    - crdts → OUTLINE
    - distributed-time → OUTLINE
    - idempotency revisited at scale → reinforced
[ ] Exit Test passed
```

---

## Exit Test

**Time: 3.5 hours.**

### Part 1: Diagnose (90 min)
Scenario: Postgres replica 90 seconds behind primary, only on weekdays at 14:00 UTC. Diagnose end-to-end.

### Part 2: Articulate (120 min)
~1500 words: *"Claim Postgres is 'CP' in CAP. Defend or attack. Then explain what changes with a second async replica in another region. Then explain what PACELC says. Cite mechanisms (WAL streaming, sync_commit, hot_standby_feedback) at every step."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Reading DDIA passively | Reflections are the work |
| Using existing Raft library for MASTERY | You're paying for discomfort. Skip and the pattern doesn't land. |
| Claiming exactly-once delivery anywhere | Usually a marketing lie. Investigate. |
| Skipping TLA+ "because I have working impl" | TLA+ proves you understand the spec under impl. |
| Reaching for multi-leader replication | If you think you need it, you probably don't. |

---

## Patterns touched this phase

- `replication`: **DEEP target**
- `consensus`: OUTLINE
- `partitioning`: OUTLINE
- `cap-and-pacelc`: OUTLINE
- `eventual-consistency`: OUTLINE
- `crdts`: OUTLINE
- `distributed-time`: OUTLINE
- `idempotency` revisited at scale

---

→ Next: [Phase 22: Infrastructure as Code — ship forge](/program/arc-3/phase-22/)

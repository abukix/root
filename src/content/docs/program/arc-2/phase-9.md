---
title: "SQL & Relational Databases"
description: "Phase 9 of /root Arc 2: Postgres at depth. SQL semantics, indexes, query planning, transactions, MVCC, isolation levels, connection pooling. Add Postgres backing to your Arc 2 service.."
tags: [arc-2, backend, postgres, sql, databases]
arc: 2
phase: 9
---

> First phase of Arc 2. Durable state lands here.

Every backend service persists state somewhere. The default, and the right default, is a relational database, almost always Postgres. This phase makes Postgres legible: not as a black box but as a system with mechanisms you can reason about. WAL, MVCC, indexes, query plans, isolation levels, connection pooling: the words become tools you reach for, not jargon you nod through.

By phase end your Arc 2 service has a Postgres-backed data model. You've designed the schema deliberately. You've added indexes after measuring (not before). You've debugged a slow query with `EXPLAIN ANALYZE`. You've reasoned about isolation level for a real transaction in your service. You can defend every schema choice against a senior reviewer.

---

## Prerequisites

> - All of Arc 1 complete; programming fluency in Python or Go
> - Postgres 16 installed locally (Docker run is fine)
> - `psql` working; you can connect to a local DB and run queries
> - A backend service idea picked for Arc 2 (RSS aggregator, URL shortener, paste service, todo API: your choice)
> - You accept: **you are not learning Postgres. You are learning what an OLTP database is, with Postgres as the canonical implementation.**

---

## Why this phase exists

Most engineers learn SQL as commands ("here's how to write a JOIN") and Postgres as features ("Postgres has JSON columns"). Senior engineers reason about databases from *mechanism*: why this query is slow (the planner picked a sequential scan), why this transaction is blocking another (it holds a row lock that the second wants), why memory is up (the connection pool is leaking).

This phase installs the mechanism layer. By phase end you can sit at any Postgres instance, run `pg_stat_activity`, read the output, and propose hypotheses. That competence transfers to MySQL, to Aurora, to CockroachDB, to any future relational engine, because the patterns survive the tool.

---

## The pattern-first frame

Same eight steps. See [The Master Plan](/program/overview/#the-pattern-first-scaffold).

---

## 1. PROBLEM

You have application state: users, items, transactions, sessions, whatever your service tracks. It must survive a crash (durability), be consistent across concurrent access (isolation), scale beyond a single client's needs (concurrency), and be queryable in ways your application can't predict in advance (flexibility).

That's the OLTP database problem. Postgres is the canonical OSS implementation. MySQL is a strong alternative with different trade-offs. SQLite is the embedded version. Oracle and SQL Server are the commercial ones. Aurora and CockroachDB are distributed reimaginings. The *pattern*, ACID-compliant relational storage with SQL as the query language, survives; the *tools* age.

---

## 2. PRINCIPLES

### 2.1 Write-ahead logging (WAL)

Postgres (and every serious OLTP database) writes the change to a log *before* updating the data. On crash recovery, the log is replayed. This is the durability mechanism. WAL also enables streaming replication, point-in-time recovery, and logical decoding.

→ Pattern: `write-ahead-logging`

**Investigate:**
- Walk the lifecycle of a single `UPDATE` from `BEGIN` to durable commit. Where is the WAL written? When does the data page get updated?
- What is `fsync`, and what does Postgres' `synchronous_commit` setting trade off?
- How does WAL enable point-in-time recovery? What's a base backup?

### 2.2 Multi-Version Concurrency Control (MVCC)

Postgres doesn't lock rows for readers. Instead, it stores multiple versions of each row, each tagged with a transaction ID. Readers see the version that was visible at their transaction's start. This is what gives Postgres "readers don't block writers, writers don't block readers."

→ Pattern: `mvcc`

**Investigate:**
- What's `xmin` and `xmax`? Inspect them with `SELECT xmin, xmax, * FROM users LIMIT 5`.
- Why does Postgres need `VACUUM`? What does dead tuple bloat look like?
- How does MVCC handle `SELECT FOR UPDATE` (explicit row locking)?

### 2.3 Indexes as a pattern

An index is a separate data structure that lets the engine find rows by key in `O(log n)` instead of `O(n)`. B-tree is the default; hash, GIN, GiST, BRIN are alternatives. Indexes cost space and write performance (every insert updates every index).

→ Pattern: `indexes-as-pattern`

**Investigate:**
- When does a B-tree index help vs hurt? What's the rule of thumb on selectivity?
- What's a covering index, and when does it earn its weight?
- Why is GIN the right index for full-text search vs B-tree?

### 2.4 Query planning and EXPLAIN ANALYZE

Postgres has a cost-based planner that picks an execution strategy from many candidates. `EXPLAIN ANALYZE` shows you what the planner chose and what actually happened. Reading EXPLAIN output fluently is the single highest-leverage skill in working with Postgres.

→ Pattern: `query-planning`

**Investigate:**
- Walk an `EXPLAIN ANALYZE` output for a 3-table JOIN. What's a `Hash Join` vs `Merge Join` vs `Nested Loop`? Why did the planner pick this one?
- What does `Rows Removed by Filter` mean, and what does a high number suggest?
- When are statistics stale, and what does `ANALYZE` do?

### 2.5 Transactions and isolation levels

Postgres supports `READ UNCOMMITTED` (treated as `READ COMMITTED`), `READ COMMITTED` (default), `REPEATABLE READ`, and `SERIALIZABLE`. Each gives stronger isolation guarantees at the cost of more abort-and-retry under contention.

**Investigate:**
- What's a dirty read, non-repeatable read, phantom read, write skew? Which level prevents each?
- Why is the default `READ COMMITTED` and not `SERIALIZABLE`?
- When do you need `SELECT ... FOR UPDATE`?

### 2.6 Connection pooling

Postgres connections are expensive (each is a forked process). Applications shouldn't open a new connection per request. Pgbouncer or pgpool or in-application pools (`asyncpg`, `pgx`) reuse connections across requests.

**Investigate:**
- What's the difference between session pooling, transaction pooling, statement pooling in PgBouncer?
- When does a pool exhaustion bug look like? (Hint: requests pile up; pool is full; clients wait.)
- How many DB connections is the right ceiling for your service?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| OLTP database | Postgres; MySQL; SQLite | Postgres: rich, ubiquitous in modern stacks. MySQL: simpler, replication-friendly, weaker constraints. SQLite: embedded, no client/server. |
| Schema design | Normalized (3NF); denormalized; JSONB-heavy | Normalized: clean, requires JOINs. Denormalized: faster reads, redundancy. JSONB: flexible, no schema enforcement. |
| Index strategy | Index everything; index nothing; index after measurement | Everything: write cost. Nothing: slow reads. After measurement: right answer. |
| Connection pooling | In-application; PgBouncer (transaction mode); PgBouncer (session mode) | In-app: simpler. Transaction mode: efficient. Session mode: required for some Postgres features. |
| ORM vs query builder vs raw SQL | ORM (SQLAlchemy, Django ORM, GORM); query builder (sqlc, jOOQ); raw SQL strings | ORM: rapid dev, opaque queries. Builder: typed, transparent. Raw: simplest, manual safety. |

---

## 4. TOOLS (as of 2026-06)

### Postgres
- **Postgres 16+**: the engine
- **`psql`**: the CLI
- **`pgcli`**: friendlier interactive CLI
- **`pgbouncer`**: connection pooler
- **`pg_stat_statements`**: query statistics extension
- **`auto_explain`**: automatic EXPLAIN logging

### Tooling (language-specific)
- **Python**: `psycopg[binary]` for sync, `asyncpg` for async; SQLAlchemy 2.x as ORM if needed
- **Go**: `pgx` (recommended), `sqlc` (codegen from SQL), or `gorm` if you must
- **Schema migrations**: `alembic` (Python), `golang-migrate`, `goose`

### Reading
- "Designing Data-Intensive Applications" (Kleppmann) Chapters 3 and 7
- "The Internals of PostgreSQL" (Suzuki, free online): the deep dive
- "Use The Index, Luke" (Markus Winand, free online): index theory
- Postgres docs Chapters 11 (indexes), 13 (concurrency control), 14 (performance tips)

---

## 5. MASTERY: Postgres-backed service

### 5.1 The deliverable

Your Arc 2 service now has:

- A **deliberate schema** documented in `schema.sql` or as migrations; normalized to 3NF unless you have a documented reason to denormalize
- **Indexes** added based on actual query patterns; each index justified
- A **connection pool** configured (in-app pool, pgbouncer optional)
- At least one **complex query** (3+ table JOIN, aggregation, window function) with documented EXPLAIN ANALYZE output
- **Migrations** running via your migration tool of choice

### 5.2 Operational depth checklist

```
[ ] Connect via psql; explore schema with \dt, \d <table>, \di
[ ] Walk `EXPLAIN ANALYZE` for at least 5 of your service's queries
[ ] Identify and add 1-2 indexes that meaningfully improve query performance; benchmark before/after
[ ] Trigger a deadlock deliberately (two transactions, opposite lock order); recover
[ ] Inspect `pg_stat_activity` during a slow query; identify what's running
[ ] Inspect `pg_stat_statements` for top-5 queries by total time
[ ] Run `VACUUM ANALYZE`; understand what it does
[ ] Set up a streaming replica locally (Docker); verify it catches up
[ ] Trigger a connection-pool exhaustion; observe the symptom; fix the leak
[ ] Use transactions with `SAVEPOINT` in your service for a multi-step operation
```

---

## 6. COMPARE: MySQL or SQLite

Pick one as the compare:

- **MySQL 8.x**: different storage engine (InnoDB), different replication model (statement vs row-based binlog), MVCC implementation differs subtly
- **SQLite 3**: no client/server; the whole database is a file; useful for embedded scenarios

400-word reflection on what's the same vs different vs what each makes easier or harder.

---

## 7. OPERATE

- 3-4 runbooks: "Slow query: diagnose with EXPLAIN," "Connection pool exhausted," "Postgres replica lag growing," "Deadlock recovery"
- 1-2 ADRs (e.g., "Why Postgres over MySQL for /root service," "Why in-app pooling vs pgbouncer")
- Weekly log

---

## 8. CONTRIBUTE

- Postgres docs: small clarifications or example improvements
- `pgcli`: small bug or feature
- `sqlc` (Go) or `SQLAlchemy` (Python): docs or examples

---

## What ships from this phase

- **Your Arc 2 service** now Postgres-backed with deliberate schema + migrations + indexes
- **Postgres runbooks** in `chronicle`
- **Pattern OUTLINEs**: WAL, MVCC, indexes, query planning

---

## Learning loop cadence

```
Week 1     PROBLEM + PRINCIPLES 2.1-2.2 (WAL, MVCC)
           Local Postgres up; schema design starts

Week 2     PRINCIPLES 2.3 (indexes)
           Schema migrations + first version of your service's tables

Week 3     PRINCIPLES 2.4 (query planning)
           EXPLAIN ANALYZE exercises on your queries

Week 4     PRINCIPLES 2.5 (transactions, isolation)
           Connect your service to Postgres; first real queries

Week 5     PRINCIPLES 2.6 (connection pooling)
           Pool configured; deadlock + pool exhaustion exercises

Week 6     COMPARE: MySQL or SQLite
           chronicle runbooks

Week 7-8   OPERATE + CONTRIBUTE
           Exit Test
```

---

## Validation criteria

```
[ ] Arc 2 service has Postgres-backed schema + migrations + indexes
[ ] All 10 operational depth checks passed
[ ] Compare reflection written (400 words)
[ ] 3-4 Postgres runbooks
[ ] 1-2 ADRs
[ ] Pattern entries deepened STUB → OUTLINE:
    - write-ahead-logging
    - mvcc
    - indexes-as-pattern
    - query-planning
[ ] Exit Test passed
```

---

## Exit Test

**Time: 3 hours.**

### Part 1: Design (90 min)
Given a spec (provided: a small new feature for your service), design the schema migration, write the queries, add the indexes, document the trade-offs. Apply via your migration tool. Verify with realistic data.

### Part 2: Diagnose (60 min)
A slow query scenario (provided). Use EXPLAIN ANALYZE, `pg_stat_statements`, `pg_stat_activity`. Identify root cause + fix.

### Part 3: Articulate (30 min)
~600 words: *"Walk an UPDATE statement from your service from `BEGIN` to `COMMIT`. Cover WAL, MVCC tuple updates, index updates, fsync, and replication if you've set up a replica."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Adding indexes preemptively without measuring | Indexes have a write cost; the wrong indexes are net-negative |
| Using ORM without ever reading its generated SQL | The ORM is hiding N+1 queries you don't see |
| Mixing schema changes with data migrations in one transaction | Schema changes lock; long data migrations block writers for the duration |
| Using `SELECT *` in production code | Schema changes break consumers; only fetch what you need |
| Ignoring the `EXPLAIN` output "because the query works" | Working ≠ scalable. The plan tells you when "works" stops |

---

## Patterns touched this phase

- `write-ahead-logging`: first OUTLINE
- `mvcc`: first OUTLINE
- `indexes-as-pattern`: first OUTLINE
- `query-planning`: first OUTLINE
- `oltp-vs-olap`: first touch

---

→ Next: [Phase 10: Redis & Caching Patterns](/program/arc-2/phase-10/)

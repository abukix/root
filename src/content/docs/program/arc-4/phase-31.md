---
title: "Data Lakehouse (Iceberg)"
description: "Phase 31 of /root Arc 4: Iceberg on MinIO with Nessie catalog. Lakehouse architecture as snapshot-plus-delta on object storage. ACID on S3. Schema evolution + time travel. All deployed K8s-native via Flux HelmReleases.."
tags: [arc-4, data, lakehouse, iceberg]
arc: 4
phase: 31
---

> First phase of Arc 4. The data tier arrives.

[Arc 2 Phase 9](/program/arc-2/phase-9/) made OLTP state legible via Postgres. This phase lifts the same problem up two floors: *analytical* state at the table-and-stream level. Iceberg tables sitting on object storage (MinIO). A Nessie catalog tracking snapshots, branches, time-travel. Trino as the interactive query engine. By phase end basecamp has a working lakehouse, operator-managed via Flux HelmReleases, configured via Kubernetes CRDs, observed via the OTel stack from [Phase 28](/program/arc-3/phase-28/).

The pattern is **snapshot-plus-delta on object storage**. The implementations (Iceberg, Delta Lake, Hudi) age; the pattern survives. The K8s-native operationalization (MinIO Operator + Helm-deployed Iceberg + Nessie reconciled by Flux) is how big tech actually runs this at scale.

---

## Prerequisites

> - All of Arc 3 complete; basecamp modules `forge`, `ascent`, `beacon` operational K8s-native
> - 32GB+ RAM; second NVMe for Spark/Iceberg intermediate
> - You accept: **you are not learning Iceberg or Delta. You are learning the lakehouse pattern, with Iceberg as the canonical implementation.**

---

## Why this phase exists

Most engineers hit the data tier as a wall. Their tutorial-shaped datasets fit in CSV. Real ML systems read from tables that evolve, streams that backfill, joins that span sources, historical snapshots that may need to be reproduced months later. Without a working data tier, every Arc 5 ML deploy turns into a one-off scripted ETL nightmare.

The lakehouse pattern solves this: tables on object storage with proper transaction semantics, immutable snapshots, time-travel as a first-class concern, schema evolution without rewriting petabytes. Netflix originated Iceberg at scale; Databricks Delta Lake is the parallel format from the Databricks lineage; Apache Hudi (originating at Uber) is the streaming-native sibling. All converge on the same pattern.

---

## The pattern-first frame

Same eight steps.

---

## 1. PROBLEM

You have data: events arriving at high frequency, business records, derived data (features, embeddings, scores). You want to:

- Store the data durably and cheaply (object storage)
- Query it analytically at scale
- Evolve the schema as data evolves (without rewriting)
- Time-travel through the data (snapshot at a past point)
- Mix batch + streaming pipelines in one architecture

That's the lakehouse problem. Iceberg + MinIO + Nessie is one K8s-native implementation. Delta Lake (Databricks lineage) + Hudi (Uber lineage) are the parallel formats.

---

## 2. PRINCIPLES

### 2.1 Lakehouse architecture

Tables on object storage with metadata providing transactional semantics. Warehouse-quality reads + lake-quality storage costs.

→ Pattern: `lakehouse`: OUTLINE this phase (deepens through operation)

**Investigate:**
- Why is "data lake alone" insufficient (no schema enforcement, no transactions, hot mess after 18 months)?
- Why is "data warehouse alone" insufficient (lock-in, cost at scale)?
- What does Iceberg's manifest list do, and why is it the key to time-travel?

### 2.2 Snapshot-plus-delta

A table is a sequence of immutable manifest files. Transactions are modeled as snapshot pointers: new write → new snapshot → old snapshots still exist. Time-travel is "read the older snapshot pointer."

→ Pattern: `snapshot-plus-delta`

**Investigate:**
- Walk Iceberg's metadata layout: catalog → metadata.json → manifest list → manifest → data files. What lives at each level?
- How does atomic commit work given object storage's lack of atomic rename?
- What's compaction, and why does it matter?

### 2.3 Schema evolution

Add columns, drop columns, rename, widen types, all without rewriting the data. Only metadata changes.

→ Pattern: `schema-evolution`

**Investigate:**
- Which schema changes are zero-cost in Iceberg? Which are expensive?
- How does Iceberg's hidden partitioning differ from Hive-style explicit partitions?
- What goes wrong when readers and writers disagree on schema?

### 2.4 Partitioning at the data layer

Phase 21 covered partitioning at the distributed-systems level. The data tier has its own: how Iceberg tables are partitioned (date, country, hash) for query performance.

**Investigate:**
- Why does partitioning matter for analytical queries (partition pruning)?
- What's "hidden partitioning" in Iceberg, and why is it better than Hive-style?
- When does over-partitioning hurt (file proliferation, metadata overhead)?

### 2.5 Object storage as substrate

Lakehouse architectures stand on object storage (S3, MinIO, GCS). Object storage's properties, eventually-consistent listings (historically), list-cost economics, no atomic rename, shape every layer above.

**Investigate:**
- Why does eventually-consistent listing matter for Iceberg's manifest reads?
- What changed when AWS S3 went strongly-consistent in 2020?
- Why is MinIO a credible homelab S3 surrogate?

### 2.6 The K8s-native lakehouse deployment

The whole lakehouse stack is K8s-native: MinIO via Helm (or MinIO Operator for multi-tenant); Nessie via Helm; Trino via Helm. All reconciled by Flux. Spark connects to Iceberg via the Spark-Iceberg integration. Storage class via Longhorn.

**Investigate:**
- Why is MinIO Operator preferred for multi-tenant MinIO?
- How does Trino's K8s Helm chart compose with Flux?
- What's the trade-off between Nessie (Iceberg REST catalog) and Polaris (Snowflake's open catalog)?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Table format | **Iceberg**; Delta Lake; Hudi; Hive | Iceberg: vendor-neutral, K8s-native ecosystem. Delta: Databricks. Hudi: streaming-native, upsert-focused. Hive: legacy. |
| Catalog | **Nessie**; Polaris (Snowflake OSS); REST (generic); Hive Metastore | Nessie: Git-like, time-travel-native. Polaris: emerging. REST: generic. HMS: legacy. |
| Object storage | **MinIO Operator** (homelab); S3 (cloud); GCS (cloud) | MinIO: free, K8s-native. S3: ubiquitous. GCS: GCP-native. |
| Query engine | Trino; DuckDB; Spark SQL | Trino: interactive, fast. DuckDB: single-node, very fast. Spark SQL: full ETL. |

---

## 4. TOOLS (as of 2026-06)

### K8s-native stack
- **MinIO Operator** (or simpler Helm deploy)
- **Apache Iceberg** + **Nessie** as catalog
- **Apache Spark 3.5+**: batch (Phase 33 deploys via Spark Operator)
- **Trino**: interactive query (Helm-deployed)
- **Flux HelmReleases**: for all the above

### Reading
- "Designing Cloud Data Platforms" (Pathirana et al.)
- Apache Iceberg docs: *Concepts* and *Maintenance*
- The original Iceberg paper (Netflix)
- "Iceberg in Action" (informal but informative; various engineering blogs)

---

## 5. MASTERY: Lakehouse alive on basecamp

```
[ ] MinIO deployed via Helm (or MinIO Operator); basecamp services use it via S3-compatible APIs
[ ] Nessie deployed via Helm; verify catalog API
[ ] Iceberg table created via Spark (local for now); query from Trino
[ ] Observe metadata layout in MinIO (manifest list, manifests, data files)
[ ] Schema evolution: add a column to a live Iceberg table; readers + writers continue working
[ ] Time-travel: query yesterday's snapshot; reproduce a past result
[ ] Partition strategy: design partitions for one realistic table; observe partition pruning in EXPLAIN
[ ] Run compaction; observe metadata cleanup
[ ] Set up branching in Nessie (Git-like branches for data); merge a branch
[ ] Deploy Trino via Flux HelmRelease; verify queries from a notebook or DBeaver
```

---

## 6. COMPARE: Delta Lake or DuckDB

Pick one:

- **Delta Lake**: install via Spark + Delta integration; create the same table; compare features
- **DuckDB on Iceberg**: DuckDB reads Iceberg natively. Query the same table from single-node DuckDB. Reflect on when single-node beats distributed.

400-word reflection.

---

## 7. OPERATE

- 4-5 runbooks: Iceberg compaction needed, schema-evolution broke reader, MinIO out-of-space, Trino query OOM, Nessie catalog corrupted
- 2-3 ADRs (Iceberg over Delta; Nessie over generic REST catalog; Trino over Spark SQL for interactive)
- Weekly log

---

## 8. CONTRIBUTE

- Apache Iceberg (CNCF): docs, edge cases
- Nessie: Iceberg catalog improvements
- Trino: query engine
- The `awesome-iceberg` corpus

---

## What ships from this phase

- **`crag` v0 alive**: MinIO + Iceberg + Nessie + Trino, all K8s-native via Flux
- **Iceberg utility helpers** in `crag` umbrella
- **Lakehouse runbooks**

---

## Validation criteria

```
[ ] MinIO + Iceberg + Nessie + Trino operational on basecamp
[ ] Schema evolution + time-travel exercised
[ ] All 10 operational depth checks
[ ] Compare reflection (400 words)
[ ] 4-5 lakehouse runbooks
[ ] 2-3 ADRs
[ ] Pattern entries:
    - lakehouse → OUTLINE+
    - snapshot-plus-delta → OUTLINE
    - schema-evolution → OUTLINE
    - partitioning at data layer reinforced
[ ] Exit Test passed
```

---

## Exit Test

**Time: 3 hours.**

### Part 1: Build (90 min)
Create a new Iceberg table from scratch via Flux + Helm-deployed Spark. Partition it deliberately. Insert sample data. Query via Trino. Then perform a schema evolution (add column). Verify readers + writers survive.

### Part 2: Diagnose (60 min)
A lakehouse scenario (e.g., "Trino queries returning empty results despite data being in MinIO"). Possible causes: catalog mismatch, manifest reference stale, partition spec wrong.

### Part 3: Articulate (30 min)
~600 words: *"Walk an INSERT into an Iceberg table from `INSERT INTO ... VALUES` in Spark to the bytes landing in MinIO. Cover metadata.json, manifest list, manifests, data files, atomic commit semantics."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Treating "lake" and "lakehouse" as synonyms | Lake without table format becomes a swamp at month 18 |
| Iceberg without compaction strategy | Small-files problem kills query performance |
| Schema evolution by rewriting | Iceberg supports zero-cost evolution for many changes — use it |
| Hive-style explicit partition columns | Iceberg's hidden partitioning is better; use it |
| Storing data without time-travel awareness | Reproducibility becomes hard; ML training fails when "the data changed" |

---

## Patterns touched this phase

- `lakehouse`: OUTLINE
- `snapshot-plus-delta`: OUTLINE
- `schema-evolution`: OUTLINE
- `partitioning` reinforced at data layer

---

→ Next: [Phase 32: Stream Processing (Strimzi + Flink)](/program/arc-4/phase-32/)

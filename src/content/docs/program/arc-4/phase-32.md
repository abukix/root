---
title: "Stream Processing (Strimzi + Flink)"
description: "Phase 32 of /root Arc 4: Kafka via Strimzi operator, stream processing with Kafka Streams + Flink Kubernetes Operator, CDC via Debezium. Exactly-once-ish semantics, watermarks + event-time windowing, idempotent consumers. All K8s-native: Kafka/KafkaTopic/KafkaConnect/FlinkDeployment as CRDs.."
tags: [arc-4, data, streaming, kafka, strimzi, flink]
arc: 4
phase: 32
---

> Second phase of Arc 4. Streaming as a deliberate engineering choice.

Arc 2 Phase 14 introduced queues + pub/sub. This phase goes to depth: a real Kafka cluster managed by **Strimzi** (the K8s-native operator), real stream processing via **Kafka Streams** (in-app library) and **Flink** (separate cluster, also operator-managed). CDC via **Debezium**. By phase end basecamp ingests events at high rate from Postgres, lands them in Iceberg via streaming Flink jobs, and runs Kafka Streams topology for low-latency in-pipeline analytics.

Every Kafka resource is a CRD: `Kafka` cluster, `KafkaTopic`, `KafkaUser`, `KafkaConnect`, `KafkaConnector`. Every Flink job is a `FlinkDeployment` CRD. Same K8s-native pattern as the rest of basecamp.

---

## Prerequisites

> - [Phase 31](/program/arc-4/phase-31/) complete; lakehouse alive
> - Sufficient RAM for Kafka + Flink (32GB minimum; 64GB if you can)
> - You accept: **streaming is harder than batch. The patterns (exactly-once-ish, watermarks, late-arriving events) don't have shortcuts.**

---

## Why this phase exists

Most data needs are batch. But some (fresh recommendations, real-time fraud detection, agent inputs, observability) need streaming. The patterns differ from batch in ways that surprise: event time vs processing time, watermarks for handling late arrivals, exactly-once-ish via idempotent producers + transactions, stateful operators that must checkpoint.

This phase installs the patterns. And it teaches the K8s-native deployment: Strimzi reduces Kafka ops from days-of-work to applying a `Kafka` CRD; Flink Operator handles Flink job lifecycle the same way.

---

## The pattern-first frame

Same eight steps.

---

## 1. PROBLEM

You have events arriving continuously: Postgres row changes, user actions, sensor readings, observability data. You want to ingest reliably, process in real-time, land in long-term storage (Iceberg), and serve to consumers (other services, ML models, alerts).

Streaming infrastructure (Kafka or alternatives like Pulsar, Redpanda) is the durable substrate. Stream processing engines (Kafka Streams, Flink, Spark Structured Streaming) are the compute layer above.

---

## 2. PRINCIPLES

### 2.1 Streaming vs batch: when each fits

→ Pattern: `streaming-vs-batch`

**Investigate:**
- When is streaming worth the operational cost?
- "Kappa architecture": when does it deliver vs when is it cargo-culted?
- Why do most teams that "want streaming" actually want micro-batch?

### 2.2 Exactly-once-ish via idempotent producers + transactions

True exactly-once across multiple systems is impossible without coordination on both ends. Kafka provides *effectively-once* via idempotent producers + Kafka transactions + careful consumer offset management.

→ Pattern: `delivery-semantics` reinforced from Arc 2 + Arc 3

**Investigate:**
- Walk Kafka's transactional producer + consumer pattern.
- What goes wrong if a consumer commits offsets before processing completes?
- Why does Kafka Streams default to at-least-once and require explicit transactional mode?

### 2.3 Event time + watermarks

Stream processing must distinguish *event time* (when something happened) from *processing time* (when we see it). Watermarks define "we don't expect events older than this to arrive."

→ Pattern: `event-time-windowing`

**Investigate:**
- Walk a Flink window aggregation with watermark of 10 seconds. What happens when events arrive 5s late? 15s late?
- What's an "allowed lateness" + side output?
- Why is watermark generation a real engineering problem?

### 2.4 Change Data Capture (CDC)

Debezium reads Postgres' WAL and emits row-change events to Kafka. CDC bridges OLTP (Phase 9 Postgres) to OLAP (Phase 31 Iceberg) continuously.

→ Pattern: `change-data-capture`

**Investigate:**
- How does Debezium read Postgres logical replication slot without breaking it?
- What's query-based CDC vs log-based CDC?
- When does CDC break (large transactions, schema changes mid-flight)?

### 2.5 Strimzi as the K8s-native Kafka

Strimzi provides operators for Kafka, Connect, MirrorMaker, Topics, Users. Every Kafka resource is a CRD. Configuration that previously took hours (cluster setup, security, monitoring) becomes `kubectl apply`.

→ Pattern: `operator-pattern` reinforced from Arc 3

**Investigate:**
- Walk a Strimzi `Kafka` CRD: declare → controller creates StatefulSets + Services + Secrets + ZooKeeper (or KRaft).
- What does Strimzi's `KafkaTopic` CRD give you over manually-managed topics?
- How does Strimzi integrate with Prometheus + Grafana (built-in observability)?

### 2.6 Flink Kubernetes Operator + FlinkDeployment

Flink jobs run as Kubernetes operators. The `FlinkDeployment` CRD describes a Flink cluster + jobs; the operator manages JobManager + TaskManagers + savepoints + failover.

**Investigate:**
- Walk a `FlinkDeployment` CRD: declare → operator launches JM + TMs + manages savepoints.
- What's a Flink savepoint vs checkpoint, and when does each matter?
- How does the Flink operator handle stateful jobs across restarts?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Kafka deployment | **Strimzi**; raw StatefulSet; managed (MSK, Confluent Cloud) | Strimzi: K8s-native, CRD-driven (recommended). Raw: too much manual ops. Managed: convenience, $$. |
| Stream processing | **Flink (K8s Operator)**; Kafka Streams (library); Spark Structured Streaming | Flink: full streaming, stateful. Kafka Streams: simple, library-only. Spark Streaming: micro-batch. |
| Kafka mode | KRaft (modern, no ZooKeeper); ZooKeeper-based (legacy) | KRaft: standard going forward. ZK: legacy. |
| CDC | **Debezium**; AWS DMS; manual triggers | Debezium: K8s-native via Strimzi KafkaConnect (recommended). Others: vendor-specific or fragile. |

---

## 4. TOOLS (as of 2026-06)

### K8s-native stack
- **Strimzi**: Kafka operator; `Kafka`, `KafkaTopic`, `KafkaUser`, `KafkaConnect`, `KafkaConnector` CRDs
- **Flink Kubernetes Operator**: `FlinkDeployment`, `FlinkSessionJob` CRDs
- **Debezium**: runs as a KafkaConnect connector via Strimzi
- **Confluent Schema Registry** (or Apicurio for K8s-native alternative), Helm-deployed

### Reading
- "Kafka: The Definitive Guide" (Shapira et al., 2nd ed.)
- "Streaming Systems" (Akidau, Chernyak, Lax): streaming theory book
- "Stream Processing with Apache Flink" (Hueske, Kalavri)
- Strimzi docs
- Flink Kubernetes Operator docs

---

## 5. MASTERY: Streaming alive on basecamp

```
[ ] Strimzi installed via Flux; deploy a 3-broker Kafka cluster via `Kafka` CRD
[ ] Verify durability: produce, kill a broker, recover, verify no message loss
[ ] Create `KafkaTopic` CRDs for at least 3 topics; partition counts deliberate
[ ] Deploy Schema Registry; register one Avro schema
[ ] Deploy Debezium as `KafkaConnect` + `KafkaConnector`; ingest Postgres changes to Kafka
[ ] CDC end-to-end: Postgres INSERT → Kafka topic → consumer
[ ] Write a small Kafka Streams app in Go or Java; process events in a topology
[ ] Deploy Flink Kubernetes Operator via Flux; deploy a `FlinkDeployment`
[ ] Write a Flink streaming job: read from Kafka → window aggregation with watermark → write to Iceberg
[ ] Verify exactly-once-ish: kill TaskManager mid-process; recover via checkpoint
[ ] Trigger a schema evolution in Postgres; observe Debezium handle (or fail gracefully) downstream
```

---

## 6. COMPARE: Pulsar or Redpanda

Pick one:
- **Apache Pulsar**: multi-tenant by design, tiered storage
- **Redpanda**: Kafka API-compatible, no JVM, C++-based, single-binary

400-word reflection on what each gets right vs Kafka.

---

## 7. OPERATE

- 4-5 runbooks: Kafka broker disk full, Strimzi cluster degraded, Debezium replication slot disconnect, Flink savepoint corrupted, schema evolution broke a consumer
- 2-3 ADRs (Strimzi over MSK, Flink over Kafka Streams for stateful, KRaft over ZK)
- Weekly log

---

## 8. CONTRIBUTE

- Apache Kafka: docs, edge cases
- Strimzi (CNCF): operator improvements
- Flink Kubernetes Operator: connectors, docs
- Debezium connector for any database you care about

---

## What ships from this phase

- **`crag` streaming deepened**: Strimzi Kafka + Schema Registry + Debezium + Flink Operator alive on basecamp
- **CDC pipeline** Postgres → Kafka → Iceberg running continuously
- **Streaming runbooks**

---

## Validation criteria

```
[ ] Strimzi Kafka 3-broker cluster operational via CRDs
[ ] Debezium CDC end-to-end working
[ ] Flink Operator deployed; one streaming job running
[ ] CDC → Iceberg pipeline operational
[ ] All 11 operational depth checks
[ ] Compare reflection (400 words)
[ ] 4-5 streaming runbooks
[ ] 2-3 ADRs
[ ] Pattern entries:
    - streaming-vs-batch → OUTLINE
    - change-data-capture → OUTLINE
    - event-time-windowing → OUTLINE
    - delivery-semantics reinforced toward DEEP
    - operator-pattern reinforced via Strimzi + Flink Operator
[ ] Exit Test passed
```

---

## Exit Test

**Time: 3 hours.**

### Part 1: Build (90 min)
Add a new streaming pipeline: a new Postgres table → Debezium → new Kafka topic → Flink job with windowed aggregation → Iceberg sink. Verify exactly-once-ish via deliberate failure injection.

### Part 2: Diagnose (75 min)
A streaming scenario (e.g., "Flink job is reading from Kafka at 1/10th expected throughput"). Possible: partition count mismatch, parallelism misconfig, GC pressure on JobManager, network bandwidth.

### Part 3: Articulate (15 min)
~400 words: *"Defend Strimzi over a managed Kafka service (MSK or Confluent Cloud) for basecamp. Cite K8s-native ecosystem composition + the meta-pattern."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Streaming when batch would work | Streaming costs 5-10× more operationally |
| Claiming exactly-once delivery | Usually a marketing lie; explain what you actually mean |
| Long-running stateful Flink job without savepoints | Restart loses state forever |
| CDC without thinking about schema evolution | Schema changes break the pipeline |
| Hand-managed Kafka without Strimzi | The ops burden multiplies; CRDs are the modern answer |

---

## Patterns touched this phase

- `streaming-vs-batch`: OUTLINE
- `change-data-capture`: OUTLINE
- `event-time-windowing`: OUTLINE
- `delivery-semantics` reinforced toward DEEP
- `operator-pattern` reinforced

---

→ Next: [Phase 33: Batch + Orchestration (Spark Operator)](/program/arc-4/phase-33/)

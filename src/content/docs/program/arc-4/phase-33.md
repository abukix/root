---
title: "Batch + Orchestration (Spark Operator + Argo Workflows)"
description: "Phase 33 of /root Arc 4: batch processing via Spark Operator (SparkApplication CRD), orchestration via Argo Workflows (Workflow CRD), Dagster as alternative. DAGs as CRDs. Idempotent batch design.."
tags: [arc-4, data, batch, spark, argo-workflows, dagster]
arc: 4
phase: 33
---

> Third phase of Arc 4. Batch + orchestration, K8s-native.

[Phase 32](/program/arc-4/phase-32/) handled streaming. This phase handles the other half: batch jobs that crunch large datasets on a schedule, and the orchestration layer that wires them into pipelines. **Spark Operator** turns Spark jobs into Kubernetes CRDs (`SparkApplication`, `ScheduledSparkApplication`). **Argo Workflows** turns DAGs into Kubernetes CRDs (`Workflow`, `CronWorkflow`, `WorkflowTemplate`). Both fit basecamp's K8s-native ecosystem; both compose with Flux + the rest of the stack.

By phase end basecamp.s data tier `crag` is fully alive: Iceberg + Kafka + Flink (streaming) + Spark + Argo Workflows (batch + orchestration). It's a recognizable mini-data-platform, the kind a small startup would actually run.

---

## Prerequisites

> - [Phase 32](/program/arc-4/phase-32/) complete; streaming operational
> - You accept: **batch is the boring substrate that makes streaming optional. Master batch first.**

---

## Why this phase exists

Streaming is fashionable. Batch is essential. Most data work in real organizations is *batch on a schedule*: nightly recomputes, weekly aggregations, hourly partition rebuilds. The patterns (DAG orchestration, idempotent jobs, partition-driven incremental processing) are foundational. Phase 33 installs them K8s-native.

---

## The pattern-first frame

Same eight steps.

---

## 1. PROBLEM

You have data in Iceberg (Phase 31). You want to: aggregate it (daily metrics), transform it (derived tables, joins), load it into downstream systems (feature stores in Arc 5, model training data sets). The work is too big for one machine (Spark scales out) and too complex to live in a single script (orchestration sequences steps with dependencies).

Spark + Argo Workflows is the K8s-native answer. Airflow is the legacy compare; Dagster is the modern compare.

---

## 2. PRINCIPLES

### 2.1 DAG orchestration

A pipeline is a directed acyclic graph of tasks. Each task has prerequisites; the orchestrator schedules + monitors + retries.

→ Pattern: `dag-orchestration`

**Investigate:**
- Walk a 5-task DAG with shared dependencies. What does the orchestrator decide?
- What happens when a task fails: retry, skip, or fail the DAG?
- Why is "task isolation" (each task in its own container) a sign of modern orchestrators?

### 2.2 Spark on K8s via Spark Operator

A `SparkApplication` CRD describes a Spark job. The Spark Operator reconciles it: launches a Driver pod, which launches Executor pods, runs the job, cleans up. `ScheduledSparkApplication` runs on a cron schedule.

→ Pattern: `operator-pattern` reinforced

**Investigate:**
- Walk a `SparkApplication` CRD: declare → operator creates Driver pod → Executors spawn.
- Why is Spark Operator preferred over `spark-submit` in K8s deployments?
- What's the relationship between Spark Operator and Kubernetes scheduling?

### 2.3 Argo Workflows: DAGs as CRDs

Each Argo `Workflow` CRD is a DAG. Each step is a container. The Argo controller schedules + retries + records lineage. CronWorkflow + WorkflowTemplate provide scheduling + reusability.

**Investigate:**
- Walk a 3-step Argo Workflow: ingest → transform → publish. What does each step's `templates` look like?
- Why is "each step is a container" a security + reproducibility win?
- How does Argo Workflows compose with Spark Operator? (Hint: an Argo step can be `kubectl apply -f spark-application.yaml`.)

### 2.4 Idempotent batch design

A batch job is idempotent if running it twice produces the same outcome. Idempotency is what makes retries safe and reruns trivial.

→ Pattern: `idempotency` reinforced from Arc 2

**Investigate:**
- For a daily aggregation: how do you design the output (partition-overwrite vs append) to be idempotent?
- What's "left-pad" idempotency violation in pipelines?
- Why is "delete partition + write new partition" the canonical idempotent pattern?

### 2.5 Partition-driven incremental processing

Process only the new partitions, not the whole table. Saves cost + time. Requires partition discipline (Phase 31).

**Investigate:**
- Walk an incremental processing pattern: yesterday's data → process → write yesterday's partition.
- What goes wrong with late-arriving data (Phase 32 mentioned this in streaming context)?
- How do you backfill cleanly?

### 2.6 Workflow choice: Argo vs Dagster vs Airflow

Three options for orchestration:

- **Argo Workflows**: K8s-native, CRD-driven, container-per-step. Best fit for basecamp.
- **Dagster**: opinionated, asset-aware, type-aware. Modern Pythonic.
- **Airflow**: legacy, still ubiquitous, Python-native. Operator-based but not K8s-native in the CRD sense.

**Investigate:**
- Why does Argo fit the K8s-native ecosystem better than Airflow?
- What does Dagster give you that Argo doesn't (asset-awareness, data lineage)?
- When does Airflow still win? (Hint: when the team already knows it and migrating costs more than the gain.)

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Batch engine | **Spark on Spark Operator**; raw Spark on YARN; Trino (for SQL-only) | Spark Operator: K8s-native (recommended). YARN: legacy. Trino: SQL-only but very fast. |
| Orchestrator | **Argo Workflows**; Dagster; Airflow; Prefect; Temporal | Argo: K8s-native (recommended). Dagster: modern, asset-aware. Airflow: ubiquitous, legacy K8s-fit. |
| Incremental strategy | Partition-overwrite; merge-on-read (Iceberg upserts); full-rewrite | Partition-overwrite: simple, idempotent. Merge-on-read: more complex, more flexible. Full-rewrite: only for small data. |

---

## 4. TOOLS (as of 2026-06)

### K8s-native stack
- **Spark Operator** (kubeflow/spark-operator): `SparkApplication`, `ScheduledSparkApplication` CRDs
- **Argo Workflows** (CNCF): `Workflow`, `CronWorkflow`, `WorkflowTemplate` CRDs
- **Apache Spark 3.5+**

### Alternatives + compare
- **Dagster**: for the asset-aware compare
- **Apache Airflow**: for the legacy compare
- **dbt**: SQL transformation (composes with any orchestrator)

### Reading
- "Spark: The Definitive Guide" (Chambers, Zaharia)
- "Fundamentals of Data Engineering" (Reis + Housley)
- Argo Workflows docs
- Spark Operator docs

---

## 5. MASTERY: Batch + orchestration alive on basecamp

```
[ ] Spark Operator installed via Flux; deploy a small SparkApplication
[ ] Spark reads from Iceberg, transforms, writes back to a new Iceberg table
[ ] Verify idempotency: run the same job twice; output identical
[ ] Argo Workflows installed via Flux; deploy a 3-step Workflow
[ ] Argo step invokes Spark via SparkApplication CRD
[ ] CronWorkflow scheduling daily aggregation
[ ] Failed step retries with exponential backoff
[ ] Workflow lineage visible in Argo UI
[ ] Add dbt as a step in one Argo Workflow (SQL transformation pattern)
[ ] Backfill exercise: rerun a CronWorkflow for a past date range; verify idempotent output
```

---

## 6. COMPARE: Dagster

Install Dagster locally; recreate one of your Argo Workflows as a Dagster job + assets. Reflect on asset-awareness, type system, dev experience.

400-word reflection.

---

## 7. OPERATE

- 4-5 runbooks: Spark OOM, Argo Workflow stuck, partition skew, backfill safety, dbt model failure
- 2-3 ADRs (Argo over Airflow, Spark Operator over spark-submit, dbt for SQL transforms)
- Weekly log

---

## 8. CONTRIBUTE

- Spark Operator: docs, edge cases
- Argo Workflows (CNCF): features, examples
- dbt: adapters, docs

---

## What ships from this phase

- **`crag` complete**: lakehouse + streaming + batch + orchestration all K8s-native
- **`crag` umbrella** updated with Spark utility crate + Argo template library
- **Batch runbooks**

---

## Validation criteria

```
[ ] Spark Operator + Argo Workflows operational
[ ] CronWorkflow running daily aggregation, idempotent
[ ] At least 3 multi-step pipelines covering: ingest, transform, publish
[ ] All 10 operational depth checks
[ ] Compare reflection (400 words)
[ ] 4-5 runbooks
[ ] 2-3 ADRs
[ ] Pattern entries:
    - dag-orchestration → OUTLINE
    - operator-pattern reinforced
    - idempotency reinforced toward DEEP at batch scale
[ ] Exit Test passed
```

---

## Exit Test

**Time: 2.5 hours.**

### Part 1: Build (90 min)
Author a new CronWorkflow with 4 steps: extract from Postgres (CDC has populated Kafka topic), transform via Spark Operator, write to new Iceberg table, notify via webhook. Make it idempotent. Verify by running twice.

### Part 2: Diagnose (45 min)
A pipeline scenario (e.g., "the daily aggregation has been producing wrong numbers for 2 weeks; nobody noticed"). Possible: silent partition skew; missing dependency; late-arriving data not handled.

### Part 3: Articulate (15 min)
~400 words: *"Defend Argo Workflows + Spark Operator over Airflow + spark-submit for basecamp. Cite K8s-native ecosystem composition."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Pipelines without idempotency | Backfills become surgical operations |
| `spark-submit` from a shell script outside K8s | You lose container isolation, lineage, retries |
| Long-running monolithic batch jobs | Failure means restart everything; break into smaller steps |
| Airflow's `BashOperator` everywhere | Each task should be a real container, not a bash invocation |
| No data quality checks in the pipeline | Bad data propagates silently |

---

## Patterns touched this phase

- `dag-orchestration`: OUTLINE
- `operator-pattern` reinforced
- `idempotency` reinforced

---

→ Next: [Phase 34: Python ML Stack](/program/arc-4/phase-34/)

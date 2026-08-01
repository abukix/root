---
title: "Feature Stores"
description: "Phase 40 of /root Arc 5: Feast at depth. Online + offline feature stores with train/serve parity. Point-in-time correctness. K8s-native deployment via Flux + Postgres (offline) + Redis (online).."
tags: [arc-5, ml, feature-store, feast]
arc: 5
phase: 40
---

> Second phase of Arc 5. Where the data tier meets ML.

The single most common ML production bug is train/serve skew: features computed differently at training vs serving time. A feature store solves this by being *the* source of truth for features in both modes. By phase end basecamp has Feast deployed K8s-native, with Iceberg as the offline store (Phase 31) and Redis as the online store, serving features consistently to training and serving pipelines.

This is where the data tier from Arc 4 actually meets the ML tier from Arc 5. Without a feature store, every model defines its own features and the platform splinters. With one, features are reusable, consistent, and operationally legible.

---

## Prerequisites

> - [Phase 39](/program/arc-5/phase-39/) complete; MLflow lifecycle disciplined
> - Iceberg (Arc 4 Phase 31) + Redis (Arc 3 Phase 20) operational

---

## Why this phase exists

Most ML systems fail at the boundary between training and serving. The model trained on yesterday's averaging is asked to predict on today's last-5-minute averaging. Subtle drift. Hidden behind dashboards. Hard to debug. The feature store enforces parity by having one definition that serves both modes.

---

## The pattern-first frame

Same eight steps.

---

## 1. PROBLEM

Your model needs features. Some are simple (current user balance). Some are aggregations (7-day rolling average of transactions). Some are joins (user features + product features). At training time you compute them over historical data. At serving time you need them in milliseconds. Train/serve skew is the dominant source of "the model worked in dev but is broken in prod" bugs.

---

## 2. PRINCIPLES

### 2.1 Train/serve parity

Features at training time must equal features at serving time. The feature store enforces this by being the single source of feature definitions and serving both modes from the same code path.

→ Pattern: `train-serve-skew`: **DEEP target this phase**

**Investigate:**
- What's point-in-time correctness, and how does it differ from online-store consistency?
- How does Feast prevent train/serve skew operationally?
- When does point-in-time correctness break (delayed features, late-arriving events)?

### 2.2 Online vs offline feature stores

Offline (Iceberg, BigQuery, Snowflake): serves training pipelines with historical features at arbitrary timestamps. Online (Redis, DynamoDB): serves the production model at sub-10ms latency.

→ Pattern: `feature-store`: **DEEP target this phase**

**Investigate:**
- Why isn't "just Postgres for both" sufficient at scale?
- How does materialization (offline → online) work, and what does it cost?
- What's the freshness vs cost trade-off (push events real-time vs batch hourly)?

### 2.3 Feature definitions as code

Feature definitions live in code (Feast SDK). Version-controlled, code-reviewed, tested, deployed via GitOps like everything else in basecamp.

→ Pattern: `feature-engineering` reinforced

**Investigate:**
- What's a feature view, entity, feature service in Feast?
- Why is "feature-as-code" better than "feature-as-SQL-query-shared-on-Slack"?
- Why are aggregations the hardest features to get right?

### 2.4 Materialization patterns

Offline → online materialization can be: scheduled batch (hourly), streaming (continuous), on-demand. Each has different freshness + cost trade-offs.

**Investigate:**
- Walk a streaming materialization path: Kafka (Phase 32) → Flink → online store.
- When is hourly materialization sufficient?
- What's "feature freshness SLO," and when does it matter?

### 2.5 K8s-native Feast deployment

Feast on K8s: Feast components (registry, online store, materialization workers) deployed via Helm + Flux. Schedule materialization via Argo CronWorkflows.

**Investigate:**
- How does Feast registry sync to K8s (ConfigMap, custom CRD, external registry)?
- What's the deployment topology for high-availability Feast?
- How does Feast compose with KServe (transformer pattern from Phase 38)?

### 2.6 Feature monitoring

Features can drift, become stale, or break silently. Monitoring covers: freshness, distribution, completeness.

**Investigate:**
- What's feature drift, and how does it differ from prediction drift (Phase 41)?
- How do you alert on feature freshness violations?
- When does a feature need a hard freshness contract (real-time fraud) vs soft (recommendations)?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Feature store | **Feast**; Tecton; AWS Feature Store; Vertex Feature Store | Feast: K8s-native OSS (recommended). Tecton: managed, enterprise. Cloud: vendor lock-in. |
| Offline store | **Iceberg** (already Arc 4); BigQuery; Snowflake | Iceberg: K8s-native, owned (recommended). BQ/Snowflake: managed, paid. |
| Online store | **Redis**; DynamoDB; Cassandra; Postgres | Redis: fast, ubiquitous (recommended). DynamoDB: AWS-managed. Cassandra: scale, ops-heavy. |
| Materialization | Batch (Argo CronWorkflow); Streaming (Flink); On-demand | Batch: simple, hourly+. Streaming: low-latency, complex. On-demand: smallest writes. |

---

## 4. TOOLS (as of 2026-06)

- **Feast 0.40+**
- **Iceberg + Trino** for offline (Phase 31)
- **Redis** for online (Phase 20)
- **Argo CronWorkflows** for materialization (Phase 33)
- **Apache Flink** for streaming materialization (Phase 32)

### Reading
- "Feature Engineering for Machine Learning" (Zheng + Casari)
- Feast docs: concepts + materialization
- Public engineering blogs on feature stores (Uber Michelangelo, Airbnb Bighead)

---

## 5. MASTERY: Feast operational on basecamp

```
[ ] Feast deployed via Flux + Helm; Iceberg as offline; Redis as online
[ ] Define 5+ feature views for a real use case
[ ] Materialize features offline → online via Argo CronWorkflow
[ ] Train a model using Feast offline retrieval (point-in-time correct)
[ ] Serve the same model using Feast online retrieval; verify train/serve parity
[ ] Deliberately introduce train/serve skew; observe its effect on prediction quality
[ ] Add streaming materialization via Flink for one high-freshness feature
[ ] Monitor feature freshness; alert on staleness
[ ] Integrate with KServe: InferenceService transformer pulls features from Feast
[ ] Document the feature ownership model (who owns which feature view)
```

---

## 6. COMPARE: Tecton or Vertex AI Feature Store

Read the docs of one managed feature store. Reflect on what's gained vs what's lost.

400-word reflection.

---

## 7. OPERATE

- 3-4 runbooks: "Feature freshness lag", "Materialization failure", "Train/serve skew detection", "Feature view ownership dispute"
- 1-2 ADRs (Feast over Tecton; Iceberg + Redis topology; materialization cadence)
- Weekly log

---

## 8. CONTRIBUTE

- Feast: connectors, docs
- A blog post on a real train/serve skew you caught

---

## What ships from this phase

- **Feast operational** as the K8s-native feature store
- **Streaming + batch materialization** working
- **Train/serve parity verified** for at least one model

---

## Validation criteria

```
[ ] Feast deployed K8s-native
[ ] 5+ feature views defined
[ ] Materialization working (batch + streaming)
[ ] Train/serve parity verified
[ ] All 10 operational depth checks
[ ] Compare reflection (400 words)
[ ] 3-4 runbooks
[ ] 1-2 ADRs
[ ] Pattern entries:
    - feature-store → DEEP
    - train-serve-skew → DEEP
    - feature-engineering reinforced
[ ] Exit Test passed
```

---

## Exit Test

**Time: 2.5 hours.**

### Part 1: Build (90 min)
Add a new feature view to Feast. Materialize it. Verify train/serve parity by sampling 50 predictions and comparing offline + online retrievals.

### Part 2: Diagnose (45 min)
A feature scenario (e.g., "predictions degraded 20% after a Feast deployment"). Possible: schema drift; materialization gap; clock skew.

### Part 3: Articulate (15 min)
~400 words: *"Walk a serving prediction's feature retrieval path. Cover Feast online store lookup, fallback, and the latency budget."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Computing features in notebook SQL | Train/serve skew |
| No point-in-time joins | Future leakage; model looks great in dev |
| Hourly materialization for fraud detection | Freshness gap = miss real-time signals |
| Skipping feature monitoring | Drift accumulates silently |

---

## Patterns touched this phase

- `feature-store`: **DEEP**
- `train-serve-skew`: **DEEP**
- `feature-engineering` reinforced

---

→ Next: [Phase 41: ML Evaluation + Monitoring](/program/arc-5/phase-41/)

---
title: "Arc 4 Final Exam"
description: "The graduation gate for Arc 4 of /root. Scenario-based. Three parts: Build, Debug, Articulate. Tests the K8s-native data + ML platform competence — Iceberg, Strimzi Kafka, Spark Operator, KubeRay, KServe. Prove you can ship as a senior data / ML engineer."
tags: [arc-4, final-exam, graduation]
arc: 4
---

> The graduation gate for Arc 4.
> Scenario-based. Three parts.
> Take it ~2 weeks after Phase 38 ends.

By the time you sit Arc 4's exam, basecamp `crag` (data + ML infra) is alive: Iceberg lakehouse, Strimzi Kafka, Spark Operator, Argo Workflows, KubeRay, MLflow, KServe, Keda for scale-to-zero, Flagger for canary. All K8s-native, all operator-managed. You've trained classical + DL models, distributed one of them via Ray, served one via KServe. The exam asks whether you can use it all under pressure.

The bar is the **Senior Data / ML Engineer** exit ramp: ship an ML pipeline end-to-end across the K8s-native data + ML stack, debug any layer, articulate the data → train → serve flow with K8s-native patterns cited.

---

## Ship gates (verify before sitting)

```
[ ] `crag` data layer alive: Iceberg + MinIO + Strimzi Kafka + Spark Operator + Argo Workflows + Flink Operator (via Phase 32)
[ ] `crag` ML-infra layer alive: KubeRay + Ray cluster + MLflow + KServe + Keda + Flagger
[ ] CDC pipeline Postgres → Kafka → Iceberg running continuously
[ ] At least 3 models trained: classical (XGBoost), DL (transformer or CNN), distributed (Ray)
[ ] At least 1 model serving via KServe with scale-to-zero + canary configured
[ ] crag umbrella public on GitHub
[ ] ml-infra-helpers public on GitHub
[ ] All 8 phase Exit Tests passed
[ ] ~25-30 patterns at OUTLINE+ in data + ML categories
[ ] chronicle: ~25+ Arc 4-specific runbooks
```

If any ship gate is missing, finish it first.

---

## Exam shape

**Total time:** 6 hours, one sitting.
**Workspace:** basecamp K3s + EKS + GKE; Arc 4 components alive; GPU available (local or cloud).
**Allowed:** chronicle, project READMEs, ADRs, weekly logs, official docs. **Not allowed:** web search, AI coding for Build, asking others.

| Part | Time | Focus |
|---|---|---|
| **Build** | 180 min | Ship an ML pipeline end-to-end via K8s-native operators |
| **Debug** | 180 min | Three scenarios from Phases 31, 32, 37 catalogs |
| **Articulate** | 90 min | ~1500 words: walk an event from Kafka through the platform to a model and back |

30-min breaks between parts.

---

## Part 1: Build (180 min)

**The task:** ship a new ML pipeline end-to-end.

```
Postgres (CDC via Debezium → Strimzi Kafka topic)
  ↓
Flink streaming job (FlinkDeployment CRD) — windows + aggregates
  ↓
Iceberg table (snapshot-plus-delta)
  ↓
Argo Workflow CronWorkflow daily:
  ↓ SparkApplication CRD: train classical model on aggregated Iceberg data
  ↓ MLflow registry: register model
  ↓ RayJob: hyperparameter sweep via Ray Tune
  ↓ Promote best to Staging
  ↓
KServe InferenceService (canary policy via Flagger; scale-to-zero via Keda)
  ↓
HTTP endpoint reachable from inside basecamp
```

**Pass bar:**
- After 180 min, pipeline operational end-to-end
- All components declared via K8s-native CRDs
- Reproducible from Git
- Telemetry visible in Grafana

**Anti-pattern checks (auto-fail):**
- Imperative `kubectl apply` instead of declarative GitOps
- Raw Spark submit or `python serve.py` instead of operators
- Skipping MLflow registration
- No NetworkPolicy

---

## Part 2: Debug (180 min)

Three scenarios from Phases 31, 32, 37 catalogs.

### Catalog seeds

**Phase 31 (Lakehouse):**
- *"Trino queries are 100× slower this week despite no data growth."* (Possible: missing compaction; small-files explosion; partition pruning broken.)
- *"Schema evolution attempt rejected the migration."* (Possible: incompatible widening; null-allowing change; reader hasn't upgraded.)

**Phase 32 (Streaming):**
- *"Flink job is stuck at 1 record/sec processing."* (Possible: parallelism misconfig; checkpoint lag; downstream Iceberg write bottleneck.)
- *"Debezium CDC has been on the same WAL position for 4 hours."* (Possible: replication slot disconnect; schema change confused connector; Kafka backpressure.)

**Phase 37 (Distributed Training):**
- *"4-GPU DDP training is 2× slower than 1-GPU."* (Possible: comm-bound; batch size not scaled; data loader bottleneck.)
- *"RayCluster head OOM after 6 hours."* (Possible: result accumulation; metrics overhead; head trying to coordinate too much.)

**Pass bar per scenario:**
- Correct root cause
- Runbook written + committed
- Patterns cited

---

## Part 3: Articulate (90 min)

**Prompt:** *"Walk a single event from a Postgres INSERT through the basecamp data tier to a model prediction and back. Cover: WAL → Debezium → Kafka → Flink streaming job → Iceberg table → daily aggregation via Spark Operator → training data preparation → KubeRay-distributed training → MLflow registry → KServe InferenceService → user-facing prediction. Cite at least 10 patterns and connect each to a specific K8s-native component. ~1500 words."*

**Strong answer covers:**
- Postgres WAL + logical replication
- Debezium connector via Strimzi KafkaConnect
- Kafka topic + partitioning + delivery semantics
- Flink streaming (event time, watermarks, exactly-once-ish)
- Iceberg snapshot-plus-delta on MinIO
- Spark Operator batch aggregation
- Argo Workflow orchestration
- KubeRay distributed training (DDP/FSDP)
- MLflow registry + stage promotion
- KServe InferenceService control loop
- Keda scale-to-zero behavior
- Flagger canary

**Pass bar:**
- ~1500 words, prose
- 10+ patterns cited correctly
- K8s-native CRDs named at each step
- No factual errors

---

## Scoring

| Outcome | Meaning |
|---|---|
| **3 Pass** | Full graduation. Move to Arc 5. |
| **2 Pass + 1 Pass-with-notes** | Graduation with action item; address in first 4 weeks of Arc 5. |
| **2 Pass + 1 Fail** | Conditional; re-take within 4 weeks. |
| **≤ 1 Pass** | Not yet. 4-6 weeks more work; retake. |

---

## After passing

```
You can:
- Operate a K8s-native lakehouse (Iceberg + MinIO + Nessie)
- Operate Strimzi Kafka with CDC via Debezium
- Run batch + orchestration via Spark Operator + Argo Workflows
- Apply classical ML deliberately (XGBoost, recommendations)
- Train DL models with PyTorch + KubeRay
- Distribute training via DDP/FSDP/ZeRO
- Serve models via KServe with canary + scale-to-zero
- Operate the K8s-native data + ML stack end-to-end

Exit ramp: Senior Data / ML Engineer
Confidence: real, with `crag` (data tier + ML serving) K8s-native and operator-managed
```

→ Continue to [Arc 5: AI Infrastructure](/program/arc-5/).

---

## Anti-patterns when sitting the exam

| Anti-pattern | Why |
|---|---|
| Treating as memory test | Competence test. Use chronicle. |
| Compressing breaks | Cognitive fatigue produces wrong answers |
| AI coding for Build | Auto-fail |
| Articulate as bullet lists | Prose is the test |
| Re-taking immediately on Fail | 4-6 weeks. Arc 5 isn't a race. |

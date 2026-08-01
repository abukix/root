---
title: "Data Engineering & ML Foundations"
description: "Arc 4 of /root: ~8 phases that stand the data tier and the ML foundations on top of basecamp. Iceberg lakehouse, Strimzi Kafka, Spark Operator, Python ML stack, classical ML, deep learning, KubeRay distributed training, KServe model serving. Basecamp `crag` comes alive — K8s-native throughout. Exit ramp: Senior Data / ML Engineer."
tags: [program, arc-4, data, ml, foundations]
arc: 4
---

> Arc 4 of /root. The platform gets its data brain.
> ~8 phases that stand `crag` (data tier + ML serving).
> Exit ramp: **Senior Data / ML Engineer**

Years 1-3 built the engineer and the substrate. Arc 4 stands the data tier and the ML foundations on that substrate, K8s-native throughout. Iceberg tables on MinIO via Helm-deployed operators. Kafka via Strimzi (operator + CRDs). Spark via Spark Operator. Python ML stack from numpy through PyTorch. Classical ML through deep learning. Distributed training via KubeRay (Ray's K8s-native operator). Model serving via KServe (`InferenceService` CRDs).

By end of Arc 4 basecamp has a working lakehouse, working stream + batch pipelines, working ML training and serving infrastructure, and it's all *operator-managed*, fitting the same CRD-driven controller pattern Arc 3 established for the substrate + `forge` + `ascent`.

---

## What you'll know at the end of Arc 4

- **Lakehouse architecture**: Iceberg at depth, schema evolution, time-travel, snapshot-plus-delta on object storage
- **Stream processing**: Strimzi-managed Kafka, Kafka Streams + Flink for processing, exactly-once-ish patterns, watermarks + event time
- **Batch + orchestration**: Spark Operator + Argo Workflows; DAGs as CRDs; idempotent batch
- **Python ML stack**: numpy + pandas + sklearn fluency; vectorization muscle; cross-validation discipline
- **Classical ML engineering**: regression, classification, ensembles, XGBoost, recommendations, and when each fits
- **Deep learning fundamentals**: PyTorch, autograd, training loops, common architectures (MLP, CNN, attention)
- **Distributed training**: KubeRay-managed Ray clusters; data-parallel + model-parallel training; FSDP / ZeRO basics
- **Model serving infrastructure**: KServe `InferenceService` CRDs; canary deploys for models; scale-to-zero via Keda

You'll be operating an ML platform end-to-end at homelab scale, K8s-native end to end. The bar for **Senior Data / ML Engineer** is hit; the bar for Arc 5's **ML Platform / AI Infrastructure** is in sight.

---

## Phase map

| Phase | Title | Weeks | Hours | K8s-native components | Capstone output |
|---|---|---|---|---|---|
| [31](/program/arc-4/phase-31/) | Data Lakehouse (Iceberg) | 7-9 | 80-100 | MinIO operator + Iceberg + Nessie catalog + Trino + Flux HelmReleases | **`crag` v0 entry: lakehouse alive** |
| [32](/program/arc-4/phase-32/) | Stream Processing (Strimzi + Flink) | 7-9 | 80-100 | Strimzi (Kafka, KafkaConnect, KafkaTopic CRDs) + Flink Operator (FlinkDeployment CRD) + Debezium | **`crag` streaming alive** |
| [33](/program/arc-4/phase-33/) | Batch + Orchestration (Spark Operator) | 6-8 | 70-90 | Spark Operator (SparkApplication CRD) + Argo Workflows (Workflow CRD) + Dagster | **`crag` complete: batch + orchestration** |
| [34](/program/arc-4/phase-34/) | Python ML Stack | 5-7 | 60-80 | (local dev; ML platform integration in Phase 38) | ML practice notebooks |
| [35](/program/arc-4/phase-35/) | Classical ML Engineering | 6-8 | 70-90 | (local + Ray for training distribution in Phase 37) | First model trained-registered |
| [36](/program/arc-4/phase-36/) | Deep Learning Fundamentals (PyTorch) | 7-9 | 80-100 | (local GPU + Ray in Phase 37) | First DL model end-to-end |
| [37](/program/arc-4/phase-37/) | Distributed Training (KubeRay) | 7-9 | 80-100 | KubeRay (RayJob, RayCluster, RayService CRDs) | **Ray cluster alive on the substrate** |
| [38](/program/arc-4/phase-38/) | Model Serving Infrastructure (KServe) | 6-8 | 70-90 | KServe (InferenceService CRD) + Keda for scale-to-zero + Flagger for canary | **KServe serving alive on the substrate** |
|   | **[Arc 4 Final Exam](/program/arc-4/final-exam/)** | 2-3 | 20-30 | — | — |
| **Total** | | **~53-70 weeks** | **~610-790 hrs** | All data + ML infra as CRD-driven operators | `crag` alive |

Pace is yours.

---

## The K8s-native ecosystem for data + ML

Arc 4 continues the K8s-native ecosystem pattern from Arc 3. Every component is a CRD-driven operator:

| Concern | K8s-native operator | CRD(s) |
|---|---|---|
| Kafka | Strimzi | `Kafka`, `KafkaConnect`, `KafkaTopic`, `KafkaUser`, `KafkaConnector` |
| Flink | Flink Kubernetes Operator | `FlinkDeployment`, `FlinkSessionJob` |
| Spark | Spark Operator | `SparkApplication`, `ScheduledSparkApplication` |
| Workflows | Argo Workflows | `Workflow`, `CronWorkflow`, `WorkflowTemplate` |
| Iceberg catalog | Nessie (via Helm) | (REST catalog, ConfigMap-driven) |
| Object storage | MinIO Operator (or Rook for Ceph alternative) | `Tenant` (MinIO), `Bucket` |
| Ray | KubeRay | `RayCluster`, `RayJob`, `RayService` |
| Model serving | KServe | `InferenceService`, `TrainedModel` |
| Canary deploys | Flagger | `Canary` |
| Pipelines | (Arc 5: Kubeflow Pipelines or use Argo Workflows already in Arc 4) | — |

Same composition pattern as Arc 3: `kubectl apply` triggers a controller to reconcile, and the underlying resources materialize. Same operational interface (`kubectl get`, RBAC, observability) across the whole stack.

---

## What ships publicly during Arc 4

| Project | Phase | Role | Launch energy |
|---|---|---|---|
| `crag` (umbrella) | 31-33 | Iceberg helpers + Spark utilities + Flink job templates + Argo workflow templates | Quiet ship: components live in basecamp; standalone helper repos for the most reusable bits |
| ML infra helpers | 37-38 | Helm charts + Python utilities for KubeRay + KServe operations | Quiet ship |
| First trained model | 35-37 | Public on Hugging Face Hub or GitHub (a small classification or recommendation model) | Quiet ship: README + model card |

No loud launches in Arc 4; `forge` (Arc 3) and `prism` + vantage (Arc 5) are the loud-launch years. Arc 4 is the year you build the infrastructure that ML *runs on*, not the year you ship a flashy artifact.

---

## Patterns deepened in Arc 4

**Data engineering** (new category)

- `lakehouse`: Phase 31, OUTLINE+
- `schema-evolution`: Phase 31
- `streaming-vs-batch`: Phase 32
- `change-data-capture`: Phase 32 (Debezium)
- `event-time-windowing`: Phase 32 (Flink)
- `dag-orchestration`: Phase 33

**ML systems** (new category)

- `train-test-split`: Phase 34
- `cross-validation`: Phase 34
- `ensemble-methods`: Phase 35
- `gradient-boosting`: Phase 35 (XGBoost)
- `gradient-descent`: Phase 36
- `backpropagation`: Phase 36
- `attention-mechanism`: Phase 36 (taste; deepens in Arc 5)
- `distributed-training`: Phase 37
- `model-serving`: Phase 38
- `model-registry`: Phase 38 (taste; deepens Arc 5)

**Reinforced from prior years**

- `operator-pattern`: reinforced through every Arc 4 phase's K8s-native component
- `idempotency`: reinforced (Phase 33 batch idempotency)
- `delivery-semantics`: reinforced (Phase 32 exactly-once-ish)

~12-15 new patterns plus heavy reinforcement.

---

## Hardware requirements

Arc 4 needs more RAM than Arc 3 endpoint. Before Phase 31 (~Arc 4 start), upgrade to **64GB DDR5**. Add a **second 1TB NVMe** for Spark intermediate storage. Total Arc 4 hardware upgrade: ~$150-200.

Phase 36+ benefits from GPU for deep learning: same hardware as Arc 5's main GPU need (RTX 4060/4070 or used 3090). You can defer GPU purchase to Arc 5 if Arc 4 PyTorch work is small enough to fit on CPU + Apple Silicon MPS.

Full breakdown: [homelab/hardware](https://github.com/abukix/homelab/blob/main/hardware.md).

---

## Arc 4 Final Exam

**Scenario-based final exam.** Three parts:

1. **Build (180 min)**: ship a small ML pipeline end-to-end via operator-managed components: ingest from Kafka, land in Iceberg via Flink/Spark, train a model on KubeRay, serve via KServe, measure latency
2. **Debug (180 min)**: three parallel scenarios from Phases 31, 32, 37 catalogs
3. **Articulate (90 min)**: ~1500 words: walk an event from Kafka through the data tier to the model and back; cite K8s-native patterns at each step

See the [full Arc 4 Final Exam spec](/program/arc-4/final-exam/).

---

## Arc 4 graduation

```
You can:
- Operate a lakehouse (Iceberg) on K8s with proper schema evolution + time travel
- Operate Kafka via Strimzi at small scale with CRD-driven topic management
- Run batch jobs via Spark Operator and orchestrate them via Argo Workflows
- Apply classical ML (regression, ensembles, XGBoost, recommendations) deliberately
- Train deep learning models in PyTorch (MLP, CNN, basic attention)
- Distribute training via KubeRay (RayJob + Ray Train + DDP/FSDP)
- Serve models via KServe with canary + scale-to-zero

Exit ramp: Senior Data / ML Engineer
Confidence: real, with `crag` (data tier + ML serving) K8s-native and operator-managed
```

→ Continue to [Arc 5: AI Infrastructure](/program/arc-5/).

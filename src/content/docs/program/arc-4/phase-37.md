---
title: "Distributed Training (KubeRay)"
description: "Phase 37 of /root Arc 4: Ray on Kubernetes via KubeRay operator. RayJob + RayCluster CRDs. Data parallel + model parallel basics. PyTorch DDP / FSDP. ZeRO introduction. the ML-infra substrate comes alive.."
tags: [arc-4, ml, ray, kuberay, distributed-training]
arc: 4
phase: 37
---

> Seventh phase of Arc 4. ML training on Kubernetes.

[Phase 36](/program/arc-4/phase-36/) trained models on one machine. This phase scales training to multiple machines via **KubeRay**, Ray's K8s-native operator. `RayCluster`, `RayJob`, `RayService` are CRDs reconciled by the KubeRay operator. The pattern is identical to every other K8s-native component in basecamp: declare a CRD, the operator reconciles it into the underlying state.

By phase end basecamp has Ray + MLflow alive. You've trained at least one model on a distributed Ray cluster. PyTorch DDP, FSDP, ZeRO are operational concepts, not papers you read. The substrate for Arc 5.s AI-tier work (`prism`, `loom`, `warden`) is in place.

---

## Prerequisites

> - [Phase 36](/program/arc-4/phase-36/) complete; PyTorch fluency + GPU available
> - Sufficient hardware: 64GB RAM minimum, 1-2 GPUs (or cloud burst access)
> - You accept: **distributed training is hard because the *parallelism strategy* matters. Picking the right one is the engineering.**

---

## Why this phase exists

Arc 5 ML/AI work assumes you understand distributed training. You don't need to train a 70B model in /root, but you do need to understand *why* it requires what it requires. KubeRay makes the operations tractable; understanding parallelism makes the engineering legible.

---

## The pattern-first frame

Same eight steps.

---

## 1. PROBLEM

You have a model that doesn't fit on one GPU (parameter count too large), or training takes too long (one GPU can't process the data fast enough). You need to split work across multiple GPUs and machines. The mechanism is parallelism; the orchestration is Ray on Kubernetes.

---

## 2. PRINCIPLES

### 2.1 Ray as the distributed-compute primitive

Ray provides a Python API for distributed computation: tasks (stateless functions running on workers), actors (stateful objects), placement groups (resource colocation).

→ Pattern: `distributed-training`: OUTLINE this phase (deepens through Arc 5 LLM training)

**Investigate:**
- Walk a Ray task: `@ray.remote def f(): ...`. What happens at the runtime level?
- What's the difference between a Ray task and a Ray actor?
- Why does Ray fit ML training particularly well (heterogeneous compute, stateful trainers)?

### 2.2 KubeRay as the K8s-native operator

KubeRay reconciles `RayCluster`, `RayJob`, `RayService` CRDs. Same operator pattern as Strimzi, Spark Operator, CloudNativePG.

→ Pattern: `operator-pattern` reinforced

**Investigate:**
- Walk a `RayCluster` CRD: declare head + worker groups → operator creates pods + Services.
- What's `RayJob` vs `RayService`? (Hint: ephemeral training vs long-running serving.)
- How does KubeRay handle autoscaling within a Ray cluster?

### 2.3 Data parallelism

Each worker holds a full model copy. Each gets a different data slice. Gradients aggregate across workers (all-reduce). The standard for "make training faster."

→ Pattern: `data-parallelism`

**Investigate:**
- Walk DDP: forward pass per replica, all-reduce gradients, optimizer step.
- Why is `nccl` the backend for GPU all-reduce?
- When does data parallelism become network-bound?

### 2.4 Model parallelism + sharding

When the model doesn't fit on one GPU, shard it. Tensor parallelism splits within layers; pipeline parallelism splits across layers; FSDP (Fully Sharded Data Parallel) shards parameters + gradients + optimizer states across data-parallel workers.

→ Pattern: `model-parallelism`

**Investigate:**
- When does model parallelism become necessary? (Hint: model > GPU memory.)
- What's pipeline bubble, and how does it limit pipeline parallelism efficiency?
- Walk FSDP: parameters sharded across data-parallel workers; gather + compute + scatter per layer.

### 2.5 ZeRO and DeepSpeed

ZeRO (Zero Redundancy Optimizer, from DeepSpeed) is the family of FSDP-style techniques. ZeRO-1: shard optimizer states. ZeRO-2: also gradients. ZeRO-3: also parameters.

**Investigate:**
- Walk ZeRO-1 → ZeRO-2 → ZeRO-3: what's added at each stage?
- When does ZeRO-3 (parameter sharding) earn its weight?
- How does ZeRO-Offload trade GPU memory for CPU offload?

### 2.6 MLflow for experiment tracking + registry

Every training run produces: hyperparameters, metrics, artifacts (model). MLflow tracks them all; MLflow Registry versions models.

→ Pattern: `model-registry`: OUTLINE (Arc 5 deepens)

**Investigate:**
- What does `mlflow.start_run()` actually create?
- How does the MLflow Registry's stage promotion (None → Staging → Production) work?
- Why is MLflow K8s-friendly (just a Helm chart + S3 backend + Postgres metadata)?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Distributed framework | **Ray (via KubeRay)**; PyTorch DDP only; DeepSpeed; Horovod | Ray: orchestration + DDP integration (recommended). Raw DDP: simpler, less orchestration. DeepSpeed: ZeRO-native. Horovod: legacy. |
| Parallelism strategy | DDP; FSDP; pipeline + tensor (3D parallel) | DDP: fits in GPU mem. FSDP: model exceeds GPU mem. 3D: massive models. |
| Experiment tracking | **MLflow**; Weights & Biases; ClearML | MLflow: OSS, K8s-friendly. W&B: rich UX, SaaS. ClearML: full platform. |
| Compute platform | **KubeRay on basecamp**; managed (Anyscale, AWS SageMaker); raw GPU VMs | KubeRay: K8s-native (recommended). Managed: convenience. VMs: max control, no orchestration. |

---

## 4. TOOLS (as of 2026-06)

### K8s-native stack
- **KubeRay**: `RayCluster`, `RayJob`, `RayService` CRDs
- **Ray 2.30+** with Ray Train + Ray Tune + Ray Data
- **MLflow**: tracking + registry; Helm-deployable

### Reading
- Ray docs (especially Ray Train + Ray Tune)
- "Learning Ray" (Damji et al.)
- The ZeRO paper (Rajbhandari et al.): short, foundational
- "Mixed Precision Training" paper (Micikevicius et al.)
- PyTorch FSDP docs

---

## 5. MASTERY: Distributed training on basecamp

```
[ ] KubeRay operator installed via Flux
[ ] RayCluster CRD applied; cluster launches with head + 2 workers
[ ] Submit a RayJob that runs a small training task via ray.remote
[ ] Train Phase 36's tiny transformer on Ray; observe wall time vs single-machine
[ ] MLflow deployed via Helm + Flux; configure as tracking backend
[ ] Use Ray Train + DDP to scale training across workers
[ ] Profile with Ray Dashboard; identify bottleneck (compute vs comm vs IO)
[ ] Implement FSDP on a model that doesn't fit one GPU (or simulate by sharding intentionally)
[ ] Use Ray Tune for hyperparameter search; 10-trial sweep
[ ] Register the best model in MLflow; promote to Staging
```

---

## 6. COMPARE: Raw PyTorch DDP

Run the same training task with raw `torch.distributed` (no Ray). Reflect on what Ray adds (orchestration, K8s integration, fault tolerance) vs what it costs (overhead, learning curve).

400-word reflection.

---

## 7. OPERATE

- 3-4 runbooks: RayCluster won't start, head node OOM, GPU not detected, MLflow tracking failure, Ray dashboard inaccessible
- 1-2 ADRs (KubeRay over managed Anyscale; MLflow over W&B)
- Weekly log

---

## 8. CONTRIBUTE

- KubeRay (CNCF): operator improvements
- Ray: docs, examples
- MLflow: integrations, docs

---

## What ships from this phase

- **Ray entry alive on the substrate**: KubeRay + Ray + MLflow operational, K8s-native
- **Distributed-training runbooks**
- **At least one model trained-registered-promoted via the pipeline**

---

## Validation criteria

```
[ ] KubeRay operational; RayCluster + RayJob working
[ ] MLflow tracking + registry alive
[ ] DDP training working at small scale (2+ workers)
[ ] FSDP exercise (real or simulated)
[ ] All 10 operational depth checks
[ ] Compare reflection (400 words)
[ ] 3-4 runbooks
[ ] 1-2 ADRs
[ ] Pattern entries:
    - distributed-training → OUTLINE
    - data-parallelism → OUTLINE
    - model-parallelism → OUTLINE
    - model-registry → OUTLINE (Arc 5 deepens)
    - operator-pattern reinforced
[ ] Exit Test passed
```

---

## Exit Test

**Time: 3 hours.**

### Part 1: Build (120 min)
Submit a Ray Tune hyperparameter sweep (10 trials) via RayJob CRD. Track all trials in MLflow. Promote best to MLflow Registry Staging.

### Part 2: Diagnose (45 min)
A distributed-training scenario (e.g., "DDP training is slower with 2 GPUs than with 1"). Possible: bad batch-size scaling; communication-bound; data-loading bottleneck.

### Part 3: Articulate (15 min)
~400 words: *"Walk what happens when 4-GPU DDP training does a forward + backward + optimizer step. Cover all-reduce, gradient sync, parameter update."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Distributed training without profiling | You don't know if you're compute-bound, comm-bound, or IO-bound |
| FSDP/ZeRO-3 when DDP would fit | Adds complexity without performance gain |
| Not registering models | You can't reproduce results or roll back |
| Ray + raw PyTorch without DDP integration | You leave Ray's parallelism on the table |
| Synchronous all-reduce on slow networks | Tail latency dominates; consider gradient compression or async |

---

## Patterns touched this phase

- `distributed-training`: OUTLINE
- `data-parallelism`: OUTLINE
- `model-parallelism`: OUTLINE
- `model-registry`: OUTLINE
- `operator-pattern` reinforced

---

→ Next: [Phase 38: Model Serving Infrastructure (KServe)](/program/arc-4/phase-38/)

---
title: "ML Lifecycle: Registry + Experiment Tracking"
description: "Phase 39 of /root Arc 5: MLflow at production depth. Model versioning, stage promotion, experiment tracking, lineage. K8s-native via Helm + Postgres + MinIO. The discipline that turns 'I trained a model' into 'I can reproduce + roll back any model in production.'."
tags: [arc-5, ml, mlflow, lifecycle]
arc: 5
phase: 39
---

> First phase of Arc 5. The ML lifecycle discipline.

[Arc 4 Phase 37](/program/arc-4/phase-37/) deployed MLflow as part of distributed training. This phase takes it to production depth: every training run tracked, every model versioned, every promotion deliberate, every model in production traceable back to its training data + hyperparameters + code SHA. The patterns are the same ones senior teams use; the K8s-native deployment (MLflow via Helm + Postgres backend + MinIO artifacts) keeps it composable with the rest of basecamp.

By phase end basecamp.s ML registry (MLflow) is the operational source of truth for every model. Promotion gates exist. Rollback is rehearsed. The next four phases (feature store, evals, vector stores, LLM serving) all consume from MLflow as a baseline.

---

## Prerequisites

> - All of Arc 4 complete; KubeRay + KServe operational
> - MLflow deployed (Phase 37) but used minimally

---

## Why this phase exists

Most ML work loses reproducibility silently. A model deployed today references hyperparameters from a notebook that no longer exists, training data from a Postgres snapshot that's been overwritten, code from a branch that got force-pushed. Six months later "what does this model do" is unanswerable. The registry discipline prevents this: every promoted model is tied to the exact inputs that produced it.

---

## The pattern-first frame

Same eight steps.

---

## 1. PROBLEM

You trained a model. You promoted it to production. Two months later: a user reports unexpected behavior. You need to know exactly what data + hyperparameters + code produced that model, what evaluation results justified promotion, and what to roll back to. Without registry discipline, you reverse-engineer from logs. With it, you read it from MLflow.

---

## 2. PRINCIPLES

### 2.1 Experiment tracking as code

Every training run logs: hyperparameters, metrics, code SHA, dataset version, environment, artifacts. Tracking is not optional; it's part of the training loop.

→ Pattern: `experiment-tracking`

**Investigate:**
- What does `mlflow.start_run()` actually capture?
- Why is logging the code SHA + dataset hash the load-bearing discipline?
- How do you handle non-deterministic training (random seeds, hardware variation)?

### 2.2 Model registry as source of truth

The registry holds versioned model artifacts plus metadata. Stages (None → Staging → Production → Archived) represent promotion gates. Aliases (`@champion`, `@challenger`) replace stage in newer MLflow.

→ Pattern: `model-registry`: **DEEP target this phase**

**Investigate:**
- Walk a model's lifecycle: train → register → Staging → eval → Production → eventually Archived.
- What's the difference between stage and alias in MLflow 2+?
- Why is "Production" a *signed* state (who promoted, when, why) and not just a label?

### 2.3 Lineage: connecting code + data + model

A promoted model must be reproducible. Lineage tracks: which Git SHA, which dataset snapshot (Iceberg time-travel from Phase 31!), which environment, which hyperparameters.

**Investigate:**
- How does Iceberg snapshot ID compose with MLflow run ID for reproducibility?
- What goes in `mlflow.log_input()` for dataset tracking?
- Why is "I can reproduce v1.4.2 of this model in 30 minutes" the senior-IC bar?

### 2.4 Promotion gates + CI

Promotion to Production should not be a click. It should be a CI workflow: eval against a held-out set, drift check vs current Production, performance benchmark, security scan if applicable.

**Investigate:**
- Design a GitHub Actions workflow for model promotion.
- What's the right held-out set? (Hint: not the validation set; a separate test set.)
- How does this integrate with Argo Workflows from Phase 33?

### 2.5 Rollback as routine

Promoting a bad model happens. The rollback should be one command (or one MLflow alias swap). Rehearse it before you need it.

**Investigate:**
- What's the SLA for model rollback in your basecamp?
- How does KServe's canary (Phase 38 Flagger) compose with MLflow stage swap?
- What gets lost when you roll back (in-flight predictions, batched results)?

### 2.6 Registry as deployable interface

Downstream systems (KServe InferenceService, batch inference jobs, fine-tune jobs) reference models by `registry://model-name@Production`. The registry is the abstraction; specific model versions are details.

**Investigate:**
- How does KServe load a model from MLflow registry?
- What happens to in-flight inference when the alias swaps?
- Why is "everything references models by alias, not version" the right pattern at scale?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Registry | **MLflow**; Vertex AI Model Registry; SageMaker; Neptune | MLflow: K8s-native, OSS (recommended). Cloud-managed: convenience, lock-in. |
| Tracking backend | Postgres + S3/MinIO; SQLite (dev only); managed | Postgres + MinIO: K8s-native, production-grade. SQLite: dev only. |
| Promotion mechanism | Stage (legacy MLflow); Alias (MLflow 2+); custom controller | Alias: modern (recommended). Custom controller: extreme cases. |

---

## 4. TOOLS (as of 2026-06)

- **MLflow 2.x**: registry + tracking
- **Postgres** (CloudNativePG from Arc 3 Phase 20): backend
- **MinIO** (Arc 4 Phase 31): artifact storage
- **`mlflow` CLI**

### Reading
- "Designing Machine Learning Systems" (Chip Huyen): Ch. 7-8
- MLflow docs: Registry + Tracking sections
- Engineering blogs from Uber Michelangelo, Spotify Hendrix, Netflix Metaflow

---

## 5. MASTERY: Production-depth ML lifecycle on basecamp

```
[ ] MLflow deployed via Flux + Helm; Postgres + MinIO backends configured
[ ] All Arc 4 training scripts log to MLflow; verify lineage
[ ] At least 5 models registered with proper aliases
[ ] Promotion CI workflow: PR triggers eval → success → automatic alias bump to Staging
[ ] Manual promotion gate from Staging → Production (with rationale logged)
[ ] Rehearse rollback: swap Production alias to previous version; verify KServe reloads
[ ] Document one model's full lineage end-to-end (code SHA + dataset snapshot + run ID)
[ ] Integrate with Iceberg time-travel: re-train a model on exactly the data at a past snapshot
[ ] Add MLflow webhook notifications: Slack message on Production promotion
[ ] Build a small dashboard showing all models in Production + their last promotion date
```

---

## 6. COMPARE: Weights & Biases or Neptune

Sign up for W&B free tier. Track one experiment in both MLflow + W&B. Compare insight, ergonomics, query model.

400-word reflection.

---

## 7. OPERATE

- 3-4 runbooks: "MLflow tracking server slow", "Model artifact missing from MinIO", "Rolling back a bad Production promotion", "Reproducing an old model"
- 1-2 ADRs (MLflow over W&B; alias-based promotion over stage)
- Weekly log

---

## 8. CONTRIBUTE

- MLflow: docs, plugins
- A blog post on a real reproducibility win or near-miss

---

## What ships from this phase

- **MLflow as production-depth source of truth** for all basecamp models
- **CI-driven promotion workflow**
- **Rehearsed rollback procedure**

---

## Validation criteria

```
[ ] MLflow operational with proper backends
[ ] 5+ registered models with aliases
[ ] Promotion CI workflow tested
[ ] Rollback rehearsed
[ ] All 10 operational depth checks
[ ] Compare reflection (400 words)
[ ] 3-4 runbooks
[ ] 1-2 ADRs
[ ] Pattern entries:
    - model-registry → DEEP
    - experiment-tracking → OUTLINE
[ ] Exit Test passed
```

---

## Exit Test

**Time: 2 hours.**

### Part 1: Build (75 min)
Configure MLflow promotion CI for a new model. PR triggers eval → success bumps alias → Production swap requires approval. Verify end-to-end.

### Part 2: Diagnose (30 min)
A registry scenario (e.g., "promoted v3 to Production but KServe is still serving v2"). Possible: alias not synced; KServe cache; artifact load failed.

### Part 3: Articulate (15 min)
~400 words: *"Walk the full reproducibility chain from a Production prediction back to the exact training inputs that produced it."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Notebook-driven training without MLflow | Future-you can't reproduce |
| Promoting models without eval gates | Bad models reach users |
| Long-running model versions without rotation | Drift accumulates silently |
| No rollback rehearsal | Real rollback under pressure fails |

---

## Patterns touched this phase

- `model-registry`: **DEEP**
- `experiment-tracking`: OUTLINE

---

→ Next: [Phase 40: Feature Stores](/program/arc-5/phase-40/)

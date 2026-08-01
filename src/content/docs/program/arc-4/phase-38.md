---
title: "Model Serving Infrastructure (KServe)"
description: "Phase 38 of /root Arc 4: KServe as the K8s-native model serving layer. InferenceService CRDs, scale-to-zero via Keda, canary deploys via Flagger. `crag` matures to complete the ML-serving substrate."
tags: [arc-4, ml, kserve, serving, inference]
arc: 4
phase: 38
---

> Eighth and final phase of Arc 4. Model serving as a control loop.

[Phase 37](/program/arc-4/phase-37/) trained models. This phase serves them. **KServe** is the K8s-native model serving layer: `InferenceService` is the CRD, KServe controllers reconcile it into the underlying Deployment + Service + Ingress + autoscaler + observability. By phase end basecamp serves models via the same operator-pattern that runs everything else: declare a CRD, the operator handles the rest.

This closes Arc 4. basecamp substrate + `forge` + `ascent` + `beacon` + `crag` are alive. The ML platform (data, training, serving) runs end-to-end. Arc 5 builds the AI tier (`prism`, `loom`, `warden`, `vantage`) on top.

---

## Prerequisites

> - [Phase 37](/program/arc-4/phase-37/) complete; KubeRay operational
> - At least one model trained + registered in MLflow

---

## Why this phase exists

Serving is where ML meets reality. The model that worked in your notebook needs to: respond in milliseconds, scale with traffic, version cleanly, deploy safely (canary), observe itself. KServe handles all of this via the standard K8s-native pattern. Roll-your-own FastAPI works until traffic grows; then you reinvent KServe poorly.

---

## The pattern-first frame

Same eight steps.

---

## 1. PROBLEM

You have a registered model in MLflow. You want it deployed: behind an HTTP endpoint, scaling with traffic, version-aware (current + canary), observable (latency, error rate, throughput), failure-tolerant (retries, fallback). And you want to do this declaratively, K8s-native.

That's the model serving problem. KServe is the K8s-native answer. BentoML, Triton, Seldon Core are alternatives.

---

## 2. PRINCIPLES

### 2.1 Model serving as a control loop

A KServe `InferenceService` CRD declares what model + which framework + scaling profile + canary split. The KServe controller reconciles it into the deployed state.

→ Pattern: `model-serving`: OUTLINE this phase (deepens through Arc 5 LLM serving)

**Investigate:**
- Walk an `InferenceService` CRD: declare → KServe creates predictor + transformer + explainer pods → Service + Ingress → autoscaler.
- Why is "serving as a control loop" structurally similar to "GitOps for deployments"?
- What's `Predictor` vs `Transformer` vs `Explainer` in KServe's architecture?

### 2.2 Inference shapes: sync, batch, streaming

Different serving patterns: synchronous (low latency, per-request), batch (offline, throughput-optimized), streaming (continuous, async).

→ Pattern: `inference-shapes`

**Investigate:**
- Walk sync inference: HTTP POST → model predict → response.
- When does batch inference (offline) fit instead of online?
- What's streaming inference, and when is it the right shape (real-time feature transformation, video)?

### 2.3 Scale-to-zero + Keda integration

KServe + Keda: when traffic is zero, replicas scale to zero. When a request arrives, Keda scales up. Cost-efficient for sporadic workloads.

→ Pattern: `serverless-inference`

**Investigate:**
- Walk scale-from-zero: request arrives → KServe waits → Keda spins up replica → request served.
- What's the cold-start cost, and when is it acceptable?
- When does scale-to-zero NOT fit? (Hint: latency-critical, always-warm requirements.)

### 2.4 Canary deploys for models

Models change frequently. Canary deploys (5% traffic to v2, 95% to v1) let you validate new versions in production before full rollout. Flagger (K8s-native) automates this.

→ Pattern: `canary-deploys` (general infrastructure pattern, applied to models)

**Investigate:**
- Walk a Flagger canary: deploy v2 → 5% traffic → measure SLI → success → increase → full rollout.
- What's an automatic rollback trigger?
- Why does model canary deploy differ from regular service canary? (Hint: model output distributions matter, not just error rates.)

### 2.5 Observability for ML services

Beyond RED + USE: prediction distribution, feature drift, model staleness, prediction-latency percentiles.

**Investigate:**
- What's prediction drift, and how do you detect it without ground truth?
- How does KServe integrate with the OTel stack (Phase 28)?
- When do you alert on prediction-distribution shifts?

### 2.6 Framework support

KServe supports PyTorch (TorchServe), TensorFlow, sklearn, XGBoost, LightGBM, HuggingFace, ONNX, MLflow models, custom. The runtime is pluggable via `ServingRuntime` CRDs.

**Investigate:**
- What's the difference between "model server" (Triton, TorchServe) and "serving framework" (KServe)?
- When do you use Triton's KServe runtime for performance?
- How does KServe support custom Python serving code?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Serving framework | **KServe**; BentoML; Seldon Core; raw FastAPI; Triton Inference Server | KServe: K8s-native CRDs (recommended). BentoML: model-packaging-first. Seldon: similar to KServe. FastAPI: simplest, no autoscale. Triton: NVIDIA-optimized. |
| Autoscaler | **Keda (scale-to-zero)**; HPA (Horizontal Pod Autoscaler); Karpenter (node-level) | Keda: event-driven (recommended for sporadic inference). HPA: metric-driven. Karpenter: complementary, node level. |
| Canary | **Flagger**; Argo Rollouts; manual | Flagger: K8s-native, automated. Argo Rollouts: more controls. Manual: error-prone. |
| Model package format | MLflow model; ONNX; SavedModel (TF); TorchScript | MLflow: portable. ONNX: cross-framework. SavedModel/TorchScript: framework-specific. |

---

## 4. TOOLS (as of 2026-06)

### K8s-native stack
- **KServe**: `InferenceService` CRD (formerly KFServing)
- **Keda**: scale-to-zero for InferenceServices (Phase 20 deployed)
- **Flagger**: canary deploys (CNCF graduated)
- **Triton Inference Server**: as a KServe runtime for perf-critical workloads
- **MLflow**: model source (Phase 37 deployed)

### Reading
- KServe docs
- Triton Inference Server docs
- "Designing Machine Learning Systems" (Chip Huyen): Ch. 7-8
- Flagger docs

---

## 5. MASTERY: Model serving alive on basecamp

```
[ ] KServe installed via Flux + Helm
[ ] Deploy an InferenceService for an MLflow-registered model from Phase 37
[ ] Test inference via curl; verify response shape
[ ] Configure Keda ScaledObject for scale-to-zero on the InferenceService
[ ] Verify cold-start behavior: idle → request → spin-up → response
[ ] Install Flagger; configure a canary policy for the InferenceService
[ ] Deploy a v2 of the model; observe canary rollout
[ ] Add Prometheus metrics: per-model latency, throughput, error rate
[ ] Add a drift-detection job (Spark or simple script) checking prediction distribution
[ ] Integrate with Cilium NetworkPolicy: only specific callers can hit the InferenceService
[ ] Add Triton as a custom runtime for one performance-critical model
```

---

## 6. COMPARE: BentoML or Triton standalone

Pick one:
- **BentoML**: package one model with BentoML; compare against KServe deployment
- **Triton standalone**: deploy a model with raw Triton Inference Server (no KServe); compare

400-word reflection.

---

## 7. OPERATE

- 4-5 runbooks: InferenceService not ready, scale-to-zero failing, canary rollback triggered, prediction drift alert, framework runtime not loading model
- 2-3 ADRs (KServe over Seldon; MLflow models over native PyTorch packaging; Flagger for canary)
- Weekly log

---

## 8. CONTRIBUTE

- KServe (CNCF): docs, runtimes
- Flagger (CNCF): canary policies
- MLflow: KServe integration

---

## What ships from this phase

- **ML-serving substrate complete**: KServe + Keda + Flagger + MLflow alive
- **At least one model serving production-shaped traffic** with scale-to-zero + canary
- **Serving runbooks**
- **Arc 4 portfolio complete**: ready for Arc 4 Final Exam

---

## Validation criteria

```
[ ] KServe operational with at least one InferenceService running
[ ] Keda scale-to-zero working
[ ] Flagger canary tested
[ ] Drift detection in place
[ ] All 11 operational depth checks
[ ] Compare reflection (400 words)
[ ] 4-5 serving runbooks
[ ] 2-3 ADRs
[ ] Pattern entries:
    - model-serving → OUTLINE
    - inference-shapes → OUTLINE
    - serverless-inference → OUTLINE
    - canary-deploys → OUTLINE (general infra)
    - operator-pattern reinforced
[ ] Exit Test passed
[ ] Arc 4 Final Exam prep can begin
```

---

## Exit Test

**Time: 2.5 hours.**

### Part 1: Build (90 min)
Deploy a new InferenceService for a different model from MLflow registry. Configure scale-to-zero. Verify cold-start path works.

### Part 2: Diagnose (45 min)
A serving scenario (e.g., "InferenceService stuck Ready=False after deploy"). Possible: model artifact missing; framework runtime mismatch; resource limits; storage backend not accessible.

### Part 3: Articulate (15 min)
~400 words: *"Defend KServe over a hand-rolled FastAPI + Kubernetes Deployment for basecamp's model serving. Cite the K8s-native ecosystem composition and the control-loop pattern."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Raw FastAPI for production model serving | You reinvent KServe poorly; missing autoscale, canary, observability |
| Scale-to-zero on latency-critical workloads | Cold-start is unacceptable for some SLOs |
| Canary without drift detection | Wrong-model gets promoted because traffic-error-rate looks fine |
| Custom Python serving code instead of standard runtimes | You miss Triton/TorchServe perf optimizations |
| No NetworkPolicy on serving | Anyone in the cluster can hit your endpoint |

---

## Patterns touched this phase

- `model-serving`: OUTLINE
- `inference-shapes`: OUTLINE
- `serverless-inference`: OUTLINE
- `canary-deploys`: OUTLINE
- `operator-pattern` reinforced

---

→ Next: [Arc 4 Final Exam](/program/arc-4/final-exam/)

---
title: "Fine-tuning + PEFT"
description: "Phase 45 of /root Arc 5: parameter-efficient fine-tuning. LoRA, QLoRA, instruction tuning, DPO basics. K8s-native: KubeRay-distributed fine-tune jobs tracked in MLflow.."
tags: [arc-5, ai, fine-tuning, lora, qlora, peft]
arc: 5
phase: 45
---

> Seventh phase of Arc 5. Customizing models without breaking the bank.

Full fine-tuning of a large model requires datacenter compute. **Parameter-Efficient Fine-Tuning** (PEFT), LoRA and QLoRA, updates only ~1% of weights via low-rank adapters, making fine-tuning practical on consumer GPUs. By phase end you've fine-tuned at least one open-weights model on a small task, tracked the run in MLflow, served the fine-tuned variant alongside the base via KServe.

This phase makes you operationally fluent at fine-tuning. The patterns transfer to instruction tuning, DPO (Direct Preference Optimization), and the next-generation alignment techniques.

---

## Prerequisites

> - [Phase 44](/program/arc-5/phase-44/) complete; inference optimization fluency
> - GPU available (24GB ideal; 16GB workable for QLoRA on smaller models)

---

## Why this phase exists

In 2026 fine-tuning is the practical adaptation mechanism for production LLM applications. Few teams pre-train; many fine-tune. The patterns (LoRA, instruction tuning, DPO) are dominant. This phase installs them at production depth.

---

## The pattern-first frame

Same eight steps.

---

## 1. PROBLEM

You have an open-weights base model. You want it to behave differently: answer in your company's voice, follow a specific task format, refuse certain categories, adopt domain expertise. Fine-tuning adjusts the model. Full fine-tuning costs too much; PEFT makes it tractable.

---

## 2. PRINCIPLES

### 2.1 LoRA: low-rank adaptation

Instead of updating all weights, train small low-rank matrices that "shift" the original weights. Typical: ~1% of total parameters. Quality usually close to full fine-tune.

→ Pattern: `fine-tuning-strategies`: OUTLINE this phase

**Investigate:**
- Walk LoRA math: W + ΔW where ΔW = A × B, A and B low-rank.
- Why does LoRA work? (Hint: most useful adaptations are low-rank.)
- What's the cost/benefit of higher rank?

### 2.2 QLoRA: quantized LoRA

Combine quantization (4-bit base) with LoRA. The base model fits on a small GPU; LoRA adapter is trained. The unlock that enabled fine-tuning Llama-70B on a single 24GB GPU.

**Investigate:**
- Walk QLoRA: base model in 4-bit + LoRA adapters in FP16, double-quant for memory.
- Why is gradient computation through 4-bit base still feasible?
- When does QLoRA degrade quality vs LoRA on FP16 base?

### 2.3 Instruction tuning

Fine-tune on (instruction, response) pairs. Teaches the model to follow instructions specifically. The dataset shape (format, diversity, quality) dominates outcome.

**Investigate:**
- Walk instruction tuning vs raw next-token prediction.
- Why does dataset quality matter more than dataset size for instruction tuning?
- What's the role of supervision rate (fully-supervised vs RLHF)?

### 2.4 DPO: Direct Preference Optimization

Train on (prompt, chosen_response, rejected_response) tuples to align toward preferred behavior. Simpler than RLHF; comparable results in many cases.

**Investigate:**
- Walk DPO loss: encourage chosen > rejected via likelihood ratio.
- Why is DPO simpler than RLHF? (Hint: no reward model + PPO needed.)
- When does RLHF beat DPO?

### 2.5 Dataset preparation as the actual work

The model isn't the bottleneck; the data is. Data quality, format consistency, deduplication, contamination check (test set leakage), distribution shaping.

**Investigate:**
- What's a contamination check, and why does it matter?
- How do you curate a diverse instruction dataset?
- What's data deduplication's role in dataset prep?

### 2.6 K8s-native fine-tune workflow

Fine-tune as a KubeRay `RayJob`: declare the job → operator runs it → MLflow tracks → registered model lands in registry. Composes with Phase 37's distributed training stack.

→ Pattern: `operator-pattern` reinforced

**Investigate:**
- Walk a fine-tune RayJob CRD: container image + dataset reference + LoRA config.
- How does the fine-tuned adapter end up in MLflow?
- How does KServe load the base model + LoRA adapter for serving?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Method | LoRA; QLoRA; full fine-tune; prompt tuning | LoRA: standard. QLoRA: when GPU memory is tight. Full FT: when you have the compute. Prompt tuning: very small task. |
| Library | **PEFT (HuggingFace)**; raw PyTorch; unsloth | PEFT: standard (recommended). Unsloth: faster, less flexible. |
| Alignment technique | SFT (instruction tuning); DPO; RLHF | SFT: simplest. DPO: middle. RLHF: most powerful, complex. |
| Dataset source | Public (HuggingFace Hub); synthetic; private | Public: convenient, generic. Synthetic: targeted, risk of artifacts. Private: best quality, hardest to obtain. |

---

## 4. TOOLS (as of 2026-06)

- **PEFT** (HuggingFace): LoRA + QLoRA library
- **TRL** (HuggingFace): SFT + DPO + RLHF trainers
- **bitsandbytes**: 4-bit quantization
- **Unsloth**: speed-optimized LoRA training
- **KubeRay** for distribution
- **MLflow** for tracking

### Reading
- LoRA paper (Hu et al.)
- QLoRA paper (Dettmers et al.)
- DPO paper (Rafailov et al.)
- HuggingFace PEFT + TRL docs

---

## 5. MASTERY: Fine-tune via KubeRay

```
[ ] Pick a base model (Llama 3.1 8B, Mistral, or similar open weights)
[ ] Pick a fine-tune task (your chronicle style mimicry, code-completion, classification)
[ ] Curate or compose dataset (~1K-10K examples)
[ ] Contamination check against any benchmark you care about
[ ] LoRA fine-tune locally (single GPU); verify reasonable loss curve
[ ] Switch to KubeRay RayJob for distributed fine-tune (multi-GPU)
[ ] Track in MLflow: hyperparameters, loss curves, adapter artifacts
[ ] Eval the fine-tuned model: held-out test set + qualitative inspection
[ ] Register fine-tuned adapter in MLflow registry
[ ] Deploy via KServe: base model + LoRA adapter via vLLM LoRA support
[ ] Optional: DPO fine-tune on a small preference dataset
```

---

## 6. COMPARE: Unsloth

Pick one fine-tune; run it via Unsloth's optimized path. Compare training time + quality.

400-word reflection.

---

## 7. OPERATE

- 2-3 runbooks: fine-tune OOM, LoRA serving failure (adapter not loading), eval regression
- 1-2 ADRs (LoRA over QLoRA when fits; PEFT lib over raw PyTorch)
- Weekly log

---

## 8. CONTRIBUTE

- PEFT / TRL: docs, edge cases
- A public dataset + LoRA fine-tune on HuggingFace Hub

---

## What ships from this phase

- **At least one fine-tuned model** registered + served on basecamp
- **Fine-tune RayJob template** in basecamp/ml-infra-helpers
- **Fine-tune runbooks**

---

## Validation criteria

```
[ ] LoRA fine-tune working via KubeRay RayJob
[ ] Fine-tuned model registered + served via KServe
[ ] Quality eval shows targeted behavior change
[ ] All 10 operational depth checks
[ ] Compare reflection (400 words)
[ ] 2-3 runbooks
[ ] 1-2 ADRs
[ ] Pattern entries:
    - fine-tuning-strategies → OUTLINE
[ ] Exit Test passed
```

---

## Exit Test

**Time: 2.5 hours.**

### Part 1: Build (90 min)
Run a small LoRA fine-tune via KubeRay. Register adapter. Serve via KServe + vLLM LoRA support. Verify behavior change.

### Part 2: Articulate (60 min)
~1000 words: *"Walk a LoRA fine-tune end-to-end. Math (low-rank update), engineering (KubeRay job, MLflow tracking), deployment (LoRA adapter loading at serving). Cite patterns."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Fine-tuning without eval | Can't tell if you helped or hurt |
| Skipping contamination check | Benchmark scores inflated, real perf worse |
| Using bad/unfiltered data | Worse model than baseline |
| Full fine-tune when LoRA suffices | 100× the compute for marginal gain |

---

## Patterns touched this phase

- `fine-tuning-strategies`: OUTLINE
- `operator-pattern` reinforced

---

→ Next: [Phase 46: LLM Gateway: ship prism](/program/arc-5/phase-46/)

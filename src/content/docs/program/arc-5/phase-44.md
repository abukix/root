---
title: "Inference Optimization"
description: "Phase 44 of /root Arc 5: quantization (INT8, INT4), distillation, speculative decoding, batch size tuning, KV cache optimization. Squeeze 2-5× more throughput from the same GPU.."
tags: [arc-5, ai, llm, optimization, quantization]
arc: 5
phase: 44
---

> Sixth phase of Arc 5. Squeezing every drop from the GPU.

[Phase 43](/program/arc-5/phase-43/) deployed vLLM. This phase makes it faster + cheaper. Quantization, distillation, speculative decoding, batch tuning: the techniques that let you serve 2-5× more traffic on the same hardware. By phase end basecamp serves quantized + speculatively-decoded models with measured quality + throughput improvements.

These optimizations aren't optional at scale. They're the difference between serving 100 RPS and 500 RPS on the same GPU. Frontier AI labs (Anthropic, OpenAI, and others) all apply them aggressively. The patterns survive specific implementations.

---

## Prerequisites

> - [Phase 43](/program/arc-5/phase-43/) complete; vLLM operational

---

## Why this phase exists

LLM serving is GPU-bound. Every percent of GPU utilization is real money. Optimization techniques compound: quantization gives 2× → batch-size tuning gives 1.3× → speculative decoding gives 1.5× → total 4× from the same hardware. Senior ML platform engineers know these techniques and when each fits.

---

## The pattern-first frame

Same eight steps.

---

## 1. PROBLEM

You have an LLM serving at some throughput. You want more throughput, lower latency, or both, without changing hardware. The techniques are well-known; the engineering is picking the right ones for your workload + measuring the quality trade-offs.

---

## 2. PRINCIPLES

### 2.1 Quantization

Reduce numerical precision: FP16 → INT8 → INT4. Smaller model = less GPU memory = larger batches = higher throughput. Quality degrades at extreme quantization but is often acceptable.

→ Pattern: `inference-optimization`: OUTLINE this phase

**Investigate:**
- Walk an INT8 quantization scheme: what's the calibration step?
- Why does AWQ preserve quality better than naive INT4?
- When does INT4 surprise you (small quality drop) vs disappoint (large drop)?

### 2.2 Distillation

Train a smaller "student" model to mimic a larger "teacher." Smaller student = faster inference + lower cost. Common for fine-tuning specific tasks where you don't need the teacher's full generality.

**Investigate:**
- Walk knowledge distillation: teacher outputs soft labels, student trained against them.
- When does distillation work well (narrow tasks) vs poorly (general capability)?
- What's the relationship between distillation and fine-tuning (Phase 45 deepens)?

### 2.3 Speculative decoding

A small "draft" model proposes tokens; the large "verifier" model checks them in parallel. Net effect: latency drops because many tokens accept per verification step.

**Investigate:**
- Walk speculative decoding: draft model proposes 5 tokens → verifier model evaluates all 5 in one forward pass → accepts some.
- Why does it work? (Hint: language is predictable; draft model is usually right.)
- When does it fail (low draft-model acceptance rate)?

### 2.4 Batch size tuning

Find the batch size that maximizes GPU utilization without degrading latency unacceptably. Workload-dependent.

**Investigate:**
- For a chatbot: what's the right max-batched-tokens?
- For a batch summarizer: what's the right max-num-seqs?
- What's the right way to measure both?

### 2.5 KV cache optimization

KV cache dominates LLM memory at long contexts. Optimizations: prefix sharing (multi-tenant prompts), KV cache offload (RAM/disk for cold contexts), grouped-query attention (smaller cache).

**Investigate:**
- How does prefix sharing work? When does it earn its weight?
- What's grouped-query attention (GQA), and which 2026 models use it?
- When does KV cache offload to RAM make sense?

### 2.6 The optimization stack composes

Quantization + speculative decoding + batch tuning + KV optimization compose multiplicatively. The combined optimization stack is 2-5× over baseline FP16 vanilla.

**Investigate:**
- Walk the order to apply optimizations.
- Which ones have quality risk vs which are quality-neutral?
- How do you A/B test optimization changes safely?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Quantization | AWQ (INT4); GPTQ (INT4); FP8 (newer); GGUF (CPU) | AWQ: best INT4 quality. GPTQ: similar. FP8: newer hardware. GGUF: CPU. |
| Distillation | Custom train; off-the-shelf smaller model | Custom: targeted, $$. Off-shelf: cheap, generic. |
| Speculative decoding | Native vLLM; n-gram speculation; medusa | Native: built-in. n-gram: cheap, lower acceptance. Medusa: research-leaning. |
| Optimization budget | All optimizations; selective; none | All: complexity. Selective: pragmatic. None: leaving perf on the table. |

---

## 4. TOOLS (as of 2026-06)

- **AWQ**, **GPTQ** quantization tools
- **vLLM speculative decoding** built-in
- **Lit-GPT** or **TRT-LLM** for advanced optimizations
- **DeepSpeed-Inference** for some techniques

### Reading
- AWQ paper (Lin et al.)
- "Mixed Precision Inference for Transformers" papers
- vLLM optimization docs
- "Speculative Decoding" paper (Leviathan et al.)

---

## 5. MASTERY: Optimized inference on basecamp

```
[ ] Quantize Phase 43's model to INT4 via AWQ; serve via KServe
[ ] Benchmark quality (perplexity + downstream task) before/after
[ ] Benchmark throughput before/after
[ ] Enable speculative decoding in vLLM with a small draft model
[ ] Measure speculative acceptance rate; tune draft model
[ ] Tune max-batched-tokens, max-num-seqs for your workload
[ ] Profile KV cache memory; observe prefix-cache reuse
[ ] Distill one specific behavior into a smaller model (optional, time-permitting)
[ ] A/B test optimization changes via Flagger (Phase 38): observe quality stability
[ ] Document optimization stack as ADR
```

---

## 6. COMPARE: TensorRT-LLM or DeepSpeed-Inference

Pick one alternative optimization stack. Apply to one model. Compare results.

400-word reflection.

---

## 7. OPERATE

- 2-3 runbooks: quantization quality regression, speculative decoding low acceptance, batch saturation
- 1-2 ADRs (AWQ as quantization default; speculative decoding policy)
- Weekly log

---

## 8. CONTRIBUTE

- vLLM optimization features
- AWQ / GPTQ / autoawq projects
- A blog post on a real optimization win

---

## What ships from this phase

- **Optimized LLM serving** on basecamp (quantized + speculative + tuned)
- **Optimization runbooks**

---

## Validation criteria

```
[ ] Quantized model (INT4 via AWQ) serving via KServe
[ ] Speculative decoding enabled with measured acceptance rate
[ ] Batch tuning documented
[ ] Quality + throughput before/after benchmarks
[ ] All 9 operational depth checks
[ ] Compare reflection (400 words)
[ ] 2-3 runbooks
[ ] 1-2 ADRs
[ ] Pattern entries:
    - inference-optimization → OUTLINE
[ ] Exit Test passed
```

---

## Exit Test

**Time: 2 hours.**

### Part 1: Build (75 min)
Apply quantization + speculative decoding to a new model. Benchmark both throughput and quality.

### Part 2: Articulate (45 min)
~800 words: *"Walk the inference optimization stack you applied. Cite each technique's quality trade-off and throughput gain. Explain how you'd present these trade-offs to a non-technical stakeholder."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Quantizing without quality measurement | Silently degraded model |
| Applying all optimizations at once | Can't attribute gains or regressions |
| Tuning batch size on synthetic workload | Production workload has different distribution |
| Ignoring KV cache analysis at long context | Major perf left on table |

---

## Patterns touched this phase

- `inference-optimization`: OUTLINE

---

→ Next: [Phase 45: Fine-tuning + PEFT](/program/arc-5/phase-45/)

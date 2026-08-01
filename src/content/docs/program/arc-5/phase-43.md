---
title: "LLM Serving Deep"
description: "Phase 43 of /root Arc 5: LLM serving via vLLM as a KServe ServingRuntime. PagedAttention, continuous batching, KV cache management. llama.cpp for CPU/edge. K8s-native throughout.."
tags: [arc-5, ai, llm, vllm, kserve]
arc: 5
phase: 43
---

> Fifth phase of Arc 5. LLM serving from primitives.

[Phase 38](/program/arc-4/phase-38/) deployed KServe for classical model serving. This phase extends KServe to LLMs: **vLLM** as the canonical OSS LLM serving runtime, deployed as a KServe `ServingRuntime`. PagedAttention manages KV cache efficiently. Continuous batching keeps GPU utilization high. By phase end basecamp serves an open-weights LLM at production-shaped throughput, K8s-native.

This phase is also where you stop treating LLMs as "API calls" and start treating them as *infrastructure you operate*. Cold-start, warm-pool, batch-size, KV-cache hit-rate: these are operational concerns. The patterns transfer to any future LLM runtime.

---

## Prerequisites

> - [Phase 42](/program/arc-5/phase-42/) complete; vector stores + RAG operational
> - GPU available (RTX 4060 / 4070 minimum for small-model serving; 3090/4090 for 7-13B models)

---

## Why this phase exists

Most engineers treat LLMs as "I call an API." That works at small scale; at production scale, operational concerns dominate: batching policy, KV cache, autoscaling, cold-start. Senior ML platform engineers operate LLMs the same way they operate any other infrastructure: with metrics, SLOs, runbooks. This phase installs that operational depth.

---

## The pattern-first frame

Same eight steps.

---

## 1. PROBLEM

You want to serve an LLM (open-weights, run on your own GPU). Latency must be low for interactive use; throughput must be high to maximize GPU utilization; the same GPU must serve multiple concurrent requests efficiently; the model must reload without downtime for upgrades.

That's the LLM serving problem. vLLM solved most of it via PagedAttention + continuous batching. TGI (HuggingFace), TensorRT-LLM (NVIDIA), Triton are alternatives. KServe makes any of them K8s-native via `ServingRuntime` CRDs.

---

## 2. PRINCIPLES

### 2.1 LLM serving as a control loop

KServe's `InferenceService` CRD + a `ServingRuntime` (vLLM, TGI, Triton) is the K8s-native LLM serving shape. Same operator pattern as Phase 38 classical serving.

→ Pattern: `llm-serving`: **DEEP target this phase**

**Investigate:**
- Walk a `ServingRuntime` for vLLM: ConfigMap with vLLM args, vLLM container image, predictor pod template.
- How does an `InferenceService` reference a `ServingRuntime`?
- What's the difference between vLLM in KServe vs vLLM standalone?

### 2.2 PagedAttention + KV cache

PagedAttention manages KV cache in fixed-size blocks (like OS virtual memory pages). Enables efficient memory use, supports continuous batching, allows prefix sharing.

**Investigate:**
- Walk the KV cache layout in vanilla attention vs PagedAttention.
- What's "prefix caching," and when does it save real cycles?
- Why is KV cache the dominant memory consumer at long context lengths?

### 2.3 Continuous batching

Instead of static batches (wait for batch to fill), continuous batching processes new requests as soon as a slot frees. Higher GPU utilization, lower tail latency.

**Investigate:**
- Walk continuous batching: request arrives mid-batch → joins the batch at the next iteration.
- Why is static batching wasteful for variable-length outputs?
- What's the trade-off (higher fairness, slightly worse worst-case latency)?

### 2.4 Quantization for serving (deepens Phase 44)

Quantization reduces model precision (FP16 → INT8 → INT4) to fit larger models on smaller GPUs or speed up smaller models. AWQ, GPTQ, GGUF are common formats.

**Investigate:**
- Walk an FP16 → INT8 quantization: what's quantized, what's not?
- Why does INT4 sometimes preserve quality surprisingly well?
- When does a quantized model fail (long-tail tokens, structured outputs)?

### 2.5 CPU/edge serving via llama.cpp

vLLM requires GPU. llama.cpp serves quantized models on CPU (and Apple Silicon via Metal). Useful for development, edge, low-volume serving.

**Investigate:**
- When does llama.cpp on Apple Silicon beat a small cloud GPU for small models?
- What's GGUF, and why is it the llama.cpp-native format?
- When is CPU serving acceptable vs unacceptable?

### 2.6 Throughput vs latency trade-offs

LLM serving has a steep throughput-latency curve. Larger batches = higher throughput but worse latency for individual requests. Picking the right point matters.

**Investigate:**
- For an interactive chatbot, what's the latency target?
- For a batch document processor, what's the throughput target?
- How does max-batched-tokens vs max-num-seqs configure the trade-off?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Serving runtime | **vLLM (KServe ServingRuntime)**; TGI; Triton; LMDeploy | vLLM: OSS leader, K8s-native via KServe. TGI: HuggingFace. Triton: NVIDIA-optimized. |
| CPU/edge | llama.cpp; Ollama (llama.cpp wrapper); raw transformers | llama.cpp: production-ready CPU/Apple Silicon. Ollama: dev UX. Raw: slow. |
| Quantization format | AWQ; GPTQ; GGUF (CPU); BNB (training) | AWQ: best quality at INT4. GPTQ: similar. GGUF: llama.cpp. BNB: training-time. |
| Model source | HuggingFace Hub; MLflow Registry; OCI artifacts | HF: ubiquitous. MLflow: lifecycle integration. OCI: K8s-native distribution. |

---

## 4. TOOLS (as of 2026-06)

- **vLLM 0.6+**: the LLM serving runtime
- **KServe ServingRuntimes** (built-in vLLM support)
- **llama.cpp**: CPU/edge serving
- **HuggingFace Transformers**: model loading reference

### Reading
- The vLLM paper (Kwon et al.): PagedAttention
- vLLM docs: serving + production tips
- KServe docs: ServingRuntime + InferenceService for LLMs
- "Efficiently Scaling Transformer Inference" (Pope et al.): Google's serving paper

---

## 5. MASTERY: vLLM on KServe

```
[ ] Deploy vLLM as a KServe ServingRuntime on basecamp GPU node
[ ] Deploy an InferenceService for a 7B model (e.g., Llama 3.1 8B or equivalent open model)
[ ] Verify inference via curl; measure p50, p99 latency at varying load
[ ] Profile GPU utilization; verify continuous batching keeps it high
[ ] Configure max-batched-tokens, max-num-seqs deliberately
[ ] Deploy a quantized (AWQ INT4) version; benchmark quality vs throughput
[ ] Set up llama.cpp on a CPU node for a smaller model
[ ] Configure scale-to-zero via Keda for the LLM service
[ ] Add Prometheus metrics: tokens per second, KV cache utilization, queue depth
[ ] Add OTel traces showing prefill + decode phases
```

---

## 6. COMPARE: TGI or Triton

Deploy the same model with TGI (HuggingFace) or Triton (TensorRT-LLM) as a parallel KServe runtime. Benchmark.

400-word reflection.

---

## 7. OPERATE

- 3-4 runbooks: GPU OOM during serving, vLLM cold-start slow, batch saturation, model load failure
- 1-2 ADRs (vLLM over TGI; AWQ over GPTQ for production)
- Weekly log

---

## 8. CONTRIBUTE

- vLLM: docs, examples
- KServe (CNCF): LLM-specific runtime improvements
- A blog post on real production-shaped LLM serving

---

## What ships from this phase

- **vLLM serving an open-weights LLM** on basecamp GPU
- **llama.cpp serving** for CPU/edge cases
- **LLM serving runbooks**

---

## Validation criteria

```
[ ] vLLM operational via KServe ServingRuntime
[ ] At least one open-weights LLM served at production-shaped throughput
[ ] Scale-to-zero working via Keda
[ ] Continuous batching verified
[ ] Quantized variant deployed + benchmarked
[ ] All 10 operational depth checks
[ ] Compare reflection (400 words)
[ ] 3-4 runbooks
[ ] 1-2 ADRs
[ ] Pattern entries:
    - llm-serving → DEEP
    - operator-pattern reinforced
[ ] Exit Test passed
```

---

## Exit Test

**Time: 3 hours.**

### Part 1: Build (90 min)
Deploy a new LLM via vLLM + KServe. Configure batching deliberately. Benchmark throughput + latency. Set up Keda scale-to-zero.

### Part 2: Diagnose (60 min)
A serving scenario: "vLLM throughput is 1/10th expected." Possible: small batch ceiling; KV cache thrashing; quantization mismatch; GPU underutilized.

### Part 3: Articulate (30 min)
~600 words: *"Walk a single LLM completion from KServe receiving the HTTP request to tokens streaming back. Cover scheduling, prefill, decode, KV cache management, batching."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Raw FastAPI wrapper around transformers | You reinvent vLLM poorly |
| Static batching for variable-length outputs | Wastes GPU |
| Ignoring KV cache hit rate | Major perf left on the table |
| Quantizing without quality eval | Silently degraded model |

---

## Patterns touched this phase

- `llm-serving`: **DEEP**
- `operator-pattern` reinforced

---

→ Next: [Phase 44: Inference Optimization](/program/arc-5/phase-44/)

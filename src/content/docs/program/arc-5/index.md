---
title: "AI Infrastructure"
description: "Arc 5 of /root: ~12 phases that complete the platform. ML lifecycle, feature stores, evals, vector stores, LLM serving (vLLM via KServe), inference optimization, fine-tuning (LoRA/QLoRA), LLM gateway, prompt engineering, agent runtime + MCP, AI security + observability, AIOps. `prism` + `loom` + `warden` + `vantage` alive. Ships prism and vantage MVP publicly. Capstone: vantage + Pattern Paper. Exit ramp: ML Platform / AI Infrastructure."
tags: [program, arc-5, ai, llm, agents, capstone]
arc: 5
---

> Arc 5 of /root. The last year. The platform meets the moment.
> ~12 phases that complete the AI tier and ship the capstone.
> Exit ramp: **ML Platform / AI Infrastructure**

Years 1-4 built the engineer, the substrate, the platform, the data tier, and the ML foundations. Arc 5 stands the AI tier on top: vector stores, LLM serving via KServe, fine-tuning workflows, an LLM gateway that mirrors the production-grade pattern frontier labs build internally, agent runtimes with MCP, AI security + observability, AIOps that operate the platform itself. The capstone is vantage MVP launched publicly plus the Pattern Paper, the synthesis writing that distills 5 years into prose a hiring manager reads in 20 minutes.

By end of Arc 5 a reviewer landing on the program's public artifacts (basecamp + 9 OSS projects + vantage MVP + Pattern Paper + ~250 blog posts) sees a coherent multi-tier AI platform built by an engineer who understands how the layers fit. That's the senior-IC pitch.

---

## What you'll know at the end of Arc 5

- **ML lifecycle at production depth**: MLflow registry + experiment tracking; model lineage; stage promotion; CI-tested model code
- **Feature stores**: Feast at depth, train/serve parity verified continuously, point-in-time correctness
- **ML evaluation + monitoring**: offline + online evals, drift detection, LLM-as-judge for open-ended tasks
- **Vector search + RAG**: pgvector + Milvus, embedding pipelines, hybrid search, retrieval evals
- **LLM serving deep**: vLLM via KServe, PagedAttention, continuous batching, KV cache
- **Inference optimization**: quantization (INT8, INT4), distillation, speculative decoding, batch tuning
- **Fine-tuning + PEFT**: LoRA, QLoRA, instruction tuning, DPO; production-grade fine-tune workflows
- **LLM gateway**: routing + caching + observability + fallback; `prism` shipped publicly
- **Prompt engineering as infrastructure**: versioned prompts, structured outputs (function calling, JSON schema), prompt evals
- **Agent runtime + MCP**: LangGraph-style agent loops, MCP servers exposing platform tools, tool-use safety
- **AI security + observability**: prompt injection defense, capability allowlisting, AI-specific telemetry
- **AIOps**: agents that operate basecamp, triaging incidents against the `chronicle` corpus

You'll be operating an end-to-end AI platform K8s-native end to end, mirroring at small scale what frontier-lab AI platforms (Anthropic, OpenAI, and others) do at hyperscale.

---

## Phase map

| Phase | Title | Weeks | Hours | K8s-native components | Capstone output |
|---|---|---|---|---|---|
| [39](/program/arc-5/phase-39/) | ML Lifecycle: Registry + Tracking | 5-7 | 50-70 | MLflow operator / Helm; Postgres + MinIO backends | ML infra deepens |
| [40](/program/arc-5/phase-40/) | Feature Stores | 5-7 | 50-70 | Feast deployed; pgvector + Redis online | ML infra deepens |
| [41](/program/arc-5/phase-41/) | ML Evaluation + Monitoring | 5-7 | 50-70 | Evidently / Arize OSS; Argo CronWorkflows | ML infra complete |
| [42](/program/arc-5/phase-42/) | Vector Stores + Embeddings + RAG | 6-8 | 60-80 | pgvector on CloudNativePG; **Milvus Operator** | **`prism` prep** |
| [43](/program/arc-5/phase-43/) | LLM Serving Deep | 6-8 | 60-80 | vLLM as KServe ServingRuntime; llama.cpp | `prism` deepens |
| [44](/program/arc-5/phase-44/) | Inference Optimization | 5-7 | 50-70 | Same KServe runtimes; quantized models in MLflow | `prism` deepens |
| [45](/program/arc-5/phase-45/) | Fine-tuning + PEFT | 6-8 | 60-80 | KubeRay for distributed fine-tune; MLflow tracking | `prism` deepens |
| [46](/program/arc-5/phase-46/) | LLM Gateway: ship `prism` | 7-9 | 70-90 | Custom Go service deployed via Flux; Cilium routing | **`prism` shipped publicly** |
| [47](/program/arc-5/phase-47/) | Prompt Engineering + Structured Outputs | 4-6 | 40-60 | Prompt as ConfigMap or custom CRD | `prism` deepens |
| [48](/program/arc-5/phase-48/) | Agent Runtime + MCP | 7-9 | 70-90 | LangGraph + MCP servers; custom CRDs for agent state | **AI-tier core complete (`prism` + `loom`)** |
| [49](/program/arc-5/phase-49/) | AI Security + AI Observability | 5-7 | 50-70 | Kyverno policies for AI; OTel + custom AI metrics | `prism` + `loom` hardened |
| [50](/program/arc-5/phase-50/) | AIOps: `warden` | 6-8 | 60-80 | Custom operator; agents reconciling incidents | **`warden` alive** |
|   | **[Arc 5 Capstone + Final Exam](/program/arc-5/final-exam/)** | 6-8 | 60-80 | vantage MVP + Pattern Paper | **`vantage` alive, basecamp v1.0.0** |
| **Total** | | **~75-99 weeks** | **~750-990 hrs** | All AI infra as operator-managed | all AI-tier modules alive |

Arc 5 is the longest arc (12 phases); the AI stack has real surface area.

---

## What ships publicly during Arc 5

| Project | Phase | Role | Launch energy |
|---|---|---|---|
| `prism` v0.1 | 46 | LLM routing + caching + observability + fallback; the production-grade LLM gateway pattern at small scale | **Loud launch**: README + examples + blog post + Hacker News + recorded talk |
| MCP servers | 48 | `mcp-chronicle`, `mcp-crag`, `mcp-ascent` exposed for agent use | Quiet ship |
| `warden` | 50 | Agents triaging incidents on basecamp using chronicle corpus | Quiet ship; the vantage launch consumes the launch energy |
| **vantage MVP** | Capstone | Web UI + command palette over every basecamp module | **THE Arc 5 launch**: full energy, blog + video + HN + LinkedIn + talks |
| **Pattern Paper** | Capstone | 3,500-5,000 word synthesis essay distilling the program | Published at the public blog; senior-IC interview artifact |

---

## Patterns deepened in Arc 5

**ML systems** (already touched in Arc 4; deepen here)

- `model-registry` to DEEP (Phase 39)
- `feature-store` to DEEP (Phase 40)
- `train-serve-skew` to DEEP (Phase 40)
- `evals` to DEEP (Phase 41 + integrated into 46 + 48)
- `drift-detection` to OUTLINE (Phase 41)

**AI/LLM systems** (new patterns)

- `vector-search` to DEEP (Phase 42)
- `embedding-store` to OUTLINE
- `rag-as-pattern` to DEEP (Phase 42)
- `llm-serving` to DEEP (Phase 43)
- `inference-optimization` to OUTLINE (Phase 44)
- `fine-tuning-strategies` to OUTLINE (Phase 45)
- `llm-routing` to DEEP (Phase 46)
- `llm-caching` to OUTLINE
- `prompt-engineering` to DEEP (Phase 47)
- `structured-outputs` to OUTLINE
- `agent-loop` to DEEP (Phase 48)
- `tool-use` to DEEP
- `mcp-protocol` to OUTLINE
- `ai-security` to OUTLINE (Phase 49)
- `ai-observability` to OUTLINE
- `aiops-agent-loop` to OUTLINE (Phase 50)

**Reinforced from prior years**

- `operator-pattern` reaches **DEEP** through Arc 5 (5 years of operating + building operators)
- `platform-as-product` reinforced via vantage
- `token-bucket-rate-limiting` reinforced (Phase 46 LLM rate limiting)

By end of Arc 5: ~60-70 patterns at OUTLINE+, ~30-40 at DEEP: the program's structural target.

---

## Hardware requirements

Arc 5 needs GPU. Recommendation:
- **Local GPU**: RTX 4060 / 4070 / 4080 or used 3090. Used 3090 is the sweet spot for fine-tuning + serving 7-13B models locally. ~$300-700.
- **Cloud GPU bursts**: Lambda Cloud, RunPod, AWS spot p3.2xlarge / g5.xlarge for short fine-tune runs or benchmarking. ~$100-300 total Arc 5.

Most of /root's Arc 5 work fits on a single 24GB GPU + cloud bursts for heavier moments.

---

## Arc 5 Final Exam + Capstone

**Scenario-based final exam + Pattern Paper deliverable**.

The Final Exam covers AI infrastructure end-to-end. The Capstone produces:
1. **vantage MVP** deployed at the public site
2. **Pattern Paper**: 3,500-5,000 words distilling the multi-arc journey

See the [full Arc 5 Final Exam + Capstone spec](/program/arc-5/final-exam/).

---

## Arc 5 graduation

```
You can:
- Operate ML lifecycle (registry, feature store, evals) at production depth
- Operate the LLM serving stack (vLLM, KServe, quantization, fine-tuning)
- Ship a working LLM gateway (routing, caching, observability, fallback)
- Build agents with proper tool-use, structured outputs, safety
- Defend AI security posture (prompt injection, capability allowlisting)
- Run AIOps agents that operate the platform from its own telemetry
- Build a product surface (vantage MVP) over infrastructure
- Write the synthesis paper that turns 5 years of work into a 20-minute read

The capstone artifact:
- basecamp public on GitHub (all 8 modules alive across multi-cloud)
- 9 OSS projects: sift, pulse, beacon, forge, ascent + custom operator, crag umbrella, prism, MCP servers, vantage
- chronicle: ~250 weekly logs, ~25 postmortems, ~140 runbooks, ~15 ADRs
- ~60-70 patterns at OUTLINE+, ~30-40 at DEEP
- root.abukix.dev (or whatever public site you deploy to): blog with ~250 posts, /talks/ with 5+ recorded talks, /capstone/ with the Pattern Paper
- Senior-IC interview portfolio: complete

Exit ramp: ML Platform / AI Infrastructure at frontier labs
Confidence: real, with end-to-end AI platform K8s-native at homelab scale
```

→ The program completes. What's next is the deferred work: vantage v1 (multi-tenant), production-scale AIOps, whatever specialization the next employer enables. Welcome to the senior tier.

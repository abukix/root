---
title: "LLM Gateway: ship prism"
description: "Phase 46 of /root Arc 5: an LLM gateway with model routing, response caching (exact + semantic), observability, rate limiting, fallback chains. Ship prism publicly as the year-defining OSS launch. The production-grade LLM-gateway pattern at homelab scale.."
tags: [arc-5, ai, llm, gateway, projects]
arc: 5
phase: 46
---

> Eighth phase of Arc 5. The LLM layer of the platform.
> Ship `prism`: the LLM gateway module. **The Arc 5 loud launch (other than vantage).**

By 2026 most production applications that touch LLMs need *a gateway in front of the model*. Rate-limit upstream APIs. Cache responses. Observe usage. Route between models. Fall back when a primary fails. Redact secrets. Enforce content policies. Every serious org runs some variant; every frontier AI lab builds an internal one.

By phase end `prism` is shipped publicly. It runs locally against vLLM (Phase 43) + Anthropic / OpenAI APIs. Production-shape: routing rules, semantic caching, rate limiting with token-bucket, fallback chains, OTel observability, eval integration. It is the homelab-scale equivalent of the production LLM gateways frontier labs deploy internally.

---

## Prerequisites

> - All Arc 5 Phase 39-45 complete
> - vLLM operational on basecamp
> - Anthropic + OpenAI API keys with $5-10 of credit
> - Go fluency (Arc 1 Phase 4)
> - You accept: **you are not building a tutorial. You are building production-grade infrastructure that mirrors what frontier labs run.**

---

## Why this phase exists

`prism` is the year's main OSS launch (vantage's at year-end). It's the artifact that demonstrates you can build the infrastructure frontier labs need: the L7 reverse proxy specialized for LLM traffic.

---

## The pattern-first frame

Same eight steps.

---

## 1. PROBLEM

You have services that call LLMs. The LLMs may be local (vLLM), API (Anthropic, OpenAI), or both. You want one internal interface, rate limits enforced, cache for identical requests, observability (per-model latency + cost), routing rules (small model for cheap queries; large for complex; A/B; failover), fallback chains, policy hooks (PII redaction, output filtering).

---

## 2. PRINCIPLES

### 2.1 LLM routing

Route by query characteristics. Cheap small model for simple; large for complex; specific models for specific tasks (Claude for reasoning, GPT for code).

→ Pattern: `llm-routing`: **DEEP target this phase**

**Investigate:**
- What does "the right model" mean (latency, cost, capability, modality)?
- Rule-based vs ML-based vs LLM-based classification?
- When does routing add more latency than it saves?

### 2.2 LLM caching

Identical requests → identical responses. Semantic caching: fuzzy match input similarity.

→ Pattern: `llm-caching`

**Investigate:**
- Why is `temperature=0` not sufficient for determinism?
- Walk semantic caching: embed prompt → vector retrieval → return cached response if similarity > threshold.
- When does semantic caching cause subtle bugs (paraphrase returns wrong cached answer)?

### 2.3 Token-bucket rate limiting

Arc 2 Phase 16 introduced token-bucket. Reinforced here at the LLM layer: per-API-key, per-model, per-tenant buckets stack.

→ Pattern: `token-bucket-rate-limiting` reinforced toward DEEP

**Investigate:**
- Walk LLM-specific rate limiting: not just "requests per minute" but "completion tokens per minute."
- How do you handle in-flight requests when the bucket drains?
- When do you reach for distributed rate limiting (Redis cell)?

### 2.4 Fallback chains

Primary fails → secondary tries → tertiary. Each fallback has a delay budget + cost cap.

**Investigate:**
- Walk a fallback chain: vLLM → Anthropic → OpenAI. What triggers each step?
- How do you avoid cascading failure when secondary is also overloaded?
- When does a circuit breaker per-upstream save the gateway?

### 2.5 Prompt engineering as infrastructure

Prompts have versions. They live in code or CRDs. They're tested. The gateway serves prompts (prompt-as-a-resource).

→ Pattern: `prompt-engineering`: DEEP target

**Investigate:**
- What's a prompt template vs a prompt vs a system prompt vs a user prompt?
- Why does Anthropic's tool-use schema differ subtly from OpenAI's? How does the gateway abstract?
- When does structured-output enforcement become essential?

### 2.6 LLM observability + evals

Metrics per model: latency, p99, tokens, cost. Traces per request. Eval integration: golden set runs scheduled.

→ Pattern: `evals` reinforced

**Investigate:**
- Difference between observability (production monitoring) and evals (quality measurement)?
- How do you eval "the right model was picked" with fuzzy ground truth?
- LLM-as-judge eval failure modes (length bias, position bias, self-preference)?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Build vs adopt | **Custom Go**; LiteLLM (OSS); Portkey | Custom: max control, your time (recommended for portfolio). LiteLLM: rich. Portkey: managed. |
| Cache backend | Redis (exact) + pgvector (semantic); in-memory; LangChain cache | Redis + pgvector: pragmatic (recommended). In-memory: simple, no multi-instance. |
| Routing | Rule-based; classifier model; LLM-as-router | Rules: simple, predictable (start). Classifier: data-driven. LLM-as-router: flexible. |
| Deployment | Flux + Helm + K8s; standalone binary; serverless | K8s (recommended; composes with rest of basecamp). |

---

## 4. TOOLS (as of 2026-06)

- **Go** (Arc 1 Phase 4 fluency): the gateway is a Go service
- **vLLM** (Arc 5 Phase 43): local model
- **Anthropic + OpenAI SDKs**
- **Redis** + **pgvector**: exact + semantic cache
- **OpenTelemetry**: observability
- **Promptfoo** or **Inspect**: evals

### Reading
- Anthropic + OpenAI API docs (current)
- "AI Engineering" (Chip Huyen): Ch. on evals
- LiteLLM source (read for routing patterns)

---

## 5. MASTERY: Ship `prism`

### 5.1 What it is

A Go service:
- Unified HTTP API (OpenAI-compatible + Anthropic-compatible endpoints)
- Routes to: local vLLM, Anthropic API, OpenAI API
- Caches identical + semantic-similar (Redis + pgvector)
- Rate-limits per-tenant + per-model with token-bucket
- Falls back through configured chains on error
- Emits OTel traces + Prometheus metrics
- Content policy hooks (PII redaction, output filter)

### 5.2 Ship bar

- Public GitHub repo; tests + CI; README with architecture diagram
- Helm chart deployable on basecamp via Flux
- Demo configs: "free tier" (cache-heavy + small model first), "premium" (large model first, no cache)
- **Blog post on the public site**: "Building an LLM gateway from primitives"
- **Hacker News submission**
- 1+ external user

Volume: ~3000-6000 lines of Go + Helm + tests. Time: 50-70 hrs.

### 5.3 Operational depth checklist

```
[ ] vLLM running locally; Anthropic + OpenAI clients integrated
[ ] Exact cache (Redis): verify hit on repeated identical request
[ ] Semantic cache (pgvector): verify hit on paraphrased prompt
[ ] Token-bucket rate limiter per tenant + per model
[ ] Fallback chain: vLLM → Anthropic → OpenAI; force vLLM failure, observe failover
[ ] OTel traces in Grafana; per-request decision history
[ ] One eval suite: 20 golden prompts scored
[ ] Content policy hook: redact emails before sending upstream
[ ] Deploy via ascent + Flux on basecamp
[ ] Public launch: blog + Hacker News
```

---

## 6. COMPARE: LiteLLM

Run LiteLLM in parallel for the same use case. Reflect on differences.

400-word reflection.

---

## 7. OPERATE

- 4-5 runbooks: rate-limit storm, cache thrash, fallback cascading, eval regression, vLLM OOM
- 2-3 ADRs (Go over Python; pgvector for semantic cache)
- Weekly log

---

## 8. CONTRIBUTE

- LiteLLM: fixes
- Promptfoo / Inspect
- vLLM: small fixes

---

## What ships from this phase

- **[`prism`](/projects/prism/plan/) v0.1**: public, launched. **`prism` v0, the AI tier begins.**
- basecamp services route through it
- Blog post + Hacker News submission

---

## Validation criteria

```
[ ] prism v0.1 shipped publicly (GitHub + Helm + blog + HN + ≥1 external user)
[ ] basecamp services route through gateway
[ ] All 10 operational depth checks
[ ] LiteLLM compare (400 words)
[ ] 4-5 LLM runbooks
[ ] 2-3 ADRs
[ ] Pattern entries:
    - llm-routing → DEEP
    - llm-caching → OUTLINE
    - token-bucket-rate-limiting reinforced toward DEEP
    - prompt-engineering → DEEP target (Phase 47 deepens)
    - evals reinforced
[ ] Exit Test passed
```

---

## Exit Test

**Time: 3.5 hours.**

### Part 1: Build (120 min)
Add a new feature: prompt-as-a-resource endpoint. Versioned prompts. Test client pull + use. Deploy to basecamp.

### Part 2: Diagnose (60 min)
A gateway scenario (e.g., "5xx rate jumped 8%"). Possible: rate limit exhausted; cache backend saturated; fallback hitting dead model; OTel blocking hot path.

### Part 3: Articulate (30 min)
~1000 words: *"Defend building prism from primitives over adopting LiteLLM. Cite routing fidelity, caching strategy, observability, fallback under outage."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Building gateway in Python | Go's concurrency model fits; LLMs are upstream, you're infra |
| Skipping eval suite | "Later" = "never"; ship with 20 prompts in suite |
| Semantic cache without measuring poisoning rate | Fuzzy cache silently wrong = worse than no cache |
| Rate limiting only request count | Token-cost rate limiting controls cost |

---

## Patterns touched this phase

- `llm-routing`: **DEEP**
- `llm-caching`: OUTLINE
- `token-bucket-rate-limiting` reinforced toward DEEP
- `prompt-engineering`: target DEEP (next phase deepens)
- `evals` reinforced

---

→ Next: [Phase 47: Prompt Engineering + Structured Outputs](/program/arc-5/phase-47/)

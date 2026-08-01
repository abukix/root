---
title: "AI Security + AI Observability"
description: "Phase 49 of /root Arc 5: AI as a new attack surface. Prompt injection defense, capability allowlisting, output filtering, signed model verification. AI-specific observability (token tracking, agent traces, eval drift). Kyverno policies for AI.."
tags: [arc-5, ai, security, observability]
arc: 5
phase: 49
---

> Eleventh phase of Arc 5. The AI attack surface gets defended.

The AI-tier surface (`prism` LLM gateway + `loom` agent runtime + MCP) is the new attack surface. Prompt injection. Jailbreaks. Output exfiltration. Indirect prompt injection through retrieved content. Capability escalation through tool use. This phase installs the defenses. Plus AI-specific observability: token tracking, agent traces, eval drift, cost attribution per-model.

By phase end basecamp.s AI tier (`prism` + `loom`) is hardened: Kyverno policies enforce agent + LLM constraints, OTel custom metrics track AI-specific signals, the AI security threat model is documented.

---

## Prerequisites

> - [Phase 48](/program/arc-5/phase-48/) complete; agents + MCP operational

---

## Why this phase exists

AI security is a moving target in 2026. The attacks evolve weekly. The defenses are partial. Senior engineers don't solve AI security; they reason about the threat model and apply layered defenses. This phase installs the *thinking* and the operational practices.

---

## The pattern-first frame

Same eight steps.

---

## 1. PROBLEM

Your AI surface, LLM gateway + agent runtime + MCP servers, has attack vectors that don't exist in classical infrastructure. Prompts can override instructions. Retrieved content can hide adversarial inputs. Tools can be misused. You need defenses at multiple layers and visibility into what's happening.

---

## 2. PRINCIPLES

### 2.1 Prompt injection: the canonical AI attack

Attacker provides input that overrides the system prompt's instructions. "Ignore previous instructions and..." Variants: indirect injection (in retrieved content), jailbreaks (creative reframing).

→ Pattern: `ai-security`: OUTLINE this phase

**Investigate:**
- Walk a direct prompt injection: user input contains "ignore prior instructions, instead..."
- What's indirect injection? (Hint: malicious content in a webpage the agent retrieves.)
- What are the canonical defenses (instruction-data separation, output filters, capability allowlisting)?

### 2.2 Capability allowlisting

Agents only call tools in their explicit allowlist. The MCP server doesn't expose tools to clients that aren't authorized.

**Investigate:**
- Walk an allowlist enforcement at MCP server level.
- Why is allowlist-by-default safer than "all tools available"?
- How does this compose with K8s RBAC?

### 2.3 Output filtering

After the model generates a response, run it through filters: PII redaction, content policy (refusals), structured output validation, length limits.

**Investigate:**
- What categories of output need filtering? (PII, sensitive data, refusal categories, etc.)
- When do output filters introduce latency that hurts UX?
- How do you measure filter false-positive rate?

### 2.4 Signed model verification

In a multi-tenant setting, the model artifact must be trusted. Sigstore-style signing + verification at deploy time.

**Investigate:**
- Walk a Sigstore-signed model: who signs, what's signed, who verifies?
- Why does this matter when models come from untrusted sources?
- How does this compose with KServe ServingRuntime?

### 2.5 AI observability: beyond the three pillars

Tokens per request, KV cache hit rate, model selection distribution, prompt template usage, agent trajectory traces, eval pass-rate over time.

→ Pattern: `ai-observability`: OUTLINE

**Investigate:**
- For an agent: what's a "trajectory" trace? What metrics would surface a regression?
- How do you cost-attribute per tenant + per model?
- When is eval drift the leading indicator vs the lagging?

### 2.6 K8s-native AI policies via Kyverno

Kyverno (Phase 27) extends naturally to AI: "every InferenceService must reference a signed model," "every agent Workload must define a capability allowlist," "every prompt template must reference a versioned prompt."

→ Pattern: `policy-as-code` reinforced

**Investigate:**
- Walk a Kyverno ClusterPolicy enforcing "no agent Workload without an allowlist."
- How do you write a Kyverno policy that validates structured-output JSON schema?
- What policies belong at the platform layer vs the application?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Prompt injection defense | Instruction-data separation; output filters; LLM-as-detector; layered | Layered (recommended); single layer insufficient. |
| Capability allowlist | Per-agent; per-tool; per-tenant | Per-agent (recommended) + per-tenant scoping. |
| AI observability | Custom OTel attrs; specialized tools (LangSmith); both | OTel for foundation; specialized when needed. |
| Model signing | Sigstore; cosign; none | Sigstore (recommended); none = blind trust. |

---

## 4. TOOLS (as of 2026-06)

- **Sigstore / cosign**: model signing
- **Kyverno**: policy-as-code
- **OpenTelemetry** with custom AI attributes
- **PII detection libraries** (presidio, OpenAI moderation API)
- **Promptfoo / Inspect**: eval drift detection

### Reading
- OWASP Top 10 for LLM Applications
- "Adversarial AI Attacks": current state-of-the-art papers
- Anthropic + OpenAI safety documentation

---

## 5. MASTERY: Hardened AI tier

```
[ ] Prompt injection test suite: 30+ adversarial inputs against basecamp agents
[ ] Defenses hold for at least 80% of injection attempts
[ ] Capability allowlist enforced at MCP server level
[ ] Output filter: PII redaction + content policy + structured-output validation
[ ] Sigstore model signing pipeline for one model
[ ] Kyverno policies for AI: signed-model required, capability-allowlist required
[ ] AI-specific OTel attributes: model name, prompt version, agent ID, tokens
[ ] Eval drift dashboard: pass-rate over time per prompt
[ ] Cost attribution dashboard: tokens × $/token per tenant per model
[ ] AI threat model document for basecamp
```

---

## 6. COMPARE: Anthropic Constitutional AI

Read Anthropic's Constitutional AI papers. Reflect on what it brings beyond basic safety classifiers.

400-word reflection.

---

## 7. OPERATE

- 4-5 runbooks: prompt injection alert, capability escalation attempt, eval drift, PII leakage, signed-model verification failure
- 2-3 ADRs (defense-in-depth for prompt injection; Sigstore for models; per-agent allowlists)
- Weekly log

---

## 8. CONTRIBUTE

- OWASP LLM project
- A blog post on a real prompt-injection defense pattern
- Kyverno AI policies (contribute to community)

---

## What ships from this phase

- **AI tier hardened**: prompt injection defenses + capability allowlisting + output filtering + signed models + AI observability
- **AI threat model document**
- **AI security runbooks**

---

## Validation criteria

```
[ ] Prompt injection test suite (80%+ defended)
[ ] Capability allowlists enforced
[ ] Output filtering operational
[ ] Sigstore signing for at least one model
[ ] Kyverno AI policies operational
[ ] AI observability custom metrics in Prometheus + traces in Tempo
[ ] All 10 operational depth checks
[ ] Compare reflection (400 words)
[ ] 4-5 runbooks
[ ] 2-3 ADRs
[ ] Pattern entries:
    - ai-security → OUTLINE
    - ai-observability → OUTLINE
    - policy-as-code reinforced
[ ] Exit Test passed
```

---

## Exit Test

**Time: 2.5 hours.**

### Part 1: Build (75 min)
Add a new prompt injection defense to one basecamp agent. Add eval cases that test it. Verify.

### Part 2: Diagnose (45 min)
An AI security scenario (e.g., "agent unexpectedly called a tool not in its allowlist"). Investigate root cause.

### Part 3: Articulate (30 min)
~600 words: *"Walk basecamp's AI threat model. Top attack vectors, defenses at each layer, what remains uncovered, what you'd add with infinite security budget."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Trusting model output blindly | Output filters catch what models miss |
| Single-layer defense | One defense fails = full compromise |
| No eval drift monitoring | Quality degrades silently |
| Allowing arbitrary tool use | Capability escalation by design |

---

## Patterns touched this phase

- `ai-security`: OUTLINE
- `ai-observability`: OUTLINE
- `policy-as-code` reinforced

---

→ Next: [Phase 50: AIOps: warden](/program/arc-5/phase-50/)

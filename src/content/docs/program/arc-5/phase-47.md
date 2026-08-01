---
title: "Prompt Engineering + Structured Outputs"
description: "Phase 47 of /root Arc 5: prompts as infrastructure. Versioned prompts, structured outputs (function calling, JSON schema enforcement), prompt evals. The discipline that turns 'LLM gave us garbage' into 'this prompt v3 has measured 92% structured-output validity.'."
tags: [arc-5, ai, prompts, structured-outputs]
arc: 5
phase: 47
---

> Ninth phase of Arc 5. Prompts as infrastructure.

By 2026 prompt engineering is engineering, not vibes. Prompts have versions. Versions have evals. Structured outputs (function calling, JSON schema) make LLM outputs reliable inputs to downstream code. By phase end basecamp serves versioned prompts via `prism` (Phase 46), enforces structured outputs where downstream code requires them, and evaluates prompt changes against golden sets.

This phase is shorter than the others but sits at the load-bearing junction between LLM serving (Phase 43-46) and agent runtime (Phase 48). Get this right and agents work; get it wrong and they hallucinate.

---

## Prerequisites

> - [Phase 46](/program/arc-5/phase-46/) complete; `prism` shipped

---

## Why this phase exists

Most teams treat prompts as text in a file. No version. No eval. No accountability. Senior engineers treat prompts as code: version-controlled, tested, deployable. The discipline catches regressions before users do.

---

## The pattern-first frame

Same eight steps.

---

## 1. PROBLEM

Your service has a prompt. Someone changes a word. Outputs change unpredictably. Three weeks later a user complains. You can't tell when or why the change happened. The fix: treat prompts as versioned code with eval gates.

---

## 2. PRINCIPLES

### 2.1 Prompts as versioned code

Prompts live in a repo (Git) or a managed prompt store. Each version is identified, tested, deployable. Promotion from draft → staging → production via eval gates.

→ Pattern: `prompt-engineering`: **DEEP target this phase**

**Investigate:**
- Walk a prompt's lifecycle: draft → eval → staging → production → deprecated.
- Why is "fork the prompt for the experiment" the safer pattern than "edit in place"?
- How does prompt versioning compose with the model registry (Phase 39)?

### 2.2 Structured outputs

Force the LLM to emit JSON matching a schema. OpenAI's `response_format=json_schema`, Anthropic's `tool_use` with forced output, function calling. Reliability dramatically increases for downstream code consumption.

→ Pattern: `structured-outputs`: OUTLINE

**Investigate:**
- Walk `response_format=json_schema`: schema → model output guaranteed to validate.
- Why does forced structured output sometimes degrade quality? (Constraint vs reasoning trade.)
- When do you skip (long-form natural-language answer)?

### 2.3 Prompt evals

Same eval discipline as Phase 41, applied to prompts. Golden test set, scored metrics, regression detection.

**Investigate:**
- For one of basecamp's prompts: design 20 golden test cases.
- What's a "behavioral" eval (does the prompt refuse appropriately, does it stay in scope)?
- How do you score open-ended outputs? (LLM-as-judge from Phase 41.)

### 2.4 The prompt template hierarchy

System prompt (persona, constraints) + retrieved context (RAG) + user prompt + assistant prompt (multi-turn). Each layer composes.

**Investigate:**
- Walk a multi-turn prompt: system + retrieved context + user1 + assistant1 + user2.
- Why is system prompt placement (top, bottom) sometimes consequential?
- When does the assistant's prior turn get truncated, and what does that break?

### 2.5 Few-shot vs zero-shot

Few-shot: include examples in the prompt. Zero-shot: just instruction. Few-shot usually wins quality at moderate token cost.

**Investigate:**
- For a classification task: zero-shot, few-shot, fine-tuned. Cost-quality curve?
- When does adding more examples plateau?
- Why does example *diversity* often matter more than example *count*?

### 2.6 Prompt-as-a-resource

`prism` (Phase 46) serves prompts: clients pull `prompt://name@version`. Updating the prompt without redeploying clients.

**Investigate:**
- Walk a prompt-fetch flow: client requests `prompt://summarize@v3` → gateway returns text.
- How does this compose with caching?
- Why is "prompts as data, not code" the operational unlock at platform scale?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Storage | Git-managed YAML files in basecamp; ConfigMap; custom CRD; LangSmith | Git: K8s-native, simple (recommended). ConfigMap: K8s-native. CRD: maximum integration. LangSmith: managed. |
| Structured output | Forced schema (response_format); tool-use forced; prompt-based "respond in JSON" | Forced schema: most reliable. Tool-use: works for many APIs. Prompt-based: weakest. |
| Eval framework | Promptfoo; Inspect; custom | Promptfoo: OSS, simple. Inspect: richer. |
| Versioning | Git-managed semver; date-based; auto-versioned | Semver: explicit. Date: simple, less discipline. Auto: prompts as deployments. |

---

## 4. TOOLS (as of 2026-06)

- **Promptfoo** or **Inspect**: eval framework
- **`prism`**: prompt-as-resource service (Phase 46)
- **Git**: prompt storage

### Reading
- "Prompt Engineering for Generative AI" (Phoenix, Cassidy, Cohen)
- Anthropic + OpenAI prompt guides (canonical references)
- Eugene Yan's blog on LLM evals + prompts

---

## 5. MASTERY: Prompts as infrastructure on basecamp

```
[ ] Move basecamp's prompts to a Git repo with versioned files
[ ] `prism` (Phase 46) extended to serve prompt://name@version
[ ] Golden eval set for 3 prompts (20 cases each)
[ ] Promotion CI: PR edits prompt → eval runs → diff vs production → manual gate to promote
[ ] Enforce structured outputs on at least 3 downstream-consuming prompts
[ ] Document the prompt format hierarchy (system + retrieved + user) for basecamp
[ ] Add eval CronWorkflow: weekly eval against production prompts
[ ] Add prompt rotation/deprecation runbook
[ ] Reflect on which prompts are working / failing in practice
[ ] Document "prompt anti-patterns we caught" for the chronicle
```

---

## 6. COMPARE: LangSmith

Sign up; track one prompt experiment. Compare against Git+Promptfoo.

400-word reflection.

---

## 7. OPERATE

- 2-3 runbooks: prompt regression, structured output validation failure, eval drift
- 1-2 ADRs (Git-managed prompts; structured output requirement)
- Weekly log

---

## 8. CONTRIBUTE

- Promptfoo / Inspect: eval definitions
- A public-facing "prompt anti-patterns" blog post

---

## What ships from this phase

- **Prompts as versioned, eval-gated artifacts** in basecamp
- **`prism` extension**: prompt-as-resource API
- **Prompt eval suite** running weekly

---

## Validation criteria

```
[ ] Prompts versioned in Git
[ ] Eval suite for 3 prompts with 20 cases each
[ ] Promotion CI gating prompt changes
[ ] Structured outputs enforced on downstream-consuming prompts
[ ] All 10 operational depth checks
[ ] Compare reflection (400 words)
[ ] 2-3 runbooks
[ ] 1-2 ADRs
[ ] Pattern entries:
    - prompt-engineering → DEEP
    - structured-outputs → OUTLINE
[ ] Exit Test passed
```

---

## Exit Test

**Time: 1.5 hours.**

### Part 1: Build (60 min)
Add a new prompt to basecamp's repo with proper versioning. Write 20 eval cases. Run; iterate prompt until 90%+ pass.

### Part 2: Articulate (30 min)
~600 words: *"Walk the lifecycle of a prompt in basecamp: from someone writing 'we need an X feature' to that prompt serving production traffic with evals + monitoring."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Edit prompts in production code | Untracked, untested, regressions silent |
| No eval suite for prompts | Quality drifts without notice |
| Skipping structured outputs when downstream needs reliability | 5-10% of outputs malformed = production bugs |
| Treating prompts as "soft" | Operationally they're as load-bearing as code |

---

## Patterns touched this phase

- `prompt-engineering`: **DEEP**
- `structured-outputs`: OUTLINE

---

→ Next: [Phase 48: Agent Runtime + MCP](/program/arc-5/phase-48/)
